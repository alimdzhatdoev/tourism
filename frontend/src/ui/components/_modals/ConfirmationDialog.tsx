import {FC, MouseEventHandler, ReactNode} from 'react'
import {ModalTemplateProps} from '../_templates'
import {
  Box,
  BoxProps,
  Button,
  ButtonProps,
  Typography,
  TypographyProps,
} from '@mui/material'
import {asx, colorScheme} from '@/core/utils'
import {ModalContent, ModalContentProps} from '../Modal'

export interface ConfirmDialogProps extends ModalContentProps {
  header?: ModalTemplateProps['header']
  message?: string | ReactNode
  acceptText?: string
  declineText?: string
  onAccept?: () => void
  onDecline?: () => void
  acceptProps?: ButtonProps
  declineProps?: ButtonProps
  messageProps?: TypographyProps
  buttonContainerProps?: BoxProps
}
export const ConfirmDialog: FC<ConfirmDialogProps> = ({
  children,
  message = null,
  acceptText = 'Да',
  declineText = 'Нет',
  acceptProps,
  declineProps,
  messageProps,
  buttonContainerProps,
  onAccept,
  onDecline,
  onClose,
  ...props
}) => {
  const handleAccept: MouseEventHandler<HTMLButtonElement> = event => {
    acceptProps?.onClick?.(event)
    onAccept?.()
    close()
  }

  const handleDecline: MouseEventHandler<HTMLButtonElement> = event => {
    declineProps?.onClick?.(event)
    onDecline?.()
    close()
  }

  return (
    <ModalContent onClose={onClose} title='Подтвердите действие' {...props}>
      {typeof message === 'string' ? (
        <Typography
          {...messageProps}
          sx={[
            t => ({
              textAlign: 'center',
              margin: '0 0 26px',
              [t.breakpoints.down('lg')]: {
                fontSize: '16px',
              },
            }),
            ...asx(messageProps?.sx),
          ]}
        >
          {message}
        </Typography>
      ) : (
        message
      )}
      <Box
        {...buttonContainerProps}
        sx={[
          {display: 'flex', width: '100%', gap: '16px'},
          ...asx(buttonContainerProps?.sx),
        ]}
      >
        <Button
          fullWidth
          variant='contained'
          {...acceptProps}
          sx={[
            t => ({
              backgroundColor: colorScheme(t).background.warnRed,
              '&:hover': {
                backgroundColor: colorScheme(t).background.warnRed,
              },
            }),
            ...asx(acceptProps?.sx),
          ]}
          onClick={handleAccept}
        >
          {acceptText}
        </Button>
        <Button
          variant='contained'
          fullWidth
          {...declineProps}
          onClick={handleDecline}
        >
          {declineText}
        </Button>
      </Box>
      {children}
    </ModalContent>
  )
}
