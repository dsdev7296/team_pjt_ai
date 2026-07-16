<script setup>
import { ref, computed } from 'vue'
import Sidebar from '@/components/map/Sidebar.vue'
import tourist from '@/assets/data/서울_관광지.json'

import KakaoMap from '@/components/map/KakaoMap.vue'
import SearchBar from '@/components/map/SearchBar.vue'

const places = tourist.items

// 검색어
const keyword = ref('')

// 현재 선택된 관광지
function selectPlace(place) {
  selectedPlace.value = place

  if (mapRef.value) {
    mapRef.value.moveMap(place)
  }
}

// 검색 결과
const filteredPlaces = computed(() => {
  if (!keyword.value) return places

  return places.filter(place =>
    place.title
      .toLowerCase()
      .includes(keyword.value.toLowerCase())
  )
})


</script>

<template>
  <SearchBar v-model="keyword" />
  <Sidebar

    :places="places"

    :selectedPlace="selectedPlace"

    v-model="keyword"

    @select-place="selectPlace"

  />
  <FilterPanel
  @update="updateFilter"
  @close="showFilter = false"
  />
  
  <div class="grid grid-cols-12 gap-6">

    <!-- 좌측 관광지 목록 -->
    <div class="col-span-3">

      <div class="bg-white rounded-2xl shadow p-5 h-[820px] overflow-y-auto">

        <h2 class="text-xl font-bold mb-5">
          관광지 목록
        </h2>

        <!-- 검색 -->
        <input
          v-model="keyword"
          type="text"
          placeholder="관광지 검색"
          class="w-full border rounded-lg px-4 py-3 mb-5"
        />

        <!-- 목록 -->
        <div
          v-for="place in filteredPlaces"
          :key="place.contentid"
          @click="selectPlace(place)"
          class="border rounded-xl p-3 mb-3 cursor-pointer hover:bg-blue-50 transition"
        >

          <img
            v-if="place.firstimage"
            :src="place.firstimage"
            class="w-full h-32 object-cover rounded-lg mb-3"
          />

          <div
            v-else
            class="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-3"
          >
            이미지 없음
          </div>

          <div class="font-bold">
            {{ place.title }}
          </div>

          <div class="text-sm text-gray-500">
            {{ place.addr1 }}
          </div>

        </div>

      </div>

    </div>

    <!-- 가운데 지도 -->
    <div class="col-span-6">

      <KakaoMap
        :places="filteredPlaces"
        :selectedPlace="selectedPlace"
        @select-place="selectPlace"
      />

    </div>

    <!-- 우측 상세정보 -->
    <div class="col-span-3">

      <div class="bg-white rounded-2xl shadow p-5 h-[820px]">

        <template v-if="selectedPlace">

          <img
            v-if="selectedPlace.firstimage"
            :src="selectedPlace.firstimage"
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
</template>