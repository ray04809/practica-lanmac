-- RUN THIS IN SUPABASE SQL EDITOR
-- =====================================================
-- FIX 5: convert_practice_user_to_lead now actually INSERTS
-- into web_site.leads (previously only flipped a flag).
--
-- Notes:
--  - This function is SECURITY DEFINER so it can write across
--    schemas while being callable from anon clients via RPC.
--  - It tolerates the absence of a unique constraint on email
--    by using a defensive UPDATE-then-INSERT pattern instead of
--    UPSERT.
-- =====================================================

CREATE OR REPLACE FUNCTION public.convert_practice_user_to_lead(
  p_user_id uuid,
  p_email text,
  p_phone text DEFAULT NULL,
  p_name text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, web_site
AS $$
DECLARE
  v_lead_id uuid;
  v_existing_email text;
BEGIN
  -- 1) Flip the practice_user flag and store contact info
  UPDATE web_site.practice_users
  SET converted_to_lead = true,
      email = COALESCE(p_email, email),
      phone = COALESCE(p_phone, phone),
      full_name = COALESCE(p_name, full_name)
  WHERE id = p_user_id;

  -- 2) Look for an existing lead with this email (case-insensitive)
  SELECT id INTO v_lead_id
  FROM web_site.leads
  WHERE LOWER(email) = LOWER(p_email)
  LIMIT 1;

  IF v_lead_id IS NULL THEN
    -- Create new lead
    INSERT INTO web_site.leads (
      name, email, phone, source, source_detail, created_at, status
    )
    VALUES (
      COALESCE(p_name, 'Usuario de práctica'),
      p_email,
      p_phone,
      'practica',
      'placement_test',
      NOW(),
      'new'
    )
    RETURNING id INTO v_lead_id;
  ELSE
    -- Update existing lead with the new info we just got
    UPDATE web_site.leads
    SET name = COALESCE(NULLIF(p_name, ''), name),
        phone = COALESCE(NULLIF(p_phone, ''), phone),
        updated_at = NOW()
    WHERE id = v_lead_id;
  END IF;

  -- 3) Log lead event (best-effort — don't fail if table is missing)
  BEGIN
    INSERT INTO web_site.lead_events (practice_user_id, lead_id, event_type, occurred_at)
    VALUES (p_user_id, v_lead_id, 'converted_from_practice', NOW());
  EXCEPTION WHEN undefined_table THEN
    -- lead_events table doesn't exist yet — skip silently
    NULL;
  END;

  RETURN v_lead_id;
END;
$$;

-- Make sure anon/authenticated can call the RPC
GRANT EXECUTE ON FUNCTION public.convert_practice_user_to_lead(uuid, text, text, text)
  TO anon, authenticated;
