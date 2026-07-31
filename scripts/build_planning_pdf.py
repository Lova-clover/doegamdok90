from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output" / "pdf" / "touchline-replay-90-planning-proposal.pdf"
FONT_DIR = Path("C:/Windows/Fonts")


def register_fonts():
    pdfmetrics.registerFont(TTFont("Malgun", str(FONT_DIR / "malgun.ttf")))
    pdfmetrics.registerFont(TTFont("Malgun-Bold", str(FONT_DIR / "malgunbd.ttf")))


def make_styles():
    styles = getSampleStyleSheet()
    styles.add(
        ParagraphStyle(
            name="TitleK",
            fontName="Malgun-Bold",
            fontSize=28,
            leading=34,
            alignment=TA_CENTER,
            textColor=colors.HexColor("#10251f"),
            spaceAfter=10,
        )
    )
    styles.add(
        ParagraphStyle(
            name="SubtitleK",
            fontName="Malgun",
            fontSize=12,
            leading=18,
            alignment=TA_CENTER,
            textColor=colors.HexColor("#4e5f58"),
            spaceAfter=20,
        )
    )
    styles.add(
        ParagraphStyle(
            name="H1K",
            fontName="Malgun-Bold",
            fontSize=17,
            leading=23,
            textColor=colors.HexColor("#123b31"),
            spaceBefore=8,
            spaceAfter=8,
        )
    )
    styles.add(
        ParagraphStyle(
            name="H2K",
            fontName="Malgun-Bold",
            fontSize=12,
            leading=17,
            textColor=colors.HexColor("#174a3c"),
            spaceBefore=8,
            spaceAfter=4,
        )
    )
    styles.add(
        ParagraphStyle(
            name="BodyK",
            fontName="Malgun",
            fontSize=9.5,
            leading=15,
            textColor=colors.HexColor("#26332f"),
            alignment=TA_LEFT,
            spaceAfter=5,
        )
    )
    styles.add(
        ParagraphStyle(
            name="SmallK",
            fontName="Malgun",
            fontSize=8,
            leading=12,
            textColor=colors.HexColor("#53635d"),
            spaceAfter=3,
        )
    )
    styles.add(
        ParagraphStyle(
            name="TableHeaderK",
            fontName="Malgun-Bold",
            fontSize=9.5,
            leading=14,
            textColor=colors.white,
            spaceAfter=0,
        )
    )
    styles.add(
        ParagraphStyle(
            name="MonoK",
            fontName="Courier",
            fontSize=7.5,
            leading=10,
            textColor=colors.HexColor("#25312d"),
            backColor=colors.HexColor("#f4f7f5"),
            borderColor=colors.HexColor("#d8e3de"),
            borderWidth=0.6,
            borderPadding=5,
            spaceBefore=3,
            spaceAfter=8,
        )
    )
    return styles


def p(text, style):
    return Paragraph(text.replace("\n", "<br/>"), style)


def bullet(text, styles):
    return p(f"- {text}", styles["BodyK"])


def table(data, col_widths, header=True):
    converted = []
    for row_index, row in enumerate(data):
        row_style = STYLES["TableHeaderK"] if header and row_index == 0 else STYLES["BodyK"]
        converted.append(
            [
                cell if hasattr(cell, "wrap") else Paragraph(str(cell), row_style)
                for cell in row
            ]
        )
    tbl = Table(converted, colWidths=col_widths, hAlign="LEFT", repeatRows=1 if header else 0)
    style = [
        ("FONTNAME", (0, 0), (-1, -1), "Malgun"),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#d7e2de")),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f8fbf9")]),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]
    if header:
        style.extend(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#123b31")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTNAME", (0, 0), (-1, 0), "Malgun-Bold"),
            ]
        )
    tbl.setStyle(TableStyle(style))
    return tbl


