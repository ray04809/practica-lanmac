/**
 * generate-listening-audio.ts
 *
 * Generates real MP3 audio for every "listening" / "listen_choose" exercise
 * in web_site.practice_exercises that doesn't already have an audio_url,
 * using OpenAI's TTS-HD model. Uploads the file to Supabase Storage and
 * updates the row with the resulting public URL.
 *
 * Why: the practica-lanmac UI currently falls back to SpeechSynthesisUtterance
 * (browser TTS), which sounds robotic and is not consistent across devices.
 * Pre-generated MP3s give a uniform listening experience.
 *
 * Run:
 *   OPENAI_API_KEY=sk-... \
 *   SUPABASE_URL=https://yajffqwswvxxdrkdybip.supabase.co \
 *   SUPABASE_SERVICE_KEY=eyJ...your-service-role-key... \
 *   tsx scripts/generate-listening-audio.ts
 *
 * Dependencies: tsx + @supabase/supabase-js (already in package.json).
 *
 * Storage bucket: `practice-audio` (must exist, public read).
 * Path inside bucket: `listening/{exercise.id}.mp3`
 */

import { createClient } from '@supabase/supabase-js'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY

if (!OPENAI_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing env vars. Required: OPENAI_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY')
  process.exit(1)
}

const BUCKET = 'practice-audio'
const TTS_MODEL = 'tts-1-hd'
const TTS_VOICE = 'nova'
const RATE_LIMIT_MS = 500

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  db: { schema: 'web_site' },
  auth: { persistSession: false },
})

interface ExerciseRow {
  id: string
  prompt: string
  correct_answer: string | null
  skill: string | null
  exercise_type: string | null
  audio_url: string | null
}

async function fetchExercises(): Promise<ExerciseRow[]> {
  const { data, error } = await supabase
    .from('practice_exercises')
    .select('id, prompt, correct_answer, skill, exercise_type, audio_url')
    .or('skill.eq.listening,exercise_type.eq.listen_choose')
    .is('audio_url', null)
    .order('id', { ascending: true })

  if (error) throw error
  return (data || []) as ExerciseRow[]
}

async function generateTTS(text: string): Promise<ArrayBuffer> {
  const res = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: TTS_MODEL,
      voice: TTS_VOICE,
      input: text,
      response_format: 'mp3',
    }),
  })

  if (!res.ok) {
    const errText = await res.text().catch(() => '')
    throw new Error(`OpenAI TTS error ${res.status}: ${errText.substring(0, 300)}`)
  }

  return await res.arrayBuffer()
}

async function uploadToStorage(exerciseId: string, mp3: ArrayBuffer): Promise<string> {
  const path = `listening/${exerciseId}.mp3`
  // Use the storage client on the public schema (storage API is schema-less)
  const storageClient = createClient(SUPABASE_URL!, SUPABASE_SERVICE_KEY!, {
    auth: { persistSession: false },
  })

  const { error: upErr } = await storageClient.storage
    .from(BUCKET)
    .upload(path, mp3, {
      contentType: 'audio/mpeg',
      upsert: true,
    })

  if (upErr) throw upErr

  const { data } = storageClient.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

async function updateExerciseAudioUrl(exerciseId: string, url: string): Promise<void> {
  const { error } = await supabase
    .from('practice_exercises')
    .update({ audio_url: url })
    .eq('id', exerciseId)

  if (error) throw error
}

function pickTextForTTS(ex: ExerciseRow): string {
  // For listen_choose the prompt is the listening text itself.
  // For true_false / multiple_choice with skill=listening, the correct_answer
  // is often the spoken phrase; fall back to prompt otherwise.
  if (ex.exercise_type === 'listen_choose') return ex.prompt
  if (ex.skill === 'listening' && ex.correct_answer) return ex.correct_answer
  return ex.prompt
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function main() {
  console.log('Fetching exercises that need audio...')
  const exercises = await fetchExercises()
  console.log(`Found ${exercises.length} exercise(s) to process.`)

  let ok = 0
  let failed = 0

  for (let i = 0; i < exercises.length; i++) {
    const ex = exercises[i]
    const text = pickTextForTTS(ex)
    const label = `[${i + 1}/${exercises.length}] ${ex.id.substring(0, 8)}`

    try {
      console.log(`${label} → generating: "${text.substring(0, 60)}${text.length > 60 ? '...' : ''}"`)
      const mp3 = await generateTTS(text)
      const url = await uploadToStorage(ex.id, mp3)
      await updateExerciseAudioUrl(ex.id, url)
      console.log(`${label} ✓ ${url}`)
      ok++
    } catch (err) {
      console.error(`${label} ✗ ${err instanceof Error ? err.message : String(err)}`)
      failed++
    }

    if (i < exercises.length - 1) {
      await sleep(RATE_LIMIT_MS)
    }
  }

  console.log(`\nDone. Success: ${ok}, Failed: ${failed}`)
  if (failed > 0) process.exitCode = 1
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
