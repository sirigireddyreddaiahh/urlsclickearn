// Broad, permissive shims for Nuxt / h3 helpers to unblock type-checking.
// These are temporary and should be replaced by proper Nuxt types from `.nuxt`.

declare type H3Event = any
declare type Query = any

declare function defineEventHandler<T = any>(handler: (event: H3Event) => T): any
declare const eventHandler: typeof defineEventHandler
declare function defineRouteMeta(meta: any): void
declare function defineNuxtConfig(config: any): any

declare function createError(err: any): any

declare function readBody(event: H3Event): Promise<any>
declare function readValidatedBody(event: H3Event, parser: any): Promise<any>
declare function getValidatedQuery(event: H3Event, schema: any): Promise<any>
declare function getQuery(event: H3Event): any

declare function getRequestIP(event: H3Event, opts?: any): string
declare function getHeader(event: H3Event, name: string): string | undefined
declare function setCookie(event: H3Event, name: string, value: any, opts?: any): void
declare function getCookie(event: H3Event, name?: string): any

declare function setResponseStatus(event: H3Event, status: number): void
declare function sendRedirect(event: H3Event, url: string, status?: number): void

declare function getRequestProtocol(event: H3Event): string
declare function getRequestHost(event: H3Event): string

declare function useRuntimeConfig(event?: H3Event): any
declare function useAppConfig(event?: H3Event): any
declare function useState<T = any>(key: string, init?: T | (() => T)): { value: T }

declare function useAccessLog(event: H3Event): Promise<void>
declare function useWAE(event: H3Event, sql: any): Promise<any>

// Nuxt/$fetch helper (auto-imported at runtime) - declare for TS
declare function $fetch<T = any>(input: string, init?: any): Promise<T>

declare const SqlBricks: any
declare const blobsMap: any
declare const doublesMap: any
declare const logsMap: any

declare function query2filter(query: Query): any
declare function appendTimeFilter(sql: any, query: Query): void
declare function blobs2logs(blobs: any[]): any[]
declare function doubles2logs(doubles: any[]): any[]

// Allow importing module-style aliases in code when `.nuxt` types are not present
declare module '#app' {
  export function useRuntimeConfig(event?: any): any
  export function useState<T = any>(key: string, init?: T | (() => T)): { value: T }
}
