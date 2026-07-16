<script setup>
import { ref, onMounted, watch } from 'vue'

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

const map = ref(null)

const clusterer = ref(null)

const markers = {}

const infoWindows = {}

onMounted(() => {
  window.kakao.maps.load(() => {
    createMap()
    createMarkers()
  })
})

function createMap() {
  const container = document.getElementById('kakao-map')

  map.value = new window.kakao.maps.Map(container, {
    center: new window.kakao.maps.LatLng(
      37.5665,
      126.9780
    ),
    level: 8
  })
}

function createMarkers() {

  const markerList = []

  props.places.forEach((place) => {

    if (!place.mapx || !place.mapy) return

    const marker = new window.kakao.maps.Marker({

      position: new window.kakao.maps.LatLng(
        Number(place.mapy),
        Number(place.mapx)
      )

    })

    markers[place.contentid] = marker

    markerList.push(marker)

    const infoWindow = new window.kakao.maps.InfoWindow({

      content: `
      <div style="
        padding:10px;
        min-width:180px;
      ">
        <strong>${place.title}</strong>
      </div>
      `

    })

    infoWindows[place.contentid] = infoWindow

    window.kakao.maps.event.addListener(
      marker,
      'click',
      () => {

        closeAllInfoWindows()

        infoWindow.open(
          map.value,
          marker
        )

        moveTo(place)

        emit(
          'select-place',
          place
        )

      }
    )

  })

  clusterer.value =
    new window.kakao.maps.MarkerClusterer({

      map: map.value,

      averageCenter: true,

      minLevel: 7

    })

  clusterer.value.addMarkers(
    markerList
  )

}

function closeAllInfoWindows() {

  Object.values(infoWindows).forEach(
    infoWindow => {

      infoWindow.close()

    }
  )

}

function moveTo(place) {

  if (!place) return

  const moveLatLng =
    new window.kakao.maps.LatLng(

      Number(place.mapy),

      Number(place.mapx)

    )

  map.value.setCenter(
    moveLatLng
  )

  map.value.setLevel(4)

}

watch(

  () => props.selectedPlace,

  (place) => {

    if (!place) return

    moveTo(place)

    closeAllInfoWindows()

    const marker =
      markers[place.contentid]

    const infoWindow =
      infoWindows[place.contentid]

    if (marker && infoWindow) {

      infoWindow.open(
        map.value,
        marker
      )

    }

  }

)
import { computed } from 'vue'

const selectedPlace = computed(() => props.selectedPlace)
</script>
<template>
  <div class="relative w-full h-full">

    <!-- 카카오 지도 -->
    <div
      id="kakao-map"
      class="w-full h-[700px] rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
    ></div>

    <!-- 지도 위 안내 -->
    <div
      class="absolute top-4 left-4 bg-white/95 backdrop-blur px-4 py-3 rounded-xl shadow-lg border border-slate-200"
    >
      <h3 class="text-base font-bold text-slate-800">
        서울 관광지도
      </h3>

      <p class="text-sm text-slate-500 mt-1">
        관광지를 클릭하면 상세 정보를 확인할 수 있습니다.
      </p>
    </div>

    <!-- 선택된 관광지 미니 카드 -->
    <transition
      enter-active-class="transition duration-300"
      leave-active-class="transition duration-200"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-2"
    >
      <div
        v-if="selectedPlace"
        class="absolute bottom-5 left-5 w-80 bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200"
      >

        <!-- 이미지 -->
        <img
          v-if="selectedPlace.firstimage"
          :src="selectedPlace.firstimage"
          :alt="selectedPlace.title"
          class="w-full h-44 object-cover"
        >

        <div
          v-else
          class="w-full h-44 bg-slate-100 flex items-center justify-center text-slate-400"
        >
          이미지 없음
        </div>

        <!-- 내용 -->
        <div class="p-5">

          <div class="flex items-center justify-between">

            <h2 class="text-lg font-bold text-slate-800">
              {{ selectedPlace.title }}
            </h2>

            <span
              class="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700"
            >
              관광지
            </span>

          </div>

          <div class="mt-4 space-y-3 text-sm">

            <div>

              <p class="font-semibold text-slate-700">
                주소
              </p>

              <p class="text-slate-500">
                {{ selectedPlace.addr1 || '정보 없음' }}
              </p>

            </div>

            <div>

              <p class="font-semibold text-slate-700">
                전화번호
              </p>

              <p class="text-slate-500">
                {{ selectedPlace.tel || '정보 없음' }}
              </p>

            </div>

          </div>

        </div>

      </div>
    </transition>

  </div>
</template>