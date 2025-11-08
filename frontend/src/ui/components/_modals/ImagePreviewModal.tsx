import {FC} from 'react'
import {Box} from '@mui/material'
import {ModalContent, ModalContentProps} from '../Modal'

export interface ImagePreviewModalProps extends ModalContentProps {
  src: string
}

export const ImagePreviewModal: FC<ImagePreviewModalProps> = ({
  src,
  onClose,
  ...props
}) => {
  return (
    <ModalContent
      sx={{padding: 0, borderRadius: 0}}
      headerSx={{display: 'none'}}
      maxWidth={678}
      onClose={onClose}
      width='600px'
      {...props}
    >
      <Box component='img' src={src} sx={{width: '100%', maxHeight: '600px'}} />
    </ModalContent>
  )
}
