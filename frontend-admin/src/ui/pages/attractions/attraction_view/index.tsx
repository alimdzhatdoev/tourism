import React, { useCallback, useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import cn from 'classnames';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Box, Divider, Skeleton, Tooltip } from '@mui/material';
import { Form, Formik } from 'formik';
import {
  Attraction,
  AttractionPhoto,
  AttractionSchedule,
} from '@app/core/models';
import { useGetAttractionReviewsListQuery } from '@app/core/store/attraction_reviews';
import {
  useDeleteAttractionMutation,
  useGetAttractionQuery,
  useUpdateAttractionMutation,
} from '@app/core/store/attractions';
import {
  ConfirmationModal,
  LocalButton,
  LocalInput,
  AttractionReviewsTable,
  TablePreloader,
  SegmentedControl,
  ImageViewer,
  PhotoPresenter,
  ImagePicker,
  SchedulePicker,
} from '@app/ui/components';
import {
  ArrowOutlinedIcon,
  ClockFilledIcon,
  EmailIcon,
  EyeIcon,
  FolderIcon,
  HeartIcon,
  MarkerIcon,
  PhoneIcon,
  TickIcon,
} from '@app/assets/icons';
import {
  useCreateAttractionPhotoMutation,
  useDeleteAttractionPhotoMutation,
  useLazyGetAttractionPhotosListQuery,
  useUpdateAttractionPhotoMutation,
} from '@app/core/store/attractions_photos';
import { AttractionUpdateRequest } from '@app/core/types/requests';
import { ATTRACTION_STATUSES_ENUM } from '@app/core/models/Attraction';
import { useGetUserQuery } from '@app/core/store/users';
import {
  useCreateAttractionScheduleMutation,
  useLazyGetAttractionSchedulesListQuery,
  useUpdateAttractionScheduleMutation,
} from '@app/core/store/attractions_schedules';
import {
  GroupKindFieldset,
  LocationFieldset,
  LocationFieldsetRef,
} from '../FormParts';
import { omitEmpty } from '@app/utils/omitEmpty';
import { handleError } from '@app/utils';
import { useDeleteExcursionMutation } from '@app/core/store/excursions';
import { useAttractionContactsApi } from '@app/hooks';
// dat.detail

const TOP_BUTTONS: {
  title: string;
  value: 'card' | 'reviews';
}[] = [
  { title: 'Карточка объекта', value: 'card' },
  { title: 'Отзывы по объекту', value: 'reviews' },
];

const iconWithStatus: Record<ATTRACTION_STATUSES_ENUM, React.ReactNode> = {
  [ATTRACTION_STATUSES_ENUM.PUBLISHED]: <TickIcon />,
  [ATTRACTION_STATUSES_ENUM.CREATION]: <ClockFilledIcon color="#02C161" />,
  [ATTRACTION_STATUSES_ENUM.ARCHIVE]: <FolderIcon />,
};

