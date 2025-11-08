import React from 'react';

export const DeliveredIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({
  color = '#5191FA',
  ...props
}) => {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 13.5612L6.375 10.803L5.5 11.7224L9 15.4L16.5 7.51938L15.625 6.59998L9 13.5612Z"
        fill={color}
      />
    </svg>
  );
};
