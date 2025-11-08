import React from 'react';

export const ReadIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({
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
        d="M10.4501 12.7731L11.2001 13.5612L17.825 6.59998L18.7 7.51938L11.2001 15.4L9.55341 13.6698L10.4501 12.7731Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.79998 13.5612L4.175 10.803L3.3 11.7224L6.79998 15.4L14.2999 7.51938L13.4249 6.59998L6.79998 13.5612Z"
        fill={color}
      />
    </svg>
  );
};
