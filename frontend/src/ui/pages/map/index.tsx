import {FC} from 'react'
import {Typography, useTheme} from '@mui/material'
import {SearchBar} from '@/ui/components/_bars'
import {styles as s} from './index.styles'
import {RootBlock, RootHeader} from '@/ui/components/_common'
import {useGetAttractionsListQuery} from '@/core/store/attractions'
import {useNavigate, useSearchParams} from 'react-router-dom'
import {colorScheme} from '@/core/utils'
import {PlaceIcon} from '@/ui/components/_map-icons'
import {YandexMap} from '@/modules/mui-yandex-maps'
import {Subgroups} from '@/ui/components'

const MapPage: FC = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const {data, isFetching} = useGetAttractionsListQuery({
    size: 9999,
    search: searchParams.get('search') ?? undefined,
    filters: {
      subgroup_id: searchParams.get('subgroup_id') ?? undefined,
    },
    expand: {
      photos: true,
      location: true,
    },
  })

  const placemarks =
    data?.data.results.map(p => ({
      iconProps: p.placeIconProps,
      id: p.id,
      width: 400,
      height: 100,
      onClick: () => navigate(`/places/${p.id}`),
      defaultGeometry: p.location.placemarkGeometry,
    })) ?? []

  return (
    <>
      <RootHeader headerTitle='Карта' sx={{alignItems: 'center'}} />
      <Typography sx={s.textContent}>
        Мы собрали все локации в одном месте, чтобы вам было удобно планировать
        маршруты, экскурсии и свой отдых в Карачаево-Черкесской Республике
      </Typography>
      <SearchBar sx={{margin: '36px 0'}} />
      <Subgroups
        onSubgroupClick={subgroup => {
          setSearchParams(params => {
            params.set('subgroup_id', subgroup.id.toString())
            return params
          })
        }}
        onDismissClick={() => {
          setSearchParams(params => {
            params.delete('subgroup_id')
            return params
          })
        }}
        activeId={searchParams.get('subgroup_id') ?? undefined}
        sx={{marginBottom: '30px', marginTop: '5px'}}
      />
      <RootBlock>
        <YandexMap
          backgroundColor={colorScheme(theme).background.root}
          placemarks={placemarks}
          renderIcon={PlaceIcon}
          isLoading={isFetching}
        />
      </RootBlock>
    </>
  )
}

export default MapPage
