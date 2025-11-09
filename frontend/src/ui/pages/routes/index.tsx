import { FC } from 'react'
import { PaginationBar } from '@/ui/components/_bars'
import { RouteTile } from '@/ui/components/_tiles'
import {
  DraggableBox,
  GridBlock,
  ListSelect,
  MobileLink,
  RootHeader,
} from '@/ui/components/_common'
import { useGetRoutesListQuery } from '@/core/store/routes'
import { useSearchParams } from 'react-router-dom'
import { useBreakpointValues, useRouteLike } from '@/core/hooks'
import { casx, hideOn } from '@/core/utils'
import { BarWrapper } from '@/ui/components/_bars/BarWrapper'
import { Box, Slider, Typography } from '@mui/material'
import { RouteSeason } from '@/core/models'

const QUERY_SIZE = 18
const DEFAULT_COLUMNS = 4

const SEASON_FILTERS: Array<{ value: RouteSeason | 'no_filter'; title: string }> =
  [
    { value: 'all', title: 'Все сезоны' },
    { value: 'autumn', title: 'Осень' },
    { value: 'spring', title: 'Весна' },
    { value: 'summer', title: 'Лето' },
    { value: 'winter', title: 'Зима' },
  ]

const TRANSPORTATION_FILTERS: Array<{
  value: string
  title: string
}> = [
    { value: 'no_filter', title: 'Любой способ передвижения' },
    { value: 'is_on_horseback', title: 'Верхом' },
    { value: 'is_on_quad_bike', title: 'Квадроцикл' },
    { value: 'is_on_foot', title: 'Пешком' },
    { value: 'is_on_car', title: 'Автомобиль' },
  ]

const TYPE_FILTERS: Array<{
  value: string
  title: string
}> = [
    { value: 'no_filter', title: 'Любой тип' },
    { value: 'is_family', title: 'Семейные' },
  ]

