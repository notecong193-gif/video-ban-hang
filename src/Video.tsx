import React from 'react';
import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export type Scene = {text: string; start: number; duration: number};
export type VideoProps = {title: string; subtitle?: string; scenes: Scene[]};

const DrawLine: React.FC<{delay?: number}> = ({delay = 0}) => {
  const frame = useCurrentFrame();
  const width = interpolate(frame - delay, [0, 28], [0, 760], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <div style={{height: 8, width, background: '#171717', borderRadius: 10, transform: 'rotate(-1deg)', marginTop: 24}} />;
};

const SceneCard: React.FC<{text: string}> = ({text}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame, fps, config: {damping: 15}});
  const opacity = interpolate(frame, [0, 12], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <div style={{opacity, transform: `translateY(${(1-p)*70}px) rotate(-0.6deg)`, fontFamily: 'Arial, sans-serif', width: 850}}>
      <div style={{fontSize: 66, lineHeight: 1.2, fontWeight: 800, color: '#171717'}}>{text}</div>
      <DrawLine delay={5}/>
      <div style={{marginTop: 42, height: 330, border: '8px solid #171717', borderRadius: 34, position: 'relative', overflow: 'hidden'}}>
        <div style={{position:'absolute', left:80, top:65, width:220, height:220, border:'7px solid #171717', borderRadius:'50%', transform:`scale(${p})`}}/>
        <div style={{position:'absolute', right:70, top:90, width:360, height:7, background:'#171717', transformOrigin:'left', transform:`scaleX(${p}) rotate(-5deg)`}}/>
        <div style={{position:'absolute', right:100, top:175, width:320, height:7, background:'#171717', transformOrigin:'left', transform:`scaleX(${p}) rotate(3deg)`}}/>
      </div>
    </div>
  );
};

export const HandDrawnVideo: React.FC<VideoProps> = ({title, subtitle, scenes}) => (
  <AbsoluteFill style={{background:'#f6f0e4', padding:'150px 90px', fontFamily:'Arial, sans-serif'}}>
    <div style={{fontSize:38, fontWeight:900, letterSpacing:3, color:'#171717'}}>{title}</div>
    {subtitle ? <div style={{fontSize:28, marginTop:16, color:'#555'}}>{subtitle}</div> : null}
    <div style={{marginTop:130}}>
      {scenes.map((scene, i) => (
        <Sequence key={i} from={scene.start} durationInFrames={scene.duration}>
          <SceneCard text={scene.text}/>
        </Sequence>
      ))}
    </div>
  </AbsoluteFill>
);
