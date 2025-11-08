import {useMediaQuery, useTheme} from '@mui/material'

export const useIsDownLg = () => {
  const theme = useTheme()
  return useMediaQuery(theme.breakpoints.down('lg'))
}
