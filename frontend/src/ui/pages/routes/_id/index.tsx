import {FC, useMemo, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {ModalController, Rating, RouteSpecs} from '@/ui/components'
import {
  alpha,
  Avatar,
  Box,
  Button,
  IconButton,
  Paper,
  Skeleton,
  Typography,
  useTheme,
} from '@mui/material'
import {useGetRouteQuery, useGetRoutesListQuery} from '@/core/store/routes'
import {Navigation, Pagination} from 'swiper/modules'
import {Swiper, SwiperProps, SwiperSlide} from 'swiper/react'
import {APP_FONTS} from '@/ui/themes/baseTheme'
import {YandexMap} from '@/modules/mui-yandex-maps'
import {LocationMarker, StyledArrowRight} from '@/assets/svg'
import CircleIcon from '@mui/icons-material/Circle'
import {DESKTOP_MAX_WIDTH} from '@/constants'
import {RouteTile} from '@/ui/components/_tiles'
import {hideOn, rootStyle, colorScheme} from '@/core/utils'
import {useSelector} from 'react-redux'
import {miscStateSelector} from '@/core/store/misc'
import {useIsDownLg, useModal} from '@/core/hooks'
import {
  ReviewModal,
  ReviewModalProps,
} from '@/ui/components/_modals/ReviewModal'
import {Download} from '@mui/icons-material'
import {REVIEWS_BLOCK_ID} from '@/constants/misc'
import {
  AuthorizationModal,
  AuthorizationModalProps,
} from '@/ui/components/_modals/AuthorizationModal'
import {downloadRoutePdf} from '../pdf/Document'

const SLIDES_OFFSET_BEFORE = Math.max(
  (window.innerWidth - DESKTOP_MAX_WIDTH) / 2,
  16,
)

const RouteIdPage: FC = () => {
  const theme = useTheme()
  const isDownLg = useIsDownLg()
  const params = useParams<string>()
  const navigate = useNavigate()

  const id = parseInt(params.id ?? '0', 10) || 0

  const {data: routeData} = useGetRouteQuery(
    {
      id,
      expand: {
        photos: true,
        reviews: true,
        stops__attraction__photos: true,
        stops__attraction__location: true,
        excursions: true,
      },
    },
    {skip: id === 0},
  )

  const route = routeData?.data

  const [gallerySlideIndex, setGallerySlideIndex] = useState(0)
  const handleGallerySlideIndexChange: NonNullable<
    SwiperProps['onRealIndexChange']
  > = swiper => {
    const {realIndex} = swiper
    setGallerySlideIndex(realIndex)
  }

  const [descriptionItemIndex, setDescriptionItemIndex] = useState(0)
  const descriptionItem = useMemo(() => {
    if (!route) return null
    const {listDescription} = route.customProperties ?? {}
    if (!listDescription) return null
    return listDescription[descriptionItemIndex]
  }, [route, descriptionItemIndex])

  const {user} = useSelector(miscStateSelector)
  const reviewModal = useModal<ReviewModalProps>()
  const authorizationModal = useModal<AuthorizationModalProps>()
  const [reviewsSlideIndex, setReviewsSlideIndex] = useState(0)
  const handleReviewsSlideIndexChange: NonNullable<
    SwiperProps['onRealIndexChange']
  > = swiper => {
    const {realIndex} = swiper
    setReviewsSlideIndex(realIndex)
  }

  const {data} = useGetRoutesListQuery({
    expand: {photos: true},
    size: 10,
  })
  const popular = data?.data.results
    .filter(r => r.id !== id)
    .map(r => r.routeTileProps)

  const handleAddReviewClick = (v?: number) => {
    if (!route) return
    if (!user) {
      authorizationModal.open({
        onAuthorized: () => {
          reviewModal.open({
            entityId: route.id,
            entityName: route.name,
            entityType: 'route',
            rating: v,
          })
        },
      })
    } else {
      reviewModal.open({
        entityId: route.id,
        entityName: route.name,
        entityType: 'route',
        rating: v,
      })
    }
  }

  const handleDownloadPdf = async () => {
    if (!route) return
    await downloadRoutePdf(route)
  }

  return (
    <>
      <ModalController control={authorizationModal.control}>
        <AuthorizationModal {...authorizationModal.props} />
      </ModalController>

      <ModalController control={reviewModal.control}>
        <ReviewModal {...reviewModal.props} />
      </ModalController>

      <Box
        sx={[
          rootStyle,
          t => ({
            display: 'flex',
            marginTop: '60px',
            justifyContent: 'space-between',
            padding: '0 16px',
            gap: '60px',
            marginBottom: '40px',
            [t.breakpoints.down('lg')]: {
              flexDirection: 'column-reverse',
              width: '100%',
              maxWidth: '100%',
              padding: '0',
              gap: '0',
              marginTop: '0',
              marginBottom: '20px',
            },
          }),
        ]}
      >
        <Box
          sx={t => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '20px',
            maxWidth: '470px',
            [t.breakpoints.down('lg')]: {
              width: '100%',
              padding: '0 16px',
              maxWidth: 'unset',
            },
          })}
        >
          <Typography
            variant='h1'
            sx={t => ({
              textTransform: 'uppercase',
              textAlign: 'left',
              fontSize: '36px',
              fontWeight: 700,
              fontFamily: APP_FONTS.oswald,
              width: '100%',
              [t.breakpoints.down('lg')]: {
                fontSize: '24px',
              },
            })}
          >
            {route ? route.name : <Skeleton sx={{width: '100%'}} />}
          </Typography>

          {route?.ratingProps ? (
            <Rating
              {...route.ratingProps}
              onClick={() => {
                if (route.ratingProps?.reviewsCount === 0) return
                const reviewsBlock = document.getElementById(REVIEWS_BLOCK_ID)
                reviewsBlock?.scrollIntoView({behavior: 'smooth'})
              }}
              sx={[!!route.ratingProps.reviewsCount && {cursor: 'pointer'}]}
            />
          ) : null}

          <RouteSpecs
            difficulty={route?.difficulty}
            totalDistance={route?.totalDistance}
            totalDuration={route?.totalDuration}
            isFamily={route?.properties?.isFamily}
            isOnCar={route?.properties?.isOnCar}
            isOnFoot={route?.properties?.isOnFoot}
            isOnHorseback={route?.properties?.isOnHorseback}
            isOnQuadBike={route?.properties?.isOnQuadBike}
            isOvernight={route?.properties?.isOvernight}
            isSwimming={route?.properties?.isSwimming}
            riseDegree={route?.properties?.riseDegree}
            season={route?.properties?.season}
            tileProps={{
              sx: t => ({
                width: 'calc(50% - 5px)',
                [t.breakpoints.down('lg')]: {
                  minWidth: 'unset',
                },
              }),
            }}
            isWithTitles
            isFullsize
          />
        </Box>

        <Box
          sx={t => ({
            width: '100%',
            maxWidth: '770px',
            display: 'flex',
            flexDirection: 'column',
            [t.breakpoints.down('lg')]: {
              maxWidth: '100%',
            },
            '& .swiper': {
              width: '100%',
              borderRadius: '20px',
              overflow: 'hidden',
              [t.breakpoints.down('lg')]: {
                borderRadius: '0',
              },
            },
            '& .swiper-slide': {
              aspectRatio: 768 / 504,
              [t.breakpoints.down('lg')]: {},
            },
          })}
        >
          <Swiper
            modules={[Navigation, ...(isDownLg ? [Pagination] : [])]}
            onRealIndexChange={handleGallerySlideIndexChange}
            slidesPerView={1}
            navigation={{
              prevEl: '#ImagesNavigationPrev',
              nextEl: '#ImagesNavigationNext',
            }}
            pagination={{el: '.images-pagination'}}
            loop
          >
            {route?.bannerItemPropsList.map(({id: key, ...props}) => (
              <SwiperSlide key={key}>
                <Box
                  component='img'
                  src={props.imageSrc}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </SwiperSlide>
            ))}

            {!route?.bannerItemPropsList.length ? (
              <SwiperSlide>
                <Skeleton
                  sx={{
                    width: '100%',
                    height: '100%',
                  }}
                />
              </SwiperSlide>
            ) : null}
          </Swiper>

          <Box
            sx={[
              hideOn('up', 'lg'),
              {
                marginTop: '-20px',
                zIndex: 99,
                backgroundColor: 'white',
                height: '30px',
                borderTopLeftRadius: '20px',
                borderTopRightRadius: '20px',
              },
            ]}
          >
            <Box
              className='images-pagination'
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                gap: '5px',
                marginTop: '-20px',
              }}
            />
          </Box>

          {route?.bannerItemPropsList.length !== 0 ? (
            <Box
              sx={[
                hideOn('down', 'lg'),
                {
                  display: 'flex',
                  gap: '20px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: '27px',
                },
              ]}
            >
              <IconButton
                id='ImagesNavigationPrev'
                sx={{
                  height: '60px',
                  aspectRatio: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid black',
                  color: 'black',
                  '& svg': {
                    fontSize: '30px',
                    transform: 'rotate(180deg)',
                  },
                }}
              >
                <StyledArrowRight />
              </IconButton>

              <Typography sx={{fontSize: '16px'}}>
                {gallerySlideIndex + 1}/{route?.bannerItemPropsList.length}
              </Typography>

              <IconButton
                id='ImagesNavigationNext'
                sx={{
                  height: '60px',
                  aspectRatio: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid black',
                  color: 'black',
                  '& svg': {
                    fontSize: '30px',
                  },
                }}
              >
                <StyledArrowRight />
              </IconButton>
            </Box>
          ) : null}
        </Box>
      </Box>

      <Button
        variant='outlined'
        sx={[
          hideOn('up', 'lg'),
          t => ({
            color: t.palette.text.primary + ' !important',
            borderColor: alpha(t.palette.text.primary, 0.5),
            minWidth: 'calc(100% - 32px)',
            fontSize: '14px !important',
            height: '50px',
            marginBottom: '20px',
          }),
        ]}
        onClick={handleDownloadPdf}
        startIcon={<Download />}
      >
        Скачать PDF
      </Button>

      {route?.stops.length ? (
        <Box
          sx={[
            rootStyle,
            t => ({
              padding: '0 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '44px',
              [t.breakpoints.down('lg')]: {
                padding: '0',
                gap: '30px',
                maxWidth: '100%',
                marginBottom: '20px',
              },
            }),
          ]}
        >
          <Box
            sx={t => ({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '17px',
              [t.breakpoints.down('lg')]: {
                alignItems: 'flex-start',
                flexDirection: 'column',
                padding: '0 16px',
              },
            })}
          >
            <Typography
              sx={t => ({
                textTransform: 'uppercase',
                textAlign: 'left',
                fontSize: '36px',
                fontWeight: 700,
                fontFamily: APP_FONTS.oswald,
                [t.breakpoints.down('lg')]: {
                  fontSize: '24px',
                },
              })}
            >
              Маршрут
            </Typography>

            <Button
              variant='outlined'
              sx={[
                hideOn('down', 'lg'),
                t => ({
                  color: t.palette.text.primary + ' !important',
                  borderColor: alpha(t.palette.text.primary, 0.5),
                  minWidth: 'fit-content',
                }),
              ]}
              onClick={handleDownloadPdf}
              startIcon={<Download />}
            >
              Скачать PDF
            </Button>
          </Box>

          <Box
            sx={t => ({
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: '34px',
              border: '1px solid black',
              borderRadius: '20px',
              padding: '56px 61px',
              '.swiper': {
                width: '100%',
              },
              [t.breakpoints.down('lg')]: {
                padding: '0',
                border: 'none',
                width: '100%',
              },
              '& .swiper-slide': {
                [t.breakpoints.down('lg')]: {
                  width: '125px',
                },
              },
            })}
          >
            <Box
              sx={[
                hideOn('down', 'lg'),
                {
                  position: 'absolute',
                  top: '127px',
                  left: '160px',
                  width: 'calc(100% - 160px)',
                  zIndex: 10,
                  backgroundImage:
                    'linear-gradient(to right, black 50%, rgba(255,255,255,0) 0%)',
                  backgroundPosition: 'bottom',
                  backgroundSize: '40px 4px',
                  backgroundRepeat: 'repeat-x',
                  height: '4px',
                },
              ]}
            />

            <IconButton
              id='RouteNavigationPrev'
              sx={[
                hideOn('down', 'lg'),
                {
                  height: '60px',
                  aspectRatio: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid black',
                  color: 'black',
                  '& svg': {
                    fontSize: '30px',
                    transform: 'rotate(180deg)',
                  },
                },
              ]}
            >
              <StyledArrowRight />
            </IconButton>

            <Swiper
              modules={[Navigation, ...(isDownLg ? [Pagination] : [])]}
              slidesPerView={isDownLg ? 'auto' : 1}
              navigation={{
                prevEl: '#RouteNavigationPrev',
                nextEl: '#RouteNavigationNext',
              }}
              loop
            >
              {route?.stops.map(({id: key, ...props}, index) => (
                <SwiperSlide key={key}>
                  <Box
                    onClick={() => {
                      if (!isDownLg) return
                      navigate(`/places/${props.attraction.id}`)
                    }}
                    sx={t => ({
                      [t.breakpoints.down('lg')]: {
                        height: '100%',
                        width: '100%',
                        position: 'relative',
                      },
                    })}
                  >
                    <Typography
                      sx={[
                        hideOn('up', 'lg'),
                        {
                          position: 'absolute',
                          top: '10px',
                          left: '20px',
                          backgroundColor: '#0196FA',
                          color: 'white',
                          padding: '3px 7px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '6px',
                          fontSize: '13px',
                          lineHeight: '13px',
                          fontWeight: 600,
                        },
                      ]}
                    >
                      {index + 1}
                    </Typography>

                    <Box
                      sx={[
                        hideOn('down', 'lg'),
                        {
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'flex-start',
                          '& svg': {
                            height: '46px',
                            width: '36px',
                          },
                          gap: '15px',
                          marginBottom: '50px',
                        },
                      ]}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '18px',
                        }}
                      >
                        <LocationMarker />
                        <Box
                          sx={{
                            width: '18px',
                            height: '18px',
                            backgroundColor: 'black',
                            borderRadius: 9999,
                          }}
                        />
                      </Box>
                      <Box sx={{display: 'flex', flexDirection: 'column'}}>
                        <Typography
                          sx={{
                            textTransform: 'uppercase',
                            fontSize: '24px',
                            lineHeight: '24px',
                            fontFamily: APP_FONTS.oswald,
                            fontWeight: 500,
                          }}
                        >
                          {props.attraction.name}
                        </Typography>
                        <Typography>точка {index + 1}</Typography>
                      </Box>
                    </Box>

                    <Box
                      sx={t => ({
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '38px',
                        paddingLeft: '10px',
                        [t.breakpoints.down('lg')]: {
                          flexDirection: 'column',
                          gap: '8px',
                          paddingLeft: '16px',
                        },
                      })}
                    >
                      <Box
                        sx={[
                          hideOn('down', 'lg'),
                          {
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '38px',
                          },
                        ]}
                      >
                        <Typography
                          sx={{
                            lineHeight: '24px',
                            display: 'block',
                            height: '290px',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                          }}
                        >
                          {props.attraction.description}
                        </Typography>

                        <Button
                          variant='outlined'
                          sx={{
                            color: t => t.palette.text.primary,
                            fontWeight: 500,
                            borderColor: t =>
                              alpha(t.palette.text.primary, 0.4),
                          }}
                          onClick={() =>
                            navigate(`/places/${props.attraction.id}`)
                          }
                        >
                          Подробнее
                        </Button>
                      </Box>

                      <Box
                        component='img'
                        src={props.attraction.mainImage}
                        sx={t => ({
                          objectFit: 'cover',
                          maxWidth: '50%',
                          width: '100%',
                          maxHeight: '296px',
                          aspectRatio: '1.5',
                          borderRadius: '20px',
                          [t.breakpoints.down('lg')]: {
                            maxWidth: 'unset',
                            maxHeight: 'unset',
                            height: '100%',
                            width: '100%',
                            aspectRatio: '1',
                          },
                        })}
                      />

                      <Typography
                        sx={[
                          hideOn('up', 'lg'),
                          {
                            fontSize: '13px',
                            lineHeight: '18px',
                            fontWeight: 600,
                          },
                        ]}
                      >
                        {props.attraction.name}
                      </Typography>
                    </Box>
                  </Box>
                </SwiperSlide>
              ))}
            </Swiper>

            <IconButton
              id='RouteNavigationNext'
              sx={[
                hideOn('down', 'lg'),
                {
                  height: '60px',
                  aspectRatio: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid black',
                  color: 'black',
                  '& svg': {
                    fontSize: '30px',
                  },
                },
              ]}
            >
              <StyledArrowRight />
            </IconButton>
          </Box>
        </Box>
      ) : null}

      <Box
        sx={[
          rootStyle,
          t => ({
            display: 'flex',
            flexDirection: 'column',
            marginTop: '40px',
            gap: '44px',
            [t.breakpoints.down('lg')]: {
              marginTop: '0px',
              padding: '0 16px',
              marginBottom: '20px',
              gap: '17px',
            },
          }),
        ]}
      >
        <YandexMap
          sx={t => ({
            [t.breakpoints.down('lg')]: {
              height: '190px',
            },
          })}
          backgroundColor={colorScheme(theme).background.root}
        />
      </Box>

      {route?.customProperties?.toTakeWithYou?.length ? (
        <Box
          sx={[
            rootStyle,
            t => ({
              display: 'flex',
              flexDirection: 'column',
              marginTop: '40px',
              gap: '44px',
              [t.breakpoints.down('lg')]: {
                marginTop: '0px',
                padding: '0 16px',
                marginBottom: '20px',
                gap: '17px',
              },
            }),
          ]}
        >
          <Box
            sx={t => ({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '17px',
              [t.breakpoints.down('lg')]: {
                alignItems: 'flex-start',
                flexDirection: 'column',
              },
            })}
          >
            <Typography
              sx={t => ({
                textTransform: 'uppercase',
                textAlign: 'left',
                fontSize: '36px',
                fontWeight: 700,
                fontFamily: APP_FONTS.oswald,
                [t.breakpoints.down('lg')]: {
                  fontSize: '24px',
                },
              })}
            >
              Что взять с собой
            </Typography>
          </Box>

          <Paper
            sx={t => ({
              boxShadow: '0px 4px 46.4px 0px #B4B4B440',
              padding: '46px 54px',
              borderRadius: '20px',
              display: 'flex',
              justifyContent: 'space-evenly',
              [t.breakpoints.down('lg')]: {
                flexDirection: 'column',
                padding: '20px',
                gap: '24px',
              },
            })}
          >
            {route.customProperties.toTakeWithYou.map(take => (
              <Box
                key={take.title}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    marginBottom: '8px',
                  }}
                >
                  {take.title}
                </Typography>
                {take.items.map(item => (
                  <Box
                    key={item}
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: '10px',
                      '& svg': {
                        fontSize: '5px',
                      },
                    }}
                  >
                    <CircleIcon />
                    <Typography>{item}</Typography>
                  </Box>
                ))}
              </Box>
            ))}
          </Paper>
        </Box>
      ) : null}

      {route?.customProperties?.listDescription?.length ? (
        <Box
          sx={[
            rootStyle,
            t => ({
              display: 'flex',
              flexDirection: 'column',
              marginTop: '40px',
              gap: '44px',
              [t.breakpoints.down('lg')]: {
                marginTop: '10px',
                padding: '0 16px',
                marginBottom: '20px',
                gap: '30px',
              },
            }),
          ]}
        >
          <Typography
            sx={t => ({
              textTransform: 'uppercase',
              textAlign: 'left',
              fontSize: '36px',
              fontWeight: 700,
              fontFamily: APP_FONTS.oswald,
              [t.breakpoints.down('lg')]: {
                fontSize: '24px',
              },
            })}
          >
            Описание маршрута
          </Typography>

          <Box sx={{display: 'flex', gap: '12px'}}>
            {route.customProperties.listDescription.map((item, index) => (
              <Button
                key={item.title}
                variant={
                  index === descriptionItemIndex || isDownLg
                    ? 'contained'
                    : 'outlined'
                }
                sx={[
                  t => ({
                    minWidth: '288px',
                    height: '53px',
                    fontSize: '16px',
                    [t.breakpoints.down('lg')]: {
                      minWidth: 'unset',
                      borderRadius: '10px',
                      height: '37px',
                      fontSize: '14px !important',
                    },
                  }),
                  index !== descriptionItemIndex && {
                    color: t => t.palette.text.primary,
                  },
                  index !== descriptionItemIndex &&
                    isDownLg && {
                      backgroundColor: t => t.palette.grey[300],
                    },
                  index === descriptionItemIndex && {
                    backgroundColor: '#296587 !important',
                  },
                ]}
                onClick={() => setDescriptionItemIndex(index)}
              >
                {item.title}
              </Button>
            ))}
          </Box>

          <Paper
            sx={t => ({
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0px 4px 46.4px 0px #B4B4B440',
              padding: '46px 54px',
              borderRadius: '20px',
              gap: '22px',
              [t.breakpoints.down('lg')]: {
                padding: '22px 28px',
                gap: '10px',
              },
            })}
          >
            <Typography
              sx={() => ({
                fontSize: '24px',
                lineHeight: '36px',
                fontWeight: 500,
              })}
            >
              {descriptionItem?.title}
            </Typography>
            <Typography
              sx={t => ({
                fontSize: '20px',
                lineHeight: '28px',
                whiteSpace: 'pre-line',
                [t.breakpoints.down('lg')]: {
                  fontSize: '14px',
                },
              })}
            >
              {descriptionItem?.text}
            </Typography>
          </Paper>
        </Box>
      ) : null}

      {route?.mainDetails ? (
        <Box
          sx={[
            rootStyle,
            t => ({
              display: 'flex',
              flexDirection: 'column',
              gap: '44px',
              marginTop: '64px',
              [t.breakpoints.down('lg')]: {
                marginTop: '0px',
                padding: '0 16px',
                marginBottom: '20px',
                gap: '16px',
              },
            }),
          ]}
        >
          <Box sx={{display: 'flex', alignItems: 'center', gap: '48px'}}>
            <Typography
              sx={[
                rootStyle,
                t => ({
                  textTransform: 'uppercase',
                  textAlign: 'left',
                  fontSize: '36px',
                  fontWeight: 700,
                  fontFamily: APP_FONTS.oswald,
                  [t.breakpoints.down('lg')]: {
                    fontSize: '24px',
                  },
                }),
              ]}
            >
              Важно знать
            </Typography>
          </Box>

          <Paper
            sx={t => ({
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0px 4px 46.4px 0px #B4B4B440',
              padding: '46px 54px',
              borderRadius: '20px',
              [t.breakpoints.down('lg')]: {
                padding: '22px 28px',
              },
            })}
          >
            <Typography
              sx={t => ({
                fontSize: '20px',
                lineHeight: '28px',
                whiteSpace: 'pre-line',
                [t.breakpoints.down('lg')]: {
                  fontSize: '14px',
                  lineHeight: '18px',
                },
              })}
            >
              {route.mainDetails}
            </Typography>
          </Paper>
        </Box>
      ) : null}

      {route?.reviews.length ? (
        <Box
          sx={[
            t => ({
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              marginTop: '40px',
              gap: '44px',
              alignItems: 'center',
              [t.breakpoints.down('lg')]: {
                marginTop: '10px',
                marginBottom: '20px',
                gap: '10px',
              },
            }),
          ]}
        >
          <Typography
            sx={[
              rootStyle,
              t => ({
                textTransform: 'uppercase',
                textAlign: 'left',
                fontSize: '36px',
                fontWeight: 700,
                fontFamily: APP_FONTS.oswald,
                [t.breakpoints.down('lg')]: {
                  fontSize: '24px',
                  padding: '0 16px',
                },
              }),
            ]}
          >
            Отзывы
          </Typography>

          {route && user && !isDownLg ? (
            <Paper
              sx={[
                rootStyle,
                {
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  boxShadow: '0px 4px 46.4px 0px #B4B4B440',
                  padding: '46px 54px',
                  borderRadius: '20px',
                  gap: '30px',
                },
              ]}
            >
              <Rating
                addMode
                sx={{
                  gap: '16px',
                  '& svg': {
                    fontSize: '36px',
                    color: 'black',
                  },
                }}
                onChange={handleAddReviewClick}
              />
              <Button
                sx={{
                  color: t => t.palette.text.primary + ' !important',
                  borderColor: t => alpha(t.palette.text.primary, 0.5),
                }}
                onClick={() => handleAddReviewClick()}
                variant='outlined'
              >
                Оставить отзыв
              </Button>
            </Paper>
          ) : null}

          {route?.reviews.length ? (
            <>
              <Box
                sx={t => ({
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                  '.swiper': {
                    width: '100%',
                    [t.breakpoints.down('lg')]: {
                      padding: '10px 0',
                    },
                  },
                  '& .swiper-slide': {
                    display: 'flex',
                    maxWidth: '544px',
                    alignSelf: 'stretch',
                    [t.breakpoints.down('lg')]: {
                      maxWidth: '270px',
                    },
                  },
                })}
              >
                <Swiper
                  modules={[Navigation]}
                  slidesPerView='auto'
                  navigation={{
                    prevEl: '#ReviewsNavigationPrev',
                    nextEl: '#ReviewsNavigationNext',
                  }}
                  onRealIndexChange={handleReviewsSlideIndexChange}
                  slidesOffsetBefore={SLIDES_OFFSET_BEFORE}
                  spaceBetween={isDownLg ? '16px' : '30px'}
                  loop
                >
                  {route.reviews.map(({id: key, ...props}) => (
                    <SwiperSlide key={key}>
                      <Box
                        sx={t => ({
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px',
                          border: `1px solid ${t.palette.text.primary}`,
                          borderRadius: '20px',
                          padding: '30px',
                          flex: 1,
                          [t.breakpoints.down('lg')]: {
                            padding: '16px 13px',
                            border: 'none',
                            boxShadow: '0px 2px 12.3px 0px #00000029',
                          },
                        })}
                      >
                        <Box
                          sx={t => ({
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '43px',
                            [t.breakpoints.down('lg')]: {
                              gap: '10px',
                              justifyContent: 'flex-start',
                            },
                          })}
                        >
                          <Avatar
                            sx={{bgcolor: t => t.palette.grey[300]}}
                            alt={props.createdBy.fullName}
                          />
                          <Box
                            sx={t => ({
                              display: 'flex',
                              flex: 1,
                              [t.breakpoints.down('lg')]: {
                                flexDirection: 'column',
                              },
                            })}
                          >
                            <Typography
                              sx={t => ({
                                fontSize: '20px',
                                fontWeight: 600,
                                marginRight: 'auto',
                                [t.breakpoints.down('lg')]: {
                                  fontSize: '13px',
                                  '& svg': {
                                    height: '18px',
                                    width: '18px',
                                  },
                                },
                              })}
                            >
                              {props.createdBy.fullName ?? 'Аноним'}
                            </Typography>
                            <Rating rating={props.starRate.id} />
                          </Box>
                        </Box>
                        <Typography
                          sx={{
                            fontSize: '12px',
                          }}
                        >
                          {props.text}
                        </Typography>
                      </Box>
                    </SwiperSlide>
                  ))}
                </Swiper>

                <Button
                  sx={[
                    hideOn('up', 'lg'),
                    {
                      borderColor: '#007AFF',
                      width: 'calc(100% - 32px)',
                      alignSelf: 'center',
                      borderRadius: '10px',
                      color: '#007AFF',
                      height: '40px',
                      fontSize: '13px !important',
                      marginTop: '10px',
                    },
                  ]}
                  onClick={() => handleAddReviewClick()}
                  variant='outlined'
                >
                  Оставить отзыв
                </Button>
              </Box>

              {route?.reviews.length !== 0 ? (
                <Box
                  sx={[
                    hideOn('down', 'lg'),
                    rootStyle,
                    {
                      display: 'flex',
                      gap: '20px',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                    },
                  ]}
                >
                  <IconButton
                    id='ReviewsNavigationPrev'
                    sx={{
                      height: '60px',
                      aspectRatio: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid black',
                      color: 'black',
                      '& svg': {
                        fontSize: '30px',
                        transform: 'rotate(180deg)',
                      },
                    }}
                  >
                    <StyledArrowRight />
                  </IconButton>

                  <Typography sx={{fontSize: '16px'}}>
                    {reviewsSlideIndex + 1}/{route?.reviews.length}
                  </Typography>

                  <IconButton
                    id='ReviewsNavigationNext'
                    sx={{
                      height: '60px',
                      aspectRatio: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid black',
                      color: 'black',
                      '& svg': {
                        fontSize: '30px',
                      },
                    }}
                  >
                    <StyledArrowRight />
                  </IconButton>
                </Box>
              ) : null}
            </>
          ) : null}
        </Box>
      ) : null}

      {popular?.length ? (
        <Box
          sx={t => ({
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '44px',
            marginTop: '54px',
            [t.breakpoints.down('lg')]: {
              gap: '30px',
              marginTop: '10px',
            },
          })}
        >
          <Typography
            sx={[
              rootStyle,
              t => ({
                textTransform: 'uppercase',
                textAlign: 'left',
                fontSize: '36px',
                fontWeight: 700,
                fontFamily: APP_FONTS.oswald,
                [t.breakpoints.down('lg')]: {
                  fontSize: '24px',
                  padding: '0 16px',
                },
              }),
            ]}
          >
            Популярные маршруты
          </Typography>

          <Box
            sx={t => ({
              width: '100%',
              '& .swiper-pagination': {
                bottom: '-10px',
                overflow: 'visible',
              },
              '& .swiper-slide': {
                width: '635px',
                height: '418px',
                [t.breakpoints.down('lg')]: {
                  width: '312px',
                  height: '204px',
                },
              },
            })}
          >
            <Swiper
              modules={[...(isDownLg ? [Pagination] : [])]}
              spaceBetween={isDownLg ? '24px' : '44px'}
              slidesPerView='auto'
              navigation={{
                prevEl: '#PlacesNavigationPrev',
                nextEl: '#PlacesNavigationNext',
              }}
              pagination={{el: '.routes-pagination'}}
              slidesOffsetBefore={SLIDES_OFFSET_BEFORE}
              loop
            >
              {popular.map(({...props}) => (
                <SwiperSlide key={props.name}>
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
                marginBottom: '40px',
              },
            ]}
          />
        </Box>
      ) : null}
    </>
  )
}

export default RouteIdPage
