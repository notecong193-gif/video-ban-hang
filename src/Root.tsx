import React from 'react';
import {Composition} from 'remotion';
import {HandDrawnVideo, VideoProps} from './Video';

const defaultProps: VideoProps = {
  title: 'VIDEO VẼ TAY',
  subtitle: 'Editorial Hand-Drawn • Voice-driven',
  scenes: [
    {narration:'Hook: thu hút người xem ngay những giây đầu.', keyword:'HOOK 3–5 GIÂY', start:0, duration:150, visual:'idea'},
    {narration:'Mỗi scene là một ý hình ảnh, không chia máy móc theo từng câu.', keyword:'MỘT SCENE = MỘT Ý', start:150, duration:210, visual:'person'},
    {narration:'Nét, hình và chi tiết xuất hiện theo nhịp giọng đọc.', keyword:'NÉT → HÌNH → CHI TIẾT', start:360, duration:210, visual:'chart'},
    {narration:'Chỉ giữ từ khóa quan trọng trên màn hình, không bê toàn bộ lời đọc lên.', keyword:'SHOW THE IDEA', start:570, duration:210, visual:'money'},
  ],
};

const totalFrames = (props: VideoProps) => Math.max(30, ...props.scenes.map((s) => s.start + s.duration));

export const Root: React.FC = () => (
  <Composition
    id="HandDrawnVideo"
    component={HandDrawnVideo}
    durationInFrames={totalFrames(defaultProps)}
    fps={30}
    width={1080}
    height={1920}
    defaultProps={defaultProps}
    calculateMetadata={({props}) => ({durationInFrames: totalFrames(props as VideoProps)})}
  />
);
