import {TLink} from 'types-common'
import {GROUPS_IDS} from './api'

export const HEADER_LINKS: Array<TLink> = [
  {title: 'О регионе', path: '/about'},
  {title: 'Маршруты', path: '/routes'},
  {title: 'Интересные места', path: '/places'},
  {title: 'Новости', path: '/news'},
  {title: 'На помощь туристу', path: '/help'},
  {
    title: 'Сервисы и услуги',
    path: '/services',
    search: `?group_id=${GROUPS_IDS.guides}`,
  },
]

export const FOOTER_COLUMNS_LINKS: Array<TLink> = [
  {title: 'О регионе', path: '/about'},
  {title: 'Маршруты', path: '/routes'},
  {title: 'Интересные места', path: '/places'},
  {title: 'Новости', path: '/news'},
  {
    title: 'Сервисы и услуги',
    path: '/services',
    search: `?group_id=${GROUPS_IDS.guides}`,
  },
  {title: 'Экскурсии', path: '/excursions'},
  {title: 'Популярное', path: '/popular'},
  {title: 'Карта', path: '/map'},
]

export const APPSTORE_LINK = '/appstore_link'

export const GOOGLE_PLAY_LINK = '/google_play_link'

export const FOOTER_MISC_LINKS: Array<TLink> = [
  {title: 'Политика обработки персональных данных', path: '/privacy-policy'},
  {title: 'Правила использования сервиса', path: '/rules'},
]
