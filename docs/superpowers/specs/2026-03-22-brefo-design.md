# BREFO 앱 설계 스펙
날짜: 2026-03-22
버전: v1.0
상태: 승인됨

---

## 1. 서비스 개요

BREFO는 **비즈니스 미팅 전 상대방의 뉴스, 취향, 관계 정보를 수집·요약하여 1페이지 브리핑 리포트를 제공하는 AI 기반 관계 인텔리전스 플랫폼**이다.

- 핵심 경험: **"미팅 전 5분 준비"**
- 타겟: 한국어 B2B 비즈니스 사용자
- 핵심 가치: 신뢰, 전략성, 절제된 프리미엄, 조용한 AI

### 불변 원칙 (기획서에서 절대 수정 불가)
- 브랜드 Primary: `#1B2A4A` / Secondary(Teal): `#0EA5C4` / Accent(Amber): `#F59E0B`
- 폰트: Pretendard(한글) · Inter(영문/숫자) · Neue Haas Grotesk(마케팅 타이틀)
- 핵심 UX: 3클릭 이내 핵심 완료 / AI 연출 과장 금지 / 개인정보 서비스답게 절제
- 메뉴 구조: 온보딩 · 홈대시보드 · 연락처 · 미팅생성 · 브리핑 · 설정 · 알림센터 · B2B웹대시보드

---

## 2. 기술 스택

### 2.1 프론트엔드 (모바일)
| 항목 | 선택 | 이유 |
|---|---|---|
| 프레임워크 | React Native + Expo (Managed Workflow) | Android/iOS 동시 출시, OTA 업데이트, EAS Build 자동화 |
| 언어 | TypeScript | 타입 안정성, 에이전트 간 인터페이스 명확화 |
| 스타일링 | NativeWind (Tailwind for RN) | 유틸리티 클래스 기반, 빠른 Glass/Bento 구현 |
| 네비게이션 | Expo Router (file-based) | React Navigation 기반, 파일 구조 = 라우팅 구조 |
| 상태관리 | Zustand | 경량, 보일러플레이트 최소 |
| HTTP | Axios + React Query | 캐싱, 로딩/에러 상태 자동 처리 |
| 빌드/배포 | EAS Build | Google Play + App Store 동시 배포 |

### 2.2 백엔드 — 인증 · DB (Supabase)
| 항목 | 선택 | 이유 |
|---|---|---|
| 인증 | Supabase Auth | Google OAuth 내장, JWT 발급·갱신 자동 처리 |
| JWT | Access Token 24h / Refresh Token 7d | 요구사항 충족 |
| 비밀번호 | bcrypt 해싱 (saltRounds: 12) | Supabase Auth 기본 내장 |
| DB | PostgreSQL (Supabase) | RLS 행 단위 보안, Realtime 구독 |
| 스토리지 | Supabase Storage | 프로필 이미지, 명함 사진 |

### 2.3 백엔드 — AI · 비즈니스 로직 (Node.js)
| 항목 | 선택 |
|---|---|
| 런타임 | Node.js 20 LTS + Express |
| AI 분석 | OpenAI GPT-4o (뉴스 요약, 브리핑 생성, 스몰톡 추천) |
| 뉴스 | NewsAPI (실시간 키워드 뉴스) + Naver News API (국내) |
| 맛집 추천 | 카카오 로컬 API (취향 기반 장소 검색) |
| 초대 발송 | 카카오링크 API (카카오톡 일정 초대) |
| 배포 | Railway (Node.js 서버) |

---

## 3. 시스템 아키텍처

```
[Expo App (iOS/Android)]
        │
        ├──── Supabase Auth ──── Google OAuth 콜백
        │      PostgreSQL        JWT(24h) + Refresh(7d)
        │      Storage           bcrypt 비밀번호
        │
        └──── Node.js AI Server (Railway)
               │
               ├── OpenAI GPT-4o   ← 뉴스 분석, 브리핑 생성, 스몰톡
               ├── NewsAPI          ← 실시간 뉴스 수집
               ├── Naver News API   ← 국내 뉴스
               ├── 카카오 로컬 API  ← 맛집 추천
               └── 카카오링크 API   ← 미팅 초대 발송
```

