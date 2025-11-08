import {hideOn} from '@/core/utils'
import {Box} from '@mui/material'

export const FooterBackground = () => {
  return (
    <Box
      sx={t => ({
        position: 'absolute',
        bottom: 0,
        marginTop: 'auto',
        zIndex: -1,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        [t.breakpoints.down('lg')]: {
          minHeight: '1200px',
          bottom: '355px',
        },
      })}
    >
      <Box
        sx={t => ({
          width: '100%',
          height: '100%',
          marginBottom: '-10px',
          background: 'linear-gradient(360deg, #DDC2F2 0%, #FFFFFF 100%)',
          [t.breakpoints.down('lg')]: {
            display: 'flex',
            height: '530px',
          },
        })}
      >
        <Box
          sx={t => ({
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            flex: 1,
            [t.breakpoints.down('lg')]: {
              height: 'unset',
            },
          })}
          component='img'
          src='main_mountains_bg.png'
        />
      </Box>

      <Box
        sx={[
          hideOn('up', 'lg'),
          {height: '650px', width: '100%', backgroundColor: '#06101C'},
        ]}
      />

      <Box
        sx={t => ({
          width: '100%',
          height: '100%',
          backgroundColor: '#06101C',
          paddingTop: '100px',
          marginBottom: '-20px',
          [t.breakpoints.down('lg')]: {
            paddingTop: 'unset',
            marginBottom: 'unset',
            display: 'flex',
            height: '700px',
          },
        })}
      >
        <Box
          sx={t => ({
            width: '100%',
            height: '100%',
            opacity: 0.4,
            objectFit: 'cover',
            [t.breakpoints.down('lg')]: {
              flex: 1,
              height: 'unset',
            },
          })}
          component='img'
          src='main_footer_bg.png'
        />
      </Box>
    </Box>
  )
}
