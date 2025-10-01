declare module 'vaul-vue' {
  import type { DefineComponent } from 'vue'

  // Generic props for permissive typing. Replace with stronger shapes if needed.
  export interface DrawerDescriptionProps {
    class?: string
    [key: string]: any
  }

  export interface DrawerTitleProps {
    class?: string
    [key: string]: any
  }

  // Export components as Vue DefineComponent for better editor/TS support.
  export const DrawerRoot: DefineComponent<{}, {}, any>
  export const DrawerContent: DefineComponent<{}, {}, any>
  export const DrawerPortal: DefineComponent<{}, {}, any>
  export const DrawerDescription: DefineComponent<DrawerDescriptionProps, {}, any>
  export const DrawerTitle: DefineComponent<DrawerTitleProps, {}, any>
  export const DrawerClose: DefineComponent<{}, {}, any>
  export const DrawerTrigger: DefineComponent<{}, {}, any>

  export default {} as unknown as Record<string, any>
}
