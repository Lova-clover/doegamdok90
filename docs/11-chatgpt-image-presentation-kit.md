# ChatGPT Image And Presentation Kit - Touchline Replay 90

이 문서는 ChatGPT, 이미지 생성 도구, 발표자료 생성 도구에 그대로 넣기 위한 완성형 브리프입니다.

## 1. 최종 고도화 콘셉트

### 제품명

Touchline Replay 90

### 한국어 서브타이틀

월드컵 운명의 15분을 다시 지휘하다

### 한 줄 정의

실제 월드컵 경기에서 영감을 받은 결정적 순간에 사용자가 감독으로 투입되어, 선수 배치와 전술 지시를 직접 바꾸고 "실제 경기 vs 내 선택 vs 코치 추천" 결과를 비교하는 인터랙티브 전술 리플레이 웹서비스.

### 핵심 질문

"내가 감독이었다면, 그 15분은 달라졌을까?"

### 대중용 카피

월드컵 경기 보다가 한 번쯤 해본 말, "내가 감독이면 저렇게 안 한다."  
이제 말로만 하지 말고 직접 바꿔보세요.  
선수를 드래그하고, 포메이션을 바꾸고, 교체와 전술 지시를 내리면 경기의 운명이 다시 계산됩니다.

### 심사용 카피

Touchline Replay 90은 단순한 포메이션 보드가 아니라, 월드컵 데이터와 로컬 전술 평가 엔진을 결합한 반사실적 감독 시뮬레이터입니다. 사용자는 특정 경기의 결정적 15분을 다시 설계하고, 자신의 선택이 실제 경기 기준선 대비 어떤 전술적 차이를 만들었는지 설명 가능한 리포트로 확인합니다.

## 2. 우승을 노리는 제품 포지셔닝

### 기존 전술판과의 차이

기존 전술판:
- 선수를 배치한다.
- 화살표를 그린다.
- 이미지를 저장한다.

Touchline Replay 90:
- 실제 경기의 결정적 순간에 들어간다.
- 미션과 제약 속에서 결정을 내린다.
- 코치진 조언을 참고한다.
- 내 선택이 경기 운명을 얼마나 바꿨는지 확인한다.
- 실제 경기, 내 선택, 코치 추천을 비교한다.

### 심사위원에게 남길 문장

"이 서비스는 전술을 그리는 도구가 아니라, 감독의 의사결정을 플레이하는 서비스입니다."

### 대중 투표자에게 남길 문장

"3분 안에 내가 월드컵 감독이 되어 경기 운명을 바꿔볼 수 있다."

## 3. 핵심 기능명

### 1. Decision Moment Card

경기 상황을 한 장으로 보여주는 진입 카드.

포함 정보:
- 경기 minute
- 현재 score
- 감독 미션
- 전술 제약
- 실제 경기 기준선
- 상대 위험/약점 힌트

예시:

```text
67' South Korea 1 - 1 Portugal
Mission: 승리가 필요하다
Constraint: 중앙 역습을 막아라
Real Baseline: 실제 경기는 후반 막판 역습 득점
CTA: 이 15분을 바꾸기
```

### 2. Tactical Board

사용자가 감독처럼 직접 조작하는 메인 화면.

핵심 조작:
- 선수 드래그
- 포메이션 변경
- 벤치 선수 교체
- 역할 변경
- 압박 라인 조절
- 템포 조절
- 폭 조절
- 위험도 조절
- 공격 방향 선택

### 3. Coach Room Trio

감독 옆의 세 명의 코치진.

역할:
- 수석코치: 전체 전술 방향 제안
- 분석관: 상대 약점/위험 지역 경고
- 피지컬코치: 체력, 압박, 교체 타이밍 조언

예시:

```text
수석코치
오른쪽 측면 과부하로 상대 풀백 뒤를 노리는 게 좋습니다.

분석관
중앙 역습 채널이 비어 있습니다. 수비형 미드필더 한 명을 남기세요.

피지컬코치
고강도 압박은 75분 이후 체력 손실이 큽니다. fresh runner 교체를 권장합니다.
```

### 4. Fate Meter

사용자의 선택이 실제 경기 대비 얼마나 운명을 바꿨는지 보여주는 대표 지표.

예시:

```text
운명 변화 +23
Goal Threat +18
Rest Defense -6
Momentum +14
Risk +9
```

