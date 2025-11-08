import {FC} from 'react'
import {RootBlock, RootHeader} from '@/ui/components/_common'
import {ContactForm} from '@/ui/components'
import {Box, Typography} from '@mui/material'
import {contactsBanner} from '@/assets/png'
import {styles as s} from './index.styles'

const ContactsPage: FC = () => {
  return (
    <>
      <RootHeader
        slotProps={{
          currentBreadcrumb: {children: 'Контакты'},
          breadcrumbs: {
            sx: t => ({
              [t.breakpoints.down('lg')]: {
                margin: '0 0 6px',
              },
            }),
          },
        }}
      />
      <RootBlock sx={s.block}>
        <Box sx={[s.blockColumn, s.textColumn]}>
          <Typography
            variant='h1'
            sx={t => ({
              [t.breakpoints.down('lg')]: {
                fontSize: '30px',
                lineHeight: '34px',
              },
            })}
          >
            Контакты
          </Typography>
          <Typography sx={s.text}>
            Адрес: Карачаеов-Черкесская Республика, г. Карачаевск, ул. Ленина,
            д.15, офис 10
            <br />
            <br />
            Телефон: +7 (099) 09 00-09
          </Typography>
        </Box>
        <ContactForm
          sx={[s.blockColumn, s.form]}
          text='Если у вас возникли вопросы, напишите нам, и наши менеджеры ответят вам в ближайшее время'
          noTitle
        />
      </RootBlock>
      <RootBlock>
        <Box component='img' src={contactsBanner} sx={s.banner} />
      </RootBlock>
    </>
  )
}

export default ContactsPage
