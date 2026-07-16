<script setup>
import { computed } from 'vue'
import PlaceCard from './PlaceCard.vue'

const keyword = defineModel({
  type: String,
  default: ''
})


const emit = defineEmits([
  'focus-place'
])

const filteredPlaces = computed(() => {
  if (!keyword.value.trim()) {
    return props.places
  }

  return props.places.filter(place =>
    place.title
      .toLowerCase()
      .includes(keyword.value.toLowerCase())
  )
})

const props = defineProps({
  places: Array,
  selectedPlace: Object,
  filters: Object,
})

function selectPlace(place) {
  // 사이드바 클릭은 지도 중심 이동만 요청
  emit('focus-place', place)
}
</script>

<template>
  <aside class="bg-white rounded-2xl shadow-lg border border-slate-200 h-[700px] flex flex-col">
    <div class="p-5 border-b">
      <h2 class="text-xl font-bold text-slate-800">관광지 목록</h2>
      <p class="text-sm text-slate-500 mt-1">총 {{ filteredPlaces.length }}개의 관광지</p>
    </div>

    <div class="flex-1 overflow-y-auto px-5 pb-5 space-y-4">
      <PlaceCard
        v-for="place in filteredPlaces"
        :key="place.contentid"
        :place="place"
        :selected="selectedPlace?.contentid === place.contentid"
        @select="selectPlace($event)"
      />

      <div v-if="filteredPlaces.length === 0" class="text-center text-slate-400 py-20">
        <div class="text-5xl mb-3">🔍</div>
        <p>검색 결과가 없습니다.</p>
      </div>
    </div>
  </aside>
</template>