import LogViewer from '@/components/LogViewer';
import Section from '@/components/Section';
import { useBreadcrumbs } from '@/hooks/useBreadcrumbs';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import useSWR from 'swr';
import { Button } from 'tdesign-react';

const RELOAD_MINUTE = 1;

const SettingsDevelopers = () => {
  useBreadcrumbs(['设置', '开发者选项']);
  const { data, isValidating, mutate } = useSWR('@app/developers', async () => {
    const storePath = await window.electron.getStorePath();
    const logs = await window.electron.getLogs();

    return {
      storePath,
      logs,
      time: new Date().getTime(),
    };
  });

  const handleClearLogs = async () => {
    await window.electron.clearLogs();
    mutate();
  };

  useEffect(() => {
    if (data && dayjs().diff(dayjs(data.time), 'minute') >= RELOAD_MINUTE) {
      mutate();
    }

    const interval = setInterval(() => {
      mutate();
    }, 1000 * 60 * RELOAD_MINUTE);

    console.log(data, 232323);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className='overflow-y-auto h-144c mr-10'>
      <Section
        title='数据查询'
        description={
          <div>
            以下所有数据的查询日期.
            <br />
            将自动每{RELOAD_MINUTE}分钟刷新一次 .
            <br />
            <div className='spacing' />
            要立即更新数据，请单击右侧刷新按钮.
          </div>
        }
      >
        {data && (
          <div className='date'>
            {dayjs(data.time).fromNow()} <span>({dayjs(data.time).format('YYYY.MM.DD')})</span>
            <Button
              className='sectionButton'
              loading={isValidating}
              onClick={() => {
                mutate();
              }}
            >
              刷新
            </Button>
          </div>
        )}
      </Section>

      <Section title='Store Path' description={<div>设置数据的存储路径.</div>}>
        <mark className='selectable'>{data?.storePath}</mark>
      </Section>

      <Section title='Logs' description='日志'>
        {data && (
          <div className='w-200'>
            <div className='size'>
              日志容量 <em>{(data.logs.reduce((acc, item) => acc + item.size, 0) / 1024).toFixed(1)} KB</em>
            </div>

            <Button className='' loading={isValidating} onClick={handleClearLogs}>
              清除日志
            </Button>
          </div>
        )}
      </Section>

      {data && (
        <div className='mt-10'>
          {data.logs.map((log) => (
            <LogViewer key={log.path} path={log.path} lines={log.lines} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SettingsDevelopers;
