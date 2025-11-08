import {miscStateSelector} from '@/core/store/misc'
import {FC, ReactElement} from 'react'
import {useSelector} from 'react-redux'
import {Navigate} from 'react-router-dom'

interface Props {
  children: NonNullable<ReactElement>
  /**
   * @default '/'
   */
  redirectPath?: string
}

export const PrivateRoute: FC<Props> = ({children, redirectPath = '/'}) => {
  const {isAuthorized} = useSelector(miscStateSelector)

  if (!isAuthorized) {
    return <Navigate to={redirectPath} />
  }

  return children
}
