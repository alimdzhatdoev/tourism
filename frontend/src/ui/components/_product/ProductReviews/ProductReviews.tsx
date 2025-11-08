import {FC} from 'react'
import {SwipeableList, SwipeableListProps} from '../../_common'
import {ReviewTile, ReviewTileProps} from '../../_tiles'
import {Navigation} from 'swiper/modules'
import {useBreakpointValues} from '@/core/hooks'
import {asx} from '@/core/utils'

interface ProductReviewsProps
  extends Omit<SwipeableListProps<ReviewTileProps>, 'items' | 'renderItem'> {
  reviews?: Array<ReviewTileProps>
  renderItem?: SwipeableListProps<ReviewTileProps>['renderItem']
}

export const ProductReviews: FC<ProductReviewsProps> = ({
  reviews,
  slotProps,
  renderItem = ReviewTile,
  sx,
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
      items={reviews}
      renderItem={renderItem}
      navigation
      sx={[
        t => ({
          '& .swiper': {
            [t.breakpoints.down('lg')]: {
              padding: '0 16px',
            },
          },
        }),
        ...asx(sx),
      ]}
      slotProps={{
        ...slotProps,
        skeleton: {
          height: '200px',
        },
        swiper: {
          ...slotProps?.swiper,
          slidesPerView,
          spaceBetween: '20px',
          modules: [Navigation],
        },
        swiperSlide: {
          ...slotProps?.swiperSlide,
          style: {
            width: '305px',
            height: 'auto',
            ...slotProps?.swiperSlide?.style,
          },
        },
      }}
      {...props}
    />
  )
}
