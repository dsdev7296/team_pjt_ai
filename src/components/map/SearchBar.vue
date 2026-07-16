<script setup>
const keyword = defineModel({
  type: String,
  default: ''
})
</script>

<template>
  <div class="relative">

    <!-- 검색 아이콘 -->
    <svg
      class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>

    <!-- 입력창 -->
    <input
      v-model="keyword"
      type="text"
      placeholder="관광지를 검색하세요."
      class="
        w-full
        pl-12
        pr-4
        py-3
        rounded-xl
        borderf
        border-slate-300
        bg-white
        text-slate-700
        placeholder:text-slate-400
        focus:outline-none
        focus:ring-2
        focus:ring-blue-500
        focus:border-blue-500
        transition
      "
    />

  </div>
</template>