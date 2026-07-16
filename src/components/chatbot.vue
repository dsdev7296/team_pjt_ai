<template>
  <div class="fixed" style="position: fixed; right: 24px; bottom: 24px; z-index: 9999;">
    <button
      v-if="!isOpen"
      @click="toggle"
      aria-label="챗봇 열기"
      class="bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all active:scale-95"
      style="width: 64px; height: 64px;" 
    >
      <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    </button>

    <button
      v-else
      @click="toggle"
      aria-label="챗창 닫기"
      class="bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all active:scale-95"
      style="width: 64px; height: 64px;"
    >
      <span class="text-2xl font-light">✕</span>
    </button>
  </div>

  <div
    v-if="isOpen"
    class="fixed flex flex-col bg-white shadow-2xl border border-slate-100"
    style="
      position: fixed;
      right: 24px;
      bottom: 96px;
      width: 360px;
      height: 500px;
      border-radius: 16px;
      z-index: 9998;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    "
    role="dialog"
    aria-modal="true"
  >
    <header class="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-white">
      <div class="flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
        <h3 class="text-sm font-bold text-slate-800">LocalHub AI 도우미</h3>
      </div>
      <button @click="isOpen = false" class="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-50 transition-colors">
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </header>

    <div ref="msgContainer" class="flex-1 overflow-auto p-4 bg-slate-50 flex flex-col gap-3">
      <template v-for="(m, idx) in messages" :key="idx">
        <div v-if="m.role === 'ai'" class="flex justify-start">
          <div class="bg-white text-slate-800 px-4 py-2 rounded-2xl rounded-tl-none shadow-sm text-sm border border-slate-100 max-w-[85%] whitespace-pre-line">
            {{ m.text }}
          </div>
        </div>

        <div v-else class="flex justify-end">
          <div class="bg-blue-600 text-white px-4 py-2 rounded-2xl rounded-tr-none shadow-sm text-sm max-w-[85%]">
            {{ m.text }}
          </div>
        </div>
      </template>

      <div v-if="isLoading" class="flex justify-start">
        <div class="bg-white px-4 py-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 flex items-center gap-1.5">
          <span class="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0ms"></span>
          <span class="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 150ms"></span>
          <span class="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 300ms"></span>
        </div>
      </div>
    </div>

    <form @submit.prevent="handleSend" class="px-3 py-3 bg-white border-t border-slate-100">
      <div class="flex items-center gap-2">
        <input
          v-model="input"
          type="text"
          placeholder="메시지를 입력하세요..."
          class="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          :disabled="isLoading"
        />
        <button
          type="submit"
          class="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center text-white focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors"
          :class="{'opacity-50 cursor-not-allowed': !input.trim() || isLoading}"
          :disabled="!input.trim() || isLoading"
        >
          <svg class="w-4 h-4 transform rotate-45" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 2L11 13" />
            <path d="M22 2L15 22L11 13L2 9L22 2Z" />
          </svg>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'

// 📌 1. assets/data/ 폴더 경로를 정확하게 반영하여 Import 합니다.
// [방법 A] 절대 경로 단축키(@)를 사용하는 방법 (가장 추천)
import tourData from '@/assets/data/서울_관광지.json' 
import cultureData from '@/assets/data/서울_문화시설.json'
import shoppingData from '@/assets/data/서울_쇼핑.json'

// [방법 B] 만약 위 @ 방식에서 에러가 난다면, 아래 상대 경로 주석을 풀고 위 3줄을 지워주세요.
// import tourData from '../assets/data/서울_관광지.json' 
// import cultureData from '../assets/data/서울_문화시설.json'
// import shoppingData from '../assets/data/서울_쇼핑.json'

const isOpen = ref(false)
const input = ref('')
const isLoading = ref(false)
const msgContainer = ref(null)

const messages = ref([
  { role: 'ai', text: '안녕하세요! LocalHub AI 도우미입니다. 관광지, 문화시설, 쇼핑 정보에 대해 무엇이든 물어보세요!' }
])

const toggle = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    scrollToBottom()
  }
}

const scrollToBottom = async () => {
  await nextTick()
  if (msgContainer.value) {
    msgContainer.value.scrollTop = msgContainer.value.scrollHeight
  }
}

const handleSend = async () => {
  const userMessage = input.value.trim()
  if (!userMessage || isLoading.value) return

  messages.value.push({ role: 'user', text: userMessage })
  input.value = ''
  await scrollToBottom()

  isLoading.value = true

  setTimeout(async () => {
    // 혹시 모를 에러 방지를 위한 빈 배열 안전 장치
    const tourItems = (tourData && tourData.items) ? tourData.items : []
    const cultureItems = (cultureData && cultureData.items) ? cultureData.items : []
    const shoppingItems = (shoppingData && shoppingData.items) ? shoppingData.items : []

    // 세 폴더의 데이터를 하나로 병합
    const allMergedItems = [...tourItems, ...cultureItems, ...shoppingItems]

    // 검색어 필터링
    const searchResults = allMergedItems.filter(item => 
      (item.title && item.title.includes(userMessage)) || 
      (item.addr1 && item.addr1.includes(userMessage))
    )

    let responseText = ""
    const MAX_RESULTS = 3 // 출력 제한 개수

    if (searchResults.length === 0) {
      responseText = `'${userMessage}'에 대한 정보를 찾을 수 없습니다. 다른 검색어를 입력해 보세요.`
    } else {
      const topResults = searchResults.slice(0, MAX_RESULTS)
      
      responseText = topResults.map(item => 
        `📍 ${item.title}\n🏠 주소: ${item.addr1}`
      ).join('\n\n')

      if (searchResults.length > MAX_RESULTS) {
        const remainingCount = searchResults.length - MAX_RESULTS
        responseText += `\n\n...이 외에도 ${remainingCount}개의 검색 결과가 더 있습니다. 조금 더 구체적인 단어로 검색해 주세요!`
      }
    }

    messages.value.push({ role: 'ai', text: responseText })

    isLoading.value = false
    await scrollToBottom()
  }, 800)
}
</script>