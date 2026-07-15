<template>
  <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
    
    <div v-if="isLoading" class="text-center py-12 text-slate-400">
      데이터를 불러오는 중입니다...
    </div>

    <div v-else-if="post" class="space-y-6">
      
      <div class="border-b border-slate-100 pb-4 mb-5 flex justify-between items-center">
        <button @click="goToList" class="text-sm font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1">
          ← 목록으로 돌아가기
        </button>
        <span class="text-xs bg-slate-100 text-slate-500 py-1 px-3 rounded-full font-bold">
          {{ getCategoryLabel(post.category) }}
        </span>
      </div>

      <div v-if="!isEditMode" class="space-y-6">
        <div>
          <h2 class="text-2xl font-black text-slate-900 leading-tight">{{ post.title }}</h2>
          <p class="text-xs text-slate-400 mt-2">등록일: {{ post.createdAt }} | 작성한 기기(로컬) 보관글</p>
        </div>

        <div class="text-slate-700 leading-relaxed min-h-[180px] whitespace-pre-wrap border-t border-slate-100 pt-4">
          {{ post.content }}
        </div>

        <form @submit.prevent class="border-t border-slate-100 pt-5 flex flex-col sm:flex-row gap-3 justify-between items-center">
          
          <div class="flex gap-2 w-full sm:w-auto">
            <input 
              v-model="inputPassword"
              type="password" 
              autocomplete="current-password"
              placeholder="수정/삭제 비밀번호 입력"
              class="border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500 w-full sm:w-48 text-slate-800 bg-white"
            />
          </div>
          
          <div class="flex gap-2 w-full sm:w-auto justify-end">
            <button 
              type="button"
              @click="handleEditInit" 
              class="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors"
            >
              수정하기
            </button>
            <button 
              type="button"
              @click="handleDelete" 
              class="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-colors"
            >
              삭제하기
            </button>
          </div>
        </form>
      </div>

      <div v-else class="space-y-5">
        <h3 class="font-bold text-slate-900 text-lg">✏️ 게시글 수정</h3>
        
        <form @submit.prevent="handleEditSave" class="space-y-5">
          <div>
            <label class="block text-xs font-bold text-slate-500 mb-1">제목</label>
            <input 
              v-model="editForm.title"
              type="text" 
              class="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500 text-slate-800" 
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-500 mb-1">내용</label>
            <textarea 
              v-model="editForm.content"
              rows="8" 
              class="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500 text-slate-800"
            ></textarea>
          </div>

          <div class="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button 
              type="button"
              @click="cancelEdit" 
              class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-lg transition-colors"
            >
              수정 취소
            </button>
            <button 
              type="submit"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors"
            >
              저장하기
            </button>
          </div>
        </form>
      </div>

    </div>

    <div v-else class="text-center py-12 text-slate-400">
      게시글을 찾을 수 없습니다. 이미 삭제되었거나 경로가 올바르지 않습니다.
      <div class="mt-4">
        <button @click="goToList" class="text-sm text-blue-600 hover:underline">
          목록으로 가기
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const routeId = route.params.id 

const post = ref(null)
// ★ [해결책 3, 4 적용] 반응형 유실을 막기 위해 정확하게 개별 ref 변수로 선언 및 공백 초기화
const inputPassword = ref('')
const isLoading = ref(true)

const isEditMode = ref(false)
const editForm = ref({
  title: '',
  content: ''
})

const loadPostData = async () => {
  isLoading.value = true
  const stored = localStorage.getItem('localhub_posts')
  if (stored) {
    const allPosts = JSON.parse(stored)
    post.value = allPosts.find(p => String(p.id) === String(routeId)) || null
  }
  
  // ★ 스크립트 단에서 데이터 동기화 리셋
  inputPassword.value = '' 
  
  await nextTick()
  isLoading.value = false
}

onMounted(() => {
  loadPostData()
})

const goToList = () => {
  router.push('/board')
}

const cancelEdit = () => {
  isEditMode.value = false
  inputPassword.value = ''
}

const getCategoryLabel = (cat) => {
  const mapper = { tourism: '관광지 🗺️', shopping: '쇼핑 🛍️', culture: '문화시설 🎨', food: '맛집 🍕' }
  return mapper[cat] || '기타'
}

const handleEditInit = () => {
  if (!inputPassword.value || !inputPassword.value.trim()) {
    alert('비밀번호를 입력해 주세요.')
    return
  }

  // ★ .value를 사용하여 데이터 값을 확실하게 추출 (해결책 4 적용)
  const storedPassword = String(post.value.password).trim()
  const enteredPassword = String(inputPassword.value).trim()

  if (enteredPassword !== storedPassword) {
    alert('비밀번호가 일치하지 않습니다!')
    return
  }

  editForm.value.title = post.value.title
  editForm.value.content = post.value.content
  isEditMode.value = true
}

const handleEditSave = () => {
  if (!editForm.value.title.trim() || !editForm.value.content.trim()) {
    alert('내용을 채워주세요.')
    return
  }

  const stored = localStorage.getItem('localhub_posts')
  if (stored) {
    let allPosts = JSON.parse(stored)
    
    allPosts = allPosts.map(p => {
      if (String(p.id) === String(routeId)) {
        return {
          ...p,
          title: editForm.value.title,
          content: editForm.value.content
        }
      }
      return p
    })

    localStorage.setItem('localhub_posts', JSON.stringify(allPosts))
  }
  
  isEditMode.value = false
  inputPassword.value = '' // 저장 완료 후 비밀번호 리셋
  alert('성공적으로 수정되었습니다!')
  loadPostData()
}

const handleDelete = () => {
  if (!inputPassword.value || !inputPassword.value.trim()) {
    alert('비밀번호를 입력해 주세요.')
    return
  }

  const storedPassword = String(post.value.password).trim()
  const enteredPassword = String(inputPassword.value).trim()

  if (enteredPassword !== storedPassword) {
    alert('비밀번호가 일치하지 않습니다!')
    return
  }

  if (confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
    const stored = localStorage.getItem('localhub_posts')
    if (stored) {
      let allPosts = JSON.parse(stored)
      allPosts = allPosts.filter(p => String(p.id) !== String(routeId))
      localStorage.setItem('localhub_posts', JSON.stringify(allPosts))
    }
    
    alert('게시글이 삭제되었습니다.')
    goToList()
  }
}
</script>