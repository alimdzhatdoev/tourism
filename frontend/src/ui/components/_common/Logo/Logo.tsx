import {FC, SVGProps} from 'react'
import {Box, BoxProps} from '@mui/material'
import {asx} from '@/core/utils'
import {styles as s} from './Logo.styles'
import {LogoIcon, LogoText, LogoTextContrast} from '@/assets/svg'

interface LogoProps extends Omit<BoxProps, 'children'> {
  variant?: 'primary' | 'text' | 'textContrast'
  slotProps?: Partial<{
    logoIcon: Partial<SVGProps<SVGSVGElement>>
    logotext: Partial<SVGProps<SVGSVGElement>>
  }>
}

export const Logo: FC<LogoProps> = ({
  variant = 'primary',
  slotProps,
  sx,
  ...boxProps
}) => {
  return (
    <Box sx={[s.root, ...asx(sx)]} {...boxProps}>
      {variant === 'primary' ? <LogoIcon {...slotProps?.logoIcon} /> : null}
      {variant === 'textContrast' ? (
        <LogoTextContrast {...slotProps?.logotext} />
      ) : (
        <LogoText {...slotProps?.logotext} />
      )}
    </Box>
  )
}
