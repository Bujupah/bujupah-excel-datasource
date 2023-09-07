import { Label } from '@grafana/ui';
import React, { FC, ReactNode } from 'react';

interface Props {
  title: any;
  description?: string;
  show?: boolean;
  children: ReactNode;
}

const HeaderSection: FC<Props> = ({ show = true, title, description, children }) => {
  return !show ? (
    <></>
  ) : (
    <div style={{ maxWidth: '600px' }}>
      <div className="gf-form-group" style={{ minWidth: '100%' }}>
        <Label description={description}>
          <h4>{title}</h4>
        </Label>
        {children}
      </div>
    </div>
  );
};

export default HeaderSection;
