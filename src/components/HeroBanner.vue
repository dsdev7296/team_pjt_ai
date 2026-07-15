<template>
  <section class="relative min-h-[60vh] flex items-center">
    <!-- 배경 이미지 + 다크 오버레이 -->
    <div class="absolute inset-0">
      <div class="absolute inset-0 bg-[url('/images/hero-placeholder.jpg')] bg-cover bg-center opacity-60"></div>
      <div class="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-slate-900/70 to-slate-900/85"></div>
    </div>

    <!-- 컨텐츠 -->
    <div class="relative z-10 w-full max-w-4xl mx-auto px-4 text-center text-white">
      <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-6">
        완벽한 서울 여행, LocalHub에서 시작하세요
      </h1>

      <!-- 검색창 + 버튼 -->
      <form @submit.prevent="handleSearch" class="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
        <label for="hero-search" class="sr-only">검색</label>
        <input
          id="hero-search"
          v-model="query"
          type="search"
          placeholder="장소·키워드·지역 입력 (예: 전통시장, 공원)"
          class="w-full sm:flex-1 min-w-0 py-3 px-4 rounded-lg bg-white/95 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          class="w-full sm:w-auto py-3 px-6 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold shadow-md"
          aria-label="검색"
        >
          검색
        </button>
      </form>

      <!-- 빠른 태그 -->
      <div class="mt-4 flex flex-wrap justify-center gap-2">
        <button type="button" @click="quickTag('#인기 관광지')" class="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-full">#인기 관광지</button>
        <button type="button" @click="quickTag('#쇼핑명소')" class="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-full">#쇼핑명소</button>
        <button type="button" @click="quickTag('#문화예술')" class="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-full">#문화예술</button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const query = ref('')
const router = useRouter()

function handleSearch() {
  const q = query.value.trim()
  if (!q) return
  router.push({ path: '/search', query: { q } })
}

function quickTag(tag) {
  query.value = tag.replace('#', '')
  handleSearch()
}
</script>