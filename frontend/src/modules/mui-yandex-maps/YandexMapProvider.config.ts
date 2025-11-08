import {getRuntimeEnv} from 'vite-runtime-env-script-plugin/getRuntimeEnv'
import {MuiYmapsConfig} from './types'

const MAP_API_KEY = getRuntimeEnv('YANDEX_MAP_API_KEY')
const SUGGEST_API_KEY = getRuntimeEnv('YANDEX_SUGGEST_API_KEY')

export const config: MuiYmapsConfig = {
  provider: {
    query: {
      load: 'package.search',
      apikey: MAP_API_KEY,
      suggest_apikey: SUGGEST_API_KEY,
    },
  },
  map: {
    wrapped: true,
    defaultState: {
      center: [43.292185, 41.628479],
      controls: [],
      zoom: 14,
    },
    defaultOptions: {
      maxZoom: 14,
    },
    sx: {
      width: '100%',
      height: '540px',
      overflow: 'hidden',
      borderRadius: '24px',

      '& .ymaps-2-1-79-map-bg': {
        backgroundImage: 'none !important',
      },
      '& .ymaps-2-1-79-gotoymaps__container, .ymaps-2-1-79-copyright, .ymaps-2-1-79-gototech, .ymaps-2-1-79-map-copyrights-promo':
        {
          display: 'none !important',
        },
    },
  },
}
