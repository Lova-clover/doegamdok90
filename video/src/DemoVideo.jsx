import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";

const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"};
const durationInFrames = 2150;

const narrationTracks = [
  {from: 30, duration: 140, src: "audio/tts/02-archive.mp3", caption: "결정적 순간을 골라, 같은 시점에서 다시 시작합니다."},
  {from: 190, duration: 165, src: "audio/tts/03-tactics.mp3", caption: "선수와 포메이션, 위치와 전술 강도를 직접 바꿉니다."},
  {from: 370, duration: 157, src: "audio/tts/04-cause.mp3", caption: "내 선택이 만든 공간과 기대 득점의 변화를 즉시 확인합니다."},
  {from: 540, duration: 181, src: "audio/tts/05-replay.mp3", caption: "바뀐 전술은 실제 경기 흐름으로 이어지고, 득점은 골라인 통과로 판정됩니다."},
  {from: 1955, duration: 184, src: "audio/tts/06-report.mp3", caption: "마지막에는 실제 경기와 기존 전술, 내 선택을 같은 조건에서 비교합니다."},
];

const NarrationAudio = () => (
  <>
    {narrationTracks.map((track) => (
      <Sequence key={track.src} from={track.from} durationInFrames={track.duration}>
        <Audio src={staticFile(track.src)} volume={1} />
      </Sequence>
    ))}
  </>
);

const Captions = () => {
  const frame = useCurrentFrame();
  const track = narrationTracks.find(
    ({from, duration}) => frame >= from && frame < from + duration,
  );
  if (!track) return null;

  const localFrame = frame - track.from;
  const opacity = interpolate(
    localFrame,
    [0, 6, track.duration - 6, track.duration],
    [0, 1, 1, 0],
    clamp,
  );

  return (
    <div className="caption" style={{opacity}}>
      {track.caption}
    </div>
  );
};

const ActualPlay = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [0, 8, durationInFrames - 10, durationInFrames - 1],
    [0, 1, 1, 0],
    clamp,
  );

  return (
    <AbsoluteFill style={{opacity}}>
      <OffthreadVideo
        className="actual-capture"
        src={staticFile("captures/actual-flow.webm")}
        playbackRate={1.25}
        muted
      />
    </AbsoluteFill>
  );
};

export const DemoVideo = () => (
  <AbsoluteFill className="video-root">
    <ActualPlay />
    <NarrationAudio />
    <Captions />
  </AbsoluteFill>
);

export const Thumbnail = () => (
  <AbsoluteFill className="thumbnail">
    <Img src={staticFile("screens/live.png")} className="thumbnail-image" />
    <AbsoluteFill className="thumbnail-shade" />
    <div className="thumbnail-copy">
      <span>월드컵 결정적 순간을 다시 지휘하다</span>
      <h1>되감독 <strong>90</strong></h1>
      <p>그 경기를 되감고, 내가 감독이 된다.</p>
    </div>
  </AbsoluteFill>
);