### 5. Fate Simulation

사용자의 전술을 기반으로 15분 경기 흐름을 짧게 재생.

예시 이벤트:

```text
70' 오른쪽 측면에서 2대1 상황이 만들어졌습니다.
74' 교체 투입한 윙어가 뒷공간을 열었습니다.
79' 중앙 역습 위험이 올라갔지만 DM 위치가 이를 완화했습니다.
82' 컷백 찬스가 생성됐습니다.
```

### 6. Real vs Me vs Coach Report

결과 리포트의 핵심 비교표.

```text
Real Match
실제 경기 흐름. 후반 막판 역습 득점.

My Call
사용자 전술. 측면 과부하로 더 빠른 찬스 생성, 단 중앙 역습 위험 상승.

Coach Pick
로컬 코치 추천. 안정적이지만 득점 위협은 사용자 선택보다 낮음.
```

### 7. Manager Persona Card

대중 투표와 공유를 위한 결과 카드.

예시:

```text
Counter Punch Manager
당신은 기다렸다가 가장 약한 공간을 찌르는 감독입니다.

Best Call: fresh runner를 약점 측면에 투입
Tradeoff: 78분 이후 높은 라인 뒤 공간 노출
Coach Score: 84 / 100
Fate Shift: +23
```

## 4. MVP 시나리오

### Scenario 1. 승리가 필요한 67분

영감:
- 2022 South Korea vs Portugal

상황:
- 67분
- 1-1
- 승리가 필요한 상황

미션:
- 15분 안에 결승골 루트를 만들어라.

제약:
- 중앙 역습 채널을 비우면 위험하다.
- 체력이 떨어진 상태에서 고강도 압박은 부담이 크다.

최적 선택:
- fresh winger 투입
- 폭 넓히기
- 상대 오른쪽 측면 공략
- DM 한 명은 중앙에 남기기

리포트 예시:
- "실제 경기보다 더 빠르게 결정적 찬스를 만들었습니다."
- "측면 과부하는 좋았지만, 높은 라인 뒤 공간이 열렸습니다."

### Scenario 2. 78분, 리드를 지켜라

영감:
- 2022 Argentina vs France final

상황:
- 78분
- 리드 중
- 상대가 흐름을 가져오기 직전

미션:
- 상대의 막판 압박을 줄이고 리드를 지켜라.

제약:
- 너무 내려앉으면 박스 진입과 세트피스 위험이 커진다.
- 공격 출구를 모두 없애면 계속 압박을 맞는다.

최적 선택:
- 압박 라인 낮추기
- 수비형 미드필더 또는 풀백 투입
- 역습 출구 한 명 유지
- 박스 중앙 보호

리포트 예시:
- "무너질 뻔한 흐름을 관리형 승리로 바꿨습니다."
- "실점 위험은 줄였지만 너무 깊게 내려앉아 세트피스 위험이 증가했습니다."

### Scenario 3. 58분, 잠긴 수비를 열어라

영감:
- 월드컵 토너먼트의 compact low-block 상황

상황:
- 58분
- 0-0
- 상대가 내려앉음

미션:
- 밀집 수비를 상대로 찬스 품질을 높여라.

제약:
- 중앙에 공격수를 쌓으면 오히려 혼잡해진다.
- 양쪽 풀백을 동시에 올리면 측면 역습에 취약하다.

최적 선택:
- 하프스페이스 점유
- 폭 넓히기
- 늦은 박스 침투
- rest defense 유지

리포트 예시:
- "잠긴 수비를 힘이 아니라 구조로 열었습니다."
- "점유는 좋아졌지만 결정적 침투가 부족했습니다."

### Bonus Scenario. 89분, 마지막 세트피스

상황:
- 89분
- 한 골이 필요한 마지막 코너킥/프리킥

미션:
- 러너와 스크린을 배치해 마지막 찬스를 만들어라.

핵심 조작:
- 니어포스트 러너
- 파포스트 러너
- 스크린 역할
- 세컨드볼 위치
- 역습 대비 선수

## 5. 이미지 시안 생성용 공통 비주얼 방향

### 전체 톤

방송사 전술 분석 데스크 + 현대적인 스포츠 데이터 툴 + 실제 감독석의 긴장감.

### 키워드

