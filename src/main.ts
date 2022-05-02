import { createApp } from 'vue'
import App from './App.vue'
import { key, store } from './store/store'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

const app = createApp(App)
app.use(store, key)
app.mount('#app')
