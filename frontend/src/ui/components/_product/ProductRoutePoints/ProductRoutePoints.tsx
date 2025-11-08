import {FC} from 'react'

import {SwipeableList, SwipeableListProps} from '../../_common'
import {RoutePointTile, RoutePointTileProps} from '../../_tiles'

interface ProductRoutePointsProps
  extends Omit<
    SwipeableListProps<RoutePointTileProps>,
    'items' | 'renderItem'
  > {
  points: Array<RoutePointTileProps>
}

export const ProductRoutePoints: FC<ProductRoutePointsProps> = ({
  points,
  slotProps,
  ...props
}) => {
  return (
    <SwipeableList
      items={points}
      slotProps={{
        ...slotProps,
        swiper: {
          slidesPerView: 6,
          spaceBetween: '20px',
          ...slotProps?.swiper,
        },
      }}
      {...props}
      renderItem={p => <RoutePointTile {...p} />}
    />
  )
}