- tactical command center
- football manager dashboard
- World Cup inspired
- interactive pitch board
- dark green stadium atmosphere
- broadcast analysis UI
- data overlays
- decisive match moment
- no official logos
- no real player photos
- premium sports tech product

### 컬러 방향

권장:
- deep pitch green
- near-black charcoal
- off-white text
- electric lime for positive momentum
- amber for risk
- red/orange for danger zones
- cyan/blue for weak zones

피해야 할 것:
- 과한 보라색 그라디언트
- 랜딩페이지 같은 히어로 일러스트
- 공식 팀 로고
- 실제 선수 사진
- 중계 화면 캡처 느낌
- 너무 게임 UI처럼 유치한 화면

### UI 성격

SaaS처럼 차분하지만, 스포츠 중계의 긴장감이 있어야 함.  
첫 화면부터 바로 사용 가능한 제품 화면이어야 하며, 마케팅 랜딩 페이지처럼 보이면 안 됨.

## 6. ChatGPT 이미지 시안 프롬프트

아래 프롬프트를 이미지 생성 가능한 ChatGPT에 그대로 사용.

### Prompt 1. 메인 전술 보드 화면

```text
Create a high-fidelity product UI mockup for a web app called "Touchline Replay 90".

Concept:
A football manager decision simulator where the user enters a decisive World Cup-inspired match moment and rewrites the next 15 minutes by dragging players, changing formation, substitutions, and tactical instructions.

Screen:
Desktop tactical board, 1440x900.

Layout:
- Top bar with match minute "67'", score "1-1", mission "승리가 필요하다", and a small data-source badge.
- Center: large football pitch tactical board with draggable circular player tokens, formation shape, danger zones in amber/red, weak zones in cyan/blue.
- Left panel: Decision Moment Card with mission, constraint, real baseline, and bench players.
- Right panel: Coach Room Trio with three compact staff advice modules: 수석코치, 분석관, 피지컬코치.
- Bottom area: Fate Meter showing "운명 변화 +23", Goal Threat, Rest Defense, Momentum, Risk.
- Primary CTA button: "15분 운명 시뮬레이션".

Visual style:
Premium sports analytics dashboard, broadcast tactical analysis, deep green pitch, charcoal UI, off-white typography, sharp but friendly cards, 8px radius, clean Korean UI labels, realistic web app interface, no official team logos, no real player photos, no copyrighted assets.

Mood:
Tense, strategic, immersive, like a manager standing on the touchline during a World Cup knockout match.

Do not create a marketing landing page. Show the actual usable app interface.
```

### Prompt 2. Decision Moment Card 화면

```text
Create a high-fidelity UI mockup for the first screen of "Touchline Replay 90", a World Cup-inspired football manager simulator.

Screen:
Scenario selection and Decision Moment Card, desktop 1440x900.

Content:
Title: Touchline Replay 90
Subtitle: 월드컵 운명의 15분을 다시 지휘하다

Main area:
Three scenario cards:
1. 승리가 필요한 67분
2. 78분, 리드를 지켜라
3. 58분, 잠긴 수비를 열어라

Selected scenario detail:
67' / 1-1
Mission: 승리가 필요하다
Constraint: 중앙 역습을 막아라
Real Baseline: 실제 경기는 후반 막판 역습 득점
CTA: 이 15분을 바꾸기

Visual style:
Sports broadcast command desk, deep green and charcoal, subtle pitch texture, data overlays, premium modern web UI, clean Korean labels. No logos, no real player photos, no flags as official assets. Make it feel like an actual product screen, not a poster.
```

### Prompt 3. Coach Room Trio 화면

```text
Create a product UI mockup focusing on the "Coach Room Trio" feature of a football manager simulator.

Screen:
Right-side tactical advice panel next to a football pitch board.

Feature:
Three staff cards update based on user tactics:
- 수석코치: "오른쪽 측면 과부하로 상대 풀백 뒤를 노리세요."
- 분석관: "중앙 역습 채널이 비어 있습니다. DM을 하나 남겨두세요."
- 피지컬코치: "75분 이후 고강도 압박은 체력 손실이 큽니다."

Include:
- small icon-like avatars without real faces
- advice confidence chips
- warning and opportunity labels
- compact tactical meters

Visual style:
Premium football analytics dashboard, dark green pitch, charcoal side panel, amber warnings, cyan opportunities, crisp Korean typography, polished SaaS-like sports tool. Avoid cartoon style, avoid official logos, avoid player photos.
```

