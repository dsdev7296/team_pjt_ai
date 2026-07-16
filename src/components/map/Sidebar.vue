<script setup>
import { computed } from 'vue'
import SearchBar from './SearchBar.vue'
import PlaceCard from './PlaceCard.vue'

const keyword = defineModel({
  type: String,
  default: ''
})

const props = defineProps({
  places: {
    type: Array,
    required: true
  },

  selectedPlace: {
    type: Object,
    default: null
  }
})

const emit = defineEmits([
  'select-place'
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

function selectPlace(place) {
  emit('select-place', place)
}
</script>

<template>

  <aside
    class="bg-white rounded-2xl shadow-lg border border-slate-200 h-[700px] flex flex-col"
  >

    <!-- 제목 -->
    <div
      class="p-5 border-b"
    >

      <h2
        class="text-xl font-bold text-slate-800"
      >
        관광지 목록
      </h2>

      <p
        class="text-sm text-slate-500 mt-1"
      >
        총 {{ filteredPlaces.length }}개의 관광지
      </p>

    </div>

    <!-- 검색 -->
    <div
      class="p-5"
    >

      <SearchBar
        v-model="keyword"
      />

    </div>

    <!-- 목록 -->
    <div
      class="flex-1 overflow-y-auto px-5 pb-5 space-y-4"
    >

      <PlaceCard
        v-for="place in places"
        :key="place.contentid"
        :place="place"
        :selected="selectedPlace?.contentid === place.contentid"
        @select="emit('select-place', $event)"
      />

      <!-- 검색 결과 없음 -->
      <div
        v-if="filteredPlaces.length === 0"
        class="text-center text-slate-400 py-20"
      >

        <div class="text-5xl mb-3">
          🔍
        </div>

        <p>
          검색 결과가 없습니다.
        </p>

      </div>

    </div>

  </aside>

</template>