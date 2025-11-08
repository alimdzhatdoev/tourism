import {FC, useCallback, useMemo, useRef, useState} from 'react'
import {useParams} from 'react-router-dom'
import {ModalController, Rating} from '@/ui/components'
import {
  alpha,
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  Skeleton,
  Typography,
  useTheme,
} from '@mui/material'
import {
  colorScheme,
  createStyles,
  hideOn,
  isIosSafari,
  rootStyle,
} from '@/core/utils'
import {
  useGetAttractionQuery,
  useGetAttractionsListQuery,
} from '@/core/store/attractions'
import {PlaceIcon} from '@/ui/components/_map-icons'
import {YandexMap} from '@/modules/mui-yandex-maps'
import {DESKTOP_MAX_WIDTH, REVIEWS_BLOCK_ID} from '@/constants/misc'
import {Swiper, SwiperProps, SwiperRef, SwiperSlide} from 'swiper/react'
import {APP_FONTS} from '@/ui/themes/baseTheme'
import {Navigation, Pagination} from 'swiper/modules'
import {PlaceTile} from '@/ui/components/_tiles'
import {skipToken} from '@reduxjs/toolkit/query'
import {GROUPS_IDS} from '@/constants'
import {useSelector} from 'react-redux'
import {useIsDownLg, useModal} from '@/core/hooks'
import {miscStateSelector} from '@/core/store/misc'
import {
  ReviewModal,
  ReviewModalProps,
} from '@/ui/components/_modals/ReviewModal'
import {Email, Language, Person, Phone, WhatsApp} from '@mui/icons-material'
import {
  AuthorizationModal,
  AuthorizationModalProps,
} from '@/ui/components/_modals/AuthorizationModal'
import {StyledArrowRight} from '@/assets/svg'

const SLIDES_OFFSET_BEFORE = Math.max(
  (window.innerWidth - DESKTOP_MAX_WIDTH) / 2,
  16,
)

const LIST_TITLES: Record<keyof typeof GROUPS_IDS, string> = {
  equipment: 'Популярный прокат оборудования',
  guides: 'Популярные гиды',
  hotels: 'Популярные гостинницы',
  museums: 'Популярные музеи',
  fuel_stations: 'Популярные АЗС',
  restaurants: 'Популярные кафе-рестораны',
}

