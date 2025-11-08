import {CSSProperties} from 'react'
import {Breakpoint, SxProps, Theme} from '@mui/material'
import {DESKTOP_MAX_WIDTH, colors} from '@/constants'

type TStyleObject = Record<string, SxProps<Theme> | CSSProperties>

export const createStyles = <T = TStyleObject>(style: T): T => style

/**
 *  Array from SX.
 *
 *  **Important:** remember to spread the return value if nested in array.
 */
export const asx = <T extends SxProps<Theme>>(sx?: T) => {
  if (!sx) return [{}]
  return Array.isArray(sx) ? (sx as T[]) : ([sx] as T[])
}

/**
 *  Conditional array from SX.
 *
 *  **Important:** remember to spread the return value if nested in array.
 */
export const casx = <T extends SxProps<Theme>, E extends SxProps<Theme>>(
  condition?: any,
  thenSx?: T,
  elseSx?: E,
) => {
  return condition ? asx(thenSx) : asx(elseSx || {})
}

export const textEllipsis = (
  options?: Partial<{
    numberOfLines: number
    wordWrap: CSSProperties['wordWrap']
  }>,
) => ({
  textOverflow: 'ellipsis',
  display: '-webkit-box !important',
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  WebkitLineClamp: `${options?.numberOfLines ?? 1}`,
  wordWrap: options?.wordWrap ?? 'break-word',
})

export const hideNumberControls = () => ({
  '& input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
    WebkitAppearance: 'none',
    margin: 0,
  },
  '& input[type=number]': {
    MozAppearance: 'textfield',
  },
})

export const hideScrollbar = () => ({
  '::-webkit-scrollbar': {
    width: 0,
    background: 'transparent',
    display: 'none',
  },
  scrollbarWidth: 'none',
})

export const rootStyle = (theme: Theme) => {
  return {
    width: '100%',
    maxWidth: `min(${DESKTOP_MAX_WIDTH}px, 100%)`,
    [theme.breakpoints.down('lg')]: {
      maxWidth: '100%',
    },
  }
}

export const colorScheme = (theme: Theme) => {
  return colors[theme.palette.mode]
}

export const bluredBackground = ({
  zIndex = 1,
}: Partial<{
  zIndex: number
}> = {}) => {
  return {
    position: 'relative',
    // overflow: 'hidden',
    zIndex,
    '&::after': {
      content: '" "',
      position: 'absolute',
      inset: 0,
      zIndex: zIndex - 2,
      mask: 'radial-gradient(black 35%, transparent)',
      backdropFilter: 'blur(20px)',
      width: '120%',
      height: '120%',
      top: '-10%',
      left: '-10%',
    },
  }
}

/**
 *  Display properties depending on breakpoint condition.
 */
export const hideOn = (
  condition: 'up' | 'down',
  breakpoint: Breakpoint,
  display: 'flex' | 'block' | 'grid' = 'flex',
) => {
  return {
    display: (theme: Theme) => {
      const targetIndex = theme.breakpoints.keys.indexOf(breakpoint)
      const compare = (curInd: number, tarInd: number) =>
        condition === 'up' ? curInd >= tarInd : curInd < tarInd

      return theme.breakpoints.keys.reduce(
        (acc, cur, index) => ({
          ...acc,
          [cur]: compare(index, targetIndex) ? 'none' : display,
        }),
        {...theme.breakpoints.values},
      )
    },
  }
}

export const px = (value?: number) => `${value}px`
