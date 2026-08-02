import React from "react";
import {CursorIcon} from "@phosphor-icons/react/dist/icons/Cursor";
import {TransitionSeries, linearTiming} from "@remotion/transitions";
import {fade} from "@remotion/transitions/fade";
import {
  AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, spring,
  staticFile, useCurrentFrame, useVideoConfig,
} from "remotion";

const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"};
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const narrationTracks = [
  {from: 8, duration: 155, src: "audio/tts/01-intro.mp3", caption: "아쉬웠던 그 경기, 이번엔 당신이 감독입니다."},
  {from: 150, duration: 140, src: "audio/tts/02-archive.mp3", caption: "결정적 순간을 골라 같은 시점에서 다시 시작합니다."},
  {from: 410, duration: 165, src: "audio/tts/03-tactics.mp3", caption: "선수·포메이션·교체·압박을 직접 바꿉니다."},
  {from: 908, duration: 157, src: "audio/tts/04-cause.mp3", caption: "선택 즉시 공간·xG·위험도·예상 스코어가 달라집니다."},
  {from: 1228, duration: 181, src: "audio/tts/05-replay.mp3", caption: "바뀐 전술은 장면으로 이어지고, 골라인 통과 뒤에만 득점이 완성됩니다."},
  {from: 1636, duration: 184, src: "audio/tts/06-report.mp3", caption: "실제 경기·기존 전술·내 선택을 같은 조건에서 비교합니다."},
  {from: 1926, duration: 169, src: "audio/tts/07-outro.mp3", caption: "그 경기를 되감고, 내가 감독이 된다. 되감독90."},
];
const clickFrames = [370, 486, 570, 650, 740, 1013];
const transitionFrames = [140, 400, 898, 1218, 1626, 1916];

const Brand = ({compact = false}) => (
  <div className={"brand" + (compact ? " brand-compact" : "")}>
    <span>되감독</span><strong>90</strong>
  </div>
);

const Screen = ({src, openingShade = 0.16, clearAt = 58, position = "center"}) => {
  const frame = useCurrentFrame();
  const shade = interpolate(frame, [0, clearAt], [openingShade, 0], clamp);
  return (
    <AbsoluteFill className="screen-shell">
      <Img src={staticFile(src)} className="screen-image" style={{objectPosition: position}} />
      <AbsoluteFill style={{background: "rgba(3,7,6," + shade + ")"}} />
    </AbsoluteFill>
  );
};

const SceneHeader = ({step, title, hold = 48}) => {
  const frame = useCurrentFrame();
  const y = interpolate(frame, [0, 10], [14, 0], {...clamp, easing: easeOut});
  const opacity = interpolate(frame, [0, 8, hold, hold + 14], [0, 1, 1, 0], clamp);
  return (
    <div className="scene-header" style={{opacity, transform: "translateY(" + y + "px)"}}>
      <span>{step}</span>
      <h2>{title}</h2>
    </div>
  );
};

const ProductCursor = ({points, clicks = [], visible = [0, 999]}) => {
  const frame = useCurrentFrame();
  const frames = points.map((point) => point.frame);
  const x = interpolate(frame, frames, points.map((point) => point.x), {...clamp, easing: Easing.inOut(Easing.cubic)});
  const y = interpolate(frame, frames, points.map((point) => point.y), {...clamp, easing: Easing.inOut(Easing.cubic)});
  const opacity = interpolate(frame, [visible[0], visible[0] + 8, visible[1] - 8, visible[1]], [0, 1, 1, 0], clamp);
  const click = clicks.reduce((peak, point) => Math.max(peak, interpolate(frame, [point - 2, point, point + 9], [0, 1, 0], clamp)), 0);
  return (
    <div className="product-cursor"
      style={{left: x, top: y, opacity, transform: "scale(" + (1 - click * 0.12) + ")"}}>
      <div className="pointer-ripple" style={{opacity: click, transform: "scale(" + (0.55 + click * 0.75) + ")"}} />
      <CursorIcon size={42} weight="fill" color="#fff" />
    </div>
  );
};

