import {ChangeEvent, FC, KeyboardEventHandler, useState} from 'react'
import {ModalContent, ModalContentProps} from '../Modal'
import {Button, TextField, TextFieldProps} from '@mui/material'

export interface SetValueModalProps extends ModalContentProps {
  title: string
  textFieldProps?: TextFieldProps
  initialValue?: string
  onSave: (value: string) => void
  validate?: (value: string) => boolean
}

type State = {
  value: string
  isValid: boolean
}

export const SetValueModal: FC<SetValueModalProps> = ({
  onClose,
  textFieldProps,
  title,
  initialValue,
  validate,
  onSave,
  ...props
}) => {
  const [state, setState] = useState<State>({
    value: initialValue ?? '',
    isValid: validate?.(initialValue ?? '') ?? true,
  })

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setState(prev => ({
      value: event.target.value,
      isValid: validate?.(event.target.value) ?? prev.isValid,
    }))
  }

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = event => {
    if (event.key === 'Enter' && state.isValid) {
      onSave(state.value)
      onClose?.()
    }
  }

  const handleSaveClick = () => {
    onSave(state.value)
    onClose?.()
  }

  return (
    <ModalContent onClose={onClose} title={title} {...props}>
      <TextField
        autoFocus
        variant='outlined'
        fullWidth
        {...textFieldProps}
        value={state.value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />

      <Button
        variant='outlined'
        sx={{marginTop: '24px', color: 'black'}}
        onClick={handleSaveClick}
        disabled={!state.isValid}
      >
        Сохранить
      </Button>
    </ModalContent>
  )
}
