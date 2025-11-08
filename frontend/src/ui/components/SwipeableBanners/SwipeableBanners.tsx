import {FC} from 'react'
import {Image, SwipeableList, SwipeableListProps} from '../_common'
import {Autoplay, EffectFade, Pagination} from 'swiper/modules'
import {styles as s} from './SwipeableBanners.styles'
import {Box, Typography} from '@mui/material'
import {asx} from '@/core/utils'

import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/autoplay'
import 'swiper/css/pagination'

export interface BannerItemProps {
  id: number | string
  imageSrc: string
  navigatePath?: string
  title?: string
  subtitle?: string
}

const BannerItem: FC<BannerItemProps> = banner => (
  <Box sx={s.slide} component='a' href={banner.navigatePath}>
    <Image src={banner.imageSrc} alt='banner' sx={s.slideImage} />
    {banner.title ? (
      <Box sx={s.textContainer}>
        <Typography sx={s.title}>{banner.title}</Typography>
        <Typography sx={s.subtitle}>{banner.subtitle}</Typography>
      </Box>
    ) : null}
  </Box>
)

interface SwipeableBannersProps
  extends Omit<
    SwipeableListProps<BannerItemProps>,
    'slotProps' | 'renderItem'
  > {
  renderItem?: SwipeableListProps<BannerItemProps>['renderItem']
  noBottomPaper?: boolean
  slotProps?: SwipeableListProps<BannerItemProps>['slotProps']
}

export const SwipeableBanners: FC<SwipeableBannersProps> = ({
  slotProps,
  keyExtractor = banner => banner.id,
  renderItem = BannerItem,
  sx,
  ...props
}) => {
  return (
    <SwipeableList
      sx={[s.root, ...asx(sx)]}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      slotProps={{
        skeleton: {
          ...slotProps?.skeleton,
          sx: [s.skeleton, ...asx(slotProps?.skeleton?.sx)],
        },
        swiper: {
          ...slotProps?.swiper,
          modules: [Autoplay, EffectFade, Pagination],
          effect: 'fade',
          loop: true,
          autoplay: {
            delay: 4000,
          },
        },
        navigationButton: slotProps?.navigationButton,
        navigationNext: slotProps?.navigationNext,
        navigationPrev: slotProps?.navigationPrev,
        swiperSlide: slotProps?.swiperSlide,
      }}
      {...props}
    />
  )
}