### 인증 흐름
```
앱 시작
  └── Supabase 세션 확인
        ├── 유효 → 홈 대시보드
        └── 만료/없음 → 온보딩
              └── Google OAuth (expo-auth-session)
                    └── Supabase JWT 발급 → 앱 저장 (SecureStore)
```

### 브리핑 생성 흐름
```
미팅 생성 완료
  └── Node.js /brief/generate 호출
        ├── 참석자 회사명·직책으로 NewsAPI 검색
        ├── GPT-4o로 뉴스 요약 + 취향 분석
        ├── 스몰톡 소재 3개 추출
        └── Supabase briefs 테이블에 저장
              └── 홈 대시보드에 "브리핑 준비됨" 표시
```

---

## 4. MVP 화면 범위 (V1)

V1에 포함할 5개 화면:

| 화면 | 목적 | 핵심 컴포넌트 |
|---|---|---|
| ① 온보딩 | 서비스 가치 + Google 로그인 | 3슬라이드 · CTA 버튼 |
| ② 홈 대시보드 | 오늘 일정 파악 | Bento Grid · 미팅 카드 · 브리핑 뱃지 |
| ③ 연락처 목록 | 사람 정보 탐색과 식별 | 검색바 · 연락처 리스트 · 태그 필터 |
| ④ 연락처 상세 | 관계 맥락 추적 | 기본정보 · 메모 · 태그 · 히스토리 |
| ⑤ 미팅 생성 | 빠른 생성 + 브리핑 트리거 | 4단계 스텝 · 참석자 선택 · 장소 추천 |

V2 예정 (미포함): 브리핑 뷰 화면, 설정, 알림센터, B2B 웹 대시보드

> **브리핑 V1/V2 경계 명확화:**
> V1에서 브리핑 생성 백엔드(Node.js `/brief/generate`, `briefs` Supabase 테이블)는 완전히 구현한다.
> 미팅 생성 완료 후 브리핑이 자동 생성되고 `briefs` 테이블에 저장된다.
> 단, 브리핑 전용 화면은 V2에서 구현한다.
> V1 홈 대시보드의 "브리핑 준비됨" 뱃지는 브리핑 존재를 알리는 유일한 진입점이다.
> **뱃지 탭 인터랙션:** V1에서 뱃지를 탭하면 "브리핑이 준비되었습니다. 다음 업데이트에서 전체 내용을 확인하실 수 있습니다" 토스트 메시지를 표시한다 (dead-end 방지).
> 브리핑 상세 내용은 V2 브리핑 뷰 화면에서 확인 가능해진다.

---

## 5. 데이터 모델

### Supabase 테이블

#### users
```sql
id          uuid PRIMARY KEY DEFAULT gen_random_uuid()
email       text UNIQUE NOT NULL
name        text
avatar_url  text
created_at  timestamptz DEFAULT now()
```

#### contacts
```sql
id          uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id     uuid REFERENCES users(id) ON DELETE CASCADE
name        text NOT NULL
company     text
position    text
phone       text
email       text
memo        text
avatar_url  text
created_at  timestamptz DEFAULT now()
```

#### contact_tags
```sql
id          uuid PRIMARY KEY
contact_id  uuid REFERENCES contacts(id) ON DELETE CASCADE
tag         text NOT NULL
```

#### meetings
```sql
id           uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id      uuid REFERENCES users(id) ON DELETE CASCADE
title        text
location     text
scheduled_at timestamptz NOT NULL
status       text DEFAULT 'upcoming'  -- upcoming|completed|cancelled
notes        text
created_at   timestamptz DEFAULT now()
```

#### meeting_contacts (다대다)
```sql
meeting_id  uuid REFERENCES meetings(id) ON DELETE CASCADE
contact_id  uuid REFERENCES contacts(id) ON DELETE CASCADE
PRIMARY KEY (meeting_id, contact_id)
```

#### briefs
```sql
id           uuid PRIMARY KEY DEFAULT gen_random_uuid()
meeting_id   uuid REFERENCES meetings(id) ON DELETE CASCADE
content      jsonb  -- { attendees, news, trends, smalltalk }
generated_at timestamptz DEFAULT now()
status       text DEFAULT 'pending'  -- pending|ready|failed
```

