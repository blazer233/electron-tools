import { useBreadcrumbs } from '@/hooks/useBreadcrumbs';
import { FC } from 'react';

const NotFound: FC = () => {
  useBreadcrumbs(['wallpaper']);

  return <div className=''>wallpaper</div>;
};

export default NotFound;
