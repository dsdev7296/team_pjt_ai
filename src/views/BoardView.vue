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
  
  // 기존 데이터가 없거나 빈 배열일 때, 풍성한 댓글들이 포함된 더미 데이터를 주입합니다.
  if (stored && stored !== '[]') {
    posts.value = JSON.parse(stored)
  } else {
    const dummyPosts = [
      { 
        id: 112, 
        category: 'tourism', 
        title: '요즘 SNS에서 난리 난 경복궁 야간개장 예매 꿀팁 공유 📸', 
        content: '이번 야간개장은 티켓팅이 정말 치열합니다. 정각에 네이버 시계 켜두고 대기하는 법과 숨겨진 한복 무료입장 혜택 정리해 드려요!', 
        createdAt: '2026-07-16', 
        password: '123', 
        views: 245, 
        likes: 89, 
        comments: [
          { id: 1, content: '덕분에 예매 성공했어요! 네이버 시계가 진짜 신의 한 수였네요 ㅠㅠ', password: '123', createdAt: '2026-07-16 10:30' },
          { id: 2, content: '한복 대여점 팁도 너무 유용해요. 이번 주말에 부모님 모시고 다녀오려고요!', password: '123', createdAt: '2026-07-16 11:15' },
          { id: 3, content: '혹시 현장 예매는 아예 불가능한가요? 외국인만 되는지 궁금해요.', password: '123', createdAt: '2026-07-16 12:05' }
        ] 
      },
      { 
        id: 111, 
        category: 'food', 
        title: '신촌 이대 근처에서 혼밥하기 가장 좋은 조용한 라멘 맛집 🍜', 
        content: '여기 진짜 육수가 찐합니다. 독서실처럼 칸막이가 되어 있어서 프로 혼밥러분들 눈치 안 보고 편하게 먹기 최고예요.', 
        createdAt: '2026-07-16', 
        password: '123', 
        views: 189, 
        likes: 56, 
        comments: [
          { id: 1, content: '여기 차슈 추가 무조건 해야 합니다. 진짜 입에서 녹아요.', password: '123', createdAt: '2026-07-16 14:22' },
          { id: 2, content: '안 그래도 오늘 신촌 갈 일 있는데 저녁은 여기로 정했습니다 ㅋㅋ', password: '123', createdAt: '2026-07-16 15:01' }
        ] 
      },
      { 
        id: 110, 
        category: 'culture', 
        title: '국립중앙박물관 이번 특별 기획전 솔직 후기 (도슨트 필수!)', 
        content: '전시 동선이랑 미디어아트 퀄리티가 미쳤습니다. 주말엔 대기가 기니까 평일 오전 시간대를 무조건 공략하세요.', 
        createdAt: '2026-07-15', 
        password: '123', 
        views: 92, 
        likes: 23, 
        comments: [
          { id: 1, content: '오 평일 오전 도슨트 시간대가 언제 언제 있나요?', password: '123', createdAt: '2026-07-15 15:40' },
          { id: 2, content: '주말 오후에 갔다가 사람 구경만 하고 왔네요.. 평일 연차 쓰고 다시 가야겠어요.', password: '123', createdAt: '2026-07-15 16:12' }
        ] 
      },
      { 
        id: 109, 
        category: 'shopping', 
        title: '여름 휴가철 맞이 홍대 보세 옷가게 핫플 투어 후기 🛍️', 
        content: '유니크하고 힙한 옷들 위주로 파는 매장 3곳 골라왔습니다. 지갑 거덜 날 뻔했으니 다들 현금/계좌이체 할인 챙겨가세요.', 
        createdAt: '2026-07-15', 
        password: '123', 
        views: 115, 
        likes: 31, 
        comments: [
          { id: 1, content: '혹시 매장 이름 초성이라도 알려주실 수 있나요? 너무 궁금해요!', password: '123', createdAt: '2026-07-15 19:30' }
        ] 
      },
      { 
        id: 108, 
        category: 'free', 
        title: '본격 여름 장마철 실내 데이트 코스 짜봤는데 피드백 부탁해요', 
        content: '만화카페 갔다가 아쿠아리움 보고 마지막으로 분위기 좋은 북카페 갈 예정인데 동선 꼬이는 데 없을까요? 피드백 환영합니다.', 
        createdAt: '2026-07-14', 
        password: '123', 
        views: 132, 
        likes: 42, 
        comments: [
          { id: 1, content: '장마철 주말 아쿠아리움은 사람이 진짜 터져나갑니다.. 눈치싸움 잘 하셔야 해요!', password: '123', createdAt: '2026-07-14 18:20' },
          { id: 2, content: '북카페 대신 근처 실내 보드게임방에서 내기 한판 하는 것도 은근 꿀잼입니다.', password: '123', createdAt: '2026-07-14 19:05' },
          { id: 3, content: '동선은 완벽한데요? 장마라 습하니까 휴대용 선풍기 필수예요.', password: '123', createdAt: '2026-07-14 20:15' }
        ] 
      },
      { 
        id: 107, 
        category: 'tourism', 
        title: '서울에서 당일치기로 다녀오기 좋은 근교 드라이브 코스 추천 🚗', 
        content: '남양주 한강 뷰가 탁 트인 대형 카페투어 코스입니다. 해질녘에 가면 노을이 진짜 환상적이에요.', 
        createdAt: '2026-07-14', 
        password: '123', 
        views: 310, 
        likes: 124, 
        comments: [
          { id: 1, content: '남양주 가는 길 주말 오후에는 엄청 밀리니까 아침 일찍 출발하는 걸 추천합니다.', password: '123', createdAt: '2026-07-14 15:45' },
          { id: 2, content: '여기 지난주에 갔다 왔는데 뷰는 정말 끝내주더라고요. 힐링 그 자체!', password: '123', createdAt: '2026-07-14 16:30' }
        ] 
      },
      { 
        id: 106, 
        category: 'food', 
        title: '성수동 웨이팅 극악인 베이커리 빵 나오는 시간대 공유합니다 🥐', 
        content: '소금빵 맛집인데 줄 서기 어플 예약 오픈 시간 맞춰서 광클해야 합니다. 현장 대기는 진짜 비추합니다.', 
        createdAt: '2026-07-13', 
        password: '123', 
        views: 420, 
        likes: 156, 
        comments: [
          { id: 1, content: '웨이팅 정보 진짜 꿀팁이네요 ㅠㅠ 매번 허탕 쳤는데 내일 아침에 도전해 봅니다.', password: '123', createdAt: '2026-07-13 22:11' },
          { id: 2, content: '여기 소금빵 겉바속촉 지대루죠... 기다려서 먹을 만한 가치가 있습니다.', password: '123', createdAt: '2026-07-13 23:02' }
        ] 
      },
      { 
        id: 105, 
        category: 'shopping', 
        title: '동대문 현대시티아울렛 쇼핑하기 좋은 브랜드랑 이월 세일존 꿀정보', 
        content: '요즘 웬만한 백화점보다 동대문 아울렛 지하에 편집숍이랑 브랜드 이월 상품이 훨씬 가성비 좋은 거 알고 계셨나요?', 
        createdAt: '2026-07-13', 
        password: '123', 
        views: 78, 
        likes: 15, 
        comments: [
          { id: 1, content: '헉 동대문 현대시티아울렛은 자주 가봤는데 이월 세일존이 따로 있는 줄은 몰랐네요!', password: '123', createdAt: '2026-07-13 18:40' }
        ] 
      },
      { 
        id: 104, 
        category: 'culture', 
        title: '요즘 대학로에서 핫한 로맨틱 코미디 연극 내돈내산 추천 🎭', 
        content: '웃다가 배꼽 빠질 뻔했습니다. 배우들 관객 소통 능력도 최상이고 커플 데이트용 연극 찾으시면 원탑이에요.', 
        createdAt: '2026-07-12', 
        password: '123', 
        views: 154, 
        likes: 67, 
        comments: [
          { id: 1, content: '연극 제목이 뭔가요? 이번 기념일에 여친이랑 가보고 싶네요.', password: '123', createdAt: '2026-07-12 20:15' },
          { id: 2, content: '대학로 연극만의 소극장 감성이 너무 좋은 것 같아요.', password: '123', createdAt: '2026-07-12 21:00' }
        ] 
      },
      { 
        id: 103, 
        category: 'free', 
        title: '다들 주말에 보통 뭐 하세요? 서울 20대 동호회나 소모임 추천해주세요', 
        content: '매주 혼자 집에만 있으니까 심심하네요. 등산이나 독서 토론 가볍게 나갈 만한 건강한 모임 추천해 주시면 감사하겠습니다.', 
        createdAt: '2026-07-12', 
        password: '123', 
        views: 98, 
        likes: 19, 
        comments: [
          { id: 1, content: '등산 소모임 같은 경우는 가볍게 주말 아침 운동 삼아 나가기 진짜 좋아요!', password: '123', createdAt: '2026-07-12 14:02' },
          { id: 2, content: '소모임 앱 깔아보시면 지역 기반으로 러닝이나 독서 모임 되게 활성화되어 있어요.', password: '123', createdAt: '2026-07-12 14:35' }
        ] 
      },
      { 
        id: 102, 
        category: 'tourism', 
        title: '도심 속 힐링 공간, 한강 공원에서 자전거 타고 텐트 치기 좋은 스팟 🏕️', 
        content: '여의도 말고 상대적으로 사람 덜 붐비고 그늘막 텐트 설치 허용 구역인 뚝섬 한강공원 명당 스팟을 좌표 찍어 드립니다.', 
        createdAt: '2026-07-11', 
        password: '123', 
        views: 280, 
        likes: 95, 
        comments: [
          { id: 1, content: '뚝섬 한강공원은 지하철역이랑 바로 연결돼서 뚜벅이들이 가기에도 너무 좋음!', password: '123', createdAt: '2026-07-11 16:20' }
        ] 
      },
      { 
        id: 101, 
        category: 'food', 
        title: '연남동 골목길에 숨겨진 감성 가득한 파스타&리조또 레스토랑 🍕', 
        content: '테이블이 4개밖에 없는 아담한 공간인데 트러플 크림 파스타가 끝내줍니다. 소개팅 장소로 완전 추천해요.', 
        createdAt: '2026-07-11', 
        password: '123', 
        views: 350, 
        likes: 112, 
        comments: [
          { id: 1, content: '여기 지난달 소개팅 때 갔던 곳이네요 ㅋㅋ 진짜 분위기 좋고 성공 확률 백프로입니다.', password: '123', createdAt: '2026-07-11 19:40' },
          { id: 2, content: '트러플 크림 파스타 메모... 예약은 필수겠죠?', password: '123', createdAt: '2026-07-11 20:10' }
        ] 
      }
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