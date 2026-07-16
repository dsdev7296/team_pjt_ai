<template>
  <div class="space-y-6 max-w-5xl mx-auto px-4 py-6">
    
    <div class="bg-white border border-slate-100 rounded-2xl p-3 shadow-sm flex flex-wrap gap-2">
      <button 
        v-for="tab in categories" 
        :key="tab.value"
        @click="changeCategory(tab.value)"
        class="py-2.5 px-5 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer"
        :class="currentCategory === tab.value 
          ? 'bg-blue-600 text-white shadow-md shadow-blue-100' 
          : 'text-slate-600 bg-slate-50 hover:bg-slate-100'"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="flex flex-col sm:flex-row gap-3 items-center">
      <div class="relative w-full sm:flex-1">
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="제목, 내용을 검색하세요" 
          class="w-full bg-white border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
        />
        <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
      </div>
      <button 
        @click="$router.push('/board/create')"
        class="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-xl transition-all shadow-md shadow-blue-100 shrink-0 cursor-pointer"
      >
        글쓰기
      </button>
    </div>

    <div class="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
      
      <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <h3 class="font-black text-slate-900 text-lg flex items-center gap-2">
          <span class="w-1.5 h-5 bg-blue-600 rounded-full"></span>
          {{ currentCategoryLabel }} 목록
          <span class="text-sm font-normal text-slate-400">총 {{ filteredPosts.length }}개</span>
        </h3>
        
        <div class="flex gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100 self-start sm:self-auto">
          <button 
            @click="sortBy = 'default'"
            class="px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer"
            :class="sortBy === 'default' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'"
          >
            최신순 (기본)
          </button>
          <button 
            @click="sortBy = 'likes'"
            class="px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer"
            :class="sortBy === 'likes' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'"
          >
            추천순 👍
          </button>
          <button 
            @click="sortBy = 'views'"
            class="px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer"
            :class="sortBy === 'views' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'"
          >
            조회수순 👀
          </button>
        </div>
      </div>

      <div class="overflow-x-auto rounded-xl border border-slate-100">
        <table class="w-full text-left text-sm text-slate-600 border-collapse">
          <thead class="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
            <tr>
              <th class="py-3.5 px-4 w-16 text-center">번호</th>
              <th class="py-3.5 px-4 w-28 text-center">카테고리</th>
              <th class="py-3.5 px-4">제목</th>
              <th class="py-3.5 px-4 w-20 text-center">작성자</th>
              <th class="py-3.5 px-4 w-28 text-center">작성일</th>
              <th class="py-3.5 px-4 w-16 text-center">추천</th>
              <th class="py-3.5 px-4 w-16 text-center">조회</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-if="paginatedPosts.length === 0">
              <td colspan="7" class="py-16 text-center text-slate-400 font-medium">
                아직 등록된 게시글이 없거나 검색 결과가 없습니다. ✍️
              </td>
            </tr>
            <tr 
              v-for="(post, index) in paginatedPosts" 
              :key="post.id"
              class="hover:bg-slate-50/60 transition-colors cursor-pointer group"
              @click="$router.push(`/board/${post.id}`)"
            >
              <td class="py-4 px-4 text-center font-semibold text-slate-400 text-xs">
                {{ filteredPosts.length - ((currentPage - 1) * itemsPerPage) - index }}
              </td>
              <td class="py-4 px-4 text-center">
                <span 
                  class="text-xs font-bold px-2.5 py-1 rounded-lg"
                  :class="getCategoryBadgeClass(post.category)"
                >
                  {{ getCategorySimpleLabel(post.category) }}
                </span>
              </td>
              <td class="py-4 px-4 font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                {{ post.title }}
                <span v-if="post.comments && post.comments.length" class="text-xs text-blue-500 font-semibold ml-1">
                  [{{ post.comments.length }}]
                </span>
              </td>
              <td class="py-4 px-4 text-center font-bold text-slate-500 text-xs">
                익명
              </td>
              <td class="py-4 px-4 text-center text-xs text-slate-400 font-medium">
                {{ post.createdAt }}
              </td>
              <td class="py-4 px-4 text-center text-xs text-rose-500 font-bold">
                👍 {{ post.likes || 0 }}
              </td>
              <td class="py-4 px-4 text-center text-xs text-slate-500 font-bold">
                👀 {{ post.views || 0 }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="totalPages > 1" class="flex justify-center items-center gap-2 mt-8">
        <button 
          @click="currentPage--" 
          :disabled="currentPage === 1"
          class="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          &lt; 이전
        </button>
        <button 
          v-for="page in totalPages" 
          :key="page"
          @click="currentPage = page"
          class="w-10 h-10 rounded-xl font-black text-sm transition-all"
          :class="currentPage === page 
            ? 'bg-blue-600 text-white shadow-md shadow-blue-100' 
            : 'border border-slate-200 text-slate-600 hover:bg-slate-50'"
        >
          {{ page }}
        </button>
        <button 
          @click="currentPage++" 
          :disabled="currentPage === totalPages"
          class="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          다음 &gt;
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const categories = [
  { label: '전체', value: 'all' },
  { label: '관광지 🗺️', value: 'tourism' },
  { label: '쇼핑 🛍️', value: 'shopping' },
  { label: '문화시설 🎨', value: 'culture' },
  { label: '맛집 🍕', value: 'food' },
  { label: '자유 💬', value: 'free' }
]

const currentCategory = ref('all')
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const posts = ref([])
const sortBy = ref('default') // default, likes, views

const syncWithLocalStorage = () => {
  const stored = localStorage.getItem('localhub_posts')
  if (stored) {
    posts.value = JSON.parse(stored)
  } else {
    // [보강된 더미 데이터] 조회수(views)와 추천수(likes)가 각기 다르게 박힌 마스터 더미 데이터 탑재
    const dummyPosts = [
      { id: 101, category: 'food', title: '강남역 근처 가성비 맛집 추천!', content: '진짜 맛있고 가성비 내리는 파스타 맛집을 발견했습니다.', createdAt: '2026-07-14', password: '123', views: 120, likes: 45, comments: [] },
      { id: 102, category: 'tourism', title: '서울 야경 명소 베스트 5', content: '낙산공원, 응봉산, 남산타워 등이 야경 맛집으로 최고입니다.', createdAt: '2026-07-14', password: '123', views: 82, likes: 32, comments: [] },
      { id: 103, category: 'culture', title: '2026 서울 여름 축제 총정리', content: '올여름 한강에서 열리는 시원한 페스티벌 정보를 정리해 드려요.', createdAt: '2026-07-14', password: '123', views: 43, likes: 18, comments: [] },
      { id: 104, category: 'free', title: '서울 한달살기 후기', content: '보증금도 저렴하고 교통 편한 연남동 근처 쉐어하우스 대만족 후기입니다.', createdAt: '2026-07-13', password: '123', views: 95, likes: 26, comments: [] },
      { id: 105, category: 'shopping', title: '동대문 패션거리 쇼핑 꿀팁', content: '새벽시장에서 가성비 좋게 사입 및 구경하는 노하우 공개해요.', createdAt: '2026-07-13', password: '123', views: 60, likes: 13, comments: [] }
    ]
    localStorage.setItem('localhub_posts', JSON.stringify(dummyPosts))
    posts.value = dummyPosts
  }
}

onMounted(() => {
  syncWithLocalStorage()
})

watch([currentCategory, searchQuery, sortBy], () => {
  currentPage.value = 1
})

const currentCategoryLabel = computed(() => {
  return categories.find(c => c.value === currentCategory.value)?.label || '전체'
})

const changeCategory = (val) => {
  currentCategory.value = val
}

// 필터링 + 검색 + 다이나믹 정렬 핵심 로직
const filteredPosts = computed(() => {
  let result = [...posts.value] // 원본 배열 훼손 방지를 위해 스프레드 연산자 사용

  // 1. 카테고리 필터
  if (currentCategory.value !== 'all') {
    result = result.filter(post => post.category === currentCategory.value)
  }

  // 2. 검색 필터
  if (searchQuery.value.trim() !== '') {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(post => 
      post.title.toLowerCase().includes(q) || 
      post.content.toLowerCase().includes(q)
    )
  }

  // 3. 정렬 필터 적용 (추가됨)
  if (sortBy.value === 'likes') {
    result.sort((a, b) => (b.likes || 0) - (a.likes || 0))
  } else if (sortBy.value === 'views') {
    result.sort((a, b) => (b.views || 0) - (a.views || 0))
  } else {
    // 기본 정렬: 최신순 (id 내림차순 또는 작성일 내림차순)
    result.sort((a, b) => b.id - a.id)
  }

  return result
})

const totalPages = computed(() => {
  return Math.ceil(filteredPosts.value.length / itemsPerPage)
})

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredPosts.value.slice(start, end)
})

const getCategorySimpleLabel = (cat) => {
  const mapper = { tourism: '관광지', shopping: '쇼핑', culture: '문화시설', food: '맛집', free: '자유' }
  return mapper[cat] || '자유'
}

const getCategoryBadgeClass = (cat) => {
  const classes = {
    tourism: 'bg-emerald-50 text-emerald-600',
    shopping: 'bg-blue-50 text-blue-500',
    culture: 'bg-purple-50 text-purple-600',
    food: 'bg-amber-50 text-amber-500',
    free: 'bg-slate-50 text-slate-500'
  }
  return classes[cat] || 'bg-slate-50 text-slate-500'
}
</script>