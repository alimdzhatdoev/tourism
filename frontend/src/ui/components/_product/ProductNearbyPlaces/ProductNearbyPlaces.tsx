import {FC} from 'react'
import {PlaceTile, PlaceTileProps} from '../../_tiles'
import {SwipeableList, SwipeableListProps} from '../../_common'
import {useBreakpointValues} from '@/core/hooks'

interface ProductNearbyPlacesProps
  extends Omit<SwipeableListProps<PlaceTileProps>, 'items' | 'renderItem'> {
  places: Array<PlaceTileProps>
}

export const ProductNearbyPlaces: FC<ProductNearbyPlacesProps> = ({
  places,
  slotProps,
  ...props
}) => {
  const {value: slidesPerView} = useBreakpointValues(2, {
    xs: 2,
    sm: 3,
    md: 4,
    lg: 4,
    xl: 4,
  })
  return (
    <SwipeableList
      sx={t => ({
        '& .swiper': {
          [t.breakpoints.down('lg')]: {
            padding: '0 16px',
          },
        },
      })}
      items={places}
      slotProps={{
        ...slotProps,
        skeleton: {
          height: '300px',
        },
        swiper: {
          slidesPerView,
          spaceBetween: '20px',
          ...slotProps?.swiper,
        },
      }}
      {...props}
      renderItem={p => <PlaceTile {...p} />}
    />
  )
}
