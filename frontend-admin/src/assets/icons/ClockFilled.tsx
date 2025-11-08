import React from 'react';

export const ClockFilledIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({
  color = '#191B21',
  ...props
}) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.67 2H16.34C19.73 2 22 4.379 22 7.919V16.089C22 19.62 19.73 22 16.34 22H7.67C4.28 22 2 19.62 2 16.089V7.919C2 4.379 4.28 2 7.67 2ZM12.25 8.6333C12.25 8.21909 11.9142 7.8833 11.5 7.8833C11.0858 7.8833 10.75 8.21909 10.75 8.6333V12.9943C10.75 13.2584 10.8889 13.5031 11.1157 13.6384L14.5068 15.6614C14.8625 15.8736 15.3229 15.7573 15.5351 15.4016C15.7473 15.0458 15.631 14.5854 15.2753 14.3732L12.25 12.5684V8.6333Z"
        fill={color}
      />
    </svg>
  );
};