const AttractionView: React.FC = () => {
  const [viewerOpenId, setViewerOpenId] = useState<
    AttractionPhoto['id'] | undefined
  >(undefined);
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [activeSegment, setActiveSegment] =
    useState<(typeof TOP_BUTTONS)[0]['value']>('card');
  const { id: paramsId } = useParams();
  const navigate = useNavigate();

  const locationFieldsetRef = useRef<LocationFieldsetRef>(null);

  const back = () => navigate('/attractions');

  const handleSegmentClick = (v: typeof activeSegment) => {
    setActiveSegment(v);
  };

  const { data, isError, isLoading } = useGetAttractionQuery(
    {
      id: Number(paramsId),
      expand: [
        'photos',
        'reviews__photos',
        'categories__category',
        'location__city',
        'location__region',
        'contacts__contact__kind',
        'discounts',
        'excursions',
        'groups',
        'subgroups',
      ],
    },
    { skip: !paramsId },
  );
  const [getAttractionsPhotosApi, { data: photosApi }] =
    useLazyGetAttractionPhotosListQuery();
  const [updateAttractionPhotoApi] = useUpdateAttractionPhotoMutation();
  const [deleteAttractionPhotoApi] = useDeleteAttractionPhotoMutation();
  const [createAttractionPhotoApi] = useCreateAttractionPhotoMutation();
  const [updateAttractionApi] = useUpdateAttractionMutation();
  const [getAttractionsSchedulesApi, { data: schedulesApi }] =
    useLazyGetAttractionSchedulesListQuery();
  const [createAttractionScheduleApi] = useCreateAttractionScheduleMutation();
  const [updateAttractionScheduleApi] = useUpdateAttractionScheduleMutation();

  const { data: reviewsData, isError: reviewsLoadError } =
    useGetAttractionReviewsListQuery(
      {
        expand: [
          'photos',
          'attraction',
          'attraction__categories__category',
          'attraction__location__region',
          'attraction__location__city',
        ],
        filters: {
          attraction: Number(paramsId),
        },
      },
      { skip: !paramsId || Number.isNaN(+paramsId) },
    );

  const attraction = data?.data as Attraction;

  const loadAttractionPhotos = useCallback(async () => {
    await getAttractionsPhotosApi({
      size: 10000,
    });
  }, [getAttractionsPhotosApi]);

  const loadAttractionSchedules = useCallback(async () => {
    await getAttractionsSchedulesApi({ size: 1000 });
  }, [getAttractionsSchedulesApi]);

  useEffect(() => {
    loadAttractionPhotos();
    loadAttractionSchedules();
  }, [loadAttractionPhotos, loadAttractionSchedules]);

  const initialValues = omitEmpty({
    ...attraction,
    website: attraction?.contacts.find(
      ({ contact }) => contact.kind.name === 'website',
    )?.contact.value,
    phone: attraction?.contacts.find(
      ({ contact }) => contact.kind.name === 'phone',
    )?.contact.value,
    email: attraction?.contacts.find(
      ({ contact }) => contact.kind.name === 'email',
    )?.contact.value,
    whatsapp: attraction?.contacts.find(
      ({ contact }) => contact.kind.name === 'whatsapp',
    )?.contact.value,
    social: attraction?.contacts.find(
      ({ contact }) => contact.kind.name === 'social',
    )?.contact.value,
    cuisineKind: attraction?.cuisineKind?.split(',').map(c => c.trim()),
    groups: attraction?.groups.map(g => g.id.toString()) || [],
    subgroups: attraction?.subgroups.map(sg => sg.id.toString()) || [],
  });

  const attractionContactsApi = useAttractionContactsApi();

  const handleSubmitAttraction = async (
    values: NonNullable<typeof initialValues>,
  ) => {
    const toastId = toast.loading('Обновление объекта');

    try {
      await updateAttractionApi({
        id: values.id,
        name: values.name,
        location: values.locationId,
        description: values.description,
        how_to_get: values.howToGet,
        main_details: values.mainDetails,
        cuisine_kind: values.cuisineKind?.join(', '),
        average_check: values.averageCheck,
        room_number: values.roomNumber,
        checkin_time: values.checkinTime,
        checkout_time: values.checkoutTime,
        min_price: values.minPrice,
        groups: values.groups,
        subgroups: values.subgroups,
        ticket_price_from: values.ticketPriceFrom,
      }).unwrap();

      await locationFieldsetRef.current?.submit();
      await attractionContactsApi.update(values, attraction);

      toast.success('Объект обновлен!');

      setTimeout(() => {
        // window.location.reload();
      }, 1000);
    } catch (error) {
      handleError(error);
    } finally {
      toast.done(toastId);
    }
  };

  const { data: creatorData } = useGetUserQuery(
    { id: data?.data.createdBy.id! },
    { skip: !data?.data },
  );

  /**
   * Delete Attraction
   */
  const [deleteAttractionApi] = useDeleteAttractionMutation();
  const [deleteExcursion] = useDeleteExcursionMutation();

  const deleteAttraction = async () => {
    if (!attraction) return;

    const toastId = toast.loading('Удаление объекта');

    try {
      const excursionsToDelete = attraction.excursions;

      await Promise.all(
        excursionsToDelete.map(excursion =>
          deleteExcursion({ id: excursion.id }).unwrap(),
        ),
      );

      await deleteAttractionApi({ id: attraction.id }).unwrap();

      back();
    } catch (error) {
      handleError(error);
    } finally {
      toast.done(toastId);
    }
  };

  const handleUpdateSchedule = useCallback(
    async (schedules: AttractionSchedule[]) => {
      if (!attraction?.id) {
        return;
      }

      try {
        const attractionUpdateSchedule = schedules
          .filter(s => s.isFilled)
          .map(s => ({
            id: s.id,
            attraction: attraction.id,
            week_day: s.weekDay.id,
            from_time: s.fromTime,
            till_time: s.tillTime,
          }));
        const attractionCreateSchedule = schedules
          .filter(s => !s.isFilled)
          .map(s => ({
            id: s.id,
            attraction: attraction.id,
            week_day: s.weekDay.id,
            from_time: s.fromTime,
            till_time: s.tillTime,
          }));

        if (attractionUpdateSchedule.length > 0) {
          await updateAttractionScheduleApi(attractionUpdateSchedule).unwrap();
        }

        if (attractionCreateSchedule.length > 0) {
          await createAttractionScheduleApi(attractionCreateSchedule).unwrap();
        }

        await loadAttractionSchedules();

        toast.success('График обновлен!');
      } catch (e) {
        toast.warn('Ошибка');
      }
    },
    [
      attraction?.id,
      createAttractionScheduleApi,
      loadAttractionSchedules,
      updateAttractionScheduleApi,
    ],
  );

  if (!attraction) return <></>;

  const {
    id,
    status,
    isPublished,
    likes,
    views,
    name,
    location,
    reviews,
    publishedDttm,
    isUserAdded,
    createdBy,
    containedRoutes,
  } = attraction;

  const statusLabel: Record<ATTRACTION_STATUSES_ENUM, string> = {
    [ATTRACTION_STATUSES_ENUM.PUBLISHED]: `— Размещено ${dayjs(
      publishedDttm,
    ).format('D MMMM HH:mm')}`,
    [ATTRACTION_STATUSES_ENUM.CREATION]: '— На рассмотрении',
    [ATTRACTION_STATUSES_ENUM.ARCHIVE]: '— В архиве',
  };

  const attractionPhotos = photosApi?.data
    ? photosApi.data.results.filter(
        ({ attractionId, file }) =>
          attractionId === id && typeof file === 'string',
      )
    : [];
  const attractionReviews = reviewsData?.data ? reviewsData.data.results : [];
  const mainPhoto = attractionPhotos.length
    ? attractionPhotos.find(p => p.order === 0) || attractionPhotos[0]
    : undefined;

  const attractionSchedules = schedulesApi?.data
    ? schedulesApi.data.results.filter(
        ({ attractionId }) => attractionId === id,
      )
    : [];

  const updateAttraction = async (
    value: Omit<
      AttractionUpdateRequest,
      'id' | 'name' | 'location' | 'locationId'
    >,
    customSuccessNotify: string = 'Объект обновлен!',
    needNotify: boolean = true,
  ) => {
    try {
      await updateAttractionApi({
        ...value,
        id,
        name,
        location: location.id,
      }).unwrap();
      if (needNotify) toast.success(customSuccessNotify);
      return true;
    } catch (error) {
      toast.error('Ошибка обновления');
      toast.warn(JSON.stringify(error));
      return false;
    }
  };

  const handleUploadPhoto = async ([file_base64]: string[]) => {
    try {
      const toastId = toast.loading('Загрузка фото');
      await createAttractionPhotoApi({
        attraction: id,
        file_base64,
      }).unwrap();
      await loadAttractionPhotos();
      toast.done(toastId);
      toast.success('Фото загружено!');
    } catch (error) {
      toast.warn('Произошла ошибка загрузки фото');
    }
  };

  const handleMakeAnMainPhoto = async (photoId: AttractionPhoto['id']) => {
    try {
      const toastId = toast.loading('Обновление фото');

      await updateAttractionPhotoApi({
        id: photoId,
        attraction: id,
        order: 0,
      }).unwrap();

      await Promise.all(
        attractionPhotos
          .filter(p => p.id !== photoId)
          .map(
            async (p, i) =>
              await updateAttractionPhotoApi({
                id: p.id,
                attraction: id,
                order: i + 1,
              }).unwrap(),
          ),
      );

      toast.done(toastId);
      toast.success('Фото обновлено!');
    } catch {
      toast.warn('Ошибка обновления фото');
    }
  };

  const handleDeletePhoto = async (photoId: AttractionPhoto['id']) => {
    try {
      const toastId = toast.loading('Удаление фото');
      await deleteAttractionPhotoApi({
        id: photoId,
      }).unwrap();
      toast.done(toastId);
      toast.success('Фото удалено!');
    } catch (error) {
      toast.warn('Ошибка удаления фото');
    }
  };

  if (isError) toast.error('Ошибка загрузки объекта');
  if (reviewsLoadError && activeSegment === 'reviews')
    toast.error('Ошибка загрузки отзывов');

  return (
    <>
      <div>
        <div className="flex items-center justify-between h-[48px] mb-10">
          <div className="w-1/3 flex items-center h-full">
            <LocalButton asIcon variant="contained" onClick={back}>
              <ArrowOutlinedIcon direction="left" />
            </LocalButton>
            <Tooltip title={attraction.name}>
              <span className="text-3xl ml-4 overflow-hidden text-ellipsis whitespace-nowrap max-w-[320px]">
                {attraction.name}
              </span>
            </Tooltip>
          </div>
          <div className="flex justify-center w-1/3">
            {isLoading ? (
              <Skeleton
                className="w-full"
                sx={{ bgcolor: '#4A4D55', height: '56px' }}
                animation="wave"
              />
            ) : (
              <SegmentedControl<typeof activeSegment>
                buttons={TOP_BUTTONS}
                onSegmentClick={handleSegmentClick}
                activeSegment={activeSegment}
              />
            )}
          </div>
          <div className="flex justify-end w-1/3">
            {isLoading ? (
              <Skeleton
                className="w-1/4"
                sx={{ bgcolor: '#4A4D55', height: '56px' }}
                animation="wave"
              />
            ) : (
              <LocalButton
                variant="danger"
                onClick={() => setConfirmOpen(true)}
              >
                Удалить объект
              </LocalButton>
            )}
          </div>
        </div>
        {activeSegment === 'card' ? (
          <>
            <div className="flex items-center justify-between w-full py-10 border-y border-dark_stroke">
              <div className="flex items-center w-1/3">
                <span
                  className={cn(
                    'self-end flex items-center justify-center w-10 h-10 rounded-lg bg-menu_dark',
                    {
                      'bg-green_button': isPublished,
                      'bg-menu_dark': !isPublished,
                    },
                  )}
                >
                  {iconWithStatus[status.id]}
                </span>
                <span className="ml-2.5">{statusLabel[status.id]}</span>
              </div>
              {attraction ? (
                <div className="w-1/3 flex items-center justify-end">
                  <span className="flex">
                    <EyeIcon />
                    <span className="ml-1.5">{views}</span>
                  </span>
                  <span className="flex ml-5">
                    <HeartIcon />
                    <span className="ml-1.5">{likes}</span>
                  </span>
                  <span className="flex ml-5 mr-10">
                    <MarkerIcon />
                    <span className="ml-1.5">{containedRoutes}</span>
                  </span>
                  <LocalButton
                    className="w-44"
                    variant="contained"
                    onClick={() =>
                      updateAttraction(
                        {
                          status: isPublished
                            ? ATTRACTION_STATUSES_ENUM.ARCHIVE
                            : ATTRACTION_STATUSES_ENUM.PUBLISHED,
                          published_dttm: isPublished
                            ? null
                            : dayjs().toISOString(),
                          groups: attraction.groups.map(g => g.id.toString()),
                        },
                        isPublished
                          ? 'Объект снят с публикации'
                          : 'Объект опубликован!',
                      )
                    }
                  >
                    {isPublished ? 'Снять с публикации' : 'Опубликовать'}
                  </LocalButton>
                </div>
              ) : null}
            </div>
            {isUserAdded && creatorData?.data && (
              <div className="flex items-center justify-start py-10 border-b border-dark_stroke">
                <span className="block mr-3 text-xl">Автор:</span>
                <div className="flex items-center">
                  {creatorData.data.file ? (
                    <img
                      className="w-6 h-6 rounded-full"
                      src={creatorData.data.file}
                      alt={createdBy.fullName}
                    />
                  ) : (
                    <span className="text-xm mr-3">{createdBy.initials}</span>
                  )}
                  <span className="text-sm ml-2.5">{createdBy.fullName}</span>
                  {creatorData.data.email && (
                    <span className="flex items-center ml-10">
                      <EmailIcon />
                      <a
                        className="text-sm ml-2.5"
                        href={`mailto:${creatorData.data.email}`}
                      >
                        {creatorData.data.email}
                      </a>
                    </span>
                  )}
                  <span className="flex items-center ml-10">
                    <PhoneIcon />
                    {creatorData.data.phone ? (
                      <a
                        className="text-sm ml-2.5"
                        href={`tel:${creatorData.data.phone}`}
                      >
                        {creatorData.data.phone}
                      </a>
                    ) : (
                      <span className="text-sm ml-2.5">
                        Нет номера телефона
                      </span>
                    )}
                  </span>
                </div>
              </div>
            )}
            <div className="py-10 border-b border-dark_stroke">
              <span className="text-xl mb-3.5 block">Галерея фотографий</span>
              {attractionPhotos.length ? (
                <div className="flex">
                  <PhotoPresenter
                    id={mainPhoto?.id!}
                    file={mainPhoto?.file!}
                    onClick={setViewerOpenId}
                    onClickDelete={handleDeletePhoto}
                    isMain
                  />
                  <div className="flex flex-wrap gap-5">
                    {attractionPhotos.length > 1 &&
                      attractionPhotos.slice(1).map(p => (
                        <PhotoPresenter
                          key={p.id}
                          id={p.id}
                          file={p.file!}
                          onClick={setViewerOpenId}
                          onClickDelete={handleDeletePhoto}
                          menuItems={[
                            {
                              label: 'Сделать главным',
                              action: handleMakeAnMainPhoto,
                            },
                          ]}
                        />
                      ))}

                    <ImagePicker onPickPhoto={handleUploadPhoto} />
                  </div>
                </div>
              ) : (
                <ImagePicker onPickPhoto={handleUploadPhoto} isLarge />
              )}
            </div>
            <Formik<typeof initialValues>
              initialValues={initialValues}
              onSubmit={handleSubmitAttraction}
            >
              {({ isSubmitting, handleSubmit, setFieldValue, values }) => (
                <Form>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '25px',
                      my: '40px',
                    }}
                  >
                    <LocalInput name="name" label="Название объекта" />

                    <SchedulePicker
                      onPickSchedule={handleUpdateSchedule}
                      schedulesData={attractionSchedules}
                    />
                  </Box>

                  <LocalInput
                    label="Описание"
                    name="description"
                    rows={5}
                    multiline
                  />

                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(5, 1fr)',
                      gap: '25px',
                      marginTop: '40px',
                    }}
                  >
                    <LocalInput name="phone" label="Номер телефона" />
                    <LocalInput name="website" label="Сайт" />
                    <LocalInput name="email" label="Электронная почта" />
                    <LocalInput name="whatsapp" label="Whatsapp" />
                    <LocalInput name="social" label="Социальная сеть" />
                  </Box>

                  <Divider sx={{ margin: '40px 0' }} />

                  <LocationFieldset
                    ref={locationFieldsetRef}
                    location={attraction?.location}
                  />

                  <Divider sx={{ margin: '40px 0' }} />

                  <GroupKindFieldset values={values} setValue={setFieldValue} />

                  <Divider sx={{ margin: '40px 0' }} />

                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <LocalButton
                      type="submit"
                      onClick={() => handleSubmit}
                      disabled={isSubmitting}
                      className="w-[300px]"
                    >
                      Сохранить
                    </LocalButton>
                  </Box>
                </Form>
              )}
            </Formik>
          </>
        ) : (
          <>
            {isLoading && !reviews.length ? (
              <TablePreloader rowsNumber={8} rowHeight={50} />
            ) : (
              <AttractionReviewsTable reviews={attractionReviews} />
            )}
          </>
        )}
      </div>

      {!!attractionPhotos.length && viewerOpenId && (
        <ImageViewer
          src={attractionPhotos.map(({ file }) => file!)}
          onClose={() => setViewerOpenId(undefined)}
          currentIndex={attractionPhotos.findIndex(p => p.id === viewerOpenId)}
        />
      )}

      <ConfirmationModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={deleteAttraction}
      />
    </>
  );
};

export default AttractionView;
