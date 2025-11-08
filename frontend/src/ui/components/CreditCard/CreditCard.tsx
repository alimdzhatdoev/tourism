import {
  ChangeEvent,
  FC,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react'
import {
  Box,
  BoxProps,
  TextField,
  TextFieldProps,
  Typography,
} from '@mui/material'
import InputMask from '@/modules/input-mask-adapted'
import {asx, casx, colorScheme} from '@/core/utils'
import {Nullable} from 'types-helpers'

const CardField: FC<TextFieldProps> = ({
  label,
  InputProps,
  inputProps,
  ...props
}) => (
  <Box>
    <Typography
      sx={{fontSize: '14px', lineHeight: '18px', marginBottom: '4px'}}
    >
      {label}
    </Typography>
    <TextField
      InputProps={{
        ...InputProps,
        sx: [
          {
            backgroundColor: 'transparent',
          },
          ...asx(InputProps?.sx),
        ],
      }}
      inputProps={{
        ...inputProps,
        sx: [{padding: '10px 18px !important'}, ...asx(inputProps?.sx)],
      }}
      {...props}
    />
  </Box>
)

export interface CreditCardData {
  number: string
  term: string
  cvv: string
}

const INITIAL_CREDIT_CARD_DATA: CreditCardData = {
  number: '',
  term: '',
  cvv: '',
}

const CREDIT_CARD_MASKS: Record<keyof CreditCardData, string> = {
  number: '9999 9999 9999 9999',
  term: '99/99',
  cvv: '999',
}

export interface CreditCardRef {
  validate: (dataToValidate?: Nullable<CreditCardData>) => boolean
}
export interface CreditCardProps extends Omit<BoxProps, 'onChange'> {
  initialData?: CreditCardData
  onChange?: (newValue: CreditCardData, isValid?: boolean) => void
  disabled?: boolean
}
export const CreditCard = forwardRef<CreditCardRef, CreditCardProps>(
  (
    {
      initialData = INITIAL_CREDIT_CARD_DATA,
      disabled = false,
      onChange,
      sx,
      ...containerProps
    },
    ref,
  ) => {
    const [data, setData] = useState<CreditCardData>(initialData)
    const [errors, setErrors] = useState<Array<keyof CreditCardData>>([])

    const validate = useCallback(
      (dataToValidate?: Nullable<CreditCardData>) => {
        let newErrors = [...errors]

        if (!dataToValidate) {
          newErrors = Object.keys(data) as typeof errors
        } else {
          let key: keyof typeof dataToValidate
          for (key in dataToValidate) {
            if (
              dataToValidate[key].length < CREDIT_CARD_MASKS[key].length &&
              !newErrors.includes(key)
            ) {
              newErrors = [...newErrors, key]
            } else if (
              dataToValidate[key].length === CREDIT_CARD_MASKS[key].length
            ) {
              newErrors = newErrors.filter(error => error !== key)
            }
          }
        }

        setErrors(newErrors)

        return newErrors.length === 0
      },
      [data, errors],
    )

    const setCardData =
      (field: keyof CreditCardData) =>
      (event: ChangeEvent<HTMLInputElement>) => {
        const newValue = {...data, [field]: event.target.value}
        setData(newValue)
        onChange?.(newValue)
      }

    useImperativeHandle(
      ref,
      () => ({
        validate,
      }),
      [validate],
    )

    return (
      <Box
        sx={[
          t => ({
            width: '330px',
            padding: '12px',
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: colorScheme(t).background.card,
            gap: '16px',
          }),
          ...casx(disabled, {pointerEvents: 'none'}),
          ...asx(sx),
        ]}
        {...containerProps}
      >
        <InputMask
          mask={CREDIT_CARD_MASKS.number}
          maskChar=''
          value={data.number}
          onChange={setCardData('number')}
          disabled={disabled}
        >
          {() => (
            <CardField
              label='Номер карты'
              placeholder='0000 0000 0000 0000'
              error={errors.includes('number')}
              fullWidth
            />
          )}
        </InputMask>
        <Box sx={{display: 'flex', gap: '5px'}}>
          <InputMask
            mask={CREDIT_CARD_MASKS.term}
            maskChar=''
            value={data.term}
            onChange={setCardData('term')}
            disabled={disabled}
          >
            {() => (
              <CardField
                label='Cрок действия'
                placeholder='00/00'
                error={errors.includes('term')}
              />
            )}
          </InputMask>
          <InputMask
            mask={CREDIT_CARD_MASKS.cvv}
            maskChar=''
            value={data.cvv}
            onChange={setCardData('cvv')}
            disabled={disabled}
          >
            {() => (
              <CardField
                label='СVV/CVC'
                placeholder='000'
                type='password'
                error={errors.includes('cvv')}
              />
            )}
          </InputMask>
        </Box>
      </Box>
    )
  },
)
