import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Polls `fetcher` on an interval while the tab is visible.
 * Returns { data, error, loading, refreshedAt, refresh }.
 */
export function useLiveData(fetcher, intervalMs = 4000) {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [refreshedAt, setRefreshedAt] = useState(null)
  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  const refresh = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    try {
      const next = await fetcherRef.current()
      setData(next)
      setError('')
      setRefreshedAt(new Date())
    } catch (e) {
      setError(e.message === 'NETWORK_ERROR' ? 'API unreachable — is the backend running on :8080?' : e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh(false)
    const id = setInterval(() => {
      if (document.visibilityState === 'visible') refresh(true)
    }, intervalMs)
    return () => clearInterval(id)
  }, [refresh, intervalMs])

  return { data, error, loading, refreshedAt, refresh }
}