const Captions = () => {
  const frame = useCurrentFrame();
  const track = narrationTracks.find(({from, duration}) => frame >= from && frame < from + duration);
  if (!track) return null;
  const local = frame - track.from;
  const opacity = interpolate(local, [0, 7, track.duration - 8, track.duration], [0, 1, 1, 0], clamp);
  const y = interpolate(local, [0, 9], [10, 0], {...clamp, easing: easeOut});
  return <div className="caption" style={{opacity, transform: `translate(-50%, ${y}px)`}}>{track.caption}</div>;
};

const Intro = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 18, stiffness: 105}});
  const line = interpolate(frame, [25, 80], [0, 1], {...clamp, easing: easeOut});
  return (
    <AbsoluteFill className="intro">
      <Screen src="screens/archive.png" openingShade={0.76} clearAt={150} />
      <div className="intro-wash" />
      <div className="intro-content" style={{opacity: enter, transform: "translateY(" + ((1 - enter) * 30) + "px)"}}>
        <span className="eyebrow">WORLD CUP DECISION REPLAY</span>
        <Brand />
        <div className="intro-rule" style={{transform: "scaleX(" + line + ")"}} />
        <h1>아쉬웠던 그 경기.<br /><em>이번에는 당신이 감독입니다.</em></h1>
      </div>
    </AbsoluteFill>
  );
};

const Archive = () => (
  <AbsoluteFill>
    <Screen src="screens/archive.png" openingShade={0.18} clearAt={52} />
    <SceneHeader step="01 · 경기 선택" title="결정적 순간을 고릅니다" />
    <ProductCursor
      points={[{frame: 150, x: 760, y: 470}, {frame: 205, x: 650, y: 430}, {frame: 240, x: 650, y: 430}]}
      clicks={[230]} visible={[145, 252]} />
  </AbsoluteFill>
);

const Tactics = () => (
  <AbsoluteFill>
    <Screen src="screens/board.png" openingShade={0.16} clearAt={50} />
    <SceneHeader step="02 · 전술 조정" title="직접 눌러 전술을 바꿉니다" />
    <ProductCursor
      points={[
        {frame: 55, x: 520, y: 360}, {frame: 78, x: 430, y: 315}, {frame: 100, x: 430, y: 315},
        {frame: 145, x: 1180, y: 570}, {frame: 170, x: 1180, y: 570}, {frame: 188, x: 1180, y: 570},
        {frame: 225, x: 1515, y: 555}, {frame: 250, x: 1515, y: 555}, {frame: 275, x: 1515, y: 555},
        {frame: 315, x: 1515, y: 720}, {frame: 340, x: 1515, y: 720}, {frame: 382, x: 1515, y: 720},
      ]}
      clicks={[86, 170, 250, 340]} visible={[50, 395]} />
  </AbsoluteFill>
);

const Cause = () => (
  <AbsoluteFill>
    <Screen src="screens/ready.png" openingShade={0.16} clearAt={50} />
    <SceneHeader step="03 · 변화 확인" title="선택의 결과가 즉시 반영됩니다" />
    <ProductCursor points={[{frame: 58, x: 1080, y: 760}, {frame: 100, x: 960, y: 790}, {frame: 145, x: 960, y: 790}]}
      clicks={[115]} visible={[52, 160]} />
  </AbsoluteFill>
);

const Replay = () => {
  const frame = useCurrentFrame();
  const ballX = interpolate(frame, [145, 285], [1035, 1530], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const ballY = interpolate(frame, [145, 215, 285], [690, 472, 384], clamp);
  const goal = interpolate(frame, [282, 296, 348], [0, 1, 0], clamp);
  return (
    <AbsoluteFill>
      <Screen src="screens/live.png" openingShade={0.14} clearAt={48} />
      <SceneHeader step="04 · 라이브 리플레이" title="바뀐 전술을 장면으로 확인합니다" />
      {frame >= 138 ? <div className="ball-tracer" style={{left: ballX, top: ballY}} /> : null}
      <div className="goal-flash" style={{opacity: goal, transform: "scale(" + (0.82 + goal * 0.18) + ")"}}>
        GOAL<small>골라인 판정 완료 · 3:2</small>
      </div>
    </AbsoluteFill>
  );
};

const Report = () => (
  <AbsoluteFill>
    <Screen src="screens/report.png" openingShade={0.14} clearAt={48} />
    <SceneHeader step="05 · 감독 리포트" title="판단의 차이를 한 화면에서 비교합니다" />
  </AbsoluteFill>
);

const Outro = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 19, stiffness: 95}});
  return (
    <AbsoluteFill className="outro">
      <Screen src="screens/archive.png" openingShade={0.76} clearAt={180} />
      <div className="outro-wash" />
      <div className="outro-content" style={{opacity: enter, transform: "translateY(" + ((1 - enter) * 28) + "px)"}}>
        <Brand />
        <h2>그 경기를 되감고,<br /><em>내가 감독이 된다.</em></h2>
        <div className="cta">지금 감독석에 앉으세요 <span>doegamdok90.vercel.app</span></div>
        <small>비공식 팬 시뮬레이션 · 자체 모델 수치는 공식 예측이 아닙니다.</small>
      </div>
    </AbsoluteFill>
  );
};

