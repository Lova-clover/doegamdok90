from __future__ import annotations

from pathlib import Path
from textwrap import shorten

from PIL import Image, ImageEnhance, ImageOps
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output" / "pdf" / "touchline-replay-90-winning-proposal.pdf"
TMP = ROOT / "tmp" / "pdfs" / "touchline-replay-90"
FONT_DIR = Path("C:/Windows/Fonts")

PAGE_W = 13.333 * inch
PAGE_H = 7.5 * inch

BG = colors.HexColor("#071013")
SURFACE = colors.HexColor("#0D181C")
SURFACE_2 = colors.HexColor("#122228")
LINE = colors.HexColor("#2B3C42")
TEXT = colors.HexColor("#F2F6F5")
MUTED = colors.HexColor("#A7B4B6")
DIM = colors.HexColor("#718187")
RED = colors.HexColor("#E53D3A")
RED_DARK = colors.HexColor("#A92222")
MINT = colors.HexColor("#51DDA7")
CYAN = colors.HexColor("#38C6DF")
AMBER = colors.HexColor("#E8B843")
WHITE = colors.white


def register_fonts():
    pdfmetrics.registerFont(TTFont("Malgun", str(FONT_DIR / "malgun.ttf")))
    pdfmetrics.registerFont(TTFont("Malgun-Bold", str(FONT_DIR / "malgunbd.ttf")))
    pdfmetrics.registerFontFamily(
        "Malgun", normal="Malgun", bold="Malgun-Bold", italic="Malgun", boldItalic="Malgun-Bold"
    )


def styles():
    return {
        "cover": ParagraphStyle(
            "cover", fontName="Malgun-Bold", fontSize=34, leading=41, textColor=TEXT
        ),
        "title": ParagraphStyle(
            "title", fontName="Malgun-Bold", fontSize=23, leading=29, textColor=TEXT
        ),
        "subtitle": ParagraphStyle(
            "subtitle", fontName="Malgun", fontSize=11, leading=17, textColor=MUTED
        ),
        "h2": ParagraphStyle(
            "h2", fontName="Malgun-Bold", fontSize=13, leading=18, textColor=TEXT
        ),
        "body": ParagraphStyle(
            "body", fontName="Malgun", fontSize=9, leading=14, textColor=MUTED
        ),
        "body-white": ParagraphStyle(
            "body-white", fontName="Malgun", fontSize=9, leading=14, textColor=TEXT
        ),
        "small": ParagraphStyle(
            "small", fontName="Malgun", fontSize=7.2, leading=10.5, textColor=MUTED
        ),
        "tiny": ParagraphStyle(
            "tiny", fontName="Malgun", fontSize=6.2, leading=8.5, textColor=DIM
        ),
        "number": ParagraphStyle(
            "number", fontName="Malgun-Bold", fontSize=30, leading=34, textColor=MINT
        ),
        "center": ParagraphStyle(
            "center", fontName="Malgun-Bold", fontSize=11, leading=15, textColor=TEXT, alignment=TA_CENTER
        ),
        "center-small": ParagraphStyle(
            "center-small", fontName="Malgun", fontSize=7.2, leading=10.5, textColor=MUTED, alignment=TA_CENTER
        ),
        "table-head": ParagraphStyle(
            "table-head", fontName="Malgun-Bold", fontSize=7.4, leading=10, textColor=TEXT
        ),
        "table": ParagraphStyle(
            "table", fontName="Malgun", fontSize=6.8, leading=9.5, textColor=MUTED
        ),
    }


ST = {}


def para(c, text, x, top, width, style="body", max_height=1000):
    item = Paragraph(text, ST[style])
    _, height = item.wrap(width, max_height)
    item.drawOn(c, x, top - height)
    return top - height


def line(c, x1, y1, x2, y2, color=LINE, width=1):
    c.setStrokeColor(color)
    c.setLineWidth(width)
    c.line(x1, y1, x2, y2)


def box(c, x, y, w, h, fill=SURFACE, stroke=LINE, radius=7, width=1):
    c.setFillColor(fill)
    c.setStrokeColor(stroke)
    c.setLineWidth(width)
    c.roundRect(x, y, w, h, radius, fill=1, stroke=1)


def label(c, text, x, y, color=RED, size=7.2):
    c.setFillColor(color)
    c.setFont("Malgun-Bold", size)
    c.drawString(x, y, text.upper())


def page_base(c, number, section):
    c.setFillColor(BG)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    c.setFillColor(RED)
    c.circle(27, PAGE_H - 25, 3, fill=1, stroke=0)
    c.setFillColor(TEXT)
    c.setFont("Malgun-Bold", 8.5)
    c.drawString(37, PAGE_H - 28, "Touchline Replay 90")
    c.setFillColor(DIM)
    c.setFont("Malgun", 6.8)
    c.drawRightString(PAGE_W - 28, PAGE_H - 27, f"{section}   {number:02d}")
    line(c, 28, 25, PAGE_W - 28, 25, LINE, 0.7)
    c.setFillColor(DIM)
    c.setFont("Malgun", 6.2)
    c.drawString(28, 12, "2026 DAKER World Cup Manager Tactics Web Challenge")
    c.drawRightString(PAGE_W - 28, 12, "Planning proposal v5.0 | 2026.07.10")


