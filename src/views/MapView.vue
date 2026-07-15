<script setup>
import { onMounted } from 'vue'
import tourist from '@/assets/data/서울_관광지.json'

const places = tourist.items

onMounted(() => {
  window.kakao.maps.load(() => {
    const container = document.getElementById('map')

    const options = {
      center: new window.kakao.maps.LatLng(37.5665, 126.9780),
      level: 7,
    }

    const map = new window.kakao.maps.Map(container, options)

    // 관광지마다 마커 생성
    places.forEach((place) => {
      if (!place.mapx || !place.mapy) return

      new window.kakao.maps.Marker({
        map,
        position: new window.kakao.maps.LatLng(
          Number(place.mapy),
          Number(place.mapx)
        ),
      })
    })
  })
})
</script>

<template>
  <div class="space-y-8">

    <!-- 지도 -->
    <div class="bg-white rounded-xl p-6 shadow">
      <h2 class="text-2xl font-bold mb-4">
        서울 관광지도
      </h2>

      <div
        id="map"
        class="w-full h-[600px] rounded-lg border"
      ></div>
    </div>

    <!-- 관광지 목록 -->
    <div class="bg-white rounded-xl p-6 shadow">
      <h2 class="text-xl font-bold mb-4">
        관광지 목록 ({{ places.length }}개)
      </h2>

      <div
        v-for="place in places"
        :key="place.contentid"
        class="border-b py-2 hover:bg-slate-50"
      >
        <div class="font-semibold">
          {{ place.title }}
        </div>

        <div class="text-sm text-gray-500">
          {{ place.addr1 }}
        </div>
      </div>
    </div>

  </div>
</template>