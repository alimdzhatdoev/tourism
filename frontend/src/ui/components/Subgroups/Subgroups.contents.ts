import {ExcursionsIcon, PlacesIcon, RoutesIcon} from '@/assets/svg'
import {FC, SVGProps} from 'react'

export const MENU_ITEMS: Array<{
  Icon: FC<SVGProps<SVGSVGElement>>
  path: string
  title: string
}> = [
  {Icon: PlacesIcon, path: '/places', title: 'Места'},
  {Icon: RoutesIcon, path: '/routes', title: 'Маршруты'},
  {Icon: ExcursionsIcon, path: '/excursions', title: 'Экскурсии'},
]