def add_page_number(canvas, doc):
    canvas.saveState()
    canvas.setFont("Malgun", 8)
    canvas.setFillColor(colors.HexColor("#70817a"))
    canvas.drawString(18 * mm, 10 * mm, "Touchline Replay 90")
    canvas.drawRightString(192 * mm, 10 * mm, f"{doc.page}")
    canvas.restoreState()


def section_title(story, title):
    story.append(p(title, STYLES["H1K"]))


def build_story():
    story = []

    story.append(Spacer(1, 45 * mm))
    story.append(p("Touchline Replay 90", STYLES["TitleK"]))
    story.append(
        p(
            "월드컵 경기의 결정적 순간에 감독으로 투입되어 전술을 바꾸고 결과를 확인하는 동적 웹서비스",
            STYLES["SubtitleK"],
        )
    )
    story.append(Spacer(1, 8 * mm))
    story.append(
        table(
            [
                ["항목", "내용"],
                ["한 줄 소개", "선수 배치, 포메이션, 교체, 전술 지시를 직접 조작하고 15분 경기 흐름을 시뮬레이션하는 감독 경험 서비스"],
                ["핵심 가치", "단순 전술판이 아니라 압박감, 선택, 결과, 리포트가 있는 '감독 의사결정 리플레이'"],
                ["제출 적합성", "서비스 개요, 감독 경험 설계, 페이지 구성, 인터랙션 명세, 데이터 활용, 주요 흐름을 모두 포함"],
            ],
            [35 * mm, 135 * mm],
        )
    )
    story.append(PageBreak())

    section_title(story, "1. 서비스 개요")
    story.append(
        p(
            "Touchline Replay 90은 사용자가 실제 월드컵 경기에서 영감을 받은 결정적 순간에 감독으로 들어가 전술을 직접 구성하는 웹 시뮬레이터입니다. 사용자는 포메이션 프리셋을 고르고, 선수를 드래그하며, 교체와 전술 지시를 조정한 뒤 짧은 시뮬레이션과 감독 리포트를 받습니다.",
            STYLES["BodyK"],
        )
    )
    story.append(
        table(
            [
                ["구분", "설계 방향"],
                ["문제", "팬들은 '내가 감독이라면'이라는 생각을 하지만, 기존 전술판은 결과와 맥락을 거의 제공하지 않음"],
                ["해결", "경기 상황, 상대 약점, 감독 목표, 조작 가능한 전술, 결과 리포트를 하나의 흐름으로 연결"],
                ["MVP", "3개 시나리오, 드래그 전술판, 포메이션, 교체, 전술 슬라이더, 상대 오버레이, 로컬 시뮬레이션, 리포트"],
                ["비목표", "실시간 월드컵 API, 공식 로고/선수 사진, 90분 물리 시뮬레이션, 로그인 기반 저장"],
            ],
            [32 * mm, 138 * mm],
        )
    )
    story.append(Spacer(1, 5 * mm))
    story.append(p("대회 우승 포인트", STYLES["H2K"]))
    for text in [
        "참신성: '전술판'을 '경기 중 의사결정 리플레이'로 확장합니다.",
        "감독 경험: 시간, 점수, 목표, 상대 약점이 있어 사용자가 실제로 터치라인에 선 느낌을 받습니다.",
        "완성도: 정적 JSON과 로컬 규칙 엔진으로 API 장애 없이 안정적으로 동작합니다.",
        "기획/구현 일관성: 화면, 데이터, 기능, 평가 로직이 모두 동일한 핵심 루프를 향합니다.",
    ]:
        story.append(bullet(text, STYLES))
    story.append(PageBreak())

    section_title(story, "2. 감독 경험 설계")
    story.append(
        table(
            [
                ["감정", "제품 장치", "사용자 느낌"],
                ["압박", "67분, 0-1, 15분 안에 동점 같은 명확한 상황", "지금 결정해야 한다"],
                ["통제", "선수 드래그, 역할 변경, 교체, 전술 슬라이더", "내가 직접 지시하고 있다"],
                ["피드백", "공격/수비/점유/위험도 미터 실시간 갱신", "이 선택이 경기 양상을 바꾼다"],
                ["결과", "시뮬레이션 이벤트와 감독 리포트", "내 전술이 왜 통했거나 실패했는지 알겠다"],
                ["공유", "감독 페르소나 카드", "친구나 투표자에게 보여주고 싶다"],
            ],
            [25 * mm, 72 * mm, 73 * mm],
        )
    )
    story.append(Spacer(1, 4 * mm))
    story.append(p("핵심 루프", STYLES["H2K"]))
    story.append(
        p(
            "시나리오 선택 -> 경기 브리핑 확인 -> 전술판 조작 -> 시뮬레이션 실행 -> 감독 리포트 확인 -> 재도전/공유",
            STYLES["BodyK"],
        )
    )
    story.append(p("사용자 불편 최소화 원칙", STYLES["H2K"]))
    for text in [
        "첫 화면에서 바로 시나리오를 고르게 하며 긴 설명을 앞세우지 않습니다.",
        "초보자는 포메이션 프리셋과 자동 균형 기능으로 시작할 수 있습니다.",
        "모바일에서는 정밀 드래그 대신 탭해서 이동하는 대체 흐름을 제공합니다.",
        "잘못된 상태는 막연한 오류가 아니라 '골키퍼가 빠졌습니다'처럼 고칠 행동을 알려줍니다.",
    ]:
        story.append(bullet(text, STYLES))
    story.append(PageBreak())

    section_title(story, "3. 페이지 구성")
    story.append(
        table(
            [
                ["페이지", "목적", "핵심 요소"],
                ["Match Desk", "시나리오 선택과 경기 맥락 이해", "경기 시간, 점수, 목표, 상대 약점, 시작 버튼"],
                ["Tactics Board", "전술을 직접 조작하는 메인 화면", "피치, 선수 토큰, 벤치, 프리셋, 전술 컨트롤, 위험도"],
                ["Simulation Moment", "사용자 결정의 결과를 짧게 보여줌", "타임라인, 이벤트 카드, 지표 변화"],
                ["Manager Report", "결과와 이유를 설명하고 공유 유도", "감독 점수, 목표 성공, 전술 이유, 페르소나 카드"],
            ],
            [34 * mm, 58 * mm, 78 * mm],
        )
    )
    story.append(Spacer(1, 6 * mm))
    story.append(p("데스크톱 전술판 와이어프레임", STYLES["H2K"]))
    story.append(
        p(
            "+--------------------------------------------------------------+<br/>"
            "| Brief/Bench |           Interactive Pitch           | Controls |<br/>"
            "|             | Formation presets above               | sliders  |<br/>"
            "| Selected    | Draggable player tokens               | radar    |<br/>"
            "| player      | Opponent danger/weak overlay          | CTA      |<br/>"
            "+--------------------------------------------------------------+<br/>"
            "| Timeline: past event -> current decision -> target minute     |<br/>"
            "+--------------------------------------------------------------+",
            STYLES["MonoK"],
        )
    )
    story.append(p("모바일 구조", STYLES["H2K"]))
    story.append(
        p(
            "모바일은 화면을 억지로 축소하지 않고 Board, Squad, Tactics, Timeline, Report 탭으로 분리합니다. Board 탭에서는 탭-투-무브 방식으로 드래그 불편을 줄입니다.",
            STYLES["BodyK"],
        )
    )
    story.append(PageBreak())

    section_title(story, "4. 핵심 인터랙션 명세")
    story.append(
        table(
            [
                ["기능", "사용자 행동", "시스템 반응"],
                ["선수 배치", "선수 토큰을 드래그하거나 탭으로 이동", "좌표 갱신, 역할 적합도와 전술 미터 업데이트"],
                ["포메이션", "4-3-3, 4-2-3-1, 3-4-3 등 선택", "기존 선수를 유지하며 권장 위치로 재배치"],
                ["교체", "벤치 선수를 선발 선수 위에 드롭", "확인 후 선수 교체, 체력/역할/위험도 재계산"],
                ["전술 지시", "압박 라인, 템포, 폭, 위험도, 공격 방향 변경", "공격/수비/점유/위험도 미터 실시간 변경"],
                ["상대 오버레이", "위험 지역과 약점 지역 토글", "공략해야 할 공간을 피치 위에 표시"],
                ["시뮬레이션", "15분 시뮬레이션 실행", "로컬 엔진이 이벤트와 감독 리포트 생성"],
            ],
            [31 * mm, 62 * mm, 77 * mm],
        )
    )
    story.append(Spacer(1, 5 * mm))
    story.append(p("전술 엔진", STYLES["H2K"]))
    story.append(
        p(
            "전술 엔진은 완전한 축구 물리 모델이 아니라 심사와 사용자 경험에 맞춘 투명한 로컬 규칙 엔진입니다. 선수 역할 적합도, 피치 간격, 상대 약점 공략, 수비 노출, 체력, 전술 지시 조합을 평가해 공격/수비/점유/위험 점수를 산출합니다.",
            STYLES["BodyK"],
        )
    )
    for text in [
        "공격 점수: 약점 지역 공략, 창의적 선수 위치, 폭과 템포 조합, 혼잡도.",
        "수비 점수: 후방 잔류 인원, 라인 간격, 압박 강도, 역습 노출.",
        "점유 점수: 미드필드 삼각형, 패스 적합도, 전개 방식.",
        "위험 점수: 높은 라인과 all-in 지시, 지친 수비수, 상대 역습 모델.",
    ]:
        story.append(bullet(text, STYLES))
    story.append(PageBreak())

    section_title(story, "5. 데이터 활용 방식")
    story.append(
        table(
            [
                ["데이터", "사용처", "방식"],
                ["OpenFootball worldcup.json", "월드컵 일정/결과/경기 맥락", "CC0 공개 데이터. 빌드 시 정적 JSON으로 포함"],
                ["자체 시나리오 JSON", "결정적 경기 상황, 목표, 상대 약점", "팀이 직접 작성해 심사 안정성 확보"],
                ["자체 선수 JSON", "포지션, 능력치, 특성, 체력", "공식 사진/로고 없이 텍스트와 숫자 중심"],
                ["Fjelstul DB 선택 사용", "풍부한 역사 데이터가 필요할 때", "CC-BY-SA 4.0 조건을 따를 경우에만 사용"],
            ],
            [39 * mm, 58 * mm, 73 * mm],
        )
    )
    story.append(Spacer(1, 5 * mm))
    story.append(p("샘플 시나리오", STYLES["H2K"]))
    story.append(
        p(
            "{<br/>"
            '  "id": "need-a-goal-67",<br/>'
            '  "minute": 67,<br/>'
            '  "score": [0, 1],<br/>'
            '  "objective": "15분 안에 동점 루트를 만들어라",<br/>'
            '  "weakZones": ["opponent_right_flank"],<br/>'
            '  "dangerZones": ["left_half_space", "central_counter"]<br/>'
            "}",
            STYLES["MonoK"],
        )
    )
    story.append(PageBreak())

    section_title(story, "6. 주요 사용 흐름")
    story.append(
        table(
            [
                ["단계", "화면", "사용자 행동", "성공 기준"],
                ["1", "Match Desk", "시나리오 선택", "10초 안에 상황과 목표 이해"],
                ["2", "Tactics Board", "포메이션 선택", "선수들이 권장 위치로 재배치"],
                ["3", "Tactics Board", "선수 이동과 교체", "미터가 즉시 변화"],
                ["4", "Tactics Board", "전술 지시 조정", "위험/공격/점유 변화 확인"],
                ["5", "Simulation", "시뮬레이션 실행", "이벤트 3개 이상 표시"],
                ["6", "Report", "결과 확인", "점수와 이유, 페르소나 카드 표시"],
            ],
            [18 * mm, 34 * mm, 58 * mm, 60 * mm],
        )
    )
    story.append(Spacer(1, 6 * mm))
    story.append(p("데모 영상 추천 흐름", STYLES["H2K"]))
    for text in [
        "0:00-0:10 앱 시작, 시나리오 선택.",
        "0:10-0:40 전술판 진입, 포메이션 변경.",
        "0:40-1:10 선수 드래그, 교체, 전술 슬라이더 조작.",
        "1:10-1:35 상대 오버레이와 위험도 변화 확인.",
        "1:35-2:00 시뮬레이션 실행.",
        "2:00-2:30 감독 리포트와 공유 카드 표시.",
    ]:
        story.append(bullet(text, STYLES))
    story.append(PageBreak())

    section_title(story, "7. 구현 구조")
    story.append(
        table(
            [
                ["영역", "권장 구현"],
                ["프론트엔드", "React + TypeScript, Vite 또는 Next.js"],
                ["드래그", "dnd-kit 또는 Pointer Events 기반 구현"],
                ["상태", "Zustand 또는 React state"],
                ["피치", "SVG 기반 좌표/오버레이, 추후 Canvas 애니메이션 확장"],
                ["데이터", "src/data 아래 정적 JSON"],
                ["시뮬레이션", "순수 함수 evaluateTactic, simulateScenario, generateReasons"],
            ],
            [35 * mm, 135 * mm],
        )
    )
    story.append(Spacer(1, 5 * mm))
    story.append(
        p(
            "권장 폴더: src/features/match-desk, src/features/tactics-board, src/features/manager-report, src/domain/tactics, src/domain/simulation, src/data.",
            STYLES["BodyK"],
        )
    )
    story.append(p("MVP 완료 기준", STYLES["H2K"]))
    for text in [
        "3개 시나리오를 끝까지 플레이할 수 있습니다.",
        "드래그, 포메이션, 교체, 전술 슬라이더, 시뮬레이션, 리포트가 실제로 작동합니다.",
        "로그인과 API 키 없이 배포 URL에서 바로 실행됩니다.",
        "README에 실행 방법, 기술 스택, 데이터 출처가 명확히 적힙니다.",
    ]:
        story.append(bullet(text, STYLES))
    story.append(PageBreak())

    section_title(story, "8. 우승 가능성 강화 전략")
    story.append(
        p(
            "강화된 콘셉트는 '전술판'이 아니라 '월드컵 운명의 15분을 다시 지휘하는 감독 의사결정 리플레이'입니다. 사용자는 실제 경기 기준선과 코치 추천안을 비교하며 나만의 선택이 경기 흐름을 얼마나 바꿨는지 확인합니다.",
            STYLES["BodyK"],
        )
    )
    story.append(
        table(
            [
                ["킬러 기능", "심사 효과", "구현 방식"],
                ["Decision Moment Card", "시작 10초 안에 감독 압박감 형성", "분, 점수, 미션, 제약, 실제 기준선을 카드화"],
                ["Coach Room Trio", "감독 옆 코치진이 있는 몰입감", "외부 API 없이 로컬 규칙으로 조언 생성"],
                ["Fate Meter", "대중도 이해하는 감정적 점수", "실제 기준선 대비 운명 변화 수치 표시"],
                ["Real vs Me vs Coach", "참신성과 데이터 활용을 동시에 증명", "실제 경기, 사용자 선택, 코치 추천 비교"],
                ["Manager Persona Card", "투표/공유 동기 강화", "점수 형태를 감독 성향 카드로 변환"],
            ],
            [42 * mm, 60 * mm, 68 * mm],
        )
    )
    story.append(Spacer(1, 5 * mm))
    story.append(p("평가 기준별 노림수", STYLES["H2K"]))
    story.append(
        table(
            [
                ["평가 항목", "목표", "앱에서 보여줄 증거"],
                ["참신성 30", "전술판을 의사결정 리플레이로 확장", "운명 변화, 3자 비교, 시나리오 기준선"],
                ["감독 경험 25", "압박감과 선택의 책임 제공", "미션, 코치 조언, 직접 조작, 결과 리포트"],
                ["완성도 25", "짧고 안정적인 엔드투엔드", "정적 JSON, 로컬 엔진, no-login, no-key"],
                ["기획/구현 20", "문서와 앱 구조 일치", "PRD 기능명이 화면/코드/영상에 그대로 등장"],
            ],
            [35 * mm, 62 * mm, 73 * mm],
        )
    )
    story.append(PageBreak())

    section_title(story, "9. 구체 시나리오와 결과 엔진")
    story.append(
        table(
            [
                ["시나리오", "미션", "핵심 선택"],
                ["승리가 필요한 67분", "15분 안에 결승골 루트 만들기", "측면 러너 투입, 폭 확대, 중앙 역습 대비"],
                ["78분, 리드를 지켜라", "상대 막판 흐름 차단", "라인 조절, 박스 보호, 역습 출구 유지"],
                ["58분, 잠긴 수비를 열어라", "밀집 수비 상대로 찬스 품질 높이기", "하프스페이스 점유, 폭 조절, rest defense"],
                ["89분, 마지막 세트피스", "마지막 세트피스 루틴 설계", "러너 분산, 스크린, 세컨드볼, 역습 대비"],
            ],
            [45 * mm, 60 * mm, 65 * mm],
        )
    )
    story.append(Spacer(1, 5 * mm))
    story.append(p("결과 엔진 원칙", STYLES["H2K"]))
    for text in [
        "결과는 완전한 축구 예측이 아니라 사용자의 선택을 설명하는 로컬 규칙 엔진입니다.",
        "모든 점수에는 실제 사용자 행동과 연결된 reason tag를 붙입니다.",
        "높은 점수에도 최소 하나의 tradeoff를 보여줘 결과가 더 믿을 만하게 보이도록 합니다.",
        "같은 입력은 항상 같은 결과를 내서 심사 중 재현성을 보장합니다.",
    ]:
        story.append(bullet(text, STYLES))
    story.append(Spacer(1, 4 * mm))
    story.append(
        p(
            "예시 리포트: '실제 경기보다 12분 빠르게 결정적 찬스를 만들었습니다. 측면 과부하와 fresh runner 교체가 좋았지만, 78분 이후 높은 라인 때문에 중앙 역습 위험이 커졌습니다.'",
            STYLES["BodyK"],
        )
    )
    story.append(PageBreak())

    section_title(story, "10. 참고 자료와 출처")
    for text in [
        "DAKER competition page: https://daker.ai/public/hackathons/world-cup-manager-tactics-web-challenge",
        "OpenFootball worldcup.json: https://github.com/openfootball/worldcup.json",
        "Formation Builder reference: https://formationbuilder.com/en-US",
        "tactical-board.com reference: https://tactical-board.com/",
        "Tactico reference: https://tactico.pro/soccer-tactics",
        "Fjelstul World Cup Database: https://github.com/jfjelstul/worldcup",
    ]:
        story.append(bullet(text, STYLES))
    story.append(Spacer(1, 8 * mm))
    story.append(
        p(
            "저작권/라이선스 방침: 공식 로고, 선수 사진, 중계 화면은 사용하지 않습니다. 경기 및 선수 정보는 허용 가능한 공개 데이터와 자체 작성 JSON으로 구성하며, 사용한 데이터 출처는 앱과 GitHub README에 명시합니다.",
            STYLES["BodyK"],
        )
    )

    return story


if __name__ == "__main__":
    register_fonts()
    STYLES = make_styles()
    OUT.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(OUT),
        pagesize=A4,
        rightMargin=18 * mm,
        leftMargin=18 * mm,
        topMargin=16 * mm,
        bottomMargin=16 * mm,
        title="Touchline Replay 90 Planning Proposal",
        author="Codex",
    )
    doc.build(build_story(), onFirstPage=add_page_number, onLaterPages=add_page_number)
    print(OUT)
