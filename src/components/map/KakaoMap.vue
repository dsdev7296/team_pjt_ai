<script setup>
import { onMounted, onBeforeUnmount, watch } from 'vue'

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

const emit = defineEmits([
  'select-place',
])

// ==========================
// Kakao Map 객체
// ==========================
let map = null
// let clusterer = null

// 현재 선택된 마커 하나만 관리
let currentMarker = null
let currentInfoWindow = null

// 관광지별 Marker / InfoWindow 저장
// const markers = new Map()
// const infoWindows = new Map()

// 지도 생성 여부
let initialized = false

// ==========================
// 최초 실행
// ==========================
onMounted(() => {
  if (!window.kakao || !window.kakao.maps) {
    console.error('Kakao Map SDK가 로드되지 않았습니다.')
    return
  }

  window.kakao.maps.load(() => {
    createMap()
  })
})

onBeforeUnmount(() => {
  clearInfoWindows()

  if (clusterer) {
    clusterer.clear()
    clusterer = null
  }

  markers.clear()
  infoWindows.clear()

  map = null
})

// ==========================
// 지도 생성
// ==========================
function createMap() {

  if (initialized) return

  const container = document.getElementById('kakao-map')

  if (!container) {
    console.error('지도 컨테이너를 찾을 수 없습니다.')
    return
  }

  map = new window.kakao.maps.Map(container, {
    center: new window.kakao.maps.LatLng(
      37.5665,
      126.9780
    ),
    level: 8,
  })

  // 클러스터는 단 한 번만 생성
  clusterer = new window.kakao.maps.MarkerClusterer({
    map,
    averageCenter: true,
    minLevel: 7,
  })

  initialized = true
}

// ==========================
// 모든 InfoWindow 닫기
// ==========================
// function clearInfoWindows() {

//   infoWindows.forEach((infoWindow) => {
//     infoWindow.close()
//   })

// }
// ==========================
// 마커 생성 (최초 1회)
// ==========================
// function createMarkers() {

//   const markerList = []

//   props.places.forEach((place) => {

//     if (!place.mapx || !place.mapy) return

//     const position = new window.kakao.maps.LatLng(
//       Number(place.mapy),
//       Number(place.mapx)
//     )

//     // Marker 생성
//     const marker = new window.kakao.maps.Marker({
//       position,
//     })

//     markers.set(place.contentid, marker)
//     markerList.push(marker)

//     // InfoWindow 생성
//     const infoWindow = new window.kakao.maps.InfoWindow({
//       content: `
//         <div
//           style="
//             padding:10px;
//             min-width:180px;
//             font-size:14px;
//             font-weight:bold;
//           "
//         >
//           ${place.title}
//         </div>
//       `,
//     })

//     infoWindows.set(place.contentid, infoWindow)

//     // Marker 클릭 이벤트
//     window.kakao.maps.event.addListener(
//       marker,
//       'click',
//       () => {

//         clearInfoWindows()

//         infoWindow.open(map, marker)

//         moveMap(place)

//         emit('select-place', place)

//       }
//     )

//   })

// ==========================
// 선택한 장소로 이동 + 마커 표시
// ==========================
function moveMap(place) {

  if (!map || !place) return

  // 기존 마커 제거
  if (currentMarker) {
    currentMarker.setMap(null)
  }

  // 기존 정보창 제거
  if (currentInfoWindow) {
    currentInfoWindow.close()
  }

  const position = new window.kakao.maps.LatLng(
    Number(place.mapy),
    Number(place.mapx)
  )

  // 새 마커 생성
  currentMarker = new window.kakao.maps.Marker({
    map,
    position,
  })

  // 정보창 생성
  currentInfoWindow = new window.kakao.maps.InfoWindow({
    content: `
      <div style="padding:8px 12px;font-weight:bold;">
        ${place.title}
      </div>
    `,
  })

  currentInfoWindow.open(map, currentMarker)

  map.panTo(position)

  emit('select-place', place)
}

//   // Marker는 한 번만 Clusterer에 등록
//   clusterer.addMarkers(markerList)

// }
// ==========================
// 선택된 관광지 변경
// ==========================
// watch(
//   () => props.selectedPlace,
//   (place) => {

//     if (!place) return

//     moveMap(place)

//     clearInfoWindows()

//     const marker = markers.get(place.contentid)
//     const infoWindow = infoWindows.get(place.contentid)

//     if (marker && infoWindow) {
//       infoWindow.open(map, marker)
//     }

//   }
// )


// ==========================
// places 변경
// (검색 결과가 변경될 때)
// ==========================
// watch(
//   () => props.places,
//   (newPlaces) => {

//     if (!clusterer) return

//     // 기존 마커 숨기기
//     markers.forEach((marker) => {
//       marker.setMap(null)
//     })

//     clusterer.clear()

//     const visibleMarkers = []

//     newPlaces.forEach((place) => {

//       const marker = markers.get(place.contentid)

//       if (!marker) return

//       visibleMarkers.push(marker)

//     })

//     clusterer.addMarkers(visibleMarkers)

//   }
// )

watch(
  () => props.selectedPlace,
  (place) => {
    if (!place) return
    moveMap(place)
  }
)

// ==========================
// 부모(MapView)에서 호출
// ==========================
defineExpose({

  moveMap(place) {

    if (!place) return

    moveMap(place)

  },

})


// ==========================
// 지도 크기 변경 대응
// ==========================
window.addEventListener("resize", () => {

  if (!map) return

  map.relayout()

})
</script>

<template>
  <div class="relative w-full">

    <!-- Kakao Map -->
    <div
      id="kakao-map"
      class="w-full h-[700px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white"
    ></div>

  </div>
</template>

<style scoped>
#kakao-map {
  width: 100%;
  height: 700px;
}

/* 카카오맵 타일 깜빡임 완화 */
#kakao-map * {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transform: translateZ(0);
}

/* 지도 컨테이너 GPU 가속 */
#kakao-map {
  will-change: transform;
}

/* 이미지 리렌더링 방지 */
#kakao-map img {
  max-width: none !important;
}

/* outline 제거 */
#kakao-map:focus {
  outline: none;
}
</style>