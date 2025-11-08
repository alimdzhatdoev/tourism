import React from 'react';
import cn from 'classnames';
import { Skeleton } from '@mui/material';

interface Props {
  className?: string;
  rowsNumber?: number;
  rowHeight?: number;
}

export const TablePreloader: React.FC<Props> = ({
  className,
  rowsNumber = 5,
  rowHeight = 60,
}) => {
  const rowsIterator = Array.from('r'.repeat(rowsNumber));

  return (
    <div className={className}>
      {rowsIterator.map((r, i) => (
        <Skeleton
          animation="wave"
          key={r + i.toString()}
          sx={{ bgcolor: '#4A4D55', width: '100%' }}
          variant="rounded"
          height={rowHeight}
          className={cn({ 'mt-2': i !== 0 })}
        />
      ))}
    </div>
  );
};
