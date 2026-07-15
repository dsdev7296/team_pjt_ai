<template>
  <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
    <h2 class="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
      <span class="w-1.5 h-5 bg-blue-600 rounded-full"></span>
      새 게시글 작성
    </h2>
    
    <form @submit.prevent="handleSubmit" class="space-y-5">
      <div>
        <label class="block text-sm font-bold text-slate-700 mb-1.5">카테고리</label>
        <select 
          v-model="form.category" 
          class="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500"
        >
          <option value="tourism">관광지 🗺️</option>
          <option value="shopping">쇼핑 🛍️</option>
          <option value="culture">문화시설 🎨</option>
          <option value="food">맛집 🍕</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-bold text-slate-700 mb-1.5">제목</label>
        <input 
          v-model="form.title"
          type="text" 
          required
          class="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500" 
          placeholder="제목을 입력하세요" 
        />
      </div>

      <div>
        <label class="block text-sm font-bold text-slate-700 mb-1.5">내용</label>
        <textarea 
          v-model="form.content"
          rows="8" 
          required
          class="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500" 
          placeholder="내용을 입력하세요"
        ></textarea>
      </div>

      <div>
        <label class="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
          수정/삭제 비밀번호
          <span class="text-xs font-normal text-slate-400">(암호화 없이 브라우저에 저장됩니다)</span>
        </label>
        <input 
          v-model="form.password"
          type="password" 
          required
          class="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500" 
          placeholder="비밀번호를 입력하세요" 
        />
      </div>

      <div class="flex justify-end gap-3 pt-2">
        <button 
          type="button" 
          @click="$router.push('/board')" 
          class="px-5 py-2.5 bg-slate-100 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors"
        >
          취소
        </button>
        <button 
          type="submit" 
          class="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
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
  // 1. 기존 localStorage에 저장된 게시글 배열 가져오기 (없으면 빈 배열)
  const existingPosts = JSON.parse(localStorage.getItem('localhub_posts') || '[]')
  
  // 2. 새 게시글 데이터 객체 생성
  const newPost = {
    id: Date.now(), // 고유 ID로 타임스탬프 활용
    category: form.value.category,
    title: form.value.title,
    content: form.value.content,
    password: form.value.password, // 평문 비밀번호 저장 (교육용 설계)
    createdAt: new Date().toLocaleDateString('ko-KR')
  }

  // 3. 기존 배열의 맨 앞에 새 글 추가
  existingPosts.unshift(newPost)

  // 4. localStorage에 다시 JSON 문자열로 저장
  localStorage.setItem('localhub_posts', JSON.stringify(existingPosts))

  alert('게시글이 등록되었습니다!')
  router.push('/board')
}
</script>