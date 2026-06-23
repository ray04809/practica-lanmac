import { useState, useEffect, useCallback } from 'react'
import { getFingerprint } from '../lib/fingerprint'
import { getOrCreateUser } from '../lib/api'
import type { PracticeUser } from '../lib/types'

export function useUser() {
  const [user, setUser] = useState<PracticeUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function init() {
      try {
        const fp = await getFingerprint()
        const params = new URLSearchParams(window.location.search)
        const u = await getOrCreateUser(
          fp,
          params.get('source') ?? undefined,
          params.get('utm_source') ?? undefined,
          params.get('utm_medium') ?? undefined,
          params.get('utm_campaign') ?? undefined
        )
        setUser(u)
      } catch (e) {
        console.error('Failed to init user:', e)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  const refresh = useCallback(async () => {
    const fp = await getFingerprint()
    const u = await getOrCreateUser(fp)
    setUser(u)
  }, [])

  return { user, loading, setUser, refresh }
}
