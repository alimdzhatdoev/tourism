import React, { useEffect } from 'react';
import ReactSimpleImageViewer from 'react-simple-image-viewer';

type SimpleImageViewerProps = Parameters<typeof ReactSimpleImageViewer>[0];

export const ImageViewer: React.FC<SimpleImageViewerProps> = ({
  backgroundStyle = { backgroundColor: '#00000090' },
  closeOnClickOutside = true,
  disableScroll = true,
  ...props
}) => {
  useEffect(() => {
    if (props.currentIndex !== undefined)
      document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [props.currentIndex]);

  return (
    <ReactSimpleImageViewer
      backgroundStyle={backgroundStyle}
      disableScroll={disableScroll}
      closeOnClickOutside={closeOnClickOutside}
      {...props}
    />
  );
};
