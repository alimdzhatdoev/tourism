import { FC } from 'react'
import { PaginationBar } from '@/ui/components/_bars'
import { GridBlock, RootHeader } from '@/ui/components/_common'
import { NewsTile } from '@/ui/components/_tiles'
import { useBreakpointValues } from '@/core/hooks'
import { useSearchParams } from 'react-router-dom'
import { useGetPostsListQuery } from '@/core/store/posts'
import dayjs from 'dayjs'
import { dateTimeFormats } from '@/constants'
import { Typography } from '@mui/material'
import { APP_FONTS } from '@/ui/themes/baseTheme'

const QUERY_SIZE = 12
const DEFAULT_COLUMNS = 4

const HelpPage: FC = () => {
  const [searchParams] = useSearchParams()

  const postsApi = useGetPostsListQuery({
    page: parseInt(searchParams.get('page') || '1', 10),
    size: QUERY_SIZE,
    filters: {
      section_slug: 'for-tourists',
    },
  })

  const posts = postsApi.data?.data.results ?? []
  const count = postsApi.data?.data.pageCount

  const { value: columns } = useBreakpointValues(DEFAULT_COLUMNS, {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 3,
    xl: 3,
  })

  return (
    <>
      <RootHeader sx={{
        background: 'url(help_back.png)',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        maxWidth: '100%',
        margin: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        height: '600px',
        paddingTop: '50px'
      }} headerTitle='На помощь туристу' />

      <Typography
        sx={t => ({
          marginBottom: '64px',
          fontSize: '18px',
          fontWeight: 500,
          fontFamily: APP_FONTS.montserrat,
          maxWidth: '737px',
          textAlign: 'center',
          position: 'absolute',
          zIndex: '1',
          color: '#fff',
          top: 0,
          height: '600px',
          display: 'flex',
          alignItems: 'center',
          paddingTop: '250px',
          [t.breakpoints.down('lg')]: {
            fontSize: '14px',
            textAlign: 'left',
            padding: '0 30px',
            marginBottom: '30px',
          },
        })}
      >
        Специально для вас, мы создали раздел, в котором собрали всю полезную
        информацию, чтобы помочь сделать ваше путешествие по по нашей
        удивительной республике комфортным, интересным и незабываемым!
      </Typography>

      <GridBlock
        columns={columns}
        skeletonRows={QUERY_SIZE / columns}
        sx={{
          marginTop: '500px'
        }}
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
        isLoading={postsApi.isLoading}
      >
        {posts.map(post => (
          <NewsTile
            key={post.id}
            date={dayjs(post.createdDttm).format(dateTimeFormats.date)}
            heading={post.title}
            imageSrc={post.cover}
            navigatePath={`/help/${post.id}`}
          />
        ))}
      </GridBlock>

      <PaginationBar
        count={count}
        sx={t => ({
          margin: '42px 0 56px',
          [t.breakpoints.down('lg')]: {
            margin: '26px 0 34px',
          },
        })}
      />
    </>
  )
}

export default HelpPage
