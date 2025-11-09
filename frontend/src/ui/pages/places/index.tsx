import { FC, useMemo } from 'react'
import { PaginationBar } from '@/ui/components/_bars'
import { PlaceTile } from '@/ui/components/_tiles'
import { GridBlock, RootHeader } from '@/ui/components/_common'
import { useGetAttractionsListQuery } from '@/core/store/attractions'
import { useSearchParams } from 'react-router-dom'
import { useBreakpointValues } from '@/core/hooks'
import { useGetSubgroupQuery } from '@/core/store/subgroups'
import { Typography } from '@mui/material'
import { APP_FONTS } from '@/ui/themes/baseTheme'

const QUERY_SIZE = 12
const DEFAULT_COLUMNS = 4

const PlacesPage: FC = () => {
  const [searchParams] = useSearchParams()
  const { data, isFetching } = useGetAttractionsListQuery({
    page: parseInt(searchParams.get('page') || '1', 10),
    search: searchParams.get('search') ?? undefined,
    size: QUERY_SIZE,
    expand: { photos: true, location: true, reviews: true },
    filters: {
      subgroup_id: searchParams.get('subgroup_id') ?? undefined,
    },
  })

  const subgroupsApi = useGetSubgroupQuery(
    {
      id: +searchParams.get('subgroup_id')!,
    },
    {
      skip: !searchParams.get('subgroup_id'),
    },
  )

  const subgroupName = useMemo(
    () => subgroupsApi?.data?.data.name,
    [subgroupsApi],
  )

  const { value: columns } = useBreakpointValues(DEFAULT_COLUMNS, {
    xs: 2,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 4,
  })

  const places =
    data?.data.results.map(a => ({ ...a.placeTileProps, id: a.id })) ?? []

  const count = data?.data.pageCount

  return (
    <>
      <RootHeader
        sx={{
          alignItems: 'center',
          background: 'url(places_back.png)',
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
        }}
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
        headerTitle={subgroupName ?? 'Интересные места'}
      />

      <Typography
        sx={t => ({
          marginBottom: '64px',
          fontSize: '18px',
          fontWeight: 500,
          fontFamily: APP_FONTS.montserrat,
          maxWidth: '100%',
          textAlign: 'center',
          position: 'absolute',
          zIndex: '1',
          color: '#fff',
          top: 0,
          height: '600px',
          display: 'flex',
          alignItems: 'center',
          paddingTop: '200px',

          [t.breakpoints.down('lg')]: {
            fontSize: '14px',
            textAlign: 'left',
            padding: '0 30px',
            marginBottom: '30px',
          },
        })}
      >
        Мы собрали самые удивительные места нашей <br /> республики, которые вы просто обязаны посетить!
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
        isLoading={isFetching}
      >
        {places.map(props => (
          <PlaceTile {...props} key={props.key} />
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

export default PlacesPage
