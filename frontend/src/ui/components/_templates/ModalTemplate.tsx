import {FC, ReactNode, forwardRef} from 'react'
import {Close} from '@mui/icons-material'
import {
  Box,
  BoxProps,
  Dialog,
  DialogProps,
  IconButton,
  Slide,
  SlideProps,
  Typography,
  TypographyProps,
} from '@mui/material'
import {asx} from '@/core/utils'
import {useBreakpointValues} from '@/core/hooks'

const Transition: FC<SlideProps> = forwardRef((props, ref) => {
  return <Slide direction='left' timeout={0} {...props} ref={ref} />
})

export interface ModalTemplateProps extends DialogProps {
  noCloseButton?: boolean
  header?: string | ReactNode
  containerProps?: BoxProps
  headerProps?: TypographyProps
  onDismiss?: () => void
}
export const ModalTemplate: FC<ModalTemplateProps> = ({
  noCloseButton = false,
  onClose,
  children,
  header = <></>,
  containerProps,
  headerProps,
  PaperProps,
  onDismiss,
  ...props
}) => {
  const {value} = useBreakpointValues(undefined, {
    lg: Transition,
    xl: Transition,
  })
  const handleDismiss = (
    event: {},
    reason: 'backdropClick' | 'escapeKeyDown',
  ) => {
    onDismiss?.()
    onClose?.(event, reason)
  }
  return (
    <Dialog
      onClose={handleDismiss}
      TransitionComponent={value}
      PaperProps={{
        ...PaperProps,
        sx: [
          t => ({
            padding: '48px 32px',
            borderRadius: '24px',
            margin: 0,
            [t.breakpoints.up('lg')]: {
              position: 'absolute',
              top: 0,
              right: 0,
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
            },
          }),
          ...asx(PaperProps?.sx),
        ],
      }}
      {...props}
    >
      {!noCloseButton ? (
        <IconButton
          onClick={() => handleDismiss?.({}, 'backdropClick')}
          sx={t => ({
            position: 'absolute',
            right: '8px',
            top: '8px',
            [t.breakpoints.down('lg')]: {
              right: '16px',
              top: '16px',
            },
          })}
        >
          <Close fontSize='small' />
        </IconButton>
      ) : null}
      {typeof header === 'string' ? (
        <Typography
          {...headerProps}
          sx={[
            t => ({
              fontWeight: 500,
              fontSize: '36px',
              lineHeight: '40px',
              margin: '0 0 32px',
              [t.breakpoints.down('lg')]: {
                fontSize: '26px',
                lineHeight: '30px',
              },
            }),
            ...asx(headerProps?.sx),
          ]}
        >
          {header}
        </Typography>
      ) : (
        header
      )}
      <Box {...containerProps}>{children}</Box>
    </Dialog>
  )
}
