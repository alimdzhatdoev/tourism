import {FC} from 'react'
import {SwipeableList, SwipeableListProps} from '@/ui/components/_common'
import {RoutePointTile, RoutePointTileProps} from '@/ui/components/_tiles'

interface RoutePointsProps
  extends Omit<
    SwipeableListProps<RoutePointTileProps>,
    'items' | 'renderItem'
  > {
  points?: Array<RoutePointTileProps>
}

export const RoutePoints: FC<RoutePointsProps> = ({
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
          spaceBetween: '20px',
          slidesPerView: 1,
          ...slotProps?.swiper,
        },
      }}
      {...props}
      renderItem={p => <RoutePointTile {...p} />}
    />
  )
}
