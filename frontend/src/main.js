import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'

axios.defaults.baseURL = 'http://192.168.1.13:3000/';
const app = createApp(App)

app.use(router)

app.mount('#app')
