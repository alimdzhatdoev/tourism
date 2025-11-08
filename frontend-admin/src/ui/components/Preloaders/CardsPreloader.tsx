import { Skeleton } from '@mui/material';
import React, { memo } from 'react';

interface Props {
  className?: string;
  cardsCount?: number;
  cardWidth?: number;
  cardHeight?: number;
}

export const CardsPreloader: React.FC<Props> = memo(
  ({ className, cardsCount = 3, cardHeight = 384, cardWidth = 288 }) => {
    const cardsIterator = Array.from('c'.repeat(cardsCount));

    return (
      <div className={className}>
        {cardsIterator.map((c, i) => (
          <Skeleton
            key={c + i.toString()}
            animation="wave"
            variant="rounded"
            width={cardWidth}
            height={cardHeight}
          />
        ))}
      </div>
    );
  },
);
