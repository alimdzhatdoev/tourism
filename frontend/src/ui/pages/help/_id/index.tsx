import {FC} from 'react'
import {Box, Divider, Typography} from '@mui/material'
import {useParams} from 'react-router-dom'
import {GridBlock, RootBlock, RootHeader} from '@/ui/components/_common'
import {colorScheme, createStyles} from '@/core/utils'
import {APP_FONTS} from '@/ui/themes/baseTheme'
import {NewsTile} from '@/ui/components/_tiles'
import {useGetPostQuery, useGetPostsListQuery} from '@/core/store/posts'
import dayjs from 'dayjs'
import {dateTimeFormats} from '@/constants'
import {useIsDownLg} from '@/core/hooks'
import {Swiper, SwiperSlide} from 'swiper/react'
import {Pagination} from 'swiper/modules'

const HelpIdPage: FC = () => {
  const params = useParams<string>()
  const isDownLg = useIsDownLg()

  const id = parseInt(params.id ?? '0', 10) || 0

  const postApi = useGetPostQuery({
    id,
  })

  const post = postApi.data?.data

  const postsApi = useGetPostsListQuery({
    size: 3,
    filters: {
      section_slug: 'for-tourists',
    },
  })

  const recommended = postsApi.data?.data.results.filter(p => p.id !== id) ?? []

  if (!post) {
    return <RootBlock isLoading={postApi.isLoading} />
  }

  return isDownLg ? (
    <>
      <Box component='img' src={post.cover} sx={s.image} />
      <Box
        sx={{
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          backgroundColor: 'white',
          padding: '30px 0',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          width: '100%',
        }}
      >
        <Typography
          variant='h1'
          sx={{
            textTransform: 'uppercase',
            textAlign: 'left',
            fontSize: '24px',
            fontWeight: 700,
            fontFamily: APP_FONTS.oswald,
            width: '100%',
            padding: '0 30px',
          }}
        >
          {post.title}
        </Typography>

        <Typography sx={s.date}>
          {dayjs(post.createdDttm).format(dateTimeFormats.date)}
        </Typography>

        <Divider sx={{margin: '0 30px'}} />

        <Typography sx={s.text}>{post.text}</Typography>

        {recommended?.length ? (
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '30px',
              marginTop: '10px',
            }}
          >
            <Typography
              sx={{
                textTransform: 'uppercase',
                textAlign: 'left',
                fontSize: '24px',
                padding: '0 30px',
                fontWeight: 700,
                fontFamily: APP_FONTS.oswald,
              }}
            >
              СМОТРИТЕ ТАКЖЕ
            </Typography>

            <Box
              sx={{
                width: '100%',
                '& .swiper-pagination': {
                  bottom: '-10px',
                  overflow: 'visible',
                },
                '& .swiper-slide': {
                  width: '330px',
                  // height: '425px',
                },
              }}
            >
              <Swiper
                modules={[Pagination]}
                spaceBetween='24px'
                slidesPerView='auto'
                pagination={{el: '.news-pagination'}}
                slidesOffsetBefore={30}
                loop
              >
                {recommended.map(p => (
                  <SwiperSlide key={p.id}>
                    <NewsTile
                      key={p.id}
                      date={dayjs(p.createdDttm).format(dateTimeFormats.date)}
                      heading={p.title}
                      imageSrc={p.cover}
                      navigatePath={`/news/${p.id}`}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </Box>

            <Box
              className='news-pagination'
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: '10px',
                marginBottom: '40px',
              }}
            />
          </Box>
        ) : null}
      </Box>
    </>
  ) : (
    <RootHeader
      headerTitle={post.title}
      links={[{to: '/news', name: 'Новости'}]}
    >
      <Typography sx={s.date}>
        {dayjs(post.createdDttm).format(dateTimeFormats.date)}
      </Typography>

      <Box>
        <Box component='img' src={post.cover} sx={s.image} />
        <Typography sx={s.text}>{post.text}</Typography>
      </Box>

      <Typography
        sx={{
          textTransform: 'uppercase',
          fontSize: '60px',
          lineHeight: '72px',
          fontFamily: APP_FONTS.oswald,
          fontWeight: 500,
          marginTop: '100px',
          marginBottom: '80px',
        }}
      >
        СМОТРИТЕ ТАКЖЕ
      </Typography>

      <GridBlock
        columns={3}
        skeletonRows={1}
        slotProps={{
          skeleton: {
            sx: t => ({
              height: '437px',
              [t.breakpoints.down('lg')]: {
                height: '307px',
              },
            }),
          },
        }}
      >
        {recommended.map(p => (
          <NewsTile
            key={p.id}
            date={dayjs(p.createdDttm).format(dateTimeFormats.date)}
            heading={p.title}
            imageSrc={p.cover}
            navigatePath={`/news/${p.id}`}
          />
        ))}
      </GridBlock>
    </RootHeader>
  )
}

const s = createStyles({
  date: t => ({
    margin: '0 0 33px',
    color: colorScheme(t).text.dimmed,
    textAlign: 'center',
    fontSize: '24px',
    fontWeight: 500,
    [t.breakpoints.down('lg')]: {
      fontSize: '16px',
      lineHeight: '24px',
      textAlign: 'left',
      margin: '0',
      padding: '0 30px',
    },
  }),
  text: t => ({
    padding: '32px 51px 0 32px',
    fontSize: '20px',
    lineHeight: '30px',
    whiteSpace: 'pre-line',
    [t.breakpoints.down('lg')]: {
      fontSize: '14px',
      lineHeight: '20px',
      padding: '0 30px',
    },
  }),
  image: t => ({
    margin: '0px 59px 59px 0',
    width: '100%',
    borderRadius: '12px',
    aspectRatio: 619 / 319,
    maxWidth: '619px',
    float: 'left',
    [t.breakpoints.down('lg')]: {
      margin: '0',
      maxWidth: '100%',
      float: 'none',
      borderRadius: '0px',
      marginBottom: '-20px',
    },
  }),
})

export default HelpIdPage
