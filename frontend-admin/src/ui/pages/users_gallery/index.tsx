import React, { useState } from 'react';
import { dateTimeFormats } from '@app/constants';
import {
  ConfirmationModal,
  FullscreenPreloader,
  ImageViewer,
  LoadingProgress,
  LocalButton,
} from '@app/ui/components';
import { Box, ButtonBase, Paper, Typography } from '@mui/material';
import dayjs from 'dayjs';
import noPhoto from '@app/assets/no-photo-placeholder.png';
import {
  useCreateUserGalleryPhotoMutation,
  useDeleteUserGalleryPhotoMutation,
  useGetUserGalleryPhotosListQuery,
  usePublishUserGalleryPhotoMutation,
  useUnpublishUserGalleryPhotoMutation,
} from '@app/core/store/user_gallery_photos';
import { toast } from 'react-toastify';
import { fileToBase64 } from '@app/utils';
import { Region } from '@app/core/models';
import { RegionSelectModal } from './RegionSelectModel';

const UsersGalleryPage: React.FC = () => {
  const galleryApi = useGetUserGalleryPhotosListQuery({ size: 9999 });

  const photos = galleryApi.data?.data.results ?? [];

  const [createPhoto] = useCreateUserGalleryPhotoMutation();

  const [fileToUpload, setFileToUpload] = useState('');
  const isSelectRegionModalOpen = !!fileToUpload;

  const handleUploadPhoto = async ({
    target,
  }: React.ChangeEvent<HTMLInputElement>) => {
    const files = target.files?.length ? Array.from(target.files) : [];
    const base64strings = await Promise.all(
      files.map(async f => await fileToBase64(f)),
    );

    if (!files.length || !base64strings.length) {
      toast.warn('Произошла ошибка загрузки фото');
      return;
    }

    const [file_base64] = base64strings;
    setFileToUpload(file_base64);
  };

  const handleUploadPhotoClick = async (region: Region) => {
    if (!fileToUpload) return;

    try {
      await createPhoto({
        file_base64: fileToUpload,
        regionId: region.id,
      }).unwrap();

      toast.success('Фото добавлено');
    } catch (error) {
      toast.warn('Не удалось добавить фото');
    }
  };

  const [isProcessing, setIsProcessing] = useState(false);

  const [publishPhoto] = usePublishUserGalleryPhotoMutation();
  const [unpublishPhoto] = useUnpublishUserGalleryPhotoMutation();

  const createTogglePublishHandler =
    (id: number, isPublished: boolean) => async () => {
      try {
        setIsProcessing(true);

        if (isPublished) {
          unpublishPhoto({ id }).unwrap();
        } else {
          publishPhoto({ id }).unwrap();
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsProcessing(false);
      }
    };

  const [imagePreview, setImagePreview] = useState('');
  const [photoToDeleteId, setPhotoToDeleteId] = useState(0);

  const [deletePhoto] = useDeleteUserGalleryPhotoMutation();

  const handleDeletePhotoClick = async () => {
    if (!photoToDeleteId) return;

    setPhotoToDeleteId(0);

    try {
      setIsProcessing(true);

      await deletePhoto({ id: photoToDeleteId }).unwrap();
    } catch (error) {
      toast.warn('Не удалось удалить фото');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '25px',
        alignItems: 'stretch',
        flex: 1,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <label
          htmlFor="selectPhoto"
          className="px-4 rounded-lg h-12 transition cursor-pointer bg-yellow_button border flex items-center justify-center"
        >
          <span>Добавить фото</span>
          <input
            type="file"
            accept="image/*"
            id="selectPhoto"
            alt="Выбрать фотографию"
            onChange={handleUploadPhoto}
            hidden
          />
        </label>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '25px',
          flex: 1,
          alignItems: 'flex-start',
        }}
      >
        {photos.map(photo => (
          <Paper
            key={photo.id}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '15px',
              padding: '20px',
              borderRadius: '15px',
            }}
          >
            <ButtonBase
              onClick={() => {
                if (!photo.file) return;
                setImagePreview(photo.file);
              }}
            >
              <Box
                component="img"
                sx={[
                  {
                    maxWidth: '350px',
                    maxHeight: '350px',
                    minWidth: '350px',
                    minHeight: '350px',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '10px',
                  },
                ]}
                src={photo.file ?? noPhoto}
              />
            </ButtonBase>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <Typography>
                Пользователь:{' '}
                {photo.createdBy.fullName ? photo.createdBy.fullName : 'Аноним'}
              </Typography>
              <Typography>
                Дата загрузки:{' '}
                {dayjs(photo.createdDttm).format(dateTimeFormats.date)}
              </Typography>
              <Typography>
                Дата публикации:{' '}
                {photo.publishedAt
                  ? dayjs(photo.publishedAt).format(dateTimeFormats.date)
                  : 'Не опубликовано'}
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                '& button': {
                  minWidth: '140px',
                  marginTop: '10px',
                },
              }}
            >
              <LocalButton
                variant="danger"
                onClick={() => setPhotoToDeleteId(photo.id)}
              >
                Удалить
              </LocalButton>
              <LocalButton
                onClick={createTogglePublishHandler(
                  photo.id,
                  !!photo.publishedAt,
                )}
              >
                {photo.publishedAt ? 'Снять с публикации' : 'Опубликовать'}
              </LocalButton>
            </Box>
          </Paper>
        ))}

        {!photos.length && !galleryApi.isLoading && (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography className="text-2xl">Фотографии не найдены</Typography>
          </Box>
        )}
      </Box>

      <RegionSelectModal
        open={isSelectRegionModalOpen}
        onConfirm={handleUploadPhotoClick}
        onClose={() => setFileToUpload('')}
      />

      {isProcessing ? <FullscreenPreloader /> : null}

      {imagePreview ? (
        <ImageViewer
          src={[imagePreview]}
          onClose={() => setImagePreview('')}
          currentIndex={0}
        />
      ) : null}

      <ConfirmationModal
        open={photoToDeleteId !== 0}
        title="Удалить эту фотографию?"
        onConfirm={handleDeletePhotoClick}
        onClose={() => setPhotoToDeleteId(0)}
      />

      <LoadingProgress show={galleryApi.isFetching} />
    </Box>
  );
};

export default UsersGalleryPage;
