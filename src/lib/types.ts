export type CefrLevel = 'A0' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'

export type ExerciseType = 'multiple_choice' | 'fill_blank' | 'true_false' | 'listen_choose' | 'speak_record' | 'match' | 'image_choose'

export type Skill = 'grammar' | 'vocabulary' | 'listening' | 'reading' | 'pronunciation' | 'idioms' | 'speaking'

export interface PracticeUser {
  id: string
  fingerprint: string
  detected_cefr: CefrLevel | null
  full_name: string | null
  email: string | null
  phone: string | null
  converted_to_lead: boolean
  total_sessions: number
  total_exercises: number
  total_correct: number
  current_streak: number
  best_streak: number
  last_practice_at: string | null
  is_new: boolean
}

export interface Exercise {
  id: string
  cefr_level: CefrLevel
  skill: Skill
  exercise_type: ExerciseType
  prompt: string
  prompt_es: string
  options: string[]
  correct_answer: string
  explanation: string
  explanation_es: string
  audio_url: string | null
  image_url: string | null
  difficulty: number
}

export interface SubmitResult {
  is_correct: boolean
  correct_answer: string
  explanation: string
  explanation_es: string
}

export interface SessionResult {
  session: {
    id: string
    score_percentage: number
    total_questions: number
    correct_answers: number
    cefr_result: CefrLevel
    time_spent_seconds: number
  }
  user: {
    id: string
    detected_cefr: CefrLevel
    total_exercises: number
    total_correct: number
    current_streak: number
    best_streak: number
  }
}

export const CEFR_LABELS: Record<CefrLevel, string> = {
  A0: 'Principiante',
  A1: 'Básico',
  A2: 'Elemental',
  B1: 'Intermedio',
  B2: 'Intermedio Alto',
  C1: 'Avanzado',
  C2: 'Maestría',
}

export const CEFR_COLORS: Record<CefrLevel, string> = {
  A0: '#94a3b8',
  A1: '#22c55e',
  A2: '#16a34a',
  B1: '#2563eb',
  B2: '#1d4ed8',
  C1: '#9333ea',
  C2: '#7c3aed',
}

export const NEURO_TIPS = [
  '¿Sabías? Practicar en sesiones cortas mejora la retención un 40%.',
  'Tu cerebro forma nuevas conexiones cada vez que practicas.',
  'La repetición espaciada es la clave para recordar vocabulario.',
  'Escuchar y hablar activan diferentes áreas del cerebro.',
  'Los errores son parte del aprendizaje — tu cerebro aprende más de ellos.',
  'Practicar 10 minutos diarios es más efectivo que 1 hora semanal.',
  'El sueño consolida lo que aprendiste hoy. ¡Descansa bien!',
  'Asociar palabras con imágenes mejora la memorización.',
  'Tu cerebro procesa mejor la información cuando estás relajado.',
  'Cada racha consecutiva fortalece tus redes neuronales.',
]
