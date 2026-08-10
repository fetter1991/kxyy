import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './styles/original.css' // 原站样式复用（T13 重点，设计系统 token 见该文件 :root 与 docs/STYLE-SYSTEM.md）
import App from './App.vue'
import router from './router'

createApp(App).use(createPinia()).use(router).mount('#app')
