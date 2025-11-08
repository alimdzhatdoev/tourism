import {FC, PropsWithChildren, useEffect} from 'react'
import {useLocation} from 'react-router-dom'

export const ScrollWrapper: FC<PropsWithChildren> = ({children}) => {
  const {pathname} = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return children
}
