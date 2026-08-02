import React from "react";
import {CursorIcon} from "@phosphor-icons/react/dist/icons/Cursor";
import {TransitionSeries, linearTiming} from "@remotion/transitions";
import {fade} from "@remotion/transitions/fade";
import {
  AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, spring,
  staticFile, useCurrentFrame, useVideoConfig,
} from "remotion";

const LIME = "#91e52f";
const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"};
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const sceneMeta = [
  {start: 0, end: 140, label: "되감기"},
  {start: 140, end: 400, label: "경기 선택"},
  {start: 400, end: 898, label: "전술 조작"},
  {start: 898, end: 1218, label: "인과 변화"},
  {start: 1218, end: 1626, label: "리플레이"},
  {start: 1626, end: 1916, label: "비교 리포트"},
  {start: 1916, end: 2096, label: "도전"},
];
const narrationTracks = [
  {from: 8, duration: 155, src: "audio/tts/01-intro.mp3"},
  {from: 150, duration: 140, src: "audio/tts/02-archive.mp3"},
  {from: 410, duration: 165, src: "audio/tts/03-tactics.mp3"},
  {from: 908, duration: 157, src: "audio/tts/04-cause.mp3"},
  {from: 1228, duration: 181, src: "audio/tts/05-replay.mp3"},
  {from: 1636, duration: 184, src: "audio/tts/06-report.mp3"},
  {from: 1926, duration: 169, src: "audio/tts/07-outro.mp3"},
];
const clickFrames = [255, 330, 500, 530, 630, 730, 820, 1013, 1288, 1841];
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

const SceneHeader = ({step, title, body, hold = 66}) => {
  const frame = useCurrentFrame();
  const y = interpolate(frame, [0, 10], [22, 0], {...clamp, easing: easeOut});
  const opacity = interpolate(frame, [0, 8, hold, hold + 14], [0, 1, 1, 0], clamp);
  return (
    <div className="scene-header" style={{opacity, transform: "translateY(" + y + "px)"}}>
      <span>{step}</span>
      <div><h2>{title}</h2><p>{body}</p></div>
    </div>
  );
};

const ProductCursor = ({points, clicks = [], dragRange, visible = [0, 999]}) => {
  const frame = useCurrentFrame();
  const frames = points.map((p) => p.frame);
  const x = interpolate(frame, frames, points.map((p) => p.x), {...clamp, easing: Easing.inOut(Easing.cubic)});
  const y = interpolate(frame, frames, points.map((p) => p.y), {...clamp, easing: Easing.inOut(Easing.cubic)});
  const opacity = interpolate(frame, [visible[0], visible[0] + 8, visible[1] - 8, visible[1]], [0, 1, 1, 0], clamp);
  const click = clicks.reduce((peak, point) => Math.max(peak, interpolate(frame, [point - 2, point, point + 9], [0, 1, 0], clamp)), 0);
  const dragging = dragRange && frame >= dragRange[0] && frame <= dragRange[1];
  return (
    <div className={"product-cursor" + (dragging ? " is-dragging" : "")}
      style={{left: x, top: y, opacity, transform: "scale(" + (1 - click * 0.13) + ")"}}>
      <div className="pointer-ripple" style={{opacity: click, transform: "scale(" + (0.5 + click * 0.8) + ")"}} />
      <CursorIcon size={50} weight="fill" color="#fff" />
      {dragging ? <span className="drag-badge">선수 이동 중</span> : null}
    </div>
  );
};

const Progress = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const active = sceneMeta.findIndex(({start, end}) => frame >= start && frame < end);
  const width = ((frame / (durationInFrames - 1)) * 100).toFixed(2) + "%";
  return (
    <>
      <div className="top-brand"><Brand compact /></div>
      <div className="progress-wrap">
        <span>{sceneMeta[Math.max(active, 0)].label}</span>
        <div className="progress-track"><div className="progress-fill" style={{width}} /></div>
      </div>
    </>
  );
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
    <Screen src="screens/archive.png" openingShade={0.22} clearAt={62} />
    <SceneHeader step="01 · 결정적 순간 선택" title="아쉬웠던 6경기에서 다시 시작"
      body="같은 시점, 다른 판단. 감독석을 고르면 경기가 되감깁니다." />
    <ProductCursor
      points={[{frame: 55, x: 1560, y: 805}, {frame: 115, x: 650, y: 430}, {frame: 190, x: 955, y: 790}, {frame: 245, x: 955, y: 790}]}
      clicks={[115, 190]} visible={[48, 252]} />
    <div className="broadcast-tag archive-tag">대한민국 vs 포르투갈 <b>65분 · 1:1</b></div>
  </AbsoluteFill>
);

