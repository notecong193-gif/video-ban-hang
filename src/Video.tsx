import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';

type SubtitleSegment = {text:string; start:number; duration:number};
export type Scene = {
  narration:string;
  start:number;
  duration:number;
  keyword?:string;
  subtitle_segments?:SubtitleSegment[];
  sketch?:string;          // full detailed sketch image, data URI or URL
  hand?:string;            // real hand PNG, data URI or URL
  reveal?:'ltr'|'regions';
};
export type VideoProps = {title:string; subtitle?:string; audio?:string; scenes:Scene[]};

const PAPER='#fbfaf6';

const resolveSrc=(src?:string)=>{
  if(!src) return '';
  if(src.startsWith('data:')||src.startsWith('http://')||src.startsWith('https://')) return src;
  return staticFile(src);
};

const RealHand:React.FC<{src:string;x:number;y:number;opacity:number;scale?:number}>=({src,x,y,opacity,scale=1})=>
  <Img src={src} style={{position:'absolute',left:x,top:y,width:250*scale,opacity,transform:'rotate(-7deg)',transformOrigin:'34px 118px',filter:'drop-shadow(0 4px 4px rgba(0,0,0,.10))'}}/>;

const SketchReveal:React.FC<{scene:Scene}>=({scene})=>{
  const f=useCurrentFrame();
  const dur=Math.max(1,scene.duration);
  const p=interpolate(f,[0,dur*.9],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  const src=resolveSrc(scene.sketch);
  const handSrc=resolveSrc(scene.hand);
  if(!src){
    return <div style={{fontFamily:'Georgia,serif',fontSize:34,color:'#333',padding:50}}>Thiếu tranh sketch cho scene này.</div>;
  }

  // 4 reveal passes imitate drawing areas rather than one mechanical wipe.
  const bands=[0,.22,.47,.72].map((start,i)=>{
    const q=interpolate(p,[start,Math.min(1,start+.34)],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
    const top=i*25;
    return {q,top};
  });

  let active=0;
  for(let i=0;i<bands.length;i++) if(bands[i].q>0 && bands[i].q<1) active=i;
  const aq=bands[active].q;
  const handX=70+aq*760;
  const handY=75+active*105 + Math.sin(f*.23)*6;
  const handOpacity=(p<.985 && handSrc)?1:0;

  return <div style={{position:'relative',width:900,height:430,overflow:'hidden'}}>
    {bands.map((b,i)=><div key={i} style={{position:'absolute',left:0,top:`${b.top}%`,width:'100%',height:'29%',overflow:'hidden'}}>
      <Img src={src} style={{position:'absolute',left:0,top:`-${b.top/0.29}%`,width:'100%',height:'auto',clipPath:`inset(0 ${100-b.q*100}% 0 0)`}}/>
    </div>)}
    {/* faint second pass adds imperfect sketch density */}
    <Img src={src} style={{position:'absolute',inset:0,width:'100%',opacity:interpolate(p,[.82,1],[0,.16],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}),filter:'contrast(1.08)'}}/>
    {handSrc?<RealHand src={handSrc} x={handX} y={handY} opacity={handOpacity}/>:null}
  </div>;
};

const SceneView:React.FC<{scene:Scene}>=({scene})=>{
  const f=useCurrentFrame();
  const active=scene.subtitle_segments?.find(s=>f>=s.start&&f<s.start+s.duration)?.text||'';
  const titleOpacity=interpolate(f,[scene.duration*.72,scene.duration*.86],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  return <AbsoluteFill style={{background:PAPER,padding:'28px 70px 30px'}}>
    <div style={{position:'absolute',inset:0,backgroundImage:'radial-gradient(rgba(0,0,0,.022) 1px, transparent 1px)',backgroundSize:'8px 8px'}}/>
    <div style={{height:58,fontFamily:'Georgia, serif',fontWeight:700,fontSize:31,color:'#292724',opacity:titleOpacity,textAlign:'center'}}>{scene.keyword||''}</div>
    <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:440}}><SketchReveal scene={scene}/></div>
    {active?<div style={{position:'absolute',left:75,right:75,bottom:18,textAlign:'center',fontFamily:'Arial,sans-serif',fontSize:23,lineHeight:1.2,color:'#343434',fontWeight:600}}>{active}</div>:null}
  </AbsoluteFill>;
};

export const HandDrawnVideo:React.FC<VideoProps>=({audio,scenes})=><AbsoluteFill style={{background:PAPER}}>
  {audio?<Audio src={audio.startsWith('http')?audio:staticFile(audio)}/>:null}
  {scenes.map((s,i)=><Sequence key={i} from={s.start} durationInFrames={s.duration}><SceneView scene={s}/></Sequence>)}
</AbsoluteFill>;
