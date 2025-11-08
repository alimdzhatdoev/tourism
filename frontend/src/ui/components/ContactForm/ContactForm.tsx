import {FC} from 'react'
import {Box, BoxProps, Button, Typography} from '@mui/material'
import {styles as s} from './ContactForm.styles'
import {asx} from '@/core/utils'
import {FormField} from '../_common'
import {FormikHelpers, useFormik} from 'formik'
import * as yup from 'yup'
import InputMask from '@/modules/input-mask-adapted'

interface ContactFormProps extends BoxProps {
  title?: string
  text?: string
  noTitle?: boolean
}

interface FormikData {
  name: string
  phone: string
  question: string
}

export const PHONE_MASK = '+7 (999) 999-9999'

const validationSchema = yup.object().shape({
  name: yup.string().required('Введите ваше имя'),
  phone: yup
    .string()
    .required('Укажите телефон')
    .test({
      test: v => v.length === PHONE_MASK.length,
      message: 'Укажите телефон',
    }),
  question: yup.string().required('Введите ваше сообщение'),
})

const initialValues: FormikData = {
  name: '',
  phone: '',
  question: '',
}

export const ContactForm: FC<ContactFormProps> = ({
  title = 'Оставить заявку',
  text = 'Наши менеджеры всегда готовы ответить на любые ваши вопросы и подобрать подходящий тур',
  sx,
  noTitle,
  ...boxProps
}) => {
  const handleFormikSubmit = async (
    values: FormikData,
    {resetForm, setErrors, setTouched}: FormikHelpers<FormikData>,
  ) => {
    // eslint-disable-next-line no-console
    console.log(values)
    try {
      resetForm()
      setErrors({
        name: undefined,
        phone: undefined,
        question: undefined,
      })
      setTouched({
        name: undefined,
        phone: undefined,
        question: undefined,
      })
    } catch (error) {
      console.error(error)
    }
  }

  const {
    values,
    errors,
    touched,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useFormik<FormikData>({
    initialValues,
    validationSchema,
    onSubmit: handleFormikSubmit,
    validateOnBlur: false,
  })

  return (
    <Box sx={[s.root, ...asx(sx)]} {...boxProps}>
      <Box sx={s.form}>
        {!noTitle ? <Typography sx={s.formTitle}>{title}</Typography> : null}
        <Typography sx={s.formText}>{text}</Typography>
        <FormField
          name='name'
          placeholder='Имя'
          type='text'
          value={values.name}
          error={touched.name && !!errors.name}
          helperText={errors.name}
          onBlur={handleBlur}
          onChange={handleChange}
          fullWidth
          sx={{'& fieldset': {borderColor: 'transparent !important'}}}
        />
        <InputMask
          mask={PHONE_MASK}
          maskChar=''
          value={values.phone}
          onBlur={handleBlur}
          onChange={handleChange}
        >
          {() => (
            <FormField
              name='phone'
              placeholder='Телефон'
              type='phone'
              autoComplete='tel'
              error={touched.phone && !!errors.phone}
              helperText={errors.phone}
              sx={{'& fieldset': {borderColor: 'transparent !important'}}}
              fullWidth
            />
          )}
        </InputMask>
        <FormField
          name='question'
          placeholder='Ваш вопрос'
          type='text'
          value={values.question}
          error={touched.question && !!errors.question}
          helperText={errors.question}
          onBlur={handleBlur}
          onChange={handleChange}
          sx={{'& fieldset': {borderColor: 'transparent !important'}}}
          fullWidth
          multiline
        />
        <Button
          variant='contained'
          onClick={() => handleSubmit()}
          disabled={!isValid}
          sx={s.formButton}
        >
          Отправить
        </Button>
      </Box>
    </Box>
  )
}
