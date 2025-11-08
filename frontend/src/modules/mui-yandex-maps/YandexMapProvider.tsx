import {FC} from 'react'
import {YMaps} from '@pbe/react-yandex-maps'
import {config} from './YandexMapProvider.config'
import {YMapsProps} from './types'

export interface YandexMapProviderProps extends YMapsProps {}

export const YandexMapProvider: FC<YandexMapProviderProps> = ({
  query,
  ...props
}) => {
  return (
    <YMaps
      query={{
        ...config?.provider?.query,
        ...query,
      }}
      {...props}
    />
  )
}
