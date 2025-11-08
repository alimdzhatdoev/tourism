import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Formik } from 'formik';
import { toast } from 'react-toastify';
import { ArrowOutlinedIcon } from '@app/assets/icons';
import {
  Attraction,
  AttractionPhoto,
  AttractionSchedule,
} from '@app/core/models';
import { useCreateAttractionMutation } from '@app/core/store/attractions';
import {
  ImagePicker,
  ImageViewer,
  LocalButton,
  LocalInput,
  PhotoPresenter,
  SchedulePicker,
} from '@app/ui/components';
import { useCreateAttractionPhotoMutation } from '@app/core/store/attractions_photos';
import { useCreateAttractionScheduleMutation } from '@app/core/store/attractions_schedules';
import { Box, Divider } from '@mui/material';
import { ATTRACTION_CUISINE_ENUM } from '@app/core/models/Attraction';
import {
  GroupKindFieldset,
  LocationFieldset,
  LocationFieldsetRef,
} from '../FormParts';
import { useAttractionContactsApi } from '@app/hooks';
import { handleError } from '@app/utils';

const AttractionNew: React.FC = () => {
  const [viewerOpenIndex, setViewerOpenIndex] = useState<number | undefined>(
    undefined,
  );
  const [photos, setPhotos] = useState<
    NonNullable<AttractionPhoto['fileBase64']>[]
  >([]);
  const [schedules, setSchedules] = useState<AttractionSchedule[]>([]);
  const navigate = useNavigate();
  const back = () => navigate(-1);

  const locationFieldsetRef = useRef<LocationFieldsetRef>(null);

  const [createAttractionApi] = useCreateAttractionMutation();
  const [createAttractionPhotoApi] = useCreateAttractionPhotoMutation();
  const [createAttractionScheduleApi] = useCreateAttractionScheduleMutation();

  const handlePinPhoto = async (base64strings: string[]) => {
    setPhotos(prev =>
      prev.length ? [...prev, ...base64strings] : base64strings,
    );
    return toast.success('Фото прикреплено!');
  };

  const handleUnpinPhoto = (index: number) => {
    setPhotos(prev => {
      const prevCopy = [...prev];
      prevCopy.splice(index, 1);
      return prevCopy;
    });
    return toast.success('Фото откреплено!');
  };

  const handlePickSchedule = (attractionSchedules: AttractionSchedule[]) => {
    setSchedules(attractionSchedules);
    return toast.success(
      `График работы ${schedules.length ? 'обновлен' : 'добавлен'}!`,
    );
  };

  const attractionContactsApi = useAttractionContactsApi();

  const initialValues = {
    ...new Attraction({}),
    phone: '',
    website: '',
    groups: [],
    subgroups: [],
    cuisineKind: [] as ATTRACTION_CUISINE_ENUM[],
  };

  const handleSubmitAttraction = async (values: typeof initialValues) => {
    if (!values.name.length) {
      toast.warn('Ошибка создания объекта. Проверьте поля');
      return;
    }

    let createdId = 0;
    const toastId = toast.loading('Создание объекта');
    const locationId = await locationFieldsetRef.current?.submit();

    try {
      const { data } = await createAttractionApi({
        name: values.name,
        location: locationId ?? 0,
        description: values.description,
        how_to_get: values.howToGet,
        main_details: values.mainDetails,
        cuisine_kind: values.cuisineKind.join(', '),
        average_check: values.averageCheck,
        room_number: values.roomNumber,
        checkin_time: values.checkinTime,
        checkout_time: values.checkoutTime,
        min_price: values.minPrice,
        subgroups: values.subgroups,
        groups: values.groups,
        ticket_price_from: values.ticketPriceFrom,
      }).unwrap();

      createdId = data.id;

      await attractionContactsApi.create(values, data as Attraction);

      if (photos.length) {
        await Promise.all(
          photos.map(
            async (p, i) =>
              await createAttractionPhotoApi({
                attraction: data.id,
                file_base64: p,
                order: i,
              }),
          ),
        );
      }

      if (schedules.length) {
        await createAttractionScheduleApi(
          schedules.map(s => ({
            attraction: data.id,
            week_day: s.weekDay.id,
            from_time: s.fromTime,
            till_time: s.tillTime,
          })),
        );
      }

      toast.success('Объект создан!');
    } catch (error) {
      handleError(error);
    } finally {
      toast.done(toastId);

      if (createdId) {
        setTimeout(() => {
          navigate(`/attractions/${createdId}`);
        }, 500);
      }
    }
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          margin: '0 0 30px',
        }}
      >
        <LocalButton asIcon variant="contained" onClick={back}>
          <ArrowOutlinedIcon direction="left" />
        </LocalButton>
        <span className="text-2xl block">Новый объект</span>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
        <span className="text-xl block">Галерея фотографий</span>
        {photos.length ? (
          <div className="flex">
            <PhotoPresenter
              id={0}
              file={photos[0]}
              onClick={setViewerOpenIndex}
              onClickDelete={handleUnpinPhoto}
              isMain
            />
            <div className="flex flex-wrap gap-5">
              {photos.length > 1 &&
                photos
                  .slice(1)
                  .map((base64, i) => (
                    <PhotoPresenter
                      key={`${base64.slice(0, 10)}_${i.toString()}`}
                      id={i + 1}
                      file={base64}
                      onClick={setViewerOpenIndex}
                      onClickDelete={handleUnpinPhoto}
                    />
                  ))}

              <ImagePicker onPickPhoto={handlePinPhoto} multiple />
            </div>
          </div>
        ) : (
          <ImagePicker onPickPhoto={handlePinPhoto} multiple isLarge />
        )}
      </Box>
      <Divider sx={{ margin: '40px 0' }} />
      <Formik<typeof initialValues>
        initialValues={initialValues}
        onSubmit={handleSubmitAttraction}
      >
        {({ isSubmitting, handleSubmit, values, setFieldValue }) => (
          <Form>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '25px',
                marginBottom: '40px',
              }}
            >
              <LocalInput name="name" label="Название объекта" />
              <SchedulePicker
                onPickSchedule={handlePickSchedule}
                schedulesData={schedules}
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

            <LocationFieldset ref={locationFieldsetRef} />

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

      {!!photos.length && typeof viewerOpenIndex === 'number' && (
        <ImageViewer
          src={photos}
          onClose={() => setViewerOpenIndex(undefined)}
          currentIndex={viewerOpenIndex}
        />
      )}
    </>
  );
};

export default AttractionNew;
