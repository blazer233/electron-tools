import { PanelContent } from '@/components/Panel';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import { useMount, useRequest } from 'ahooks';
import { useEffect, useRef, useState } from 'react';
import { Loading, Upload, Button, Image } from 'tdesign-react';

const ffmpeg = createFFmpeg({ log: true });

const Index = () => {
  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState<IParamObject>();
  const [gif, setGif] = useState<String>('');

  const [files, setFiles] = useState<IParamObject[]>([]);
  const { loading } = useRequest(ffmpeg.load);
  const { data, run } = useRequest(fetchFile, { manual: true });
  const { run: exRun } = useRequest(ffmpeg.run, {
    manual: true,
    defaultParams: ['-i', 'video1.mp4', '-t', '2.5', '-ss', '2.0', '-f', 'gif', 'out.gif'],
  });

  const convertToGif = async () => {
    // Write the .mp4 to the FFmpeg file system
    ffmpeg.FS('writeFile', 'video1.mp4', await fetchFile(video as any));

    // Run the FFmpeg command-line tool, converting
    // the .mp4 into .gif file
    await ffmpeg.run('-i', 'video1.mp4', '-t', '2.5', '-ss', '2.0', '-f', 'gif', 'out.gif');
    // Read the .gif file back from the FFmpeg file system
    const data = ffmpeg.FS('readFile', 'out.gif');
    const url = URL.createObjectURL(new Blob([data.buffer], { type: 'image/gif' }));
    setGif(url);
  };

  const download = () => {
    fetch(gif as any, {
      method: 'GET',
      headers: {},
    })
      .then((response) => {
        response.arrayBuffer().then(function (buffer) {
          const url = window.URL.createObjectURL(new Blob([buffer]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'image.gif');
          document.body.appendChild(link);
          link.click();
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <PanelContent className='min-height-400' loading={loading}>
      <div className='overflow-y-auto mr-24'>
        <div className='flex justify-content-between mb-24 align-items-center '>
          {video ? (
            <video controls className='m-24' width='250' src={URL.createObjectURL(video as any)} />
          ) : (
            <div className='p-24 radius-16 m-24 border-2' style={{ borderColor: 'Highlight' }}>
              <input type='file' onChange={(e: IParamObject) => setVideo(e.target.files?.item(0))} />
            </div>
          )}
        </div>
        {video && <Button content='转换' onClick={convertToGif} />}
        {gif && <Image src={gif as string} />}
        {gif && <Button content='下载' onClick={download} />}
      </div>
    </PanelContent>
  );
};

export default Index;
