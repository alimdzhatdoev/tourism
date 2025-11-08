import {
  forwardRef,
  Key,
  ReactElement,
  ReactNode,
  Ref,
  useId,
  useMemo,
} from 'react'
import {
  Box,
  BoxProps,
  IconButton,
  IconButtonProps,
  Skeleton,
  SkeletonProps,
} from '@mui/material'
import {styles as s} from './SwipeableList.styles'
import {asx, keyExtractor as defaultKeyExtractor} from '@/core/utils'
import {
  Swiper,
  SwiperProps,
  SwiperRef,
  SwiperSlide,
  SwiperSlideProps,
} from 'swiper/react'

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
export interface SwipeableListProps<T = unknown> extends Omit<BoxProps, 'ref'> {
  fallback?: ReactNode
  items?: Array<T>
  renderItem: (
    item: T,
    props: {isActive: boolean; index: number; array: Array<T>},
  ) => ReactNode
  keyExtractor?: (item: T) => Key
  slotProps?: Partial<{
    swiperContainer: BoxProps
    swiper: SwiperProps
    swiperSlide: SwiperSlideProps
    navigationButton: IconButtonProps
    navigationPrev: IconButtonProps
    navigationNext: IconButtonProps
    skeleton: SkeletonProps
    navigationContainer: BoxProps
  }>
  betweenButtons?: ReactNode
  afterButtons?: ReactNode
  navigation?: boolean
  isLoading?: boolean
}

const SwipeableListComponent = <T extends unknown>(
  {
    items = [],
    renderItem,
    keyExtractor = defaultKeyExtractor,
    slotProps = {},
    navigation = false,
    fallback = null,
    isLoading = false,
    sx,
    children,
    betweenButtons,
    afterButtons,
    ...boxProps
  }: SwipeableListProps<T>,
  ref: Ref<SwiperRef>,
) => {
  const id = useId().replace(/[^a-z0-9]/gi, '')

  const skeletonArray = useMemo(() => {
    let slidesCount = 1
    if (typeof slotProps?.swiper?.slidesPerView === 'number') {
      slidesCount = slotProps.swiper.slidesPerView
    }
    return Array.from({length: Math.round(slidesCount) + 1}, (_, i) => i + 1)
  }, [slotProps?.swiper?.slidesPerView])

  if (!isLoading && items.length === 0) return fallback

  return (
    <Box sx={[s.root, ...asx(sx)]} {...boxProps}>
      <Box {...slotProps.swiperContainer}>
        <Swiper
          {...slotProps?.swiper}
          ref={ref}
          style={{...s.swiper, ...slotProps.swiper?.style}}
          navigation={{
            prevEl: '#navigationPrev' + id,
            nextEl: '#navigationNext' + id,
          }}
        >
          {isLoading
            ? skeletonArray.map(key => (
                <SwiperSlide
                  key={key}
                  {...slotProps?.swiperSlide}
                  style={{...s.swiperSlide, ...slotProps.swiperSlide?.style}}
                >
                  <Skeleton
                    {...slotProps?.skeleton}
                    sx={[s.skeleton, ...asx(slotProps?.skeleton?.sx)]}
                  />
                </SwiperSlide>
              ))
            : items.map((item, index, array) => (
                <SwiperSlide
                  key={keyExtractor(item)}
                  {...slotProps?.swiperSlide}
                  style={{...s.swiperSlide, ...slotProps?.swiperSlide?.style}}
                >
                  {props => renderItem(item, {...props, index, array})}
                </SwiperSlide>
              ))}
        </Swiper>
      </Box>

      {navigation ? (
        <Box
          {...slotProps?.navigationContainer}
          sx={[
            s.navigationContainer,
            ...asx(slotProps?.navigationContainer?.sx),
          ]}
        >
          <IconButton
            {...slotProps?.navigationButton}
            {...slotProps?.navigationPrev}
            sx={[
              s.navigationButton,
              ...asx(slotProps?.navigationButton?.sx),
              ...asx(slotProps?.navigationPrev?.sx),
            ]}
            id={'navigationPrev' + id}
          >
            <ChevronLeftIcon />
          </IconButton>

          {betweenButtons}

          <IconButton
            {...slotProps?.navigationButton}
            {...slotProps?.navigationNext}
            sx={[
              s.navigationButton,
              ...asx(slotProps?.navigationButton?.sx),
              ...asx(slotProps?.navigationNext?.sx),
            ]}
            id={'navigationNext' + id}
          >
            <ChevronRightIcon />
          </IconButton>

          {afterButtons}
        </Box>
      ) : null}

      {children}
    </Box>
  )
}

export const SwipeableList = forwardRef(SwipeableListComponent) as <
  T extends unknown,
>(
  props: SwipeableListProps<T> & {ref?: Ref<SwiperRef>},
) => ReactElement
