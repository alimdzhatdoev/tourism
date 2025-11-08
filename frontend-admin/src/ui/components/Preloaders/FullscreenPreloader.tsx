import { Pending } from '@mui/icons-material';
import { Backdrop } from '@mui/material';
import React from 'react';

export const FullscreenPreloader: React.FC = () => {
  return (
    <Backdrop open>
      <div className="text-yellow_text text-6xl animate-ping">
        <Pending fontSize="inherit" color="inherit" />
      </div>
    </Backdrop>
  );
};
