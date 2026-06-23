import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://yajffqwswvxxdrkdybip.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhamZmcXdzd3Z4eGRya2R5YmlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NDMzMTgsImV4cCI6MjA5MTAxOTMxOH0.mREDqSEufbHOKas3fJQqcJ1gFyIDyUVIZ1Mt1RSusR8'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  db: { schema: 'web_site' },
})
