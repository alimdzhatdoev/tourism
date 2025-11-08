import {useIsDownLg} from '@/core/hooks'
import {useNavigate} from 'react-router-dom'
import {useGetAttractionsListQuery} from '@/core/store/attractions'
import {Box, Button, IconButton, Skeleton, Typography} from '@mui/material'
import {FC, useCallback, useMemo, useRef, useState} from 'react'
import {Swiper, SwiperProps, SwiperRef, SwiperSlide} from 'swiper/react'
import {EffectFade, Navigation, Pagination} from 'swiper/modules'
import {HEADER_HEIGHT} from '@/ui/components/Layout/Header/Header.styles'
import {colorScheme, hideOn, px, textEllipsis} from '@/core/utils'
import {PlaceTile} from '@/ui/components/_tiles'
import {DESKTOP_MAX_WIDTH} from '@/constants'
import {LocationMarker, StyledArrowRight} from '@/assets/svg'
import {APP_FONTS} from '@/ui/themes/baseTheme'

import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/pagination'

export const Places: FC = () => {
  const isDownLg = useIsDownLg()
  const navigate = useNavigate()

  const fullWidthSwiperRef = useRef<SwiperRef>(null)
  const carouselSwiperRef = useRef<SwiperRef>(null)
  const isUpdatingRef = useRef(false)

  const attractionsApi = useGetAttractionsListQuery({
    expand: {photos: true, location: true, groups: true},
    size: 10,
  })

  const places = useMemo(
    () => attractionsApi.data?.data.results.map(p => p.placeTileProps) ?? [],
    [attractionsApi.data?.data.results],
  )

  const carouselPlaces = useMemo(() => {
    return places
  }, [places])

  const [slideIndex, setSlideIndex] = useState<number>(0)

  const currentSlide = useMemo(() => {
    return places[slideIndex]
  }, [slideIndex, places])

  const handleCarouselSlideIndexChange = useCallback<
    NonNullable<SwiperProps['onRealIndexChange']>
  >(swiper => {
    if (isUpdatingRef.current) return

    const {realIndex} = swiper
    isUpdatingRef.current = true

    fullWidthSwiperRef.current?.swiper.slideTo(realIndex, 0)
    setSlideIndex(realIndex)

    setTimeout(() => {
      isUpdatingRef.current = false
    }, 50)
  }, [])

  const handleFullWidthSlideIndexChange = useCallback<
    NonNullable<SwiperProps['onRealIndexChange']>
  >(
    swiper => {
      if (isUpdatingRef.current) return

      const {realIndex} = swiper
      isUpdatingRef.current = true

      if (!isDownLg) {
        carouselSwiperRef.current?.swiper.slideTo(realIndex, 0)
      }
      setSlideIndex(realIndex)

      setTimeout(() => {
        isUpdatingRef.current = false
      }, 50)
    },
    [isDownLg],
  )

  return (
    <Box
      sx={t => ({
        position: 'relative',
        marginTop: px(-HEADER_HEIGHT.sticky - HEADER_HEIGHT.static),
        width: '100%',
        height: '1024px',
        [t.breakpoints.down('lg')]: {
          height: '640px',
          marginTop: px(-HEADER_HEIGHT.sticky),
          '--swiper-pagination-color': t.palette.common.white,
        },
      })}
    >
      <Swiper
        ref={fullWidthSwiperRef}
        effect={'fade'}
        modules={[EffectFade, ...(isDownLg ? [Pagination] : [])]}
        allowTouchMove={isDownLg}
        style={{
          width: '100%',
          height: '100%',
        }}
        pagination={{clickable: true}}
        onRealIndexChange={handleFullWidthSlideIndexChange}
        slidesPerView={1}
        loop={places.length > 1}
      >
        {places.map(p => (
          <SwiperSlide key={p.key}>
            <Box
              component='img'
              src={p.imageSrc}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'brightness(50%)',
              }}
            />
          </SwiperSlide>
        ))}

        {places.length === 0 ? (
          <SwiperSlide>
            <Skeleton
              sx={{
                width: '100%',
                height: '100%',
              }}
            />
          </SwiperSlide>
        ) : null}
      </Swiper>

      <Box
        sx={[
          hideOn('up', 'lg'),
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            paddingBottom: '90px',
            paddingLeft: '30px',
            color: t => colorScheme(t).background.root,
            pointerEvents: 'none',
            gap: '23px',
          },
        ]}
      >
        <Typography
          sx={{
            fontSize: '14px',
            '& svg': {
              marginRight: '10px',
              height: '16px',
            },
          }}
        >
          {currentSlide ? (
            <>
              <LocationMarker />
              {currentSlide.location}
            </>
          ) : (
            <Skeleton variant='text' sx={{opacity: 0.2}} width='60%' />
          )}
        </Typography>
        <Typography
          sx={{
            fontSize: '33px',
            fontWeight: 700,
            fontFamily: APP_FONTS.oswald,
            textTransform: 'uppercase',
          }}
        >
          {currentSlide ? (
            currentSlide.title
          ) : (
            <Skeleton variant='text' sx={{opacity: 0.2}} />
          )}
        </Typography>
        {currentSlide ? (
          <Button
            variant='outlined'
            color='secondary'
            sx={{
              marginTop: '10px',
              pointerEvents: 'auto',
            }}
            onClick={() => navigate(`/places/${currentSlide.key}`)}
          >
            Начать путешествие
          </Button>
        ) : null}
      </Box>

      <Box
        sx={[
          hideOn('down', 'lg'),
          {
            position: 'absolute',
            top: 0,
            left: 0,
            paddingLeft: `calc((100% - 20px - ${px(
              DESKTOP_MAX_WIDTH,
            )}) * 0.5)`,
            height: '330px',
            width: `calc(100% - 20px - ${px(DESKTOP_MAX_WIDTH)} + 510px)`,
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            color: t => colorScheme(t).background.root,
          },
        ]}
      >
        <Typography
          sx={{
            fontSize: '20px',
            marginLeft: '20px',
            '& svg': {
              marginRight: '10px',
              height: '20px',
            },
          }}
        >
          {currentSlide ? (
            <>
              <LocationMarker />
              {currentSlide.location}
            </>
          ) : (
            <Skeleton variant='text' sx={{opacity: 0.2}} width='60%' />
          )}
        </Typography>
      </Box>

      <Box
        sx={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            paddingTop: '350px',
            width: '100%',
            maxWidth: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '56px',
            paddingLeft: `calc((100% - 20px - ${px(
              DESKTOP_MAX_WIDTH,
            )}) * 0.5)`,
            zIndex: 1,
            '& .swiper': {
              width: '100%',
              height: '100%',
            },
          },
          hideOn('down', 'lg'),
        ]}
      >
        <Box
          sx={{
            minWidth: '510px',
            maxWidth: '510px',
            gap: '16px',
            display: 'flex',
            flexDirection: 'column',
            color: t => colorScheme(t).background.root,
            marginLeft: '20px',
          }}
        >
          <Typography
            sx={{
              fontSize: '64px',
              fontWeight: 700,
              fontFamily: APP_FONTS.oswald,
              lineHeight: '77px',
              textTransform: 'uppercase',
            }}
          >
            {currentSlide ? (
              currentSlide.title
            ) : (
              <Skeleton variant='text' sx={{opacity: 0.2}} />
            )}
          </Typography>

          <Typography sx={textEllipsis({numberOfLines: 6})}>
            {currentSlide ? (
              currentSlide.text
            ) : (
              <>
                <Skeleton
                  variant='text'
                  sx={{opacity: 0.2, marginBottom: '15px'}}
                  width='80%'
                />
                <Skeleton
                  variant='text'
                  sx={{opacity: 0.2, marginBottom: '15px'}}
                  width='70%'
                />
              </>
            )}
          </Typography>

          {currentSlide ? (
            <Button
              variant='outlined'
              color='secondary'
              sx={{
                marginTop: '10px',
              }}
              onClick={() => navigate(`/places/${currentSlide.key}`)}
            >
              Начать путешествие
            </Button>
          ) : null}
        </Box>

        <Swiper
          ref={carouselSwiperRef}
          modules={[Navigation]}
          spaceBetween={44}
          slidesPerView='auto'
          onRealIndexChange={handleCarouselSlideIndexChange}
          navigation={{
            prevEl: '#PlacesNavigationPrev',
            nextEl: '#PlacesNavigationNext',
          }}
          watchSlidesProgress
          loop={carouselPlaces.length > 3}
        >
          {carouselPlaces.map(({key, ...props}) => (
            <SwiperSlide key={key} style={{width: '258px'}}>
              <PlaceTile key={key} {...props} />
            </SwiperSlide>
          ))}

          {carouselPlaces.length === 0 ? (
            <SwiperSlide>
              <Skeleton
                sx={{
                  width: '100%',
                  height: '100%',
                }}
              />
            </SwiperSlide>
          ) : null}
        </Swiper>

        <Box
          sx={{
            position: 'absolute',
            bottom: '150px',
            right: 0,
            paddingLeft: `calc((100% - ${px(
              DESKTOP_MAX_WIDTH,
            )}) * 0.5 + 510px + 64px)`,
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            width: '100%',
            maxWidth: '100%',
            paddingRight: `calc((100% - 20px - ${px(
              DESKTOP_MAX_WIDTH,
            )}) * 0.5)`,
            zIndex: 1,
          }}
        >
          <IconButton
            id='PlacesNavigationPrev'
            sx={{
              height: '80px',
              aspectRatio: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid white',
              color: 'white',
              '& svg': {
                fontSize: '30px',
                transform: 'rotate(180deg)',
              },
            }}
          >
            <StyledArrowRight />
          </IconButton>

          <IconButton
            id='PlacesNavigationNext'
            sx={{
              height: '80px',
              aspectRatio: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid white',
              color: 'white',
              '& svg': {
                fontSize: '30px',
              },
            }}
          >
            <StyledArrowRight />
          </IconButton>

          <Box sx={{backgroundColor: 'white', height: '1px', flex: 1}} />

          <Typography
            sx={{
              color: 'white',
              fontFamily: APP_FONTS.oswald,
              fontWeight: 700,
              fontSize: '64px',
              lineHeight: '64px',
              marginRight: '20px',
            }}
          >
            {('0' + (slideIndex + 1)).slice(-2)}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
