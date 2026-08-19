import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';

type SubtitleSegment = {text: string; start: number; duration: number};
export type Scene = {narration:string;start:number;duration:number;keyword?:string;visual?:'person'|'money'|'idea'|'chart'|'product';subtitle_segments?:SubtitleSegment[]};
export type VideoProps = {title:string;subtitle?:string;audio?:string;scenes:Scene[]};

const INK='#222'; const RED='#d94b3d'; const YELLOW='#f2c84b'; const PAPER='#fbfaf6';

const Stroke:React.FC<{d:string;start:number;dur?:number;color?:string;width?:number}>=({d,start,dur=18,color=INK,width=5})=>{
 const f=useCurrentFrame(); const p=interpolate(f,[start,start+dur],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 return <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1-p}/>;
};
const Fill:React.FC<{children:React.ReactNode;start:number;opacity?:number}>=({children,start,opacity=.18})=>{const f=useCurrentFrame();const o=interpolate(f,[start,start+12],[0,opacity],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});return <g opacity={o}>{children}</g>};
const Scribble:React.FC<{x:number;y:number;w:number;start:number;color?:string}>=({x,y,w,start,color=RED})=><Stroke d={`M${x} ${y} C${x+w*.2} ${y-5} ${x+w*.4} ${y+6} ${x+w*.6} ${y} C${x+w*.75} ${y-5} ${x+w*.9} ${y+5} ${x+w} ${y}`} start={start} color={color} width={6}/>;

const Pen:React.FC<{scene:number}>=({scene})=>{const f=useCurrentFrame();const pts=[[[120,118],[390,210],[690,360]],[[115,250],[360,270],[690,275]],[[125,280],[390,250],[695,315]],[[120,180],[360,250],[700,360]],[[130,310],[390,250],[705,310]]][scene%5]; const phase=Math.min(2,Math.floor(f/38)); const local=(f%38)/38; const a=pts[phase],b=pts[Math.min(phase+1,2)]; const x=a[0]+(b[0]-a[0])*local,y=a[1]+(b[1]-a[1])*local; return <g transform={`translate(${x} ${y}) rotate(-32)`}><rect x="0" y="0" width="92" height="20" rx="8" fill="#f7f7f2" stroke={INK} strokeWidth="3"/><path d="M0 4 L-18 10 L0 16Z" fill={INK}/><path d="M45 0 L45 20" stroke={RED} strokeWidth="5"/></g>};

const Person=({x=170,y=260,start=0,thumb=false}:{x?:number;y?:number;start?:number;thumb?:boolean})=><g transform={`translate(${x} ${y})`}>
 <Stroke d="M0 0 C-35-30-35-90 0-115 C35-140 78-118 88-78 C98-38 68-5 38 6" start={start}/>
 <Stroke d="M12-70 L20-70 M58-70 L66-70 M20-42 Q40-28 60-42" start={start+10} width={4}/>
 <Stroke d="M18 8 L5 120 M62 8 L82 120 M20 42 L-45 88 M65 40 L122 76" start={start+18}/>
 {thumb?<><Stroke d="M122 76 L150 48 L161 61 L147 89" start={start+27} color={RED}/><Fill start={start+35}><circle cx="40" cy="-65" r="56" fill={YELLOW}/></Fill></>:null}
 </g>;

