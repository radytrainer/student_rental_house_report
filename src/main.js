import './assets/tailwind.css'
import { createApp } from 'vue'
import App from './App.vue'

import ToastPlugin from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'

createApp(App)
  .use(ToastPlugin, {
    position: 'top-right',
    duration: 3000
  })
  .mount('#app')