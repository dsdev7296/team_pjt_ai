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

// 📌 1. assets/data/ 폴더 경로 지정
import tourData from '@/assets/data/서울_관광지.json' 
import cultureData from '@/assets/data/서울_문화시설.json'
import shoppingData from '@/assets/data/서울_쇼핑.json'

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

  let searchResults = []

  try {
    const tourItems = (tourData && tourData.items) ? tourData.items : []
    const cultureItems = (cultureData && cultureData.items) ? cultureData.items : []
    const shoppingItems = (shoppingData && shoppingData.items) ? shoppingData.items : []
    
    // 원본 데이터 카테고리 구분 태그 지정
    const tourTags = tourItems.map(i => ({ ...i, originCat: '관광지' }))
    const cultureTags = cultureItems.map(i => ({ ...i, originCat: '문화시설' }))
    const shoppingTags = shoppingItems.map(i => ({ ...i, originCat: '쇼핑명소' }))
    const allMergedItems = [...tourTags, ...cultureTags, ...shoppingTags]

    const SeoulDistricts = ['종로', '중구', '용산', '성동', '광진', '동대문', '중랑', '성북', '강북', '도봉', '노원', '은평', '서대문', '마포', '양천', '강서', '구로', '금천', '영등포', '동작', '관악', '서초', '강남', '송파', '강동']
    const matchedDistrict = SeoulDistricts.find(district => userMessage.includes(district))

    // 연상 단어 확장 맵
    let semanticKeywords = [userMessage]
    if (userMessage.includes('쇼핑') || userMessage.includes('살곳')) {
      semanticKeywords.push('시장', '마트', '거리', '몰', '상가', '문구', '완구', '스토어', '백화점')
    }
    if (userMessage.includes('놀거리') || userMessage.includes('볼거리') || userMessage.includes('추천')) {
      semanticKeywords.push('공원', '광장', '길', '마을', '체험', '타워')
    }

    const isTempleQuery = userMessage.includes('절') || userMessage.includes('사찰')

    // 스마트 1차 로컬 검색
    searchResults = allMergedItems.filter(item => {
      const title = item.title || ''
      const addr = item.addr1 || ''
      
      if (isTempleQuery) {
        const cleanTitle = title.replace(/\s+/g, '').replace(/\([^)]*\)/g, '')
        const isItemTemple = (cleanTitle.endsWith('사') || cleanTitle.endsWith('암') || title.includes('사찰') || title.includes('절')) &&
                             !cleanTitle.endsWith('회사') && !cleanTitle.endsWith('지사') && !cleanTitle.endsWith('본사') && !cleanTitle.endsWith('상사')
        if (!isItemTemple) return false
        return matchedDistrict ? addr.includes(matchedDistrict) : true
      }

      if (matchedDistrict) {
        if (!addr.includes(matchedDistrict)) return false
        return semanticKeywords.some(kw => title.includes(kw) || addr.includes(kw) || title.includes(userMessage) || item.originCat.includes(userMessage)) || true
      }

      return title.includes(userMessage) || addr.includes(userMessage)
    })

    const MAX_RESULTS = 5
    const shuffled = [...searchResults].sort(() => Math.random() - 0.5)
    const dbContextItems = shuffled.slice(0, 15) // 연상 추론을 위해 넉넉히 15개 준비

    // 💡 💡 [가장 중요한 변경 포인트] 
    // 브라우저에서 OpenAI로 직접 쏘지 않고, 우리 Netlify 백엔드로 우회 통신합니다. (코드상에 키와 관련된 어떤 정보도 남지 않음!)
    const response = await fetch('/.netlify/functions/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userMessage: userMessage,
        dbContextItems: dbContextItems
      })
    })

    if (!response.ok) {
      throw new Error('Netlify Function 백엔드 통신 실패')
    }

    const data = await response.json()
    let aiResponse = data.choices[0].message.content

    // 남은 개수 문구 결합
    if (searchResults.length > MAX_RESULTS) {
      const remainingCount = searchResults.length - MAX_RESULTS
      aiResponse += `\n\n...이 외에도 약 ${remainingCount}개의 관련 결과가 더 있습니다. 조금 더 구체적인 키워드를 말씀해주시면 추가로 찾아드릴게요!`
    }

    messages.value.push({ role: 'ai', text: aiResponse })

  } catch (error) {
    console.error(error)
    
    // 백엔드 장애 대처 로컬 데이터 방어 코드
    if (searchResults && searchResults.length > 0) {
      const topResults = searchResults.slice(0, 5)
      let fallbackText = "⚠️ [안내] 일시적인 연결 지연으로 원본 데이터를 표시합니다.\n\n"
      fallbackText += topResults.map(item => `📍 **${item.title}**\n🏠 주소: ${item.addr1}`).join('\n\n')
      messages.value.push({ role: 'ai', text: fallbackText })
    } else {
      messages.value.push({ 
        role: 'ai', 
        text: '죄송합니다. 서비스 연결에 오류가 발생했으며, 일치하는 로컬 정보도 찾을 수 없습니다.' 
      })
    }
  } finally {
    isLoading.value = false
    await scrollToBottom()
  }
}
</script>