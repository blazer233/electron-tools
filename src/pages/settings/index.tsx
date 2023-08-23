import SaveButton from '@/components/SaveButton';
// import UpdateStatus from '@/components/UpdateStatus';
import { useBreadcrumbs } from '@/hooks/useBreadcrumbs';
import { useCustomForm } from '@/hooks/useCustomForm';
import { configStore } from '@/stores/config';
import { updateStore } from '@/stores/update';
import { Controller } from 'react-hook-form';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Switch } from 'tdesign-react';

const Settings = () => {
  useBreadcrumbs(['设置', '系统设置']);
  const [config, setConfig] = useRecoilState(configStore);
  const { version, status } = useRecoilValue(updateStore);
  const form = useCustomForm({
    defaultValues: config.general,
    onSubmit: (values) => {
      setConfig({
        ...config,
        general: values,
      });
    },
  });

  return (
    <div>
      <div className=''>设置是否启用开发者模式。</div>
      <Controller
        name='developerMode'
        control={form.control}
        render={({ field }) => (
          <Switch
            defaultValue={field.value}
            onChange={(checked) => field.onChange(checked)}
            label={[<i className='bx bx-code-alt' />, <i className='bx bx-x' />]}
          />
        )}
      />
      <div className=''>应用程序版本</div>
      <div className=''>您可以查看当前的应用程序版本</div>
      <div className=''>您可以通过以下链接查看更改</div>
      <div className=''>https://github.com/blazer233/https://github.com/blazer233/electron-tools</div>
      {/* <UpdateStatus version={version} status={status} /> */}

      <SaveButton defaultValues={config.general} form={form} />
    </div>
  );
};

export default Settings;
