import {FC, forwardRef, ReactNode, useRef} from 'react'
import {
  Backdrop,
  Box,
  BoxProps,
  Fade,
  IconButton,
  IconButtonProps,
  Modal as MuiModal,
  ModalProps as MuiModalProps,
  Portal,
  Typography,
  TypographyProps,
} from '@mui/material'
import {asx, createStyles, mergeRefs, px} from '@/core/utils'
import {Close} from '@mui/icons-material'

interface ModalControllerProps extends Omit<MuiModalProps, 'open' | 'onClose'> {
  control: {
    open: MuiModalProps['open']
    onClose: MuiModalProps['onClose']
  }
}

export const ModalController: FC<ModalControllerProps> = ({
  control: {open, onClose},
  children,
  ...props
}) => {
  return (
    <Portal>
      <MuiModal
        open={open}
        onClose={onClose}
        slots={{backdrop: Backdrop}}
        closeAfterTransition
        {...props}
      >
        <Fade in={open} unmountOnExit>
          <Box>{children}</Box>
        </Fade>
      </MuiModal>
    </Portal>
  )
}

export interface ModalContentProps extends Omit<BoxProps, 'ref' | 'title'> {
  onClose?: () => void
  maxWidth?: number
  title?: ReactNode
  closeButtonSx?: IconButtonProps['sx']
  titleVariant?: TypographyProps['variant']
  titleSx?: TypographyProps['sx']
  headerSx?: BoxProps['sx']
}

export const ModalContent = forwardRef<HTMLDivElement, ModalContentProps>(
  (
    {
      sx,
      title,
      children,
      onClose,
      maxWidth = 850,
      titleVariant = 'h6',
      closeButtonSx,
      titleSx,
      headerSx,
      ...props
    },
    ref,
  ) => {
    const containerRef = useRef<HTMLDivElement>(null)

    return (
      <Box
        ref={mergeRefs(ref, containerRef)}
        sx={[s.modalContentRoot, {maxWidth: px(maxWidth)}, ...asx(sx)]}
        {...props}
      >
        <Box sx={[s.header, ...asx(headerSx)]}>
          {typeof title === 'string' ? (
            <Typography sx={titleSx} variant={titleVariant}>
              {title}
            </Typography>
          ) : null}

          {typeof title !== 'string' && title ? title : null}

          {onClose ? (
            <IconButton
              sx={[s.closeButton, ...asx(closeButtonSx)]}
              onClick={onClose}
            >
              <Close />
            </IconButton>
          ) : null}
        </Box>

        {children}
      </Box>
    )
  },
)

const s = createStyles({
  modalContentRoot: t => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: t.palette.background.paper,
    borderRadius: '20px',
    padding: '41px 50px',
    overflowY: 'scroll',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    width: '100%',
    maxHeight: `calc(100vh - ${t.spacing(8)})`,
    [t.breakpoints.down('lg')]: {
      padding: '25px 30px',
    },
  }),
  header: t => ({
    display: 'flex',
    width: 'calc(100% + 30px)',
    [t.breakpoints.down('lg')]: {
      width: '100%',
    },
  }),
  closeButton: t => ({
    minHeight: '25px',
    fontSize: '14px',
    py: 0,
    px: '10px',
    marginLeft: 'auto',
    opacity: 0.8,
    alignSelf: 'center',
    [t.breakpoints.down('lg')]: {
      px: '0',
    },
  }),
})
