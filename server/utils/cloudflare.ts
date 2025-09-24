import type { H3Event } from 'h3'

export function useWAE(event: H3Event, query: string): Promise<any> {
  const { cfAccountId, cfApiToken } = useRuntimeConfig(event) as any
  console.log('useWAE', query)
  return $fetch<any>(`https://api.cloudflare.com/client/v4/accounts/${cfAccountId}/analytics_engine/sql`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${cfApiToken}`,
    },
    body: query,
    retry: 1,
    retryDelay: 100, // ms
  })
}
