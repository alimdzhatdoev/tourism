import { FC, useMemo } from 'react'
import { PaginationBar } from '@/ui/components/_bars'
import { PlaceTile } from '@/ui/components/_tiles'
import {
  DraggableBox,
  GridBlock,
  MobileLink,
  RootHeader,
} from '@/ui/components/_common'
import { useGetAttractionsListQuery } from '@/core/store/attractions'
import { useSearchParams } from 'react-router-dom'
import { useBreakpointValues } from '@/core/hooks'
import { useGetSubgroupQuery } from '@/core/store/subgroups'
import { Box, Button, Typography } from '@mui/material'
import { APP_FONTS } from '@/ui/themes/baseTheme'
import { GROUPS_IDS } from '@/constants'
import { hideOn, rootStyle } from '@/core/utils'

const QUERY_SIZE = 12
const DEFAULT_COLUMNS = 4

export const SERVICES_FILTERS: Array<{ group_id: number; title: string }> = [
  { group_id: GROUPS_IDS.guides, title: 'Гиды' },
  { group_id: GROUPS_IDS.hotels, title: 'Гостиницы' },
  { group_id: GROUPS_IDS.equipment, title: 'Прокат оборудования' },
  { group_id: GROUPS_IDS.restaurants, title: 'Кафе-рестораны' },
  { group_id: GROUPS_IDS.museums, title: 'Музеи' },
  { group_id: GROUPS_IDS.fuel_stations, title: 'АЗС' },
]

const ServicesPage: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { data, isFetching } = useGetAttractionsListQuery({
    page: parseInt(searchParams.get('page') || '1', 10),
    search: searchParams.get('search') ?? undefined,
    size: QUERY_SIZE,
    expand: {
      photos: true,
    },
    filters: {
      group_id: searchParams.get('group_id') ?? undefined,
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
    data?.data.results.map(a => ({
      ...a.placeTileProps,
      id: a.id,
      navigatePath: `/services/${a.id}`,
    })) ?? []

  const count = data?.data.pageCount

  const screenWidth = window.innerWidth;
  return (
    <>
      <RootHeader
        sx={{
          alignItems: 'center',
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
        headerTitle={subgroupName ?? 'Сервисы и услуги'}
      />

      <Box
        sx={[
          rootStyle,
          hideOn('down', 'lg'),
          {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '25px',
            marginBottom: '64px',
            marginTop: screenWidth >= 1200 ? '500px' : '290px'
          },
        ]}
      >
        {SERVICES_FILTERS.map(filter => (
          <Button
            key={filter.group_id}
            variant={
              searchParams.get('group_id') === filter.group_id.toString()
                ? 'contained'
                : 'outlined'
            }
            sx={[
              { minWidth: '288px', height: '53px', fontSize: '16px' },
              searchParams.get('group_id') !== filter.group_id.toString() && {
                color: t => t.palette.text.primary,
              },
              searchParams.get('group_id') === filter.group_id.toString() && {
                backgroundColor: '#296587 !important',
              },
            ]}
            onClick={() =>
              setSearchParams(prev => {
                prev.set('page', '1')
                prev.set('group_id', filter.group_id.toString())
                return prev
              })
            }
          >
            {filter.title}
          </Button>
        ))}
      </Box>

      <DraggableBox
        sx={[
          hideOn('up', 'lg'),
          {
            display: 'flex',
            gap: '12px',
            width: '100%',
            paddingLeft: '30px',
            paddingRight: '30px',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            marginBottom: '30px',
            marginTop: '300px'
          },
        ]}
      >
        {SERVICES_FILTERS.map(filter => (
          <MobileLink
            key={filter.group_id}
            to={`/services?group_id=${filter.group_id}`}
            sx={[
              window.location.search.includes(filter.group_id.toString()) && {
                backgroundColor: '#296587',
                color: 'white !important',
              },
            ]}
          >
            {filter.title}
          </MobileLink>
        ))}
      </DraggableBox>

      <Typography
        sx={t => ({
          marginBottom: '64px',
          fontSize: '18px',
          fontWeight: 500,
          fontFamily: APP_FONTS.montserrat,
          maxWidth: '737px',
          textAlign: 'center',
          [t.breakpoints.down('lg')]: {
            fontSize: '14px',
            textAlign: 'left',
            padding: '0 30px',
            marginBottom: '30px',
          },
        })}
      >
        Здесь вы сможете найти идеального проводника, который сделает вашу
        поездку незабываемой и познавательной! Все наши гиды являются
        аккредитованными специалистами, любящими родной край и глубоко
        погруженные в его историю.
      </Typography>

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
        isLoading={isFetching}
      >
        {places.map(props => (
          <PlaceTile {...props} key={props.key} />
        ))}
      </GridBlock>

      {places.length ? (
        <PaginationBar
          count={count}
          sx={t => ({
            margin: '42px 0 56px',
            [t.breakpoints.down('lg')]: {
              margin: '26px 0 34px',
            },
          })}
        />
      ) : null}
    </>
  )
}

export default ServicesPage
