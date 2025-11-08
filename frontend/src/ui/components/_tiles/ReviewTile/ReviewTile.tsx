import {FC} from 'react'
import {Tile, TileProps} from '../../_common'
import {Typography, TypographyProps} from '@mui/material'
import {styles as s} from './ReviewTile.styles'
import {Rating, RatingProps} from '../..'
import {asx} from '@/core/utils'

export interface ReviewTileProps extends TileProps {
  rating: number
  name?: string
  text: string
  date: string
  slotProps?: Partial<{
    rating: Partial<RatingProps>
    name: Partial<TypographyProps>
    text: Partial<TypographyProps>
    date: Partial<TypographyProps>
  }> &
    TileProps['slotProps']
}

export const ReviewTile: FC<ReviewTileProps> = ({
  rating,
  name,
  text,
  date,
  slotProps,
  ...tileProps
}) => {
  return (
    <Tile
      {...tileProps}
      sx={[s.root, ...asx(tileProps?.sx)]}
      extraSlots={{
        beforeChildrenContainer: rating ? (
          <Rating rating={rating} sx={s.rating} />
        ) : null,
        ...tileProps?.extraSlots,
      }}
      slotProps={{
        childrenContainer: slotProps?.childrenContainer,
        image: slotProps?.image,
      }}
    >
      <Typography
        {...slotProps?.name}
        sx={[
          s.name,
          !name && {
            opacity: 0.4,
          },
          ...asx(slotProps?.name?.sx),
        ]}
      >
        {name ?? 'Аноним'}
      </Typography>
      <Typography
        {...slotProps?.name}
        sx={[s.date, ...asx(slotProps?.date?.sx)]}
      >
        {date}
      </Typography>
      <Typography
        {...slotProps?.text}
        sx={[s.text, ...asx(slotProps?.text?.sx)]}
      >
        {text}
      </Typography>
    </Tile>
  )
}
