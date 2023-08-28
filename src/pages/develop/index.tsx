import { useRequest } from 'ahooks';
import React, { useEffect, useRef } from 'react';
import { Button, Input } from 'tdesign-react';

const SettingsDevelopers = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data: devData, loading: devLoading, run: devRun } = useRequest(window.electron.getStorePath);
  const { data: logData, loading: logLoading, run: logRun } = useRequest(window.electron.getLogs);
  const { loading: clLoading, run: clRun } = useRequest(window.electron.clearLogs, {
    onSuccess: logRun,
    manual: true,
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logData]);
  console.log(logData, devData, 4242);
  return (
    <div className='overflow-y-auto mr-24'>
      <div className='flex justify-content-between mr-24 align-items-center '>
        检测更新：
        <Button
          loading={logLoading || devLoading}
          onClick={() => {
            devRun();
            logRun();
          }}
          content='刷新'
        />
      </div>

      <div className='mt-24 mb-24'>设置数据的存储路径：</div>
      {devData && <Input defaultValue={devData} className='mb-24' />}
      {logData && (
        <>
          <div className='flex align-items-center justify-content-between mr-24'>
            <div className=''>日志：</div>
            <div className='flex align-items-center'>
              <div className='size mr-12'>
                日志容量 <em>{(logData.reduce((acc, item) => acc + item.size, 0) / 1024).toFixed(1)} KB</em>
              </div>
              <Button loading={clLoading} onClick={clRun}>
                清除日志
              </Button>
            </div>
          </div>
          <div className='mt-10'>
            {logData.map((log, index) => (
              <div key={index}>
                <Input defaultValue={log.path} disabled className='mb-24' />
                <div className='bg-black radius-4 c-8e9aba'>
                  <div className='h-400 overflow-y-scroll overflow-x-overlay'>
                    {log.lines.map((it, key) => (
                      <div className='ml-12' key={key}>
                        {it}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SettingsDevelopers;
