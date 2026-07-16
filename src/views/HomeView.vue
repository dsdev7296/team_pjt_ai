<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

import HeroBanner from '@/components/HeroBanner.vue'

const router = useRouter()
const posts = ref([])

const categories = [
  {
    label: '관광지',
    value: '관광지',
    icon: '🗺️',
    description: '서울의 관광지를 한눈에',
    iconClass: 'bg-emerald-50',
  },
  {
    label: '쇼핑',
    value: '쇼핑',
    icon: '🛍️',
    description: '쇼핑 명소와 정보를 확인해 보세요',
    iconClass: 'bg-orange-50',
  },
  {
    label: '문화시설',
    value: '문화시설',
    icon: '🎨',
    description: '전시와 문화 공간 정보를 확인해 보세요',
    iconClass: 'bg-violet-50',
  },
  {
    label: '맛집',
    value: '맛집',
    icon: '🍽️',
    description: '서울의 다양한 맛집 정보를 확인해 보세요',
    iconClass: 'bg-blue-50',
  },
]

const fallbackPosts = [
  {
    id: 4,
    category: 'food',
    title: '강남역 근처 가성비 맛집 추천!',
    author: '익명',
    createdAt: '2026-07-14',
    comments: [],
  },
  {
    id: 3,
    category: 'tourism',
    title: '서울 야경 명소 베스트 5',
    author: '익명',
    createdAt: '2026-07-14',
    comments: [],
  },
  {
    id: 2,
    category: 'culture',
    title: '서울 여름 축제 정보 공유합니다',
    author: '익명',
    createdAt: '2026-07-13',
    comments: [],
  },
  {
    id: 1,
    category: 'free',
    title: '서울 한 달 살기 후기',
    author: '익명',
    createdAt: '2026-07-12',
    comments: [],
  },
]

const recentPosts = computed(() => {
  return [...posts.value]
    .sort((a, b) => {
      const dateA = new Date(a.createdAt ?? 0).getTime()
      const dateB = new Date(b.createdAt ?? 0).getTime()

      if (dateA !== dateB) {
        return dateB - dateA
      }

      return Number(b.id ?? 0) - Number(a.id ?? 0)
    })
    .slice(0, 5)
})

onMounted(() => {
  loadPosts()
})

function loadPosts() {
  const storedPosts = localStorage.getItem('localhub_posts')

  if (!storedPosts) {
    posts.value = fallbackPosts
    return
  }

  try {
    const parsedPosts = JSON.parse(storedPosts)

    posts.value =
      Array.isArray(parsedPosts) && parsedPosts.length > 0
        ? parsedPosts
        : fallbackPosts
  } catch (error) {
    console.error('게시글 데이터를 불러오지 못했습니다.', error)
    posts.value = fallbackPosts
  }
}

function handleCategoryClick(category) {
  if (category.value === '맛집') {
    router.push({
      name: 'board',
      query: {
        category: 'food',
      },
    })

    return
  }

  router.push({
    name: 'map',
    query: {
      category: category.value,
    },
  })
}

function openPost(postId) {
  router.push({
    name: 'board-detail',
    params: {
      id: postId,
    },
  })
}

function getCommentCount(post) {
  return Array.isArray(post.comments)
    ? post.comments.length
    : 0
}

function getCategoryLabel(category) {
  const labels = {
    tourism: '관광지',
    관광지: '관광지',
    shopping: '쇼핑',
    쇼핑: '쇼핑',
    culture: '문화시설',
    문화시설: '문화시설',
    food: '맛집',
    맛집: '맛집',
    free: '자유',
    자유: '자유',
  }

  return labels[category] ?? '기타'
}

function getCategoryClass(category) {
  const normalizedCategory = getCategoryLabel(category)

  const classes = {
    관광지: 'bg-emerald-50 text-emerald-700',
    쇼핑: 'bg-orange-50 text-orange-700',
    문화시설: 'bg-violet-50 text-violet-700',
    맛집: 'bg-blue-50 text-blue-700',
    자유: 'bg-slate-100 text-slate-600',
  }

  return classes[normalizedCategory] ?? 'bg-slate-100 text-slate-600'
}
</script>

<template>
  <div class="space-y-10">
    <HeroBanner />

    <section>
      <h2 class="sr-only">
        카테고리 바로가기
      </h2>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          v-for="category in categories"
          :key="category.value"
          type="button"
          class="group bg-white border border-slate-200 rounded-2xl p-5 text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:border-blue-200"
          @click="handleCategoryClick(category)"
        >
          <div class="flex items-center gap-4">
            <div
              class="w-14 h-14 flex-shrink-0 rounded-2xl flex items-center justify-center text-3xl"
              :class="category.iconClass"
            >
              {{ category.icon }}
            </div>

            <div class="min-w-0">
              <h3 class="font-black text-slate-900">
                {{ category.label }}
              </h3>

              <p class="mt-1 text-xs leading-5 text-slate-500">
                {{ category.description }}
              </p>
            </div>
          </div>
        </button>
      </div>
    </section>

    <section
      class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
    >
      <div
        class="flex items-center justify-between px-5 sm:px-7 py-5 border-b border-slate-100"
      >
        <h2 class="text-lg font-black text-slate-900">
          최근 게시글
        </h2>

        <RouterLink
          to="/board"
          class="text-sm font-bold text-slate-500 transition-colors hover:text-blue-600"
        >
          더보기 ›
        </RouterLink>
      </div>

      <div
        v-if="recentPosts.length === 0"
        class="py-14 text-center text-sm text-slate-400"
      >
        아직 등록된 게시글이 없습니다.
      </div>

      <ul
        v-else
        class="divide-y divide-slate-100"
      >
        <li
          v-for="post in recentPosts"
          :key="post.id"
        >
          <button
            type="button"
            class="w-full grid grid-cols-[minmax(0,1fr)_auto] sm:grid-cols-[minmax(0,1fr)_80px_110px_55px] items-center gap-3 px-5 sm:px-7 py-4 text-left transition-colors hover:bg-slate-50"
            @click="openPost(post.id)"
          >
            <div class="min-w-0 flex items-center gap-2">
              <span
                class="flex-shrink-0 text-xs font-bold px-2 py-1 rounded-md"
                :class="getCategoryClass(post.category)"
              >
                {{ getCategoryLabel(post.category) }}
              </span>

              <span class="min-w-0 truncate text-sm font-bold text-slate-800">
                {{ post.title }}
              </span>
            </div>

            <span class="hidden sm:block text-center text-xs text-slate-500">
              {{ post.author || '익명' }}
            </span>

            <span class="hidden sm:block text-center text-xs text-slate-400">
              {{ post.createdAt || '-' }}
            </span>

            <span class="text-right text-xs text-slate-500 whitespace-nowrap">
              ◯ {{ getCommentCount(post) }}
            </span>
          </button>
        </li>
      </ul>
    </section>
  </div>
</template>
