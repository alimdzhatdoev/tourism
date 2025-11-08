import {FC, ReactNode, useMemo} from 'react'
import {RootBlock, RootBlockProps} from '..'
import {styles as s} from './GridBlock.styles'
import {asx} from '@/core/utils'
import {Skeleton, SkeletonProps} from '@mui/material'

export interface GridBlockProps extends Omit<RootBlockProps, 'slotProps'> {
  columns?: number
  isLoading?: boolean
  skeletonRows?: number
  fallback?: ReactNode
  slotProps?: RootBlockProps['slotProps'] &
    Partial<{
      skeleton: SkeletonProps
    }>
}

export const GridBlock: FC<GridBlockProps> = ({
  columns = 4,
  skeletonRows = 2,
  fallback = <></>,
  sx,
  children,
  isLoading = false,
  slotProps,
  ...rootBlockProps
}) => {
  const skeletonArray = useMemo(() => {
    return Array.from({length: columns * skeletonRows}, (_, i) => i + 1)
  }, [columns, skeletonRows])

  if (!children && !isLoading) {
    return fallback
  }

  return (
    <RootBlock
      sx={[
        s.root,
        {
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
        },
        ...asx(sx),
      ]}
      slotProps={{
        background: slotProps?.background,
        headerContainer: slotProps?.headerContainer,
        headerLink: slotProps?.headerLink,
        headerTitle: slotProps?.headerTitle,
      }}
      {...rootBlockProps}
    >
      {isLoading
        ? skeletonArray.map(key => (
            <Skeleton key={key} {...slotProps?.skeleton} />
          ))
        : children}
    </RootBlock>
  )
}
