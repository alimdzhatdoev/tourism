import {FC} from 'react'
import {Tile, TileProps} from '../../_common'
import {asx, colorScheme} from '@/core/utils'
import {Typography, TypographyProps} from '@mui/material'

export interface BookingTileProps extends Omit<TileProps, 'slotProps'> {
  name: string
  hint: string
  slotProps?: TileProps['slotProps'] &
    Partial<{
      name: TypographyProps
      hint: TypographyProps
    }>
}
export const BookingTile: FC<BookingTileProps> = ({
  name,
  hint,
  sx,
  slotProps,
  children,
  ...tileProps
}) => {
  return (
    <Tile
      disableImageMargin
      sx={[
        {
          flexDirection: 'row !important',
        },
        ...asx(sx),
      ]}
      {...tileProps}
      slotProps={{
        image: {
          ...slotProps?.image,
          sx: [
            {
              maxWidth: '96px !important',
              margin: '0 !important',
              borderRadius: '12px',
            },
            ...asx(slotProps?.image?.sx),
          ],
        },
        childrenContainer: {
          ...slotProps?.childrenContainer,
          sx: [
            {
              margin: '8px 8px 8px 20px !important',
              gap: '8px',
              justifyContent: 'center',
            },
            ...asx(slotProps?.childrenContainer?.sx),
          ],
        },
      }}
    >
      <Typography
        {...slotProps?.name}
        sx={[
          {
            fontWeight: 700,
            fontSize: '20px',
            lineHeight: '24px',
            color: 'inherit',
            width: '100%',
          },
          ...asx(slotProps?.name),
        ]}
      >
        {name}
      </Typography>
      <Typography
        {...slotProps?.hint}
        sx={[
          t => ({
            fontSize: '14px',
            color: colorScheme(t).text.dimmed,
            width: '100%',
          }),
          ...asx(slotProps?.hint),
        ]}
      >
        {hint}
      </Typography>
      {children}
    </Tile>
  )
}
