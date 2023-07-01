import { UpdateStatusStyled } from './styled';
import { UpdateStatus as UpdateStatusType } from '@app/modules/update';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Button } from 'tdesign-react';

export interface UpdateStatusProps {
  version: string;
  status: UpdateStatusType;
  className?: string;
}

const UpdateStatus = ({ className, version, status }: UpdateStatusProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckForUpdate = () => {
    setIsLoading(true);
    window.electron.checkForUpdate();
  };

  const handleUpdateNow = () => {
    setIsLoading(true);
    window.electron.quitAndInstall();
  };

  useEffect(() => {
    if (status.event === 'checking-for-update') {
      setIsLoading(false);
    }
  }, [status]);

  return (
    <UpdateStatusStyled className={clsx('UpdateStatus', className)}>
      <div className='version'>
        当前版本
        <em>v{version}</em>
      </div>

      <div className='description'>
        {status.event === 'checking-for-update' && <>正在检查更新 ...</>}

        {status.event === 'update-available' && <>有更新。正在下载...</>}

        {status.event === 'update-not-available' && (
          <>
            最新版本. ({dayjs(status.time).fromNow()})
            <Button loading={isLoading} onClick={handleCheckForUpdate}>
              检查更新
            </Button>
          </>
        )}

        {status.event === 'error' && (
          <>
            检查更新时出错.
            <Button onClick={handleCheckForUpdate}>检查更新</Button>
          </>
        )}

        {status.event === 'download-progress' && <>{Number(status.data.percent).toFixed(1)}% 正在下载...</>}

        {status.event === 'update-downloaded' && (
          <>
            已下载更新.
            <br />
            重新启动应用程序时，将应用更新。.
            <Button onClick={handleUpdateNow}>立即安装</Button>
          </>
        )}
      </div>
    </UpdateStatusStyled>
  );
};

export default UpdateStatus;
