interface ImportMetaEnv {
  readonly VITE_APP_ENV: 'dev' | 'testing' | 'prod'
  readonly VITE_APP_NAME: string
  readonly VITE_APP_TITLE: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_ELECTRON_DEV_SERVER_URL: string
  readonly BASE_URL: string
  readonly MODE: string
  readonly DEV: boolean
  readonly PROD: boolean
  readonly SSR: boolean
}

declare module '*.css' {
  const classes: { [key: string]: string };
  export default classes;
}
declare module '*.scss' {
  const classes: { [key: string]: string };
  export default classes;
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}
