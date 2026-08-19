import fs from 'node:fs';
import path from 'node:path';
import {bundle} from '@remotion/bundler';
import {renderMedia, selectComposition} from '@remotion/renderer';

const inputProps = JSON.parse(fs.readFileSync('public/render.json', 'utf8'));
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const composition = await selectComposition({
  serveUrl,
  id: 'HandDrawnVideo',
  inputProps,
});

fs.mkdirSync('out', {recursive: true});

await renderMedia({
  composition,
  serveUrl,
  codec: 'h264',
  outputLocation: path.resolve('out/video.mp4'),
  inputProps,
  concurrency: 1,
  crf: 23,
  x264Preset: 'superfast',
  disallowParallelEncoding: true,
  jpegQuality: 75,
  ffmpegOverride: ({args}) => {
    const output = args.at(-1);
    const beforeOutput = args.slice(0, -1);
    return [
      ...beforeOutput,
      '-threads', '1',
      '-x264-params', 'threads=1:lookahead_threads=1',
      output,
    ];
  },
});

console.log('LOWMEM_RENDER_OK out/video.mp4');
