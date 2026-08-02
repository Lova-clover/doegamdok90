import React from "react";
import { CursorIcon } from "@phosphor-icons/react/dist/icons/Cursor";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const LIME = "#91e52f";
const WHITE = "#f6f8f2";
const MUTED = "#b8c1b2";

const sceneMeta = [
  { start: 0, end: 210, label: "되감기" },
  { start: 210, end: 540, label: "경기 선택" },
  { start: 540, end: 1020, label: "전술 개입" },
  { start: 1020, end: 1380, label: "인과 확인" },
  { start: 1380, end: 1860, label: "리플레이" },
  { start: 1860, end: 2340, label: "감독 리포트" },
  { start: 2340, end: 2640, label: "도전" },
];

const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

const overlayOpacity = (frame, hold, fade = 30) => interpolate(
  frame,
  [0, 18, hold, hold + fade],
  [0, 1, 1, 0],
  { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
);

const ProductCursor = ({ points, clickFrames = [], dragRange, visible = [0, 999] }) => {
  const frame = useCurrentFrame();
  const frames = points.map((point) => point.frame);
  const x = interpolate(frame, frames, points.map((point) => point.x), {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const y = interpolate(frame, frames, points.map((point) => point.y), {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const opacity = interpolate(
    frame,
    [visible[0], visible[0] + 10, visible[1] - 10, visible[1]],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const clickStrength = clickFrames.reduce((peak, clickFrame) => Math.max(
    peak,
    interpolate(
      frame,
      [clickFrame - 2, clickFrame, clickFrame + 10],
      [0, 1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    ),
  ), 0);
  const dragging = dragRange && frame >= dragRange[0] && frame <= dragRange[1];

  return (
    <div
      className={`product-cursor${dragging ? " is-dragging" : ""}`}
      style={{
        left: x,
        top: y,
        opacity,
        transform: `scale(${1 - clickStrength * 0.14})`,
      }}
    >
      <div className="pointer-ripple" style={{ opacity: clickStrength, transform: `scale(${0.55 + clickStrength * 0.75})` }} />
      <CursorIcon size={58} weight="fill" color="#ffffff" />
      {dragging ? <span className="drag-badge">드래그</span> : null}
    </div>
  );
};

const Screen = ({ src, position = "center", zoom = 1.03, shade = 0.28, revealAt }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const scale = interpolate(frame, [0, durationInFrames], [zoom, zoom + 0.045], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const reveal = revealAt === undefined ? 0 : interpolate(
    frame,
    [revealAt, revealAt + 24],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const currentShade = shade + (0.035 - shade) * reveal;

  return (
    <AbsoluteFill>
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: position,
          transform: `scale(${scale})`,
        }}
      />
      <AbsoluteFill style={{ background: `rgba(4, 8, 8, ${currentShade})` }} />
      <AbsoluteFill className="screen-vignette" style={{ opacity: 1 - reveal * 0.92 }} />
    </AbsoluteFill>
  );
};

const Kicker = ({ children }) => <div className="kicker">{children}</div>;

const Caption = ({ kicker, title, body, align = "left", accent = [], hold = 150, fade = 30 }) => {
  const frame = useCurrentFrame();
  const y = interpolate(frame, [0, 24], [50, 0], {
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const opacity = interpolate(frame, [0, 18, hold, hold + fade], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const highlighted = title.split(/(되감독90|내 판단|직접|즉시|GOAL|결과)/g);

  return (
    <div
      className={`caption caption-${align}`}
      style={{ opacity, transform: `translateY(${y}px)` }}
    >
      <Kicker>{kicker}</Kicker>
      <h1>
        {highlighted.map((part, index) => (
          <span
            key={`${part}-${index}`}
            style={{ color: accent.includes(part) ? LIME : undefined }}
          >
            {part}
          </span>
        ))}
      </h1>
      {body ? <p>{body}</p> : null}
    </div>
  );
};

const Brand = ({ compact = false }) => (
  <div className={`brand ${compact ? "brand-compact" : ""}`}>
    <span>되감독</span>
    <strong>90</strong>
  </div>
);

const Progress = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const width = `${(frame / (durationInFrames - 1)) * 100}%`;
  const active = sceneMeta.findIndex(({ start, end }) => frame >= start && frame < end);

  return (
    <div className="progress-wrap">
      <div className="progress-labels">
        {sceneMeta.map(({ label }, index) => (
          <span key={label} className={index === active ? "active" : ""}>
            {label}
          </span>
        ))}
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width }} />
      </div>
    </div>
  );
};

const Intro = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 16, stiffness: 95 } });
  const line = interpolate(frame, [25, 100], [0, 1], {
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  return (
    <AbsoluteFill className="intro">
      <Screen src="screens/archive.png" position="center 35%" zoom={1.08} shade={0.62} />
      <div className="intro-grid" />
      <div className="intro-content" style={{ transform: `scale(${0.88 + scale * 0.12})` }}>
        <Kicker>WORLD CUP DECISION REPLAY</Kicker>
        <Brand />
        <div className="intro-rule" style={{ transform: `scaleX(${line})` }} />
        <p>그 경기를 되감고, 내가 감독이 된다.</p>
      </div>
      <div className="intro-corner">90초 안에 증명하는 감독의 판단</div>
    </AbsoluteFill>
  );
};

const Archive = () => {
  const frame = useCurrentFrame();
  const detailOpacity = overlayOpacity(frame, 225, 24);

  return (
    <AbsoluteFill>
      <Screen src="screens/archive.png" position="center 32%" shade={0.34} revealAt={180} />
      <Caption
        kicker="01 / HEARTBREAK ARCHIVE"
        title="사람들이 아쉬워한 순간으로 돌아갑니다."
        body="6개의 실제 월드컵 결정 시점. 같은 경기도 서로 다른 감독석에서 다시 판단합니다."
        accent={["결과"]}
        hold={140}
      />
      <ProductCursor
        points={[
          { frame: 165, x: 1510, y: 780 },
          { frame: 205, x: 650, y: 430 },
          { frame: 255, x: 960, y: 785 },
          { frame: 300, x: 960, y: 785 },
        ]}
        clickFrames={[205, 255]}
        visible={[155, 315]}
      />
      <div className="match-pill" style={{ opacity: detailOpacity }}>대한민국 vs 포르투갈 · 65분 · 1:1</div>
    </AbsoluteFill>
  );
};

const Tactics = () => {
  const frame = useCurrentFrame();
  const detailOpacity = overlayOpacity(frame, 330, 30);

  return (
    <AbsoluteFill>
      <Screen src="screens/board.png" position="center" shade={0.18} revealAt={195} />
      <Caption
        kicker="02 / YOUR CALL"
        title="선수 한 명의 위치부터 직접 결정합니다."
        body="드래그 배치, 포메이션, 교체, 템포·폭·압박·위험도를 한 화면에서 조작합니다."
        accent={["직접"]}
        hold={155}
      />
      <ProductCursor
        points={[
          { frame: 155, x: 430, y: 315 },
          { frame: 195, x: 430, y: 315 },
          { frame: 230, x: 1180, y: 570 },
          { frame: 295, x: 1040, y: 425 },
          { frame: 350, x: 1515, y: 555 },
          { frame: 410, x: 1515, y: 720 },
        ]}
        clickFrames={[195, 230, 350, 410]}
        dragRange={[230, 295]}
        visible={[145, 445]}
      />
      <div className="metric-row" style={{ opacity: detailOpacity }}>
        <span>포메이션 4-2-3-1</span>
        <span>속도 7</span>
        <span>폭 7</span>
        <span>압박 6</span>
        <span>위험 8</span>
      </div>
    </AbsoluteFill>
  );
};

const Cause = () => {
  const frame = useCurrentFrame();
  const items = ["내 판단", "측면 공간", "xG +0.24", "예상 3:2"];
  const detailOpacity = overlayOpacity(frame, 285, 30);

  return (
    <AbsoluteFill>
      <Screen src="screens/ready.png" position="center" shade={0.4} revealAt={205} />
      <Caption
        kicker="03 / CAUSE & EFFECT"
        title="내 판단이 만든 변화를 즉시 설명합니다."
        body="결과 숫자만 보여주지 않습니다. 무엇을 바꿔 어떤 공간과 대가가 생겼는지 연결합니다."
        accent={["내 판단", "즉시"]}
        hold={150}
      />
      <ProductCursor
        points={[
          { frame: 160, x: 1120, y: 610 },
          { frame: 235, x: 960, y: 790 },
          { frame: 285, x: 960, y: 790 },
        ]}
        clickFrames={[235]}
        visible={[150, 300]}
      />
      <div className="cause-chain" style={{ opacity: detailOpacity }}>
        {items.map((item, index) => {
          const reveal = interpolate(frame, [150 + index * 16, 170 + index * 16], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <React.Fragment key={item}>
              <div style={{ opacity: reveal, transform: `translateX(${(1 - reveal) * 30}px)` }}>
                {item}
              </div>
              {index < items.length - 1 ? <b style={{ opacity: reveal }}>→</b> : null}
            </React.Fragment>
          );
        })}
      </div>
      <div className="tradeoff" style={{ opacity: detailOpacity }}>공격 기회 ↑ &nbsp;·&nbsp; 역습 위험도 ↑</div>
    </AbsoluteFill>
  );
};

const Replay = () => {
  const frame = useCurrentFrame();
  const goal = interpolate(frame, [330, 350, 405], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ballX = interpolate(frame, [230, 360], [1040, 1515], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const ballY = interpolate(frame, [230, 300, 360], [690, 470, 385], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <Screen src="screens/live.png" position="center" shade={0.22} revealAt={250} />
      <Caption
        kicker="04 / LIVE REPLAY"
        title="공이 골라인을 통과한 순간에만 GOAL."
        body="선수와 공은 끊기지 않고 움직이고, 현장 지시는 공간·모멘텀·이벤트·스코어를 함께 바꿉니다."
        accent={["GOAL"]}
        hold={190}
      />
      <ProductCursor
        points={[
          { frame: 110, x: 500, y: 790 },
          { frame: 170, x: 650, y: 790 },
          { frame: 215, x: 650, y: 790 },
        ]}
        clickFrames={[170]}
        visible={[100, 225]}
      />
      <div className="ball-tracer" style={{ left: ballX, top: ballY }} />
      <div className="goal-flash" style={{ opacity: goal, transform: `scale(${0.7 + goal * 0.3})` }}>
        GOAL
        <small>골라인 판정 완료</small>
      </div>
    </AbsoluteFill>
  );
};

const Report = () => {
  const frame = useCurrentFrame();
  const detailOpacity = overlayOpacity(frame, 360, 30);
  const score = Math.round(interpolate(frame, [190, 280], [0, 92], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  }));

  return (
    <AbsoluteFill>
      <Screen src="screens/report.png" position="center" shade={0.25} revealAt={220} />
      <Caption
        kicker="05 / MANAGER REPORT"
        title="실제 경기와 내 결과를 한 화면에서 비교합니다."
        body="기존 전술, 내 선택, 코치 제안을 같은 시점과 목표로 비교해 판단의 이유와 대가를 남깁니다."
        accent={["내 결과", "결과"]}
        hold={175}
      />
      <ProductCursor
        points={[
          { frame: 205, x: 1210, y: 535 },
          { frame: 310, x: 1535, y: 790 },
          { frame: 370, x: 1535, y: 790 },
        ]}
        clickFrames={[310]}
        visible={[195, 385]}
      />
      <div className="score-orbit" style={{ opacity: detailOpacity }}>
        <span>감독 점수</span>
        <strong>{score}</strong>
        <small>/ 100</small>
      </div>
      <div className="report-proof" style={{ opacity: detailOpacity }}>기준 전술 2:2 &nbsp;→&nbsp; 내 선택 3:2 &nbsp;·&nbsp; 매치 플랜 3/3</div>
    </AbsoluteFill>
  );
};

const Outro = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 18, stiffness: 80 } });

  return (
    <AbsoluteFill className="outro">
      <Screen src="screens/archive.png" position="center 70%" zoom={1.1} shade={0.72} />
      <div className="outro-content" style={{ opacity: enter, transform: `translateY(${(1 - enter) * 45}px)` }}>
        <Kicker>THE RESULT IS NOT A CLICK. IT IS YOUR CALL.</Kicker>
        <Brand />
        <h2>결과를 바꾸는 건 클릭이 아니라 판단입니다.</h2>
        <p>그 경기를 되감고, 내가 감독이 된다.</p>
        <div className="cta">지금, 감독석에 앉으세요 <span>doegamdok90.vercel.app</span></div>
        <small>비공식 팬 시뮬레이션 · 자체 모델 수치는 공식 예측이 아닙니다.</small>
      </div>
    </AbsoluteFill>
  );
};

const narrationTracks = [
  { from: 10, duration: 170, src: "audio/tts/01-intro.mp3" },
  { from: 225, duration: 214, src: "audio/tts/02-archive.mp3" },
  { from: 555, duration: 185, src: "audio/tts/03-tactics.mp3" },
  { from: 1035, duration: 212, src: "audio/tts/04-cause.mp3" },
  { from: 1395, duration: 231, src: "audio/tts/05-replay.mp3" },
  { from: 1875, duration: 195, src: "audio/tts/06-report.mp3" },
  { from: 2355, duration: 248, src: "audio/tts/07-outro.mp3" },
];

const NarrationAudio = () => (
  <>
    {narrationTracks.map((track) => (
      <Sequence key={track.src} from={track.from} durationInFrames={track.duration}>
        <Audio src={staticFile(track.src)} volume={1.06} />
      </Sequence>
    ))}
  </>
);

const interactionClickFrames = [415, 465, 735, 770, 890, 950, 1255, 1550, 2170];

const InteractionAudio = () => (
  <>
    {interactionClickFrames.map((frame) => (
      <Sequence key={frame} from={frame} durationInFrames={6}>
        <Audio src={staticFile("audio/ui-click.wav")} volume={0.24} />
      </Sequence>
    ))}
  </>
);

const CrowdAudio = () => {
  const frame = useCurrentFrame();
  const baseEnvelope = interpolate(
    frame,
    [0, 90, 540, 1020, 1380, 1650, 1710, 1800, 1860, 2340, 2520, 2639],
    [0, 0.08, 0.09, 0.08, 0.12, 0.17, 0.3, 0.18, 0.1, 0.14, 0.12, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  const entrance = interpolate(frame, [0, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const isNarrating = narrationTracks.some(
    ({ from, duration }) => frame >= from - 8 && frame <= from + duration + 8,
  );
  const narrationDuck = isNarrating ? 0.38 : 1;
  return (
    <Audio
      src={staticFile("audio/stadium-crowd.wav")}
      volume={baseEnvelope * entrance * narrationDuck}
      loop
    />
  );
};

export const DemoVideo = () => (
  <AbsoluteFill className="video-root">
    <CrowdAudio />
    <NarrationAudio />
    <InteractionAudio />
    <Sequence from={0} durationInFrames={210}><Intro /></Sequence>
    <Sequence from={210} durationInFrames={330}><Archive /></Sequence>
    <Sequence from={540} durationInFrames={480}><Tactics /></Sequence>
    <Sequence from={1020} durationInFrames={360}><Cause /></Sequence>
    <Sequence from={1380} durationInFrames={480}><Replay /></Sequence>
    <Sequence from={1860} durationInFrames={480}><Report /></Sequence>
    <Sequence from={2340} durationInFrames={300}><Outro /></Sequence>
    <div className="top-brand"><Brand compact /></div>
    <Progress />
  </AbsoluteFill>
);

export const Thumbnail = () => (
  <AbsoluteFill className="thumbnail">
    <Screen src="screens/live.png" position="center" zoom={1.04} shade={0.55} />
    <div className="thumbnail-content">
      <Kicker>월드컵 결정적 순간을 다시 지휘하라</Kicker>
      <Brand />
      <h2>내 전술로<br /><span>결과가 바뀐다</span></h2>
      <div className="thumbnail-score">65분 · 1:1 → <strong>3:2</strong></div>
    </div>
    <div className="thumbnail-badge">인과형 전술 시뮬레이터</div>
  </AbsoluteFill>
);
