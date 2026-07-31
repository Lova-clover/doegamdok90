from pathlib import Path

from pypdf import PdfReader
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
SLIDES_DIR = ROOT / "doegamdok90-final-review"
OUTPUT = ROOT / "output" / "pdf" / "doegamdok90-planning-final.pdf"

PAGE_WIDTH = 13.333333 * 72
PAGE_HEIGHT = 7.5 * 72


def slide_number(path: Path) -> int:
    return int(path.stem.split("-")[-1])


def main() -> None:
    slides = sorted(SLIDES_DIR.glob("slide-*.png"), key=slide_number)
    if len(slides) != 13:
        raise RuntimeError(f"Expected 13 rendered slides, found {len(slides)}")

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    pdf = canvas.Canvas(str(OUTPUT), pagesize=(PAGE_WIDTH, PAGE_HEIGHT), pageCompression=1)
    pdf.setTitle("되감독 90 기획서")
    pdf.setAuthor("되감독 90")
    pdf.setSubject("월드컵 결정적 순간을 다시 지휘하는 인과형 전술 시뮬레이터")

    for slide in slides:
        pdf.drawImage(
            ImageReader(str(slide)),
            0,
            0,
            width=PAGE_WIDTH,
            height=PAGE_HEIGHT,
            preserveAspectRatio=False,
            mask="auto",
        )
        pdf.showPage()

    pdf.save()

    reader = PdfReader(str(OUTPUT))
    if len(reader.pages) != 13:
        raise RuntimeError(f"Expected 13 PDF pages, found {len(reader.pages)}")

    print(OUTPUT)


if __name__ == "__main__":
    main()
