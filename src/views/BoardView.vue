<template>
  <div class="space-y-6">
    
    <div class="bg-white border border-slate-200 rounded-xl p-2 shadow-sm flex gap-2">
      <button 
        v-for="tab in categories" 
        :key="tab.value"
        @click="changeCategory(tab.value)"
        class="flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all duration-200"
        :class="currentCategory === tab.value 
          ? 'bg-blue-600 text-white shadow-sm' 
          : 'text-slate-600 hover:bg-slate-50'"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div class="flex justify-between items-center mb-6">
        <h3 class="font-black text-slate-900 text-lg flex items-center gap-2">
          <span class="w-1.5 h-5 bg-blue-600 rounded-full"></span>
          {{ currentCategoryLabel }} 목록
          <span class="text-sm font-normal text-slate-400">총 {{ filteredPosts.length }}개</span>
        </h3>
        <button 
          @click="$router.push('/board/create')"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg transition-colors shadow-sm"
        >
          글쓰기
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-600">
          <thead class="bg-slate-50 text-slate-700 font-semibold border-b border-slate-100">
            <tr>
              <th class="py-3 px-4 w-20 text-center">번호</th>
              <th class="py-3 px-4">제목</th>
              <th class="py-3 px-4 w-32 text-center">작성일</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-if="paginatedPosts.length === 0">
              <td colspan="3" class="py-12 text-center text-slate-400">
                아직 등록된 게시글이 없습니다. 첫 글을 남겨보세요!
              </td>
            </tr>
            <tr 
              v-for="(post, index) in paginatedPosts" 
              :key="post.id"
              class="hover:bg-slate-50/80 transition-colors cursor-pointer"
              @click="$router.push(`/board/${post.id}`)"
            >
              <td class="py-3.5 px-4 text-center font-medium text-slate-400">
                {{ filteredPosts.length - ((currentPage - 1) * itemsPerPage) - index }}
              </td>
              <td class="py-3.5 px-4 font-semibold text-slate-800 hover:text-blue-600">
                {{ post.title }}
              </td>
              <td class="py-3.5 px-4 text-center text-xs text-slate-400">
                {{ post.createdAt }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="totalPages > 1" class="flex justify-center items-center gap-2 mt-6">
        <button 
          @click="currentPage--" 
          :disabled="currentPage === 1"
          class="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
        >
          &lt; 이전
        </button>
        <button 
          v-for="page in totalPages" 
          :key="page"
          @click="currentPage = page"
          class="w-10 h-10 rounded-lg font-bold text-sm transition-all"
          :class="currentPage === page 
            ? 'bg-blue-600 text-white shadow-sm' 
            : 'border border-slate-200 text-slate-600 hover:bg-slate-50'"
        >
          {{ page }}
        </button>
        <button 
          @click="currentPage++" 
          :disabled="currentPage === totalPages"
          class="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
        >
          다음 &gt;
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const categories = [
  { label: '관광지 🗺️', value: 'tourism' },
  { label: '쇼핑 🛍️', value: 'shopping' },
  { label: '문화시설 🎨', value: 'culture' },
  { label: '맛집 🍕', value: 'food' }
]

const currentCategory = ref('tourism')
const currentPage = ref(1)
const itemsPerPage = 20
const posts = ref([])

// 로컬스토리지에서 항상 '최신' 상태를 읽어오는 동기화 함수
const syncWithLocalStorage = () => {
  const stored = localStorage.getItem('localhub_posts')
  if (stored) {
    posts.value = JSON.parse(stored)
  } else {
    posts.value = []
  }
}

// 화면이 열릴 때 실시간으로 데이터 세이브포인트 읽기
onMounted(() => {
  syncWithLocalStorage()
})

// 카테고리가 전환되거나 탭이 변경될 때마다 데이터를 한 번 더 강제로 리프레시하여 재실행 에러를 방지
watch(currentCategory, () => {
  syncWithLocalStorage()
})

const currentCategoryLabel = computed(() => {
  return categories.find(c => c.value === currentCategory.value)?.label || ''
})

const changeCategory = (val) => {
  currentCategory.value = val
  currentPage.value = 1
}

const filteredPosts = computed(() => {
  return posts.value.filter(post => post.category === currentCategory.value)
})

const totalPages = computed(() => {
  return Math.ceil(filteredPosts.value.length / itemsPerPage)
})

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredPosts.value.slice(start, end)
})
</script>