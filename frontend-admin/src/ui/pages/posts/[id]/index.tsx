import { ArrowOutlinedIcon } from '@app/assets/icons';
import { dateTimeFormats } from '@app/constants';
import PostSection from '@app/core/models/PostSection';
import { useGetPostSectionsListQuery } from '@app/core/store/post_sections';
import {
  useCreatePostMutation,
  useDeletePostMutation,
  useGetPostQuery,
  usePublishPostMutation,
  useUnpublishPostMutation,
  useUpdatePostMutation,
} from '@app/core/store/posts';
import { PostCreateRequest } from '@app/core/types/requests';
import {
  ConfirmationModal,
  FullscreenPreloader,
  ImagePicker,
  ImageViewer,
  LocalButton,
  PhotoPresenter,
} from '@app/ui/components';
import { Autocomplete, Box, TextField, Typography } from '@mui/material';
import { skipToken } from '@reduxjs/toolkit/query';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  sectionId: yup
    .number()
    .required('Выберите раздел')
    .test('not_zero', 'Выберите раздел', v => v !== 0),
  title: yup.string().required('Введите заголовок'),
  text: yup.string().required('Введите текст'),
});

type PostData = Omit<PostCreateRequest, 'coverData'>;

const PostIdPage: React.FC = () => {
  const { id: paramsId } = useParams();

  const navigate = useNavigate();

  const postApi = useGetPostQuery(
    paramsId !== 'new'
      ? {
          id: Number(paramsId),
        }
      : skipToken,
  );

  const post = postApi.data?.data;

  const postSectionsApi = useGetPostSectionsListQuery({ size: 9999 });

  const postSections = useMemo(
    () => postSectionsApi.data?.data.results ?? [],
    [postSectionsApi.data?.data.results],
  );

  const initialValues = useMemo<PostData>(() => {
    return {
      sectionId: post?.section.id ?? 0,
      text: post?.text ?? '',
      title: post?.title ?? '',
    };
  }, [post?.section.id, post?.text, post?.title]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmOpen, setIsConfirOpen] = useState(false);

  const [createPost] = useCreatePostMutation();
  const [updatePost] = useUpdatePostMutation();
  const [deletePost] = useDeletePostMutation();

  const [image, setImage] = useState('');
  const [isImageOpen, setIsImageOpen] = useState(false);
  const cover = image || post?.cover;

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    setFieldValue,
    values,
    isValid,
    dirty,
    errors,
    touched,
  } = useFormik<PostData>({
    initialValues,
    validationSchema,
    enableReinitialize: paramsId !== 'new',
    onSubmit: async data => {
      try {
        setIsProcessing(true);

        const payload: PostCreateRequest = {
          ...data,
        };

        if (cover) {
          payload.coverData = {
            fileBase64: cover,
          };
        }

        if (paramsId === 'new') {
          await createPost(payload).unwrap();
        } else {
          await updatePost({ ...payload, id: Number(paramsId) }).unwrap();
        }

        toast.success(
          `Новость ${paramsId !== 'new' ? 'обновлена' : 'создана'}`,
        );

        navigate('/posts');
      } catch (error) {
        toast.warn('Ошибка');
      } finally {
        setIsProcessing(false);
      }
    },
  });

  const isDirty = dirty || !!image;

  const handleDeletePost = async () => {
    try {
      setIsProcessing(true);

      await deletePost({ id: Number(paramsId) }).unwrap();

      toast.success('Новость удалена');

      navigate('/posts');
    } catch (error) {
      toast.warn('Не удалось удалить новость');
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedPostSection = useMemo(() => {
    if (postSections.length === 0 || values.sectionId === 0) return null;
    else return postSections.find(ps => ps.id === values.sectionId) ?? null;
  }, [postSections, values.sectionId]);

  const handlePostSectionChange = (_: any, value: PostSection | null) => {
    setFieldValue('sectionId', value ? value.id : null);
  };

  const handleDeleteClick = async () => {
    if (image) {
      setImage('');
    } else {
      try {
        setIsProcessing(true);

        await updatePost({
          ...values,
          coverData: null as any,
          id: Number(paramsId),
        }).unwrap();
      } catch (error) {
        toast.warn('Не удалось удалить фото');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const [publishPost] = usePublishPostMutation();
  const [unpublishPost] = useUnpublishPostMutation();

  const togglePublish = async () => {
    const isPublished = !!post?.publishedAt;
    try {
      setIsProcessing(true);

      if (isPublished) {
        await unpublishPost({ id: Number(paramsId) }).unwrap();
      } else {
        await publishPost({ id: Number(paramsId) }).unwrap();
      }
    } catch (error) {
      toast.warn(
        `Не удалось ${isPublished ? 'снять с публикации' : 'опубликовать'}`,
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (postApi.isLoading || postSectionsApi.isLoading) {
    return <FullscreenPreloader />;
  }

  return (
    <Box
      sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '25px' }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: '25px',
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <LocalButton
          asIcon
          variant="contained"
          onClick={() => navigate('/posts')}
        >
          <ArrowOutlinedIcon direction="left" />
        </LocalButton>

        <Box
          sx={{ marginRight: 'auto', display: 'flex', flexDirection: 'column' }}
        >
          <Typography sx={{ fontSize: '20px', lineHeight: '22px' }}>
            {post ? post.title : 'Новая новость'}
          </Typography>
          {post ? (
            <Typography sx={{ fontSize: '16px' }}>
              {post.publishedAt
                ? `Опубликована ${dayjs(post.publishedAt).format(
                    dateTimeFormats.date,
                  )}`
                : 'Не опубликована'}
            </Typography>
          ) : null}
        </Box>

        {post ? (
          <LocalButton className="ml-auto" onClick={togglePublish}>
            {post.publishedAt ? 'Снять с публикации' : 'Опубликовать'}
          </LocalButton>
        ) : null}

        <LocalButton variant="danger" onClick={() => setIsConfirOpen(true)}>
          Удалить новость
        </LocalButton>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '25px',
          margin: '30px 0',
        }}
      >
        {cover ? (
          <PhotoPresenter
            id={0}
            file={cover}
            onClick={() => setIsImageOpen(true)}
            onClickDelete={handleDeleteClick}
          />
        ) : (
          <ImagePicker onPickPhoto={v => setImage(v[0])} />
        )}

        <Box sx={{ display: 'flex', gap: '30px' }}>
          <TextField
            fullWidth
            name="title"
            value={values.title}
            label="Заголовок"
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.title && !!errors.title}
            helperText={touched.title && (errors.title || ' ')}
          />

          <Autocomplete
            disablePortal
            sx={{ width: '40%' }}
            noOptionsText="Продукты не найдены"
            options={postSections}
            value={selectedPostSection}
            onChange={handlePostSectionChange}
            getOptionLabel={option => option.name}
            getOptionKey={option => option.id}
            loadingText="Загрузка..."
            onBlur={handleBlur('sectionId')}
            renderInput={params => (
              <TextField
                label="Раздел"
                error={touched.sectionId && !!errors.sectionId}
                helperText={touched.sectionId && (errors.sectionId || ' ')}
                {...params}
              />
            )}
          />
        </Box>

        <TextField
          multiline
          fullWidth
          minRows={18}
          name="text"
          value={values.text}
          label="Текст"
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.text && !!errors.text}
          helperText={touched.text && (errors.text || ' ')}
        />
      </Box>

      <Box sx={{ display: 'flex' }}>
        <LocalButton
          type="submit"
          onClick={() => handleSubmit()}
          disabled={!isValid || !isDirty}
          className="w-[300px]"
        >
          Сохранить
        </LocalButton>
      </Box>

      <ConfirmationModal
        open={isConfirmOpen}
        title="Удалить эту новость?"
        onConfirm={handleDeletePost}
        onClose={() => setIsConfirOpen(false)}
      />

      {isImageOpen && cover ? (
        <ImageViewer
          src={[cover]}
          onClose={() => setIsImageOpen(false)}
          currentIndex={0}
        />
      ) : null}

      {isProcessing ? <FullscreenPreloader /> : null}
    </Box>
  );
};

export default PostIdPage;
