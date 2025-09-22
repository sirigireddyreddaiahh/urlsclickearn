// Minimal shim for #app to satisfy TypeScript before Nuxt generates its types
declare module '#app' {
  export function useRuntimeConfig(event?: any): any
  export function useState<T = any>(key: string, init?: T | (() => T)): {
    value: T
  }
}
