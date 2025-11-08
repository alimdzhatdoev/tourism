import {FC, useState} from 'react'
import {Box, ButtonBase, Paper, Typography} from '@mui/material'
import {rootStyle} from '@/core/utils'
import {useSelector} from 'react-redux'
import {miscStateSelector, setMiscState} from '@/core/store/misc'
import {APP_FONTS} from '@/ui/themes/baseTheme'
import {Edit, Email, Person} from '@mui/icons-material'
import {FullscreenPreloader, ModalController} from '@/ui/components'
import {SetValueModal, SetValueModalProps} from '@/ui/components/_modals'
import {useModal} from '@/core/hooks'
import {useUpdateUserMutation} from '@/core/store/users'
import {DESKTOP_MAX_WIDTH, regex} from '@/constants'

const ProfileEditPage: FC = () => {
  const setValueModal = useModal<SetValueModalProps>()
  const {user} = useSelector(miscStateSelector)

  const [isProcessing, setIsProcessing] = useState(false)
  const [updateUser] = useUpdateUserMutation()

  const handleSetNameClick = () => {
    setValueModal.open({
      initialValue: user?.firstName ?? '',
      title: 'Введите новое имя',
      validate: v => !!v,
      onSave: async name => {
        if (!user) return

        try {
          setIsProcessing(true)

          const {data: updated} = await updateUser({
            id: user.id,
            email: user.email,
            first_name: name,
          }).unwrap()

          setMiscState({user: updated})
        } catch (error) {
          console.error(error)
        } finally {
          setIsProcessing(false)
        }
      },
    })
  }

  const handleSetEmailClick = () => {
    setValueModal.open({
      initialValue: user?.email ?? '',
      title: 'Введите новый e-mail',
      textFieldProps: {
        type: 'email',
      },
      validate: v => regex.email.test(v),
      onSave: async email => {
        if (!user) return

        try {
          setIsProcessing(true)

          const {data: updated} = await updateUser({
            id: user.id,
            email: email,
          }).unwrap()

          setMiscState({user: updated})
        } catch (error) {
          console.error(error)
        } finally {
          setIsProcessing(false)
        }
      },
    })
  }

  return (
    <>
      <FullscreenPreloader visible={isProcessing} />

      <ModalController control={setValueModal.control}>
        <SetValueModal {...setValueModal.props} maxWidth={500} />
      </ModalController>

      <Paper
        sx={[
          rootStyle,
          t => ({
            width: `min(${DESKTOP_MAX_WIDTH}px, 100%)`,
            display: 'flex',
            marginTop: '64px',
            alignItems: 'center',
            boxShadow: '0px 4px 46.4px 0px #B4B4B440',
            borderRadius: '20px',
            gap: '26px',
            [t.breakpoints.down('lg')]: {
              gap: '10px',
              marginTop: '30px',
              width: 'calc(100% - 60px)',
              '& svg': {
                fontSize: '20px',
                alignSelf: 'flex-end',
              },
            },
          }),
        ]}
      >
        <ButtonBase
          sx={t => ({
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: '36px',
            borderRadius: '20px',
            padding: '28px 52px',
            [t.breakpoints.down('lg')]: {
              gap: '10px',
              padding: '14px 10px',
            },
          })}
          onClick={handleSetNameClick}
        >
          <Box
            sx={t => ({
              height: '130px',
              width: '130px',
              borderRadius: '30px',
              backgroundColor: t.palette.grey[200],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '& svg': {
                width: '45px',
                height: '45px',
                color: t.palette.grey[400],
              },
              [t.breakpoints.down('lg')]: {
                height: '83px',
                width: '83px',
                '& svg': {
                  height: '30px',
                  width: '30px',
                },
              },
            })}
          >
            <Person sx={{alignSelf: 'center !important'}} />
          </Box>

          <Box
            sx={t => ({
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
              [t.breakpoints.down('lg')]: {
                '& svg': {
                  fontSize: '20px',
                  alignSelf: 'flex-end',
                },
              },
            })}
          >
            <Typography
              sx={t => ({
                fontWeight: 700,
                textTransform: 'uppercase',
                fontSize: '32px',
                fontFamily: APP_FONTS.oswald,
                [t.breakpoints.down('lg')]: {
                  fontSize: '16px',
                  lineHeight: '20px',
                },
              })}
            >
              {user?.fullName}
            </Typography>

            <Typography
              sx={{fontSize: '24px', lineHeight: '29px', opacity: 0.4}}
            >
              {user?.birthDate}
            </Typography>
          </Box>

          <Edit fontSize='large' sx={{marginLeft: 'auto'}} />
        </ButtonBase>
      </Paper>

      <Paper
        sx={[
          rootStyle,
          t => ({
            width: `min(${DESKTOP_MAX_WIDTH}px, 100%)`,
            display: 'flex',
            marginTop: '64px',
            alignItems: 'center',
            boxShadow: '0px 4px 46.4px 0px #B4B4B440',
            borderRadius: '20px',
            gap: '26px',
            [t.breakpoints.down('lg')]: {
              gap: '10px',
              marginTop: '30px',
              width: 'calc(100% - 60px)',
              '& svg': {
                fontSize: '20px',
                alignSelf: 'flex-end',
              },
            },
          }),
        ]}
      >
        <ButtonBase
          sx={t => ({
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: '36px',
            borderRadius: '20px',
            padding: '28px 52px',
            [t.breakpoints.down('lg')]: {
              padding: '14px 10px',
              gap: '10px',
            },
          })}
          onClick={handleSetEmailClick}
        >
          <Box
            sx={t => ({
              height: '130px',
              width: '130px',
              borderRadius: '30px',
              backgroundColor: t.palette.grey[200],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '& svg': {
                width: '45px',
                height: '45px',
                color: t.palette.grey[400],
              },
              [t.breakpoints.down('lg')]: {
                height: '83px',
                width: '83px',
                '& svg': {
                  height: '30px',
                  width: '30px',
                },
              },
            })}
          >
            <Email sx={{alignSelf: 'center !important'}} />
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
              alignItems: 'flex-start',
            }}
          >
            <Typography
              sx={t => ({
                fontWeight: 700,
                textTransform: 'uppercase',
                fontSize: '32px',
                fontFamily: APP_FONTS.oswald,
                [t.breakpoints.down('lg')]: {
                  fontSize: '16px',
                  lineHeight: '20px',
                },
              })}
            >
              Электронная почта
            </Typography>

            <Typography
              sx={t => ({
                fontSize: '24px',
                lineHeight: '29px',
                opacity: 0.4,
                [t.breakpoints.down('lg')]: {
                  fontSize: '14px',
                  lineHeight: '17px',
                },
              })}
            >
              {user?.email}
            </Typography>
          </Box>

          <Edit fontSize='large' sx={{marginLeft: 'auto'}} />
        </ButtonBase>
      </Paper>
    </>
  )
}

export default ProfileEditPage
