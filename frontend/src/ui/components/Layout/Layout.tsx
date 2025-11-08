import {FC, PropsWithChildren} from 'react'
import {Box} from '@mui/material'
import {styles as s} from './Layout.styles'
import {Header} from './Header/Header'
import {Footer} from './Footer/Footer'
import {useLocation} from 'react-router-dom'

export const Layout: FC<PropsWithChildren> = ({children}) => {
  const {pathname} = useLocation()
  const isPdf = pathname.includes('pdf')
  return (
    <Box sx={s.root}>
      {!isPdf ? <Header /> : null}
      <Box sx={s.page}>{children}</Box>
      {!isPdf ? <Footer /> : null}
    </Box>
  )
}
