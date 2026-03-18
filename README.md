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