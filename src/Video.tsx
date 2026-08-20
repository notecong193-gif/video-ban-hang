import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, useCurrentFrame} from 'remotion';

type SubtitleSegment={text:string;start:number;duration:number};
export type Scene={narration:string;start:number;duration:number;keyword?:string;subtitle_segments?:SubtitleSegment[];visual?:string};
export type VideoProps={title:string;subtitle?:string;audio?:string;scenes:Scene[]};

const PAPER='#fbfaf6';
const INK='#302d28';
const HAND='https://freepngimg.com/thumb/pen/31-pen-in-hand-png-image.png';

const RoughFilter=()=> <defs><filter id="rough"><feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="2" seed="7" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="1.8"/></filter></defs>;
const S=({d,w=2.4}:{d:string;w?:number})=><path d={d} fill="none" stroke={INK} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"/>;
const T=({x,y,w=120}:{x:number;y:number;w?:number})=><><S d={`M${x} ${y} C${x+w*.22} ${y-3} ${x+w*.45} ${y+3} ${x+w} ${y}`}/><S d={`M${x} ${y+12} C${x+w*.18} ${y+10} ${x+w*.55} ${y+15} ${x+w*.82} ${y+12}`} w={1.5}/></>;

const AffiliateSketch:React.FC<{kind:number}>=({kind})=>{
 if(kind===0)return <svg viewBox="0 0 900 430" width="900" height="430"><RoughFilter/><g filter="url(#rough)">
  <S d="M70 300 L500 300 L500 325 L70 325 Z M105 325 L95 410 M470 325 L485 410" w={3}/>
  <S d="M205 110 L425 110 L425 270 L205 270 Z M235 140 L395 140 L395 235 L235 235 Z" w={3}/>
  <S d="M130 205 C95 170 105 125 145 118 C188 112 208 160 188 193 C175 215 146 220 130 205 Z M150 215 L150 300 M150 240 L105 282 M150 240 L195 270"/>
  <S d="M570 70 L760 70 L760 330 L570 330 Z M595 105 L735 105 L735 295 L595 295 Z" w={3}/>
  <S d="M650 145 L650 240 M650 145 L695 145 M650 188 L690 188" w={5}/>
  <S d="M805 235 L910 235 L895 315 L825 315 Z M835 342 A12 12 0 1 0 859 342 A12 12 0 1 0 835 342 M875 342 A12 12 0 1 0 899 342 A12 12 0 1 0 875 342"/>
  <S d="M535 340 L620 340 L620 395 L535 395 Z M650 345 L735 345 L735 400 L650 400 Z M765 338 L850 338 L850 393 L765 393 Z"/>
  <S d="M535 340 L578 362 L620 340 M650 345 L693 367 L735 345 M765 338 L808 360 L850 338"/>
  <T x={255} y={155} w={105}/><T x={255} y={190} w={95}/><T x={590} y={255} w={120}/>
 </g></svg>;
 if(kind===1)return <svg viewBox="0 0 900 430" width="900" height="430"><RoughFilter/><g filter="url(#rough)">
  <S d="M55 305 L520 305 L520 332 L55 332 Z M90 332 L80 415 M490 332 L500 415" w={3}/>
  <S d="M205 125 L420 125 L420 285 L205 285 Z M235 155 L390 155 L390 250 L235 250 Z" w={3}/>
  <S d="M115 205 A55 55 0 1 0 114 205 M115 150 A42 42 0 1 0 114 150 M115 260 L115 305"/>
  <S d="M600 205 C570 175 580 130 620 125 C660 120 682 160 666 195 C655 218 623 225 600 205 Z M620 220 L620 305 M620 245 L565 287 M620 245 L680 280"/>
  <S d="M710 85 L840 85 L840 160 L710 160 Z M755 175 L885 175 L885 250 L755 250 Z M690 270 L820 270 L820 345 L690 345 Z"/>
  <T x={728} y={105} w={85}/><T x={773} y={195} w={85}/><T x={708} y={290} w={85}/>
  <S d="M420 215 C480 215 505 215 555 198 M545 187 L560 198 L545 210"/>
  <S d="M55 265 L155 265 L155 290 L55 290 Z M65 240 L160 240 L160 265 L65 265 Z"/>
 </g></svg>;
 if(kind===2)return <svg viewBox="0 0 900 430" width="900" height="430"><RoughFilter/><g filter="url(#rough)">
  <S d="M75 70 L355 70 L320 165 L110 165 Z M120 190 L310 190 L280 280 L150 280 Z M165 305 L270 305 L250 395 L185 395 Z" w={3}/>
  <S d="M135 120 C175 85 255 85 300 120 C255 155 175 155 135 120 Z M220 102 A18 18 0 1 0 220 138 A18 18 0 1 0 220 102"/>
  <S d="M470 140 A42 42 0 1 0 554 140 A42 42 0 1 0 470 140 M535 140 A42 42 0 1 0 619 140 A42 42 0 1 0 535 140 M510 140 L575 140"/>
  <S d="M650 105 L820 105 L820 265 L650 265 Z M650 155 L735 195 L820 155 M735 195 L735 265" w={3}/>
  <S d="M405 245 L590 245 L590 400 L405 400 Z" w={3}/>
  <S d="M435 350 L470 318 L510 332 L555 278 M540 282 L558 278 L550 298" w={3}/>
  <S d="M438 372 L438 390 M475 355 L475 390 M512 345 L512 390 M550 300 L550 390"/>
  <T x={675} y={295} w={120}/><T x={675} y={325} w={105}/>
 </g></svg>;
 return <svg viewBox="0 0 900 430" width="900" height="430"><RoughFilter/><g filter="url(#rough)">
  <S d="M450 70 L450 350 M290 135 L610 135 M450 135 L375 235 M450 135 L525 235 M300 235 L450 235 M450 235 L600 235" w={3}/>
  <S d="M315 255 L420 255 L410 330 L325 330 Z M340 348 L395 348"/>
  <S d="M535 270 A38 38 0 1 0 535 346 A38 38 0 1 0 535 270 M535 287 L535 330 M520 300 L550 300"/>
  <S d="M80 350 L160 210 L240 350 Z M160 250 L160 305 M160 328 A5 5 0 1 0 160 338" w={3}/>
  <S d="M650 350 L710 300 L765 325 L850 220 M825 225 L850 220 L842 245" w={3}/>
  <S d="M720 150 C690 125 700 85 735 80 C770 75 790 110 776 140 C765 162 739 168 720 150 Z M735 165 L735 220 M735 185 L690 220 M735 185 L775 215"/>
  <S d="M790 95 A10 10 0 1 0 810 95 A10 10 0 1 0 790 95 M825 70 A14 14 0 1 0 853 70 A14 14 0 1 0 825 70 M860 48 A28 28 0 1 0 916 48 A28 28 0 1 0 860 48"/>
  <T x={610} y={90} w={115}/><T x={610} y={112} w={95}/>
 </g></svg>;
};

