import React from 'react';
import {Composition} from 'remotion';
import {HandDrawnVideo, VideoProps} from './Video';

const defaultProps: VideoProps = {
  title:'VIDEO VẼ TAY',
  subtitle:'True sketch reveal • VieNeu Phạm Tuyên',
  scenes:[
    {narration:'Demo', keyword:'VIDEO VẼ TAY', start:0, duration:150}
  ],
};

const totalFrames=(props:VideoProps)=>Math.max(30,...props.scenes.map((s)=>s.start+s.duration));

export const Root:React.FC=()=> (
  <Composition
    id="HandDrawnVideo"
    component={HandDrawnVideo}
    durationInFrames={totalFrames(defaultProps)}
    fps={30}
    width={1080}
    height={600}
    defaultProps={defaultProps}
    calculateMetadata={({props})=>({durationInFrames:totalFrames(props as VideoProps)})}
  />
);
