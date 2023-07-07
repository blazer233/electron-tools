import Store from 'electron-store';


export const controlKey = new Store<{ [key: string]: any }>({
  name: 'key',
  accessPropertiesByDotNotation: false,
  defaults: {},
});
