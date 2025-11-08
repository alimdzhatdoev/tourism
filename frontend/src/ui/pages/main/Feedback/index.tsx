import {FC, useState} from 'react'
import {colorScheme, createStyles, rootStyle} from '@/core/utils'
import {APP_FONTS} from '@/ui/themes/baseTheme'
import {alpha, Box, Button, Typography} from '@mui/material'
import {FormikHelpers, useFormik} from 'formik'
import * as yup from 'yup'
import {FormField} from '@/ui/components/_common'
import InputMask from '@/modules/input-mask-adapted'
import {Link} from 'react-router-dom'
import {LocationMarkerFill, Phone, Tg, Vk} from '@/assets/svg'
import {useCreateFeedbackMutation} from '@/core/store/feedbacks'
import {toast} from 'react-toastify'
import {useIsDownLg} from '@/core/hooks'

interface FormikData {
  name: string
  phone: string
  email: string
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
  email: '',
  question: '',
}

export const Feedback: FC = () => {
  const isDownLg = useIsDownLg()
  const [isProcessing, setIsProcessing] = useState(false)
  const [createFeedback] = useCreateFeedbackMutation()

  const handleFormikSubmit = async (
    values: FormikData,
    {resetForm, setErrors, setTouched}: FormikHelpers<FormikData>,
  ) => {
    // eslint-disable-next-line no-console
    try {
      setIsProcessing(true)

      await createFeedback(values).unwrap()

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
      toast.success('Ваше сообщение успешно отправлено!')
    } catch (error) {
      toast.error('Не удалось отправить сообщение.')
      console.error(error)
    } finally {
      setIsProcessing(false)
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
    <Box sx={s.root}>
      <Box
        sx={t => ({
          width: '70%',
          [t.breakpoints.down('lg')]: {
            width: '100%',
          },
        })}
      >
        <Typography sx={s.header}>Обратная связь</Typography>

        <Typography
          sx={t => ({
            maxWidth: '500px',
            [t.breakpoints.down('lg')]: {
              maxWidth: 'unset',
              fontSize: '14px',
              lineHeight: '24px',
            },
          })}
        >
          Наши менеджеры всегда готовы ответить на любые ваши вопросы и
          подобрать подходящий тур.
        </Typography>

        <Box sx={s.form}>
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
            sx={[
              {'& fieldset': {borderColor: 'transparent !important'}},
              s.formItem,
            ]}
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
                sx={[
                  {'& fieldset': {borderColor: 'transparent !important'}},
                  s.formItem,
                ]}
                fullWidth
              />
            )}
          </InputMask>

          <FormField
            name='email'
            placeholder='E-mail'
            type='text'
            value={values.email}
            error={touched.email && !!errors.email}
            helperText={errors.email}
            onBlur={handleBlur}
            onChange={handleChange}
            fullWidth
            sx={[
              {'& fieldset': {borderColor: 'transparent !important'}},
              s.formItem,
            ]}
          />

          <FormField
            name='question'
            placeholder='Ваш вопрос'
            type='text'
            value={values.question}
            error={touched.question && !!errors.question}
            helperText={errors.question}
            onBlur={handleBlur}
            onChange={handleChange}
            sx={[
              {'& fieldset': {borderColor: 'transparent !important'}},
              s.formItem,
            ]}
            fullWidth
            multiline
          />
        </Box>

        <Button
          variant={isDownLg ? 'contained' : 'outlined'}
          color='secondary'
          onClick={() => handleSubmit()}
          disabled={!isValid || isProcessing}
          sx={t => ({
            [t.breakpoints.down('lg')]: {
              backgroundColor: '#296587',
              width: '100%',
              fontSize: '16px',
            },
          })}
        >
          {isProcessing ? 'Отправка...' : 'Отправить'}
        </Button>
      </Box>

      <Box
        sx={t => ({
          width: '30%',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          [t.breakpoints.down('lg')]: {
            width: '100%',
          },
        })}
      >
        <Typography sx={[s.header]}>Контакты</Typography>

        <Typography component={Link} to='tel:7099090009' sx={s.contactLink}>
          <Phone />
          +7 (928) 031-96-56
        </Typography>

        <Typography
          component={Link}
          to='https://t.me/kchturism'
          sx={s.contactLink}
        >
          <Tg />
          Telegram
        </Typography>

        <Typography
          component={Link}
          to='https://vk.com/kchturism'
          sx={s.contactLink}
        >
          <Vk />
          Вконтакте
        </Typography>

        <Typography
          component={Link}
          to=''
          sx={[
            s.contactLink,
            {
              '& svg': {
                width: '40px',
              },
            },
          ]}
        >
          <LocationMarkerFill />
          Карачаево-Черкесская Республика, г. Черкесск, ул. Комсомольская, д.
          23, офис 156
        </Typography>
      </Box>
    </Box>
  )
}

const s = createStyles({
  root: t => ({
    ...rootStyle(t),
    display: 'flex',
    color: colorScheme(t).background.root,
    whiteSpace: 'pre-line',
    [t.breakpoints.down('lg')]: {
      padding: '0 30px',
      flexDirection: 'column-reverse',
      gap: '48px',
      marginBottom: '190px',
    },
  }),
  header: t => ({
    textTransform: 'uppercase',
    fontSize: '56px',
    fontWeight: 700,
    fontFamily: APP_FONTS.oswald,
    marginBottom: '16px',
    [t.breakpoints.down('lg')]: {
      fontSize: '24px',
      marginBottom: '10px',
    },
  }),
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    margin: '30px 0',
  },
  formItem: t => ({
    maxWidth: '500px',
    [t.breakpoints.down('lg')]: {
      fontSize: '14px',
    },
  }),
  contactLink: t => ({
    padding: '20px 28px',
    borderRadius: '20px',
    display: 'flex',
    flexDirection: 'row',
    gap: '15px',
    alignItems: 'center',
    backgroundColor: alpha(colorScheme(t).background.root, 0.2),
    [t.breakpoints.down('lg')]: {
      fontSize: '14px',
      padding: '18px',
    },
  }),
})