const ServicesIdPage: FC = () => {
  const theme = useTheme()
  const isDownLg = useIsDownLg()
  const params = useParams<string>()

  const id = parseInt(params.id ?? '0', 10) || 0

  const {data: attractionData} = useGetAttractionQuery(
    {
      id,
      expand: {
        photos: true,
        reviews: true,
        location: true,
        excursions: true,
        schedules: true,
        groups: true,
        contacts__contact__kind: true,
      },
    },
    {skip: id === 0},
  )

  const attraction = attractionData?.data

  const handleCreateRouteClick = () => {
    navigator.geolocation.getCurrentPosition(position => {
      const from = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      }
      const to = {
        lat: attraction?.location.point?.coordinates[1],
        lon: attraction?.location.point?.coordinates[0],
      }
      const newWindow = window.open(
        `https://yandex.ru/maps/?rtext=${from.lat},${from.lon}~${to.lat},${to.lon}&rtt=auto`,
        isIosSafari() ? '_self' : '_blank',
        'noopener,noreferrer',
      )
      if (newWindow) newWindow.opener = null
    })
  }

  const [gallerySlideIndex, setGallerySlideIndex] = useState<number>(0)
  const fullWidthSwiperRef = useRef<SwiperRef>(null)

  const handleCarouselSlideIndexChange = useCallback<
    NonNullable<SwiperProps['onRealIndexChange']>
  >(swiper => {
    const {realIndex} = swiper
    fullWidthSwiperRef.current?.swiper.slideTo(realIndex)
    setGallerySlideIndex(realIndex)
  }, [])

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

  const groupType = useMemo(() => {
    if (!attraction) return null
    const groupIds = attraction.groups.map(g => g.id)
    const groupTypes = Object.entries(GROUPS_IDS) as Array<
      [keyof typeof GROUPS_IDS, number]
    >
    const foundGroupType = groupTypes.find(([_, groupId]) =>
      groupIds.includes(groupId),
    )
    if (!foundGroupType) return null
    const [type, groupId] = foundGroupType
    return {type, id: groupId}
  }, [attraction])

  const {data} = useGetAttractionsListQuery(
    groupType
      ? {
          filters: {
            group_id: groupType.id.toString(),
          },
          expand: {photos: true, location: true, reviews: true},
        }
      : skipToken,
  )

  const places =
    data?.data.results
      .filter(p => p.id !== id)
      .map(a => ({...a.placeTileProps, id: a.id})) ?? []

  const contacts = useMemo(
    () =>
      attraction?.contacts.reduce(
        (acc, cur) => {
          if (
            ['phone', 'email', 'website', 'whatsapp', 'social'].includes(
              cur.contact.kind.name,
            )
          ) {
            acc[cur.contact.kind.name as keyof typeof acc] = cur.contact.value
          }
          return acc
        },
        {} as {
          phone?: string
          email?: string
          website?: string
          whatsapp?: string
          social?: string
        },
      ),
    [attraction],
  )

  const handleAddReviewClick = (v?: number) => {
    if (!attraction) return
    if (!user) {
      authorizationModal.open({
        onAuthorized: () => {
          reviewModal.open({
            entityId: attraction.id,
            entityName: attraction.name,
            entityType: 'attraction',
            rating: v,
          })
        },
      })
    } else {
      reviewModal.open({
        entityId: attraction.id,
        entityName: attraction.name,
        entityType: 'attraction',
        rating: v,
      })
    }
  }

  return (
    <>
      <ModalController control={authorizationModal.control}>
        <AuthorizationModal {...authorizationModal.props} />
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
            gap: '20px',
            maxWidth: '470px',
            [t.breakpoints.down('lg')]: {
              width: '100%',
              padding: '0 16px',
              maxWidth: 'unset',
              gap: '25px',
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
              color: 'black',
              [t.breakpoints.down('lg')]: {
                fontSize: '24px',
                color: 'unset',
              },
            })}
          >
            {attraction ? attraction.name : <Skeleton sx={{width: '100%'}} />}
          </Typography>

          {attraction?.ratingProps ? (
            <Rating
              {...attraction.ratingProps}
              onClick={() => {
                if (attraction.ratingProps?.reviewsCount === 0) return
                const reviewsBlock = document.getElementById(REVIEWS_BLOCK_ID)
                reviewsBlock?.scrollIntoView({behavior: 'smooth'})
              }}
              sx={[
                !!attraction.ratingProps.reviewsCount && {cursor: 'pointer'},
              ]}
              slotProps={{
                reviewsCount: {
                  sx: t => ({
                    [t.breakpoints.up('lg')]: {
                      color: 'black',
                    },
                  }),
                },
              }}
            />
          ) : null}

          <Divider sx={hideOn('up', 'lg')} />

          <Typography
            sx={[
              hideOn('up', 'lg'),
              {fontSize: '14px', whiteSpace: 'pre-line'},
            ]}
          >
            {attraction ? (
              attraction.description
            ) : (
              <>
                <Skeleton
                  variant='text'
                  sx={{opacity: 0.2, marginBottom: '15px'}}
                  width='80%'
                />
                <Skeleton
                  variant='text'
                  sx={{opacity: 0.2, marginBottom: '15px'}}
                  width='70%'
                />
              </>
            )}
          </Typography>

          {contacts?.phone ? (
            <a href={`tel:${contacts.phone}`}>
              <Button
                variant='outlined'
                sx={s.contactButton}
                startIcon={<Phone />}
              >
                <Typography sx={s.contactText}>{contacts.phone}</Typography>
              </Button>
            </a>
          ) : null}

          {contacts?.email ? (
            <a href={`mailto:${contacts.email}`}>
              <Button
                variant='outlined'
                sx={s.contactButton}
                startIcon={<Email />}
              >
                <Typography sx={s.contactText}>{contacts.email}</Typography>
              </Button>
            </a>
          ) : null}

          {contacts?.website ? (
            <a href={contacts.website} target='_blank' rel='noreferrer'>
              <Button
                variant='outlined'
                sx={s.contactButton}
                startIcon={<Language />}
              >
                <Typography sx={s.contactText}>{contacts.website}</Typography>
              </Button>
            </a>
          ) : null}

          {contacts?.whatsapp ? (
            <a href={`https://wa.me/${contacts.whatsapp}`}>
              <Button
                variant='outlined'
                sx={s.contactButton}
                startIcon={<WhatsApp />}
              >
                <Typography sx={s.contactText}>{contacts.whatsapp}</Typography>
              </Button>
            </a>
          ) : null}

          {contacts?.social ? (
            <a href={contacts.social} target='_blank' rel='noreferrer'>
              <Button
                variant='outlined'
                sx={s.contactButton}
                startIcon={<Person />}
              >
                <Typography sx={s.contactText}>{contacts.social}</Typography>
              </Button>
            </a>
          ) : null}
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
              display: 'flex',
              aspectRatio: 768 / 504,
              width: '770px',
              [t.breakpoints.down('lg')]: {
                width: '100%',
              },
            },
          })}
        >
          <Swiper
            modules={[Navigation, ...(isDownLg ? [Pagination] : [])]}
            slidesPerView={1}
            navigation={{
              prevEl: '#ImagesNavigationPrev',
              nextEl: '#ImagesNavigationNext',
            }}
            onRealIndexChange={handleCarouselSlideIndexChange}
            pagination={{el: '.images-pagination'}}
            loop
          >
            {attraction?.bannerItemPropsList.map(({id: key, ...props}) => (
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

            {!attraction?.bannerItemPropsList.length ? (
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

          {attraction?.bannerItemPropsList.length !== 0 ? (
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
                    color: 'black',
                    transform: 'rotate(180deg)',
                  },
                }}
              >
                <StyledArrowRight />
              </IconButton>

              <Typography sx={{fontSize: '16px', color: 'black'}}>
                {gallerySlideIndex + 1}/{attraction?.bannerItemPropsList.length}
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
                    color: 'black',
                  },
                }}
              >
                <StyledArrowRight />
              </IconButton>
            </Box>
          ) : null}
        </Box>
      </Box>

      {attraction && !isDownLg ? (
        <Box
          sx={[
            rootStyle,
            t => ({
              display: 'flex',
              flexDirection: 'column',
              gap: '44px',
              marginTop: '20px',
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
              Описание
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
              {attraction.description}
            </Typography>
          </Paper>
        </Box>
      ) : null}

      {groupType?.type !== 'guides' ? (
        <Box
          sx={[
            rootStyle,
            t => ({
              display: 'flex',
              flexDirection: 'column',
              marginTop: '64px',
              gap: '44px',
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
              Как добраться
            </Typography>

            <Box
              sx={[
                hideOn('down', 'lg'),
                {height: '1px', flex: 1, bgcolor: 'black'},
              ]}
            />

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
              onClick={handleCreateRouteClick}
            >
              Проложить маршрут
            </Button>
          </Box>

          {attraction?.howToGet ? (
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
              {attraction.howToGet}
            </Typography>
          ) : null}

          {attraction ? (
            <YandexMap
              sx={t => ({
                [t.breakpoints.down('lg')]: {
                  height: '190px',
                },
              })}
              backgroundColor={colorScheme(theme).background.root}
              placemarks={[
                {
                  iconProps: attraction.placeIconProps,
                  id: attraction.id,
                  width: 400,
                  height: 100,
                  defaultGeometry: attraction.location.placemarkGeometry,
                },
              ]}
              renderIcon={PlaceIcon}
            />
          ) : null}

          <Button
            variant='contained'
            sx={[
              hideOn('up', 'lg'),
              {backgroundColor: '#296587', marginTop: '15px'},
            ]}
            onClick={handleCreateRouteClick}
          >
            Проложить маршрут
          </Button>
        </Box>
      ) : null}

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

        {attraction && user && !isDownLg ? (
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

        {attraction ? (
          <>
            <Box
              sx={t => ({
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                '& .swiper': {
                  width: '100%',
                  [t.breakpoints.down('lg')]: {
                    padding: '10px 0',
                  },
                },
                '& .swiper-slide': {
                  display: 'flex',
                  width: '544px',
                  alignSelf: 'stretch',
                  [t.breakpoints.down('lg')]: {
                    width: '270px',
                  },
                },
              })}
            >
              {attraction.reviews.length ? (
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
                  {attraction.reviews.map(({id: key, ...props}) => (
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
              ) : null}

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

            {attraction?.reviews.length !== 0 ? (
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
                  {reviewsSlideIndex + 1}/{attraction?.reviews.length}
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

      {groupType ? (
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
            {LIST_TITLES[groupType.type]}
          </Typography>

          <Box
            sx={t => ({
              width: '100%',
              '& .swiper-pagination': {
                bottom: '-10px',
                overflow: 'visible',
              },
              '& .swiper-slide': {
                width: '303px',
                height: '458px',
                [t.breakpoints.down('lg')]: {
                  width: '180px',
                  height: '267px',
                },
              },
            })}
          >
            <Swiper
              modules={[...(isDownLg ? [Pagination] : [])]}
              spaceBetween={isDownLg ? '24px' : '44px'}
              slidesPerView='auto'
              pagination={{el: '.places-pagination'}}
              slidesOffsetBefore={SLIDES_OFFSET_BEFORE}
              loop
            >
              {places.map(({...props}) => (
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

      <ModalController control={reviewModal.control}>
        <ReviewModal {...reviewModal.props} />
      </ModalController>
    </>
  )
}

const s = createStyles({
  contactButton: {
    color: t => t.palette.text.primary + ' !important',
    borderColor: t => alpha(t.palette.text.primary, 0.5),
    width: '100%',
    height: '50px',
    display: 'flex',
    justifyContent: 'center',
    gap: '5px',
  },
  contactText: {
    width: 'fit-content',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    display: 'inline-block',
    textAlign: 'left',
    fontWeight: 600,
  },
})

export default ServicesIdPage