### Prompt 4. Fate Simulation 화면

```text
Create a high-fidelity UI mockup for a "Fate Simulation" screen in a football manager web app.

Concept:
After the user changes tactics, the app simulates the next 15 minutes of a World Cup-inspired match.

Layout:
- Top: timeline from 67' to 82'
- Center-left: mini tactical pitch animation frame showing player runs and passing lanes
- Center-right: event ticker with Korean event cards:
  70' 오른쪽 측면에서 2대1 상황이 만들어졌습니다.
  74' 교체 투입한 윙어가 뒷공간을 열었습니다.
  79' 중앙 역습 위험이 올라갔지만 DM 위치가 이를 완화했습니다.
  82' 컷백 찬스가 생성됐습니다.
- Bottom: metric changes Goal Threat +18, Rest Defense -6, Momentum +14, Risk +9

Visual style:
Broadcast replay analysis, premium sports UI, dynamic but readable, deep green and charcoal with electric lime highlights and amber risk warnings. No official logos, no real players, no copyrighted broadcast imagery.
```

### Prompt 5. Manager Report 화면

```text
Create a high-fidelity UI mockup for the final report screen of "Touchline Replay 90".

Screen:
Manager Report after tactical simulation.

Include:
- Large Coach Score: 84 / 100
- Fate Shift: 운명 변화 +23
- Persona card: Counter Punch Manager
- Short verdict in Korean:
  "실제 경기보다 12분 빠르게 결정적 찬스를 만들었습니다. 측면 과부하와 fresh runner 교체가 좋았지만, 높은 라인 뒤 공간은 위험했습니다."
- Comparison table: Real Match vs My Call vs Coach Pick
- Three positive reasons and two warnings
- Buttons: 다시 지휘하기, 다른 시나리오, 결과 공유

Visual style:
Premium sports analytics report, deep green/charcoal, clean tables, tactile result card, shareable but not childish, Korean UI labels, no official team logos or player photos.
```

### Prompt 6. 발표자료 표지 이미지

```text
Create a presentation cover image for "Touchline Replay 90".

Scene:
A cinematic but product-focused visual of a football tactical command center: a glowing digital pitch board, match clock at 67', score 1-1, tactical lines and player tokens, subtle stadium floodlights in the background.

Text:
Touchline Replay 90
월드컵 운명의 15분을 다시 지휘하다

Style:
Premium sports technology, dark green and charcoal, dramatic but professional, no real players, no official logos, no team crests, no copyrighted broadcast footage. Make it suitable as the cover slide of a hackathon pitch deck.
```

## 7. 발표자료 구성

권장 분량:
- 12장
- 발표 시간 5분 기준

### Slide 1. Title

제목:
Touchline Replay 90

부제:
월드컵 운명의 15분을 다시 지휘하다

한 줄:
내가 감독이었다면, 그 15분은 달라졌을까?

비주얼:
- 전술 보드 + 67분 시계 + 운명 변화 미터

발표 멘트:
"축구 경기를 보면서 누구나 한 번쯤 이런 말을 합니다. 내가 감독이라면 저렇게 안 했을 텐데. Touchline Replay 90은 그 말을 직접 플레이하게 만드는 서비스입니다."

### Slide 2. Problem

제목:
팬들은 늘 전술을 말하지만, 직접 검증할 방법은 없다

본문:
- 월드컵 경기를 보며 누구나 감독처럼 판단한다.
- 하지만 대부분은 말로 끝난다.
- 기존 전술판은 배치와 그림은 가능하지만 "그 선택이 통했는지" 알려주지 않는다.
- 대회 주제는 단순 시각화가 아니라 감독 경험이다.

핵심 문장:
"문제는 전술을 그리는 것이 아니라, 감독의 결정을 경험하게 만드는 것입니다."

### Slide 3. Insight

제목:
감독 경험은 배치가 아니라 압박, 선택, 결과다

본문:
감독처럼 느끼려면 네 가지가 필요하다.

1. 압박: 특정 분, 점수, 미션
2. 통제: 직접 선수와 전술 조작
3. 피드백: 조작 즉시 변화하는 지표
4. 결과: 내 선택이 만든 경기 흐름

비주얼:
- Pressure / Control / Feedback / Consequence 4단 다이어그램

### Slide 4. Solution

