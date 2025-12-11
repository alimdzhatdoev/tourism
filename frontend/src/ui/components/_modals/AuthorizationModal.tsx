import {FC, KeyboardEventHandler, useState} from 'react'
import {Button, TextField, Typography} from '@mui/material'
import {AuthorizeRequest} from 'types-requests'
import {useAuthenticateMutation, useAuthorizeMutation} from '@/core/store/auth'
import {appStorage, casx, handleError} from '@/core/utils'
import {setMiscState} from '@/core/store/misc'
import {regex} from '@/constants'
import {ModalContent, ModalContentProps} from '../Modal'
import {Logo} from '../_common'
import {APP_FONTS} from '@/ui/themes/baseTheme'

const {write} = appStorage()

const CODE_ERROR_TEXT = 'Введен неверный код'
const INITIAL_DATA = {email: '', password: ''}

const isEmail = (string: string) => regex.email.test(string)

type AuthorizationStage = 'email' | 'password'
export interface AuthorizationModalProps extends ModalContentProps {
  initialStage?: AuthorizationStage
  initialData?: AuthorizeRequest
  onDismiss?: () => void
  onAuthorized?: () => void
}
export const AuthorizationModal: FC<AuthorizationModalProps> = ({
  initialStage = 'email',
  initialData = INITIAL_DATA,
  onClose,
  onAuthorized,
  ...props
}) => {
  const [data, setData] = useState<AuthorizeRequest>(initialData)
  const [stage, setStage] = useState<AuthorizationStage>(initialStage)
  const [codeError, setCodeError] = useState<boolean>(false)

  const [authenticationApi, {isLoading: isAuthenticating}] =
    useAuthenticateMutation()
  const [authorizationApi, {isLoading: isAuthorizing}] = useAuthorizeMutation()

  const authenticate = async () => {
    try {
      await authenticationApi({
        email: data.email,
      }).unwrap()
      setStage('password')
    } catch (error) {
      handleError(error)
    }
  }

  const authorize = async (password: string) => {
    try {
      const {data: tokens} = await authorizationApi({
        email: data.email,
        password,
      }).unwrap()
      write('tokens', tokens)
      setMiscState({isAuthorized: true})
      onAuthorized?.()
      onClose?.()
    } catch (error) {
      setCodeError(true)
      handleError(error)
    }
  }

  const toPrevStage = () => {
    setStage('email')
    setData(initialData)
  }

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = event => {
    if (event.key === 'Enter' && isEmail(data.email)) {
      authenticate()
    }
  }

  const updateData = <T extends keyof AuthorizeRequest>(
    key: T,
    newData: AuthorizeRequest[T],
  ) => {
    if (key === 'password' && newData.length === 4) {
      authorize(newData)
    }
    setData(prev => ({...prev, [key]: newData}))
  }

  return (
    <ModalContent
      onClose={onClose}
      maxWidth={678}
      sx={t => ({
        alignItems: 'flex-start',
        overflow: 'hidden',
        [t.breakpoints.down('lg')]: {
          alignItems: 'center',
          gap: '30px',
        },
      })}
      title={<Logo variant='text' color='inherit' />}
      {...props}
    >
      {stage === 'email' ? (
        <>
          <Typography
            sx={{
              fontWeight: 700,
              textTransform: 'uppercase',
              fontFamily: APP_FONTS.oswald,
              fontSize: '32px',
              marginTop: '52px',
            }}
          >
            Вход
          </Typography>

          <TextField
            autoFocus
            variant='outlined'
            type='email'
            placeholder='Введите ваш  E-mail'
            value={data.email}
            onChange={e => updateData('email', e.target.value)}
            disabled={isAuthenticating}
            onKeyDown={handleKeyDown}
            helperText={' '}
            fullWidth
          />

          <Typography>
            На указанный адрес мы отправим письмо с кодом подтвержения.
          </Typography>

          <Button
            variant='outlined'
            sx={{marginTop: '54px', color: 'black'}}
            onClick={authenticate}
            disabled={!isEmail(data.email) || isAuthenticating}
          >
            {isAuthenticating ? 'Отправляем...' : 'Отправить код'}
          </Button>
        </>
      ) : null}
      {stage === 'password' ? (
        <>
          <Typography
            sx={{
              fontWeight: 700,
              textTransform: 'uppercase',
              fontFamily: APP_FONTS.oswald,
              fontSize: '32px',
              marginTop: '52px',
            }}
          >
            Введите код из письма
          </Typography>

          <TextField
            autoFocus
            variant='outlined'
            autoComplete='one-time-code'
            inputMode='decimal'
            value={data.password}
            onChange={e => updateData('password', e.target.value)}
            disabled={isAuthorizing}
            error={codeError}
            helperText={codeError ? CODE_ERROR_TEXT : ' '}
            sx={[
              {
                width: '170px',
                '& input': {
                  fontSize: '25px',
                  letterSpacing: '20px',
                  marginRight: '-20px',
                  fontFamily: 'monospace',
                },
              },
              ...casx(data.password.length === 4, {
                caretColor: 'transparent',
              }),
            ]}
            inputProps={{maxLength: 4}}
          />

          <Typography textAlign='center'>
            Отправили код на{' '}
            <Typography component='span' sx={{fontWeight: 600}}>
              {data.email}
            </Typography>
          </Typography>

          <Button
            variant='outlined'
            sx={t => ({
              marginTop: '54px',
              color: 'black',
              [t.breakpoints.down('lg')]: {
                width: '100%',
              },
            })}
            onClick={toPrevStage}
            disabled={isAuthorizing}
          >
            Изменить адрес
          </Button>
        </>
      ) : null}
    </ModalContent>
  )
}