#### meeting_history
```sql
id          uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id     uuid REFERENCES users(id) ON DELETE CASCADE  -- RLS 직접 적용용
meeting_id  uuid REFERENCES meetings(id)
contact_id  uuid REFERENCES contacts(id)
food        text
topics      text[]
notes       text
met_at      timestamptz
```

### RLS 정책
- `users`, `contacts`, `meetings`, `briefs`, `meeting_history`: `user_id = auth.uid()` 직접 조건
- `meeting_contacts`: `meeting_id IN (SELECT id FROM meetings WHERE user_id = auth.uid())`
- `contact_tags`: `contact_id IN (SELECT id FROM contacts WHERE user_id = auth.uid())`
- `meeting_history`: `user_id = auth.uid()` (user_id 컬럼 포함으로 직접 보호)

---

## 6. API 설계

### Node.js AI Server 엔드포인트

```
POST /brief/generate
  body: { meetingId, contactIds[], language: 'ko' }
  → GPT-4o 뉴스 분석 → briefs 테이블 업데이트

GET /news/:contactId
  → 연락처 회사 기준 최신 뉴스 3건 반환

POST /recommend/restaurant
  body: { contactIds[], location, preferences[] }
  → 카카오 로컬 API → 취향 매칭 장소 3개 반환

POST /kakao/invite
  body: { meetingId, phone }
  → 카카오링크 메시지 발송

GET /smalltalk/:meetingId
  → 참석자 공통 관심사 기반 스몰톡 소재 3개
  ※ /brief/generate 내부에서 스몰톡도 함께 생성·저장됨.
     이 엔드포인트는 V2 브리핑 화면에서 스몰톡만 단독 재생성할 때 사용하는 독립 엔드포인트임.
     V1에서는 구현하지 않음 (V2 범위).
```

### 인증 미들웨어
- 모든 Node.js 엔드포인트: Supabase JWT 검증 (`Authorization: Bearer <token>`)

---

## 7. UI/UX 설계

### 7.1 디자인 시스템: Light Glass Bento

**Glass 효과 표준**
```
background: rgba(255, 255, 255, 0.85)
border: 1px solid rgba(255, 255, 255, 0.95)
backdrop-filter: blur(16px)   ← expo-blur BlurView 컴포넌트로 구현
border-radius: 16px (카드) / 12px (셀) / 10px (배지)
box-shadow: 0 4px 20px rgba(27, 42, 74, 0.08)
```

> **expo-blur 의존성:** React Native는 CSS `backdrop-filter`를 지원하지 않는다.
> Glass 효과는 `expo-blur`의 `BlurView` 컴포넌트로 구현한다.
> `npx expo install expo-blur` 로 설치. intensity(0~100) 값으로 블러 강도 조절.
> 반투명 배경색은 `BlurView` 위에 `View`를 얹어 `rgba` 배경으로 처리한다.

**Bento Grid 규칙**
- 2열 그리드 기본, 중요 정보는 full-width
- 카드 상단 컬러 보더로 의미 구분 (Teal=액션, Amber=경고/프리미엄)
- 빈 공간 허용 — 정보 밀도가 높아도 여백 유지

### 7.2 시맨틱 컬러 토큰
```
color.bg.default:        #FFFFFF
color.bg.subtle:         #F8FAFC
color.bg.glass:          rgba(255,255,255,0.85)
color.text.primary:      #1E293B
color.text.secondary:    #475569
color.text.disabled:     #94A3B8
color.border.default:    #E2E8F0
color.border.glass:      rgba(255,255,255,0.95)
color.action.primary:    #0EA5C4   (Teal — CTA, AI 신호)
color.action.secondary:  #1B2A4A  (Primary — 중요 액션)
color.accent.premium:    #F59E0B  (Amber — 프리미엄, 경고)
color.status.success:    #10B981
color.status.warning:    #F59E0B
color.status.error:      #EF4444
color.status.info:       #0EA5C4
```

### 7.3 타이포그래피 스케일 (모바일 기준)
```
Display: 28px / 700 / Pretendard
H1:      24px / 700 / Pretendard
H2:      20px / 600 / Pretendard
H3:      17px / 600 / Pretendard
Body:    15px / 400 / Pretendard
Caption: 12px / 400 / Pretendard
```

### 7.4 화면별 UX 원칙

