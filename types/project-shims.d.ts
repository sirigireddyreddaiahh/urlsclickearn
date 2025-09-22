// Temporary permissive shims to unblock type-checking. Replace with proper types later.

declare global {
  // Vue helpers
  const watch: any
  type InjectionKey<T = any> = symbol

  // Nuxt helpers (auto-imported at runtime)
  function defineNuxtRouteMiddleware(handler: (to: any) => any): any
  function navigateTo(url: string): any
  function defineAppConfig<T = any>(config: T): T
  function useAPI(path: string, opts?: any): Promise<any>
  function useStorage(name: string): any
  function useAppConfig(event?: any): any
  function useRuntimeConfig(event?: any): any

  // Project helpers
  function getExpiration(event: any, expiration?: any): any
  function date2unix(s: any): number
  function hubAnalytics(): { put: (obj: any) => Promise<any> }
  function shortTime(d: any): string
}

// Module shims for unresolved imports
declare module '~/composables' {
  export const FORM_ITEM_INJECTION_KEY: any
  export const useAPI: any
  export function useAuth(): any
  export const FORM_ITEM_INJECTION_KEY_SILENT: any
  export default any
}

declare module '~/utils/time' {
  export function date2unix(s: any): number
  export function getValidatedDate(s: any): any
  export default any
}

declare module '@/utils/flag' {
  export function getFlag(name: string): any
}

// Minimal user types used across server/utils/users-file.ts
declare global {
  interface UserRecord {
    id: string
    email?: string
    passwordHash?: string
    verified?: boolean
    createdAt?: string
    updatedAt?: string
    metadata?: Record<string, any>
  }

  interface UserProfile {
    id?: string
    email?: string
    name?: string
  }
}

declare module 'ua-parser-js/extensions' {
  const whatever: any
  export default whatever
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<{}, {}, any>
  export default component
}

export {}
