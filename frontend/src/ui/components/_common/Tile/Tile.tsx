import {Box, BoxProps, Skeleton} from '@mui/material'
import {
  FC,
  MouseEventHandler,
  ReactEventHandler,
  ReactNode,
  forwardRef,
  useState,
} from 'react'
import {styles as s} from './Tile.styles'
import {asx, casx} from '@/core/utils'
import {useNavigate} from 'react-router-dom'

export interface TileProps extends BoxProps {
  disableImageMargin?: boolean
  navigatePath?: string
  imageSrc?: string
  slotProps?: Partial<{
    image: Partial<BoxProps<'img'>>
    childrenContainer: Partial<Omit<BoxProps, 'children'>>
  }>
  extraSlots?: Partial<{
    beforeChildrenContainer: ReactNode
  }>
}

export const Tile: FC<TileProps> = forwardRef(
  (
    {
      imageSrc,
      navigatePath,
      sx: containerSx,
      disableImageMargin = false,
      slotProps,
      children,
      onClick,
      extraSlots,
      ...containerProps
    },
    ref,
  ) => {
    const navigate = useNavigate()
    const [imgLoading, setImgLoading] = useState<boolean>(true)
    const isRootClickable = Boolean(navigatePath || onClick)

    const handleContainerClick: MouseEventHandler<HTMLDivElement> = event => {
      if (navigatePath) navigate(navigatePath)
      onClick?.(event)
    }

    const handleImageLoad: ReactEventHandler<HTMLImageElement> = event => {
      setImgLoading(false)
      slotProps?.image?.onLoad?.(event)
    }

    return (
      <Box
        ref={ref}
        sx={[
          s.root,
          ...casx(isRootClickable, s.clickableRoot),
          ...asx(containerSx),
        ]}
        onClick={handleContainerClick}
        {...containerProps}
      >
        {imageSrc ? (
          <>
            {imgLoading ? (
              <Skeleton
                sx={[
                  s.image,
                  ...casx(disableImageMargin, s.disableImageMargin),
                  ...asx(slotProps?.image?.sx),
                ]}
              />
            ) : null}
            <Box
              component='img'
              src={imageSrc}
              alt={imageSrc}
              {...slotProps?.image}
              sx={[
                s.image,
                ...casx(disableImageMargin, s.disableImageMargin),
                ...casx(imgLoading, {display: 'none'}),
                ...asx(slotProps?.image?.sx),
              ]}
              onLoad={handleImageLoad}
            />
          </>
        ) : null}

        {extraSlots?.beforeChildrenContainer
          ? extraSlots.beforeChildrenContainer
          : null}

        <Box
          {...slotProps?.childrenContainer}
          sx={[s.childrenContainer, ...asx(slotProps?.childrenContainer?.sx)]}
        >
          {children}
        </Box>
      </Box>
    )
  },
)
