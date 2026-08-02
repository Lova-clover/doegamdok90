# 되감독 90 시연 영상

실제 배포 서비스의 사용자 흐름을 Playwright로 1920x1080 녹화하고, Remotion으로 내레이션과 최소한의 자막만 합성한 제출용 영상입니다.

## 제작 원칙

- 정지 이미지나 가짜 UI 연출 없이 실제 서비스 녹화만 사용
- 포메이션 선택, 선수 이동, 전술 조절, 시뮬레이션, 결과 리포트를 한 흐름으로 기록
- 임의의 GOAL 오버레이를 사용하지 않고 서비스의 골라인 판정 결과만 노출
- 배경 음악, 인공 클릭음, 전환 효과음을 사용하지 않음
- 실제 조작 커서는 녹화 시점에만 표시하며 의미 있는 클릭에 맞춰 이동
- 원본 녹화는 1.25배 재생해 전체 흐름을 약 72초로 압축
- 한국어 TTS 구간에만 하단 안전 영역 자막 표시

## 명령어

```bash
npm ci
npm run capture:real
npm run render
npm run render:thumbnail
```

- 최종 영상: `../output/video/doegamdok90-demo.mp4`
- 썸네일: `../output/video/doegamdok90-thumbnail.png`
- 실제 녹화 소스: `public/captures/actual-flow.webm`

실제 경기 사실과 자체 체험 모델 수치를 명확히 분리하며, FIFA·국가대표팀·선수와 제휴 관계가 없는 비공식 팬 시뮬레이션입니다.
