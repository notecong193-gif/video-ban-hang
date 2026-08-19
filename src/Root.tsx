import React from 'react';
import {Composition} from 'remotion';
import {HandDrawnVideo, VideoProps} from './Video';

const defaultProps: VideoProps = {
  title: 'VIDEO VẼ TAY',
  subtitle: 'ChatGPT tạo timeline • Remotion tự render',
  scenes: [
    {text: 'Hook: thu hút người xem ngay 3 giây đầu', start: 0, duration: 150},
    {text: 'Nội dung xuất hiện theo từng nét vẽ', start: 150, duration: 180},
    {text: 'Voice và hình ảnh chạy đúng timeline', start: 330, duration: 180},
  ],
};

export const Root: React.FC = () => (
  <Composition
    id="HandDrawnVideo"
    component={HandDrawnVideo}
    durationInFrames={510}
    fps={30}
    width={1080}
    height={1920}
    defaultProps={defaultProps}
  />
);
