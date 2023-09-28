import { PanelContent } from '@/components/Panel';
import { useAllStore } from '@/stores';
import { useMount, useRequest } from 'ahooks';
import dayjs from 'dayjs';
import { FC, Key, useState } from 'react';
import { IconFont } from 'tdesign-icons-react';
import { Button, Input, Form, MessagePlugin, Table, Progress, Dialog, Tabs, Drawer } from 'tdesign-react';


const columConfig: IParamObject[] = [
  { colKey: 'row-select', type: 'multiple', ellipsis: true, width: 20 },
  { colKey: 'title', title: '名称', ellipsis: true, width: 300 },
  {
    colKey: 'publishTime',
    title: '发布时间',
    ellipsis: true,
    width: 100,
    cell: (prop: IParamObject) => dayjs(prop.row[prop.col.colKey]).format('YYYY/MM/DD'),
  },
];
const KEY = '';
const Index: FC = () => {
  const [percentData, setPercent] = useState<IParamObject>({});
  const [drawerItem, setDrawer] = useState<IParamObject>({});
  const [videoDataList, setVideo] = useState<any>({});
  const [choose, setChoose] = useState<IParamObject>({});
  const { config } = useAllStore();
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
  console.log(videoDataList, 42442);
  return (
    <div className='relative'>
      <IconFont
        title='打开文件'
        name='folder-open'
        size='16px'
        className='absolute t-16 l-216 z-index-1 cursor-pointer'
        onClick={() => window.electron.openPath(config.downloadaddress)}
      />
      <Tabs
        style={{ backgroundColor: 'inherit' }}
        list={[
          {
            label: '单视频下载',
            value: 1,
            panel: (
              <div className='mt-60 flex justify-content-center align-items-center'>
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
                    <Button content='下载视频' type='submit' className='ml-12 max-w-unset' loading={lLoading} />
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
                    <Input placeholder='请输入视频list值' clearable />
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
                        content={`点击下载`}
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
                    <div className='font-10 c-000000 opacity-0d6'>
                      {Object.values(choose)?.flat()?.length
                        ? `您已选择 ${Object.values(choose)?.flat()?.length} 个视频`
                        : '请选择下载视频'}
                    </div>
                    {Object.keys(videoDataList)?.map((i, index) => (
                      <div
                        className='m-24 cursor-pointer'
                        key={index}
                        onClick={setDrawer.bind(null, { ...videoDataList[i], listKey: i })}
                      >
                        <div className='flex align-items-center'>
                          <div className='w-6 h-6 radius-50p mr-10 bg-007934'></div>
                          <div className={`${drawerItem.listKey === i ? 'c-crmblue' : ''}`}>
                            {videoDataList[i].title}
                          </div>
                        </div>
                      </div>
                    ))}
                  </PanelContent>
                </div>
              </div>
            ),
          },
        ]}
      />

      <Drawer
        size='medium'
        header={drawerItem.title}
        onClose={setDrawer.bind(null, {})}
        onConfirm={setDrawer.bind(null, {})}
        visible={!!Object.keys(drawerItem).length}
      >
        <Table
          rowKey='title'
          data={drawerItem.list || []}
          cellEmptyContent='-'
          columns={columConfig}
          selectOnRowClick={true}
          onSelectChange={(_, { selectedRowData }) =>
            setChoose({ ...choose, [drawerItem.listKey]: selectedRowData.map((i) => i.url) })
          }
          pagination={{
            size: 'small',
            showPageSize: false,
            defaultCurrent: 1,
            defaultPageSize: 10,
            total: drawerItem.list?.length,
          }}
        />
      </Drawer>
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
    </div>
  );
};

export default Index;
//TLPQMDcwNzIwMjOoZ5LjzdyotA
//PLkPiliVZbbDoav9AIzFo1jpNROSOrp_tq
//PLD3Z2ZDIjSUaRy3lVstVAdXvbM8I-8Z3Z