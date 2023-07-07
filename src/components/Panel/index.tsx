import React, { ReactNode } from 'react';
import { Loading } from 'tdesign-react';

export const PanelContent: React.FC<{
  loading: any;
  size?: string;
  errorNode?: string | ReactNode;
  error?: any;
  children?: any;
  className?: string;
  errcode?: string;
  content?: ReactNode;
  style?: IParamObject;
  btnPath?: string;
  loadingConfig?: IParamObject;
}> = ({ loading, error, children, className, errorNode, content, style, loadingConfig = {} }) => {
  const result = error ? errorNode : content || children;
  return (
    <div
      className={`${className} ${loading ? 'text-center' : ''} ${
        error && errorNode ? 'flex justify-content-center align-items-center' : ''
      }`}
      style={style}
    >
      {loading ? <Loading text='加载中...' loading className='mt-30 mb-30' {...loadingConfig} /> : result}
    </div>
  );
};
