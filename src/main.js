// 방금 우리가 만든 assets/main.css 파일을 가장 먼저 불러옵니다.
import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'

const app = createApp(App)

app.use(router)

app.mount('#app')