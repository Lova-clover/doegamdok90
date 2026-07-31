# V12 레퍼런스 기반 대중성 업그레이드 감사

검수일: 2026-07-11

## 검수 범위

- 월드컵 아쉬운 경기 아카이브
- 전술 보드에서 시뮬레이션 준비 화면 진입
- 라이브 리플레이와 골 장면
- 감독 리포트와 다음 경기 진입
- 완료 상태 저장
- 1280×720 데스크톱, 390×844 모바일

## 변경 전 핵심 문제

1. 시뮬레이션 결과는 보이지만 사용자가 이번 경기에서 무엇을 잘해야 하는지 세부 기준이 부족했습니다.
2. 장면 타임라인은 사건 순서만 보여주고 양 팀의 주도권 변화는 설명하지 못했습니다.
3. 리포트 종료 후 다시 아카이브를 열어 다음 경기를 찾아야 했습니다.
4. 여러 경기를 플레이해도 완료한 경기를 수집하는 감각이 없었습니다.

## 반영한 해결책

- 경기별 결과·핵심 전술·위험 관리로 구성한 매치 플랜 3
- 장면별 누적 xG 변화와 득점 중요도를 반영한 양방향 공격 모멘텀
- 리포트의 목표별 실제값, 성공 상태, 진행 막대
- 아직 완료하지 않은 다음 경기 자동 추천
- 브라우저 저장 기반 완료 카운트와 아카이브 완료 배지
- 공유 문구에 스코어·감독 유형·매치 플랜 달성 수 포함

## 실브라우저 검수 결과

| 항목 | 결과 |
| --- | --- |
| 데스크톱 준비 화면에서 3개 목표 가독성 | 통과 |
| 라이브 첫 화면에서 모멘텀과 경기장 동시 노출 | 통과 |
| 모멘텀 버튼으로 열린 장면 재선택 | 통과 |
| 골 장면 공의 골라인 도착 후 결과 노출 | 통과 |
| 리포트 매치 플랜 3/3 판정 | 통과 |
| 다음 경기 CTA로 한국-포르투갈 65분 진입 | 통과 |
| 완료 경기 아카이브 표시와 완료 수 증가 | 통과 |
| 390px 모바일 텍스트·버튼 겹침 | 없음 |
| 브라우저 콘솔 오류 | 0건 |

## 자동 검증

- `npm test`: 24/24 통과
- `npm run build`: 성공
- `npm audit --audit-level=moderate`: 취약점 0건
- `git diff --check`: 공백 오류 없음

## 화면 증거

변경 전:

- `app/audit/reference-upgrade-v12/before/01-archive.png`
- `app/audit/reference-upgrade-v12/before/03-simulation-ready.png`
- `app/audit/reference-upgrade-v12/before/04-simulation-live.png`
- `app/audit/reference-upgrade-v12/before/05-report.png`

변경 후:

- `app/audit/reference-upgrade-v12/after/01-archive.png`
- `app/audit/reference-upgrade-v12/after/02-simulation-ready.png`
- `app/audit/reference-upgrade-v12/after/04-simulation-live-refined.png`
- `app/audit/reference-upgrade-v12/after/05-report-top.png`
- `app/audit/reference-upgrade-v12/after/06-report-next-match.png`
- `app/audit/reference-upgrade-v12/after/07-archive-completed.png`
- `app/audit/reference-upgrade-v12/after/08-mobile-archive.png`
- `app/audit/reference-upgrade-v12/after/09-mobile-ready.png`
- `app/audit/reference-upgrade-v12/after/10-mobile-live.png`

## 잔여 위험

- 실제 이벤트 데이터가 아닌 큐레이션 모델이므로 결과는 경기 예측이 아니라 선택 비교용 시뮬레이션임을 계속 명시해야 합니다.
- 초상 권리 증빙이 없는 실제 선수 사진은 계속 차단합니다.
- 대회 직전 주요 브라우저에서 배포 URL의 자동 저장과 Web Audio 권한을 다시 확인해야 합니다.

