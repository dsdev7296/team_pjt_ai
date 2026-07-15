<template>
  <footer class="bg-slate-900 text-slate-300">
    <div class="max-w-7xl mx-auto px-4 py-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- 왼쪽 칸: (비워둠, 챗봇은 화면 우측에 고정) -->
        <div aria-hidden="true"></div>

        <!-- 중앙: 서비스 링크 -->
        <div class="flex flex-col items-start md:items-center">
          <h4 class="text-xs font-semibold text-white mb-1">서비스</h4>
          <nav class="grid gap-1 text-xs">
            <a href="/terms" class="text-slate-400 hover:text-white">이용약관</a>
            <a href="/privacy" class="text-slate-400 hover:text-white">개인정보처리방침</a>
            <a href="/contact" class="text-slate-400 hover:text-white">고객센터</a>
          </nav>
        </div>

        <!-- 오른쪽: 연락처 -->
        <div class="md:text-right">
          <h4 class="text-xs font-semibold text-white mb-1">Contact</h4>
          <p class="text-xs text-slate-400">Email: support@localhub.example</p>
          <p class="text-xs text-slate-400 mt-0.5">Tel: +82-2-1234-5678</p>
          <p class="text-[11px] text-slate-500 mt-1">운영시간: 평일 09:00 - 18:00</p>
        </div>
      </div>
    </div>

    <div class="border-t border-slate-800">
      <div class="max-w-7xl mx-auto px-4 py-2 text-center text-[10px] text-slate-600">
        Copyright 2026. LocalHub
      </div>
    </div>

    <!-- 고정 챗봇 버튼 (우측 하단) -->
    <a
      href="#"
      @click.prevent="chatOpen = true"
      class="fixed right-6 bottom-6 z-50 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-300"
      aria-label="챗봇 열기"
    >
      챗봇
    </a>

    <!-- 챗 패널 (우측 하단, 토글) -->
    <div
      v-show="chatOpen"
      class="fixed right-6 bottom-20 z-50 w-80 md:w-96 bg-white rounded-lg shadow-2xl overflow-hidden"
      role="dialog"
      aria-modal="true"
    >
      <header class="flex items-center justify-between px-4 py-3 bg-blue-600 text-white">
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <span class="font-medium text-sm">LocalHub 챗봇</span>
        </div>
        <button @click="chatOpen = false" class="text-white/90 hover:text-white focus:outline-none">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </header>

      <div class="p-4 h-56 overflow-auto text-sm text-slate-700 bg-white">
        <!-- 자리표시자: 실제 챗 로직으로 교체 예정 -->
        <p class="text-slate-500 mb-3">챗봇 연결 준비중입니다. 실제 챗 UI/로직을 연동하세요.</p>
        <div class="space-y-2">
          <div class="text-xs text-slate-400">예시 질문</div>
          <button @click="onQuick('추천 관광지 알려줘')" class="text-xs bg-slate-100 px-3 py-1 rounded-md">추천 관광지 알려줘</button>
        </div>
      </div>

      <form @submit.prevent="sendMessage" class="flex items-center gap-2 px-3 py-2 bg-slate-50">
        <input v-model="message" type="text" placeholder="메시지 입력..." class="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none" />
        <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm">전송</button>
      </form>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'

const chatOpen = ref(false)
const message = ref('')

function sendMessage() {
  if (!message.value.trim()) return
  // 실제 챗 연동 시 여기에 메시지 전송 로직을 넣으세요.
  // 현재는 입력 초기화 및 간단한 콘솔 로그로 자리표시자 동작을 제공합니다.
  console.log('sendMessage:', message.value)
  message.value = ''
}

function onQuick(q) {
  message.value = q
  sendMessage()
}
</script>