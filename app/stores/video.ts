import Store from 'electron-store';


export const controlVideo = new Store<{ [key: string]: any }>({
  name: 'video',
  accessPropertiesByDotNotation: false,
  defaults: {},
});
