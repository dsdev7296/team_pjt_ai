# 🗺️ LocalHub

> **서울을 방문한 관광객이 관광 정보를 지도에서 확인하고, 여행 정보를 공유할 수 있는 커뮤니티 서비스**

# 🌐 Demo

### 배포 주소

🔗 https://your-netlify-url.netlify.app

> (여기에 서비스 화면 GIF 또는 캡처 이미지 추가)

---

# 🛠 Tech Stack

### Front-End

- Vue 3
- Vite
- Vue Router
- JavaScript
- CSS

### API

- OpenAI API

### Data

- JSON

### Collaboration

- Git
- GitHub
- Mattermost

### Deploy

- Netlify

---

# 🚀 실행 방법

### 1. 프로젝트 다운로드

```bash
git clone https://github.com/your-id/your-repository.git
```

### 2. 프로젝트 폴더 이동

```bash
cd your-repository
```

### 3. 패키지 설치

```bash
npm install
```

### 4. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성합니다.

```env
VITE_OPENAI_API_KEY=여기에_API_KEY_입력
```

> 실제 API Key는 절대 GitHub에 업로드하지 않습니다.

또는

`.env.example`

```env
VITE_OPENAI_API_KEY=
```

### 5. 개발 서버 실행

```bash
npm run dev
```

---

# ✅ 구현 기능 (MVP)

## Must Have

- [x] 관광지 / 쇼핑 / 문화시설 지도 표시
- [x] 게시판 CRUD
- [x] 카테고리별 게시판
- [x] 조회수 기능
- [x] 추천 기능
- [x] OpenAI 챗봇
- [x] Vue Router를 이용한 페이지 이동
- [x] Netlify 배포

## Should Have

- [x] 지도 시각화
- [x] 관광 정보 제공
- [x] 여행 정보 공유 커뮤니티

---

# 📂 폴더 구조

```
src
├── assets/data        # 관광지, 쇼핑, 문화시설 JSON 데이터
├── components         # Header, Footer, Chatbot 등 공통 컴포넌트
├── router             # Vue Router
├── views              # Home, Map, Board 페이지
└── App.vue
```

---

# 👨‍👩‍👧‍👦 팀 구성 / 역할

| 이름   | 담당                     |
| ---- | ---------------------- |
| 김도성  | 게시판 CRUD, Router 연결    |
| 이아현  | 지도 기능, JSON 데이터 연동     |
| 권오훈  | OpenAI API 연동 및 챗봇 구현  |
| 팀 전체 | 기획, 테스트, Git Merge, 배포 |

---

# 🤝 협업 방식

### 협업 도구

- GitHub
- Mattermost

### 브랜치 전략

- 기능별 브랜치 생성 (`feature/map`, `feature/board`, `feature/chatbot`)
- 기능 개발 완료 후 Merge
- Merge마다 전체 기능 테스트 진행
- 충돌 발생 시 팀원 간 협업하여 해결

### 커밋 방식

- 기능 단위로 Commit
- 기능 추가 후 Merge 및 통합 테스트 진행

---

# 📌 프로젝트 소개

## 🏠 Home

- 지도 페이지 이동
- 게시판 페이지 이동
- 챗봇 이용

---

## 🗺️ Map

서울의 관광 정보를 지도에서 제공합니다.

### 제공 데이터

- 관광지
- 쇼핑
- 문화시설

### 기능

- 지도에 위치 핀 표시
- 관광 정보 확인

---

## 📝 Community

카테고리별 게시판을 제공합니다.

### 카테고리

- 관광지
- 쇼핑
- 문화시설
- 맛집
- 자유

### 기능

- 게시글 작성
- 게시글 조회
- 게시글 수정
- 게시글 삭제
- 추천 기능
- 조회수 기능
- 추천순 정렬
- 조회수순 정렬

---

## 🤖 Chatbot

OpenAI API를 활용하여 관광 정보를 안내하는 AI 챗봇을 제공합니다.

### 기능

제공된 3개의 DB(관광지, 문화시설, 쇼핑)을 API에 연동
연관검색어로 추천되는 리스트 중 5개를 무작위로 뽑아서 챗봇 답변으로 제공
제시된 단어나 문장에서 연상될 수 있는 관련 분야는 완전일치가 아니더라도 출력
EX) 쇼핑 입력 시 - 완구, 문구, 꽃, 등의 연관단어가 포함되면 함께 출력 리스트에 포함

---

# 📄 License

본 프로젝트는 SSAFY 16기 스타트캠프 바이브코딩을 활용한 팀 PJT를 위해 제작되었습니다.
