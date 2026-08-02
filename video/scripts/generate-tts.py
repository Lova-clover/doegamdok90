import asyncio
from pathlib import Path

import edge_tts


VOICE = "ko-KR-InJoonNeural"
RATE = "+24%"
PITCH = "+0Hz"
VOLUME = "+2%"

LINES = (
    ("01-intro.mp3", "아쉬웠던 그 경기. 이번엔 당신이 감독입니다."),
    ("02-archive.mp3", "결정적 순간을 고르고, 같은 시점에서 다시 시작합니다."),
    ("03-tactics.mp3", "선수를 옮기고, 포메이션과 교체, 압박과 폭을 바꿉니다."),
    ("04-cause.mp3", "선택 즉시 공간과 엑스지, 위험도와 예상 스코어가 달라집니다."),
    ("05-replay.mp3", "바뀐 전술을 연속 장면으로 봅니다. 골라인을 통과하면, 골."),
    ("06-report.mp3", "실제 경기, 기존 전술, 내 선택을 비교해 판단의 대가까지 확인합니다."),
    ("07-outro.mp3", "그 경기를 되감고, 내가 감독이 된다. 되감독 구십."),
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
