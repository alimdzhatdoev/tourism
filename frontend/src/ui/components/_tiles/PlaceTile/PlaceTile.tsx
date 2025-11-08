import {FC} from 'react'
import {Tile, TileProps} from '../../_common'
import {
  alpha,
  Box,
  IconButton,
  Typography,
  TypographyProps,
} from '@mui/material'
import {asx, colorScheme} from '@/core/utils'
import {APP_FONTS} from '@/ui/themes/baseTheme'
import {LocationMarker, StarFill} from '@/assets/svg'
import {pluralize} from '@/core/utils/pluralize'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import {useIsDownLg} from '@/core/hooks'

export interface PlaceTileProps
  extends Omit<TileProps, 'children' | 'slotProps' | 'id'> {
  location?: string
  title: string
  text: string
  key: number
  rating?: number
  reviewsCount?: number
  slotProps?: TileProps['slotProps'] &
    Partial<{
      title: Partial<TypographyProps>
      text: Partial<TypographyProps>
    }>
  isFavorite?: boolean
  onHeartClick?: () => void
}

export const PlaceTile: FC<PlaceTileProps> = ({
  text: _,
  title,
  location,
  slotProps,
  rating,
  reviewsCount,
  isFavorite = false,
  onClick,
  onHeartClick,
  sx,
  ...tileProps
}) => {
  const isDownLg = useIsDownLg()

  return (
    <Tile
      {...tileProps}
      onClick={isDownLg ? undefined : onClick}
      sx={[
        {
          borderRadius: '17px',
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: t => t.palette.grey[400],
        },
        ...asx(sx),
      ]}
      slotProps={{
        childrenContainer: {
          ...slotProps?.childrenContainer,
          sx: [
            t => ({
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              margin: '27px 21px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              alignItems: 'flex-start',
              gap: '10px',
              color: colorScheme(t).background.root,
              [t.breakpoints.down('lg')]: {
                margin: '15px 15px',
              },
            }),
            ...asx(slotProps?.childrenContainer?.sx),
          ],
        },
        image: {
          ...slotProps?.image,
          sx: [
            {
              width: '100%',
              aspectRatio: 0.66,
              objectFit: 'cover',
            },
            ...asx(slotProps?.image?.sx),
          ],
        },
      }}
    >
      {onHeartClick ? (
        <IconButton
          sx={{
            color: 'white',
            backgroundColor: t => alpha(t.palette.common.white, 0.5),
            height: '54px',
            width: '54px',
            marginBottom: 'auto',
            marginLeft: 'auto',
          }}
          onClick={e => {
            e.stopPropagation()
            onHeartClick?.()
          }}
        >
          {isFavorite ? (
            <FavoriteIcon fontSize='large' />
          ) : (
            <FavoriteBorderIcon fontSize='large' />
          )}
        </IconButton>
      ) : null}
      {location ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            '& svg': {
              marginRight: '3px',
              height: '15px',
            },
          }}
        >
          <Typography
            {...slotProps?.text}
            sx={[
              t => ({
                fontWeight: 400,
                fontSize: '14px',
                lineHeight: '17px',
                [t.breakpoints.down('lg')]: {
                  fontSize: '12px',
                },
              }),
              ...asx(slotProps?.text?.sx),
            ]}
          >
            <LocationMarker />
            {location}
          </Typography>
        </Box>
      ) : null}
      <Typography
        {...slotProps?.title}
        sx={[
          t => ({
            fontWeight: 700,
            fontSize: '27px',
            lineHeight: '41px',
            fontFamily: APP_FONTS.oswald,
            textTransform: 'uppercase',
            [t.breakpoints.down('lg')]: {
              fontSize: '14px',
              lineHeight: '21px',
            },
          }),
          ...asx(slotProps?.title?.sx),
        ]}
      >
        {title}
      </Typography>

      <Box
        sx={t => ({
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '10px',
          width: '100%',
          [t.breakpoints.down('lg')]: {
            gap: '0px',
            fontSize: '12px',
            '& svg': {
              height: '12px',
            },
            '& p': {
              fontSize: '12px',
            },
          },
        })}
      >
        {rating ? (
          <>
            <StarFill />
            <Typography>{rating.toFixed(1)}</Typography>
          </>
        ) : null}

        <Typography sx={{marginLeft: 'auto'}}>
          {pluralize(reviewsCount, 'отзыв', {
            one: '',
            few: 'а',
            many: 'ов',
          })}
        </Typography>
      </Box>
    </Tile>
  )
}
