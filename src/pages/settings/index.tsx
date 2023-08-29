import { useAllStore } from '@/stores';
import { useBoolean } from 'ahooks';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { IconFont } from 'tdesign-icons-react';
import { Button, Switch, Input } from 'tdesign-react';

const Settings = () => {
  const [loading, { setTrue, setFalse }] = useBoolean(false);
  const { config, setConfig, version, status } = useAllStore();
  const [editInput, { setTrue: esetTrue, setFalse: esetFalse }] = useBoolean(false);

  const handleUpdate = () => {
    setTrue();
    status?.event === 'update-downloaded' ? window.electron.quitAndInstall() : window.electron.quitAndInstall();
  };
  useEffect(() => {
    status?.event === 'download-progress' ||
    status?.event === 'checking-for-update' ||
    status?.event === 'update-available'
      ? setTrue()
      : setFalse();
  }, [status]);

  const STATUS_BTN: Record<string, string> = {
    error: `检查更新时出错，检查更新`,
    'checking-for-update': '正在检查更新 ...',
    'update-available': '有更新。正在下载...',
    'update-not-available': `最新版本 ${dayjs(status?.time).fromNow()}`,
    'download-progress': `${Number(status?.data.percent).toFixed(1)}% 正在下载...`,
    'update-downloaded': '已下载更新，重新启动应用程序时，将应用更新，点击立即安装',
  };
  const bindEditchange = (downloadaddress: string) => {
    setConfig({ ...config, downloadaddress });
    esetFalse();
  };
  return (
    <div>
      <Switch
        size='large'
        label={['关闭开发者模式', '启动开发者模式']}
        defaultValue={config?.developerMode}
        onChange={(developerMode) => setConfig({ ...config, developerMode })}
      />

      <div className='mt-24 mb-8'>设置文件的存储路径：</div>
      {editInput ? (
        <Input
          defaultValue={config.downloadaddress}
          className='mb-24'
          onBlur={bindEditchange}
          onEnter={bindEditchange}
        />
      ) : (
        <div className='c-000000 opacity-0d6 mb-24'>
          {config.downloadaddress}
          <IconFont name='edit-1' size='16px' className='ml-12 cursor-pointer' onClick={esetTrue} />
          <IconFont
            name='folder-open'
            size='16px'
            className='ml-12 mr-24 cursor-pointer'
            onClick={() => window.electron.openPath(config.downloadaddress)}
          />
        </div>
      )}
      <div className='flex flex-column pt-12' style={{ gap: '12px' }}>
        <div className='font-bold border-bottom-2-dfe2eb pb-12 flex align-items-center'>
          <span className='flex-1'> 应用程序版本: v{version}</span>
          <Button
            content={STATUS_BTN[status?.event] || `v${version}  检查更新`}
            size='small'
            className='mr-24'
            onClick={handleUpdate}
            loading={loading}
          />
        </div>
        <span className='mr-24 text-right c-333333'>
          您可以通过点击
          <span
            className='c-blue cursor-pointer mr-6 ml-6'
            onClick={() => window.electron.openExternal('https://github.com/blazer233/electron-tools')}
          >
            链接
          </span>
          查看更改
        </span>
      </div>
    </div>
  );
};

export default Settings;