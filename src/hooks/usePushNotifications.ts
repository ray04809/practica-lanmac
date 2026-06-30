import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const VAPID_PUBLIC_KEY = 'BDmayu3Bcm3ehvXgWmP_ZC9hYYBgbzQtrkNamWFtuuSFqrQIyGtgoiBqtXrTdBDL9o8kVtDp7Gu7_3EZW-eUicU'

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return Uint8Array.from(rawData, (char) => char.charCodeAt(0))
}

type PushState = 'unsupported' | 'prompt' | 'subscribed' | 'denied'

export function usePushNotifications(fingerprintId: string | null) {
  const [state, setState] = useState<PushState>('unsupported')
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setState('unsupported')
      return
    }
    if (Notification.permission === 'denied') {
      setState('denied')
      return
    }
    if (localStorage.getItem('push_dismissed')) {
      setDismissed(true)
    }

    navigator.serviceWorker.ready.then(async (reg) => {
      const sub = await reg.pushManager.getSubscription()
      setState(sub ? 'subscribed' : 'prompt')
    })
  }, [])

  const subscribe = useCallback(async () => {
    if (!fingerprintId) return false
    try {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as BufferSource,
      })

      const subJson = sub.toJSON()
      await supabase.from('push_subscriptions').upsert({
        fingerprint_id: fingerprintId,
        endpoint: subJson.endpoint,
        p256dh: subJson.keys?.p256dh,
        auth: subJson.keys?.auth,
      }, { onConflict: 'endpoint' })

      setState('subscribed')
      return true
    } catch {
      setState('denied')
      return false
    }
  }, [fingerprintId])

  const dismiss = useCallback(() => {
    setDismissed(true)
    localStorage.setItem('push_dismissed', '1')
  }, [])

  const showBanner = state === 'prompt' && !dismissed && !!fingerprintId

  return { state, subscribe, dismiss, showBanner }
}
