import React from 'react';

type ArrowIconProps = {
  direction?: 'bottom' | 'top' | 'left' | 'right';
} & React.SVGProps<SVGSVGElement>;

export const ArrowOutlinedIcon: React.FC<ArrowIconProps> = ({
  direction = 'left',
  color = '#191B21',
  ...props
}) => {
  const getDirection = () => {
    switch (direction) {
      case 'left':
        return '';
      case 'top':
        return 'rotate(90deg)';
      case 'right':
        return 'rotate(180deg)';
      default:
        return 'rotate(-90deg)';
    }
  };

  return (
    <svg
      style={{ transform: getDirection(), transition: '400ms all' }}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M16 20L7 12L16 4"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
