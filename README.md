# SKHU BOX - Frontend

스마트 사물함 관리 시스템(SKHU BOX)의 프론트엔드 프로젝트입니다.

---

## 1. 개발 환경 사양

### 1-1. H/W 환경 (최소 권장 사양)

| 항목 | 최소 사양 | 권장 사양 |
|---|---|---|
| CPU | 듀얼코어 2.0GHz 이상 | 쿼드코어 이상 |
| RAM | 8GB | 16GB 이상 (Next.js dev 서버 + IDE 동시 구동 기준) |
| 저장공간 | 여유 공간 2GB 이상 | 5GB 이상 (`node_modules/`, `.next/` 캐시 포함) |
| OS | Windows 10/11, macOS 12 이상, Linux | 동일 |

> `node_modules/`와 `.next/` 빌드 캐시가 용량을 많이 차지합니다. 디스크 여유 공간을 넉넉히 확보해주세요.

### 1-2. S/W 환경

| 구분 | 이름 | 버전 | 비고 |
|---|---|---|---|
| 런타임 | Node.js | **20.9.0 이상** | Next.js 16의 `engines` 요구 사항. Node 20 LTS 권장 |
| 패키지 매니저 | npm | 10 이상 (Node 20 기본 동봉) | |
| 프레임워크 | Next.js | **16.2.1** (App Router) | `app/` 디렉토리 기반 라우팅 |
| UI 라이브러리 | React / React DOM | **19.2.4** | |
| 언어 | TypeScript | ^5 | `strict: true` |
| 스타일링 | Tailwind CSS | ^4 (`@tailwindcss/postcss`) | |
| 차트 시각화 | Recharts | **^3.8.1** | 관리자 통계(`/analytics`) 페이지에서 사용 |
| 토스트 알림 | react-hot-toast | ^2.6.0 | |
| 아이콘 | react-icons | ^5.6.0 | |
| 린트 | ESLint | ^9 (`eslint-config-next` 16.2.1) | |

> ⚠️ **전역 상태 관리 (Zustand) 관련 안내**: 현재 이 프로젝트의 `package.json`에는 Zustand가 의존성으로 포함되어 있지 않습니다. 전역 상태가 필요한 화면들은 현재 React 기본 `useState`/`useEffect`와 컴포넌트 props 전달로 관리되고 있으며, 별도의 전역 상태 관리 라이브러리는 아직 도입되지 않은 상태입니다. Zustand 도입이 확정되면 이 표에 버전을 추가해주세요.

---

## 2. 로컬 실행 및 연동 절차

### 2-1. 프로젝트 다운로드 및 패키지 설치

```bash
git clone <repository-url>
cd SKHU_BOX-FrontEnd
npm install
```

`npm install`은 `package.json`에 명시된 의존성을 `node_modules/`에 설치합니다. 평소보다 오래 걸릴 수 있으니(약 1~3분) 정상입니다.

### 2-2. 환경 변수(`.env`) 구성

프로젝트 최상위 경로(이 README와 같은 위치)에 `.env.local` 파일을 생성하고 아래 두 변수를 설정합니다.

```bash
# .env.local
NEXT_PUBLIC_API_URL=https://skhubox.site
API_URL=https://skhubox.site
```

- `NEXT_PUBLIC_API_URL` : 브라우저(클라이언트 컴포넌트)에서 백엔드 API를 호출할 때 사용하는 주소입니다. `NEXT_PUBLIC_` 접두사가 붙어야 Next.js가 클라이언트 번들에 값을 노출시킵니다.
- `API_URL` : 서버 사이드(예: Route Handler, 서버 컴포넌트)에서만 사용하는 주소입니다. 접두사가 없으므로 브라우저에는 노출되지 않습니다.
- 로컬에서 별도의 백엔드 서버를 띄워 테스트하는 경우, 두 값을 해당 로컬 백엔드 주소(예: `http://localhost:8080`)로 바꿔서 사용하면 됩니다.
- `.env.local`은 `.gitignore`에 의해 Git 추적에서 제외됩니다. 절대 커밋하지 마세요.

### 2-3. 로컬 개발 서버 실행

```bash
npm run dev
```

- 기본적으로 **http://localhost:3000** 에서 서버가 실행됩니다.
- 3000번 포트가 이미 사용 중이면 Next.js가 자동으로 3001번 등 다음 포트를 사용합니다. 포트를 강제로 고정하려면:

```bash
npm run dev -- -p 3000
```

- 코드를 수정하면 자동으로 핫 리로드됩니다.

### 2-4. 프로덕션 빌드로 동작 확인 (선택)

배포 전 실제 빌드 결과를 로컬에서 확인하고 싶을 때:

```bash
npm run build   # 프로덕션 빌드 (타입 체크 포함)
npm run start   # 빌드된 결과를 localhost:3000에서 구동
```

### 2-5. 린트 검사

```bash
npm run lint
```

---

## 3. 수정 파일 공유 / 로컬 덮어쓰기 가이드

다른 사람에게 수정된 파일을 전달하거나(예: 압축 파일, 카카오톡/슬랙 전송), 받은 파일로 로컬을 덮어쓸 때는 아래 규칙을 따라주세요.

### 3-1. 업로드/공유 시 반드시 제외할 것

- **`node_modules/`** — `npm install`로 언제든 재생성 가능한 패키지 폴더입니다. 용량이 매우 크고(수백 MB~1GB+), OS/아키텍처에 따라 내용이 달라질 수 있어 공유하면 오히려 문제를 일으킵니다.
- **`.next/`** — Next.js 빌드/캐시 폴더입니다. `npm run dev` 또는 `npm run build` 실행 시 자동으로 생성됩니다.
- **`.env.local`** (또는 `.env*`) — 실제 운영 중인 API 주소나 키가 들어있을 수 있으므로 공유/업로드하지 않습니다. 필요한 값은 `.env.local.example` 같은 별도 안내 문서나 채팅으로 전달하세요.

이 폴더들은 이미 `.gitignore`에 등록되어 있어 `git add .` / `git status`에는 잡히지 않지만, 압축 파일을 만들어 직접 전달할 때는 수동으로 빠졌는지 꼭 확인해야 합니다.

```bash
# 공유용 압축 시 예시 (node_modules, .next 제외)
zip -r share.zip . -x "node_modules/*" ".next/*" ".env*"
```

### 3-2. 받은 파일로 로컬을 덮어쓸 때

1. `node_modules/`, `.next/`는 덮어쓰지 말고 그대로 둡니다(받은 파일에 포함되어 있지 않을 것입니다).
2. 소스 파일만 덮어쓴 뒤, `package.json` 또는 `package-lock.json`이 바뀌었다면 반드시 다시 설치합니다.

```bash
npm install
```

3. 그 다음 개발 서버를 다시 실행합니다.

```bash
npm run dev
```

4. 만약 빌드 캐시 문제로 화면이 이상하게 보이면 `.next/` 폴더를 삭제하고 다시 `npm run dev`를 실행해 캐시를 초기화하세요.
