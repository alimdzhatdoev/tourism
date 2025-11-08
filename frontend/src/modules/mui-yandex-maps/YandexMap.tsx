import {
  Fragment,
  ReactElement,
  ReactNode,
  useCallback,
  useRef,
  useState,
} from 'react'
import {Box, BoxProps, CircularProgress} from '@mui/material'
import {Map} from '@pbe/react-yandex-maps'
import {Map as MapInstance} from 'yandex-maps'
import {asx} from '@/core/utils'
import {config} from './YandexMapProvider.config'
import {MapProps, PlacemarkItemProps, PlacemarkProps} from './types'
import {Placemarks} from './Placemarks'
import {YMapsApi} from '@pbe/react-yandex-maps/typings/util/typing'
import {YandexMapProvider} from './YandexMapProvider'

export interface YandexMapProps<
  P extends unknown,
  T extends PlacemarkItemProps<P> = PlacemarkItemProps<P>,
> extends BoxProps {
  slotProps?: Partial<{map: MapProps; placemark: Partial<PlacemarkProps>}>
  onMapReady?: (value: MapInstance | null) => void
  preloader?: ReactNode
  isLoading?: boolean
  placemarks?: Array<T>
  renderIcon?: (props: T['iconProps']) => ReactElement
  backgroundColor?: string
}

export const YandexMap = <
  P extends unknown,
  T extends PlacemarkItemProps<P> = PlacemarkItemProps<P>,
>({
  onMapReady,
  preloader = (
    <CircularProgress
      sx={{
        position: 'absolute',
        zIndex: 9999,
        filter: 'blur(0)',
      }}
    />
  ),
  slotProps,
  children,
  isLoading = false,
  placemarks,
  renderIcon,
  backgroundColor,
  sx,
  ...containerProps
}: YandexMapProps<P, T>) => {
  const mapRef = useRef<MapInstance | null>(null)
  const [mapApi, setMapApi] = useState<YMapsApi | null>(null)
  const [isReady, setIsReady] = useState(false)

  const loadRef = useCallback((value: MapInstance) => {
    mapRef.current = value
    if (slotProps?.map?.instanceRef) {
      if (typeof slotProps?.map?.instanceRef === 'function') {
        slotProps.map.instanceRef(value)
      } else {
        slotProps.map.instanceRef.current = value
      }
    }
    setIsReady(true)
    onMapReady?.(mapRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const Wrapper = config.map.wrapped ? YandexMapProvider : Fragment

  return (
    <Wrapper>
      <Box
        {...containerProps}
        sx={[
          {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
          isLoading && {
            position: 'relative',
            '&:before': {
              position: 'absolute',
              content: '""',
              width: '100%',
              height: '100%',
              boxShadow: `0px 0px 5px 5px ${
                backgroundColor ?? '#FFFFFF'
              } inset`,
              zIndex: 9998,
              pointerEvents: 'none',
              borderRadius: '24px',
            },
            '& >*': {
              filter: 'blur(3px)',
            },
          },
          ...asx(config.map.sx),
          ...asx(sx),
        ]}
      >
        {!isReady ? preloader : null}
        {isLoading ? preloader : null}

        <Map
          {...slotProps?.map}
          onLoad={api => setMapApi(api)}
          instanceRef={loadRef}
          defaultState={{
            ...config.map.defaultState,
            ...slotProps?.map?.defaultState,
          }}
          style={{
            width: '100%',
            height: '100%',
            ...slotProps?.map?.style,
          }}
          defaultOptions={{
            ...config.map?.defaultOptions,
            ...slotProps?.map?.defaultOptions,
          }}
        >
          <Placemarks
            mapApi={mapApi}
            mapRef={mapRef}
            placemarks={placemarks}
            renderIcon={renderIcon}
          />
          {children}
        </Map>
      </Box>
    </Wrapper>
  )
}