**온보딩**
- 3슬라이드 이내 핵심 가치 전달 완료
- 마지막 슬라이드에서 Google 로그인 CTA
- 과도한 텍스트 설명, 화려한 마케팅 감성 금지

**홈 대시보드**
- 첫 번째 카드: 오늘 다음 미팅
- 두 번째 카드: 브리핑 준비 상태
- 세 번째 카드: 빠른 액션 (미팅 생성 FAB)
- KPI 나열 방식 금지

**연락처 목록**
- 목적: 사람 정보 탐색과 탐색
- 검색성과 빠른 식별 우선
- 지나치게 CRM처럼 복잡한 컬럼형 금지

**연락처 상세**
- 목적: 관계 맥락 추적
- 기본 정보, 메모, 태그, 히스토리 연결
- 메모 입력이 1차 액션으로 보여야 함

**미팅 생성 (4단계)**
- 1단계: 참석자 선택
- 2단계: 일시/장소 (기본값 적극 활용)
- 3단계: 메모/추가 정보
- 4단계: 확인 + 브리핑 생성 트리거
- 처음부터 옵션 과다 노출 금지

### 7.5 인터랙션 규칙
- 탭 선택: 즉각 피드백 (색상 전환 150ms)
- 스위치: 진동 햅틱 (Expo Haptics)
- FAB: 오른쪽 하단 고정, Teal 배경
- 바텀시트: 미팅 생성 등 보조 입력에 활용
- 진행률 피드백: 미팅 생성 4단계 진행 표시
- 로딩: 스켈레톤 UI (spinner 금지)
- 에러: 인라인 메시지 (모달 팝업 최소화)

---

## 8. 병렬 에이전트 구조

설계 문서(`brefo_design_multi_agent_guide.md`, 프로젝트 루트에 위치) 기준으로 구현 단계에서 다음 에이전트들을 병렬 실행한다.
해당 문서는 각 에이전트의 입력/출력 포맷, 평가 기준, 재작업 트리거를 상세 정의하며 이 스펙의 섹션 8~12와 함께 참조한다.

### 에이전트 역할 분담
```
[기획서 입력]
      │
      ├── Design Agent      → Visual Direction, 컴포넌트 스타일, Motion
      ├── UIUX Agent        → 유저 저니, 화면 구조, 상태/엣지케이스
      └── Color Agent       → 시맨틱 토큰, 대비 검증, 맥락별 색상 규칙
              │
      [Design Director Agent] → 충돌 조정, 최종 우선순위 결정
              │
      [AI Builder Agent] → 디자인 토큰 JSON, 컴포넌트 인벤토리,
                           화면별 구조, 마이크로카피, 구현 순서
```

