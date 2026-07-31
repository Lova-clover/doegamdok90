from pathlib import Path

from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
SLIDES = ROOT / "output" / "presentation" / "touchline-replay-90-presentation-v7"
OUTPUT = ROOT / "output" / "pdf" / "touchline-replay-90-winning-proposal-v7.pdf"
PAGE_SIZE = (960, 540)


def main() -> None:
    slide_paths = sorted(SLIDES.glob("slide-[1-9].png"), key=lambda path: int(path.stem.split("-")[1]))
    if len(slide_paths) != 9:
        raise RuntimeError(f"Expected 9 rendered slides, found {len(slide_paths)}")

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    document = canvas.Canvas(str(OUTPUT), pagesize=PAGE_SIZE)
    document.setTitle("Touchline Replay 90 - Winning Proposal V7")
    document.setAuthor("Touchline Replay 90")
    for slide_path in slide_paths:
        document.drawImage(
            str(slide_path),
            0,
            0,
            width=PAGE_SIZE[0],
            height=PAGE_SIZE[1],
            preserveAspectRatio=True,
            mask="auto",
        )
        document.showPage()
    document.save()
    print(OUTPUT)


if __name__ == "__main__":
    main()