const Tactics = () => {
  const frame = useCurrentFrame();
  const changed = interpolate(frame, [350, 372], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Screen src="screens/board.png" openingShade={0.18} clearAt={55} />
      <SceneHeader step="02 · 직접 전술 개입" title="말이 아니라, 실제 조작으로"
        body="포메이션, 선수 이동, 압박과 폭, 교체까지 한 화면에서 바꿉니다." />
      <ProductCursor
        points={[
          {frame: 62, x: 430, y: 315}, {frame: 100, x: 430, y: 315}, {frame: 130, x: 1180, y: 570},
          {frame: 230, x: 1040, y: 425}, {frame: 330, x: 1515, y: 555}, {frame: 420, x: 1515, y: 720},
          {frame: 468, x: 1515, y: 720},
        ]}
        clicks={[100, 130, 230, 330, 420]} dragRange={[130, 230]} visible={[54, 472]} />
      <div className="change-strip" style={{opacity: changed, transform: "translateY(" + ((1 - changed) * 16) + "px)"}}>
        <span>4-2-3-1</span><b>폭 +2</b><b>압박 +1</b><strong>위험도 +3</strong>
      </div>
    </AbsoluteFill>
  );
};

const Cause = () => {
  const frame = useCurrentFrame();
  const reveal = interpolate(frame, [145, 166], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Screen src="screens/ready.png" openingShade={0.2} clearAt={55} />
      <SceneHeader step="03 · 선택의 인과" title="바꾼 이유와 대가를 즉시 확인"
        body="공간, xG, 실점 위험, 예상 스코어가 선택과 함께 움직입니다." />
      <ProductCursor points={[{frame: 55, x: 1120, y: 610}, {frame: 115, x: 960, y: 790}, {frame: 155, x: 960, y: 790}]}
        clicks={[115]} visible={[48, 166]} />
      <div className="cause-strip" style={{opacity: reveal}}>
        <span>폭 +2</span><i>→</i><span>측면 통로</span><i>→</i><b>xG +0.24</b><i>→</i><strong>예상 3:2</strong>
      </div>
      <div className="risk-note" style={{opacity: reveal}}>공격 기회 ↑ <em>역습 위험도 ↑</em></div>
    </AbsoluteFill>
  );
};

const Replay = () => {
  const frame = useCurrentFrame();
  const ballX = interpolate(frame, [145, 285], [1035, 1530], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const ballY = interpolate(frame, [145, 215, 285], [690, 472, 384], clamp);
  const goal = interpolate(frame, [282, 296, 348], [0, 1, 0], clamp);
  const call = interpolate(frame, [82, 98, 150, 166], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill>
      <Screen src="screens/live.png" openingShade={0.16} clearAt={52} />
      <SceneHeader step="04 · 라이브 리플레이" title="전술 변화가 장면으로 이어집니다"
        body="선수와 공이 연속 이동하고, 골라인 통과 뒤에만 득점이 선언됩니다." />
      <ProductCursor points={[{frame: 45, x: 500, y: 790}, {frame: 70, x: 650, y: 790}, {frame: 108, x: 650, y: 790}]}
        clicks={[70]} visible={[38, 116]} />
      <div className="live-call" style={{opacity: call}}>현장 지시 적용 · 측면 전개</div>
      {frame >= 138 ? <div className="ball-tracer" style={{left: ballX, top: ballY}} /> : null}
      <div className="goal-flash" style={{opacity: goal, transform: "scale(" + (0.82 + goal * 0.18) + ")"}}>
        GOAL<small>골라인 판정 완료 · 3:2</small>
      </div>
    </AbsoluteFill>
  );
};

const Report = () => {
  const frame = useCurrentFrame();
  const proof = interpolate(frame, [135, 155], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Screen src="screens/report.png" openingShade={0.18} clearAt={55} />
      <SceneHeader step="05 · 감독 리포트" title="실제 경기와 내 판단을 같은 화면에서"
        body="기존 전술, 내 선택, 코치 제안을 동일한 시점과 목표로 비교합니다." />
      <ProductCursor points={[{frame: 95, x: 1210, y: 535}, {frame: 215, x: 1535, y: 790}, {frame: 272, x: 1535, y: 790}]}
        clicks={[215]} visible={[88, 278]} />
      <div className="report-proof" style={{opacity: proof}}>
        실제 2:2 <i>→</i> 기준 전술 2:2 <i>→</i> <strong>내 선택 3:2</strong> <b>감독 점수 92</b>
      </div>
    </AbsoluteFill>
  );
};

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
    <Progress />
  </AbsoluteFill>
);

export const Thumbnail = () => (
  <AbsoluteFill className="thumbnail">
    <Screen src="screens/live.png" openingShade={0.64} clearAt={120} />
    <div className="thumbnail-content">
      <span className="eyebrow">월드컵 결정적 순간을 다시 지휘하라</span>
      <Brand />
      <h2>내 전술로<br /><em>결과가 바뀐다</em></h2>
      <div className="thumbnail-score">65분 · 1:1 <i>→</i> <strong>3:2</strong></div>
    </div>
    <div className="thumbnail-badge">인과형 전술 시뮬레이터</div>
  </AbsoluteFill>
);