### 에이전트 입력 공통 참조
모든 에이전트는 다음을 공통으로 참조한다:
- 서비스 정의 (BREFO B2B 브리핑 플랫폼)
- 브랜드 전략 (신뢰, 전략성, 프리미엄)
- 컬러 시스템 (#1B2A4A / #0EA5C4 / #F59E0B)
- IA (온보딩·홈·연락처·미팅·브리핑·설정·알림·B2B)
- 화면별 상세 스펙
- 접근성 기준
- 기술/보안 맥락

### 통합 평가 기준 (Design Director)
| 항목 | 기준 |
|---|---|
| 브랜드 일관성 | 브랜드 전략과 시각 결과 일치 여부 |
| UX 명확성 | 주요 과제가 직관적인가 |
| 정보 우선순위 | 브리핑에서 중요 정보가 먼저 보이는가 |
| 구현 가능성 | 과도한 커스텀/복잡 애니메이션 없는가 |
| 접근성 | 대비와 터치 기준 만족하는가 |
| 데이터 신뢰감 | 뉴스/AI/개인정보 기능이 신뢰롭게 표현되는가 |

---

## 9. 프로젝트 폴더 구조

```
brefo/
├── app/                          # Expo Router 파일 기반 라우팅
│   ├── (auth)/
│   │   └── onboarding.tsx        # 온보딩 + Google 로그인
│   ├── (tabs)/
│   │   ├── index.tsx             # 홈 대시보드
│   │   ├── contacts/
│   │   │   ├── index.tsx         # 연락처 목록
│   │   │   └── [id].tsx          # 연락처 상세
│   │   └── meetings/
│   │       └── create.tsx        # 미팅 생성 4단계
│   └── _layout.tsx
├── components/
│   ├── ui/                       # Glass 카드, 버튼, 배지 등 공통 컴포넌트
│   ├── home/                     # 홈 화면 전용 컴포넌트
│   ├── contacts/                 # 연락처 관련 컴포넌트
│   └── meetings/                 # 미팅 관련 컴포넌트
├── lib/
│   ├── supabase.ts               # Supabase 클라이언트 초기화
│   ├── api.ts                    # Node.js AI 서버 Axios 클라이언트
│   └── auth.ts                   # 인증 헬퍼 (Google OAuth, 세션)
├── store/
│   ├── authStore.ts              # Zustand 인증 상태
│   └── meetingStore.ts           # Zustand 미팅 생성 단계 상태
├── types/
│   └── index.ts                  # 공통 TypeScript 타입
├── constants/
│   └── colors.ts                 # 시맨틱 컬러 토큰
├── server/                       # Node.js AI 서버
│   ├── index.ts
│   ├── routes/
│   │   ├── brief.ts
│   │   ├── news.ts
│   │   ├── recommend.ts
│   │   └── kakao.ts
│   ├── middleware/
│   │   └── auth.ts               # Supabase JWT 검증
│   └── services/
│       ├── openai.ts
│       ├── newsapi.ts
│       └── kakao.ts
└── docs/
    └── superpowers/
        └── specs/
            └── 2026-03-22-brefo-design.md
```

---

## 10. 빌드 및 배포 계획

### 앱 배포 (EAS Build)
```bash
# Android
eas build --platform android --profile production

# iOS
eas build --platform ios --profile production

# 동시
eas build --platform all --profile production
```

### 환경변수
```
# .env (앱)
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_AI_SERVER_URL=

# server/.env (Node.js)
SUPABASE_JWT_SECRET=
OPENAI_API_KEY=
NEWS_API_KEY=
NAVER_CLIENT_ID=
NAVER_CLIENT_SECRET=
KAKAO_REST_API_KEY=
```

### Node.js 서버 배포 (Railway)
- `server/` 디렉토리 Railway 프로젝트로 배포
- 환경변수 Railway 대시보드에서 관리
- 헬스체크: `GET /health`

---

## 11. 구현 우선순위

### Phase 1 — 기반 (병렬 에이전트 동시 실행)
- [ ] Expo 프로젝트 초기화 + NativeWind 설정
- [ ] Supabase 프로젝트 생성 + 테이블 마이그레이션
- [ ] Google OAuth 연동 (expo-auth-session + Supabase)
- [ ] JWT 세션 관리 (SecureStore)
- [ ] 공통 UI 컴포넌트 (Glass 카드, 버튼, 배지)
- [ ] Node.js AI 서버 스캐폴딩 + JWT 미들웨어

### Phase 2 — 핵심 화면 (병렬)
- [ ] 온보딩 화면 (3슬라이드 + Google 로그인)
- [ ] 홈 대시보드 (Bento Grid + 미팅 카드)
- [ ] 연락처 목록 + 검색
- [ ] 연락처 상세 (메모, 태그, 히스토리)
- [ ] 미팅 생성 4단계

### Phase 3 — AI 연동
- [ ] 브리핑 생성 API (GPT-4o + NewsAPI)
- [ ] 맛집 추천 (카카오 로컬)
- [ ] 카카오링크 초대 발송

### Phase 4 — 배포
- [ ] EAS Build 설정 (Android + iOS)
- [ ] Railway 서버 배포
- [ ] Google Play / App Store 제출

---

## 12. 재작업 트리거 (품질 기준)

다음 항목 중 하나라도 해당되면 해당 화면/컴포넌트를 재작업한다:
- Primary CTA가 화면마다 다르게 사용됨
- Teal이 과도해 서비스가 가볍게 보임
- Amber가 경고와 프리미엄 의미를 동시에 사용해 혼란
- 접근성 대비 기준 미달
- 개인정보 기반 서비스인데 너무 캐주얼한 비주얼
- 미팅 생성 플로우가 옵션 과다로 길어짐
- 홈 화면이 대시보드라기보다 피드처럼 보임
