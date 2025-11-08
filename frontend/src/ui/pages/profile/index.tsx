import {FC} from 'react'
import {
  alpha,
  Avatar,
  Box,
  Button,
  ButtonBase,
  Paper,
  Typography,
} from '@mui/material'
import {colorScheme, hideOn, rootStyle, appStorage} from '@/core/utils'
import {User} from '@/assets/svg'
import {useSelector} from 'react-redux'
import {miscStateSelector, setMiscState} from '@/core/store/misc'
import {ArrowForwardIos, Logout} from '@mui/icons-material'
import {useNavigate} from 'react-router-dom'
import {APP_FONTS} from '@/ui/themes/baseTheme'
import {useGetRoutesListQuery} from '@/core/store/routes'
import {GridBlock} from '@/ui/components/_common'
import {PlaceTile, RouteTile} from '@/ui/components/_tiles'
import {useAttractionLike, useRouteLike, useIsDownLg} from '@/core/hooks'
import {useGetAttractionsListQuery} from '@/core/store/attractions'
import {Swiper, SwiperSlide} from 'swiper/react'
import {Pagination} from 'swiper/modules'
import {DESKTOP_MAX_WIDTH} from '@/constants'

const {clear} = appStorage()

const ProfilePage: FC = () => {
  const {user} = useSelector(miscStateSelector)

  const isDownLg = useIsDownLg()

  const navigate = useNavigate()

  const routesApi = useGetRoutesListQuery({
    filters: {
      is_liked: true,
    },
    expand: {
      photos: true,
    },
  })

  const attractionsApi = useGetAttractionsListQuery({
    filters: {
      is_favorite: true,
    },
    expand: {
      photos: true,
    },
  })

  const {toggleLike: toggleRouteLike} = useRouteLike()
  const {toggleLike: toggleAttractionLike} = useAttractionLike()

  const routes =
    routesApi.data?.data.results.map(r => ({...r.routeTileProps, id: r.id})) ??
    []

  const attractions =
    attractionsApi.data?.data.results.map(a => ({
      ...a.placeTileProps,
      id: a.id,
    })) ?? []

  const logout = () => {
    setMiscState({isAuthorized: false, user: null})
    clear()
    navigate('/')
  }

  return (
    <>
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

            [t.breakpoints.down('lg')]: {
              gap: '10px',
              marginTop: '30px',
              width: 'calc(100% - 60px)',
            },
          }),
        ]}
      >
        <ButtonBase
          sx={t => ({
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: '26px',
            borderRadius: '20px',
            padding: '28px 52px',
            [t.breakpoints.down('lg')]: {
              padding: '14px 10px',
              gap: '10px',
            },
          })}
          onClick={() => navigate('/profile/edit')}
        >
          <Avatar
            sx={t => ({
              color: 'inherit',
              height: '130px',
              width: '130px',
              backgroundColor: alpha(colorScheme(t).text.primary, 0.1),
              '& svg': {
                height: '50px',
                width: '50px',
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
            <User />
          </Avatar>

          <Box
            sx={t => ({
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              alignItems: 'flex-start',
              [t.breakpoints.down('lg')]: {
                gap: '5px',
                justifyContent: 'flex-start',
                alignSelf: 'flex-start',
                marginTop: '10px',
                flex: 1,
              },
            })}
          >
            <Typography
              sx={t => ({
                fontSize: '24px',
                lineHeight: '29px',
                fontWeight: 700,
                [t.breakpoints.down('lg')]: {
                  fontSize: '14px',
                  lineHeight: '17px',
                },
              })}
            >
              {user?.fullName}
            </Typography>
            <Typography
              sx={t => ({
                fontSize: '24px',
                lineHeight: '29px',
                fontWeight: 500,
                opacity: 0.6,
                [t.breakpoints.down('lg')]: {
                  fontSize: '14px',
                  lineHeight: '17px',
                },
              })}
            >
              {user?.email}
            </Typography>

            <Button
              sx={[
                hideOn('up', 'lg'),
                {
                  alignSelf: 'flex-end',
                  border: '1px solid grey',
                  padding: '5px !important',
                  minWidth: 'unset',
                  borderRadius: 9999,
                  '& svg': {
                    fontSize: '14px',
                    color: 'grey',
                  },
                },
              ]}
              onClick={() => navigate('/profile/edit')}
            >
              <ArrowForwardIos />
            </Button>
          </Box>

          <Box sx={[hideOn('down', 'lg'), {marginLeft: 'auto'}]}>
            <ArrowForwardIos />
          </Box>
        </ButtonBase>
      </Paper>

      {isDownLg ? (
        <Button
          variant='outlined'
          sx={{
            borderColor: 'black',
            width: 'calc(100% - 60px)',
            height: '40px',
            marginTop: '30px',
          }}
          startIcon={<Logout />}
          onClick={logout}
        >
          Выйти
        </Button>
      ) : null}

      {routes?.length && isDownLg ? (
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '30px',
            marginTop: '40px',
          }}
        >
          <Typography
            sx={[
              rootStyle,
              {
                textTransform: 'uppercase',
                textAlign: 'left',
                fontWeight: 700,
                fontFamily: APP_FONTS.oswald,
                fontSize: '24px',
                padding: '0 30px',
              },
            ]}
          >
            Избранные маршруты
          </Typography>

          <Box
            sx={{
              width: '100%',
              '& .swiper-pagination': {
                bottom: '-10px',
                overflow: 'visible',
              },
              '& .swiper-slide': {
                width: '312px',
                height: '204px',
              },
            }}
          >
            <Swiper
              modules={[Pagination]}
              spaceBetween={isDownLg ? '24px' : '44px'}
              slidesPerView='auto'
              navigation={{
                prevEl: '#PlacesNavigationPrev',
                nextEl: '#PlacesNavigationNext',
              }}
              pagination={{el: '.routes-pagination'}}
              slidesOffsetBefore={30}
              loop
            >
              {routes.map(({id, ...props}) => (
                <SwiperSlide key={id}>
                  <RouteTile {...props} hideSpecs />
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>

          <Box
            className='routes-pagination'
            sx={[
              hideOn('up', 'lg'),
              {
                display: 'flex',
                justifyContent: 'center',
                gap: '10px',
                marginTop: '-20px',
                marginBottom: '30px',
              },
            ]}
          />
        </Box>
      ) : null}

      {attractions?.length && isDownLg ? (
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '30px',
          }}
        >
          <Typography
            sx={[
              rootStyle,
              {
                textTransform: 'uppercase',
                textAlign: 'left',
                fontSize: '24px',
                padding: '0 30px',
                fontWeight: 700,
                fontFamily: APP_FONTS.oswald,
              },
            ]}
          >
            Избранные места
          </Typography>

          <Box
            sx={{
              width: '100%',
              '& .swiper-pagination': {
                bottom: '-10px',
                overflow: 'visible',
              },
              '& .swiper-slide': {
                width: '180px',
                height: '267px',
              },
            }}
          >
            <Swiper
              modules={[...(isDownLg ? [Pagination] : [])]}
              spaceBetween={isDownLg ? '24px' : '44px'}
              slidesPerView='auto'
              pagination={{el: '.places-pagination'}}
              slidesOffsetBefore={30}
              loop
            >
              {attractions.map(({...props}) => (
                <SwiperSlide key={props.id}>
                  <PlaceTile {...props} sx={{width: '100%', height: '100%'}} />
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>

          <Box
            className='places-pagination'
            sx={[
              hideOn('up', 'lg'),
              {
                display: 'flex',
                justifyContent: 'center',
                gap: '10px',
                marginBottom: '40px',
              },
            ]}
          />
        </Box>
      ) : null}

      <Paper
        sx={[
          rootStyle,
          hideOn('down', 'lg'),
          {
            display: 'flex',
            flexDirection: 'column',
            marginTop: '64px',
            boxShadow: '0px 4px 46.4px 0px #B4B4B440',
            borderRadius: '20px',
            padding: '28px 52px',
            gap: '26px',
          },
        ]}
      >
        <Typography
          sx={{
            fontWeight: 700,
            textTransform: 'uppercase',
            fontSize: '32px',
            fontFamily: APP_FONTS.oswald,
            marginBottom: '15px',
          }}
        >
          Избранные маршруты
        </Typography>

        {routes.length || routesApi.isLoading ? (
          <GridBlock
            columns={2}
            skeletonRows={2}
            slotProps={{
              skeleton: {
                sx: {height: '351px'},
              },
            }}
            isLoading={routesApi.isLoading}
          >
            {routes.map(({id, ...props}) => (
              <RouteTile
                key={id}
                onHeartClick={() =>
                  toggleRouteLike({id, isLiked: props.isFavorite})
                }
                {...props}
              />
            ))}
          </GridBlock>
        ) : (
          <Typography sx={{opacity: 0.6}}>Нет избранных маршрутов</Typography>
        )}
      </Paper>

      <Paper
        sx={[
          rootStyle,
          hideOn('down', 'lg'),
          {
            display: 'flex',
            flexDirection: 'column',
            marginTop: '64px',
            boxShadow: '0px 4px 46.4px 0px #B4B4B440',
            borderRadius: '20px',
            padding: '28px 52px',
            gap: '26px',
          },
        ]}
      >
        <Typography
          sx={{
            fontWeight: 700,
            textTransform: 'uppercase',
            fontSize: '32px',
            fontFamily: APP_FONTS.oswald,
            marginBottom: '15px',
          }}
        >
          Избранные места
        </Typography>

        {attractions.length || attractionsApi.isLoading ? (
          <GridBlock
            columns={4}
            skeletonRows={1}
            slotProps={{
              skeleton: {
                sx: {height: '351px'},
              },
            }}
            isLoading={attractionsApi.isLoading}
          >
            {attractions.map(({id, ...props}) => (
              <PlaceTile
                {...props}
                key={id}
                onHeartClick={() =>
                  toggleAttractionLike({id, isLiked: !!props.isFavorite})
                }
              />
            ))}
          </GridBlock>
        ) : (
          <Typography sx={{opacity: 0.6}}>Нет избранных мест</Typography>
        )}
      </Paper>
    </>
  )
}

export default ProfilePage
