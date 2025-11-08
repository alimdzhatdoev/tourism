import {useForwardedRef} from '@core/hooks'
import {Box, BoxProps} from '@mui/material'
import {MutableRefObject, forwardRef} from 'react'
import {useDraggable} from 'react-use-draggable-scroll'

export interface DraggableBoxProps extends Omit<BoxProps, 'ref'> {}

export const DraggableBox = forwardRef<HTMLDivElement, DraggableBoxProps>(
  (props, ref) => {
    const innerRef = useForwardedRef<HTMLDivElement>(ref)

    const {events} = useDraggable(
      innerRef as MutableRefObject<HTMLDivElement>,
      {
        applyRubberBandEffect: true,
      },
    )

    return <Box ref={innerRef} {...props} {...events} />
  },
)
