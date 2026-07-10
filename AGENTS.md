# AGENTS.md

## 프로젝트

수면 시차 PWA는 해외 체류자의 수면 리듬을 기준으로 현재 체류지, 한국, 친구의 생활 시간대를 이해하고 귀국 전 수면 적응을 돕는 프론트엔드 프로젝트입니다.

## 기술 스택

- React
- TypeScript
- Vite
- npm
- Tailwind CSS
- Zustand
- Vite PWA Plugin
- Git / GitHub
- Vercel

## 작업 규칙

- 패키지 매니저는 `npm`만 사용합니다.
- TypeScript strict mode 기준으로 작성합니다.
- 변경 범위는 요청받은 작업에 필요한 부분으로 제한합니다.
- 작업과 관련 없는 파일은 수정하지 않습니다.
- 기존 네이밍과 폴더 구조를 따릅니다.
- 반복되는 UI는 작고 재사용 가능한 컴포넌트로 분리합니다.
- 서버 상태 관리가 필요해지기 전까지는 로컬 상태와 Zustand를 우선 사용합니다.
- 지도, 시간대, 위치 검색처럼 외부 API 의존성이 있는 기능은 mock 데이터로 먼저 화면을 만들고 이후 실제 API로 교체합니다.

## 제품 방향

- 단순 시차 계산기가 아니라 수면 리듬 기반 생활 시간 도구로 만듭니다.
- 사용자가 "지금 몇 시인지"보다 "언제 자고, 언제 연락하고, 언제 한국 시간에 맞출지"를 빠르게 이해할 수 있어야 합니다.
- 모바일 사용성을 우선으로 고려하되, 데스크톱에서도 깨지지 않게 구현합니다.
- PWA 설치, 오프라인 접근, 빠른 재방문 경험을 고려합니다.

## 코드 컨벤션

- 함수 선언은 arrow function으로 작성합니다.
- 변수와 함수는 `camelCase`로 작성합니다.
  - 예: `fetchUserData`, `handleClick`
- 상수는 `UPPER_CASE`로 작성합니다.
  - 예: `API_BASE_URL`, `MAX_RETRIES`
- 환경 변수는 `VITE_` 접두어를 사용합니다.
  - 예: `VITE_API_URL`, `VITE_MAP_API_KEY`
- `event`, `index`, `element` 같은 용어는 `e`, `idx`, `el`이 아니라 풀네임으로 작성합니다.
- `useState`의 setter 함수는 `set` 접두어를 사용합니다.
  - 예: `setUser`, `setLoading`
- boolean 변수는 `is`, `has`, `can` 등의 접두어를 사용합니다.
  - 예: `isLoggedIn`, `hasPermission`, `canEdit`
- 이벤트 핸들러 함수는 `handle` 접두어를 사용합니다.
  - 예: `handleSubmit`, `handleClick`
- 비동기 함수는 `fetch` 또는 `load` 접두어를 사용합니다.
  - 예: `fetchTimezone`, `loadFriends`
- 스타일 단위는 가능한 한 `rem`을 사용합니다.

## 브랜치 전략

Git Flow를 기준으로 합니다.

- `main`: 최종적으로 배포되는 안정적인 코드가 위치합니다.
- `develop`: 개발 중인 코드가 위치합니다. 새로운 기능을 병합하기 전에 통합 및 테스트합니다.
- `feature/기능명`: 새로운 기능 개발을 위해 `develop`에서 분기합니다.
- `release/버전명`: 릴리스를 준비하는 브랜치입니다. 안정화 후 `main`과 `develop`으로 병합합니다.
- `hotfix/수정명`: 긴급 버그 수정을 위해 `main`에서 분기합니다. 수정 후 `main`과 `develop`으로 병합합니다.

## 커밋 컨벤션

형식:

```text
type: 작업 내용
```

타입:

- `feat`: 새로운 기능 추가
- `fix`: 버그 수정
- `docs`: 문서 수정
- `style`: 코드 스타일 변경
- `refactor`: 코드 리팩토링
- `design`: 사용자 UI 디자인 변경
- `test`: 테스트 코드 추가 및 수정
- `build`: 빌드 파일 수정
- `ci`: CI 설정 파일 수정
- `perf`: 성능 개선
- `chore`: 빌드 또는 패키지 매니저 설정 변경
- `remove`: 불필요한 코드 또는 파일 삭제
- `rename`: 파일명 또는 폴더명 수정
- `environment`: 개발환경 세팅

