import { supabase } from './supabase'
import type { PracticeUser, Exercise, SubmitResult, SessionResult, CefrLevel } from './types'

export async function getOrCreateUser(
  fingerprint: string,
  source?: string,
  utmSource?: string,
  utmMedium?: string,
  utmCampaign?: string
): Promise<PracticeUser> {
  const { data, error } = await supabase.rpc('get_or_create_practice_user', {
    p_fingerprint: fingerprint,
    p_source: source ?? null,
    p_utm_source: utmSource ?? null,
    p_utm_medium: utmMedium ?? null,
    p_utm_campaign: utmCampaign ?? null,
    p_device_type: /Mobi/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
  })
  if (error) throw error
  return data as PracticeUser
}

export async function getExercises(
  cefr: CefrLevel,
  skill?: string,
  limit = 10,
  excludeIds: string[] = []
): Promise<Exercise[]> {
  const { data, error } = await supabase.rpc('get_practice_exercises', {
    p_cefr: cefr,
    p_skill: skill ?? null,
    p_limit: limit,
    p_exclude_ids: excludeIds,
  })
  if (error) throw error
  return (data as Exercise[]) ?? []
}

export async function createSession(
  userId: string,
  sessionType: 'placement_test' | 'daily_practice',
  cefrLevel: CefrLevel,
  skillFocus?: string
): Promise<string> {
  const { data, error } = await supabase.rpc('create_practice_session', {
    p_user_id: userId,
    p_session_type: sessionType,
    p_cefr_level: cefrLevel,
    p_skill_focus: skillFocus ?? null,
  })
  if (error) throw error
  return (data as { id: string }).id
}

export async function submitResponse(
  sessionId: string,
  exerciseId: string,
  answer: string,
  timeMs?: number,
  speakingScore?: Record<string, unknown>
): Promise<SubmitResult> {
  const { data, error } = await supabase.rpc('submit_practice_response', {
    p_session_id: sessionId,
    p_exercise_id: exerciseId,
    p_answer: answer,
    p_time_ms: timeMs ?? null,
    p_speaking_score: speakingScore ?? null,
  })
  if (error) throw error
  return data as SubmitResult
}

export async function completeSession(
  sessionId: string,
  finalCefr?: CefrLevel
): Promise<SessionResult> {
  const { data, error } = await supabase.rpc('complete_practice_session', {
    p_session_id: sessionId,
    p_final_cefr: finalCefr ?? null,
  })
  if (error) throw error
  return data as SessionResult
}

export async function convertToLead(
  userId: string,
  name: string,
  email: string,
  phone?: string
) {
  const { data, error } = await supabase.rpc('convert_practice_user_to_lead', {
    p_user_id: userId,
    p_name: name,
    p_email: email,
    p_phone: phone ?? null,
  })
  if (error) throw error
  return data
}
