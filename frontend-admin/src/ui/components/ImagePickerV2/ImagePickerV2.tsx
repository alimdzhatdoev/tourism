import React, { FC, ReactNode, useCallback, useState } from 'react';
import {
  Box,
  BoxProps,
  CircularProgress,
  Fade,
  Typography,
} from '@mui/material';
import { useDropzone, DropzoneProps } from 'react-dropzone';
import { CloudUpload } from '@mui/icons-material';
import { asx } from '@app/utils/sx';

interface ImagePickerV2Props extends DropzoneProps {
  imagePreview?: string | null;
  boxProps?: BoxProps;
  disablePreview?: boolean;
  isUploading?: boolean;
  label?: ReactNode;
  sx?: BoxProps['sx'];
}

export const ImagePickerV2: FC<ImagePickerV2Props> = ({
  imagePreview: propsImage = null,
  disablePreview = false,
  isUploading = false,
  boxProps,
  multiple = false,
  onDrop,
  label = 'Картинка',
  accept,
  sx,
  ...dropZoneProps
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(propsImage);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleOnDrop = useCallback<NonNullable<DropzoneProps['onDrop']>>(
    async (...args) => {
      const [file] = args[0];
      if (!disablePreview) {
        setImagePreview(URL.createObjectURL(file));
      }
      onDrop?.(...args);
    },
    [disablePreview, onDrop],
  );

  const { getRootProps, getInputProps } = useDropzone({
    ...dropZoneProps,
    onDrop: handleOnDrop,
    accept: accept
      ? accept
      : {
          'image/svg+xml': ['.svg'],
          'image/png': ['.jpeg', '.jpg', '.png'],
        },
    multiple,
  });

  return (
    <Box
      sx={[
        { display: 'flex', flexDirection: 'column', alignItems: 'center' },
        ...asx(sx),
      ]}
    >
      {typeof label === 'string' ? (
        <Typography sx={{ fontSize: '14px' }}>{label}</Typography>
      ) : (
        label
      )}
      <Box
        {...boxProps}
        onMouseOver={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={[
          {
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            cursor: 'pointer',
            height: '150px',
            aspectRatio: '1',
            borderRadius: '10px',
          },
          ...asx(boxProps?.sx),
        ]}
        {...getRootProps()}
        title={boxProps?.title ? boxProps.title : 'Загрузить изображение'}
      >
        <input {...getInputProps()} />
        {imagePreview ? (
          <Box
            component="img"
            style={{
              height: '150px',
              width: '150px',
              borderRadius: '10px',
              objectFit: 'cover',
              padding: '10px',
            }}
            src={imagePreview}
            alt="icon"
          />
        ) : null}
        {isUploading ? (
          <CircularProgress
            sx={{
              position: 'absolute',
              margin: 'auto',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              width: '50%',
              height: '50%',
            }}
          />
        ) : (
          <Fade in={isHovered || !imagePreview}>
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                padding: '7px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'stretch',
                borderRadius: '10px',
                '& Svg': {
                  fontSize: '35px',
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                  borderRadius: '10px',
                  borderStyle: 'dashed',
                }}
              >
                <CloudUpload />
                {imagePreview ? 'Изменить' : 'Загрузить'}
              </Box>
            </Box>
          </Fade>
        )}
      </Box>
    </Box>
  );
};
