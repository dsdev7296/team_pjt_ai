import { describe, it, expect, beforeEach, vi } from 'vitest'

// 브라우저의 localStorage 환경을 테스트 실행 전에 가상으로 구성합니다.
const localStorageMock = (() => {
  let store = {}
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString() },
    clear: () => { store = {} },
    removeItem: (key) => { delete store[key] }
  }
})()

// 글로벌 브라우저 환경에 Mocking 적용
vi.stubGlobal('localStorage', localStorageMock)

describe('LocalHub 게시판 로컬스토리지 통합 테스트', () => {
  
  // 각 테스트 케이스가 실행되기 전에 로컬스토리지를 깨끗이 비웁니다.
  beforeEach(() => {
    localStorage.clear()
  })

  // ==========================================
  // [테스트 1] 게시글 등록 검증
  // ==========================================
  it('게시글 등록 시 데이터가 localStorage에 정상적으로 배열 형태로 수록되어야 한다', () => {
    // 1. 등록할 가상의 게시글 데이터 준비
    const newPost = {
      id: 123456789,
      category: 'tourism',
      title: '수원 화성 가을 갈대밭 추천',
      content: '방화수류정 근처가 아주 예쁩니다.',
      password: 'mysecurepwd123', // 평문 저장 스펙
      createdAt: '2026-07-15'
    }

    // 2. 기존 글 목록을 로컬스토리지에서 가져오기 (처음엔 빈 배열)
    const existingPosts = JSON.parse(localStorage.getItem('localhub_posts') || '[]')
    existingPosts.unshift(newPost)

    // 3. 로컬스토리지에 세이브 실행
    localStorage.setItem('localhub_posts', JSON.stringify(existingPosts))

    // 4. 검증: 저장소에서 다시 꺼냈을 때 우리가 넣은 데이터가 온전히 존재해야 함
    const savedPosts = JSON.parse(localStorage.getItem('localhub_posts'))
    
    expect(savedPosts).toHaveLength(1)
    expect(savedPosts[0].title).toBe('수원 화성 가을 갈대밭 추천')
    expect(savedPosts[0].password).toBe('mysecurepwd123') // 비밀번호 평문 일치 확인
  })

  // ==========================================
  // [테스트 2] 비밀번호 일치 여부에 따른 삭제 검증
  // ==========================================
  it('게시글 삭제 요청 시, 올바른 비밀번호일 때만 데이터가 삭제되어야 한다', () => {
    // 1. 기존에 저장된 글이 하나 있다고 가정하고 세팅
    const targetPost = {
      id: 999,
      category: 'food',
      title: '양평 진짜 맛있는 해장국집',
      content: '국물이 끝내줍니다.',
      password: 'correct-password',
      createdAt: '2026-07-15'
    }
    localStorage.setItem('localhub_posts', JSON.stringify([targetPost]))

    // 2. 가상의 사용자가 입력한 비밀번호 시나리오 정의
    const wrongInputPassword = 'wrong-password'
    const correctInputPassword = 'correct-password'

    let currentPosts = JSON.parse(localStorage.getItem('localhub_posts'))

    // [시나리오 A] 잘못된 비밀번호를 입력했을 때
    const isWrongMatch = wrongInputPassword === currentPosts[0].password // 프론트엔드 일치 여부 판별 로직
    if (isWrongMatch) {
      // 비밀번호가 맞다면 삭제를 진행하지만, 틀렸으므로 이 블록은 실행되지 않음
      currentPosts = currentPosts.filter(p => p.id !== 999)
    }
    
    // 검증 A: 잘못 입력했으므로 삭제되지 않고 데이터 개수가 여전히 1개여야 함
    expect(currentPosts).toHaveLength(1)

    // [시나리오 B] 올바른 비밀번호를 입력했을 때
    const isCorrectMatch = correctInputPassword === currentPosts[0].password
    if (isCorrectMatch) {
      // 비밀번호가 일치하므로 실제 삭제 처리 진행 (해당 id를 필터로 걸러냄)
      currentPosts = currentPosts.filter(p => p.id !== 999)
      localStorage.setItem('localhub_posts', JSON.stringify(currentPosts))
    }

    // 검증 B: 올바르게 입력했으므로 데이터가 완벽히 삭제되어 빈 배열([])이 되어야 함
    const afterDeletePosts = JSON.parse(localStorage.getItem('localhub_posts'))
    expect(afterDeletePosts).toHaveLength(0)
  })
})