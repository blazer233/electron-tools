import './styles/atom.css';
import './styles/index.css';
import FileSystemRoutes from '@/components/FileSystemRoutes';
import { ElectronRendererContext } from '@app/types/preload';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import { SWRConfig, SWRConfiguration } from 'swr';
import 'tdesign-react/es/style/index.css';

dayjs.extend(relativeTime);

declare global {
  interface Window {
    electron: ElectronRendererContext;
  }
}

const swrConfig: SWRConfiguration = {
  errorRetryCount: 2,
  errorRetryInterval: 500,
  revalidateOnFocus: false,
  revalidateIfStale: false,
};

createRoot(document.getElementById('root') as HTMLElement).render(
  <RecoilRoot>
    <SWRConfig value={swrConfig}>
      <Suspense>
        <FileSystemRoutes />
      </Suspense>
    </SWRConfig>
  </RecoilRoot>,
);
