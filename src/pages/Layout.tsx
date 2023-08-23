import Titlebar from '@/components/Titlebar';
import { devMenus, mainMenus } from '@/config';
import { configStore } from '@/stores/config';
import { updateStore } from '@/stores/update';
import { useMount } from 'ahooks';
import React, { createElement, Suspense, FC } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { IconFont } from 'tdesign-icons-react';
import { Layout, Menu, Loading } from 'tdesign-react';

export const loadingFunc = <Loading size='large' className='fixed t-50p l-50p' />;

const routerMap = [
  {
    path: '/',
    element: React.lazy(() => import('@/pages/youtube/index')) as unknown as React.ReactNode,
  },
  {
    path: '/youtube',
    element: React.lazy(() => import('@/pages/youtube/index')) as unknown as React.ReactNode,
  },
  {
    path: '/settings',
    element: React.lazy(() => import('@/pages/settings/index')) as unknown as React.ReactNode,
  },
  {
    path: '/developers',
    element: React.lazy(() => import('@/pages/settings/developers')) as unknown as React.ReactNode,
  },
];
const { Content, Footer, Aside } = Layout;
const { MenuItem } = Menu;
const AppInner = () => {
  const [update, setUpdate] = useRecoilState(updateStore);
  const config = useRecoilValue(configStore);

  const bootstrap = async () => {
    window.electron.onUpdate((event, data) => {
      setUpdate({
        ...update,
        status: {
          event,
          data,
          time: new Date().getTime(),
        },
      });
    });

    window.electron.initlizeUpdater();
  };
  useMount(bootstrap);

  return (
    <React.Fragment>
      <Titlebar />
      <Layout className='w-100p h-100p' style={{ minHeight: '770px' }}>
        <Aside width='180px'>
          <Menu style={{ width: '100%', height: '100%', boxShadow: 'none' }}>
            {(config.general.developerMode ? mainMenus.concat(devMenus) : mainMenus).map((i, idx) => (
              <MenuItem key={idx} value={i.text} icon={<IconFont name={i.icon} size='small' />} href={i.link}>
                {i.text}
              </MenuItem>
            ))}
          </Menu>
        </Aside>
        <Layout>
          <Content>
            <Suspense fallback={loadingFunc}>
              <Routes>
                {routerMap.map((i, idx) => (
                  <Route
                    key={idx}
                    path={i.path}
                    element={<div className='pl-12 mt-12'>{createElement(i.element as unknown as FC<{}>)}</div>}
                  />
                ))}
              </Routes>
            </Suspense>
          </Content>
          <Footer>One Thing</Footer>
        </Layout>
      </Layout>
    </React.Fragment>
  );
};

export default AppInner;
