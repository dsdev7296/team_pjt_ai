<template>
  <div class="space-y-6 max-w-2xl mx-auto my-10 px-4">
    
    <div class="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm">
      <div v-if="isLoading" class="text-center py-12 text-slate-400">
        데이터를 불러오는 중입니다...
      </div>

      <div v-else-if="post" class="space-y-6">
        <div class="border-b border-slate-100 pb-4 mb-5 flex justify-between items-center">
          <button @click="goToList" class="text-sm font-bold text-slate-500 hover:text-blue-600 flex items-center gap-1 cursor-pointer transition-colors">
            ← 목록으로 돌아가기
          </button>
          
          <div class="flex items-center gap-2">
            <button 
              @click="handleLike"
              class="flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-full text-xs font-black transition-all cursor-pointer"
            >
              👍 {{ post.likes || 0 }} 추천
            </button>
            <span 
              class="text-xs font-black py-1.5 px-3.5 rounded-full"
              :class="getCategoryBadgeClass(post.category)"
            >
              {{ getCategoryLabel(post.category) }}
            </span>
          </div>
        </div>

        <div v-if="!isEditMode" class="space-y-6">
          <div>
            <h2 class="text-2xl font-black text-slate-900 leading-tight">{{ post.title }}</h2>
            <p class="text-xs text-slate-400 mt-3 font-semibold">
              등록일: {{ post.createdAt }} | 작성자: 익명 | 👀 조회수: {{ post.views || 0 }} | 👍 추천수: {{ post.likes || 0 }}
            </p>
          </div>

          <div class="text-slate-700 leading-relaxed min-h-[180px] whitespace-pre-wrap border-t border-slate-100 pt-6 text-sm">
            {{ post.content }}
          </div>

          <form @submit.prevent class="border-t border-slate-100 pt-6 flex flex-col sm:flex-row gap-3 justify-between items-center">
            <div class="flex gap-2 w-full sm:w-auto">
              <input 
                v-model="inputPassword"
                type="password" 
                autocomplete="current-password"
                placeholder="수정/삭제 비밀번호 입력"
                class="border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 w-full sm:w-48 text-slate-800 bg-white transition-all"
              />
            </div>
            
            <div class="flex gap-2 w-full sm:w-auto justify-end">
              <button 
                type="button"
                @click="handleEditInit" 
                class="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                수정하기
              </button>
              <button 
                type="button"
                @click="handleDelete" 
                class="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                삭제하기
              </button>
            </div>
          </form>
        </div>

        <div v-else class="space-y-5">
          <h3 class="font-extrabold text-slate-900 text-lg flex items-center gap-2">✏️ 게시글 수정</h3>
          
          <form @submit.prevent="handleEditSave" class="space-y-5">
            <div>
              <label class="block text-xs font-bold text-slate-500 mb-2">제목</label>
              <input 
                v-model="editForm.title"
                type="text" 
                class="w-full border border-slate-200 rounded-xl p-3 text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" 
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-500 mb-2">내용</label>
              <textarea 
                v-model="editForm.content"
                rows="10" 
                class="w-full border border-slate-200 rounded-xl p-3 text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              ></textarea>
            </div>

            <div class="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <button 
                type="button"
                @click="cancelEdit" 
                class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                수정 취소
              </button>
              <button 
                type="submit"
                class="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                저장하기
              </button>
            </div>
          </form>
        </div>
      </div>

      <div v-else class="text-center py-12 text-slate-400 font-medium">
        게시글을 찾을 수 없습니다. 이미 삭제되었거나 경로가 올바르지 않습니다.
        <div class="mt-4">
          <button @click="goToList" class="text-sm font-bold text-blue-600 hover:underline cursor-pointer">
            목록으로 가기
          </button>
        </div>
      </div>
    </div>

    <div v-if="post && !isEditMode" class="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm space-y-6">
      <h3 class="font-extrabold text-slate-900 text-base flex items-center gap-2">
        💬 댓글 <span class="text-blue-600 font-black text-sm">{{ post.comments ? post.comments.length : 0 }}</span>
      </h3>

      <form @submit.prevent="handleCommentSubmit" class="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
        <textarea 
          v-model="commentForm.content"
          required
          rows="3"
          placeholder="따뜻한 댓글을 남겨주세요."
          class="w-full border border-slate-200 rounded-lg p-3 text-xs text-slate-800 bg-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
        ></textarea>
        <div class="flex flex-col sm:flex-row gap-2 justify-between items-center">
          <input 
            v-model="commentForm.password"
            type="password"
            required
            placeholder="댓글 비밀번호"
            class="border border-slate-200 rounded-lg px-3 py-2 text-xs w-full sm:w-44 text-slate-800 bg-white focus:outline-none"
          />
          <button 
            type="submit"
            class="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-lg transition-colors cursor-pointer"
          >
            댓글 등록
          </button>
        </div>
      </form>

      <div class="divide-y divide-slate-100">
        <div v-if="!post.comments || post.comments.length === 0" class="py-6 text-center text-slate-400 text-xs">
          아직 댓글이 없습니다. 첫 댓글을 남겨보세요!
        </div>
        
        <div 
          v-for="comment in post.comments" 
          :key="comment.id"
          class="py-4 space-y-2 text-xs"
        >
          <div class="flex justify-between items-center text-slate-400">
            <span class="font-black text-slate-700">익명</span>
            <span>{{ comment.createdAt }}</span>
          </div>

          <div v-if="editingCommentId !== comment.id" class="text-slate-700 leading-relaxed text-sm whitespace-pre-wrap">
            {{ comment.content }}
          </div>
          <div v-else class="space-y-2">
            <textarea 
              v-model="commentEditContent"
              class="w-full border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
              rows="2"
            ></textarea>
            <div class="flex justify-end gap-1.5">
              <button @click="editingCommentId = null" class="px-2.5 py-1 bg-slate-100 text-slate-500 font-bold rounded">취소</button>
              <button @click="handleCommentEditSave(comment.id)" class="px-2.5 py-1 bg-blue-600 text-white font-bold rounded">저장</button>
            </div>
          </div>

          <div v-if="editingCommentId !== comment.id" class="flex justify-end items-center gap-2 pt-1">
            <input 
              v-model="commentPasswords[comment.id]"
              type="password"
              placeholder="댓글 비밀번호"
              class="border border-slate-200 rounded-lg px-2 py-1 text-[10px] w-24 text-slate-800 focus:outline-none focus:border-blue-500"
            />
            <button 
              @click="handleCommentEditInit(comment)" 
              class="text-slate-400 hover:text-slate-700 font-bold"
            >
              수정
            </button>
            <span class="text-slate-200">|</span>
            <button 
              @click="handleCommentDelete(comment.id)" 
              class="text-rose-400 hover:text-rose-600 font-bold"
            >
              삭제
            </button>
          </div>
        </div>
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
const inputPassword = ref('')
const isLoading = ref(true)

