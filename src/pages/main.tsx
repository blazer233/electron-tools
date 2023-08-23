import Layout from '@/components/Layout/index';
import Titlebar from '@/components/Titlebar';
import { updateStore } from '@/stores/update';
import { colors, sizes } from '@/styles/themes';
import { useMount } from 'ahooks';
import { useMemo } from 'react';
import { useRecoilState } from 'recoil';

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
    <div id='app'>
      <Titlebar />
      <Layout />
    </div>
  );
};

export default AppInner;
