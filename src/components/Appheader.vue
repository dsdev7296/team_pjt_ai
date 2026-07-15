<template>
  <nav class="bg-white border-b border-slate-200 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 relative">
        
        <div class="flex-shrink-0">
          <router-link to="/" class="flex items-center gap-2">
            <span class="w-8 h-8 rounded-md bg-gradient-to-br from-blue-600 to-sky-500 flex items-center justify-center text-white font-semibold">
              LH
            </span>
            <span class="ml-2 text-slate-900 font-semibold text-sm sm:text-base">LocalHub</span>
          </router-link>
        </div>

        <div class="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center" style="width: auto; white-space: nowrap;">
        <div class="flex items-center" style="display: flex; gap: 24px;"> <!-- gap: 24px로 확실하게 간격을 띄움 -->
    
    <router-link 
      to="/tour" 
      class="px-3 py-2 rounded-md hover:text-blue-600 transition-colors font-bold text-sm sm:text-base text-slate-600" 
      active-class="text-blue-600 border-b-2 border-blue-600 rounded-none"
      style="text-decoration: none; display: inline-block;"
    >
      관광지
    </router-link>

    <router-link 
      to="/culture" 
      class="px-3 py-2 rounded-md hover:text-blue-600 transition-colors font-bold text-sm sm:text-base text-slate-600" 
      active-class="text-blue-600 border-b-2 border-blue-600 rounded-none"
      style="text-decoration: none; display: inline-block;"
    >
      문화시설
    </router-link>

    <router-link 
      to="/shopping" 
      class="px-3 py-2 rounded-md hover:text-blue-600 transition-colors font-bold text-sm sm:text-base text-slate-600" 
      active-class="text-blue-600 border-b-2 border-blue-600 rounded-none"
      style="text-decoration: none; display: inline-block;"
    >
      쇼핑
    </router-link>

        </div>
      </div>

        <div class="relative" ref="dropdownRef">
          <button 
            @click="isMenuOpen = !isMenuOpen"
            class="flex items-center gap-1 text-sm text-slate-600 hover:text-blue-600 font-medium px-3 py-2 rounded-md border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <span>메뉴</span>
            <svg class="w-4 h-4 transition-transform duration-200" :class="{ 'rotate-180': isMenuOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div 
            v-show="isMenuOpen" 
            class="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50"
          >
            <router-link 
              to="/map" 
              @click="isMenuOpen = false"
              class="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600"
            >
              지도
            </router-link>
            <router-link 
              to="/board" 
              @click="isMenuOpen = false"
              class="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600"
            >
              게시판
            </router-link>
          </div>
        </div>

      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// 드롭다운 메뉴 열림 상태 관리
const isMenuOpen = ref(false)
const dropdownRef = ref(null)

// 외부 영역 클릭 시 드롭다운이 자동으로 닫히도록 하는 안전장치 기능
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>