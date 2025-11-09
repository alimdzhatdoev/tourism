import {ChangeEvent, FC, useRef, useState} from 'react'
import {alpha, Box, Button, ButtonBase, Paper, Typography} from '@mui/material'
import {colorScheme, fileToBase64, hideOn, px, rootStyle} from '@/core/utils'
import {APP_FONTS} from '@/ui/themes/baseTheme'
import {useNavigate} from 'react-router-dom'
import {
  CultureSvg,
  MineralSvg,
  NatureSvg,
  ResortSvg,
  ScienceSvg,
  SportSvg,
} from '@/assets/svg/about'
import {useGetPublishedUserGalleryPhotosQuery} from '@/core/store/user_gallery_photos'
import {Add} from '@mui/icons-material'
import {ModalController} from '@/ui/components'
import {
  ImagePreviewModal,
  ImagePreviewModalProps,
  RegionSelectModal,
  RegionSelectModalProps,
} from '@/ui/components/_modals'
import {useModal} from '@/core/hooks'
import {
  AuthorizationModal,
  AuthorizationModalProps,
} from '@/ui/components/_modals/AuthorizationModal'
import {useSelector} from 'react-redux'
import {miscStateSelector} from '@/core/store/misc'
import {HEADER_HEIGHT} from '@/ui/components/Layout/Header/Header.styles'

const TEXT =
  'Удобное географическое положение, развитая транспортная инфраструктура, обилие природных и др. туристических ресурсов, густая населенность предгорий и гостеприимство местного населения делают Карачаево-Черкесию регионом, одним из наиболее интересных для посещения туристами.\n\nВ Карачаево-Черкесской Республике сотни прекрасных, неповторимых мест. Одно не похоже на другое. Заповедные уголки позволят увидеть все красоты и чудеса, которые навсегда запомнятся своей самобытностью.\n\nУдивительной красоты пейзажи, поражающие своей грацией и величественностью горные массивы вкупе с завораживающей тишиной и полезными свойствами горного воздуха.\n\nВ больших запасах — лечебные минеральные воды, присутствуют множество термальных источников.'

const TILES_DATA: Array<{
  Icon: FC
  title: string
  body: Array<string> | string
}> = [
  {
    Icon: ResortSvg,
    title: 'Лечебнооздоровительные местности и курорты',
    body: ['курорт Теберда', 'курорт Домбай', 'курорт Архыз'],
  },
  {
    Icon: NatureSvg,
    title: 'Природные ресурсы',
    body: 'Зарегистрировано около 200 пещер размером не менее 4 метров, 10 из них отнесены к памятникам природы, сотни водопадов, более 400 озер, большое количество ботанических и ландшафтных памятников природы;',
  },
  {
    Icon: MineralSvg,
    title: 'Минеральные источники республики',
    body: 'Известно более 400 минеральных источников, большинство из них обладают целебными свойствами, многие из них находятся в транспортной доступности;',
  },
  {
    Icon: ScienceSvg,
    title: 'Научно исследовательские ресурсы',
    body: 'Специальная астрофизическая обсерватория Российской академии наук САО РАН',
  },
  {
    Icon: CultureSvg,
    title: 'Культурноисторические ресурсы',
    body: [
      'Адиюхское городище',
      'Шоанинский храм',
      'Сентинский храм',
      'НижнеАрхызкое городище',
    ],
  },
  {
    Icon: SportSvg,
    title: 'Ресурсы спортивного и экстремального туризма',
    body: 'Горный, альпинизм, водный, пешеходный, путешествие на горных велосипедах, конный, горнолыжный, heliski, парапланеризм, бэккантри, скитур, рафтинг, джипинг, снегоходный спорт, скалолазание.',
  },
]

