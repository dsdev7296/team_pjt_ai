<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import Sidebar from '@/components/map/Sidebar.vue'
import KakaoMap from '@/components/map/KakaoMap.vue'
import SearchBar from '@/components/map/SearchBar.vue'

import tourist from '@/assets/data/서울_관광지.json'
import culture from '@/assets/data/서울_문화시설.json'
import festival from '@/assets/data/서울_쇼핑.json'

const route = useRoute()

const places = [
  ...tourist.items.map((item) => ({
    ...item,
    type: '관광지',
  })),

  ...culture.items.map((item) => ({
    ...item,
    type: '문화시설',
  })),

  ...festival.items.map((item) => ({
    ...item,
    type: '쇼핑',
  })),
]

const validCategories = [
  '관광지',
  '문화시설',
  '쇼핑',
]

function getRouteKeyword() {
  const value = route.query.keyword

  return typeof value === 'string'
    ? value.trim()
    : ''
}

function getRouteCategory() {
  const value = route.query.category

  if (
    typeof value === 'string' &&
    validCategories.includes(value)
  ) {
    return value
  }

  return ''
}

function createFilters(category = '') {
  /*
   * category 쿼리가 없는 일반 지도 접근이라면
   * 모든 카테고리를 선택합니다.
   */
  if (!category) {
    return {
      관광지: true,
      문화시설: true,
      쇼핑: true,
    }
  }

  /*
   * 홈에서 특정 카테고리를 선택해 들어온 경우
   * 해당 카테고리만 선택합니다.
   */
  return {
    관광지: category === '관광지',
    문화시설: category === '문화시설',
    쇼핑: category === '쇼핑',
  }
}

const keyword = ref(getRouteKeyword())

const filters = ref(
  createFilters(getRouteCategory())
)

const selectedPlace = ref(null)
const mapRef = ref(null)

function onMarkerSelect(place) {
  selectedPlace.value = place
}

function onSidebarFocus(place) {
  selectedPlace.value = place

  if (
    mapRef.value &&
    typeof mapRef.value.moveMap === 'function'
  ) {
    mapRef.value.moveMap(place)
  }
}

const filteredPlaces = computed(() => {
  const searchKeyword = keyword.value
    .trim()
    .toLowerCase()

  return places.filter((place) => {
    // 체크하지 않은 카테고리는 제외
    if (!filters.value[place.type]) {
      return false
    }

    // 검색어가 없으면 카테고리 필터만 적용
    if (!searchKeyword) {
      return true
    }

    const title = String(place.title ?? '')
      .toLowerCase()

    const address = String(place.addr1 ?? '')
      .toLowerCase()

    return (
      title.includes(searchKeyword) ||
      address.includes(searchKeyword)
    )
  })
})

/*
 * 홈 검색창에서 다른 검색어를 전달한 경우
 * 지도 검색창에도 반영합니다.
 */
watch(
  () => route.query.keyword,
  (newKeyword) => {
    keyword.value =
      typeof newKeyword === 'string'
        ? newKeyword.trim()
        : ''

    selectedPlace.value = null
  }
)

/*
 * 홈 카테고리 버튼에서 전달한 category를
 * 지도 체크박스 상태에 반영합니다.
 */
watch(
  () => route.query.category,
  (newCategory) => {
    const category =
      typeof newCategory === 'string' &&
      validCategories.includes(newCategory)
        ? newCategory
        : ''

    filters.value = createFilters(category)
    selectedPlace.value = null
  }
)
</script>

<template>
  <div class="space-y-6">
    <!-- 검색 및 카테고리 -->
    <div class="mb-6">
      <div class="mb-5">
        <div class="font-semibold mb-3">
          카테고리
        </div>

        <label class="flex items-center gap-2 mb-2 cursor-pointer">
          <input
            v-model="filters.관광지"
            type="checkbox"
          />

          관광지
        </label>

        <label class="flex items-center gap-2 mb-2 cursor-pointer">
          <input
            v-model="filters.문화시설"
            type="checkbox"
          />

          문화시설
        </label>

        <label class="flex items-center gap-2 cursor-pointer">
          <input
            v-model="filters.쇼핑"
            type="checkbox"
          />

          쇼핑
        </label>
      </div>

      <SearchBar v-model="keyword" />
    </div>

    <!-- 지도 및 상세정보 -->
    <div class="grid grid-cols-12 gap-6">
      <!-- 장소 목록 -->
      <div class="col-span-3">
        <Sidebar
          v-model="keyword"
          :places="filteredPlaces"
          :filters="filters"
          :selected-place="selectedPlace"
          @focus-place="onSidebarFocus"
        />
      </div>

      <!-- 지도 -->
      <div class="col-span-6">
        <KakaoMap
          ref="mapRef"
          :places="filteredPlaces"
          :selected-place="selectedPlace"
          @select-place="onMarkerSelect"
        />
      </div>

      <!-- 상세정보 -->
      <div class="col-span-3">
        <div class="bg-white rounded-2xl shadow p-5 h-[700px]">
          <template v-if="selectedPlace">
            <img
              v-if="selectedPlace.firstimage"
              :src="selectedPlace.firstimage"
              :alt="selectedPlace.title"
              class="w-full h-52 object-cover rounded-lg mb-4"
            />

            <div
              v-else
              class="w-full h-52 bg-gray-100 rounded-lg flex items-center justify-center mb-4"
            >
              이미지 없음
            </div>

            <h2 class="text-xl font-bold mb-3">
              {{ selectedPlace.title }}
            </h2>

            <div class="mb-3">
              <span
                class="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm"
              >
                {{ selectedPlace.type }}
              </span>
            </div>

            <div class="space-y-4">
              <div>
                <div class="font-semibold">
                  주소
                </div>

                <div class="text-gray-500">
                  {{ selectedPlace.addr1 || '정보 없음' }}
                </div>
              </div>

              <div>
                <div class="font-semibold">
                  전화번호
                </div>

                <div class="text-gray-500">
                  {{ selectedPlace.tel || '정보 없음' }}
                </div>
              </div>
            </div>
          </template>

          <template v-else>
            <div
              class="flex items-center justify-center h-full text-gray-400"
            >
              관광지를 선택하세요.
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>