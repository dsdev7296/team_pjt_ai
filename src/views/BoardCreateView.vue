<template>
  <div class="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm max-w-2xl mx-auto my-10">
    <h2 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
      <span class="w-1.5 h-6 bg-blue-600 rounded-full"></span>
      새 게시글 작성
    </h2>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div>
        <label class="block text-sm font-bold text-slate-700 mb-2">카테고리</label>
        <select
          v-model="form.category"
          class="w-full border border-slate-200 rounded-xl p-3 text-sm text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white transition-all"
        >
          <option value="tourism">관광지 🗺️</option>
          <option value="shopping">쇼핑 🛍️</option>
          <option value="culture">문화시설 🎨</option>
          <option value="food">맛집 🍕</option>
          <option value="free">자유 💬</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-bold text-slate-700 mb-2">제목</label>
        <input
          ref="titleInput"
          v-model="form.title"
          type="text"
          required
          autocomplete="off"
          class="w-full border border-slate-200 rounded-xl p-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
          placeholder="제목을 입력하세요"
        />
      </div>

      <div>
        <label class="block text-sm font-bold text-slate-700 mb-2">내용</label>
        <textarea
          v-model="form.content"
          rows="10"
          required
          class="w-full border border-slate-200 rounded-xl p-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
          placeholder="내용을 입력하세요"
        ></textarea>
      </div>

      <div>
        <label class="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-1.5">
          수정/삭제 비밀번호
          <span class="text-xs font-normal text-slate-400">(브라우저 로컬 저장소에 저장됩니다)</span>
        </label>
        <input
          v-model="form.password"
          type="password"
          required
          autocomplete="new-password"
          class="w-full border border-slate-200 rounded-xl p-3 text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
          placeholder="비밀번호를 입력하세요"
        />
      </div>

      <p v-if="errorMessage" class="text-sm font-bold text-rose-600">
        {{ errorMessage }}
      </p>

      <div class="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <button
          type="button"
          @click="goToBoard"
          class="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-sm font-bold transition-all cursor-pointer"
        >
          취소
        </button>
        <button
          type="submit"
          :disabled="isSubmitting"
          class="px-5 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-blue-100 cursor-pointer"
        >
          {{ isSubmitting ? '등록 중...' : '등록 완료' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { nextTick, onActivated, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const titleInput = ref(null)
const isSubmitting = ref(false)
const errorMessage = ref('')

const createInitialForm = () => ({
  category: 'tourism',
  title: '',
  content: '',
  password: ''
})

const form = reactive(createInitialForm())

const resetForm = async () => {
  Object.assign(form, createInitialForm())
  errorMessage.value = ''
  isSubmitting.value = false

  await nextTick()
  titleInput.value?.focus()
}

const goToBoard = async () => {
  document.activeElement?.blur()
  await router.push('/board')
}

const handleSubmit = async () => {
  if (isSubmitting.value) return

  const title = form.title.trim()
  const content = form.content.trim()
  const password = form.password.trim()

  if (!title || !content || !password) {
    errorMessage.value = '제목, 내용, 비밀번호를 모두 입력해 주세요.'
    await nextTick()
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    const existingPosts = JSON.parse(
      localStorage.getItem('localhub_posts') || '[]'
    )

    const newPost = {
      id: Date.now(),
      category: form.category,
      title,
      content,
      password,
      createdAt: new Date().toLocaleDateString('ko-KR'),
      views: 0,
      likes: 0,
      comments: []
    }

    existingPosts.unshift(newPost)
    localStorage.setItem('localhub_posts', JSON.stringify(existingPosts))

    // alert()를 사용하면 라우터 이동 후 브라우저 포커스가 꼬일 수 있으므로
    // 게시판에서 보여줄 안내 문구를 sessionStorage로 전달합니다.
    sessionStorage.setItem('board_notice', '게시글이 성공적으로 등록되었습니다.')

    document.activeElement?.blur()
    await router.push('/board')
  } catch (error) {
    console.error('게시글 저장 실패:', error)
    errorMessage.value = '게시글 저장 중 오류가 발생했습니다.'
    isSubmitting.value = false
  }
}

onMounted(resetForm)
onActivated(resetForm)
</script>
