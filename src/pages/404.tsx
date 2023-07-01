import { useBreadcrumbs } from '@/hooks/useBreadcrumbs';
import { FC } from 'react';

const NotFound: FC = () => {
  useBreadcrumbs(['404页面']);

  return <div className=''>404</div>;
};

export default NotFound;
