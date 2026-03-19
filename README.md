# TMDB AI RECO

TMDB API와 OpenAI API를 활용해  
사용자가 좋아하는 영화를 선택하면 영화 취향을 분석하고,  
비슷한 분위기의 영화를 추천해주는 React + Next.js 기반 프로젝트입니다.

---

## 1. 프로젝트 개요

이 프로젝트는 단순 영화 검색 서비스를 넘어서,  
사용자의 선택 데이터를 기반으로 AI가 취향을 분석하고  
그 결과를 다시 영화 추천으로 연결하는 흐름을 구현하는 것을 목표로 했습니다.

핵심 흐름은 아래와 같습니다.

- TMDB에서 인기 영화 목록 조회
- 영화 검색 기능 제공
- 영화 상세 페이지 제공
- 좋아하는 영화 선택
- OpenAI를 통한 취향 분석
- AI 추천 영화 제안
- 추천 결과를 실제 TMDB 영화 데이터와 연결

---

## 2. 기술 스택

### Frontend
- Next.js 16.1.6
- React 19
- TypeScript
- SCSS Module

### API / Server
- TMDB API
- OpenAI API
- Next.js App Router
- Route Handler

### Deploy
- Vercel 예정

---

## 3. 프로젝트 생성 및 초기 설정

프로젝트는 `create-next-app` 기반으로 생성했습니다.

- TypeScript 사용
- ESLint 사용
- Tailwind 미사용
- `src/` 디렉터리 사용
- App Router 사용

스타일링은 Tailwind 대신 **SCSS**로 구성했고,  
전역 스타일과 컴포넌트 단위 스타일을 분리하기 위해 아래 구조로 세팅했습니다.

```bash
src/
  app/
  components/
  lib/
  styles/
  types/
```

---

## 4. 환경 변수 설정

민감한 키 값은 모두 `.env.local`에 관리했습니다.

```bash
TMDB_BEARER_TOKEN=YOUR_TMDB_BEARER_TOKEN
TMDB_BASE_URL=https://api.themoviedb.org/3
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
```

---

## 6. 폴더 구조

현재 프로젝트는 역할별로 파일을 분리해 관리하고 있습니다.

```bash
src/
├─ app/
│  ├─ api/
│  │  ├─ analyze-taste/
│  │  │  └─ route.ts
│  │  └─ tmdb/
│  │     └─ popular/
│  │        └─ route.ts
│  ├─ movie/
│  │  └─ [id]/
│  │     ├─ page.tsx
│  │     └─ page.module.scss
│  ├─ globals.scss
│  ├─ layout.tsx
│  ├─ page.tsx
│  └─ page.module.scss
├─ components/
│  ├─ AppFooter/
│  ├─ AppHeader/
│  ├─ MovieCard/
│  ├─ MoviePicker/
│  ├─ Pagination/
│  ├─ RecommendedMovieCard/
│  └─ SearchForm/
├─ lib/
│  ├─ analyze-taste.ts
│  ├─ movie.ts
│  ├─ openai.ts
│  ├─ tmdb-image.ts
│  └─ tmdb.ts
├─ styles/
│  ├─ _mixins.scss
│  ├─ _reset.scss
│  └─ _variables.scss
└─ types/
   ├─ movie.ts
   └─ taste.ts
```

각 폴더의 역할은 아래와 같습니다.

- `app/`: 페이지, 레이아웃, 전역 스타일, API Route Handler를 관리합니다.
- `components/`: 재사용 가능한 UI 컴포넌트를 관리합니다.
- `lib/`: TMDB/OpenAI 연동, 비즈니스 로직, 공통 유틸을 분리합니다.
- `styles/`: reset, 변수, mixin 같은 공통 스타일 자산을 관리합니다.
- `types/`: 영화 데이터와 AI 분석 응답 타입을 정리합니다.

---

## 7. TMDB 연동

TMDB 관련 코드는 한 파일에 몰아넣지 않고 역할별로 분리했습니다.
이렇게 해두면 재사용성이 좋아지고, API 변경이 생겨도 수정 범위를 줄일 수 있습니다.

### 7-1. 서버 전용 fetch 유틸 작성

`src/lib/tmdb.ts`에서 TMDB 전용 fetch 함수 `tmdbFetch`를 만들었습니다.

주요 포인트는 아래와 같습니다.

- `server-only`로 서버 전용 모듈임을 명확히 설정
- `TMDB_BASE_URL`, `TMDB_BEARER_TOKEN` 환경 변수를 안전하게 사용
- 공통 헤더(`Authorization`, `Accept`)를 한 곳에서 처리
- 쿼리스트링 조합 로직 분리
- `next: { revalidate: 3600 }` 설정으로 캐싱 적용
- 응답 실패 시 예외를 던져 상위에서 처리 가능하도록 구성