const isEditMode = ref(false)
const editForm = ref({
  title: '',
  content: ''
})

// 댓글 전용 상태 관리
const commentForm = ref({
  content: '',
  password: ''
})
const commentPasswords = ref({}) // 각 댓글별 비번 입력 바인딩용 객체
const editingCommentId = ref(null)
const commentEditContent = ref('')

const loadPostData = async (isFirstLoad = false) => {
  if (isFirstLoad) isLoading.value = true
  const stored = localStorage.getItem('localhub_posts')
  if (stored) {
    const allPosts = JSON.parse(stored)
    const foundPost = allPosts.find(p => String(p.id) === String(routeId))
    
    if (foundPost) {
      // 상세페이지 진입 시 실제 조회수 증가 처리 (단 한 번만 증가되게 안전 장치 마련)
      if (isFirstLoad) {
        foundPost.views = (foundPost.views || 0) + 1
        const updatedPosts = allPosts.map(p => String(p.id) === String(routeId) ? foundPost : p)
        localStorage.setItem('localhub_posts', JSON.stringify(updatedPosts))
      }
      post.value = foundPost
      // 댓글 배열 초기 가드
      if (!post.value.comments) {
        post.value.comments = []
      }
    } else {
      post.value = null
    }
  }
  
  inputPassword.value = '' 
  await nextTick()
  if (isFirstLoad) isLoading.value = false
}

onMounted(() => {
  loadPostData(true)
})

const goToList = () => {
  router.push('/board')
}

const cancelEdit = () => {
  isEditMode.value = false
  inputPassword.value = ''
}

// 1. 추천 기능 핸들러
const handleLike = () => {
  const stored = localStorage.getItem('localhub_posts')
  if (stored) {
    const allPosts = JSON.parse(stored)
    const updated = allPosts.map(p => {
      if (String(p.id) === String(routeId)) {
        return {
          ...p,
          likes: (p.likes || 0) + 1
        }
      }
      return p
    })
    localStorage.setItem('localhub_posts', JSON.stringify(updated))
    loadPostData(false) // 실시간 리프레시
  }
}

