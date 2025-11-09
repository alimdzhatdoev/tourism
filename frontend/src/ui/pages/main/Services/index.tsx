import {FC} from 'react'
import {Box, IconButton, Skeleton, Typography} from '@mui/material'
import {
  colorScheme,
  createStyles,
  getIndexedArray,
  hideOn,
  rootStyle,
} from '@/core/utils'
import {useGetAttractionsListQuery} from '@/core/store/attractions'
import {DESKTOP_MAX_WIDTH, GROUPS_IDS} from '@/constants'
import {Navigation, Pagination} from 'swiper/modules'
import {GuideTile} from '@/ui/components/_tiles/GuideTile'
import {APP_FONTS} from '@/ui/themes/baseTheme'
import {RootBlockHeaderLink} from '@/ui/components/_common/RootBlock/RootBlock'
import {useIsDownLg} from '@/core/hooks'
import {Swiper, SwiperSlide} from 'swiper/react'

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

const GUIDES_GROUP_ID = GROUPS_IDS.guides.toString()

const SLIDES_OFFSET_BEFORE = Math.max(
  (window.innerWidth - DESKTOP_MAX_WIDTH) / 2,
  30,
)

export const Services: FC = () => {
  const isDownLg = useIsDownLg()

  const {data} = useGetAttractionsListQuery({
    expand: {
      photos: true,
      reviews: true,
    },
    size: 10,
    filters: {group_id: GUIDES_GROUP_ID},
  })

  const guides = data?.data.results?.map(a => a.guideTileProps) ?? []

  return (
    <Box
      sx={t => ({
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '64px',
        padding: '82px 0',
        marginBottom: '300px',
        [t.breakpoints.down('lg')]: {
          padding: '10px 0',
          gap: '32px',
          marginBottom: '0',
        },
      })}
    >
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
          Сервисы и услуги
        </Typography>

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

        <RootBlockHeaderLink
          sx={hideOn('down', 'lg')}
          to={`/services?group_id=${GUIDES_GROUP_ID}`}
        >
          Смотреть все
        </RootBlockHeaderLink>
      </Box>

      <Box
        sx={t => ({
          width: '100%',
          '& .swiper-pagination': {
            bottom: '-10px',
            overflow: 'visible',
          },
          '& .swiper-slide': {
            width: '303px',
            height: '458px',
            [t.breakpoints.down('lg')]: {
              width: '200px',
              height: '303px',
            },
          },
        })}
      >
        <Swiper
          modules={[Navigation, ...(isDownLg ? [Pagination] : [])]}
          spaceBetween={isDownLg ? '24px' : '44px'}
          slidesPerView='auto'
          navigation={{
            prevEl: '#ServicesNavigationPrev',
            nextEl: '#ServicesNavigationNext',
          }}
          pagination={{el: '.services-pagination'}}
          slidesOffsetBefore={SLIDES_OFFSET_BEFORE}
          loop
        >
          {guides.map(({id, ...props}) => (
            <SwiperSlide key={id}>
              <GuideTile {...props} />
            </SwiperSlide>
          ))}

          {guides.length === 0
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
        sx={[rootStyle, hideOn('down', 'lg'), {display: 'flex', gap: '20px'}]}
      >
        <IconButton
          id='ServicesNavigationPrev'
          sx={{
            height: '80px',
            aspectRatio: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #fff',
            '& svg': {
              fontSize: '30px',
              color: '#fff'
            },
          }}
        >
          <ChevronLeftIcon />
        </IconButton>

        <IconButton
          id='ServicesNavigationNext'
          sx={{
            height: '80px',
            aspectRatio: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #fff',
            '& svg': {
              fontSize: '30px',
              color: '#fff'
            },
          }}
        >
          <ChevronRightIcon />
        </IconButton>
      </Box>

      <Box
        className='services-pagination'
        sx={[
          hideOn('up', 'lg'),
          {
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            marginTop: '10px',
          },
        ]}
      />

      <RootBlockHeaderLink
        to={`/services?group_id=${GUIDES_GROUP_ID}`}
        sx={[
          hideOn('up', 'lg'),
          {
            width: 'calc(100% - 60px)',
            textAlign: 'center !important',
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '30px',
            backgroundColor: '#296587',
            color: 'white !important',
          },
        ]}
      >
        Смотреть все
      </RootBlockHeaderLink>
    </Box>
  )
}

export const s = createStyles({
  block: {
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: '500px',
  },
  tilesContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: '30px',
  },
})