const AboutPage: FC = () => {
  const navigate = useNavigate()

  const [size, setSize] = useState(12)

  const userGalleryPhotosApi = useGetPublishedUserGalleryPhotosQuery({
    size,
  })
  const photos = userGalleryPhotosApi.data?.data.results ?? []
  const isMoreAvailable = !!userGalleryPhotosApi.data?.data.next

  const {user} = useSelector(miscStateSelector)

  const previewModal = useModal<ImagePreviewModalProps>()
  const authorizationModal = useModal<AuthorizationModalProps>()
  const regionSelectModal = useModal<RegionSelectModalProps>()

  const inputRef = useRef<HTMLInputElement>(null)

  const handleUploadPhoto = async (event: ChangeEvent<HTMLInputElement>) => {
    const {target} = event
    const files = target.files?.length ? Array.from(target.files) : []

    const base64strings = await Promise.all(
      files.map(async f => await fileToBase64(f)),
    )

    if (!files.length || !base64strings.length) {
      return
    }

    const [fileBase64] = base64strings

    regionSelectModal.open({fileBase64})
  }

  const uploadPhoto = () => {
    inputRef.current?.click()
  }

  const handleAddPhotoClick = () => {
    if (!user) {
      authorizationModal.open({
        onAuthorized: uploadPhoto,
      })
    } else {
      uploadPhoto()
    }
  }

  return (
    <>
      <Box
        sx={t => ({
          position: 'relative',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: px(-HEADER_HEIGHT.sticky - HEADER_HEIGHT.static),
          padding: '184px 20px 0',
          height: '823px',
          [t.breakpoints.down('lg')]: {
            padding: '0 25px 92px',
            marginTop: '-80px',
            height: '636px',
            justifyContent: 'flex-end',
          },
        })}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            filter: 'brightness(60%)',
            objectFit: 'cover',
            zIndex: -1,
          }}
          component='img'
          src='/about_bg.jpeg'
        />

        <Box
          sx={[
            rootStyle,
            t => ({
              display: 'flex',
              flexDirection: 'column',
              gap: '27px',
              [t.breakpoints.down('lg')]: {
                gap: '20px',
              },
            }),
          ]}
        >
          <Typography
            sx={t => ({
              fontSize: '96px',
              fontWeight: 500,
              fontFamily: APP_FONTS.oswald,
              lineHeight: '118px',
              textTransform: 'uppercase',
              color: 'white',
              [t.breakpoints.down('lg')]: {
                fontSize: '32px',
                lineHeight: '38px',
              },
            })}
          >
            Карачаево-Черкесская Республика
          </Typography>

          <Typography
            sx={[
              hideOn('down', 'lg'),
              {
                color: 'white',
                fontSize: '20px',
                lineHeight: '30px',
                maxWidth: '793px',
              },
            ]}
          >
            Карачаево-Черкесская Республика по праву считается одним из
            старейших регионов России по развитию туризма, это своеобразная
            «Мекка» для туристов. Официальная статистика говорит о том, что
            развитие туризма на территории Карачаево-Черкесской Республики
            начинается с 1923 года. В туристском отношении этот красивейший
            горный край представляет исключительный интерес.
          </Typography>

          <Button
            variant='outlined'
            color='secondary'
            sx={{
              marginTop: '25px',
            }}
            onClick={() => navigate('/routes')}
          >
            Начать путешествие
          </Button>
        </Box>
      </Box>

      <Box
        sx={[
          rootStyle,
          t => ({
            display: 'flex',
            flexDirection: 'column',
            marginTop: '64px',
            gap: '44px',
            [t.breakpoints.down('lg')]: {
              marginTop: '40px',
            },
          }),
        ]}
      >
        <Paper
          sx={t => ({
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0px 4px 46.4px 0px #B4B4B440',
            padding: '58px 83px',
            borderRadius: '20px',
            [t.breakpoints.down('lg')]: {
              padding: '0 30px 30px',
              boxShadow: 'none',
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
                lineHeight: '21px',
              },
            })}
          >
            {TEXT}
          </Typography>
        </Paper>
      </Box>

      <Box
        sx={[
          rootStyle,
          t => ({
            display: 'flex',
            flexDirection: 'column',
            marginTop: '100px',
            gap: '44px',
            [t.breakpoints.down('lg')]: {
              marginTop: '30px',
              padding: '0 30px 30px',
              gap: '0',
            },
          }),
        ]}
      >
        <Typography
          sx={t => ({
            textTransform: 'uppercase',
            fontSize: '60px',
            lineHeight: '90px',
            fontFamily: APP_FONTS.oswald,
            fontWeight: 600,
            marginBottom: '60px',
            [t.breakpoints.down('lg')]: {
              fontSize: '24px',
              lineHeight: '28px',
              marginBottom: '30px',
            },
          })}
        >
          Туристические направления региона
        </Typography>

        <Box
          sx={{display: 'flex', flexWrap: 'wrap', gap: '41px', width: '100%'}}
        >
          {TILES_DATA.map(tile => (
            <Paper
              key={tile.title}
              sx={t => ({
                width: '100%',
                maxWidth: 'calc((100% - 41px * 2) / 3)',
                height: '389px',
                boxShadow: '0px 4px 46.4px 0px #B4B4B440',
                borderRadius: '20px',
                padding: '24px 40px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                [t.breakpoints.down('lg')]: {
                  maxWidth: '100%',
                  padding: '24px 20px',
                  height: 'auto',
                },
              })}
            >
              <tile.Icon />
              <Typography
                sx={t => ({
                  fontSize: '20px',
                  lineHeight: '30px',
                  fontWeight: 500,
                  [t.breakpoints.down('lg')]: {
                    fontSize: '14px',
                    lineHeight: '21px',
                  },
                })}
              >
                {tile.title}
              </Typography>

              {Array.isArray(tile.body) ? (
                tile.body.map(item => (
                  <Typography
                    sx={t => ({
                      [t.breakpoints.down('lg')]: {
                        fontSize: '14px',
                        lineHeight: '21px',
                      },
                    })}
                    key={item}
                  >
                    - {item}
                  </Typography>
                ))
              ) : (
                <Typography
                  sx={t => ({
                    [t.breakpoints.down('lg')]: {
                      fontSize: '14px',
                      lineHeight: '21px',
                    },
                  })}
                >
                  {tile.body}
                </Typography>
              )}
            </Paper>
          ))}
        </Box>
      </Box>

      {photos.length ? (
        <Box
          sx={[
            rootStyle,
            t => ({
              display: 'flex',
              flexDirection: 'column',
              marginTop: '100px',
              gap: '44px',
              [t.breakpoints.down('lg')]: {
                marginTop: '30px',
                gap: '30px',
                padding: '0 0 30px',
              },
            }),
          ]}
        >
          <Box
            sx={t => ({
              display: 'flex',
              alignItems: 'center',
              gap: '36px',
              [t.breakpoints.down('lg')]: {
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '0 30px',
              },
            })}
          >
            <Typography
              sx={t => ({
                textTransform: 'uppercase',
                fontSize: '60px',
                lineHeight: '90px',
                fontFamily: APP_FONTS.oswald,
                fontWeight: 600,
                [t.breakpoints.down('lg')]: {
                  fontSize: '24px',
                  lineHeight: '28px',
                },
              })}
            >
              Фотогалерея
            </Typography>

            <Box
              sx={[
                hideOn('down', 'lg'),
                {
                  flex: 1,
                  height: '1px',
                  backgroundColor: t => t.palette.text.primary,
                },
              ]}
            />

            <Button
              sx={t => ({
                color: t.palette.text.primary + ' !important',
                borderColor: alpha(t.palette.text.primary, 0.5),
                [t.breakpoints.down('lg')]: {
                  width: '100%',
                  backgroundColor: '#296587 !important',
                  color: 'white !important',
                  fontWeight: 500,
                },
              })}
              variant='outlined'
              onClick={handleAddPhotoClick}
            >
              Загрузить фото
            </Button>

            <input
              ref={inputRef}
              type='file'
              accept='image/*'
              onChange={handleUploadPhoto}
              hidden
            />
          </Box>

          <Box
            sx={t => ({
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: '14px',
              [t.breakpoints.down('lg')]: {
                padding: '0 30px',
              },
            })}
          >
            {photos.map(photo => (
              <ButtonBase
                key={photo.id}
                sx={t => ({
                  width: '100%',
                  maxWidth: 'calc((100% - 14px * 3) / 4)',
                  aspectRatio: 427 / 322,
                  [t.breakpoints.down('lg')]: {
                    maxWidth: 'calc((100% - 14px) / 2)',
                  },
                })}
                onClick={() => {
                  if (photo.file) previewModal.open({src: photo.file})
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '20px',
                    objectFit: 'cover',
                  }}
                  component='img'
                  src={photo.file ?? ''}
                />
              </ButtonBase>
            ))}
          </Box>

          {isMoreAvailable ? (
            <Button
              variant='text'
              endIcon={<Add />}
              sx={t => ({
                fontSize: '24px',
                color: colorScheme(t).text.linkActive,
              })}
              onClick={() => setSize(p => p + 12)}
            >
              Показать еще
            </Button>
          ) : null}
        </Box>
      ) : null}

      <ModalController control={previewModal.control}>
        <ImagePreviewModal {...previewModal.props} />
      </ModalController>

      <ModalController control={authorizationModal.control}>
        <AuthorizationModal {...authorizationModal.props} />
      </ModalController>

      <ModalController control={regionSelectModal.control}>
        <RegionSelectModal {...regionSelectModal.props} />
      </ModalController>
    </>
  )
}

export default AboutPage
