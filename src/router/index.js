import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MapView from '../views/MapView.vue'
import BoardView from '../views/BoardView.vue'
// 새로 만들 게시판 관련 컴포넌트들을 임포트합니다.
import BoardDetailView from '../views/BoardDetailView.vue'
import BoardCreateView from '../views/BoardCreateView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/map',
      name: 'map',
      component: MapView
    },
    {
      path: '/board',
      name: 'board',
      component: BoardView
    },
    // 1. 게시글 상세 보기 경로 (:id 는 동적 파라미터로, 글 번호가 들어갑니다)
    {
      path: '/board/:id',
      name: 'board-detail',
      component: BoardDetailView,
      props: true // URL 파라미터를 컴포넌트의 props로 전달받을 수 있게 설정
    },
    // 2. 게시글 작성 화면 경로
    {
      path: '/board/create',
      name: 'board-create',
      component: BoardCreateView
    }
  ]
})

export default router