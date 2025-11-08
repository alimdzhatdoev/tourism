import {FC} from 'react'
import {Tile, TileProps} from '../../_common'
import {Typography, TypographyProps} from '@mui/material'
import {asx, textEllipsis} from '@/core/utils'
import {styles as s} from './NewsTile.styles'
import {useNavigate} from 'react-router-dom'

interface NewsTileProp extends Omit<TileProps, 'slotProps'> {
  date?: TypographyProps['children']
  heading: TypographyProps['children']
  slotProps?: TileProps['slotProps'] &
    Partial<{
      date: Partial<TypographyProps>
      heading: Partial<TypographyProps>
    }>
}

export const NewsTile: FC<NewsTileProp> = ({
  date,
  heading,
  navigatePath,
  slotProps,
  sx,
  ...tileProps
}) => {
  const navigate = useNavigate()

  const handleClick = () => {
    if (navigatePath) navigate(navigatePath)
  }

  return (
    <Tile
      {...tileProps}
      onClick={handleClick}
      slotProps={{
        image: {
          ...slotProps?.image,
          sx: [s.image, ...asx(slotProps?.image?.sx)],
        },
        childrenContainer: {
          ...slotProps?.childrenContainer,
          sx: [s.childrenContainer, ...asx(slotProps?.childrenContainer?.sx)],
        },
      }}
      sx={[s.root, ...asx(sx)]}
    >
      {date ? (
        <Typography
          {...slotProps?.date}
          sx={[s.date, ...asx(slotProps?.date?.sx)]}
        >
          {date}
        </Typography>
      ) : null}

      <Typography
        {...slotProps?.heading}
        sx={[
          s.heading,
          textEllipsis({numberOfLines: 3}),
          ...asx(slotProps?.heading?.sx),
        ]}
      >
        {heading}
      </Typography>
    </Tile>
  )
}
