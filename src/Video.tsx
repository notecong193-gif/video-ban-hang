import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

export type Scene = {
  narration: string;
  start: number;
  duration: number;
  keyword?: string;
  visual?: 'person' | 'money' | 'idea' | 'chart' | 'product';
};

export type VideoProps = {
  title: string;
  subtitle?: string;
  audio?: string;
  scenes: Scene[];
};

const InkStroke: React.FC<{d: string; delay?: number; width?: number; accent?: boolean}> = ({d, delay = 0, width = 8, accent = false}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame - delay, [0, 24], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <path d={d} fill="none" stroke={accent ? '#d84a3a' : '#171717'} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1-progress}/>;
};

const HandDrawnIllustration: React.FC<{type?: Scene['visual']}> = ({type = 'idea'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = spring({frame: frame - 20, fps, config: {damping: 14}});
  return (
    <svg viewBox="0 0 820 560" width="820" height="560" style={{overflow:'visible'}}>
      <InkStroke d="M120 420 C180 350 235 330 300 355 C365 380 400 440 470 420 C540 400 585 340 700 360"/>
      <InkStroke d="M215 350 C195 295 205 245 250 220 C295 195 350 215 370 260 C390 305 365 350 320 365" delay={8}/>
      <InkStroke d="M270 365 L250 470 M325 365 L355 470 M250 405 L190 450 M340 405 L405 450" delay={14}/>
      <InkStroke d="M245 275 Q285 300 325 275" delay={18} width={6}/>
      <InkStroke d="M255 250 L265 250 M315 250 L325 250" delay={18} width={7}/>
      {type === 'money' ? <>
        <InkStroke d="M470 260 Q555 215 640 260 L620 430 Q555 465 490 430 Z" delay={20}/>
        <InkStroke d="M515 300 Q555 275 595 300 M530 335 L580 335 M530 370 L580 370" delay={26} accent/>
      </> : null}
      {type === 'chart' ? <>
        <InkStroke d="M475 430 L475 250 L690 250" delay={20}/>
        <InkStroke d="M510 400 L510 350 M555 400 L555 315 M600 400 L600 285 M645 400 L645 265" delay={25} accent/>
      </> : null}
      {type === 'product' ? <>
        <InkStroke d="M495 285 L650 285 L675 430 L470 430 Z" delay={20}/>
        <InkStroke d="M520 285 Q535 230 570 230 Q610 230 625 285" delay={26} accent/>
      </> : null}
      {type === 'idea' || type === 'person' ? <>
        <g style={{transform:`translate(505px,165px) scale(${Math.max(0,pop)})`, transformOrigin:'80px 80px'}}>
          <circle cx="80" cy="80" r="58" fill="#f3c84b" opacity="0.22"/>
        </g>
        <InkStroke d="M545 245 C505 210 520 150 575 145 C635 140 665 205 625 245 C605 265 602 282 602 295 L568 295 C568 278 565 263 545 245 Z" delay={22} accent/>
        <InkStroke d="M565 315 L607 315 M570 335 L602 335" delay={30}/>
      </> : null}
      <InkStroke d="M90 120 C175 85 270 85 350 120" delay={6} accent/>
      <InkStroke d="M630 110 Q675 130 710 165" delay={12}/>
    </svg>
  );
};

const SceneCard: React.FC<{scene: Scene}> = ({scene}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 10], [0, 1], {extrapolateRight: 'clamp'});
  const y = interpolate(frame, [0, 16], [36, 0], {extrapolateRight:'clamp'});
  return (
    <AbsoluteFill style={{padding:'170px 88px 190px', opacity, transform:`translateY(${y}px)`}}>
      <div style={{fontSize:64, lineHeight:1.16, fontWeight:800, maxWidth:900, color:'#171717'}}>{scene.keyword || scene.narration}</div>
      <svg width="820" height="55" viewBox="0 0 820 55" style={{marginTop:18}}><InkStroke d="M10 27 C190 18 360 35 520 23 C625 16 710 20 800 28" accent width={7}/></svg>
      <div style={{marginTop:60, display:'flex', justifyContent:'center'}}><HandDrawnIllustration type={scene.visual}/></div>
      <div style={{marginTop:70, fontSize:36, lineHeight:1.35, color:'#343434', background:'rgba(255,255,255,.72)', borderRadius:22, padding:'18px 24px', maxWidth:900}}>{scene.narration}</div>
    </AbsoluteFill>
  );
};

export const HandDrawnVideo: React.FC<VideoProps> = ({title, subtitle, audio, scenes}) => (
  <AbsoluteFill style={{background:'#f7f0e3', fontFamily:'Arial, sans-serif'}}>
    <div style={{position:'absolute', top:72, left:88, right:88, zIndex:10}}>
      <div style={{fontSize:34, fontWeight:900, letterSpacing:2.2}}>{title}</div>
      {subtitle ? <div style={{fontSize:23, marginTop:8, color:'#68625a'}}>{subtitle}</div> : null}
    </div>
    {audio ? <Audio src={audio.startsWith('http') ? audio : staticFile(audio)}/> : null}
    {scenes.map((scene, i) => <Sequence key={i} from={scene.start} durationInFrames={scene.duration}><SceneCard scene={scene}/></Sequence>)}
  </AbsoluteFill>
);
