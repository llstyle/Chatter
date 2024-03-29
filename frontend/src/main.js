import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import axios from 'axios'

import directives from '@/directives';

axios.defaults.baseURL = import.meta.env.VITE_API_URL

const pinia = createPinia()
const app = createApp(App)

directives.forEach(directive => {
    app.directive(directive.name, directive)
})

app.use(router)
app.use(pinia)
app.mount('#app')
