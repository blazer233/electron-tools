import Layout from '@/components/Layout/index';
import Titlebar from '@/components/Titlebar';
import { updateStore } from '@/stores/update';
import { colors, sizes } from '@/styles/themes';
import { useMount } from 'ahooks';
import { useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { ThemeProvider } from 'styled-components';

type Sizes = typeof sizes;
type Colors = typeof colors;

declare module 'styled-components' {
  export interface DefaultTheme {
    sizes: Sizes;
    colors: Colors;
  }
}

const AppInner = () => {
  const [update, setUpdate] = useRecoilState(updateStore);

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

  const styledTheme = useMemo(
    () => ({
      sizes: sizes,
      colors: colors,
    }),
    [],
  );
  useMount(bootstrap);

  return (
    <ThemeProvider theme={styledTheme}>
      <div id='app'>
        <Titlebar />
        <Layout>
          <Outlet />
        </Layout>
      </div>
    </ThemeProvider>
  );
};

export default AppInner;
