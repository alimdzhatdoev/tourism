import {FC, useState} from 'react'
import {Add, Remove} from '@mui/icons-material'
import {Box, BoxProps, IconButton, Typography} from '@mui/material'
import {asx, casx, colorScheme} from '@/core/utils'

interface CountControlProps extends Omit<BoxProps, 'onChange'> {
  initialValue?: number
  negative?: boolean
  limits?: [number, number | undefined]
  disabled?: boolean
  onChange?: (newValue: number) => void
}

export const CountControl: FC<CountControlProps> = ({
  initialValue = 1,
  negative = false,
  limits = [initialValue, Infinity],
  disabled = false,
  onChange,
  sx,
  ...containerProps
}) => {
  const [count, setCount] = useState<number>(initialValue)

  const handleClick = (action: 'increase' | 'decrease') => () => {
    const [startLimit, endLimit] = limits

    let newValue = count

    if (action === 'increase') {
      newValue += 1
      if (endLimit && newValue > endLimit) return
    }

    if (action === 'decrease') {
      newValue -= 1
      if (newValue < startLimit) return
      if (newValue < 0 && !negative) return
    }

    onChange?.(newValue)
    setCount(newValue)
  }

  return (
    <Box
      sx={[
        t => ({
          minWidth: '91px',
          height: '34px',
          backgroundColor: colorScheme(t).background.card,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: '30px',
          padding: '0 6px',
        }),
        ...asx(sx),
      ]}
      {...containerProps}
    >
      <IconButton onClick={handleClick('decrease')} disabled={disabled}>
        <Remove />
      </IconButton>
      <Typography
        sx={[
          {padding: '0 6px'},
          ...casx(disabled, t => ({color: colorScheme(t).text.dimmed})),
        ]}
      >
        {count}
      </Typography>
      <IconButton onClick={handleClick('increase')} disabled={disabled}>
        <Add />
      </IconButton>
    </Box>
  )
}
