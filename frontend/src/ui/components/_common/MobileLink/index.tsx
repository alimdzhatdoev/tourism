import {FC} from 'react'
import {Typography, TypographyProps} from '@mui/material'
import {Link} from 'react-router-dom'
import {asx} from '@/core/utils'
import {APP_FONTS} from '@/ui/themes/baseTheme'

export const MobileLink: FC<TypographyProps<typeof Link>> = ({
  sx,
  ...props
}) => {
  return (
    <Typography
      component={Link}
      sx={[
        t => ({
          fontSize: '14px',
          padding: '13px 20px',
          backgroundColor: t.palette.grey[200],
          borderRadius: '10px',
          textTransform: 'none !important',
          fontFamily: APP_FONTS.montserrat,
          fontWeight: 600,
          minWidth: 'fit-content',
        }),
        ...asx(sx),
      ]}
      {...props}
    />
  )
}
