import './assets/tailwind.css'
import Notifications from '@kyvg/vue3-notification';
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).use(Notifications).mount('#app')
