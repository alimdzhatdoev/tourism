import {FC} from 'react'
import {BoxProps} from '@mui/material'
import {OrderingSelect, ListSelectProps} from '../../_common'
import {BarWrapper} from '../BarWrapper'
import {asx} from '@/core/utils'

interface OrderingBarProps extends BoxProps {
  slotProps?: Partial<{
    select: Partial<ListSelectProps>
  }>
}

export const OrderingBar: FC<OrderingBarProps> = ({
  slotProps,
  sx,
  ...containerProps
}) => {
  return (
    <BarWrapper
      sx={[{justifyContent: 'space-between'}, ...asx(sx)]}
      {...containerProps}
    >
      <OrderingSelect {...slotProps?.select} />
    </BarWrapper>
  )
}