const NarrationAudio = () => (
  <>{narrationTracks.map((track) => (
    <Sequence key={track.src} from={track.from} durationInFrames={track.duration}>
      <Audio src={staticFile(track.src)} volume={1.08} />
    </Sequence>
  ))}</>
);

const SoundDesign = () => {
  const isNarrating = (frame) => narrationTracks.some(({from, duration}) => frame >= from - 5 && frame <= from + duration + 5);
  return (
    <>
      <Audio src={staticFile("audio/stadium-crowd.wav")} loop volume={(frame) => {
        const fadeIn = interpolate(frame, [0, 40], [0, 1], clamp);
        const fadeOut = interpolate(frame, [2030, 2095], [1, 0], clamp);
        return 0.105 * fadeIn * fadeOut * (isNarrating(frame) ? 0.42 : 1);
      }} />
      <Audio src={staticFile("audio/stadium-rhythm.wav")} loop volume={(frame) => 0.13 * (isNarrating(frame) ? 0.3 : 1)} />
      {clickFrames.map((frame) => (
        <Sequence key={"click-" + frame} from={frame} durationInFrames={6}>
          <Audio src={staticFile("audio/ui-click.wav")} volume={0.28} />
        </Sequence>
      ))}
      {transitionFrames.map((frame) => (
        <Sequence key={"hit-" + frame} from={frame - 4} durationInFrames={18}>
          <Audio src={staticFile("audio/transition-hit.wav")} volume={0.13} />
        </Sequence>
      ))}
      <Sequence from={140} durationInFrames={28}><Audio src={staticFile("audio/referee-whistle.wav")} volume={0.11} /></Sequence>
      <Sequence from={1494} durationInFrames={100}><Audio src={staticFile("audio/goal-roar.wav")} volume={0.34} /></Sequence>
    </>
  );
};

const transition = linearTiming({durationInFrames: 10});
const longerTransition = linearTiming({durationInFrames: 12});

export const DemoVideo = () => (
  <AbsoluteFill className="video-root">
    <SoundDesign />
    <NarrationAudio />
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={150} premountFor={30}><Intro /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={transition} />
      <TransitionSeries.Sequence durationInFrames={270} premountFor={30}><Archive /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={transition} />
      <TransitionSeries.Sequence durationInFrames={510} premountFor={30}><Tactics /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={longerTransition} />
      <TransitionSeries.Sequence durationInFrames={330} premountFor={30}><Cause /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={transition} />
      <TransitionSeries.Sequence durationInFrames={420} premountFor={30}><Replay /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={longerTransition} />
      <TransitionSeries.Sequence durationInFrames={300} premountFor={30}><Report /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={transition} />
      <TransitionSeries.Sequence durationInFrames={180} premountFor={30}><Outro /></TransitionSeries.Sequence>
    </TransitionSeries>
    <Captions />
  </AbsoluteFill>
);

export const Thumbnail = () => (
  <AbsoluteFill className="thumbnail">
    <Screen src="screens/live.png" openingShade={0.64} clearAt={120} />
    <div className="thumbnail-content">
      <span className="eyebrow">월드컵 결정의 시간을 다시 지휘하다</span>
      <Brand />
      <h2>내 전술로<br /><em>결과가 바뀐다</em></h2>
      <div className="thumbnail-score">65분 · 1:1 <i>→</i> <strong>3:2</strong></div>
    </div>
    <div className="thumbnail-badge">인과형 전술 시뮬레이터</div>
  </AbsoluteFill>
);