// 2. 댓글 등록 기능
const handleCommentSubmit = () => {
  if (!commentForm.value.content.trim() || !commentForm.value.password.trim()) {
    alert('댓글 내용과 비밀번호를 입력해 주세요.')
    return
  }

  const stored = localStorage.getItem('localhub_posts')
  if (stored) {
    const allPosts = JSON.parse(stored)
    const updated = allPosts.map(p => {
      if (String(p.id) === String(routeId)) {
        const comments = p.comments || []
        const newComment = {
          id: Date.now(),
          content: commentForm.value.content,
          password: commentForm.value.password,
          createdAt: new Date().toLocaleDateString('ko-KR') + ' ' + new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
        }
        return {
          ...p,
          comments: [newComment, ...comments]
        }
      }
      return p
    })

    localStorage.setItem('localhub_posts', JSON.stringify(updated))
    commentForm.value.content = ''
    commentForm.value.password = ''
    loadPostData(false)
    alert('댓글이 등록되었습니다.')
  }
}

// 3. 댓글 수정 초기화
const handleCommentEditInit = (comment) => {
  const enteredPass = commentPasswords.value[comment.id]
  if (!enteredPass || !enteredPass.trim()) {
    alert('댓글 수정 비밀번호를 먼저 입력해 주세요.')
    return
  }

  if (String(comment.password).trim() !== String(enteredPass).trim()) {
    alert('댓글 비밀번호가 올바르지 않습니다.')
    return
  }

  editingCommentId.value = comment.id
  commentEditContent.value = comment.content
}

// 4. 댓글 수정 저장
const handleCommentEditSave = (commentId) => {
  if (!commentEditContent.value.trim()) {
    alert('수정할 내용을 입력해 주세요.')
    return
  }

  const stored = localStorage.getItem('localhub_posts')
  if (stored) {
    const allPosts = JSON.parse(stored)
    const updated = allPosts.map(p => {
      if (String(p.id) === String(routeId)) {
        const updatedComments = p.comments.map(c => {
          if (c.id === commentId) {
            return { ...c, content: commentEditContent.value }
          }
          return c
        })
        return { ...p, comments: updatedComments }
      }
      return p
    })

    localStorage.setItem('localhub_posts', JSON.stringify(updated))
    editingCommentId.value = null
    commentPasswords.value[commentId] = ''
    loadPostData(false)
    alert('댓글이 수정되었습니다.')
  }
}

// 5. 댓글 삭제 기능
const handleCommentDelete = (commentId) => {
  const enteredPass = commentPasswords.value[commentId]
  if (!enteredPass || !enteredPass.trim()) {
    alert('댓글 삭제를 위해 비밀번호를 입력해 주세요.')
    return
  }

  const stored = localStorage.getItem('localhub_posts')
  if (stored) {
    const allPosts = JSON.parse(stored)
    const targetPost = allPosts.find(p => String(p.id) === String(routeId))
    if (!targetPost) return

    const targetComment = targetPost.comments.find(c => c.id === commentId)
    if (!targetComment) return

    if (String(targetComment.password).trim() !== String(enteredPass).trim()) {
      alert('비밀번호가 일치하지 않습니다!')
      return
    }

    if (confirm('댓글을 정말 삭제하시겠습니까?')) {
      const updated = allPosts.map(p => {
        if (String(p.id) === String(routeId)) {
          return {
            ...p,
            comments: p.comments.filter(c => c.id !== commentId)
          }
        }
        return p
      })

      localStorage.setItem('localhub_posts', JSON.stringify(updated))
      loadPostData(false)
      alert('댓글이 삭제되었습니다.')
    }
  }
}

const getCategoryLabel = (cat) => {
  const mapper = { tourism: '관광지 🗺️', shopping: '쇼핑 🛍️', culture: '문화시설 🎨', food: '맛집 🍕', free: '자유 💬' }
  return mapper[cat] || '기타'
}

const getCategoryBadgeClass = (cat) => {
  const classes = {
    tourism: 'bg-emerald-50 text-emerald-600',
    shopping: 'bg-blue-50 text-blue-500',
    culture: 'bg-purple-50 text-purple-600',
    food: 'bg-amber-50 text-amber-500',
    free: 'bg-slate-50 text-slate-500'
  }
  return classes[cat] || 'bg-slate-50 text-slate-500'
}

const handleEditInit = () => {
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
  inputPassword.value = ''
  alert('성공적으로 수정되었습니다!')
  loadPostData(false)
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