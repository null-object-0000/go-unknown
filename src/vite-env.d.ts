/// <reference types="vite/client" />
/// <reference types="vite-svg-loader" />

declare const __APP_NAME__: string
declare const __APP_VERSION__: string
declare const __APP_DESCRIPTION__: string

interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}