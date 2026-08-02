import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"};
const TOTAL_FRAMES = 1920;
const CAPTURE = "captures/actual-flow.webm";

const captions = [
  {from: 15, to: 135, text: "축구를 보다 보면, 누구나 한 번쯤 생각합니다."},
  {from: 135, to: 320, text: "그때 교체가 조금만 빨랐다면, 결과는 바뀌지 않았을까."},
  {from: 320, to: 500, text: "되감독 90은 월드컵의 결정적 순간을 다시 엽니다."},
  {from: 500, to: 650, text: "아쉬웠던 경기를 고르고, 같은 시점에서 다시 시작합니다."},
  {from: 650, to: 810, text: "포메이션과 선수, 템포와 폭, 압박과 위험도를 직접 조절합니다."},
  {from: 810, to: 990, text: "선택하는 순간 공간과 xG, 역습 위험과 예상 스코어가 달라집니다."},
  {from: 990, to: 1200, text: "선수와 공이 이어서 움직이고, 현장 지시가 경기 흐름을 바꿉니다."},
  {from: 1200, to: 1370, text: "공이 골라인을 통과해야만 득점이 완성됩니다."},
  {from: 1370, to: 1590, text: "모든 결과에는 내 판단이 만든 이유가 남습니다."},
  {from: 1590, to: 1760, text: "실제 경기와 기존 전술, 내 선택과 코치 제안을 비교합니다."},
  {from: 1760, to: 1885, text: "결과를 바꾸는 건 클릭이 아니라 판단입니다."},
  {from: 1885, to: 1920, text: "그 경기를 되감고, 내가 감독이 된다."},
];

const Scene = ({duration, children, className = ""}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [0, 8, duration - 8, duration],
    [0, 1, 1, 0],
    clamp,
  );
  return (
    <AbsoluteFill className={className} style={{opacity}}>
      {children}
    </AbsoluteFill>
  );
};

const ScreenImage = ({src, duration, shade = 0.4, position = "center"}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, duration], [1.02, 1.08], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  return (
    <AbsoluteFill className="visual">
      <Img
        src={staticFile(src)}
        className="visual-media"
        style={{objectPosition: position, transform: `scale(${scale})`}}
      />
      <AbsoluteFill style={{background: `rgba(2, 6, 5, ${shade})`}} />
      <AbsoluteFill className="stadium-vignette" />
    </AbsoluteFill>
  );
};

const CaptureClip = ({startFrom, playbackRate, duration, shade = 0.04}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, duration], [1, 1.025], clamp);
  return (
    <AbsoluteFill className="visual">
      <OffthreadVideo
        src={staticFile(CAPTURE)}
        className="visual-media"
        startFrom={startFrom}
        playbackRate={playbackRate}
        muted
        style={{transform: `scale(${scale})`}}
      />
      <AbsoluteFill style={{background: `rgba(1, 4, 3, ${shade})`}} />
      <AbsoluteFill className="capture-vignette" />
    </AbsoluteFill>
  );
};

const Enter = ({children, delay = 0, distance = 28}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const progress = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: {damping: 20, stiffness: 120, mass: 0.7},
  });
  return (
    <div style={{
      opacity: progress,
      transform: `translateY(${(1 - progress) * distance}px)`,
    }}>
      {children}
    </div>
  );
};

const Wordmark = ({large = false}) => (
  <div className={large ? "wordmark wordmark-large" : "wordmark"}>
    <span>되감독</span><strong>90</strong>
  </div>
);

const SceneLabel = ({number, text}) => (
  <div className="scene-label"><span>{number}</span>{text}</div>
);

const Caption = () => {
  const frame = useCurrentFrame();
  const item = captions.find(({from, to}) => frame >= from && frame < to);
  if (!item) return null;

  const local = frame - item.from;
  const duration = item.to - item.from;
  const opacity = interpolate(local, [0, 6, duration - 6, duration], [0, 1, 1, 0], clamp);
  return <div className="promo-caption" style={{opacity}}>{item.text}</div>;
};

const Hook = () => (
  <Scene duration={120} className="promo-scene">
    <ScreenImage src="screens/live.png" duration={120} shade={0.68} />
    <div className="hook-copy">
      <Enter><div className="promo-kicker">WORLD CUP DECISION REPLAY</div></Enter>
      <Enter delay={10}><h1>그때, 내가<br /><em>감독이었다면?</em></h1></Enter>
      <Enter delay={24}><div className="hook-line" /></Enter>
    </div>
  </Scene>
);

const Problem = () => (
  <Scene duration={150} className="promo-scene">
    <ScreenImage src="screens/archive.png" duration={150} shade={0.72} position="center 38%" />
    <div className="problem-copy">
      <Enter><span className="small-index">THE UNFINISHED MOMENT</span></Enter>
      <Enter delay={10}><h2>말로만 끝났던<br /><em>감독의 판단</em></h2></Enter>
      <Enter delay={24}><p>이제 같은 순간에서 직접 바꾸고, 결과까지 확인합니다.</p></Enter>
    </div>
    <div className="problem-quotes">
      <Enter delay={18}><div>“교체가 더 빨랐다면?”</div></Enter>
      <Enter delay={30}><div>“공간을 더 넓게 썼다면?”</div></Enter>
    </div>
  </Scene>
);

