<script setup>
const props = defineProps({
  place: {
    type: Object,
    required: true
  },

  selected: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'select'
])

function selectPlace() {
  emit('select', props.place)
}
</script>

<template>
  <div
    @click="selectPlace"
    class="bg-white rounded-2xl shadow-sm border p-4 cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
    :class="selected
      ? 'border-blue-500 ring-2 ring-blue-200'
      : 'border-slate-200'"
  >

    <!-- 이미지 -->
    <img
    v-if="place.firstimage || place.firstimage2"
    :src="place.firstimage || place.firstimage2"
    :alt="place.title"
    class="w-full h-40 object-cover rounded-xl"
  />

    <div
      v-else
      class="w-full h-40 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400"
    >
      이미지 없음
    </div>

    <!-- 내용 -->
    <div class="mt-4">

      <div class="flex items-start justify-between">

        <h3 class="font-bold text-slate-800 text-lg leading-snug">
          {{ place.title }}
        </h3>

        <span
          class="ml-2 shrink-0 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
        >
          관광지
        </span>

      </div>

      <p
        class="text-sm text-slate-500 mt-3 line-clamp-2"
      >
        {{ place.addr1 || '주소 정보 없음' }}
      </p>

      <div
        class="mt-4 flex items-center justify-between"
      >

        <div
          class="text-xs text-slate-400"
        >
          관광지
        </div>

        <button
          class="text-blue-600 text-sm font-semibold hover:text-blue-700"
        >
          자세히 보기 →
        </button>

      </div>

    </div>

  </div>
</template>