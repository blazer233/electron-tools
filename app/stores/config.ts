import Store from 'electron-store';

export interface ConfigStoreValues {
  developerMode: boolean;
  downloadaddress: string
}
export const configStore = new Store<ConfigStoreValues>({
  name: 'config',
  accessPropertiesByDotNotation: false,
  defaults: {
    developerMode: false,
    downloadaddress: '',
  },
});

