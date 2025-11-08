import {FC} from 'react'
import {Tile, TileProps} from '../../_common'
import {
  alpha,
  Box,
  IconButton,
  Typography,
  TypographyProps,
} from '@mui/material'
import {asx} from '@/core/utils'
import {styles as s} from './RouteTile.styles'
import {RouteDifficulty} from '@/core/models/Route'
import {Nullable} from 'types-helpers'
import {RouteSpecs} from '../../RouteSpecs'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import RouteProperties from '@/core/models/RouteProperties'

export interface RouteTileProps
  extends Omit<TileProps, 'extraSlots' | 'slotProps'> {
  name: string
  title: string
  text: string
  difficulty: RouteDifficulty
  totalDistance: Nullable<number>
  totalDuration: Nullable<number>
  hideSpecs?: boolean
  isFavorite: boolean
  properties: Nullable<RouteProperties>
  onHeartClick?: () => void
  slotProps?: TileProps['slotProps'] &
    Partial<{
      name: Partial<TypographyProps>
      title: Partial<TypographyProps>
      text: Partial<TypographyProps>
    }>
}

export const RouteTile: FC<RouteTileProps> = ({
  sx,
  name,
  id: _,
  text: __,
  slotProps,
  totalDistance,
  totalDuration,
  difficulty,
  properties,
  hideSpecs: ___ = false,
  onHeartClick,
  isFavorite,
  ...tileProps
}) => {
  return (
    <Tile
      {...tileProps}
      sx={[s.root, ...asx(sx)]}
      slotProps={{
        ...slotProps,
        image: {
          ...slotProps?.image,
          sx: [s.image, ...asx(slotProps?.image?.sx)],
        },
        childrenContainer: {
          ...slotProps?.childrenContainer,
          sx: [s.childrenContainer, ...asx(slotProps?.childrenContainer?.sx)],
        },
      }}
    >
      <Typography
        {...slotProps?.name}
        sx={[s.name, ...asx(slotProps?.name?.sx)]}
      >
        {name}
      </Typography>

      <RouteSpecs
        difficulty={difficulty}
        totalDistance={totalDistance}
        totalDuration={totalDuration}
        isFamily={properties?.isFamily}
        isOnCar={properties?.isOnCar}
        isOnFoot={properties?.isOnFoot}
        isOnHorseback={properties?.isOnHorseback}
        isOnQuadBike={properties?.isOnQuadBike}
        isOvernight={properties?.isOvernight}
        isSwimming={properties?.isSwimming}
        riseDegree={properties?.riseDegree}
        season={properties?.season}
        sx={{
          marginLeft: '-30px',
          paddingLeft: '30px',
          width: 'calc(100% + 60px)',
        }}
        isDraggable
      />

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <Typography sx={s.moreButton}>Подробнее</Typography>
        <IconButton
          sx={t => ({
            color: 'white',
            backgroundColor: alpha(t.palette.common.white, 0.5),
            height: '54px',
            width: '54px',
            paddingTop: '4px',
            [t.breakpoints.down('lg')]: {
              height: '36px',
              width: '36px',
              paddingTop: '2px',
              '& svg': {
                fontSize: '24px',
              },
            },
          })}
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
      </Box>
    </Tile>
  )
}