const RoutesPage: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const maxDifficulty = searchParams.get('max_difficulty')
  const minDifficulty = searchParams.get('min_difficulty')

  const { data, isFetching } = useGetRoutesListQuery({
    page: parseInt(searchParams.get('page') || '1', 10),
    search: searchParams.get('search') ?? undefined,
    filters: {
      season: (searchParams.get('season') as RouteSeason) || undefined,
      is_on_car:
        searchParams.get('transportation') === 'is_on_car' ? 'True' : undefined,
      is_on_horseback:
        searchParams.get('transportation') === 'is_on_horseback'
          ? 'True'
          : undefined,
      is_on_quad_bike:
        searchParams.get('transportation') === 'is_on_quad_bike'
          ? 'True'
          : undefined,
      is_on_foot:
        searchParams.get('transportation') === 'is_on_foot'
          ? 'True'
          : undefined,

      is_family: searchParams.get('type') === 'is_family' ? 'True' : undefined,
      max_difficulty: maxDifficulty ? Number(maxDifficulty) : undefined,
      min_difficulty: minDifficulty ? Number(minDifficulty) : undefined,
    },
    size: QUERY_SIZE,
    expand: {
      photos: true,
    },
  })

  const { value: columns } = useBreakpointValues(DEFAULT_COLUMNS, {
    xs: 1,
    sm: 1,
    md: 2,
    lg: 2,
    xl: 2,
  })

  const { toggleLike } = useRouteLike()

  const routes =
    data?.data.results.map(r => ({ ...r.routeTileProps, id: r.id })) ?? []

  const count = data?.data.pageCount

  const screenWidth = window.innerWidth;

  return (
    <>
      <RootHeader
        sx={{
          alignItems: 'center',
          background: 'url(routes_back.png)',
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
        headerTitle='Маршруты'
      />

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
            marginTop: screenWidth >= 1200 ? '600px' : '290px',
          },
        ]}
      >
        <MobileLink
          sx={[
            !window.location.search && {
              backgroundColor: '#296587',
              color: 'white !important',
            },
          ]}
          to='/routes'
        >
          Все
        </MobileLink>
        <MobileLink
          sx={[
            window.location.search.includes('winter') && {
              backgroundColor: '#296587',
              color: 'white !important',
            },
          ]}
          to='/routes?season=winter'
        >
          Зима
        </MobileLink>
        <MobileLink
          sx={[
            window.location.search.includes('spring') && {
              backgroundColor: '#296587',
              color: 'white !important',
            },
          ]}
          to='/routes?season=spring'
        >
          Весна
        </MobileLink>
        <MobileLink
          sx={[
            window.location.search.includes('summer') && {
              backgroundColor: '#296587',
              color: 'white !important',
            },
          ]}
          to='/routes?season=summer'
        >
          Лето
        </MobileLink>
        <MobileLink
          sx={[
            window.location.search.includes('autumn') && {
              backgroundColor: '#296587',
              color: 'white !important',
            },
          ]}
          to='/routes?season=autumn'
        >
          Осень
        </MobileLink>
      </DraggableBox>

      <BarWrapper
        sx={[
          hideOn('down', 'lg'),
          {
            marginBottom: '64px',
            justifyContent: 'space-between',
            width: '100%',
            marginTop: '500px'
          },
        ]}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography textTransform='uppercase'>Сложность</Typography>
          <Box sx={{ width: '280px' }}>
            <Slider
              sx={{
                '& .MuiSlider-mark': {
                  display: 'none',
                },
                '& .MuiSlider-rail': {
                  height: '10px',
                  bgcolor: t => t.palette.grey[400],
                },
                '& .MuiSlider-track': {
                  height: '10px',
                  bgcolor: t => t.palette.text.primary,
                  borderTopRightRadius: 'unset',
                  borderBottomRightRadius: 'unset',
                },
                '& .MuiSlider-thumb': {
                  width: '2px',
                  height: '22px',
                  borderRadius: 'unset',
                  bgcolor: t => t.palette.text.primary,
                },
              }}
              valueLabelDisplay='auto'
              marks={Array.from({ length: 10 }, (_, i) => ({
                label: i + 1,
                value: i + 1,
              }))}
              defaultValue={1}
              min={1}
              max={5}
              onChange={(_, v) => {
                if (!Array.isArray(v)) {
                  setSearchParams(p => {
                    p.set('max_difficulty', v.toString())
                    return p
                  })
                }
              }}
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: '28px' }}>
          <ListSelect
            items={SEASON_FILTERS}
            value={searchParams.get('season') ?? 'all'}
            onChange={v =>
              setSearchParams(p => {
                if (v.target.value !== 'no_filter') {
                  p.set('season', v.target.value as string)
                } else {
                  p.delete('season')
                }
                return p
              })
            }
          />
          <ListSelect
            items={TRANSPORTATION_FILTERS}
            value={searchParams.get('transportation') ?? 'no_filter'}
            onChange={v =>
              setSearchParams(p => {
                if (v.target.value !== 'no_filter') {
                  p.set('transportation', v.target.value as string)
                } else {
                  p.delete('transportation')
                }
                return p
              })
            }
          />
          <ListSelect
            items={TYPE_FILTERS}
            value={searchParams.get('type') ?? 'no_filter'}
            onChange={v =>
              setSearchParams(p => {
                if (v.target.value !== 'no_filter') {
                  p.set('type', v.target.value as string)
                } else {
                  p.delete('type')
                }
                return p
              })
            }
          />
        </Box>
      </BarWrapper>

      <GridBlock
        columns={columns}
        skeletonRows={QUERY_SIZE / columns}
        slotProps={{
          skeleton: {
            sx: [
              ...casx(columns === 3, {
                height: '388px',
              }),
              ...casx(columns === 2, {
                height: '351px',
              }),
            ],
          },
        }}
        isLoading={isFetching}
      >
        {routes
          .filter(route => {
            const seasonFilter = searchParams.get('season')
            if (seasonFilter !== 'all') return true
            if (seasonFilter && seasonFilter !== 'all') {
              if (route && route.properties?.season !== seasonFilter) {
                return false
              }
            }

            const transportationFilter = searchParams.get('transportation')
            if (transportationFilter && transportationFilter !== 'no_filter') {
              const propertyKey =
                transportationFilter as keyof typeof route.properties
              if (!route.properties?.[propertyKey]) {
                return false
              }
            }

            const typeFilter = searchParams.get('type')
            if (typeFilter && typeFilter !== 'no_filter') {
              if (typeFilter === 'is_family' && !route.properties?.isFamily) {
                return false
              }
            }

            const currentMaxDifficulty = searchParams.get('max_difficulty')
            if (
              currentMaxDifficulty &&
              route.difficulty.id > Number(currentMaxDifficulty)
            ) {
              return false
            }

            const currentMinDifficulty = searchParams.get('min_difficulty')
            if (
              currentMinDifficulty &&
              route.difficulty.id < Number(currentMinDifficulty)
            ) {
              return false
            }

            return true
          })
          .map(({ id, ...props }) => (
            <RouteTile
              onHeartClick={() => toggleLike({ id, isLiked: props.isFavorite })}
              key={id}
              {...props}
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

export default RoutesPage
