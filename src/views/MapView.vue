<script setup>
import { ref, computed } from 'vue'
import Sidebar from '@/components/map/Sidebar.vue'
import KakaoMap from '@/components/map/KakaoMap.vue'
import SearchBar from '@/components/map/SearchBar.vue'
import tourist from '@/assets/data/서울_관광지.json'
import culture from '@/assets/data/서울_문화시설.json'
import festival from '@/assets/data/서울_쇼핑.json'

const places = [
  ...tourist.items.map(item => ({
    ...item,
    type: '관광지'
  })),

  ...culture.items.map(item => ({
    ...item,
    type: '문화시설'
  })),

  ...festival.items.map(item => ({
    ...item,
    type: '쇼핑'
  }))
]

const keyword = ref('')
const filters = ref({
  관광지: true,
  문화시설: true,
  쇼핑: true,
})
const selectedPlace = ref(null)
const mapRef = ref(null)

function onMarkerSelect(place) {
  // 마커 클릭 시 상세정보 표시
  selectedPlace.value = place
}

function onSidebarFocus(place) {
  // 사이드바 클릭 시 지도만 이동(상세정보는 띄우지 않음)
  if (mapRef.value && typeof mapRef.value.moveMap === 'function') {
    mapRef.value.moveMap(place)
  }
}

const filteredPlaces = computed(() => {
  return places.filter((place) => {

    // 종류 필터
    if (!filters.value[place.type]) return false

    // 검색
    if (
      keyword.value &&
      !place.title.toLowerCase().includes(keyword.value.toLowerCase())
    ) {
      return false
    }

    return true
  })
})
</script>

<template>
  <div class="mb-6">
    <div class="mb-5">

    <div class="font-semibold mb-3">
      카테고리
    </div>

    <label class="flex items-center gap-2 mb-2 cursor-pointer">
      <input
        type="checkbox"
        v-model="filters.관광지"
      />
      관광지
    </label>

    <label class="flex items-center gap-2 mb-2 cursor-pointer">
      <input
        type="checkbox"
        v-model="filters.문화시설"
      />
      문화시설
    </label>

    <label class="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        v-model="filters.쇼핑"
      />
      쇼핑
    </label>

  </div>
    <SearchBar v-model="keyword" />
  </div>

  <div class="grid grid-cols-12 gap-6">
    <div class="col-span-3">
      <Sidebar
        :places="filteredPlaces"
        :filters="filters"
        :selectedPlace="selectedPlace"
        v-model="keyword"
        @focus-place="onSidebarFocus"
      />
    </div>

    <div class="col-span-6">
      <KakaoMap
        ref="mapRef"
        :places="filteredPlaces"
        :selectedPlace="selectedPlace"
        @select-place="onMarkerSelect"
      />
    </div>

    <div class="col-span-3">
      <div class="bg-white rounded-2xl shadow p-5 h-[700px]">
        <template v-if="selectedPlace">
          <img
            v-if="selectedPlace.firstimage"
            :src="selectedPlace.firstimage"
            class="w-full h-52 object-cover rounded-lg mb-4"
          />
          <div v-else class="w-full h-52 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
            이미지 없음
          </div>

          <h2 class="text-xl font-bold mb-3">{{ selectedPlace.title }}</h2>

          <div class="mb-3">
            <span
              class="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm"
            >
              {{ selectedPlace.type }}
            </span>
          </div>

          <div class="space-y-4">
            <div>
              <div class="font-semibold">주소</div>
              <div class="text-gray-500">{{ selectedPlace.addr1 || '정보 없음' }}</div>
            </div>

            <div>
              <div class="font-semibold">전화번호</div>
              <div class="text-gray-500">{{ selectedPlace.tel || '정보 없음' }}</div>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="flex items-center justify-center h-full text-gray-400">관광지를 선택하세요.</div>
        </template>
      </div>
    </div>
  </div>
</template>