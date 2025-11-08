import {FC, ReactNode} from 'react'
import {Box, BoxProps} from '@mui/material'
import {asx, colorScheme, rootStyle} from '@/core/utils'
import {layers} from '@/constants'

export interface PageWithStickyProps extends Omit<BoxProps, 'children'> {
  beforeSticky: ReactNode
  sticky: ReactNode
  paper: ReactNode
  slotProps?: Partial<{
    sticky: BoxProps
    paper: BoxProps
  }>
  edgeSize?: number
}

const DEFAULT_EDGE_SIZE = 12

export const PageWithSticky: FC<PageWithStickyProps> = ({
  sx,
  beforeSticky,
  sticky,
  paper,
  slotProps,
  edgeSize = DEFAULT_EDGE_SIZE,
  ...containerProps
}) => {
  return (
    <Box
      {...containerProps}
      sx={[
        t => ({
          ...rootStyle(t),
          display: 'flex',
          flexDirection: 'column',
        }),
        ...asx(sx),
      ]}
    >
      {beforeSticky}
      <Box
        {...slotProps?.sticky}
        sx={[
          t => ({
            display: 'none',
            [t.breakpoints.down('lg')]: {
              position: 'sticky',
              display: 'block',
              top: 0,
            },
          }),
          ...asx(slotProps?.sticky?.sx),
        ]}
      >
        {sticky}
      </Box>
      <Box
        {...slotProps?.paper}
        sx={[
          t => ({
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: colorScheme(t).background.root,
            zIndex: slotProps?.paper?.zIndex ?? layers.pageWithStickyPaper,
            [t.breakpoints.down('lg')]: {
              margin: `-${edgeSize ?? DEFAULT_EDGE_SIZE}px 0 0`,
              padding: `${edgeSize ?? DEFAULT_EDGE_SIZE}px 0 0`,
              borderTopLeftRadius: `${edgeSize ?? DEFAULT_EDGE_SIZE}px`,
              borderTopRightRadius: `${edgeSize ?? DEFAULT_EDGE_SIZE}px`,
            },
          }),
          ...asx(slotProps?.paper?.sx),
        ]}
      >
        {paper}
      </Box>
    </Box>
  )
}
