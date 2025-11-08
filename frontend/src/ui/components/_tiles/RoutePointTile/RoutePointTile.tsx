import {FC} from 'react'
import {Typography} from '@mui/material'
import {styles as s} from './RoutePointTile.styles'
import {asx} from '@/core/utils'
import {Tile, TileProps} from '../../_common'

export interface RoutePointTileProps extends TileProps {
  index: number
  name: string
}

export const RoutePointTile: FC<RoutePointTileProps> = ({
  index,
  name,
  sx,
  ...tileProps
}) => {
  return (
    <Tile
      sx={[s.root, ...asx(sx)]}
      {...tileProps}
      extraSlots={{
        beforeChildrenContainer: (
          <Typography sx={s.position}>{index + 1}</Typography>
        ),
        ...tileProps?.extraSlots,
      }}
      slotProps={{
        ...tileProps?.slotProps,
        image: {
          ...tileProps?.slotProps?.image,
          sx: [s.image, ...asx(tileProps?.slotProps?.image?.sx)],
        },
        childrenContainer: {
          ...tileProps?.slotProps?.childrenContainer,
          sx: [
            s.childrenContainer,
            ...asx(tileProps?.slotProps?.childrenContainer?.sx),
          ],
        },
      }}
    >
      <Typography sx={s.name}>{name}</Typography>
    </Tile>
  )
}
