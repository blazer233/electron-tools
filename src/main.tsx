import RenderApp from './pages/Layout';
import './styles/atom.css';
import './styles/index.css';
import storeRootArr, { reduceProvider } from '@/stores/index';
import { ElectronRendererContext } from '@app/types/preload';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { Loading } from 'tdesign-react';
import 'tdesign-react/es/style/index.css';

dayjs.extend(relativeTime);

declare global {
  interface Window {
    electron: ElectronRendererContext;
  }
}

const Provider = reduceProvider(storeRootArr);

const App = () => (
  <Provider>
    <Suspense fallback={<Loading size='large' className='fixed t-50p l-50p' />}>
      <HashRouter>
        <RenderApp />
      </HashRouter>
    </Suspense>
  </Provider>
);

createRoot(document.getElementById('app') as HTMLElement).render(<App />);
