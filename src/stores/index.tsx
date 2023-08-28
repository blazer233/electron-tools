import { createContainer } from './core';
import { useRequest } from 'ahooks';
import React from 'react';

// 状态管理
export interface ConfigStoreValues {
  general: {
    developerMode: boolean;
  };
}
export const UseConfig = createContainer(() => {
  const [config, setConfig] = React.useState<ConfigStoreValues>();
  useRequest(window.electron?.getConfig as any, { onSuccess: setConfig });
  useRequest(() => window.electron?.setConfig(config as any), { refreshDeps: [config], ready: !!config });
  return { config, setConfig };
});

// 状态管理
export const UseUpdate = createContainer(() => {
  const [version, setVersion] = React.useState();
  const [status, setStatus] = React.useState();
  useRequest(window.electron?.getVersion as any, { onSuccess: setVersion });
  useRequest(window.electron?.getUpdaterStatus as any, { onSuccess: setStatus });
  return { version, status, setVersion, setStatus };
});

export const reduceProvider =
  (commonFun: any[]) =>
  ({ children }: any) => {
    return commonFun?.reduceRight((child: any, { Provider }: any) => {
      return <Provider>{child}</Provider>;
    }, children);
  };

const combineContainers = (containers: any[]) => {
  return containers?.reduce((acc: any, cur: { useContainer: () => any }) => {
    const container = cur.useContainer();
    return { ...acc, ...container };
  }, {});
};

const arrRoot = [UseConfig, UseUpdate];

export const useAllStore = () => combineContainers(arrRoot);

export default arrRoot;
