<template>
  <div class="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
    
    <!-- 1. GNB (상단 헤더 네비게이션) -->
    <header class="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <!-- 로고 (좌측 고정) -->
        <RouterLink to="/" class="text-2xl font-black text-blue-600 tracking-tight cursor-pointer">
          LocalHub
        </RouterLink>
        
        <!-- 우측 정렬 및 간격을 대폭 넓힌 네비게이션 메뉴 (RouterLink 사용) -->
        <!-- space-x-12 클래스로 메뉴 간의 거리를 널찍하게 벌렸습니다 -->
        <nav class="flex space-x-12 text-base font-bold text-slate-500">
          <RouterLink to="/" class="hover:text-blue-600 transition-colors pb-1" active-class="text-blue-600 border-b-2 border-blue-600">홈</RouterLink>
          <RouterLink to="/map" class="hover:text-blue-600 transition-colors pb-1" active-class="text-blue-600 border-b-2 border-blue-600">지도</RouterLink>
          <RouterLink to="/board" class="hover:text-blue-600 transition-colors pb-1" active-class="text-blue-600 border-b-2 border-blue-600">게시판</RouterLink>
        </nav>
      </div>
    </header>

    <!-- 2. 중앙 메인 컨텐츠 영역 -->
    <main class="flex-grow max-w-7xl w-full mx-auto px-4 py-8 space-y-8">
      
      <!-- 상단 메인 공통 배너 -->
      <section class="bg-blue-600 rounded-2xl py-10 px-6 text-center shadow-md text-white">
        <h2 class="text-3xl font-extrabold mb-2 tracking-tight">
          LocalHub 서울/경기 플랫폼
        </h2>
        <p class="text-blue-100 font-medium text-sm md:text-base">
          수도권 지역의 생생한 공공데이터와 커뮤니티 공간
        </p>
      </section>

      <!-- 라우터 렌더링 영역 -->
      <RouterView />

    </main>

    <!-- 3. 하단 푸터 영역 -->
    <footer class="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400">
      <p>© 2026 LocalHub. All rights reserved.</p>
    </footer>

  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>