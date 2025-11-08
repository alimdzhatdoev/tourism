import {FC} from 'react'
import {Tile, TileProps} from '../../_common'
import {Box, Typography, TypographyProps} from '@mui/material'
import {asx, colorScheme} from '@/core/utils'
import {APP_FONTS} from '@/ui/themes/baseTheme'
import {StarFill} from '@/assets/svg'
import {pluralize} from '@/core/utils/pluralize'
import {useNavigate} from 'react-router-dom'

export interface GuideTileProps
  extends Omit<TileProps, 'children' | 'slotProps'> {
  name: string
  rating?: number
  reviewsCount?: number
  navigatePath?: string
  slotProps?: TileProps['slotProps'] &
    Partial<{
      title: Partial<TypographyProps>
      text: Partial<TypographyProps>
    }>
}

export const GuideTile: FC<GuideTileProps> = ({
  name,
  slotProps,
  sx,
  rating,
  reviewsCount,
  navigatePath,
  ...tileProps
}) => {
  const navigate = useNavigate()

  return (
    <Tile
      onClick={navigatePath ? () => navigate(navigatePath) : undefined}
      {...tileProps}
      sx={[
        {
          position: 'relative',
          borderRadius: '24px',
          overflow: 'hidden',
        },
        ...asx(sx),
      ]}
      slotProps={{
        childrenContainer: {
          ...slotProps?.childrenContainer,
          sx: [
            {
              position: 'absolute',
              width: 'calc(100% - 42px)',
              height: 'calc(100% - 54px)',
              margin: '27px 21px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              alignItems: 'flex-start',
              gap: '20px',
            },
            ...asx(slotProps?.childrenContainer?.sx),
          ],
        },
        image: {
          ...slotProps?.image,
          sx: [
            {
              width: '100%',
              aspectRatio: 0.66,
              objectFit: 'cover',
            },
            ...asx(slotProps?.image?.sx),
          ],
        },
      }}
    >
      <Typography
        {...slotProps?.title}
        sx={[
          t => ({
            fontSize: '33px',
            lineHeight: '37px',
            fontFamily: APP_FONTS.oswald,
            textTransform: 'uppercase',
            fontWeight: 700,
            color: colorScheme(t).background.root,
            [t.breakpoints.down('lg')]: {
              fontSize: '22px',
              lineHeight: '33px',
            },
          }),
          ...asx(slotProps?.title?.sx),
        ]}
      >
        {name}
      </Typography>

      {rating || reviewsCount ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            fontSize: '20px',
            fontWeight: 500,
            color: t => colorScheme(t).background.root,
          }}
        >
          {rating ? (
            <Box
              sx={{
                display: 'flex',
                gap: '10px',
                alignItems: 'center',
              }}
            >
              <StarFill />
              <Typography fontSize='inherit' fontWeight='inherit'>
                {rating.toFixed(1).toString().replace('.', ',')}
              </Typography>
            </Box>
          ) : null}

          {reviewsCount ? (
            <Typography fontSize='inherit' fontWeight='inherit'>
              {pluralize(reviewsCount, 'отзыв', {
                one: '',
                few: 'а',
                many: 'ов',
              })}
            </Typography>
          ) : null}
        </Box>
      ) : null}
    </Tile>
  )
}
