import {FC, MouseEventHandler, useRef} from 'react'
import {Box, Button, ButtonProps, Typography} from '@mui/material'
import {Tile, TileProps} from '../../_common'
import {asx, formatMoney} from '@/core/utils'
import {styles as s} from './ExcursionTile.styles'

export interface ExcursionTileProps extends Omit<TileProps, 'width'> {
  name: string
  rating?: number | string
  minPrice?: number
  locationName?: string
  buttonCaption?: string
  noButton?: boolean
  buttonProps?: Partial<ButtonProps>
}

export const ExcursionTile: FC<ExcursionTileProps> = ({
  name,
  rating,
  minPrice,
  locationName,
  buttonCaption = 'Забронировать',
  noButton = false,
  disableImageMargin = true,
  buttonProps,
  ...tileProps
}) => {
  const tileRef = useRef<HTMLDivElement>(null)
  const handleClick: MouseEventHandler<HTMLButtonElement> = (...args) => {
    if (buttonProps?.onClick) {
      buttonProps.onClick(...args)
      return
    }
    if (tileProps.navigatePath) {
      tileRef.current?.click()
    }
  }

  return (
    <Tile
      ref={tileRef}
      disableImageMargin={disableImageMargin}
      slotProps={{
        image: {
          sx: [{maxHeight: '169px'}],
        },
      }}
      {...tileProps}
    >
      <Box sx={s.header}>
        {rating ? (
          <Typography sx={s.rating} fontWeight='inherit' color='inherit'>
            {rating}
          </Typography>
        ) : null}
        <Typography fontWeight='inherit' sx={s.name}>
          {name}
        </Typography>
      </Box>
      {locationName ? (
        <Typography sx={s.locationName}>{locationName}</Typography>
      ) : null}
      {minPrice ? (
        <Typography sx={s.minPrice}>
          от {formatMoney(minPrice)}
          <Typography component='span'>/чел</Typography>
        </Typography>
      ) : null}
      {!noButton ? (
        <Button
          variant='contained'
          {...buttonProps}
          onClick={handleClick}
          sx={[s.button, ...asx(buttonProps?.sx)]}
        >
          {buttonCaption}
        </Button>
      ) : null}
    </Tile>
  )
}
