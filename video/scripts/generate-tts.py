import asyncio
from pathlib import Path

import edge_tts


VOICE = "ko-KR-HyunsuMultilingualNeural"
RATE = "+6%"
PITCH = "-1Hz"
VOLUME = "+0%"

LINES = (
    ("01-intro.mp3", "그 경기를 되감고, 내가 감독이 됩니다. 되감독 구십."),
    ("02-archive.mp3", "아쉬움이 남았던 월드컵의 결정적 순간. 그때로 돌아가, 다시 지휘합니다."),
    ("03-tactics.mp3", "선수 위치와 포메이션, 교체 타이밍, 전술 강도까지 직접 바꿉니다."),
    ("04-cause.mp3", "내 판단이 어떤 공간을 만들고, 어떤 위험을 키웠는지. 즉시 확인합니다."),
    ("05-replay.mp3", "바뀐 전술로 경기를 다시 봅니다. 공이 골라인을 통과한 순간에만, 골이 선언됩니다."),
    ("06-report.mp3", "실제 경기와 기존 전술, 내 선택, 코치 제안을 한 화면에서 비교합니다."),
    ("07-outro.mp3", "결과를 바꾸는 건 클릭이 아닙니다. 감독의 판단입니다. 지금, 감독석에 앉으세요."),
)


async def generate() -> None:
    output = Path(__file__).resolve().parent.parent / "public" / "audio" / "tts"
    output.mkdir(parents=True, exist_ok=True)

    for existing in output.iterdir():
        if existing.is_file():
            existing.unlink()

    for filename, text in LINES:
        speech = edge_tts.Communicate(
            text,
            VOICE,
            rate=RATE,
            pitch=PITCH,
            volume=VOLUME,
        )
        await speech.save(output / filename)
        print(f"generated {filename}: {text}")


if __name__ == "__main__":
    asyncio.run(generate())
