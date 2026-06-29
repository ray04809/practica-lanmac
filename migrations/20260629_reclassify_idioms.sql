-- RUN THIS IN SUPABASE SQL EDITOR
-- =====================================================
-- FIX 3: Reclassify idioms incorrectly tagged as A1/A2
--
-- Audit finding (2026-06-29): The practice DB contains idiom
-- exercises tagged at A1/A2 levels, but idiomatic expressions
-- are typically B1+ content (CEFR descriptors mention idiomatic
-- competence starting at B2). This migration moves them up.
-- =====================================================

-- 1. Surgical fix: explicit idioms that should be B2
UPDATE web_site.practice_exercises
SET cefr_level = 'B2'
WHERE skill = 'idioms'
  AND cefr_level IN ('A1', 'A2')
  AND (
    prompt ILIKE '%kicked%bucket%'
    OR prompt ILIKE '%chip%shoulder%'
    OR prompt ILIKE '%hit%nail%on%head%'
    OR prompt ILIKE '%count%chickens%'
    OR prompt ILIKE '%spill%beans%'
    OR prompt ILIKE '%break%leg%'
    OR prompt ILIKE '%piece%cake%'
    OR prompt ILIKE '%under%weather%'
    OR prompt ILIKE '%cold%feet%'
    OR prompt ILIKE '%let%cat%out%'
  );

-- 2. Broader sweep: any idiom in A1 is suspicious → B2
UPDATE web_site.practice_exercises
SET cefr_level = 'B2'
WHERE skill = 'idioms' AND cefr_level = 'A1';

-- 3. A2 idioms → B1 (most idioms are first appropriate at B1+)
UPDATE web_site.practice_exercises
SET cefr_level = 'B1'
WHERE skill = 'idioms' AND cefr_level = 'A2';
