import {MutableRefObject, ReactElement, useCallback, useEffect} from 'react'
import {Clusterer, Placemark} from '@pbe/react-yandex-maps'
import {Map as MapInstance} from 'yandex-maps'
import {renderToString} from 'react-dom/server'
import {PlacemarkItemProps} from './types'
import {YMapsApi} from '@pbe/react-yandex-maps/typings/util/typing'

export interface PlacemarksProps<
  P extends unknown,
  T extends PlacemarkItemProps<P>,
> {
  placemarks?: Array<T>
  onAllLoaded?: () => void
  onMount?: () => void
  renderIcon?: (props: P) => ReactElement
  mapRef?: MutableRefObject<MapInstance | null>
  mapApi?: YMapsApi | null
}

export const DEFAULT_PLACEMARK_ID_PREFIX: string = 'placemark'

export const Placemarks = <P extends unknown, T extends PlacemarkItemProps<P>>({
  placemarks = [],
  renderIcon,
  onMount,
  onAllLoaded,
  mapRef,
  mapApi,
}: PlacemarksProps<P, T>) => {
  const createLayout = useCallback(
    (props: T) => {
      if (!mapApi || !renderIcon) return undefined
      const htmlMarkup = renderToString(renderIcon(props.iconProps))
      const layout = (mapApi.templateLayoutFactory as any).createClass(
        htmlMarkup,
        {
          build: function () {
            layout.superclass.build.call(this)
            this.getData().options.set('shape', {
              type: 'Rectangle',
              coordinates: [
                [0, props.height],
                [props.width, 0],
              ],
            })
          },
        },
      )
      return layout
    },
    [mapApi, renderIcon],
  )

  const handleAllLoaded = (index: number) => () => {
    if (index + 1 === placemarks?.length) {
      onAllLoaded?.()
      const bounds = mapRef?.current?.geoObjects.getBounds()
      if (bounds) mapRef?.current?.setBounds(bounds, {useMapMargin: true})
    }
  }

  useEffect(() => {
    onMount?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Clusterer
      options={{
        preset: 'islands#darkBlueClusterIcons',
      }}
    >
      {placemarks?.map(({iconProps, ...props}, index) => (
        <Placemark
          {...props}
          key={props.id}
          defaultOptions={{
            iconLayout: createLayout({iconProps, ...props} as T),
            ...props?.defaultOptions,
          }}
          onLoad={handleAllLoaded(index)}
          properties={{
            ...props?.properties,
            events: {
              ...props?.properties?.events,
              add: {
                click: () => {
                  props.placemarkProps.onClick?.(props.iconProps)
                },
                ...props?.properties?.events?.add,
              },
            },
          }}
        />
      ))}
    </Clusterer>
  )
}
