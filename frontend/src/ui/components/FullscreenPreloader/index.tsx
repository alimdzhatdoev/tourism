import {FC} from 'react'
import {alpha, Box, BoxProps, CircularProgress, Portal} from '@mui/material'
import {asx, colorScheme} from '@/core/utils'
import {SpinnerLogo} from '@/assets/svg'

interface PreloaderInnerProps extends BoxProps {
  visible?: boolean
  type?: 'progress' | 'spinner'
}

const PreloaderInner: FC<PreloaderInnerProps> = ({
  sx,
  visible = false,
  type = 'progress',
  ...props
}) => {
  return (
    <Box
      {...props}
      sx={[
        {
          position: 'fixed',
          visibility: 'hidden',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          display: 'flex',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          transition: 'all 0.2s ease-out allow-discrete',
          zIndex: 9999,
          '@keyframes circle-to-square': {
            from: {
              transform: 'rotate(0deg)',
            },
            to: {
              transform: 'rotate(360deg)',
            },
          },
        },
        visible &&
          (t => ({
            visibility: 'visible',
            backgroundColor: alpha(t.palette.common.white, 0.05),
            backdropFilter: 'blur(3px)',
          })),
        type === 'spinner' && {
          '& svg': {
            width: '100px',
            height: '100px',
            animation: 'circle-to-square 1s infinite',
            color: t => colorScheme(t).primary.main,
            opacity: 0.2,
          },
          backgroundColor: t => t.palette.common.white,
        },
        ...asx(sx),
      ]}
    >
      {type === 'progress' ? <CircularProgress /> : <SpinnerLogo />}
    </Box>
  )
}

interface FullscreenPreloaderProps extends BoxProps {
  visible?: boolean
  isLocal?: boolean
  type?: 'progress' | 'spinner'
}

export const FullscreenPreloader: FC<FullscreenPreloaderProps> = ({
  isLocal = false,
  sx,
  ...props
}) => {
  return isLocal ? (
    <PreloaderInner
      sx={[isLocal && {position: 'absolute'}, ...asx(sx)]}
      {...props}
    />
  ) : (
    <Portal>
      <PreloaderInner {...props} />
    </Portal>
  )
}
