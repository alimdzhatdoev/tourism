import {FC} from 'react'
import {Box, Button, Paper, Typography} from '@mui/material'
import {Background} from '@/ui/components/_common'
import {APP_FONTS} from '@/ui/themes/baseTheme'
import {colorScheme, createStyles, rootStyle} from '@/core/utils'
import {Baggage, Communication, DressCode, Papers} from '@/assets/svg'
import {useNavigate} from 'react-router-dom'
import {bluredBackground} from '@/core/utils/sx'

export const Help: FC = () => {
  const navigate = useNavigate()
  return (
    <>
      <Background
        sx={t => ({
          backgroundImage: 'url(main_ice.png)',
          backgroundSize: 'cover',
          height: '480px',
          paddingTop: '78px',
          gap: '24px',
          color: colorScheme(t).background.root,
          [t.breakpoints.down('lg')]: {
            height: '518px',
            maxWidth: '100%',
          },
        })}
      >
        <Typography
          sx={t => ({
            fontFamily: APP_FONTS.oswald,
            fontWeight: 700,
            textTransform: 'uppercase',
            fontSize: '60px',
            [t.breakpoints.down('lg')]: {
              fontSize: '24px',
            },
          })}
        >
          ВПЕРВЫЕ В КЧР?
        </Typography>
        <Typography
          sx={[
            bluredBackground(),
            t => ({
              textAlign: 'center',
              maxWidth: '740px',
              borderRadius: '15px',
              padding: '10px 0',
              [t.breakpoints.down('lg')]: {
                fontSize: '14px',
                maxWidth: 'unset',
                margin: '0 30px',
              },
            }),
          ]}
        >
          Специально для вас мы создали раздел, в котором собрали всю полезную
          информацию, чтобы помочь сделать ваше путешествие по нашей
          удивительной республике комфортным, интересным и незабываемым!
        </Typography>
      </Background>
      <Paper
        elevation={7}
        sx={[
          rootStyle,
          t => ({
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginTop: '-100px',
            marginBottom: '60px',
            borderRadius: '30px',
            padding: '37px 80px',
            [t.breakpoints.down('lg')]: {
              flexWrap: 'wrap',
              gap: '24px',
              margin: '0 30px',
              padding: '26px 11px',
              width: 'calc(100% - 60px)',
              marginTop: '-190px',
            },
          }),
        ]}
      >
        <Box sx={s.card}>
          <Communication />
          <Typography sx={s.cardText}>
            {'Коммуникация\nс местными жителями'}
          </Typography>
        </Box>

        <Box sx={s.card}>
          <Baggage />
          <Typography sx={s.cardText}>{'Что взять\nс собой'}</Typography>
        </Box>

        <Box sx={s.card}>
          <DressCode />
          <Typography sx={s.cardText}>{'Дресс-код\nрегиона'}</Typography>
        </Box>

        <Box
          sx={[
            s.card,
            t => ({
              [t.breakpoints.down('lg')]: {
                '& svg': {
                  width: '55px',
                  height: '55px',
                },
              },
            }),
          ]}
        >
          <Papers />
          <Typography sx={s.cardText}>
            {
              'Административное оформление\nпутешествий для альпинистов и тех,\nкто отправляется в пограничную зону'
            }
          </Typography>
        </Box>
      </Paper>

      <Button
        variant='contained'
        sx={t => ({
          marginBottom: '120px',
          [t.breakpoints.down('lg')]: {
            marginTop: '32px',
            marginBottom: '30px',
          },
        })}
        onClick={() => navigate('/help')}
      >
        Перейти в раздел
      </Button>
    </>
  )
}

const s = createStyles({
  card: t => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
    whiteSpace: 'pre-line',
    [t.breakpoints.down('lg')]: {
      '& svg': {
        width: '66px',
        height: '66px',
      },
      width: 'calc(50% - 12px)',
    },
  }),
  cardText: t => ({
    textAlign: 'center',
    [t.breakpoints.down('lg')]: {
      fontSize: '12px',
    },
  }),
})
