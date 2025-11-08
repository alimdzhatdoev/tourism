import {asx, rootStyle} from '@/core/utils'
import {Box, BoxProps} from '@mui/material'
import {FC} from 'react'

export const BarWrapper: FC<BoxProps> = ({children, sx, ...props}) => {
  return (
    <Box
      sx={[
        rootStyle,
        t => ({
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          [t.breakpoints.down('lg')]: {
            padding: '0 30px',
          },
        }),
        ...asx(sx),
      ]}
      {...props}
    >
      {children}
    </Box>
  )
}
