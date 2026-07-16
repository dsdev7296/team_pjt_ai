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
          v-model="form.title"
          type="text" 
          required
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
          <span class="text-xs font-normal text-slate-400">(암호화 없이 브라우저 로컬 저장소에 안전 보관됩니다)</span>
        </label>
        <input 
          v-model="form.password"
          type="password" 
          required
          class="w-full border border-slate-200 rounded-xl p-3 text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" 
          placeholder="비밀번호를 입력하세요" 
        />
      </div>

      <div class="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <button 
          type="button" 
          @click="$router.push('/board')" 
          class="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-sm font-bold transition-all cursor-pointer"
        >
          취소
        </button>
        <button 
          type="submit" 
          class="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-blue-100 cursor-pointer"
        >
          등록 완료
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = ref({
  category: 'tourism',
  title: '',
  content: '',
  password: ''
})

const handleSubmit = () => {
  const existingPosts = JSON.parse(localStorage.getItem('localhub_posts') || '[]')
  
  const newPost = {
    id: Date.now(),
    category: form.value.category,
    title: form.value.title,
    content: form.value.content,
    password: form.value.password,
    createdAt: new Date().toLocaleDateString('ko-KR'),
    // 신규 작성 글의 기본 카운터 구조 강제 세팅
    views: 0,
    likes: 0,
    comments: []
  }

  existingPosts.unshift(newPost)
  localStorage.setItem('localhub_posts', JSON.stringify(existingPosts))

  alert('게시글이 성공적으로 등록되었습니다!')
  router.push('/board')
}
</script>