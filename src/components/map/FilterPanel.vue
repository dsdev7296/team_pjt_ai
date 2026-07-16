<template>
  <div class="bg-white rounded-2xl shadow-lg p-6 w-80">

    <div class="flex justify-between items-center mb-5">
      <h2 class="text-lg font-bold">
        지도 필터
      </h2>

      <button
        @click="$emit('close')"
        class="text-gray-400 hover:text-gray-700 text-xl"
      >
        ✕
      </button>
    </div>

    <!-- 카테고리 -->
    <div class="mb-6">

      <div class="font-semibold mb-3">
        카테고리
      </div>

      <label
        class="flex items-center gap-3 py-2 cursor-pointer"
      >
        <input
          type="checkbox"
          v-model="localFilter.all"
          @change="toggleAll"
        >

        <span>전체</span>
      </label>

      <label
        class="flex items-center gap-3 py-2 cursor-pointer"
      >
        <input
          type="checkbox"
          v-model="localFilter.tour"
          @change="emitFilter"
        >

        <span>🏞 관광지</span>
      </label>

      <label
        class="flex items-center gap-3 py-2 cursor-pointer"
      >
        <input
          type="checkbox"
          v-model="localFilter.restaurant"
          @change="emitFilter"
        >

        <span>🍴 맛집</span>
      </label>

    </div>

    <!-- 반경 -->
    <div class="mb-6">

      <div class="font-semibold mb-4">
        반경 검색
      </div>

      <input
        type="range"
        min="1"
        max="10"
        step="1"
        v-model="localFilter.radius"
        @input="emitFilter"
        class="w-full"
      >

      <div class="text-center text-sm text-gray-500 mt-2">
        현재 지도 중심 기준 {{ localFilter.radius }}km
      </div>

    </div>

    <!-- 초기화 -->
    <button
      @click="resetFilter"
      class="w-full rounded-lg border py-3 hover:bg-gray-100 transition"
    >
      필터 초기화
    </button>

  </div>
</template>

<script setup>
import { reactive } from 'vue'

const emit = defineEmits([
  'update'
])

const localFilter = reactive({
  all: true,
  tour: true,
  restaurant: false,
  radius: 3
})

function emitFilter() {
  emit('update', {
    ...localFilter
  })
}

function toggleAll() {

  localFilter.tour = localFilter.all
  localFilter.restaurant = localFilter.all

  emitFilter()
}

function resetFilter() {

  localFilter.all = true
  localFilter.tour = true
  localFilter.restaurant = false
  localFilter.radius = 3

  emitFilter()
}
</script>