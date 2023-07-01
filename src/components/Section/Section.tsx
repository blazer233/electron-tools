import { SectionStyled } from './styled';
import clsx from 'clsx';
import { ReactNode } from 'react';

export interface SectionProps {
  className?: string;
  children?: ReactNode;
  title: string;
  description?: ReactNode;
}

const Section = ({ className, children, title, description }: SectionProps) => {
  return (
    <SectionStyled className={clsx('Section', className)}>
      <div className='left'>
        <h3 className='title'>{title}</h3>

        {description && <div className='description'>{description}</div>}
      </div>

      <div className='content'>{children}</div>
    </SectionStyled>
  );
};

export default Section;
