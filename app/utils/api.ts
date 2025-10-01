import { defu } from 'defu'
import { toast } from 'vue-sonner'

export function useAPI(api: string, options?: object): Promise<unknown> {
  return $fetch(api, defu(options || {}, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('SinkSiteToken') || ''}`,
    },
  })).catch((error) => {
    const err = error as any
    if (err?.status === 401) {
      localStorage.removeItem('SinkSiteToken')
      navigateTo('/dashboard/auth/login')
    }
    if (err?.data?.statusMessage) {
      toast(err?.data?.statusMessage)
    }
    return Promise.reject(err)
  })
}

