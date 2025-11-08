import {FC, ReactNode, JSX} from 'react'
import InputMask, {Props as InputMaskProps} from 'react-input-mask'

interface Props extends Omit<InputMaskProps, 'children'> {
  children?: (inputProps: any) => JSX.Element
}

export const InputMaskAdapted: FC<Props> = ({children, ...props}) => {
  return <InputMask {...props}>{children as ReactNode}</InputMask>
}
