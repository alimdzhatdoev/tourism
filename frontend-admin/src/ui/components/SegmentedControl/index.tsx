import cn from 'classnames';
import React, { memo, useCallback } from 'react';

type SegmentButton<T> = {
  value: T;
  title: string;
  segmentClassName?: string;
};

interface Props<T> {
  buttons: SegmentButton<T>[];
  onSegmentClick: (value: T) => void;
  activeSegment?: T;
  className?: string;
}

function SegmentedControlElement<T>({
  buttons,
  onSegmentClick,
  activeSegment,
  className,
}: Props<T>) {
  const handleSegmentClick = useCallback(
    (value: T) => {
      onSegmentClick(value);
    },
    [onSegmentClick],
  );

  return (
    <div
      className={cn(
        'flex bg-red rounded-lg w-full border border-main_grey h-[48px]',
        className,
      )}
    >
      {buttons.map(({ title, value, segmentClassName }) => (
        <div
          key={title}
          onClick={() => handleSegmentClick(value)}
          className={cn(
            'flex items-center justify-center px-7 py-1 rounded-lg cursor-pointer justify-items-stretch w-1/2 text-center transform duration-300 text-sm active:scale-[.98]',
            segmentClassName,
            {
              'bg-yellow_button': value === activeSegment,
            },
          )}
        >
          <span>{title}</span>
        </div>
      ))}
    </div>
  );
}

export const SegmentedControl = memo(
  SegmentedControlElement,
) as typeof SegmentedControlElement;