제목:
월드컵의 결정적 15분을 다시 지휘하는 전술 리플레이

본문:
Touchline Replay 90은 사용자를 실제 경기에서 영감을 받은 결정적 순간에 감독으로 투입한다.

사용자는:
- 시나리오를 고르고
- 포메이션을 바꾸고
- 선수를 드래그하고
- 교체와 전술 지시를 내리고
- 15분 운명 시뮬레이션을 실행한다.

결과:
- 실제 경기 vs 내 선택 vs 코치 추천 비교

### Slide 5. Core Loop

제목:
3분 안에 끝나는 감독 의사결정 루프

단계:
1. Decision Moment 선택
2. 미션과 제약 확인
3. 선수 배치와 전술 조작
4. 코치룸 조언 확인
5. Fate Simulation 실행
6. Manager Report 공유

비주얼:
- 원형 루프 다이어그램

### Slide 6. Key Feature 1 - Decision Moment Card

제목:
경기 맥락이 있는 전술판

내용:
Decision Moment Card는 사용자를 곧바로 감독석에 앉힌다.

예시:
- 67'
- 1-1
- Mission: 승리가 필요하다
- Constraint: 중앙 역습을 막아라
- Real Baseline: 실제 경기는 후반 막판 역습 득점

심사 포인트:
- 월드컵 데이터 활용
- 몰입감
- 빠른 이해

### Slide 7. Key Feature 2 - Interactive Tactical Board

제목:
선수 배치, 교체, 전술 지시가 모두 연결된다

내용:
사용자는 전술판에서 직접 조작한다.

기능:
- Drag player
- Formation preset
- Substitution
- Role assignment
- Pressing line
- Tempo
- Width
- Risk
- Attack focus

화면 효과:
- Goal Threat 변화
- Rest Defense 변화
- Risk warning
- Weak zone overlay

### Slide 8. Key Feature 3 - Coach Room Trio

제목:
감독 옆의 세 명의 코치진

내용:
외부 AI API 없이도 코치진이 전술 조언을 제공한다.

수석코치:
- 전체 방향 제안

분석관:
- 상대 약점과 위험 지역 분석

피지컬코치:
- 체력, 압박, 교체 타이밍 조언

심사 포인트:
- 감독 몰입감
- 설명 가능한 의사결정
- API 키 없이 안정 동작

### Slide 9. Key Feature 4 - Fate Meter

제목:
내 선택이 경기 운명을 얼마나 바꿨는가

내용:
Fate Meter는 실제 경기 기준선 대비 사용자의 전술이 만든 변화를 보여준다.

예시:
- 운명 변화 +23
- Goal Threat +18
- Rest Defense -6
- Momentum +14
- Risk +9

핵심:
대중 투표자는 복잡한 xG보다 "운명 변화"를 더 빠르게 이해한다.

### Slide 10. Manager Report

제목:
Real Match vs My Call vs Coach Pick

내용:
결과 화면은 세 가지 경로를 비교한다.

Real Match:
- 실제 경기 흐름

My Call:
- 사용자의 전술 결과

Coach Pick:
- 로컬 코치 추천안

추가:
- Coach Score
- Tactical Reasons
- Warnings
- Manager Persona Card

심사 포인트:
- 참신성
- 데이터 활용
- 결과 설명력

### Slide 11. MVP Scenario

제목:
처음부터 완성도 있게 만들 3개 시나리오

시나리오:

1. 승리가 필요한 67분
- 2022 Korea vs Portugal inspired
- 미션: 결승골 루트 만들기

2. 78분, 리드를 지켜라
- 2022 Argentina vs France inspired
- 미션: 막판 흐름 차단

3. 58분, 잠긴 수비를 열어라
- Low-block tactical scenario
- 미션: 밀집 수비 공략

보너스:
- 89분 마지막 세트피스

### Slide 12. Why We Win

제목:
평가 기준에 직접 맞춘 제품

표:

```text
참신성 30
전술판이 아니라 의사결정 리플레이

감독 경험 25
분, 점수, 미션, 코치진, 직접 조작, 결과

완성도 25
정적 JSON + 로컬 엔진 + no login + no API key

기획/구현 20
PRD, 화면, 데이터, 데모가 같은 구조
```

마지막 문장:
"Touchline Replay 90은 축구 팬의 '내가 감독이었다면'이라는 상상을, 조작 가능한 웹 경험으로 바꾸는 서비스입니다."

