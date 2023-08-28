import { createContext, createElement, useContext } from 'react';

export const createContainer = (useHook: Function) => {
  const Context = createContext(null);
  const Provider = ({ children }: { children: React.ReactNode }) => {
    return createElement(Context.Provider, { value: useHook() as any }, children);
  };
  const useContainer = () => useContext(Context);
  return { Provider, useContainer };
};
