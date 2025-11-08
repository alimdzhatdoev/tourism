import {FC, ReactEventHandler, ReactNode, useMemo, useState} from 'react'
import {Box, BoxProps, Skeleton, SkeletonProps} from '@mui/material'
import {Nullable} from 'types-helpers'
import {asx, casx} from '@/core/utils'

const renderCondition = <T extends BoxProps<'img'>['src'] | boolean>(
  primarySrc?: Nullable<T>,
  fallbackSrc?: Nullable<T>,
) => {
  if (!primarySrc && fallbackSrc) {
    return fallbackSrc
  }
  if (primarySrc) {
    return primarySrc
  }
  return false
}

export interface ImageProps extends Omit<BoxProps<'img'>, 'src'> {
  src?: Nullable<BoxProps<'img'>['src']>
  fallbackSrc?: BoxProps<'img'>['src']
  slotProps?: Partial<{
    root: BoxProps
    skeleton: SkeletonProps
    imageSx: ImageProps['sx']
  }>
  fallBack?: ReactNode
  isLoading?: boolean
}

export const Image: FC<ImageProps> = ({
  src: primarySrc,
  fallbackSrc,
  slotProps,
  fallBack = null,
  onLoad,
  sx,
  isLoading = false,
  children,
  ...imgProps
}) => {
  const [isSrcLoading, setIsSrcLoading] = useState(
    renderCondition(!!primarySrc, !!fallbackSrc),
  )

  const src = useMemo(
    () => renderCondition(primarySrc, fallbackSrc),
    [primarySrc, fallbackSrc],
  )

  const hadleLoad: ReactEventHandler<HTMLImageElement> = event => {
    setIsSrcLoading(false)
    onLoad?.(event)
  }

  return (
    <Box
      {...slotProps?.root}
      sx={[{overflow: 'hidden'}, ...asx(sx), ...asx(slotProps?.root?.sx)]}
    >
      {src ? (
        <Box
          component='img'
          src={src}
          alt=''
          onLoad={hadleLoad}
          sx={[
            {
              objectFit: 'cover',
              width: '100%',
              height: '100%',
            },
            ...casx(isSrcLoading || isLoading, {display: 'none'}),
            ...asx(slotProps?.imageSx),
          ]}
          {...imgProps}
        />
      ) : (
        fallBack
      )}
      {isSrcLoading || isLoading ? (
        <Skeleton
          {...slotProps?.skeleton}
          sx={[
            {
              width: '100%',
              height: '100%',
              borderRadius: 'unset',
            },
            ...asx(slotProps?.skeleton?.sx),
          ]}
        />
      ) : null}
      {children}
    </Box>
  )
}
