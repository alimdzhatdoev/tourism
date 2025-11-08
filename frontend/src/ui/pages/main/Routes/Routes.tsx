import {FC} from 'react'
import {Box, Skeleton, Typography} from '@mui/material'
import {Pagination} from 'swiper/modules'
import {useGetRoutesListQuery} from '@/core/store/routes'
import {RootBlockHeaderLink} from '@/ui/components/_common/RootBlock/RootBlock'
import {useIsDownLg, useRouteLike} from '@/core/hooks'
import {colorScheme, getIndexedArray, hideOn, rootStyle} from '@/core/utils'
import {Swiper, SwiperSlide} from 'swiper/react'
import {RouteTile} from '@/ui/components/_tiles'
import {DESKTOP_MAX_WIDTH} from '@/constants'
import {APP_FONTS} from '@/ui/themes/baseTheme'
import {DraggableBox, MobileLink} from '@/ui/components/_common'
import {FullscreenPreloader} from '@/ui/components'

const SLIDES_OFFSET_BEFORE = Math.max(
  (window.innerWidth - DESKTOP_MAX_WIDTH) / 2,
  30,
)

export const Routes: FC = () => {
  const isDownLg = useIsDownLg()

  const routesApi = useGetRoutesListQuery({
    expand: {photos: true},
    size: 10,
  })

  const {toggleLike} = useRouteLike()

  const routes =
    routesApi.data?.data.results.map(r => ({
      ...r.routeTileProps,
      id: r.id,
    })) ?? []

  return (
    <Box
      sx={t => ({
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '64px',
        padding: '82px 0',
        [t.breakpoints.down('lg')]: {
          padding: '40px 0',
          gap: '32px',
        },
      })}
    >
      <FullscreenPreloader type='spinner' visible={routesApi.isLoading} />
      <Box
        sx={[
          rootStyle,
          t => ({
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row',
            gap: '24px',
            textTransform: 'uppercase',
            [t.breakpoints.down('lg')]: {
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '16px',
              paddingLeft: '30px',
            },
          }),
        ]}
      >
        <Typography
          variant='h1'
          sx={t => ({
            fontSize: '60px',
            fontWeight: 700,
            fontFamily: APP_FONTS.oswald,
            [t.breakpoints.down('lg')]: {
              fontSize: '24px',
            },
          })}
        >
          Маршруты
        </Typography>

        <DraggableBox
          sx={[
            hideOn('up', 'lg'),
            {
              display: 'flex',
              gap: '12px',
              width: '100%',
              marginLeft: '-30px',
              paddingLeft: '30px',
              overflowX: 'auto',
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': {
                display: 'none',
              },
            },
          ]}
        >
          <MobileLink to='/routes'>Все</MobileLink>
          <MobileLink to='/routes?season=winter'>Зима</MobileLink>
          <MobileLink to='/routes?season=spring'>Весна</MobileLink>
          <MobileLink to='/routes?season=summer'>Лето</MobileLink>
          <MobileLink to='/routes?season=autumn'>Осень</MobileLink>
        </DraggableBox>

        <Box
          sx={[
            hideOn('down', 'lg'),
            {
              height: '1px',
              flex: 1,
              backgroundColor: t => colorScheme(t).text.primary,
              margin: '0px 30px',
            },
          ]}
        />

        <Box sx={[hideOn('down', 'lg'), {display: 'flex', gap: '24px'}]}>
          <RootBlockHeaderLink to='/routes?season=winter'>
            Зима
          </RootBlockHeaderLink>
          <RootBlockHeaderLink to='/routes?season=spring'>
            Весна
          </RootBlockHeaderLink>
          <RootBlockHeaderLink to='/routes?season=summer'>
            Лето
          </RootBlockHeaderLink>
          <RootBlockHeaderLink to='/routes?season=autumn'>
            Осень
          </RootBlockHeaderLink>
        </Box>
      </Box>

      <Box
        sx={t => ({
          width: '100%',
          '& .swiper-pagination': {
            bottom: '-10px',
            overflow: 'visible',
          },
          '& .swiper-slide': {
            width: '635px',
            height: '418px',
            [t.breakpoints.down('lg')]: {
              width: '312px',
              height: '204px',
            },
          },
        })}
      >
        <Swiper
          modules={[...(isDownLg ? [Pagination] : [])]}
          spaceBetween={isDownLg ? '24px' : '44px'}
          slidesPerView='auto'
          navigation={{
            prevEl: '#PlacesNavigationPrev',
            nextEl: '#PlacesNavigationNext',
          }}
          pagination={{el: '.routes-pagination'}}
          slidesOffsetBefore={SLIDES_OFFSET_BEFORE}
          loop
        >
          {routes.map(({id, ...props}) => (
            <SwiperSlide key={id}>
              <RouteTile
                onHeartClick={() => toggleLike({id, isLiked: props.isFavorite})}
                {...props}
                hideSpecs
              />
            </SwiperSlide>
          ))}

          {routes.length === 0
            ? getIndexedArray(4).map(item => (
                <SwiperSlide key={item}>
                  <Skeleton
                    sx={{
                      width: '100%',
                      height: '100%',
                    }}
                  />
                </SwiperSlide>
              ))
            : null}
        </Swiper>
      </Box>

      <Box
        className='routes-pagination'
        sx={[
          hideOn('up', 'lg'),
          {
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            marginTop: '-10px',
          },
        ]}
      />
    </Box>
  )
}
