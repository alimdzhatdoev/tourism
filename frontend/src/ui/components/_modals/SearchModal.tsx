import {FC, useMemo} from 'react'
import {ModalContent, ModalContentProps} from '../Modal'
import {ButtonBase, List, ListItem, TextField, Typography} from '@mui/material'
import {useGetAttractionsListQuery} from '@/core/store/attractions'
import {useGetRoutesListQuery} from '@/core/store/routes'
import {useDebounce} from '@/core/hooks'
import {skipToken} from '@reduxjs/toolkit/query'
import {useNavigate} from 'react-router-dom'
import {Attraction, Route} from '@/core/models'
import {GROUPS_IDS} from '@/constants'

export interface SearchModalProps extends ModalContentProps {}

export const SearchModal: FC<SearchModalProps> = ({onClose, ...props}) => {
  const [debouncedSearch, setSearch, search] = useDebounce('', 500)
  const navigate = useNavigate()
  const attractionsApi = useGetAttractionsListQuery(
    debouncedSearch
      ? {
          search: debouncedSearch,
          size: 5,
        }
      : skipToken,
  )

  const routesApi = useGetRoutesListQuery(
    debouncedSearch
      ? {
          search: debouncedSearch,
          size: 5,
        }
      : skipToken,
  )

  const results = useMemo(() => {
    return debouncedSearch
      ? [
          ...(attractionsApi.data?.data.results ?? []),
          ...(routesApi.data?.data.results ?? []),
        ]
      : []
  }, [attractionsApi.data, routesApi.data, debouncedSearch])

  const handleItemClick = (item: Attraction | Route) => {
    onClose?.()

    if (item instanceof Attraction) {
      if (item.groups.some(g => g.id in GROUPS_IDS)) {
        navigate(`/services/${item.id}`)
      } else {
        navigate(`/places/${item.id}`)
      }
    } else {
      navigate(`/routes/${item.id}`)
    }
  }

  return (
    <ModalContent title='Поиск' onClose={onClose} {...props}>
      <TextField
        fullWidth
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder='Введите название объекта или маршрута'
        sx={{}}
      />

      <List sx={{minHeight: '450px', overflow: 'auto'}}>
        {results.map(result => (
          <ListItem key={result.id}>
            <ButtonBase onClick={() => handleItemClick(result)}>
              {result.name}
            </ButtonBase>
          </ListItem>
        ))}

        {results.length === 0 &&
        !attractionsApi.isFetching &&
        !routesApi.isFetching &&
        !!debouncedSearch ? (
          <ListItem>
            <Typography>Ничего не найдено</Typography>
          </ListItem>
        ) : null}
      </List>
    </ModalContent>
  )
}
