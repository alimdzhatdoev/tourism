import { FC } from 'react'
import { OrderingBar, PaginationBar } from '@/ui/components/_bars'
import { GridBlock, RootHeader } from '@/ui/components/_common'
import { NewsTile } from '@/ui/components/_tiles'
import { useBreakpointValues } from '@/core/hooks'
import { useSearchParams } from 'react-router-dom'
import { useGetPostsListQuery } from '@/core/store/posts'
import dayjs from 'dayjs'
import { dateTimeFormats } from '@/constants'

const QUERY_SIZE = 12
const DEFAULT_COLUMNS = 4

const NewsPage: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const postsApi = useGetPostsListQuery({
    page: parseInt(searchParams.get('page') || '1', 10),
    size: QUERY_SIZE,
    filters: {
      section_slug: 'news',
      ordering: (searchParams.get('ordering') as any) ?? undefined,
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

  const screenWidth = window.innerWidth;
  return (
    <>
      <RootHeader sx={{
        background: 'url(news_back.png)',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        maxWidth: '100%',
        margin: 0,
        marginTop: '0 !important',
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        height: screenWidth >= 1200 ? '600px' : '340px',
        paddingTop: screenWidth >= 1200 ? '100px' : '50px'
      }} headerTitle='Новости' />

      <OrderingBar
        slotProps={{
          select: {
            onChange: e => {
              setSearchParams(p => {
                p.set('ordering', e.target.value as string)
                return p
              })
            },
          },
        }}
        sx={{ margin: screenWidth >= 1200 ? '500px 0 50px' : '290px 0 50px' }}
      />

      <GridBlock
        columns={columns}
        skeletonRows={QUERY_SIZE / columns}
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
        {[...posts]
          .sort((a, b) => {
            const dateA = +new Date(a.createdDttm)
            const dateB = +new Date(b.createdDttm)

            if (searchParams.get('ordering') === 'created_dttm') {
              return dateB - dateA
            } else if (searchParams.get('ordering') === '-created_dttm') {
              return dateA - dateB
            }
            return dateB - dateA
          })
          .map(post => (
            <NewsTile
              key={post.id}
              date={dayjs(post.createdDttm).format(dateTimeFormats.date)}
              heading={post.title}
              imageSrc={post.cover}
              navigatePath={`/news/${post.id}`}
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

export default NewsPage