const Archive = () => (
  <Scene duration={210} className="promo-scene">
    <CaptureClip startFrom={0} playbackRate={1.05} duration={210} shade={0.02} />
    <SceneLabel number="01" text="결정적 경기 선택" />
    <div className="promo-callout promo-callout-right">
      <strong>6개의 감독석</strong>
      <span>실제 기록을 기준으로 같은 순간에서 시작</span>
    </div>
  </Scene>
);

const Tactics = () => (
  <Scene duration={270} className="promo-scene">
    <CaptureClip startFrom={180} playbackRate={1.05} duration={270} shade={0.03} />
    <SceneLabel number="02" text="전술 직접 개입" />
    <div className="feature-rail">
      <span>포메이션</span><span>선수 위치</span><span>템포</span>
      <span>폭</span><span>압박</span><span>위험도</span>
    </div>
  </Scene>
);

const Cause = () => (
  <Scene duration={180} className="promo-scene">
    <CaptureClip startFrom={420} playbackRate={1.1} duration={180} shade={0.08} />
    <div className="impact-title">
      <Enter><span>MY DECISION</span></Enter>
      <Enter delay={8}><h2>선택 즉시,<br /><em>경기의 조건이 바뀐다</em></h2></Enter>
    </div>
    <div className="metric-row">
      <div><small>공간 활용</small><strong>48 → 72%</strong></div>
      <div><small>기대 득점</small><strong>1.23 → 1.72</strong></div>
      <div><small>역습 위험</small><strong>2.1 → 6.4</strong></div>
    </div>
  </Scene>
);

const Simulation = () => (
  <Scene duration={420} className="promo-scene">
    <CaptureClip startFrom={600} playbackRate={3.5} duration={420} shade={0.01} />
    <SceneLabel number="03" text="라이브 시뮬레이션" />
    <div className="simulation-badge"><i /> 전술 변화가 장면으로 이어지는 중</div>
  </Scene>
);

const Goal = () => (
  <Scene duration={240} className="promo-scene">
    <CaptureClip startFrom={2070} playbackRate={2.5} duration={240} shade={0.02} />
    <SceneLabel number="04" text="골라인 기반 득점 판정" />
    <div className="goal-proof">
      <strong>공의 경로가 결과를 증명한다</strong>
      <span>서비스가 판정한 실제 리플레이 화면</span>
    </div>
  </Scene>
);

const Report = () => (
  <Scene duration={180} className="promo-scene">
    <ScreenImage src="screens/report.png" duration={180} shade={0.34} />
    <div className="report-copy">
      <Enter><span className="small-index">EXPLAINABLE RESULT</span></Enter>
      <Enter delay={8}><h2>결과만이 아니라<br /><em>판단의 이유까지</em></h2></Enter>
      <Enter delay={20}>
        <div className="report-items">
          <span>실제 경기</span><span>기존 전술</span><span>내 선택</span><span>코치 제안</span>
        </div>
      </Enter>
    </div>
  </Scene>
);

const Outro = () => (
  <Scene duration={150} className="promo-scene outro-scene">
    <ScreenImage src="screens/archive.png" duration={150} shade={0.78} position="center 38%" />
    <div className="outro-copy">
      <Enter><Wordmark large /></Enter>
      <Enter delay={12}><h2>그 경기를 되감고,<br /><em>내가 감독이 된다.</em></h2></Enter>
      <Enter delay={24}><div className="outro-url">doegamdok90.vercel.app</div></Enter>
    </div>
  </Scene>
);

export const DemoVideo = () => {
  const frame = useCurrentFrame();
  const masterOpacity = interpolate(
    frame,
    [0, 8, TOTAL_FRAMES - 8, TOTAL_FRAMES - 1],
    [0, 1, 1, 0],
    clamp,
  );

  return (
    <AbsoluteFill className="video-root" style={{opacity: masterOpacity}}>
      <Sequence from={0} durationInFrames={120}><Hook /></Sequence>
      <Sequence from={120} durationInFrames={150}><Problem /></Sequence>
      <Sequence from={270} durationInFrames={210}><Archive /></Sequence>
      <Sequence from={480} durationInFrames={270}><Tactics /></Sequence>
      <Sequence from={750} durationInFrames={180}><Cause /></Sequence>
      <Sequence from={930} durationInFrames={420}><Simulation /></Sequence>
      <Sequence from={1350} durationInFrames={240}><Goal /></Sequence>
      <Sequence from={1590} durationInFrames={180}><Report /></Sequence>
      <Sequence from={1770} durationInFrames={150}><Outro /></Sequence>

      <Sequence from={15}>
        <Audio src={staticFile("audio/tts/promo-narration.mp3")} volume={1.08} />
      </Sequence>
      <Caption />
    </AbsoluteFill>
  );
};

export const Thumbnail = () => (
  <AbsoluteFill className="thumbnail">
    <Img src={staticFile("screens/live.png")} className="visual-media" />
    <AbsoluteFill className="thumbnail-shade" />
    <div className="thumbnail-copy">
      <div className="promo-kicker">WORLD CUP DECISION REPLAY</div>
      <Wordmark large />
      <h2>그 경기를 되감고,<br /><em>내가 감독이 된다.</em></h2>
    </div>
  </AbsoluteFill>
);