이 구조 덕분에 이후 TMDB 호출은 모두 `tmdbFetch('/movie/popular')` 같은 형태로 단순화할 수 있었습니다.

### 7-2. 영화 관련 유틸 분리

`src/lib/movie.ts`에는 영화 도메인에 관련된 함수만 모았습니다.

현재 구현된 함수는 아래와 같습니다.

- `getPopularMovies(page)`
- `searchMovies(query, page)`
- `searchMovieOne(query)`
- `getMovieDetail(movieId)`

특히 `getMovieDetail`은 상세 페이지를 풍부하게 만들기 위해 `append_to_response`를 사용했습니다.

```ts
append_to_response: 'credits,keywords,videos,release_dates,watch/providers,recommendations,similar'
```

덕분에 상세 페이지에서 한 번의 호출로 아래 정보들을 함께 사용할 수 있습니다.

- 출연진 / 제작진
- 키워드
- 영상 정보
- 국가별 개봉 및 등급 정보
- 시청 제공처
- 추천 영화 / 비슷한 영화

### 7-3. 이미지 URL 유틸 분리

TMDB는 이미지 경로만 내려주기 때문에, 실제 이미지 URL은 별도로 조합해야 합니다.

이를 위해 `src/lib/tmdb-image.ts`에 `getTmdbImageUrl` 유틸을 분리했습니다.

- `w500`, `original` 같은 사이즈 옵션 지원
- 포스터, 백드롭, 프로필 이미지 생성 로직 재사용 가능
- 컴포넌트에서 TMDB URL 규칙을 직접 알 필요 없음

이렇게 유틸을 분리하면 이미지 URL 규칙이 바뀌거나 사이즈 정책을 조정할 때 한 곳만 수정하면 됩니다.

---

## 8. 인기 영화 목록 페이지 구현

메인 페이지(`src/app/page.tsx`)에서는 첫 진입 시 TMDB 인기 영화 목록을 보여주도록 구현했습니다.

구현 방식은 아래와 같습니다.

- 검색어가 없으면 `getPopularMovies(currentPage)` 호출
- 서버 컴포넌트에서 데이터를 받아 초기 렌더링 수행
- 중복 영화는 `Map`을 활용해 제거
- 결과는 `MoviePicker` 컴포넌트로 전달해 카드 그리드 형태로 표시
- 페이지네이션 컴포넌트로 여러 페이지 이동 지원

즉, 홈 화면은 단순 정적 페이지가 아니라
“영화 탐색 + 선택 + AI 분석 진입점” 역할을 하는 구조입니다.

---

## 9. 검색 기능 구현

사용자가 원하는 영화를 직접 찾을 수 있도록 검색 기능도 추가했습니다.

관련 구현은 아래 파일들에 나뉘어 있습니다.

- `src/components/SearchForm/SearchForm.tsx`
- `src/lib/movie.ts`
- `src/app/page.tsx`

구현 포인트는 다음과 같습니다.

- 검색 폼 제출 시 `query`를 URLSearchParams에 반영
- 검색 결과가 있으면 `searchMovies(query, page)` 호출
- 검색어가 비어 있으면 다시 인기 영화 목록으로 복귀
- 검색 시 기존 `page` 파라미터는 제거해 1페이지부터 다시 시작
- 서버 렌더링 구조를 유지하면서 검색 결과를 반영

이 방식은 상태를 클라이언트 메모리에만 두지 않고 URL에 반영하기 때문에,
새로고침, 링크 공유, 뒤로가기/앞으로가기에도 자연스럽게 동작합니다.

---

## 10. 영화 상세 페이지 구현

영화 카드 클릭 시 `/movie/[id]` 경로로 이동해 상세 페이지를 볼 수 있게 만들었습니다.

상세 페이지에서는 다음과 같은 정보를 표시합니다.

- 영화 제목
- 평점 / 개봉연도 / 러닝타임
- 장르
- 줄거리
- 감독 / 각본 / 제작사
- 주요 출연진
- 예고편 링크
- 공식 홈페이지 링크
- 비슷한 분위기의 영화 목록
- AI 인사이트 문구

또한 `notFound()`를 활용해 잘못된 ID 접근 시 404 처리도 가능하도록 구성했습니다.

디자인은 단순 정보 나열이 아니라,
백드롭 이미지를 활용한 히어로 영역과
메인 정보 / 사이드 정보 / 관련 작품 영역으로 나누어 시각적으로 정리했습니다.

---

## 11. 좋아하는 영화 선택 기능 구현

홈 화면에서는 사용자가 좋아하는 영화를 직접 선택할 수 있도록 구현했습니다.

핵심 로직은 `src/components/MoviePicker/MoviePicker.tsx`에 있습니다.

선택 기능의 동작은 아래와 같습니다.

