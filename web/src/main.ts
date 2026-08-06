import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './styles/original.css' // 原站样式复用（T13 重点，待后续抽象）
import './style.css' // 本项目补充样式（覆盖/扩展用，保持极简）
import App from './App.vue'
import router from './router'

createApp(App).use(createPinia()).use(router).mount('#app')
