import {colorScheme} from '@/core/utils'
import {useTheme} from '@mui/material'
import {DetailedHTMLProps, HTMLAttributes, ImgHTMLAttributes} from 'react'

export interface PlaceIconProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  imageSrc: DetailedHTMLProps<
    ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >['src']
  name: string
  coordinates?: [number, number]
}

export const PlaceIcon = ({
  imageSrc,
  name,
  style,
  ...props
}: PlaceIconProps) => {
  const theme = useTheme()
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '300px',
        height: '80px',
        backgroundColor: colorScheme(theme).background.root,
        borderRadius: '20px',
        overflow: 'hidden',
        color: colorScheme(theme).text.primary,
        boxShadow: theme.shadows[3],
        ...style,
      }}
      {...props}
    >
      <img
        src={imageSrc}
        alt=''
        style={{
          height: '80px',
          width: '80px',
          aspectRatio: 1,
          borderRadius: '20px',
          objectFit: 'cover',
        }}
        width='80px'
        height='80px'
      />
      <p style={{padding: '10px', textTransform: 'uppercase', fontWeight: 700}}>
        {name}
      </p>
    </div>
  )
}
