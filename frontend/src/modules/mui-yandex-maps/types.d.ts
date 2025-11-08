import {SxProps} from '@mui/material'
import {Theme} from '@mui/system'
import {Map, Placemark, YMaps} from '@pbe/react-yandex-maps'

export type MapProps = Parameters<typeof Map>[0]

export type YMapsProps = Parameters<typeof YMaps>[0]

export interface PlacemarkData {
  id: number | string
}

export type PlacemarkProps = Parameters<typeof Placemark>[0]

export interface PlacemarkItemProps<T extends unknown> extends PlacemarkProps {
  onClick?: (data: T) => void
  iconProps: T
  height: number
  width: number
  id: string | number
}

export interface MuiYmapsConfig {
  provider: {
    query: NonNullable<YMapsProps['query']>
  }
  map: {
    wrapped?: boolean
    defaultState: NonNullable<MapProps['defaultState']>
    sx?: SxProps<Theme>
    placemarkIdPrefix?: string
    defaultOptions?: MapProps['defaultOptions']
  }
}
