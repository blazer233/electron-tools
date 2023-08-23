import { UseCustomUseFormReturn } from '@/hooks/useCustomForm';
import clsx from 'clsx';
import deepEqual from 'fast-deep-equal';
import { ReactNode, useEffect, useState, Fragment } from 'react';
import { useWatch } from 'react-hook-form';
import { Button, Space } from 'tdesign-react';

export interface SaveButtonProps {
  form: UseCustomUseFormReturn<any, any>;
  defaultValues: any;
  className?: string;
  confirmText?: ReactNode;
  useConfirm?: boolean;
}

let timeoutHandle: NodeJS.Timeout;

const SaveButton = ({ form, className, defaultValues, confirmText, useConfirm = false }: SaveButtonProps) => {
  const [invalid, setInvalid] = useState(false);
  const [loading, setLoading] = useState(false);

  const values = useWatch({
    control: form.control,
  });

  const isEqual = deepEqual(defaultValues, values);

  const handleSave = async () => {
    setLoading(true);

    const valid = await form.submit();

    if (!valid) {
      setInvalid(true);
    }

    setLoading(false);
  };

  useEffect(() => {
    clearTimeout(timeoutHandle);

    if (invalid) {
      timeoutHandle = setTimeout(() => {
        setInvalid(false);
      }, 1000);
    }
  }, [invalid]);

  return (
    <Fragment>
      {!isEqual && (
        <div className={clsx('SaveButton', className, { invalid })} key='SaveButton'>
          <span>有未保存的更改！</span>
          <Space>
            <Button variant='outline' disabled={loading} onClick={() => form.reset(defaultValues)}>
              还原
            </Button>
            <Button loading={loading} onClick={useConfirm ? undefined : handleSave}>
              保存更改
            </Button>
          </Space>
        </div>
      )}
    </Fragment>
  );
};

export default SaveButton;
