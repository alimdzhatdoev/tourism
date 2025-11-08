import {FC, PropsWithChildren} from 'react'
import {TRoute} from 'types-common'
import {RoutesFactory} from './RoutesFactory/RoutesFactory'
import RouteIdPage from '@/ui/pages/routes/_id'
import MainPage from '@/ui/pages/main'
import AboutPage from '@/ui/pages/about'
import MapPage from '@/ui/pages/map'
import NewsPage from '@/ui/pages/news'
import NewsIdPage from '@/ui/pages/news/_id'
import ContactsPage from '@/ui/pages/contacts'
import ExcursionsPage from '@/ui/pages/excursions'
import RoutesPage from '@/ui/pages/routes'
import PlacesPage from '@/ui/pages/places'
import PlaceIdPage from '@/ui/pages/places/_id'
import ServicesPage from '@/ui/pages/services'
import HelpPage from '@/ui/pages/help'
import ProfilePage from '@/ui/pages/profile'
import ProfileEditPage from '@/ui/pages/profile/edit'
import ServicesIdPage from '@/ui/pages/services/_id'
import HelpIdPage from '@/ui/pages/help/_id'
import PrivacyPolicyPage from '@/ui/pages/privacy-policy'
import TermsOfUsePage from '@/ui/pages/terms-of-use'
import RoutePdfPage from '@/ui/pages/routes/pdf'

interface RouterProps {
  Layout?: FC<PropsWithChildren>
}

const ROUTES: TRoute[] = [
  {
    path: '/*',
    Component: MainPage,
  },
  {
    path: '/about',
    Component: AboutPage,
  },
  {
    path: '/map',
    Component: MapPage,
  },
  {
    path: '/news',
    Component: NewsPage,
  },
  {
    path: '/news/:id',
    Component: NewsIdPage,
  },
  {
    path: '/contacts',
    Component: ContactsPage,
  },
  {
    path: '/excursions',
    Component: ExcursionsPage,
  },
  {
    path: '/routes',
    Component: RoutesPage,
  },
  {
    path: '/routes/:id',
    Component: RouteIdPage,
  },
  {
    path: '/routes/:id/pdf',
    Component: RoutePdfPage,
  },
  {
    path: '/places',
    Component: PlacesPage,
  },
  {
    path: '/services',
    Component: ServicesPage,
  },
  {
    path: '/services/:id',
    Component: ServicesIdPage,
  },
  {
    path: '/places/:id',
    Component: PlaceIdPage,
  },
  {
    path: '/help',
    Component: HelpPage,
  },
  {
    path: '/help/:id',
    Component: HelpIdPage,
  },
  {
    path: '/profile',
    Component: ProfilePage,
  },
  {
    path: '/profile/edit',
    Component: ProfileEditPage,
  },
  {
    path: '/privacy-policy',
    Component: PrivacyPolicyPage,
  },
  {
    path: '/rules',
    Component: TermsOfUsePage,
  },
]

export const Router: FC<RouterProps> = ({Layout}) => {
  return <RoutesFactory routes={ROUTES} Layout={Layout} />
}
