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
  function hubAnalytics(): { put: (obj: any) => Promise<any> }
  function shortTime(d: any): string
}

// Module shims for unresolved imports
// Keep these minimal. Avoid using `export default` inside `declare module` to prevent
// "Exports and export assignments are not permitted in module augmentations" errors.
declare module '~/composables' {
  export const FORM_ITEM_INJECTION_KEY: any
  export const useAPI: any
  export function useAuth(): any
  export const FORM_ITEM_INJECTION_KEY_SILENT: any
  const __shim_default__: any
}

declare module '~/utils/time' {
  const _default: any
}

declare module '@/utils/flag' {
  export function getFlag(name: string): any
}

// Minimal user types used across server/utils/users-file.ts
declare global {
  interface UserRecord {
    id: string
    email: string
    passwordHash: string
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
}

// NOTE: '*.vue' module declaration exists in other shim files; avoid duplicating it here to
// prevent duplicate identifier errors. If you need to adjust the Vue SFC typings, update
// the dedicated shims file instead.

export {}

