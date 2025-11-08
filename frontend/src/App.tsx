import {FC, useEffect} from 'react'
import {ThemeProvider, CssBaseline} from '@mui/material'
import {lightTheme} from '@/ui/themes'
import {Layout, Router} from '@/ui/components'
import {useSelector} from 'react-redux'
import {miscStateSelector, setMiscState} from './core/store/misc'
import {useLazyGetMeQuery} from './core/store/users'
import {appStorage, handleError} from './core/utils'
import dayjsRuLocale from 'dayjs/locale/ru'
import dayjs from 'dayjs'

dayjs.locale(dayjsRuLocale)

const {read} = appStorage()

export const App: FC = () => {
  const {isAuthorized} = useSelector(miscStateSelector)
  const [userApi] = useLazyGetMeQuery()

  useEffect(() => {
    const tokens = read('tokens')
    if (tokens) setMiscState({isAuthorized: true})
  }, [])

  useEffect(() => {
    const setUser = async () => {
      try {
        const {data} = await userApi({}).unwrap()
        setMiscState({user: data})
      } catch (error) {
        handleError(error)
      }
    }

    if (isAuthorized) {
      setUser()
    } else {
      setMiscState({user: null})
    }
  }, [isAuthorized, userApi])

  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <Router Layout={Layout} />
    </ThemeProvider>
  )
}
