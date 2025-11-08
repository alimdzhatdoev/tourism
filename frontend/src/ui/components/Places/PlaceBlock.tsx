import {rootStyle} from '@/core/utils'
import {APP_FONTS} from '@/ui/themes/baseTheme'
import {Box, Paper, Typography} from '@mui/material'
import {memo, FC, PropsWithChildren} from 'react'

type Props = {
  title: string
}

const PlaceBlockComponent: FC<PropsWithChildren<Props>> = ({
  children,
  title,
}) => {
  return (
    <Box
      sx={[
        rootStyle,
        t => ({
          display: 'flex',
          flexDirection: 'column',
          gap: '44px',
          marginTop: '64px',
          [t.breakpoints.down('lg')]: {
            marginTop: '0px',
            padding: '0 16px',
            marginBottom: '20px',
            gap: '16px',
          },
        }),
      ]}
    >
      <Box sx={{display: 'flex', alignItems: 'center', gap: '48px'}}>
        <Typography
          sx={[
            rootStyle,
            t => ({
              textTransform: 'uppercase',
              textAlign: 'left',
              fontSize: '36px',
              fontWeight: 700,
              fontFamily: APP_FONTS.oswald,
              [t.breakpoints.down('lg')]: {
                fontSize: '24px',
              },
            }),
          ]}
        >
          {title}
        </Typography>
      </Box>

      <Paper
        sx={t => ({
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0px 4px 46.4px 0px #B4B4B440',
          padding: '46px 54px',
          borderRadius: '20px',
          [t.breakpoints.down('lg')]: {
            padding: '22px 28px',
          },
        })}
      >
        {children}
      </Paper>
    </Box>
  )
}

export const PlaceBlock = memo(PlaceBlockComponent)
