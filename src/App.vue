<template>
  <div class="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
    
    <!-- 1. GNB (상단 헤더 네비게이션) -->
    <header class="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <!-- 서비스 로고 -->
        <div class="text-2xl font-black text-blue-600 tracking-tight cursor-pointer">
          LocalHub
        </div>
        
        <!-- 핵심 메뉴 (홈, 지도, 게시판) -->
        <nav class="flex space-x-8 text-base font-bold text-slate-600">
          <a href="#" class="text-blue-600 border-b-2 border-blue-600 pb-1">홈</a>
          <a href="#" class="hover:text-blue-600 transition-colors pb-1">지도</a>
          <a href="#" class="hover:text-blue-600 transition-colors pb-1">게시판</a>
        </nav>

        <!-- 우측 여백 또는 검색 버튼 (레이아웃 밸런스용) -->
        <div class="w-8"></div>
      </div>
    </header>

    <!-- 2. 중앙 메인 컨텐츠 영역 -->
    <main class="flex-grow max-w-7xl w-full mx-auto px-4 py-10 space-y-8">
      
      <!-- 상단 메인 배너 (서울/경기 집중 타겟) -->
      <section class="bg-blue-600 rounded-2xl py-12 px-6 text-center shadow-md text-white">
        <h2 class="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight">
          LocalHub 서울/경기 플랫폼
        </h2>
        <p class="text-blue-100 font-medium text-base md:text-lg">
          수도권 지역의 생생한 공공데이터와 커뮤니티 공간
        </p>
      </section>

      <!-- 서울/경기 전용 단일 대시보드 구역 (현재는 빈 화면 레이아웃) -->
      <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <!-- [좌측 영역] 지역 정보 요약판 (비워둠) -->
        <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-sm min-h-[300px] flex flex-col justify-between">
          <div>
            <h3 class="font-bold text-slate-900 text-lg mb-2 flex items-center gap-2">
              <span class="w-1.5 h-5 bg-blue-500 rounded-full"></span>
              서울/경기 요약
            </h3>
            <p class="text-sm text-slate-400 mt-4">여기에 실시간 지역 통계 또는 날씨 정보가 들어올 예정입니다.</p>
          </div>
          <!-- 와이어프레임 가상 박스 -->
          <div class="h-32 bg-slate-50 border border-dashed border-slate-300 rounded-lg flex items-center justify-center text-xs text-slate-400 font-medium">
            [데이터 위젯 영역]
          </div>
        </div>

        <!-- [중앙/우측 통합 영역] 메인 메인 보드 (비워둠) -->
        <div class="md:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-sm min-h-[300px] flex flex-col justify-between">
          <div>
            <h3 class="font-bold text-slate-900 text-lg mb-2 flex items-center gap-2">
              <span class="w-1.5 h-5 bg-blue-500 rounded-full"></span>
              주요 컨텐츠 화면
            </h3>
            <p class="text-sm text-slate-400 mt-4">메뉴 클릭에 따라 지도 화면이나 게시판 목록이 렌더링될 메인 도화지 공간입니다.</p>
          </div>
          <!-- 와이어프레임 가상 박스 -->
          <div class="h-40 bg-slate-50 border border-dashed border-slate-300 rounded-lg flex items-center justify-center text-xs text-slate-400 font-medium">
            [메인 컨텐츠 렌더링 영역 - 빈 화면]
          </div>
        </div>

      </section>

    </main>

    <!-- 3. 하단 푸터 영역 -->
    <footer class="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400">
      <p>© 2026 LocalHub. All rights reserved.</p>
    </footer>

  </div>
</template>

<script setup>
// 초기 와이어프레임 구성을 위한 빈 스크립트 상태를 유지합니다.
// 이후 Vue Router를 통해 '홈, 지도, 게시판' 컴포넌트가 스위칭되도록 구현할 예정입니다.
</script>

<style>
/* 추가적인 CSS 없이 Tailwind 유틸리티 클래스로만 화면을 제어합니다. */
</style>