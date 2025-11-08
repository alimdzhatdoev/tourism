import React from 'react';
import { asx } from '@app/utils/sx';
import { LinearProgress, LinearProgressProps } from '@mui/material';

export const LoadingProgress: React.FC<
  LinearProgressProps & { show?: boolean }
> = ({ sx, show = false, ...props }) => {
  return show ? (
    <LinearProgress
      sx={[
        {
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '7px',
        },
        ...asx(sx),
      ]}
      {...props}
    />
  ) : null;
};
