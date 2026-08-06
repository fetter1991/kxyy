<script setup lang="ts">
// 留言（T08）：列表 + 发布表单（验证 POST /messages，原则 10 P0 XSS 红线）
// 注意：content 用模板绑定渲染，严禁 v-html（P0）
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useDataStore } from '../stores/data'

const store = useDataStore()
const { messages } = storeToRefs(store)
const user = ref('')
const content = ref('')
const submitting = ref(false)

async function submit() {
  if (!user.value.trim() || !content.value.trim()) return
  submitting.value = true
  try {
    await store.addMessage(user.value.trim(), content.value.trim())
    user.value = ''
    content.value = ''
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <section>
    <h2>留言</h2>
    <form class="form" @submit.prevent="submit">
      <input v-model="user" placeholder="昵称" maxlength="32" />
      <textarea v-model="content" placeholder="说点什么…" maxlength="500" rows="3" />
      <button type="submit" :disabled="submitting">{{ submitting ? '发送中…' : '发布' }}</button>
    </form>

    <ul class="list">
      <li v-for="m in messages" :key="m.id" class="item">
        <strong>{{ m.user }}</strong>
        <span class="time">{{ m.createdAt }}</span>
        <!-- 安全渲染：模板绑定，不解析 HTML（原则 10 P0） -->
        <p class="text">{{ m.content }}</p>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.form { display: flex; flex-direction: column; gap: 8px; max-width: 480px; margin-bottom: 20px; text-align: left; }
.form input, .form textarea {
  border: 1px solid var(--border); border-radius: 8px; padding: 8px 10px; font: inherit; color: var(--text-h);
}
.form button {
  align-self: flex-start; background: var(--accent); color: #fff; border: none;
  padding: 8px 18px; border-radius: 8px; cursor: pointer;
}
.form button:disabled { opacity: 0.6; cursor: default; }
.list { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 12px; text-align: left; }
.item { border: 1px solid var(--border); border-radius: 8px; padding: 12px; }
.item .time { color: var(--text); font-size: 13px; margin-left: 8px; }
.item .text { margin: 6px 0 0; white-space: pre-wrap; }
</style>