const SceneIllustration:React.FC<{index:number}>=({index})=>{
 if(index===0)return <svg viewBox="0 0 820 520" width="820" height="520"><Person x={125} y={255} start={4}/><Stroke d="M365 125 L735 125 L735 405 L365 405 Z" start={25}/><Stroke d="M400 165 L690 165 M400 205 L625 205" start={34} color={RED}/><Stroke d="M445 295 C500 245 565 245 620 295 C565 345 500 345 445 295 Z" start={46}/><Stroke d="M520 270 L575 295 L520 322 Z" start={54} color={RED}/><Scribble x={410} y={385} w={270} start={60}/><Pen scene={0}/></svg>;
 if(index===1)return <svg viewBox="0 0 820 520" width="820" height="520"><Stroke d="M75 170 L255 170 L255 330 L75 330 Z" start={3}/><Stroke d="M105 210 L220 210 M105 245 L205 245 M105 280 L185 280" start={12}/><Stroke d="M285 250 C330 220 355 220 400 250" start={24} color={RED}/><Stroke d="M390 250 L375 235 M390 250 L375 265" start={28} color={RED}/><Stroke d="M420 180 C385 210 385 285 420 315 C455 345 500 320 500 250 C500 180 455 150 420 180 Z" start={34}/><Stroke d="M460 315 L460 365 M425 365 L495 365" start={45}/><Stroke d="M530 250 C575 220 600 220 645 250" start={50} color={RED}/><Stroke d="M635 250 L620 235 M635 250 L620 265" start={54} color={RED}/><Stroke d="M660 175 L760 175 L760 330 L660 330 Z M682 205 L738 205 M682 245 L738 245 M682 285 L725 285" start={58}/><Pen scene={1}/></svg>;
 if(index===2)return <svg viewBox="0 0 820 520" width="820" height="520"><Stroke d="M120 310 C70 260 85 175 155 160 C230 145 270 230 220 280 C200 300 195 320 195 340 L145 340 C145 320 142 300 120 310 Z" start={3} color={RED}/><Stroke d="M145 365 L195 365 M150 385 L190 385" start={20}/><Stroke d="M280 275 C330 245 355 245 405 275" start={28} color={RED}/><Stroke d="M395 275 L380 260 M395 275 L380 290" start={32} color={RED}/><Stroke d="M440 390 L440 220 L650 220" start={37}/><Stroke d="M480 390 L480 335 M525 390 L525 300 M570 390 L570 270 M615 390 L615 235" start={44} color={RED}/><Person x={650} y={320} start={58} thumb/><Pen scene={2}/></svg>;
 if(index===3)return <svg viewBox="0 0 820 520" width="820" height="520"><Stroke d="M95 120 C185 95 285 100 365 125" start={3}/><Stroke d="M110 180 C185 145 260 150 335 180" start={12} color={RED}/><Stroke d="M125 245 C210 215 285 215 355 245" start={21}/><Stroke d="M410 120 L720 120 L720 390 L410 390 Z" start={30}/><Stroke d="M445 170 L680 170 M445 215 L625 215" start={38}/><Stroke d="M465 300 C520 245 600 245 655 300 C600 355 520 355 465 300 Z" start={46}/><Stroke d="M535 270 L595 300 L535 330 Z" start={54} color={RED}/><Scribble x={455} y={365} w={230} start={62}/><Pen scene={3}/></svg>;
 return <svg viewBox="0 0 820 520" width="820" height="520"><Stroke d="M105 115 L405 115 L405 410 L105 410 Z" start={3}/><Stroke d="M145 175 L170 200 L205 155 M225 180 L355 180" start={14} color={RED}/><Stroke d="M145 235 L170 260 L205 215 M225 240 L350 240" start={25} color={RED}/><Stroke d="M145 295 L170 320 L205 275 M225 300 L340 300" start={36} color={RED}/><Stroke d="M440 260 C500 220 540 220 590 260" start={46}/><Stroke d="M580 260 L560 240 M580 260 L560 278" start={50}/><Person x={610} y={305} start={56} thumb/><Scribble x={525} y={420} w={220} start={72}/><Pen scene={4}/></svg>;
};

const SceneView:React.FC<{scene:Scene;index:number}>=({scene,index})=>{const f=useCurrentFrame();const active=scene.subtitle_segments?.find(s=>f>=s.start&&f<s.start+s.duration)?.text||'';const kw=interpolate(f,[2,14],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});return <AbsoluteFill style={{padding:'105px 72px 95px'}}>
 <div style={{fontFamily:'Comic Sans MS, Segoe Print, cursive',fontWeight:800,fontSize:54,lineHeight:1.08,color:INK,opacity:kw,maxWidth:900}}>{scene.keyword||scene.narration}</div>
 <Scribble x={0} y={0} w={0} start={0}/>
 <div style={{marginTop:34,display:'flex',justifyContent:'center'}}><SceneIllustration index={index}/></div>
 {active?<div style={{position:'absolute',bottom:58,left:90,right:90,textAlign:'center',fontFamily:'Arial, sans-serif',fontSize:31,lineHeight:1.25,color:'#303030',fontWeight:600}}>{active}</div>:null}
 </AbsoluteFill>};

export const HandDrawnVideo:React.FC<VideoProps>=({audio,scenes})=><AbsoluteFill style={{background:PAPER}}>
 <div style={{position:'absolute',inset:0,backgroundImage:'radial-gradient(rgba(0,0,0,.025) 1px, transparent 1px)',backgroundSize:'9px 9px'}}/>
 {audio?<Audio src={audio.startsWith('http')?audio:staticFile(audio)}/>:null}
 {scenes.map((s,i)=><Sequence key={i} from={s.start} durationInFrames={s.duration}><SceneView scene={s} index={i}/></Sequence>)}
 </AbsoluteFill>;