## 8. 발표자료 생성용 ChatGPT 프롬프트

아래를 ChatGPT에 그대로 넣으면 발표자료 초안을 만들 수 있음.

```text
너는 해커톤 우승 경험이 많은 프로덕트 디자이너이자 피치덱 전략가다.

아래 서비스 콘셉트를 바탕으로 12장짜리 발표자료를 만들어줘.
목표는 DAKER "내가 축구 감독이라면 - 월드컵 전술 웹서비스 챌린지" 우승이다.

서비스명:
Touchline Replay 90

부제:
월드컵 운명의 15분을 다시 지휘하다

핵심 질문:
내가 감독이었다면, 그 15분은 달라졌을까?

서비스 설명:
실제 월드컵 경기에서 영감을 받은 결정적 순간에 사용자가 감독으로 투입되어, 선수 배치와 전술 지시를 직접 바꾸고 "실제 경기 vs 내 선택 vs 코치 추천" 결과를 비교하는 인터랙티브 전술 리플레이 웹서비스다.

핵심 기능:
1. Decision Moment Card
- 분, 점수, 미션, 제약, 실제 경기 기준선 제시

2. Interactive Tactical Board
- 선수 드래그, 포메이션 변경, 교체, 전술 슬라이더

3. Coach Room Trio
- 수석코치, 분석관, 피지컬코치가 로컬 규칙 기반 조언 제공

4. Fate Meter
- 실제 경기 대비 운명 변화 점수 표시

5. Fate Simulation
- 다음 15분의 전술 이벤트를 짧게 시뮬레이션

6. Real vs Me vs Coach Report
- 실제 경기, 사용자 선택, 코치 추천 결과 비교

MVP 시나리오:
1. 승리가 필요한 67분
- 2022 South Korea vs Portugal inspired
- 미션: 15분 안에 결승골 루트 만들기

2. 78분, 리드를 지켜라
- 2022 Argentina vs France inspired
- 미션: 상대 막판 흐름 차단

3. 58분, 잠긴 수비를 열어라
- Low-block scenario
- 미션: 밀집 수비 공략

평가 기준:
- 참신성 30
- 감독 경험 설계 25
- 완성도 25
- 기획/구현 완성도 20

발표자료 요구:
- 12장 구성
- 각 장마다 제목, 핵심 메시지, 본문 bullet, 발표자 멘트, 추천 비주얼 설명 포함
- 톤은 심사위원에게 설득력 있고, 대중 투표에도 매력적이어야 함
- "전술판"이 아니라 "감독 의사결정 리플레이"라는 차별점을 계속 강조
- 저작권 이슈를 피하기 위해 공식 로고, 선수 사진, 중계 화면 사용 금지
```

## 9. 발표 대본 5분 버전

```text
안녕하세요. 저희가 기획한 서비스는 Touchline Replay 90입니다.

축구 경기를 보면서 누구나 한 번쯤 이런 말을 합니다.
"내가 감독이었다면 저 선수 안 썼다."
"저 상황에서는 4-3-3이 아니라 3-4-3으로 갔어야 한다."

하지만 대부분의 서비스는 여기서 멈춥니다.
선수를 배치하고, 전술판을 그리고, 이미지를 저장하는 수준입니다.

저희는 질문을 바꿨습니다.
전술을 그리는 것이 아니라, 감독의 결정을 플레이하게 만들 수 없을까?

Touchline Replay 90은 사용자를 월드컵 경기의 결정적 15분에 감독으로 투입합니다.
예를 들어 67분, 1대1, 승리가 필요한 상황입니다.
사용자는 이 상황에서 포메이션을 바꾸고, 선수를 드래그하고, 교체하고, 압박 라인과 템포를 조절합니다.

이때 단순히 자유롭게 배치만 하는 것이 아닙니다.
Decision Moment Card가 현재 미션과 제약을 알려주고,
Coach Room Trio가 수석코치, 분석관, 피지컬코치 관점에서 조언을 제공합니다.

사용자의 선택은 Fate Meter에 바로 반영됩니다.
운명 변화 +23처럼, 실제 경기 기준선 대비 내 전술이 경기 흐름을 얼마나 바꿨는지 보여줍니다.

전술을 확정하면 Fate Simulation이 다음 15분을 짧게 재생합니다.
오른쪽 측면에서 2대1 상황이 만들어지고,
교체 투입한 선수가 뒷공간을 열고,
중앙 역습 위험이 올라가는 식으로 결과를 이벤트 카드로 보여줍니다.

마지막 리포트에서는 세 가지를 비교합니다.
실제 경기는 어땠는지,
내 선택은 어떤 결과를 만들었는지,
코치 추천안은 어떤 대안이었는지.

그래서 이 서비스는 단순한 전술판이 아닙니다.
월드컵 데이터를 활용한 감독 의사결정 리플레이입니다.

심사 기준에도 직접 맞춰져 있습니다.
참신성 측면에서는 Real vs Me vs Coach라는 새로운 구조를 제공합니다.
감독 경험 측면에서는 분, 점수, 미션, 코치진, 조작, 결과가 모두 연결됩니다.
완성도 측면에서는 정적 JSON과 로컬 엔진으로 로그인이나 API 키 없이 안정적으로 동작합니다.
기획과 구현 측면에서는 PRD, 화면, 데이터, 데모가 모두 같은 루프를 따릅니다.

Touchline Replay 90은 축구 팬의 "내가 감독이었다면"이라는 상상을
직접 조작하고 결과를 확인하는 웹 경험으로 바꾸는 서비스입니다.
```

