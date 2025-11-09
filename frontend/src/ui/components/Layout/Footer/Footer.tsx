import { FC, useMemo } from 'react'
import { Box, darken, Typography } from '@mui/material'
import { styles as s } from './Footer.styles'
import { FOOTER_COLUMNS_LINKS, FOOTER_MISC_LINKS } from '@/constants'
import { Link, useLocation } from 'react-router-dom'
import { Logo } from '../../_common/Logo/Logo'
import { TLink } from 'types-common'
import { colorScheme, rootStyle } from '@/core/utils'
import { Background } from '../../_common'
import { KchrTour, MinistryMono, ProjectMono, Vk } from '@/assets/svg'
import { useGetPostsListQuery } from '@/core/store/posts'
import { useIsDownLg } from '@/core/hooks'

const FooterLink: FC<TLink> = ({ path, title }) => (
  <Typography component={Link} to={path} fontSize='inherit'>
    {title}
  </Typography>
)

export const Footer: FC = () => {
  const { pathname } = useLocation()
  const isDownLg = useIsDownLg()

  const postsApi = useGetPostsListQuery({
    size: 4,
    filters: {
      section_slug: 'for-tourists',
    },
  })

  const posts = postsApi.data?.data.results ?? []

  const isTransparent = useMemo(
    () => [pathname === '/'].includes(true),
    [pathname],
  )

  if (isDownLg) {
    return (
      <Box
        sx={{
          width: '100%',
          backgroundColor: '#06101C',
          color: t => colorScheme(t).background.root,
          padding: '39px 29px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '42px',
          }}
        >
          <Box component={Link} to='/' sx={{ marginRight: 'auto' }}>
            <Logo
              variant='text'
              sx={{
                '& svg': {
                  height: '34px',
                  width: '164px',
                },
              }}
            />
          </Box>

          {/* <Box
            component={Link}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: t => t.palette.grey[800],
              width: '34px',
              height: '34px',
              borderRadius: '6px',
              '& svg': {
                height: '15px',
              },
            }}
            to='https://t.me/kchturism'
          >
            <Tg />
          </Box> */}
          <Box
            component={Link}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: t => t.palette.grey[800],
              width: '34px',
              height: '34px',
              borderRadius: '6px',
              '& svg': {
                height: '11px',
              },
            }}
            to='https://vk.com/kchturism'
          >
            <Vk />
          </Box>
        </Box>

        <Box
          component={Link}
          to='https://xn--80aapampemcchfmo7a3c9ehj.xn--p1ai/projects/turizm/'
        >
          <ProjectMono />
        </Box>

        <Box component={Link} to='http://tourismkchr.ru/'>
          <MinistryMono />
        </Box>

        <Box component={Link} to='https://kch-tourism.ru/' marginBottom='14px'>
          <KchrTour />
        </Box>

        {FOOTER_MISC_LINKS.map(link => (
          <Typography
            fontSize='14px'
            component={Link}
            to={link.path}
            key={link.path}
            sx={{ opacity: 0.5 }}
          >
            {link.title}
          </Typography>
        ))}
      </Box>
    )
  }

  return (
    <Background
      color={theme =>
        isTransparent ? 'transparent' : colorScheme(theme).background.footer
      }
      sx={[
        s.background,
        isTransparent && {
          borderTop: t => `1px solid ${colorScheme(t).background.root}`,
        },
      ]}
    >
      <Box
        sx={[
          s.root,
          {
            color: t =>
              isTransparent
                ? colorScheme(t).background.root
                : colorScheme(t).text.primary,
          },
        ]}
      >
        <Box sx={s.columnsList}>
          <Box sx={[s.columnItem, { width: '20%' }]}>
            <Box component={Link} to='/' sx={s.columnHeader}>
              <Logo
                variant='text'
                sx={{
                  '& svg': {
                    height: '34px',
                    width: '164px',
                  },
                }}
              />
            </Box>

            {FOOTER_COLUMNS_LINKS.slice(0, 5).map(link => (
              <FooterLink
                key={link.path}
                path={link.path + (link.search ?? '')}
                title={link.title}
              />
            ))}
          </Box>

          <Box sx={[s.columnItem, { width: '45%' }]}>
            <Typography
              sx={[s.columnHeader, { fontWeight: 500, fontSize: '24px' }]}
            >
              На помощь туристу
            </Typography>

            {posts.map(article => (
              <FooterLink
                key={article.id}
                path={`/help/${article.id}`}
                title={article.title}
              />
            ))}
          </Box>

          <Box sx={s.columnItem}>
            <Typography
              sx={[s.columnHeader, { fontWeight: 500, fontSize: '24px' }]}
            >
              Связаться с нами
            </Typography>

            <Box sx={s.socialsContainer}>
              {/* <Box
                component={Link}
                sx={[
                  s.socialLink,
                  {
                    color: t =>
                      `${
                        isTransparent
                          ? colorScheme(t).background.root
                          : colorScheme(t).primary.main
                      } !important`,
                  },
                  {
                    '& svg': {
                      height: '15px',
                    },
                  },
                ]}
                to='https://t.me/kchturism'
              >
                <Tg />
              </Box> */}
              <Box
                component={Link}
                sx={[
                  s.socialLink,
                  {
                    color: t =>
                      `${isTransparent
                        ? colorScheme(t).background.root
                        : colorScheme(t).primary.main
                      } !important`,
                  },
                  {
                    '& svg': {
                      height: '11px',
                    },
                  },
                ]}
                to='https://vk.com/kchturism'
              >
                <Vk />
              </Box>
            </Box>

            <Typography
              component={Link}
              to='tel:+79280319656'
              fontSize='inherit'
            >
              +7 (928) 031-96-56
            </Typography>

            <Typography whiteSpace='pre-wrap' fontSize='inherit'>
              {
                'Адрес:\nКарачаево-Черкесская Республика,\nг. Черкесск, ул. Комсомольская, д. 23, офис 156'
              }
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box
        sx={[
          t => ({
            ...rootStyle(t),
            display: 'flex',
            flexDirection: 'row-reverse',
            justifyContent: 'space-between',
            padding: '36px 0 61px',
            gap: '26px',
            color: isTransparent
              ? colorScheme(t).background.root
              : colorScheme(t).text.primary,
          }),
          !isTransparent && {
            borderTop: t =>
              `1px solid ${darken(colorScheme(t).background.footer, 0.1)}`,
          },
        ]}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          {FOOTER_MISC_LINKS.map(link => (
            <FooterLink key={link.path} path={link.path} title={link.title} />
          ))}
        </Box>

        <Box
          component={Link}
          to='https://xn--80aapampemcchfmo7a3c9ehj.xn--p1ai/projects/turizm/'
        >
          {pathname == "/" ?
            <ProjectMono />
            :
            <img src="logo_nacproject_color.png" alt="" />
          }
        </Box>

        <Box component={Link} to='http://tourismkchr.ru/'>
          {pathname == "/" ?
            <MinistryMono />
            :
            <img src="logo_tourism_color.png" alt="" />
          }
        </Box>

        <Box component={Link} to='https://kch-tourism.ru/' marginBottom='14px'>
          <KchrTour />
        </Box>
      </Box>
    </Background>
  )
}
