import RenderApp from './pages/Layout';
import './styles/atom.css';
import './styles/index.css';
import storeRootArr, { reduceProvider } from '@/stores/index';
import { ElectronRendererContext } from '@app/types/preload';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
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
    <BrowserRouter basename={''}>
      <RenderApp />
    </BrowserRouter>
  </Provider>
);

createRoot(document.getElementById('app') as HTMLElement).render(<App />);
