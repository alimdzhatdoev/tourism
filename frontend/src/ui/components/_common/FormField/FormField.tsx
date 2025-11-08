import {FC} from 'react'
import {InputAdornment, TextField, TextFieldProps, Tooltip} from '@mui/material'
import {InfoRounded} from '@mui/icons-material'

export const FormField: FC<TextFieldProps> = ({
  error,
  helperText,
  ...props
}) => (
  <TextField
    error={error}
    InputProps={{
      endAdornment: error ? (
        <InputAdornment position='end'>
          <Tooltip placement='right' title={helperText}>
            <InfoRounded color='error' />
          </Tooltip>
        </InputAdornment>
      ) : null,
    }}
    {...props}
  />
)
