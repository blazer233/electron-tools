import RenderApp from './pages/main';
import './styles/atom.css';
import './styles/index.css';
import { ElectronRendererContext } from '@app/types/preload';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
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
    <BrowserRouter basename={''}>
      <RenderApp />
    </BrowserRouter>
  </RecoilRoot>,
);
