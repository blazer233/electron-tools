import { layoutStore } from '@/stores/layout';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';


export const useBreadcrumbs = (breadcrumbs: string[]) => {
  const [layout, setLayout] = useRecoilState(layoutStore);
  useEffect(() => {
    if (breadcrumbs.length) {
      setLayout({ ...layout, breadcrumbs })
    }
  }, breadcrumbs);
}

