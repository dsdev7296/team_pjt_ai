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

// 📌 1. assets/data/ 폴더 경로 지정 (프로젝트 환경에 맞게 @ 또는 상대 경로 선택)
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

  // 💡 [테스트용 콘솔] API 키 인입 여부 확인
  console.log("-----------------------------------------");
  console.log("현재 호출 중인 API Key:", import.meta.env.VITE_OPENAI_API_KEY);
  console.log("-----------------------------------------");

  messages.value.push({ role: 'user', text: userMessage })
  input.value = ''
  await scrollToBottom()

  isLoading.value = true

  // 💡 [자바스크립트 스코프 해결] catch 블록에서도 안전하게 접근할 수 있도록 변수를 handleSend 상단에 미리 선언합니다.
  let searchResults = []

  try {
    const tourItems = (tourData && tourData.items) ? tourData.items : []
    const cultureItems = (cultureData && cultureData.items) ? cultureData.items : []
    const shoppingItems = (shoppingData && shoppingData.items) ? shoppingData.items : []
    const allMergedItems = [...tourItems, ...cultureItems, ...shoppingItems]

    // A. 사용자 질문 유형 판별 (사찰 vs 일반)
    const isTempleQuery = userMessage.includes('절') || userMessage.includes('사찰')

    // B. 자치구 명칭 매칭 판별
    const SeoulDistricts = ['종로', '중구', '용산', '성동', '광진', '동대문', '중랑', '성북', '강북', '도봉', '노원', '은평', '서대문', '마포', '양천', '강서', '구로', '금천', '영등포', '동작', '관악', '서초', '강남', '송파', '강동']
    const matchedDistrict = SeoulDistricts.find(district => userMessage.includes(district))

    // C. 스마트 타겟 격리 (사찰 질문은 관광지 데이터만 타겟팅)
    const targetItems = isTempleQuery ? tourItems : allMergedItems

    // D. 사찰 정밀 예외처리 및 형태소 조사 제거 필터링 (결과를 변수에 대입)
    searchResults = targetItems.filter(item => {
      const title = item.title || ''
      const addr = item.addr1 || ''
      
      const cleanTitle = title.replace(/\s+/g, '').replace(/\([^)]*\)/g, '')
      const isItemTemple = (cleanTitle.endsWith('사') || cleanTitle.endsWith('암') || title.includes('사찰') || title.includes('절')) &&
                           !cleanTitle.endsWith('회사') &&
                           !cleanTitle.endsWith('지사') &&
                           !cleanTitle.endsWith('본사') &&
                           !cleanTitle.endsWith('상사') &&
                           !cleanTitle.endsWith('전파사') &&
                           !cleanTitle.endsWith('여행사')

      if (isTempleQuery) {
        if (!isItemTemple) return false
        if (matchedDistrict) {
          return addr.includes(matchedDistrict)
        }
        return true
      } else {
        const stopWords = ['있는', '에서', '근처', '가까운', '추천', '알려줘', '해줘', '보여줘', '찾아줘', '어디', '있어', '있나요', '의', '에', '이', '가', '은', '는']
        const cleanWords = userMessage.split(/\s+/)
          .map(w => w.replace(/(에|에서|의|도|은|는|이|가|구|동)$/, ''))
          .filter(w => w.length > 1 && !stopWords.includes(w))

        if (cleanWords.length > 0) {
          return cleanWords.every(word => title.includes(word) || addr.includes(word))
        }
        
        return title.includes(userMessage) || addr.includes(userMessage)
      }
    })

    // E. 무작위 셔플 후 모바일 가독성을 위해 최대 5개 조절
    const MAX_RESULTS = 5
    const shuffled = [...searchResults].sort(() => Math.random() - 0.5)
    const dbContextItems = shuffled.slice(0, MAX_RESULTS)

    const apiKey = import.meta.env.VITE_OPENAI_API_KEY
    if (!apiKey) {
      throw new Error('API 키가 설정되지 않았습니다.')
    }

    // F. OpenAI API 호출 (존재하는 공식 최신 모델명인 gpt-4o-mini로 정정)
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // 👈 400 에러를 해결하는 공식 모델명입니다.
        messages: [
          {
            role: 'system',
            content: `너는 LocalHub AI 도우미야. 아래 제공되는 [지역 정보 데이터]만을 기반으로 사용자의 질문에 답해라.
모바일 사용자의 작은 화면 가독성을 위해 아래의 출력 형태를 뼈대 삼아 절대로 어기지 말고 출력해야 해.

[⚠️ 절대 준수 규칙]
1. 검색 결과는 무조건 제공된 데이터 안에서만 구성할 것.
2. 장황한 인사말, 설명문, 미사여구는 전부 생략하고 딱 장소 정보만 보여줄 것.
3. 무조건 아래 예시 형태처럼 '장소명'과 '주소'만 단순하게 한 라인씩 마크다운으로 깔끔하게 출력할 것.

[출력 양식 예시]
📍 **[장소명]**
🏠 주소: [주소]

(검색결과가 여러 개라면 위 세트를 한 줄 띄우고 순서대로 나열해라.)
(만약 데이터가 텅 비어있다면 "요청하신 조건에 일치하는 정보를 찾을 수 없습니다."라고 딱 한 줄만 답해라.)`
          },
          {
            role: 'user',
            content: `사용자 질문: "${userMessage}"\n\n[지역 정보 데이터]:\n${JSON.stringify(dbContextItems, null, 2)}`
          }
        ],
        temperature: 0.3
      })
    })

    if (!response.ok) {
      throw new Error('API 호출 실패')
    }

    const data = await response.json()
    let aiResponse = data.choices[0].message.content

    // G. 최종 문구 하단에 잔여 검색 결과 개수 결합
    if (searchResults.length > MAX_RESULTS) {
      const remainingCount = searchResults.length - MAX_RESULTS
      aiResponse += `\n\n...이 외에도 ${remainingCount}개의 검색 결과가 더 있습니다. 조금 더 구체적인 단어로 검색해 주세요!`
    }

    messages.value.push({ role: 'ai', text: aiResponse })

  } catch (error) {
    console.error(error)
    
    // 💡 [ReferenceError 해결] 이제 searchResults 변수가 외부 스코프에 선언되어 있어 에러가 나지 않습니다.
    if (searchResults && searchResults.length > 0) {
      const topResults = searchResults.slice(0, 5)
      let fallbackText = "⚠️ [안내] 현재 일시적인 연결 지연으로 로컬 검색 결과만 빠르게 안내해 드릴게요!\n\n"
      
      fallbackText += topResults.map(item => 
        `📍 **${item.title}**\n🏠 주소: ${item.addr1}`
      ).join('\n\n')
      
      if (searchResults.length > 5) {
        const remainingCount = searchResults.length - 5
        fallbackText += `\n\n...이 외에도 ${remainingCount}개의 검색 결과가 더 있습니다. 조금 더 구체적인 단어로 검색해 주세요!`
      }
      
      messages.value.push({ role: 'ai', text: fallbackText })
    } else {
      messages.value.push({ 
        role: 'ai', 
        text: '죄송합니다. 현재 서비스 연결에 오류가 발생했으며, 일치하는 로컬 정보도 찾을 수 없습니다.' 
      })
    }
  } finally {
    isLoading.value = false
    await scrollToBottom()
  }
}
</script>