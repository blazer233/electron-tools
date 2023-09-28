import { useRequest } from 'ahooks';
import { useEffect, useRef, useState } from 'react';
import { Loading, Input, Table } from 'tdesign-react';

const Search = () => {
  const [files, setFiles] = useState<IParamObject[]>([]);
  const { loading, run } = useRequest(window.electron.getFilesName, {
    onSuccess: setFiles,
    debounceWait: 1000,
    manual: true,
  });
  console.log(files);
  return (
    <div className='overflow-y-auto mr-24'>
      <div className='flex justify-content-between mb-24 align-items-center '>
        <Input
          placeholder='输入查询的文件名...'
          clearable
          onChange={run}
          suffix={loading ? <Loading size='small' /> : ''}
        />
      </div>
      <Table
        rowKey='path'
        loading={loading}
        data={files || []}
        cellEmptyContent='-'
        columns={[{ colKey: 'name', title: '名称', ellipsis: true }]}
        selectOnRowClick={true}
        pagination={{
          defaultCurrent: 1,
          defaultPageSize: 10,
          total: files?.length,
        }}
      />
    </div>
  );
};

export default Search;
