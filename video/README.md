# 되감독 90 홍보 영상

실제 배포 서비스의 사용자 흐름과 핵심 화면을 Remotion으로 재구성한 64초 홍보 영상입니다.

## 편집 원칙

- 62초 분량의 단일 한국어 내레이션을 사용해 음성이 장면 사이에서 끊기지 않음
- 후킹 → 문제 → 경기 선택 → 전술 개입 → 변화 설명 → 시뮬레이션 → 결과 → 브랜드 엔딩 구조
- 실제 1920x1080 서비스 녹화와 제품 화면만 사용
- 서비스와 무관한 가짜 커서, 공 궤적, GOAL 오버레이를 사용하지 않음
- 앱이 실제로 표시한 리플레이와 득점 판정만 영상에 포함
- 저작권 위험이 있는 선수 사진, 방송 영상, 외부 음원을 사용하지 않음
- 자막은 하단 안전 영역에 배치하고 화면을 가리지 않도록 제한

## 명령어

```bash
npm ci
npm run tts
npm run capture:real
npm run render
npm run render:thumbnail
```

- 최종 영상: `../output/video/doegamdok90-demo.mp4`
- 썸네일: `../output/video/doegamdok90-thumbnail.png`
- 연속 내레이션 대본: `promo-script.txt`
- 실제 녹화 소스: `public/captures/actual-flow.webm`

실제 경기 사실과 자체 체험 모델 수치를 명확히 분리하며, FIFA·국가대표팀·선수와 제휴 관계가 없는 비공식 팬 시뮬레이션입니다.
