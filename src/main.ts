import './assets/main.scss'
import './styles/index.scss'
import 'tdesign-vue-next/es/style/index.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

const appEnv = import.meta.env.VITE_APP_ENV
if (import.meta.env.VITE_APP_TITLE) {
  document.title = import.meta.env.VITE_APP_TITLE
}
if (appEnv) {
  document.documentElement.setAttribute('data-app-env', appEnv)
}

app.mount('#app')
