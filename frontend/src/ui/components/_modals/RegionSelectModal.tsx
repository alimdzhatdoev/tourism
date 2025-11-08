import {FC, useState} from 'react'
import {Region} from '@/core/models'
import {ModalContent, ModalContentProps} from '../Modal'
import {Autocomplete, Box, Button, TextField} from '@mui/material'
import {useGetRegionsListQuery} from '@/core/store/regions'
import {useCreateUserGalleryPhotoMutation} from '@/core/store/user_gallery_photos'
import {handleError} from '@/core/utils'
import {FullscreenPreloader} from '../FullscreenPreloader'
import {toast} from 'react-toastify'

export interface RegionSelectModalProps
  extends Omit<ModalContentProps, 'onSelect'> {
  fileBase64: string
}

export const RegionSelectModal: FC<RegionSelectModalProps> = ({
  onClose,
  fileBase64,
  ...props
}) => {
  const [selectedRegion, setSelectedRegion] = useState<null | Region>(null)
  const regionsApi = useGetRegionsListQuery({size: 9999})
  const regions = regionsApi.data?.data.results ?? []

  const [createPhoto] = useCreateUserGalleryPhotoMutation()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleConfirmClick = async () => {
    if (!selectedRegion) return

    try {
      setIsProcessing(true)
      await createPhoto({
        file_base64: fileBase64,
        regionId: selectedRegion.id,
      }).unwrap()

      toast.success(
        'Ваша фотография будет опубликована после проверки администратором.',
      )
    } catch (error) {
      handleError(error)
    } finally {
      setIsProcessing(false)
      onClose?.()
    }
  }

  return (
    <ModalContent
      title='Загрузка фотографии'
      maxWidth={600}
      onClose={onClose}
      sx={t => ({gap: '30px', [t.breakpoints.down('lg')]: {gap: '20px'}})}
      {...props}
    >
      <Box
        component='img'
        src={fileBase64}
        sx={{
          objectFit: 'cover',
          width: '100%',
          borderRadius: '20px',
          minWidth: '100%',
        }}
      />
      <Autocomplete
        fullWidth
        noOptionsText='Регионы не найдены'
        options={regions}
        value={selectedRegion}
        onChange={(_, v) => {
          setSelectedRegion(v)
        }}
        getOptionLabel={option => option.region}
        getOptionKey={option => option.id}
        loadingText='Загрузка...'
        renderInput={params => (
          <TextField placeholder='Выберите регион' {...params} />
        )}
      />

      <Button
        disabled={!selectedRegion}
        sx={t => ({
          alignSelf: 'center',
          marginTop: '20px',
          [t.breakpoints.down('lg')]: {width: '100%'},
        })}
        variant='outlined'
        onClick={handleConfirmClick}
      >
        Продолжить
      </Button>

      <FullscreenPreloader visible={isProcessing} />
    </ModalContent>
  )
}
