import { ipcMain, app } from 'electron';
import { ModuleFunction } from '@app/app';
import axios from 'axios';
import fs from 'fs'
import path from 'path'
import ytdl from 'ytdl-core';
import { controlVideo } from '@app/stores/video';
import { controlKey } from '@app/stores/key';
import { configStore } from '@app/stores/config';


const cleanFileName = (fileName: string) => {
  let illegalChars = /[\u{0000}-\u{001f}\\<>:"/|?*]/gu;
  return fileName.replace(illegalChars, '');
}
const userHome = () => configStore.store.downloadaddress || app.getPath('home');

export interface Log {
  size: number;
  path: string;
  lines: string[];
}
// 用于获取播放列表中的所有视频 URL
const getPlaylistVideos = async (action: any) => {
  const { playlistId, key = controlKey.get('video') } = action
  const queryTmp = {
    part: 'snippet',
    maxResults: 50,
    playlistId,
    key,
  };
  const response = await axios.get(
    `https://www.googleapis.com/youtube/v3/playlistItems?${Object.entries(queryTmp)
      .map(pair => pair.join('='))
      .join('&')}`
  );
  const items = response.data.items || [];
  return [items[0]?.snippet?.title || response.data.etag, items.map(
    (item: any) => ({ publishTime: item.snippet.publishedAt, title: item.snippet.title, description: item.snippet.description, url: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}` })
  )];
}
// 下载单个视频
const downloadVideo = async (context: any, action: string[], index: number) => {
  try {
    let starttime: number
    const videoInfo = await ytdl.getInfo(action[index]);
    const videoFormat = ytdl.chooseFormat(videoInfo.formats, { quality: 'highest', filter: 'audioandvideo' });
    const videoStream = ytdl.downloadFromInfo(videoInfo, { format: videoFormat });
    const videoPath = path.join(userHome(), `${cleanFileName(videoInfo.videoDetails.title)}.mp4`);
    console.log(videoPath, 'videoPath')
    return new Promise((resolve, reject) => {
      videoStream.pipe(fs.createWriteStream(videoPath))
        .on('finish', () => resolve(videoInfo.videoDetails.title))
        .on('error', reject);
      videoStream.once('response', () => starttime = Date.now());
      videoStream.on('progress', (_, downloaded, total) => {
        const percent = downloaded / total;
        const downloadedMinutes = (Date.now() - starttime) / 1000 / 60;
        const estimatedDownloadTime = downloadedMinutes / percent - downloadedMinutes;
        context.window.webContents.send('operateVideoLoad', {
          percent: (percent * 100).toFixed(2),
          downloaded: (downloaded / 1024 / 1024).toFixed(2),
          content: (total / 1024 / 1024).toFixed(2),
          estimated: estimatedDownloadTime.toFixed(2),
          spend: downloadedMinutes.toFixed(2),
          title: videoInfo.videoDetails.title,
          index,
          action,
        });
      });
      videoStream.on('end', () => context.window.webContents.send('operateVideoLoad', {}));
    });
  } catch (error) {
    console.log(error, 444444444444)
  }
}

const videoDownLoadModule: ModuleFunction = (context) => {

  // 清除缓存
  ipcMain.handle('operateVideoDel', async () => await controlVideo.delete('video'))

  // 获取下载列表
  ipcMain.handle('operateVideoList', async (_, action) => {
    if (action.key) controlKey.set('video', action.key)
    if (!Object.keys(action).length) return controlVideo.get('video') || {}
    if (controlVideo.get('video') && controlVideo.get('video')[action.playlistId]) return { [action.playlistId]: controlVideo.get('video')[action.playlistId] }
    const [title, list] = await getPlaylistVideos(action)
    const videos = controlVideo.get('video') || {}
    videos[action.playlistId] = { title, list }
    controlVideo.set('video', videos)
    return videos
  });


  ipcMain.handle('operateVideoDownLoad', async (_, action) => {
    const info = []
    console.log(action, 4242424)
    for (let i = 0; i < action.length; i++) {
      info[i] = await downloadVideo(context, action, i)
    }
    return info
  });
};

export default videoDownLoadModule;
