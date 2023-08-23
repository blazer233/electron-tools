import { devMenus, mainMenus } from '@/config';
import { configStore } from '@/stores/config';
import React, { createElement, Suspense, FC } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { IconFont } from 'tdesign-icons-react';
import { Layout, Menu, Loading } from 'tdesign-react';

const { Content, Footer, Aside } = Layout;
const { MenuItem } = Menu;

export const loadingFunc = <Loading size='large' className='fixed t-50p l-50p' />;

const LayoutDef = () => {
  const config = useRecoilValue(configStore);
  const routerMap = [
    {
      path: '/',
      element: React.lazy(() => import('@/pages/index')) as unknown as React.ReactNode,
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
  return (
    <Layout className='w-100p h-100p'>
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
                <Route key={idx} path={i.path} element={createElement(i.element as unknown as FC<{}>)} />
              ))}
            </Routes>
          </Suspense>
        </Content>
        <Footer>One Thing</Footer>
      </Layout>
    </Layout>
  );
};

export default LayoutDef;
