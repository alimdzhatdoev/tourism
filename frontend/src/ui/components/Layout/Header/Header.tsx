import { FC, useEffect, useMemo, useState } from 'react'
import { alpha, Box, IconButton, SvgIcon, Typography } from '@mui/material'
import { styles as s } from './Header.styles'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Background, Logo } from '../../_common'
import { colors, HEADER_LINKS } from '@/constants'
import { colorScheme, hideOn, rootStyle } from '@/core/utils'
import MenuIcon from '@mui/icons-material/Menu'
import { AuthButton, ModalController } from '../..'
import { SearchIcon, Vk } from '@/assets/svg'
import { SearchModal, SearchModalProps } from '../../_modals'
import { useIsDownLg, useModal } from '@/core/hooks'
import { miscStateSelector } from '@/core/store/misc'
import { useSelector } from 'react-redux'
import {
  AuthorizationModal,
  AuthorizationModalProps,
} from '../../_modals/AuthorizationModal'

const SCROLL_TRESHOLD = 80

export const Header: FC = () => {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const [isScrolled, setIsScrolled] = useState(false)

  const searchModal = useModal<SearchModalProps>()
  const isDownLg = useIsDownLg()

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > SCROLL_TRESHOLD)
    }

    window.addEventListener('scroll', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const isTransparent = useMemo(
    () =>
      [
        pathname === '/',
        pathname === '/about',
        pathname === '/routes',
        pathname === '/places',
        pathname === '/news',
        pathname === '/help',
        pathname === '/services',
        pathname.includes('places/'),
      ].includes(true),
    [pathname],
  )

  const { user } = useSelector(miscStateSelector)

  const [isActive, setIsActive] = useState(false);
  const authorizationModal = useModal<AuthorizationModalProps>()

  const handleBurgerClick = () => {
    setIsActive(!isActive)
  }

  const handleAuthlick = () => {
    setIsActive(!isActive)
    if (!user) {
      authorizationModal.open({
        onAuthorized: () => {
          navigate('/profile')
        },
      })
    } else {
      navigate('/profile')
    }
  }

  return (
    <>
      <ModalController control={searchModal.control}>
        <SearchModal {...searchModal.props} />
      </ModalController>

      <Box sx={{
        position: 'fixed',
        top: '80px',
        left: 0,
        zIndex: 2,
        transition: 'transform 0.3s ease-in-out',
        transform: isActive ? 'translateY(0px)' : 'translateY(-110%)'
      }}>
        <ul style={{
          backgroundColor: '#fff',
          borderRadius: '0 0 20px 20px',
          margin: '0px',
          listStyle: 'none',
          width: '100vw',
          height: 'fit-content',
          boxShadow: '0 0 30px #00000031',
          padding: '5px 0'
        }}>
          <li style={{
            fontSize: '14px',
            padding: '10px 20px',
            borderBottom: '1px solid #ececec'
          }}
            onClick={() => {navigate('/'); setIsActive(!isActive)}}
          >
            Главная
          </li>
          {HEADER_LINKS.map((link, index) => (
            <li
              key={index}
              style={{
                fontSize: '14px',
                padding: '10px 20px',
                borderBottom: '1px solid #ececec'
              }}
              onClick={() => {navigate(link.path); setIsActive(!isActive)}}
            >
              {link.title}
            </li>
          ))}
          <li style={{
            fontSize: '14px',
            padding: '10px 20px',
            borderBottom: 'none'
          }}
            onClick={handleAuthlick}
          >
            Профиль
          </li>
        </ul>
      </Box>

      <ModalController control={authorizationModal.control}>
        <AuthorizationModal {...authorizationModal.props} />
      </ModalController>

      <Background
        sx={[
          s.staticRoot,
          hideOn('down', 'lg'),
          isTransparent && {
            backgroundColor: t =>
              isScrolled ? colorScheme(t).background.root : 'transparent',
          },
        ]}
      >
        <Box
          sx={[
            rootStyle,
            {
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '30px',
              padding: '17px 0 12px',
            },
            isTransparent && s.transparentPath,
            {
              borderBottom: t =>
                `1px solid ${alpha(
                  isTransparent
                    ? colorScheme(t).background.root
                    : colorScheme(t).text.primary,
                  0.3,
                )}`,
            },
          ]}
        >
          <Box component={Link} to='/' color='inherit' sx={{ mr: 'auto' }}>
            <Logo
              variant='text'
              color='inherit'
              sx={{
                height: '45px',
                width: '211px',
              }}
            />
          </Box>

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
            ]}
            to='https://vk.com/kchturism'
            target='_blank'
          >
            <Vk />
          </Box>

          <AuthButton
            sx={{
              color: t =>
                `${isTransparent
                  ? colorScheme(t).background.root
                  : colorScheme(t).primary.main
                } !important`,
            }}
          />
        </Box>
      </Background>

      <Background
        sx={[
          s.stickyRoot,
          isTransparent &&
          !isDownLg && {
            color: isScrolled
              ? colors.light.primary.update1
              : t => colorScheme(t).text.contrast,
          },
          !isDownLg && {
            backgroundColor: t =>
              isScrolled ? colorScheme(t).background.root : 'transparent',
          },
          !isDownLg &&
          !isScrolled && {
            boxShadow: 'unset',
          },
        ]}
      >
        <Box
          sx={[
            rootStyle,
            {
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              color: 'inherit',
              height: '100%',
            },
          ]}
        >
          {isScrolled || isDownLg ? (
            <Link to='/' color='inherit'>
              <Logo
                variant='text'
                color='inherit'
                sx={t => ({
                  height: '45px',
                  width: '211px',
                  [t.breakpoints.down('lg')]: {
                    '& svg': {
                      height: '34px',
                      width: '164px',
                    },
                  },
                })}
              />
            </Link>
          ) : (
            <Box
              sx={t => ({
                height: '45px',
                width: '211px',
                [t.breakpoints.down('lg')]: {
                  height: '34px',
                  width: '164px',
                },
              })}
            />
          )}

          {HEADER_LINKS.map(link => (
            <Typography
              key={link.path}
              component={Link}
              to={link.path + (link.search ?? '')}
              sx={[
                hideOn('down', 'lg'),
                {
                  borderBottom: t =>
                    `2px solid  ${pathname.includes(link.path)
                      ? colorScheme(t).text.linkActive
                      : 'transparent'
                    }`,
                },
              ]}
            >
              {link.title}
            </Typography>
          ))}

          <IconButton sx={hideOn('up', 'lg')} onClick={handleBurgerClick}>
            <SvgIcon
              sx={{
                fontSize: '30px',
                color:
                  isScrolled || isDownLg
                    ? t => colorScheme(t).text.primary
                    : t => colorScheme(t).text.contrast,
              }}
            >
              <MenuIcon />
            </SvgIcon>
          </IconButton>

          <IconButton
            onClick={() => searchModal.open({})}
            sx={[hideOn('down', 'lg'), { color: 'inherit' }]}
          >
            <SvgIcon
              sx={{
                fontSize: '20px',
              }}
            >
              <SearchIcon />
            </SvgIcon>
          </IconButton>
        </Box>
      </Background>
    </>
  )
}
