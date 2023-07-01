import SaveButton from '@/components/SaveButton';
import Section from '@/components/Section';
import UpdateStatus from '@/components/UpdateStatus';
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
      <Section
        title='开发者模式设置'
        description={
          <div>
            设置是否启用开发者模式。
            <br />
            启用“开发人员”模式后，将启用开发人员工具。
          </div>
        }
      >
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
      </Section>

      <Section
        title='应用程序版本'
        description={
          <div>
            您可以查看当前的应用程序版本.
            <br />
            您可以通过以下链接查看更改.
            <br />
            <div className='spacing' />
            <a
              href='https://github.com/2skydev/electron-vite-react-ts-template/releases'
              target='_blank'
              rel='noreferrer'
            >
              github
            </a>
          </div>
        }
      >
        <UpdateStatus version={version} status={status} />
      </Section>

      <SaveButton defaultValues={config.general} form={form} />
    </div>
  );
};

export default Settings;
