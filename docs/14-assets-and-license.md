# Touchline Replay 90 자산·라이선스 등록부

최종 갱신: 2026-07-11  
목적: 대회 제출물의 이미지·음향·아이콘·데이터 출처를 재현 가능하게 기록한다.

## 1. 프로젝트 전용 생성 자산

| 자산 | 파일 | 제작 방식 | 외부 권리 요소 | 사용 범위 |
| --- | --- | --- | --- | --- |
| 야간 경기장 파노라마 | `app/public/assets/stadium-touchline-night-v1.webp` | OpenAI 이미지 생성 도구로 본 프로젝트를 위해 생성 | 로고·선수·스폰서·국기·문자 없음 | 앱 배경, 기획서, 발표자료 |
| 탑다운 전술 피치 | `app/public/assets/pitch-dark-vertical.png` | OpenAI 이미지 생성 도구로 본 프로젝트를 위해 생성 | 로고·선수·스폰서·문자 없음 | 전술 보드 |
| 경기장 관중음 | `app/public/assets/stadium-crowd-loop-v1.wav` | `scripts/generate_crowd_audio.mjs`의 고정 시드 노이즈 합성 | 외부 음원·녹음·샘플 없음 | 선택형 배경 음향 |
| PPT 표지 경기장 | `output/presentation/assets/v14/cover-stadium-rewind-v1.png` | OpenAI 이미지 생성 도구로 본 프로젝트를 위해 생성 | 식별 인물·로고·국기·스폰서·문자 없음 | V14 기획서 표지 |
| PPT 문제 장면 | `output/presentation/assets/v14/problem-heartbreak-v1.png` | OpenAI 이미지 생성 도구로 본 프로젝트를 위해 생성 | 익명 뒷모습, 식별 얼굴·팀 표식·문자 없음 | V14 기획서 문제 정의 |
| PPT 전술 인과 장면 | `output/presentation/assets/v14/tactical-causality-v1.png` | OpenAI 이미지 생성 도구로 본 프로젝트를 위해 생성 | 익명 마커, 이름·번호·로고·국기·문자 없음 | V14 기획서 핵심 경험 |
| PPT 엔딩 감독석 | `output/presentation/assets/v14/closing-manager-seat-v1.png` | OpenAI 이미지 생성 도구로 본 프로젝트를 위해 생성 | 인물·로고·국기·스폰서·문자 없음 | V14 기획서 엔딩 |

경기장 파노라마 생성 지시의 핵심은 “감독의 테크니컬 에어리어 시점, 가득 찬 야간 경기장, 식별 가능한 인물·상표·문자 없음”이었다. 앱에는 용량을 줄인 WebP만 포함한다.

V14 발표자료 이미지의 전체 프롬프트와 파일 설명은 `output/presentation/assets/v14/README.md`에 기록한다. 생성 출력도 제3자 권리 검토 책임이 사라지는 것은 아니므로, 최종 제출 전에 실존 인물 닮은꼴·상표·문자 노출 여부를 다시 육안 검사한다.

## 2. 오픈소스 패키지

| 패키지 | 용도 | 라이선스 | 확인 위치 |
| --- | --- | --- | --- |
| `@phosphor-icons/react` | 인터페이스 아이콘 | MIT | `app/node_modules/@phosphor-icons/react/LICENSE` |
| `country-flag-icons` | ISO 국가 국기 SVG | MIT | `app/node_modules/country-flag-icons/LICENSE` |
| React, Vite 및 개발 의존성 | 앱 런타임·빌드 | 각 패키지 선언 라이선스 | `app/package-lock.json` |

## 3. 국기와 선수 식별 마커

경기 선택 화면에서 선수 사진을 사용하지 않는다. 국가는 `country-flag-icons`가 제공하는 3:2 비율 ISO 국기로만 구분한다. 현재 사용하는 코드는 `KR`, `GH`, `PT`, `AR`, `FR`, `BE`, `JP`, `BR`, `HR`이다.

경기장 선수 토큰은 Phosphor Icons의 `TShirt` 아이콘, 국가별 유니폼 색상, 실제 등번호와 선수명을 조합한다. 전술 보드, 선택 선수 정보, 벤치와 시뮬레이션 리플레이가 같은 마커 규칙을 사용한다. 밝은 유니폼에는 어두운 등번호, 어두운 유니폼에는 흰 등번호가 자동 적용된다.

실제 선수 사진, 합성 닮은꼴, 국가대표 엠블럼, FIFA 로고와 유니폼 스폰서 표식은 앱 저장소와 배포물에 포함하지 않는다. 이름과 다른 얼굴을 억지로 매칭하지 않아 오인을 방지하면서, 등번호와 위치는 실제 경기 맥락을 유지한다.

### 실제 선수 사진을 사용하지 않는 이유

- 대회는 코드와 이미지 등 모든 제출 자산의 저작권·라이선스 준수를 요구한다: [DAKER 대회 안내](https://daker.ai/public/hackathons/world-cup-manager-tactics-web-challenge).
- CC 사진은 촬영자의 저작권 재사용 조건을 정할 뿐, 사진 속 인물의 초상·퍼블리시티 권리를 없애지 않는다: [Wikimedia Commons 재사용 안내](https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia/en), [식별 가능한 인물 사진 가이드](https://commons.wikimedia.org/wiki/Commons:Dignity).
- 국내에서는 경제적 가치가 있는 유명인의 성명·초상 등 식별표지를 무단으로 영업에 사용하는 행위를 부정경쟁행위로 규정한다: [국가법령정보센터 조문](https://law.go.kr/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1020635549), [지식재산처 설명](https://kipo.go.kr/ko/kpoBultnDetail.do?aprchId=BUT0000029&menuCd=SCD0200618&ntatcSeq=19495&sysCd=SCD02).

따라서 사진의 CC 조건을 충족하더라도 선수 또는 권리관리 주체의 별도 허락 없이는 대회 배포물에 실제 얼굴을 넣지 않는다. 코드도 `rightsStatus`, `license`, `attribution`, `permissionReference`가 모두 등록된 정확한 초상만 렌더링하며 하나라도 빠지면 유니폼 마커로 되돌아간다.

## 4. 데이터와 고지

- 경기 날짜, 스코어, 득점 사건 등 사실 정보는 각 시나리오에 연결한 FIFA 공식 경기 리포트를 참고한다.
- 선수 능력치, 상대 프로필, xG, 전술 점수, 시뮬레이션 사건은 체험용 큐레이션·모델 값이며 실제 예측 확률이 아니다.
- FIFA 로고, 국가대표 엠블럼, 방송 캡처, 실제 선수 사진은 저장소와 배포물에 포함하지 않는다.
- 외부 데이터와 생성 자산 사용 내역은 최종 제출 README와 기획서에 동일하게 고지한다.

## 5. 최종 제출 전 체크

- [ ] 모든 `scenario.sourceUrl`이 공개 접근 가능한 FIFA 공식 페이지인지 재확인
- [ ] 배포 번들에 원본 PNG, 미사용 폰트, 라이선스 불명 자산이 없는지 재확인
- [ ] GitHub README에 비공식 시뮬레이션 모델 고지를 유지
- [ ] 국기 패키지 버전·MIT 라이선스가 `package-lock.json`과 일치하는지 확인
- [ ] 선수 데이터에 증빙 없는 `portrait` 필드가 추가되지 않았는지 테스트로 확인
- [ ] 시연 영상 설명란에 서비스·데이터·자산 고지를 요약
- [ ] V14 발표 이미지 4개의 원본·프롬프트·생성일을 제출 보관본에 포함
