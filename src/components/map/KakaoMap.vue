<script setup>
import { onMounted, onBeforeUnmount, watch, ref } from 'vue'

const props = defineProps({
  places: {
    type: Array,
    required: true,
  },
  selectedPlace: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['select-place'])

const mapContainer = ref(null)

let map = null
let currentMarker = null
let currentInfoWindow = null
let destroyed = false

function handleResize() {
  if (!map || destroyed) return
  map.relayout()
}

function createMap() {
  if (destroyed || map || !mapContainer.value) return

  map = new window.kakao.maps.Map(mapContainer.value, {
    center: new window.kakao.maps.LatLng(
      37.5665,
      126.9780
    ),
    level: 8,
  })
}

function moveMap(place) {
  if (!map || !place || destroyed) return

  const latitude = Number(place.mapy)
  const longitude = Number(place.mapx)

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {
    console.error('잘못된 좌표입니다.', place)
    return
  }

  if (currentInfoWindow) {
    currentInfoWindow.close()
    currentInfoWindow = null
  }

  if (currentMarker) {
    currentMarker.setMap(null)
    currentMarker = null
  }

  const position = new window.kakao.maps.LatLng(
    latitude,
    longitude
  )

  currentMarker = new window.kakao.maps.Marker({
    map,
    position,
  })

  currentInfoWindow = new window.kakao.maps.InfoWindow({
    content: `
      <div style="padding:8px 12px;font-weight:bold;white-space:nowrap;">
        ${String(place.title ?? '')}
      </div>
    `,
  })

  currentInfoWindow.open(map, currentMarker)
  map.panTo(position)

  emit('select-place', place)
}

onMounted(() => {
  destroyed = false

  window.addEventListener('resize', handleResize)

  if (!window.kakao?.maps) {
    console.error('Kakao Map SDK가 로드되지 않았습니다.')
    return
  }

  window.kakao.maps.load(() => {
    if (destroyed) return
    createMap()
  })
})

onBeforeUnmount(() => {
  destroyed = true

  window.removeEventListener('resize', handleResize)

  if (currentInfoWindow) {
    currentInfoWindow.close()
    currentInfoWindow = null
  }

  if (currentMarker) {
    currentMarker.setMap(null)
    currentMarker = null
  }

  map = null
})

watch(
  () => props.selectedPlace,
  (place) => {
    if (place) {
      moveMap(place)
    }
  }
)

defineExpose({
  moveMap,
})
</script>

<template>
  <div class="relative w-full">
    <div
      ref="mapContainer"
      class="kakao-map w-full h-[700px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white"
    ></div>
  </div>
</template>

<style scoped>
.kakao-map {
  width: 100%;
  height: 700px;
}

.kakao-map :deep(img) {
  max-width: none !important;
}
</style>