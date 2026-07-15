<template>
  <div class="space-y-6">
    <!-- 기존 App.vue에 있던 서울/경기 대시보드 구조를 홈 화면의 기본값으로 배치합니다 -->
    <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-sm min-h-[300px] flex flex-col justify-between">
      <div>
        <h3 class="font-bold text-slate-900 text-lg mb-2 flex items-center gap-2">
          <span class="w-1.5 h-5 bg-blue-500 rounded-full"></span>
          서울/경기 요약 대시보드
        </h3>
        <p class="text-sm text-slate-400 mt-4">실시간 수도권 공공데이터 요약 정보가 여기에 노출됩니다.</p>
      </div>
      <div class="h-32 bg-slate-50 border border-dashed border-slate-300 rounded-lg flex items-center justify-center text-xs text-slate-400 font-medium">
        [메인 홈 화면 - 데이터 위젯 영역]
      </div>
    </div>
  </div>
</template>