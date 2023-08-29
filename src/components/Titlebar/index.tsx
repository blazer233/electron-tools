import { useAllStore } from '@/stores';
import { AppControlAction } from '@app/modules/general';
import { FC } from 'react';
import { IconFont } from 'tdesign-icons-react';
import { Button } from 'tdesign-react';

const btns = [
  { name: 'code', exc: 'devtools' },
  { name: 'remove', exc: 'minimize' },
  { name: 'laptop', exc: 'maximize' },
  { name: 'close-rectangle', exc: 'close' },
];
const Titlebar: FC = () => {
  const { config } = useAllStore();
  const appControl = (action: AppControlAction) => window.electron.appControl(action);
  return (
    <div className='flex justify-content-end w-100p h-30 drag fixed t-0 '>
      {(config?.developerMode ? btns : btns.slice(1)).map((i, idx) => (
        <div onClick={appControl.bind(null, i.exc as any)} key={idx}>
          <Button
            icon={<IconFont name={i.name} />}
            variant='text'
            className='mr-10 control-btn z-index-1'
            size='small'
          />
        </div>
      ))}
    </div>
  );
};

export default Titlebar;