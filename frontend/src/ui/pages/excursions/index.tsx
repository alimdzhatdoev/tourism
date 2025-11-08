import {FC} from 'react'
import {ContactForm} from '@/ui/components'
import {PaginationBar, SearchBar} from '@/ui/components/_bars'
import {ExcursionTile} from '@/ui/components/_tiles'
import {GridBlock, RootHeader} from '@/ui/components/_common'
import {useGetExcursionsListQuery} from '@/core/store/excursions'
import {useSearchParams} from 'react-router-dom'
import {useBreakpointValues} from '@/core/hooks'

const QUERY_SIZE = 12
const DEFAULT_COLUMNS = 4

const ExcursionsPage: FC = () => {
  const [searchParams] = useSearchParams()
  const {data, isFetching} = useGetExcursionsListQuery({
    page: parseInt(searchParams.get('page') || '1', 10),
    search: searchParams.get('search') ?? undefined,
    size: QUERY_SIZE,
    expand: {
      route__photos: true,
      attraction__photos: true,
    },
  })

  const {value: columns} = useBreakpointValues(DEFAULT_COLUMNS, {
    xs: 2,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 4,
  })

  const excursions =
    data?.data.results.map(e => ({...e.excursionTileProps, key: e.id})) ?? []

  const count = data?.data.pageCount

  return (
    <>
      <RootHeader
        sx={{alignItems: 'center'}}
        slotProps={{
          headerContainer: {
            sx: t => ({
              [t.breakpoints.down('lg')]: {
                alignItems: 'flex-start',
              },
            }),
          },
          headerTitle: {
            sx: t => ({
              [t.breakpoints.down('lg')]: {
                textAlign: 'left',
              },
            }),
          },
        }}
        headerTitle='Популярные экскурсии'
      />

      <SearchBar
        sx={t => ({
          margin: '16px 0 36px',
          [t.breakpoints.down('lg')]: {
            margin: '0 0 36px',
          },
        })}
      />

      <GridBlock
        isLoading={isFetching}
        slotProps={{
          skeleton: {
            sx: t => ({
              height: '299px',
              [t.breakpoints.down('lg')]: {
                height: '274px',
              },
            }),
          },
        }}
        columns={columns}
        skeletonRows={QUERY_SIZE / columns}
      >
        {excursions.map(({key, ...props}) => (
          <ExcursionTile key={key} {...props} />
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

      <ContactForm
        sx={{
          width: '100%',
        }}
      />
    </>
  )
}

export default ExcursionsPage
