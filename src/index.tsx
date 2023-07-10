import './styles/atom.css';
import './styles/index.css';
import FileSystemRoutes from '@/components/FileSystemRoutes';
import { ElectronRendererContext } from '@app/types/preload';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import 'tdesign-react/es/style/index.css';

dayjs.extend(relativeTime);

declare global {
  interface Window {
    electron: ElectronRendererContext;
  }
}

createRoot(document.getElementById('root') as HTMLElement).render(
  <RecoilRoot>
    <Suspense>
      <FileSystemRoutes />
    </Suspense>
  </RecoilRoot>,
);