## 10. 최종 제출 PDF에 들어갈 문장

### 서비스 개요

Touchline Replay 90은 실제 월드컵 경기에서 영감을 받은 결정적 순간에 사용자가 감독으로 투입되어, 선수 배치와 전술 지시를 직접 조작하고 다음 15분의 경기 흐름을 시뮬레이션하는 웹서비스입니다. 사용자는 실제 경기 기준선, 자신의 선택, 로컬 코치 추천안을 비교하며 "내가 감독이었다면 경기의 운명이 달라졌을까?"라는 질문을 직접 경험합니다.

### 감독 경험 설계 의도

감독 경험은 단순히 선수를 배치하는 행위만으로 만들어지지 않습니다. Touchline Replay 90은 경기 시간, 점수, 미션, 제약, 코치진 조언, 직접 조작, 결과 리포트를 하나의 흐름으로 연결해 사용자가 실제로 터치라인에서 결정을 내리는 감각을 느끼도록 설계했습니다.

### 핵심 인터랙션

사용자는 전술판에서 선수를 드래그하고, 포메이션을 바꾸고, 벤치 선수를 교체하고, 압박 라인과 템포, 폭, 위험도, 공격 방향을 조절합니다. 모든 조작은 Fate Meter와 코치진 조언에 즉시 반영되며, 최종적으로 Fate Simulation을 통해 다음 15분의 경기 흐름으로 표현됩니다.

### 데이터 활용 방식

OpenFootball worldcup.json 등 공개 월드컵 데이터와 자체 작성 시나리오 JSON을 활용합니다. 외부 API 키가 필요한 기능은 MVP에서 제외하여 심사자가 별도 설정 없이 서비스를 확인할 수 있도록 합니다. 공식 로고, 선수 사진, 중계 화면 등 저작권 위험이 있는 자산은 사용하지 않습니다.

### 차별화 포인트

기존 전술판은 선수를 배치하고 전술을 그리는 데 집중합니다. Touchline Replay 90은 여기서 한 단계 더 나아가, 사용자의 결정이 실제 경기 기준선 대비 어떤 변화를 만들었는지 설명합니다. "Real Match vs My Call vs Coach Pick" 구조를 통해 사용자는 단순한 배치가 아니라 감독의 의사결정을 경험합니다.

## 11. 구현팀에게 줄 최종 우선순위

1. Scenario JSON
- Decision Moment, mission, constraint, realBaseline, opponentModel, coachOptions 포함

2. Match Desk
- 3개 시나리오 카드
- 첫 화면에서 바로 CTA

3. Tactical Board
- SVG pitch
- player token drag
- formation presets
- substitution
- tactic controls

4. Fate Meter
- 조작 즉시 점수 변화

5. Coach Room Trio
- 로컬 rule template 기반 조언

6. Fate Simulation
- event card 3-5개 생성

7. Manager Report
- score
- reason tags
- warning tags
- Real vs Me vs Coach
- persona card

8. Polish
- responsive tabs
- share/export
- demo flow

