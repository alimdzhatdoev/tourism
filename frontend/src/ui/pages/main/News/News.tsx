import {FC} from 'react'
import {NewsTile} from '@/ui/components/_tiles'
import {Box, Skeleton, Typography} from '@mui/material'
import {useGetPostsListQuery} from '@/core/store/posts'
import dayjs from 'dayjs'
import {dateTimeFormats} from '@/constants'
import {useIsDownLg} from '@/core/hooks'
import {colorScheme, getIndexedArray, hideOn, rootStyle} from '@/core/utils'
import {APP_FONTS} from '@/ui/themes/baseTheme'
import {RootBlockHeaderLink} from '@/ui/components/_common/RootBlock/RootBlock'
import {Swiper, SwiperSlide} from 'swiper/react'
import {Pagination} from 'swiper/modules'

export const News: FC = () => {
  const isDownLg = useIsDownLg()

  const postsApi = useGetPostsListQuery({
    size: 3,
    filters: {section_slug: 'news'},
  })

  const posts = postsApi.data?.data.results ?? []

  if (!postsApi.isLoading && posts.length === 0) {
    return null
  }

  return (
    <Box
      sx={t => ({
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '64px',
        [t.breakpoints.down('lg')]: {
          padding: '10px 0',
          gap: '32px',
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
          Новости
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

        <RootBlockHeaderLink to='/news' sx={hideOn('down', 'lg')}>
          Смотреть все
        </RootBlockHeaderLink>
      </Box>

      <Box
        sx={[
          rootStyle,
          t => ({
            '& .swiper-slide': {
              width: '413px',
              height: '665px',
              [t.breakpoints.down('lg')]: {
                width: '290px',
                height: '460px',
              },
            },
          }),
        ]}
      >
        <Swiper
          modules={[...(isDownLg ? [Pagination] : [])]}
          spaceBetween={isDownLg ? '14px' : '30px'}
          slidesPerView={isDownLg ? 'auto' : 3}
          navigation={{
            prevEl: '#PlacesNavigationPrev',
            nextEl: '#PlacesNavigationNext',
          }}
          pagination={{clickable: true, el: '.news-pagination'}}
          slidesOffsetBefore={isDownLg ? 30 : 0}
          slidesOffsetAfter={isDownLg ? 30 : 0}
        >
          {posts.map(post => (
            <SwiperSlide key={post.id}>
              <NewsTile
                date={dayjs(post.createdDttm).format(dateTimeFormats.date)}
                heading={post.title}
                imageSrc={post.cover}
                navigatePath={`/news/${post.id}`}
                sx={{
                  width: '100%',
                  height: '100%',
                }}
              />
            </SwiperSlide>
          ))}

          {posts.length === 0
            ? getIndexedArray(3).map(item => (
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
        className='news-pagination'
        sx={[
          hideOn('up', 'lg'),
          {
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
          },
        ]}
      />

      <RootBlockHeaderLink
        to='/news'
        sx={[
          hideOn('up', 'lg'),
          {
            width: 'calc(100% - 60px)',
            textAlign: 'center !important',
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '30px',
          },
        ]}
      >
        Смотреть все
      </RootBlockHeaderLink>
    </Box>
  )
}
