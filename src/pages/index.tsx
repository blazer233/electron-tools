import { useBreadcrumbs } from '@/hooks/useBreadcrumbs';
import { FC } from 'react';

const Index: FC = () => {
  useBreadcrumbs(['导航栏', '首页']);
  return <div>首页内容</div>;
};

export default Index;
