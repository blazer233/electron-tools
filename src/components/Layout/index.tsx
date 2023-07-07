import Sidebar from '../Sidebar';
import { layoutStore } from '@/stores/layout';
import { FC } from 'react';
import { useRecoilValue } from 'recoil';
import { Breadcrumb } from 'tdesign-react';

const Layout: FC<{ children: React.ReactNode }> = ({ children }) => {
  const { breadcrumbs } = useRecoilValue(layoutStore);

  return (
    <div className='w-100p flex' style={{ height: 'calc(100% - 25px)' }}>
      <Sidebar />
      <div className='w-300c bg-36393f overflow-y-auto'>
        <div className='p-24 border-bottom-2 font-bold flex align-items-center'>
          <Breadcrumb options={breadcrumbs.map((content) => ({ content }))} />
        </div>
        <div className='p-24'>{children}</div>
      </div>
    </div>
  );
};

export default Layout;