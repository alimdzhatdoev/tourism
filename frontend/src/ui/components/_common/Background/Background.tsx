import {CSSProperties, FC} from 'react'
import {Box, BoxProps, Theme} from '@mui/material'
import {styles as s} from './Background.styles'
import {asx} from '@/core/utils'

export interface BackgroundProps extends BoxProps {
  color?: (
    theme: Theme,
  ) => CSSProperties['backgroundColor'] | CSSProperties['backgroundColor']
}

export const Background: FC<BackgroundProps> = ({
  sx,
  color: backgroundColor,
  ...props
}) => {
  return <Box sx={[s.root, {backgroundColor}, ...asx(sx)]} {...props} />
}