- 카드 우측 상단 버튼으로 영화 선택 / 해제
- 선택한 영화는 내부 상태(`selectedMovies`)로 관리
- 최대 5개까지 선택 가능
- 최소 3개 이상 선택해야 AI 분석 가능
- 상단 그리드와 하단 선택 상태 바가 연동
- 홈으로 이동하면 `app:reset-home` 이벤트를 통해 선택 상태 초기화

이 단계는 단순 체크리스트가 아니라,
AI 분석에 필요한 입력 데이터를 수집하는 중요한 흐름입니다.

---

## 12. OpenAI 연동

OpenAI 연동은 `src/lib/openai.ts`와 `src/lib/analyze-taste.ts`를 중심으로 구성했습니다.

### OpenAI 클라이언트 구성

`src/lib/openai.ts`에서는 다음과 같이 서버 전용 OpenAI 인스턴스를 생성했습니다.

- `server-only` 선언
- `OPENAI_API_KEY` 환경 변수 검증
- `openai` 인스턴스를 export 해서 다른 서버 로직에서 재사용

### 사용 모델

현재는 `gpt-5-mini` 모델을 사용하고 있습니다.

```ts
model: 'gpt-5-mini'
```

이 모델을 통해 사용자의 영화 선택 목록을 분석하고,
정해진 형식의 JSON 결과를 생성하도록 구성했습니다.

---

## 13. AI 취향 분석 기능 구현

AI 취향 분석은 사용자가 선택한 영화 목록을 텍스트로 정리한 뒤,
OpenAI에 전달해 구조화된 JSON 결과를 받는 방식으로 구현했습니다.

관련 파일은 아래와 같습니다.

- `src/lib/analyze-taste.ts`
- `src/app/api/analyze-taste/route.ts`
- `src/types/taste.ts`

### 분석 흐름

1. 사용자가 영화 3~5개를 선택
2. `MoviePicker`에서 `/api/analyze-taste`로 POST 요청 전송
3. Route Handler에서 입력 데이터 검증
4. `analyzeTaste()` 호출
5. OpenAI Responses API에 프롬프트 전달
6. JSON Schema 기반 구조화 응답 수신
7. 결과를 클라이언트에 반환

### JSON Schema로 받은 값

AI 응답은 다음 형식을 따르도록 제한했습니다.

- `summary`: 취향 한 줄 요약
- `keywords`: 취향 키워드 배열
- `recommendedMoods`: 추천 분위기 배열
- `recommendedMovies`: 추천 영화 제목 + 추천 이유 배열

이렇게 스키마를 강제한 덕분에,
모델 응답이 흔들리더라도 UI에서 안정적으로 사용할 수 있는 형식을 유지할 수 있습니다.

---

## 14. AI 추천 영화 기능 구현

AI는 추천 영화 제목과 이유만 생성하고,
실제 포스터/평점/개봉일 같은 메타데이터는 다시 TMDB에서 찾아 연결하도록 구현했습니다.

이 과정은 `src/lib/analyze-taste.ts`의 `resolveRecommendedMovies()`가 담당합니다.

동작 방식은 아래와 같습니다.

- AI가 제안한 영화 제목 배열을 순회
- `searchMovieOne(title)`로 TMDB에서 가장 유사한 영화 검색
- 매칭된 영화가 있으면 아래 정보를 조합
  - `id`
  - `title`
  - `poster_path`
  - `release_date`
  - `vote_average`
  - `reason`
- 최종적으로 `recommendedMovieResults` 형태로 반환

이렇게 하면 AI의 텍스트 추천을 실제 영화 카드 UI와 연결할 수 있습니다.

즉,
“AI가 추천 이유를 생성하고, TMDB가 실제 영화 데이터를 보강하는 구조”로 만든 것입니다.

---

## 15. 현재까지 구현된 기능

현재 프로젝트에서 구현된 기능은 아래와 같습니다.

- TMDB 인기 영화 목록 조회
- 영화 검색 기능
- 영화 상세 페이지
- 상세 페이지 내 출연진 / 제작진 / 추천작 표시
- 좋아하는 영화 선택 기능
- 선택 개수 제한 및 최소 선택 수 검증
- OpenAI 기반 영화 취향 분석
- 취향 키워드 / 추천 분위기 / 요약 생성
- AI 추천 영화 제목 생성
- TMDB 재검색을 통한 추천 영화 메타데이터 연결
- 추천 결과 카드 UI 렌더링
- 공통 헤더 / 푸터 컴포넌트 구성
- Pretendard 폰트 적용
- SCSS Module 기반 스타일 분리

앞으로 확장할 수 있는 방향은 아래와 같습니다.

- 사용자별 취향 저장 기능
- 추천 결과 즐겨찾기
- 장르별 / 분위기별 필터링
- 추천 근거 시각화 강화
- 배포 및 실제 운영 환경 연결