예시:

```text
feat: 수면 시차 계산 결과 화면 구현
environment: ESLint와 Prettier 설정 추가
design: 친구 지도 마커 스타일 적용
```

## 이슈 규칙

이슈 제목 예시:

```text
Chore/#12: 스타일 시스템 추가
Feat/#23: 수면 시차 계산기 구현
```

이슈 템플릿:

```md
### 이슈 유형

- [ ] 기능 추가
- [ ] 버그 수정
- [ ] 리팩토링
- [ ] 기타

---

### 기능

어떤 기능을 구현할지 간단히 작성해주세요.

---

### 해야 할 작업

- [ ]
- [ ]
- [ ]

---

### 참고 자료

피그마, 노션, 스크린샷, 관련 링크 등 있으면 첨부해주세요.
```

## PR 규칙

PR은 `develop` 브랜치를 대상으로 생성합니다.

PR 템플릿:

```md
### 작업 내용

- 수면 시차 계산 결과 화면 구현
- 현재 위치와 목표 수면 시간 입력 UI 구현

### 추후 작업 사항

-

### 작업 내역 스크린샷

-

### 이슈

- close #이슈번호
```

## 명령어

- 설치: `npm install`
- 개발 서버: `npm run dev`
- 린트: `npm run lint`
- 빌드: `npm run build`
- 프리뷰: `npm run preview`
- 포맷: `npm run format`
- 포맷 확인: `npm run format:check`

## 폴더 규칙

- 앱 진입점은 `src/main.tsx`에 둡니다.
- 라우팅이 필요하면 `src/routes` 또는 `src/pages`에 화면 단위 컴포넌트를 둡니다.
- 공통 컴포넌트는 `src/components`에 둡니다.
- 기능별 컴포넌트와 로직은 `src/features`에 둡니다.
- Zustand store는 `src/stores`에 둡니다.
- 공통 유틸 함수는 `src/lib` 또는 `src/utils`에 둡니다.
- 타입은 기능 폴더 근처에 두되, 여러 기능에서 공유하면 `src/types`에 둡니다.
- mock 데이터는 `src/mocks`에 둡니다.
- PWA 관련 설정과 아이콘은 `public`과 `vite.config.ts`에서 관리합니다.

예시:

```text
src
├─ app
├─ components
├─ features
│  ├─ sleep-calculator
│  ├─ friend-map
│  └─ return-plan
├─ lib
├─ mocks
├─ stores
├─ types
└─ utils
```

## 스타일링

- Tailwind CSS를 사용합니다.
- className은 읽기 쉽도록 작성합니다.
- 공통 UI 패턴은 컴포넌트로 분리합니다.
- 모바일 화면을 먼저 고려합니다.
- 터치 가능한 요소는 충분한 크기와 간격을 유지합니다.
- 다크모드는 MVP 이후 도입을 검토합니다.

## 환경 변수

- 로컬 비밀값과 런타임 값은 `.env.local`을 사용합니다.
- 새 환경 변수를 추가할 때는 `.env.example`도 함께 업데이트합니다.
- Vite 환경 변수는 반드시 `VITE_` 접두어를 사용합니다.

예시:

```text
VITE_API_URL=
VITE_MAP_API_KEY=
VITE_TIMEZONE_API_KEY=
```

## 기능별 체크사항

기능 작업을 완료하기 전에 아래 항목을 확인합니다.

- 브랜치명이 `feature/기능명` 규칙을 따르는지 확인합니다.
- 작업 범위와 관련 없는 파일이 수정되지 않았는지 확인합니다.
- UI가 모바일과 데스크톱에서 깨지지 않는지 확인합니다.
- 로딩, 빈 상태, 에러 상태가 필요한 화면인지 확인합니다.
- 시간대 계산이 날짜 변경선을 넘어가는 케이스를 처리하는지 확인합니다.
- 수면 시작 시간이 기상 시간보다 늦은 경우 다음 날 기상으로 계산하는지 확인합니다.
- 지도 기능은 API 실패 시 대체 UI를 제공하는지 확인합니다.
- PWA 설치와 기본 manifest가 정상 동작하는지 확인합니다.
- 새 환경 변수가 있다면 `.env.example`에 추가합니다.
- PR 전 `npm run lint`와 `npm run build`를 실행해 확인합니다.
