import { atom, AtomEffect } from 'recoil';

import { ConfigStoreValues } from '@app/stores/config';

const appStoreSyncEffect: AtomEffect<ConfigStoreValues> = ({ onSet }) => {
  onSet(newValue => {
    console.log(newValue, 4242)
    window.electron.setConfig(newValue);
  });
};

export const configStore = atom<ConfigStoreValues>({
  key: 'config',
  default: window.electron.getConfig(),
  effects: [appStoreSyncEffect],
});
