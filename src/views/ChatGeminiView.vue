<template>
  <section class="d-grid gap-3" style="grid-template-rows: auto 1fr auto; height: calc(100dvh - 150px);">
    <div class="card bg-dark border-secondary-subtle">
      <div class="card-body d-flex flex-wrap gap-2 align-items-end">
        <div class="me-2">
          <label class="form-label mb-1">API ключ</label>
          <input
            class="form-control form-control-sm bg-dark text-light border-secondary"
            :type="showKey ? 'text' : 'password'"
            v-model="apiKey"
            placeholder="sk-..."
            autocomplete="off"
            style="min-width: 260px;"
          />
        </div>
        <div class="me-2">
          <label class="form-label mb-1">Модель</label>
          <select
            class="form-select form-select-sm bg-dark text-light border-secondary"
            v-model="model"
            style="min-width: 220px;"
          >
            <option v-for="m in models" :key="m" :value="m">{{ m }}</option>
          </select>
        </div>
        <div class="ms-auto d-flex gap-2">
          <button class="btn btn-outline-light btn-sm" type="button" @click="showKey = !showKey">
            {{ showKey ? 'Скрыть' : 'Показать' }} ключ
          </button>
          <button class="btn btn-outline-warning btn-sm" type="button" @click="clearChat" :disabled="isSending">
            Очистить
          </button>
        </div>
      </div>
    </div>

    <div ref="messagesBox" class="overflow-auto border rounded p-3 bg-dark border-secondary-subtle" aria-live="polite">
      <div
        v-for="m in messages"
        :key="m.id"
        class="p-3 my-2 rounded border"
        :class="m.role === 'user' ? 'chat-message-user border-secondary-subtle' : 'chat-message-model border-secondary'">
        <div class="small text-secondary fw-semibold">{{ m.role === 'user' ? 'Вы' : 'Gemini' }}</div>
        <div class="mt-1 md" v-html="renderMarkdown(m.content)"></div>
        <div class="small text-secondary mt-1">{{ formatTime(m.createdAt) }}</div>
      </div>
    </div>

    <form class="d-grid gap-2" @submit.prevent="sendMessage">
      <textarea
        ref="inputRef"
        class="form-control bg-dark text-light border-secondary"
        v-model="userInput"
        rows="3"
        :placeholder="placeholder"
      />
      <div class="d-flex justify-content-end">
        <button class="btn btn-primary" type="submit" :disabled="disableSend">
          {{ isSending ? 'Отправка…' : 'Отправить' }}
        </button>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed, nextTick } from 'vue'
import { GoogleGenAI } from "@google/genai";
import { marked } from 'marked'
import DOMPurify from 'dompurify'
type ChatRole = 'user' | 'model'
interface ChatMessage {
  id: number
  role: ChatRole
  content: string
  createdAt: Date
}

const models = [
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'gemini-2.0-flash',
  'gemini-2.5-flash'
]

const apiKey = ref<string>(localStorage.getItem('GEMINI_API_KEY') || '')
const model = ref<string>(localStorage.getItem('GEMINI_MODEL') || models[0])
const showKey = ref<boolean>(false)

watch(apiKey, (v) => localStorage.setItem('GEMINI_API_KEY', v ?? ''))
watch(model, (v) => localStorage.setItem('GEMINI_MODEL', v ?? ''))

const messages = ref<ChatMessage[]>([])

const userInput = ref<string>('')
const isSending = ref<boolean>(false)
const inputRef = ref<HTMLTextAreaElement | null>(null)
const messagesBox = ref<HTMLDivElement | null>(null)

const placeholder = 'Спросите меня о чём угодно…'

const disableSend = computed(() => {
  return isSending.value || !userInput.value.trim()
})

function formatTime(date: Date): string {
  try {
    return new Intl.DateTimeFormat('ru-RU', {
      hour: '2-digit', minute: '2-digit'
    }).format(date)
  } catch {
    return ''
  }
}

function clearChat() {
  if (isSending.value) return
  messages.value = []
}

function normalizeMarkdown(input: string): string {
  return (input ?? '').replace(/^(\s{0,3}#{1,6})(\S)/gm, '$1 $2')
}

function renderMarkdown(text: string): string {
  try {
    const normalized = normalizeMarkdown(text)
    const raw = marked.parse(normalized) as string
    return DOMPurify.sanitize(raw)
  } catch {
    return DOMPurify.sanitize(text ?? '')
  }
}

function buildGenAIContents(history: ChatMessage[]) {
  const result: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = []
  let total = 0
  for (let i = history.length - 1; i >= 0; i -= 1) {
    const m = history[i]
    const text = m.content ?? ''
    total += text.length
    result.unshift({ role: m.role, parts: [{ text }] })
    if (total > 8000) break
  }
  return result
}

async function sendMessage() {
  const text = userInput.value.trim()
  if (!text) return

  const userMsg: ChatMessage = {
    id: Date.now(),
    role: 'user',
    content: text,
    createdAt: new Date(),
  }
  messages.value.push(userMsg)
  userInput.value = ''
  isSending.value = true

  try {
    const ai = new GoogleGenAI({ apiKey: apiKey.value })
    const contents = buildGenAIContents(messages.value)
    const response = await ai.models.generateContent({ model: model.value, contents })

    const replyText = response.text || ''
    const reply: ChatMessage = {
      id: Date.now() + 1,
      role: 'model',
      content: replyText || 'Пустой ответ от модели',
      createdAt: new Date(),
    }
    messages.value.push(reply)
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Неизвестная ошибка'
    const err: ChatMessage = {
      id: Date.now() + 2,
      role: 'model',
      content: `Ошибка: ${message}`,
      createdAt: new Date(),
    }
    messages.value.push(err)
  } finally {
    isSending.value = false
    nextTick(() => scrollToBottom())
  }
}

function scrollToBottom() {
  const el = messagesBox.value
  if (!el) return
  el.scrollTop = el.scrollHeight
}

onMounted(() => {
  inputRef.value?.focus()
  nextTick(() => scrollToBottom())
})
</script>



