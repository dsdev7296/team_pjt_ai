<template>
  <header class="sticky top-0 z-50 bg-white border-b border-slate-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="h-16 flex items-center justify-between">
        <!-- 로고 -->
        <RouterLink
          to="/"
          class="flex items-center gap-3"
        >
          <span
            class="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-sky-500 flex items-center justify-center text-white font-bold"
          >
            LH
          </span>

          <span class="text-slate-900 font-bold text-lg">
            LocalHub
          </span>
        </RouterLink>

        <!-- 메뉴 -->
        <nav class="flex items-center gap-2 sm:gap-6">
          <RouterLink
            to="/"
            class="header-link"
          >
            홈
          </RouterLink>

          <RouterLink
            to="/board"
            class="header-link"
          >
            게시판
          </RouterLink>

          <RouterLink
            to="/map"
            class="header-link"
          >
            지도
          </RouterLink>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.header-link {
  padding: 20px 4px 17px;
  color: #475569;
  font-size: 14px;
  font-weight: 700;
  border-bottom: 3px solid transparent;
  transition:
    color 0.2s ease,
    border-color 0.2s ease;
}

.header-link:hover {
  color: #2563eb;
}

.header-link.router-link-exact-active {
  color: #2563eb;
  border-bottom-color: #2563eb;
}
</style>