const RealHand:React.FC<{x:number;y:number;opacity:number}>=({x,y,opacity})=><Img src={HAND} style={{position:'absolute',left:x,top:y,width:270,opacity,transform:'rotate(-12deg)',transformOrigin:'18px 88px',filter:'drop-shadow(0 3px 4px rgba(0,0,0,.12))'}}/>;

const SketchReveal:React.FC<{scene:Scene;index:number}>=({scene,index})=>{
 const f=useCurrentFrame(); const dur=Math.max(1,scene.duration); const p=interpolate(f,[0,dur*.92],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 const bands=[0,.2,.45,.7].map((start,i)=>({q:interpolate(p,[start,Math.min(1,start+.33)],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}),top:i*25}));
 let active=0; for(let i=0;i<bands.length;i++)if(bands[i].q>0&&bands[i].q<1)active=i;
 const aq=bands[active].q; const hx=45+aq*760; const hy=45+active*88+Math.sin(f*.22)*5;
 const sketch=<AffiliateSketch kind={index%4}/>;
 return <div style={{position:'relative',width:900,height:430,overflow:'hidden'}}>
  {bands.map((b,i)=><div key={i} style={{position:'absolute',left:0,top:`${b.top}%`,width:'100%',height:'30%',overflow:'hidden'}}><div style={{position:'absolute',left:0,top:`-${b.top/0.30}%`,width:900,height:430,clipPath:`inset(0 ${100-b.q*100}% 0 0)`}}>{sketch}</div></div>)}
  <div style={{position:'absolute',inset:0,opacity:interpolate(p,[.84,1],[0,.13],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})}}>{sketch}</div>
  <RealHand x={hx} y={hy} opacity={p<.985?1:0}/>
 </div>;
};

const SceneView:React.FC<{scene:Scene;index:number}>=({scene,index})=>{const f=useCurrentFrame();const active=scene.subtitle_segments?.find(s=>f>=s.start&&f<s.start+s.duration)?.text||'';const to=interpolate(f,[scene.duration*.72,scene.duration*.88],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});return <AbsoluteFill style={{background:PAPER,padding:'22px 70px 28px'}}><div style={{height:52,textAlign:'center',fontFamily:'Georgia,serif',fontWeight:700,fontSize:29,color:'#292724',opacity:to}}>{scene.keyword||''}</div><div style={{display:'flex',justifyContent:'center'}}><SketchReveal scene={scene} index={index}/></div>{active?<div style={{position:'absolute',left:80,right:80,bottom:14,textAlign:'center',fontFamily:'Arial,sans-serif',fontSize:22,fontWeight:600,color:'#343434'}}>{active}</div>:null}</AbsoluteFill>};

export const HandDrawnVideo:React.FC<VideoProps>=({audio,scenes})=><AbsoluteFill style={{background:PAPER}}>{audio?<Audio src={audio}/>:null}{scenes.map((s,i)=><Sequence key={i} from={s.start} durationInFrames={s.duration}><SceneView scene={s} index={i}/></Sequence>)}</AbsoluteFill>;