def slide_title(c, kicker, title, subtitle=""):
    label(c, kicker, 40, PAGE_H - 64)
    top = para(c, title, 40, PAGE_H - 76, PAGE_W - 80, "title")
    if subtitle:
        para(c, subtitle, 40, top - 4, PAGE_W - 80, "subtitle")


def bullet(c, text, x, top, width, color=MINT, style="body"):
    c.setFillColor(color)
    c.roundRect(x, top - 8, 4, 4, 1.5, fill=1, stroke=0)
    return para(c, text, x + 11, top, width - 11, style)


def arrow(c, x1, y1, x2, y2, color=CYAN, width=1.6):
    c.setStrokeColor(color)
    c.setFillColor(color)
    c.setLineWidth(width)
    c.line(x1, y1, x2, y2)
    angle = 5
    c.line(x2, y2, x2 - angle, y2 + angle / 1.8)
    c.line(x2, y2, x2 - angle, y2 - angle / 1.8)


def image_fit(c, path, x, y, w, h, mode="contain", darken=1.0, border=True, radius=6):
    path = Path(path)
    TMP.mkdir(parents=True, exist_ok=True)
    with Image.open(path) as src:
        src = src.convert("RGB")
        target = (max(1, int(w * 2)), max(1, int(h * 2)))
        if mode == "cover":
            out = ImageOps.fit(src, target, method=Image.Resampling.LANCZOS)
        else:
            out = Image.new("RGB", target, (7, 16, 19))
            contained = ImageOps.contain(src, target, method=Image.Resampling.LANCZOS)
            out.paste(contained, ((target[0] - contained.width) // 2, (target[1] - contained.height) // 2))
        if darken != 1.0:
            out = ImageEnhance.Brightness(out).enhance(darken)
        cache = TMP / f"{path.stem}-{int(x)}-{int(y)}-{int(w)}-{int(h)}-{mode}.jpg"
        out.save(cache, quality=92)
    c.drawImage(str(cache), x, y, width=w, height=h, mask="auto")
    if border:
        c.setFillColor(colors.Color(0, 0, 0, alpha=0))
        c.setStrokeColor(LINE)
        c.setLineWidth(1)
        c.roundRect(x, y, w, h, radius, fill=0, stroke=1)


def score_bar(c, label_text, score, max_score, x, y, w, color):
    c.setFillColor(TEXT)
    c.setFont("Malgun-Bold", 9)
    c.drawString(x, y + 13, label_text)
    c.setFillColor(MUTED)
    c.setFont("Malgun", 7)
    c.drawRightString(x + w, y + 13, f"{score} / {max_score}")
    c.setFillColor(SURFACE_2)
    c.roundRect(x, y, w, 6, 3, fill=1, stroke=0)
    c.setFillColor(color)
    c.roundRect(x, y, w * score / max_score, 6, 3, fill=1, stroke=0)


def table_grid(c, x, top, widths, rows, row_heights, header=True):
    y = top
    for r_idx, row in enumerate(rows):
        h = row_heights[r_idx] if isinstance(row_heights, list) else row_heights
        y -= h
        fill = SURFACE_2 if r_idx == 0 and header else (SURFACE if r_idx % 2 else colors.HexColor("#101D21"))
        c.setFillColor(fill)
        c.setStrokeColor(LINE)
        c.rect(x, y, sum(widths), h, fill=1, stroke=1)
        cx = x
        for idx, cell in enumerate(row):
            if idx:
                line(c, cx, y, cx, y + h, LINE, 0.7)
            style = "table-head" if r_idx == 0 and header else "table"
            para(c, str(cell), cx + 6, y + h - 6, widths[idx] - 12, style, h - 8)
            cx += widths[idx]
    return y


def make_pdf():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    TMP.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(OUT), pagesize=(PAGE_W, PAGE_H))
    c.setTitle("Touchline Replay 90 - 우승 전략 기획서")
    c.setAuthor("Touchline Replay 90 Team")

    # 1. Cover
    cover = ROOT / "app" / "audit" / "v4" / "desktop-intro-stadium.png"
    image_fit(c, cover, 0, 0, PAGE_W, PAGE_H, mode="cover", darken=0.38, border=False)
    c.setFillColor(colors.Color(0.02, 0.04, 0.05, alpha=0.68))
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    c.setFillColor(RED)
    c.rect(0, 0, 10, PAGE_H, fill=1, stroke=0)
    label(c, "Winning proposal", 55, PAGE_H - 74, RED, 8)
    para(c, "Touchline Replay <font color='#E53D3A'>90</font>", 55, PAGE_H - 92, 520, "cover")
    para(
        c,
        "결정의 순간을 되감고,<br/><b>내 전술로 경기의 운명을 다시 쓴다.</b>",
        55,
        PAGE_H - 162,
        505,
        "title",
    )
    para(
        c,
        "축구를 몰라도 10초 안에 시작하고, 결과가 왜 바뀌었는지 이해하며,<br/>실제 경기의 선택과 비교하는 설명 가능한 월드컵 결정 리플레이.",
        55,
        PAGE_H - 245,
        540,
        "subtitle",
    )
    box(c, 55, 74, 510, 82, fill=colors.HexColor("#0A1317"), stroke=colors.HexColor("#40535A"))
    label(c, "Core loop", 72, 135, MINT, 6.5)
    para(
        c,
        "4개 결정 순간 선택  ->  직접 배치·교체·조작  ->  경기별 시뮬레이션  ->  실제 vs 나 vs 코치 비교",
        72,
        122,
        474,
        "body-white",
    )
    c.setFillColor(TEXT)
    c.setFont("Malgun-Bold", 8)
    c.drawString(55, 43, "2026 DAKER World Cup Manager Tactics Web Challenge")
    c.setFillColor(MUTED)
    c.setFont("Malgun", 7)
    c.drawRightString(PAGE_W - 45, 43, "제출용 기획서 | MVP 구현 증거 포함")
    c.showPage()

    # 2. Competition decoder
    page_base(c, 2, "COMPETITION")
    slide_title(c, "01 / 대회 해석", "이 대회가 원하는 것은 '예쁜 전술판'이 아니라 작동하는 감독 경험이다")
    score_bar(c, "참신성", 30, 30, 48, 376, 310, RED)
    score_bar(c, "감독 경험 설계", 25, 25, 48, 322, 310, MINT)
    score_bar(c, "완성도", 25, 25, 48, 268, 310, CYAN)
    score_bar(c, "기획/구현 완성도", 20, 20, 48, 214, 310, AMBER)
    para(c, "내부 심사 100점 구조", 48, 414, 310, "h2")
    box(c, 392, 200, 520, 223, SURFACE, LINE)
    label(c, "Winning thesis", 414, 396, RED)
    para(c, "대중 투표와 내부 심사를 같은 핵심 루프로 잡는다", 414, 381, 465, "h2")
    top = 340
    for num, title, body, tone in [
        ("01", "10초 안에 첫 선택", "프리셋과 코치 플랜으로 축구 초보자의 이탈을 막는다.", MINT),
        ("02", "손으로 바꾸는 전술", "드래그·클릭·교체·슬라이더가 실제 점수와 이벤트를 바꾼다.", CYAN),
        ("03", "왜 달라졌는지 설명", "운명 지표의 원인과 실제 경기 비교가 심사 설득력을 만든다.", AMBER),
    ]:
        c.setFillColor(tone)
        c.setFont("Malgun-Bold", 13)
        c.drawString(414, top, num)
        para(c, f"<b>{title}</b><br/><font color='#A7B4B6'>{body}</font>", 460, top + 4, 420, "body-white")
        top -= 62
    box(c, 48, 78, 864, 90, colors.HexColor("#10191D"), colors.HexColor("#3B4A50"))
    label(c, "1차 투표 대응", 68, 139, RED)
    para(c, "0:2 대역전부터 2:0 리드 수성까지 + 회원가입 없는 90초 완주 + 결과 카드 공유", 68, 122, 820, "h2")
    para(c, "제출팀 투표 60%, 참가팀 20%, 대중 20%의 가중치를 고려해 첫 클릭 이해도와 시연 영상 전달력을 함께 최적화한다.", 68, 98, 810, "small")
    c.showPage()

    # 3. Problem
    page_base(c, 3, "PROBLEM")
    slide_title(c, "02 / 문제 정의", "사람들은 감독처럼 말하지만, 기존 서비스는 감독처럼 결정하게 만들지 못한다")
    para(c, '"내가 감독이라면 저 선수 안 쓰는데."', 58, 408, 450, "title")
    para(c, "이 강한 욕망이 기존 제품에서는 네 가지 지점에서 끊긴다.", 58, 365, 430, "subtitle")
    cards = [
        ("맥락 부재", "빈 전술판은 언제, 왜 바꿔야 하는지 알려주지 않는다.", RED),
        ("전문성 장벽", "포메이션과 수치만 보이면 축구 초보자는 첫 행동을 못 한다.", CYAN),
        ("결과 단절", "선수를 옮겨도 경기 흐름이 어떻게 달라지는지 느낄 수 없다.", MINT),
        ("블랙박스", "AI 추천과 점수가 이유 없이 제시되면 신뢰와 재도전이 사라진다.", AMBER),
    ]
    for idx, (title, body, tone) in enumerate(cards):
        x = 510 + (idx % 2) * 206
        y = 290 - (idx // 2) * 132
        box(c, x, y, 190, 112, SURFACE, LINE)
        c.setFillColor(tone)
        c.circle(x + 22, y + 84, 5, fill=1, stroke=0)
        para(c, title, x + 38, y + 96, 135, "h2")
        para(c, body, x + 18, y + 65, 154, "small")
    box(c, 58, 104, 390, 160, colors.HexColor("#0D171A"), colors.HexColor("#314248"))
    label(c, "Root problem", 80, 235, RED)
    para(c, "조작은 있지만 <font color='#E53D3A'><b>결정</b></font>이 없고,<br/>결과는 있지만 <font color='#51DDA7'><b>이유</b></font>가 없다.", 80, 210, 320, "title")
    para(c, "Touchline Replay 90은 경기 시점, 제한 시간, 상대 약점, 선택, 결과, 설명을 하나의 폐쇄 루프로 연결한다.", 80, 148, 320, "body")
    c.showPage()

    # 4. Positioning
    page_base(c, 4, "POSITIONING")
    slide_title(c, "03 / 독보적 이유", "월드컵 데이터로 만든 '설명 가능한 결정 리플레이'는 네 가지 경험을 동시에 가진다")
    rows = [
        ["경험", "정적 전술판", "스탯 대시보드", "일반 시뮬레이터", "Touchline Replay 90"],
        ["실제 결정 시점", "-", "부분", "-", "O"],
        ["직접 배치·교체", "O", "-", "O", "O"],
        ["결과 원인 설명", "-", "부분", "-", "O"],
        ["실제 vs 나 vs 코치", "-", "-", "-", "O"],
        ["초보자 10초 진입", "부분", "-", "부분", "O"],
        ["API 없이 심사 가능", "O", "부분", "O", "O"],
    ]
    table_grid(c, 48, 402, [150, 130, 145, 140, 205], rows, [34] + [32] * 6)
    box(c, 48, 82, 864, 98, SURFACE, colors.HexColor("#365058"))
    label(c, "One sentence", 68, 150, MINT)
    para(c, "축구를 몰라도 10초 안에 감독의 결정을 만들고, 결과가 왜 바뀌었는지 이해하며, 실제 경기의 선택과 비교한다.", 68, 132, 820, "h2")
    para(c, "이 조합이 단순 전술판, 데이터 분석, 게임형 시뮬레이션과 갈라지는 방어 가능한 제품 정체성이다.", 68, 104, 800, "small")
    c.showPage()

    # 5. Personas and outcomes
    page_base(c, 5, "USERS")
    slide_title(c, "04 / 사용자와 JTBD", "핵심 사용자는 전술 전문가가 아니라 '감독이 되어보고 싶은 시청자'다")
    personas = [
        ("PRIMARY", "축구 라이트 팬", "전술 용어는 어렵지만 경기 중 내 선택을 시험하고 싶다.", "도움 없이 첫 행동", MINT),
        ("SECONDARY", "전술 토론 팬", "포메이션과 선수 간격을 바꾸며 실제 감독의 선택과 비교하고 싶다.", "재도전과 비교", CYAN),
        ("VOTER", "대회 투표자·심사위원", "짧은 시간에 차별점과 완성도를 직접 확인하고 싶다.", "90초 완주와 신뢰", AMBER),
    ]
    for idx, (kind, name, job, success, tone) in enumerate(personas):
        x = 48 + idx * 292
        box(c, x, 178, 268, 230, SURFACE, LINE)
        label(c, kind, x + 20, 382, tone)
        para(c, name, x + 20, 360, 220, "h2")
        line(c, x + 20, 330, x + 248, 330, LINE, 0.7)
        label(c, "Job to be done", x + 20, 306, DIM, 6.2)
        para(c, job, x + 20, 288, 220, "body")
        label(c, "Success moment", x + 20, 230, DIM, 6.2)
        para(c, f"<font color='{tone.hexval()}'><b>{success}</b></font>", x + 20, 212, 220, "body-white")
    box(c, 48, 77, 852, 72, colors.HexColor("#111D21"), colors.HexColor("#314248"))
    metrics = [
        ("첫 조작", "10초 이내"),
        ("핵심 흐름 완주", "70% 이상"),
        ("규칙 위반", "0건"),
        ("도움 없는 성공", "8/10명"),
        ("공유 행동", "20% 목표"),
    ]
    for idx, (name, value) in enumerate(metrics):
        x = 70 + idx * 164
        c.setFillColor(MUTED)
        c.setFont("Malgun", 7)
        c.drawString(x, 124, name)
        c.setFillColor(MINT if idx < 3 else CYAN)
        c.setFont("Malgun-Bold", 12)
        c.drawString(x, 101, value)
    c.showPage()

    # 6. User flow
    page_base(c, 6, "USER FLOW")
    slide_title(c, "05 / 핵심 사용자 흐름", "설명보다 행동을 먼저 주고, 모든 행동을 결과의 이유로 되돌려준다")
    stages = [
        ("경기 선택", "4개 결정 순간", RED),
        ("시작안", "프리셋/코치", CYAN),
        ("전술 편집", "배치·교체", MINT),
        ("원인 피드백", "왜 바뀌나", AMBER),
        ("실시간 엔진", "xG·6개 장면", RED),
        ("감독 리포트", "실제·나·코치", MINT),
    ]
    y = 298
    for idx, (title, body, tone) in enumerate(stages):
        x = 44 + idx * 150
        box(c, x, y, 126, 84, SURFACE, tone, radius=6, width=1.2)
        label(c, f"0{idx + 1}", x + 12, y + 63, tone, 6.2)
        para(c, title, x + 12, y + 51, 102, "center")
        para(c, body, x + 12, y + 26, 102, "center-small")
        if idx < len(stages) - 1:
            arrow(c, x + 127, y + 42, x + 147, y + 42, DIM, 1.2)
    box(c, 48, 116, 410, 126, colors.HexColor("#0C181C"), colors.HexColor("#31525B"))
    label(c, "Beginner lane", 68, 217, CYAN)
    para(c, "경기별 코치 플랜 -> 포메이션 + 강도 + 교체 적용 -> 한 번만 직접 수정", 68, 198, 365, "body-white")
    bullet(c, "축구 지식이 없어도 유효한 첫 전술을 만든다.", 68, 160, 355, CYAN, "small")
    bullet(c, "수정한 부분만 즉시 원인 피드백으로 배운다.", 68, 138, 355, CYAN, "small")
    box(c, 490, 116, 410, 126, colors.HexColor("#0C181C"), colors.HexColor("#355045"))
    label(c, "Expert lane", 510, 217, MINT)
    para(c, "포메이션 선택 -> 선수 직접 이동 -> 4개 전술 파라미터 -> 위험/효과 비교", 510, 198, 365, "body-white")
    bullet(c, "동일 시나리오를 여러 해법으로 재도전한다.", 510, 160, 355, MINT, "small")
    bullet(c, "실제 감독의 선택과 구조적으로 비교한다.", 510, 138, 355, MINT, "small")
    c.showPage()

    # 7. Screen structure and wireframe
    page_base(c, 7, "WIREFRAME")
    slide_title(c, "06 / 페이지 구조와 와이어프레임", "한 화면 한 결정: 시작, 편집, 시뮬레이션, 비교의 역할을 분리한다")
    screens = [
        ("A. 전술 보드", "밝은 피치·11명 직접 배치", ROOT / "app" / "audit" / "v5-after" / "05-mobile-board.png"),
        ("B. 전술 지문", "포메이션·강도·교체 확인", ROOT / "app" / "audit" / "v5-after" / "06-mobile-ready.png"),
        ("C. 라이브 장면", "22명·공 경로·선택 원인", ROOT / "app" / "audit" / "v5-after" / "08-mobile-live.png"),
        ("D. 감독 리포트", "결과·실제 경기·코치 비교", ROOT / "app" / "audit" / "v5-after" / "07-mobile-report.png"),
    ]
    for idx, (title, body, path) in enumerate(screens):
        x = 44 + idx * 226
        box(c, x, 100, 206, 305, SURFACE, LINE)
        label(c, f"SCREEN 0{idx + 1}", x + 12, 383, RED if idx in (0, 3) else MINT, 6)
        para(c, title, x + 12, 366, 182, "h2")
        para(c, body, x + 12, 342, 182, "small")
        image_fit(c, path, x + 12, 116, 182, 205, mode="cover", darken=0.95, border=False)
    c.showPage()

    # 8. Functional specification
    page_base(c, 8, "FUNCTIONS")
    slide_title(c, "07 / 핵심 인터랙션 기능 명세", "보이는 기능은 모두 실제 상태와 결과를 바꾸며, 오류는 UI와 상태 계층에서 이중 차단한다")
    rows = [
        ["ID", "기능", "사용자 행동", "시스템 반응", "완료 조건"],
        ["F01", "경기 선택", "4개 결정 순간 선택", "경기별 기준 상태 로드", "10초 내 첫 행동"],
        ["F02", "선수 배치", "드래그·클릭·방향키", "좌표·4개 지표 갱신", "피치 밖 이동 불가"],
        ["F03", "포메이션", "4개 포메이션 선택", "11개 기준 좌표 재배치", "선택 상태 명시"],
        ["F04", "선수 교체", "필드 선택 후 벤치 클릭", "라인업·벤치·체력 보너스 갱신", "GK 규칙·3장 한도"],
        ["F05", "전술 지시", "4개 슬라이더/스테퍼", "득점·통제·안정·모멘텀 재계산", "1-10 범위"],
        ["F06", "코치 플랜", "원클릭 적용", "4-3-3·강도·교체 일괄 적용", "재수정 가능"],
        ["F07", "운명 설명", "전술 변경", "기준선 차이와 상위 원인 노출", "확률 아님 명시"],
        ["F08", "복구·저장", "실행 취소/재접속", "20단계 복구·로컬 자동 저장", "버전 검증"],
        ["F09", "현장 지시", "유지·과부하·안전핀 선택", "xG·위험·선수 위치 변경", "효과와 대가 명시"],
        ["F10", "라이브 리플레이", "재생·되감기·결과 보기", "22명·공 경로·6개 장면·리포트", "동일 입력 재현"],
    ]
    table_grid(c, 36, 410, [42, 98, 165, 300, 265], rows, [28] + [32] * 10)
    c.showPage()

    # 9. Explainable model
    page_base(c, 9, "MODEL")
    slide_title(c, "08 / 설명 가능한 시뮬레이션", "예측 확률이 아니라 선택의 구조를 일관되게 비교하는 결정론적 전술 모델")
    box(c, 46, 112, 270, 278, SURFACE, LINE)
    label(c, "Inputs", 66, 362, CYAN)
    inputs = ["포메이션과 직접 좌표", "공격 폭과 측면 주자", "중앙 안전핀 수", "풀백 전진", "교체 선수 속도·체력", "템포·압박·위험 감수", "유지·과부하·안전핀 지시"]
    top = 336
    for item in inputs:
        top = bullet(c, item, 66, top, 220, CYAN, "body") - 8
    box(c, 345, 112, 270, 278, SURFACE, colors.HexColor("#386156"))
    label(c, "Scoring engine", 365, 362, MINT)
    para(c, "감독 점수", 365, 334, 220, "h2")
    para(c, "추격: 득점·모멘텀 가중<br/>수성: 통제·후방 안정 가중<br/>+ 선수·좌표·상대 상성<br/>+ 경기별 미션 보너스<br/>- 전술 모순 페널티", 365, 309, 215, "body-white")
    line(c, 365, 202, 592, 202, LINE, 0.8)
    para(c, "운명 변화 = 감독 점수 - 경기별 실제 기준선<br/><font color='#718187'>범위: -30 ~ +30</font>", 365, 184, 215, "body")
    box(c, 644, 112, 270, 278, SURFACE, colors.HexColor("#63583A"))
    label(c, "Explainable output", 664, 362, AMBER)
    para(c, "+21", 664, 335, 210, "number")
    para(c, "실제 결정 시점 기준선 대비 전술 완성도", 664, 296, 215, "small")
    line(c, 664, 270, 890, 270, LINE, 0.8)
    label(c, "왜 바뀌었나요?", 664, 246, MINT, 6.3)
    bullet(c, "폭을 넓혀 낮은 블록 바깥을 흔들었다.", 664, 226, 215, MINT, "small")
    bullet(c, "빠른 교체가 지친 수비 뒤를 공격한다.", 664, 198, 215, MINT, "small")
    box(c, 46, 66, 868, 31, colors.HexColor("#151C1E"), colors.HexColor("#5A4B2C"), radius=4)
    para(c, "신뢰 원칙: 실제 승리 확률로 표현하지 않으며, 동일 입력은 동일 결과를 내고 모든 가점·경고는 사용자에게 설명한다.", 60, 87, 840, "small")
    c.showPage()

    # 10. Data and information policy
    page_base(c, 10, "DATA")
    slide_title(c, "09 / 데이터 활용과 신뢰 설계", "공식 사실, 서비스 해석, 시뮬레이션 결과를 화면에서 명확히 분리한다")
    layers = [
        ("01", "공식 경기 사실", "점수·득점·교체·최종 결과", "FIFA 공식 경기 리포트", RED),
        ("02", "큐레이션 JSON", "선수·포지션·시나리오·좌표", "저장소에 정적 포함", CYAN),
        ("03", "서비스 분석", "결정 시점 스냅샷·상대 약점", "분석 모델임을 명시", AMBER),
        ("04", "규칙 엔진", "지표·이벤트·감독 유형", "API 없는 로컬 실행", MINT),
    ]
    for idx, (num, title, data, source, tone) in enumerate(layers):
        x = 48 + idx * 218
        box(c, x, 236, 198, 156, SURFACE, LINE)
        c.setFillColor(tone)
        c.setFont("Malgun-Bold", 16)
        c.drawString(x + 16, 360, num)
        para(c, title, x + 16, 338, 166, "h2")
        para(c, data, x + 16, 302, 166, "small")
        line(c, x + 16, 266, x + 182, 266, LINE, 0.7)
        para(c, source, x + 16, 254, 166, "tiny")
    box(c, 48, 92, 410, 112, colors.HexColor("#0D171A"), colors.HexColor("#504536"))
    label(c, "Information firewall", 68, 178, AMBER)
    para(c, "결정 화면: 선택한 시점까지의 사실만 공개", 68, 159, 360, "body-white")
    para(c, "결과 화면: 이후 실제 사건과 내 결과 비교", 68, 137, 360, "body-white")
    para(c, "사용자의 선택이 먼저, 실제 정답은 나중에 보이도록 스포일러를 차단한다.", 68, 112, 360, "small")
    box(c, 490, 92, 424, 112, colors.HexColor("#0D171A"), colors.HexColor("#31525B"))
    label(c, "License & stability", 510, 178, CYAN)
    bullet(c, "선수 사진·팀 로고 없이 이름·포지션·국가만 사용", 510, 158, 372, CYAN, "small")
    bullet(c, "경기장 이미지·관중음은 프로젝트 전용 생성 자산", 510, 135, 372, CYAN, "small")
    bullet(c, "외부 API 키 없이 심사 가능·출처/모델 고지 유지", 510, 112, 372, CYAN, "small")
    c.showPage()

    # 11. Audit evidence
    page_base(c, 11, "AUDIT")
    slide_title(c, "10 / 사용자 편의와 문제 해결", "실제 브라우저 감사에서 발견한 신뢰 붕괴 지점을 코드와 화면에서 함께 해결했다")
    before = ROOT / "app" / "audit" / "v5-before" / "03-detached-simulation.png"
    after = ROOT / "app" / "audit" / "v5-after" / "03-live-tactical-scene-v2.png"
    label(c, "BEFORE / P1", 46, 389, RED)
    image_fit(c, before, 46, 152, 418, 225, mode="cover", darken=0.92)
    para(c, "정적인 점 3개와 텍스트 피드가 사용자의 전술과 경기 장면을 분리했다.", 46, 139, 418, "small")
    label(c, "AFTER / VERIFIED", 500, 389, MINT)
    image_fit(c, after, 500, 152, 392, 225, mode="cover", darken=1.0)
    para(c, "22명·공 경로·장면 원인·현장 지시·타임라인을 하나의 경기 화면으로 연결했다.", 500, 139, 392, "small")
    fixes = [
        "밝은 피치 중심 작업공간으로 분석 대시보드 인상을 제거",
        "포메이션·강도·교체·직접 좌표를 전술 지문으로 확인",
        "세 가지 현장 지시가 xG·위험·22명 위치를 실제 변경",
        "장면 타임라인과 원인 칩으로 선택의 결과를 되감아 학습",
        "13개 테스트·390 x 844·가로 오버플로 0px 검증",
    ]
    top = 106
    for idx, item in enumerate(fixes):
        x = 46 + (idx % 3) * 290
        y = top - (idx // 3) * 36
        c.setFillColor(MINT if idx != 1 else RED)
        c.circle(x + 4, y - 4, 3, fill=1, stroke=0)
        para(c, item, x + 14, y + 3, 260, "tiny")
    c.showPage()

    # 12. PRD scope and acceptance
    page_base(c, 12, "PRD")
    slide_title(c, "11 / PRD 핵심 범위", "서로 다른 네 경기의 완주성과 시뮬레이션 일관성을 같은 스키마로 잠갔다")
    box(c, 46, 242, 270, 164, SURFACE, LINE)
    label(c, "Product goal", 66, 378, MINT)
    para(c, "누구나 실제 월드컵의 결정적 순간에 들어가 유효한 전술을 만들고, 그 결과와 이유를 90초 안에 이해한다.", 66, 357, 230, "body-white")
    label(c, "North star", 66, 298, DIM, 6.2)
    para(c, "도움 없이 감독 리포트까지 완주한 사용자 비율", 66, 282, 230, "small")
    box(c, 345, 242, 270, 164, SURFACE, LINE)
    label(c, "P0 / 구현 완료", 365, 378, CYAN)
    p0 = ["4개 결정 시나리오", "드래그·클릭·키보드 배치", "교체·포메이션·전술 지시", "결정론적 엔진·비교 리포트", "매치데이 UI·관중음·모바일"]
    top = 354
    for item in p0:
        top = bullet(c, item, 365, top, 225, CYAN, "small") - 5
    box(c, 644, 242, 270, 164, SURFACE, LINE)
    label(c, "P1 / 최종 제출 전", 664, 378, AMBER)
    p1 = ["배포 URL E2E", "Chrome·Edge·Safari 음향", "공유 카드·시연 영상", "5명 사용자 테스트", "README·저장소 동결"]
    top = 354
    for item in p1:
        top = bullet(c, item, 664, top, 225, AMBER, "small") - 5
    rows = [
        ["Acceptance criteria", "통과 기준"],
        ["초보자 진입", "프리셋/코치 플랜으로 10초 안에 편집 시작"],
        ["동적 기능", "모든 조작이 지표·xG·이벤트·리포트 중 하나 이상 변경"],
        ["오류 방지", "GK 규칙·교체 3장·피치 경계·저장 버전 검증"],
        ["접근성", "키보드 이동·명시적 이름·상태 안내·모바일 대체 흐름"],
        ["심사 안정성", "로그인·결제·API 키 없이 주요 브라우저에서 작동"],
    ]
    table_grid(c, 46, 210, [210, 658], rows, [26] + [24] * 5)
    c.showPage()

    # 13. Roadmap and QA
    page_base(c, 13, "ROADMAP")
    slide_title(c, "12 / 우승까지 실행 계획", "기획서 조기 제출, 기능 동결, 시연 영상 리허설을 별도 마일스톤으로 관리한다")
    roadmap = [
        ("7/10-12", "MVP v5 잠금", "22명 리플레이·현장 지시·기획서", MINT),
        ("7/13-17", "현실성 튜닝", "5명 사용자 테스트·밸런스 조정", CYAN),
        ("7/18-21", "몰입 강화", "모션·사운드·사용자 테스트", AMBER),
        ("7/22-26", "기획서 제출", "배포 후보·법적 고지·7/26 제출", RED),
        ("7/27-30", "최종 완성", "크로스 브라우저·README·공유", CYAN),
        ("7/31-8/2", "제출 동결", "영상·링크·저장소 최종 검증", MINT),
    ]
    top = 390
    for idx, (date, title, body, tone) in enumerate(roadmap):
        x = 48 + (idx % 3) * 292
        y = top - (idx // 3) * 116
        box(c, x, y - 78, 268, 92, SURFACE, LINE)
        c.setFillColor(tone)
        c.setFont("Malgun-Bold", 8)
        c.drawString(x + 16, y - 2, date)
        para(c, title, x + 16, y - 17, 220, "h2")
        para(c, body, x + 16, y - 47, 225, "small")
    box(c, 48, 78, 852, 80, colors.HexColor("#181415"), colors.HexColor("#6A3333"))
    label(c, "Hard freeze", 68, 132, RED)
    para(c, "2026.08.03 09:00 링크·영상·GitHub 최종 점검 -> 09:30 저장소 동결 -> 10:00 이후 커밋 금지", 68, 116, 800, "h2")
    para(c, "대회 규정상 최종 마감 이후 커밋 이력이 확인되면 실격될 수 있으므로 배포와 저장소를 전날 확정한다.", 68, 91, 800, "small")
    c.showPage()

    # 14. Demo and public vote
    page_base(c, 14, "DEMO")
    slide_title(c, "13 / 대중 투표와 시연 영상", "첫 5초에 갈등을 보여주고, 80초 안에 조작·결과·차별점을 모두 증명한다")
    report = ROOT / "app" / "audit" / "v5-after" / "03-live-tactical-scene-v2.png"
    image_fit(c, report, 48, 114, 420, 276, mode="cover", darken=0.92)
    c.setFillColor(colors.Color(0.02, 0.04, 0.05, alpha=0.7))
    c.rect(48, 114, 420, 65, fill=1, stroke=0)
    para(c, "52' · 0:2<br/><b>당신이라면 이 경기를 어떻게 뒤집겠습니까?</b>", 66, 164, 380, "h2")
    steps = [
        ("0-05초", "갈등", "네 경기 중 52분 0:2 대역전 선택"),
        ("05-15초", "초보 진입", "코치 플랜 한 번으로 유효한 전술"),
        ("15-35초", "직접 조작", "선수 이동·교체·슬라이더·원인 변화"),
        ("35-52초", "라이브 리플레이", "22명·공 경로·56·62·77·95분 장면"),
        ("52-68초", "차별점", "현장 지시 대가·실제 경기 vs 내 선택"),
        ("68-80초", "콜 투 액션", "감독 유형 공유·모바일·재도전"),
    ]
    top = 390
    for idx, (time, title, body) in enumerate(steps):
        y = top - idx * 48
        c.setFillColor(RED if idx in (0, 4) else MINT)
        c.setFont("Malgun-Bold", 7)
        c.drawString(510, y, time)
        para(c, f"<b>{title}</b>  <font color='#A7B4B6'>{body}</font>", 568, y + 4, 330, "small")
        if idx < len(steps) - 1:
            line(c, 514, y - 15, 514, y - 36, LINE, 1)
    box(c, 510, 82, 390, 62, SURFACE, colors.HexColor("#3A555F"))
    label(c, "Vote conversion", 528, 122, CYAN, 6.2)
    para(c, "로그인 없음 · 설치 없음 · 첫 화면에서 즉시 플레이 · 결과 카드 한 장으로 공유", 528, 106, 350, "small")
    c.showPage()

    # 15. Score mapping and checklist
    page_base(c, 15, "SUBMISSION")
    slide_title(c, "14 / 심사 대응과 제출 체크리스트", "각 평가 항목의 주장을 실제 화면, 코드, 테스트 증거와 1:1로 연결한다")
    rows = [
        ["평가 항목", "주장", "구현 증거", "목표"],
        ["참신성 30", "설명 가능한 결정 리플레이", "4경기·원인 추적·3자 비교", "28+"],
        ["감독 경험 25", "터치라인 압박·통제·피드백", "직접 조작·경기장·관중음·라이브 이벤트", "23+"],
        ["완성도 25", "심사자가 끝까지 직접 플레이", "11개 테스트·저장·모바일", "23+"],
        ["기획/구현 20", "한 문장 가치와 UI가 일치", "PRD·기능 명세·감사·README", "19+"],
    ]
    table_grid(c, 48, 405, [130, 240, 370, 90], rows, [30] + [38] * 4)
    box(c, 48, 90, 410, 130, SURFACE, LINE)
    label(c, "필수 제출물", 68, 194, MINT)
    checklist = ["기획서 PDF - 7/27 10:00 전", "배포 URL - 로그인·결제·키 없음", "GitHub - 실행법·기술·데이터·라이선스", "YouTube 시연 영상 - 전체 흐름", "8/3 10:00 이후 저장소 커밋 없음"]
    top = 174
    for item in checklist:
        top = bullet(c, item, 68, top, 360, MINT, "small") - 4
    box(c, 490, 90, 424, 130, SURFACE, LINE)
    label(c, "최종 위험 통제", 510, 194, AMBER)
    risks = ["공식 사실과 서비스 해석 레이블 분리", "추가 기능보다 4경기 핵심 흐름 안정성 우선", "Chrome·Edge·Safari·모바일 스모크 테스트", "배포 URL과 저장소를 전날 동결"]
    top = 174
    for item in risks:
        top = bullet(c, item, 510, top, 372, AMBER, "small") - 6
    para(c, "우승을 보장할 수는 없지만, 이 구조는 평가표의 모든 문장을 실제로 눌러 확인할 수 있는 증거로 바꾼다.", 48, 64, 860, "body-white")
    c.showPage()

    c.save()
    return OUT


if __name__ == "__main__":
    register_fonts()
    ST.update(styles())
    print(make_pdf())
