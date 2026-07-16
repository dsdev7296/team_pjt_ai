<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const query = ref('')

function handleSearch() {
  const keyword = query.value.trim()

  if (!keyword) return

  router.push({
    name: 'map',
    query: {
      keyword,
    },
  })
}
</script>

<template>
  <section
    class="relative min-h-[430px] overflow-hidden rounded-2xl flex items-center"
  >
    <!-- 배경 이미지 -->
    <div
      class="absolute inset-0 bg-cover bg-center"
      :style="{
        backgroundImage: `url('/images/seoul-hero.jpg')`,
      }"
    ></div>

    <!-- 어두운 오버레이 -->
    <div
      class="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/45 to-transparent"
    ></div>

    <div class="relative z-10 w-full max-w-2xl px-8 sm:px-12 py-16 text-white">
      <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight">
        서울의 모든 정보,
        <br />
        LocalHub
      </h1>

      <p class="mt-4 text-sm sm:text-base leading-7 text-white/90">
        지역 주민과 여행객이 함께 만드는
        <br />
        서울 정보 공유 커뮤니티
      </p>

      <form
        class="mt-7 flex items-center max-w-xl bg-white rounded-full shadow-lg overflow-hidden"
        @submit.prevent="handleSearch"
      >
        <input
          v-model="query"
          type="search"
          placeholder="어떤 정보를 찾고 계신가요?"
          class="flex-1 min-w-0 px-6 py-4 text-sm text-slate-800 placeholder-slate-400 outline-none"
        />

        <button
          type="submit"
          class="px-5 py-4 text-slate-700 hover:text-blue-600"
          aria-label="검색"
        >
          <svg
            class="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </button>
      </form>
    </div>
  </section>
</template>