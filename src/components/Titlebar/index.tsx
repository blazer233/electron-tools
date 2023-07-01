import { configStore } from '@/stores/config';
import { AppControlAction } from '@app/modules/general';
import { FC } from 'react';
import { useRecoilValue } from 'recoil';
import { IconFont } from 'tdesign-icons-react';
import { Button } from 'tdesign-react';

const btns = [
  { name: 'code', exc: 'devtools' },
  { name: 'remove', exc: 'minimize' },
  { name: 'laptop', exc: 'maximize' },
  { name: 'close-rectangle', exc: 'close' },
];
const Titlebar: FC = () => {
  const {
    general: { developerMode },
  } = useRecoilValue(configStore);
  const appControl = (action: AppControlAction) => window.electron.appControl(action);
  return (
    <div className='flex justify-content-end w-100p h-30 drag'>
      {(developerMode ? btns : btns.slice(1)).map((i, idx) => (
        <div onClick={appControl.bind(null, i.exc as any)} key={idx}>
          <Button icon={<IconFont name={i.name} />} variant='text' className='mr-10 c-white control-btn' size='small' />
        </div>
      ))}
    </div>
  );
};

export default Titlebar;
