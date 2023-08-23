import { PanelContent } from '@/components/Panel';
import { useMount, useRequest } from 'ahooks';
import dayjs from 'dayjs';
import { FC, Key, useState } from 'react';
import { Button, Input, Form, MessagePlugin, Checkbox, Progress, Dialog, Tabs, Collapse } from 'tdesign-react';

const KEY = '';
const Index: FC = () => {
  const [percentData, setPercent] = useState<IParamObject>({});
  const [videoDataList, setVideo] = useState<any>({});
  const [choose, setChoose] = useState<IParamObject>({});
  const { Panel } = Collapse;
  window.electron.operateVideoLoad(setPercent);
  const { run: delRun, loading: delLoading } = useRequest(window.electron.operateVideoDel, {
    manual: true,
    onSuccess: setVideo.bind(null, []),
  });
  const { run: lRun, loading: lLoading } = useRequest(window.electron.operateVideoDownLoad, {
    manual: true,
    onSuccess: (res = []) => MessagePlugin.success(`${res.join('\n')}已下载成功`),
  });
  const { run, loading } = useRequest(window.electron.operateVideoList, {
    manual: true,
    onSuccess: (data, params) => {
      const [param] = params;
      if (videoDataList[param.playlistId]) {
        MessagePlugin.error('该系列视频已存在');
        return;
      }
      setVideo({ ...(Object.keys(param).length && videoDataList), ...data });
    },
  });
  const onSubmit = (e: any) => {
    if (e.validateResult !== true) {
      MessagePlugin.error('完成信息');
      return;
    }
    e.fields.videoId ? lRun([e.fields.videoId]) : run(e.fields);
  };
  useMount(run.bind(null, {}));
  return (
    <>
      <Tabs
        style={{ backgroundColor: 'inherit' }}
        list={[
          {
            label: '单视频下载',
            value: 1,
            panel: (
              <div className='mt-60 flex justify-content-center'>
                <Form layout='inline' onSubmit={onSubmit}>
                  <Form.FormItem name='videoId' rules={[{ required: true, type: 'warning' }]} className='w-300'>
                    <Input placeholder='请输入视频URL' clearable />
                  </Form.FormItem>
                  {!Object.keys(videoDataList)?.length && (
                    <Form.FormItem
                      name='key'
                      rules={[{ required: true, type: 'warning' }]}
                      className='w-300'
                      initialData={KEY}
                    >
                      <Input placeholder='请输入KEY' clearable />
                    </Form.FormItem>
                  )}
                  <Form.FormItem>
                    <Button content='下载视频' type='submit' className='ml-12' loading={lLoading} />
                  </Form.FormItem>
                </Form>
              </div>
            ),
          },
          {
            label: '专辑视频下载',
            value: 2,
            panel: (
              <div className='mt-12'>
                <Form layout='inline' onSubmit={onSubmit}>
                  <Form.FormItem name='playlistId' rules={[{ required: true, type: 'warning' }]} className='w-300'>
                    <Input placeholder='请输入视频URL' clearable />
                  </Form.FormItem>
                  {!Object.keys(videoDataList)?.length && (
                    <Form.FormItem
                      name='key'
                      rules={[{ required: true, type: 'warning' }]}
                      className='w-300'
                      initialData={KEY}
                    >
                      <Input placeholder='请输入KEY' clearable />
                    </Form.FormItem>
                  )}
                  <Form.FormItem>
                    <Button type='submit' content='获取视频列表' />
                    {Object.keys(videoDataList)?.length && Object.values(choose)?.flat()?.length && (
                      <Button
                        content='下载视频'
                        className='ml-12'
                        onClick={lRun.bind(null, Object.values(choose).flat())}
                        loading={lLoading}
                      />
                    )}
                    <Button content='初始化' className='ml-12' onClick={delRun} loading={delLoading} />
                  </Form.FormItem>
                </Form>
                <div className='mt-20 '>
                  <PanelContent loading={loading}>
                    <Collapse expandOnRowClick borderless className='bg-transparent '>
                      {Object.keys(videoDataList)?.map((i, index) => (
                        <Panel
                          key={index}
                          className='mb-12 bg-transparent '
                          header={
                            <div className='flex align-items-center ' title={videoDataList[i].description}>
                              <div className='w-6 h-6 radius-50p mr-10'></div>
                              <div className='at-ellipsis-lines'>
                                {videoDataList[i].title} (List：{i})
                              </div>
                            </div>
                          }
                        >
                          <div className='mt-12 flex flex-column pl-12'>
                            {videoDataList[i]?.list?.length ? (
                              <Checkbox.Group
                                value={choose[i]}
                                className='checkbox-b'
                                onChange={(v) => {
                                  choose[i] = v;
                                  console.log(choose);
                                  setChoose(JSON.parse(JSON.stringify(choose)));
                                }}
                                options={
                                  [
                                    {
                                      label: <div className='ml-21 '>全选</div>,
                                      checkAll: true,
                                    },
                                  ].concat(
                                    videoDataList[i].list?.map((it: IParamObject, idx: Key) => ({
                                      value: it.url,
                                      label: (
                                        <div
                                          key={idx}
                                          className='w-100p  w-100p flex justify-content-between align-items-center mr-8'
                                        >
                                          <div className='flex-1 at-ellipsis-lines'>{it.title}</div>
                                          <div className=''>
                                            发布时间：{dayjs(it.publishTime).format('YYYY-MM-DD HH:mm')}
                                          </div>
                                        </div>
                                      ),
                                    })),
                                  ) as any
                                }
                              />
                            ) : (
                              '获取失败'
                            )}
                          </div>
                        </Panel>
                      ))}
                    </Collapse>
                  </PanelContent>
                </div>
              </div>
            ),
          },
        ]}
      />
      <Dialog
        theme='success'
        header='正在下载，请勿关闭'
        cancelBtn={false}
        closeBtn={false}
        confirmBtn={false}
        visible={lLoading}
        body={
          <PanelContent className='mt-12 mb-12' loading={!Object.keys(percentData).length}>
            <div className='at-ellipsis-lines'>名称: {percentData.title}</div>
            <div className='at-ellipsis-lines'>
              进度: {percentData.index + 1}/{percentData.action?.length}
            </div>
            <div className='at-ellipsis-lines'>花费时间: {percentData.spend} min</div>
            <div className='at-ellipsis-lines'>剩余时间: {percentData.estimated} min</div>
            <div className='at-ellipsis-lines'>全部大小: {percentData.content} MB</div>
            <div className='at-ellipsis-lines'>已下载: {percentData.downloaded} MB</div>
            <Progress theme='plump' percentage={percentData.percent || 0} className='mt-10' />
          </PanelContent>
        }
      />
    </>
  );
};

export default Index;
//TLPQMDcwNzIwMjOoZ5LjzdyotA
//PLkPiliVZbbDoav9AIzFo1jpNROSOrp_tq
//PLD3Z2ZDIjSUaRy3lVstVAdXvbM8I-8Z3Z
