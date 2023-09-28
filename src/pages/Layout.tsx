import Titlebar from '@/components/Titlebar';
import { devMenus, mainMenus } from '@/config';
import { useAllStore } from '@/stores';
import { useMount } from 'ahooks';
import React, { createElement, Suspense, FC } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { IconFont } from 'tdesign-icons-react';
import { Layout, Menu, Loading } from 'tdesign-react';

const { Aside } = Layout;
const { MenuItem } = Menu;
export const loadingFunc = <Loading size='large' className='fixed t-50p l-50p' />;

export const routerMapTemp = [
  {
    path: '/',
    element: React.lazy(() => import('@/pages/youtube/index')) as unknown as React.ReactNode,
  },
  {
    path: '/youtube',
    element: React.lazy(() => import('@/pages/youtube/index')) as unknown as React.ReactNode,
  },
  {
    path: '/search',
    element: React.lazy(() => import('@/pages/search/index')) as unknown as React.ReactNode,
  },
  {
    path: '/setting',
    element: React.lazy(() => import('@/pages/settings/index')) as unknown as React.ReactNode,
  },
  {
    path: '/developer',
    element: React.lazy(() => import('@/pages/develop/index')) as unknown as React.ReactNode,
  },
];
const AppInner = () => {
  const { setStatus, config } = useAllStore();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { Content } = Layout;
  const bootstrap = async () => {
    window.electron.onUpdate((event, data) => {
      setStatus({ event, data, time: new Date().getTime() });
    });
    window.electron.initlizeUpdater();
  };
  useMount(bootstrap);
  const allMenu = config?.developerMode ? mainMenus.concat(devMenus) : mainMenus;
  return (
    <React.Fragment>
      <Titlebar />
      <Layout className='w-100p h-100vh flex-row flex'>
        <div className='h-100p z-index-100'>
          <Menu className={`border-right-2 h-100p`} width='200px'>
            {allMenu.map((i, idx) => (
              <MenuItem
                key={idx}
                value={i.text}
                icon={<IconFont name={i.icon} size='small' className='mt-6' />}
                onClick={() => navigate(i.link)}
              >
                {i.text}
              </MenuItem>
            ))}
          </Menu>
        </div>
        <Layout className='flex-1 overflow-y-auto'>
          <Content>
            <div className='mt-30 font-bold pl-24 pb-12 border-bottom-2-dfe2eb'>
              {(allMenu.find((i) => i.link === pathname) || {}).text || ''}
            </div>
            <Suspense fallback={loadingFunc}>
              <Routes>
                {routerMapTemp.map((i, idx) => (
                  <Route
                    key={idx}
                    path={i.path}
                    element={
                      <div className=' m-24 overflow-y-scroll scrollbar-router'>
                        {createElement(i.element as unknown as FC<{}>)}
                      </div>
                    }
                  />
                ))}
              </Routes>
            </Suspense>
          </Content>
        </Layout>
      </Layout>
    </React.Fragment>
  );
};

export default AppInner;