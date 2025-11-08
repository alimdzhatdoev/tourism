import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Formik } from 'formik';
import { toast } from 'react-toastify';
import { Close, Menu } from '@mui/icons-material';
import DragListView from 'react-drag-listview';
import { ArrowOutlinedIcon } from '@app/assets/icons';
import { Route, RoutePhoto, RouteStop } from '@app/core/models';
import { useCreateRouteMutation } from '@app/core/store/routes';
import {
  ImagePicker,
  ImageViewer,
  LocalButton,
  LocalInput,
  LocalSelect,
  LocalSelectV2,
  PhotoPresenter,
  SectionsList,
} from '@app/ui/components';
import { useCreateRoutePhotoMutation } from '@app/core/store/route_photos';
import { IconButton, MenuItem } from '@mui/material';
import { useGetAttractionsListQuery } from '@app/core/store/attractions';
import { useCreateRouteStopMutation } from '@app/core/store/route_stops';
import { handleError } from '@app/utils';
import { RoutePropertiesBar } from '@app/ui/components/RoutePropertiesBar';
import { ROUTE_SEASONS } from '@app/core/models/Route';
import { ToTakeWithYou } from '@app/ui/components/ToTakeWithYou';
import { RouteCreateRequest } from '@app/core/types/requests';

interface FormikData {
  route: Route;
  stops: Route['stops'];
  totalDurationHours: null | number;
  totalDurationMinutes: null | number;
}

const ROUTE_DIFFICULTIES = [
  { text: '1', value: 1 },
  { text: '2', value: 2 },
  { text: '3', value: 3 },
  { text: '4', value: 4 },
  { text: '5', value: 5 },
];

const MAIN_DETAILS_MAX_SYMBOLS = 128;

const RouteNew: React.FC = () => {
  const [viewerOpenIndex, setViewerOpenIndex] = useState<number | undefined>(
    undefined,
  );
  const [photos, setPhotos] = useState<NonNullable<RoutePhoto['fileBase64']>[]>(
    [],
  );
  const navigate = useNavigate();
  const back = () => navigate(-1);

  const [createRouteApi] = useCreateRouteMutation();
  const [createRoutePhotoApi] = useCreateRoutePhotoMutation();
  const [createRouteStopsApi] = useCreateRouteStopMutation();
  const { data: attractionsData } = useGetAttractionsListQuery({
    size: 1000,
  });

  const attractionStops = attractionsData?.data
    ? attractionsData.data.results.map(
        a => new RouteStop({ attraction: a, attractionId: a.id }),
      )
    : [];

  const initialValues: FormikData = {
    route: new Route({}),
    stops: [],
    totalDurationHours: null,
    totalDurationMinutes: null,
  };

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

  const handleSubmitRoute = async (values: typeof initialValues) => {
    if (!values.route.name.length) {
      toast.warn('Проверьте необходимые поля');
      return;
    }

    const durationHours = Number(values.totalDurationHours) ?? 0;
    const durationMinutes = Number(values.totalDurationMinutes) ?? 1;

    let customProperties: RouteCreateRequest['customProperties'] = null;

    if (values.route.customProperties?.toTakeWithYou?.length) {
      customProperties = {
        toTakeWithYou: values.route.customProperties.toTakeWithYou,
        listDescription: null,
      };
    }

    if (values.route.customProperties?.listDescription?.length) {
      customProperties = {
        toTakeWithYou: customProperties?.toTakeWithYou ?? null,
        listDescription: values.route.customProperties.listDescription,
      };
    }

    const toastId = toast.loading('Создание маршрута');

    try {
      const { data } = await createRouteApi({
        name: values.route.name,
        description: values.route.description,
        main_details: values.route.mainDetails,
        total_duration: durationHours * 60 + durationMinutes,
        total_distance: values.route.totalDistance,
        difficulty: values.route.difficulty.id,
        properties: values.route.properties ? { ...values.route.properties } : null,
        customProperties,
      }).unwrap();

      if (photos.length) {
        await Promise.all(
          photos.map(
            async (p, i) =>
              await createRoutePhotoApi({
                route: data.id,
                file_base64: p,
                order: i,
              }),
          ),
        );
      }

      if (values.stops.length) {
        await Promise.all(
          values.stops.map(
            async (s, i) =>
              await createRouteStopsApi({
                route: data.id,
                attraction: s.attractionId,
                order: i,
              }),
          ),
        );
      }

      toast.done(toastId);
      toast.success('Маршрут создан!');

      setTimeout(() => {
        navigate(`/routes/${data.id}`);
      }, 500);
    } catch (error) {
      handleError(error, { toastId });
    }
  };

  const getMainDetailsHelper = (value?: string | null) => {
    if (!value) return `Не более ${MAIN_DETAILS_MAX_SYMBOLS} симоволов`;
    return `${value.length} из ${MAIN_DETAILS_MAX_SYMBOLS}`;
  };

  return (
    <>
      <div className="flex items-center justify-between h-[48px]">
        <div className="w-1/3 flex items-center h-full">
          <LocalButton asIcon variant="contained" onClick={back}>
            <ArrowOutlinedIcon direction="left" />
          </LocalButton>
          <span className="text-3xl ml-4">Новый маршрут</span>
        </div>
      </div>

      <div className="py-10 border-b border-dark_stroke">
        <span className="text-xl mb-2 block">Галерея фотографий</span>
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
      </div>

      <Formik<FormikData>
        initialValues={initialValues}
        onSubmit={handleSubmitRoute}
      >
        {({ isSubmitting, handleSubmit, setFieldValue, values }) => (
          <Form>
            <div className="py-10 border-b border-dark_stroke">
              <div className="flex justify-between pb-10 border-b border-dark_stroke">
                <div className="w-[32%]">
                  <LocalInput name="route.name" label="Название маршрута *" />
                </div>
              </div>

              <div className="flex-col  space-y-6 pt-10 pb-10 border-b border-dark_stroke">
                <span className="text-xl mb-2.5">Параметры</span>

                <RoutePropertiesBar
                  values={{ ...values.route.properties }}
                  setValue={(key, value) =>
                    setFieldValue(`route.properties.${key}`, value)
                  }
                />

                <div className="w-[32%] flex space-x-6">
                  <LocalSelectV2
                    label="Сезон"
                    value={values.route.properties?.season ?? ''}
                    onChange={e => {
                      setFieldValue(
                        'route.properties.season',
                        e.target.value || '',
                      );
                    }}
                  >
                    <MenuItem value="">Не указывать</MenuItem>
                    {Object.keys(ROUTE_SEASONS).map(season => (
                      <MenuItem key={season} value={season}>
                        {ROUTE_SEASONS[season as keyof typeof ROUTE_SEASONS]}
                      </MenuItem>
                    ))}
                  </LocalSelectV2>
                </div>
              </div>

              <div className="flex-col  space-y-6 pt-10 pb-10 border-b border-dark_stroke">
                <span className="text-xl mb-2.5">Взять с собой</span>

                <ToTakeWithYou
                  initialValue={
                    values.route.customProperties?.toTakeWithYou || undefined
                  }
                  onChange={v => {
                    const newValue = v.filter(item => {
                      const hasTitle = !!item.title;
                      const newItems = item.items.filter(it => !!it);
                      const hasItems = newItems.length !== 0;
                      return hasTitle && hasItems;
                    });

                    setFieldValue(
                      'route.customProperties.toTakeWithYou',
                      newValue,
                    );
                  }}
                />
              </div>

              <div className="flex-col  space-y-6 pt-10 pb-10 border-b border-dark_stroke">
                <span className="text-xl mb-2.5">Описание</span>

                <SectionsList
                  initialValue={
                    values.route.customProperties?.listDescription || undefined
                  }
                  onChange={v => {
                    const newValue = v.filter(item => {
                      const hasTitle = !!item.title;
                      const hasText = !!item.text;
                      return hasTitle && hasText;
                    });

                    setFieldValue(
                      'route.customProperties.listDescription',
                      newValue,
                    );
                  }}
                />
              </div>

              <div className="flex justify-between py-10 border-b border-dark_stroke">
                <div className="w-[49%]">
                  <LocalInput
                    label="Описание *"
                    name="route.description"
                    rows={5}
                    multiline
                  />
                </div>
                <div className="w-[49%]">
                  <LocalInput
                    label="Важно знать"
                    name="route.mainDetails"
                    rows={5}
                    multiline
                    helperText={getMainDetailsHelper(values.route.mainDetails)}
                    error={
                      (values.route.mainDetails?.length || 0) >
                      MAIN_DETAILS_MAX_SYMBOLS
                    }
                  />
                </div>
              </div>

              <div className="flex space-x-8 pt-10">
                <LocalInput
                  label="Общая дистанция, км"
                  name="route.totalDistance"
                  type="number"
                />
                <LocalInput
                  label="Общее время, часы"
                  name="totalDurationHours"
                  type="number"
                />
                <LocalInput
                  label="Общее время, минуты"
                  name="totalDurationMinutes"
                  type="number"
                />
              </div>

              <div className="flex space-x-8 pt-10">
                <div className="w-[32%] flex space-x-6">
                  <LocalSelectV2
                    label="Сложность маршрута"
                    name="difficulty"
                    value={values.route.difficulty.id}
                    onChange={e =>
                      setFieldValue('route.difficulty.id', e.target.value)
                    }
                  >
                    {ROUTE_DIFFICULTIES.map(diff => (
                      <MenuItem key={diff.value} value={diff.value}>
                        {diff.text}
                      </MenuItem>
                    ))}
                  </LocalSelectV2>
                </div>
              </div>

              <div className="flex justify-between pt-10">
                <div className="w-[32%] flex flex-col">
                  <LocalSelect
                    label="Точки маршрута"
                    name=" "
                    items={attractionStops.map(s => ({
                      text: s.attraction.name,
                      value: s.attractionId,
                    }))}
                    onSelect={id => {
                      if (values.stops.find(s => s.attractionId === id)) {
                        return toast.warn('Этот объект уже есть в списке');
                      }
                      const stop = attractionStops.find(
                        s => s.attraction.id === id,
                      )!;
                      return setFieldValue('stops', [...values.stops, stop]);
                    }}
                  />
                  {values.stops.length > 0 ? (
                    <div className="mt-4">
                      <DragListView
                        onDragEnd={(from, to) => {
                          const stopsCopy = [...values.stops];
                          stopsCopy.splice(from, 1, values.stops.at(to)!);
                          stopsCopy.splice(to, 1, values.stops.at(from)!);
                          return setFieldValue('stops', stopsCopy);
                        }}
                        nodeSelector="#draggableItem"
                      >
                        {values.stops.map((s, i) => (
                          <div
                            key={`${s.attractionId}_${i.toString()}`}
                            id="draggableItem"
                            className="flex items-center justify-between py-2"
                          >
                            <div className="flex items-center justify-start">
                              <IconButton>
                                <Menu />
                              </IconButton>
                              <span className="font-muller_regular text-xl ml-5">
                                {s.attraction.name}
                              </span>
                            </div>
                            <IconButton
                              onClick={e => {
                                e.stopPropagation();
                                const stopsCopy = [...values.stops];
                                stopsCopy.splice(i, 1);
                                return setFieldValue('stops', stopsCopy);
                              }}
                            >
                              <Close />
                            </IconButton>
                          </div>
                        ))}
                      </DragListView>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center pt-10">
              <LocalButton
                type="submit"
                onClick={() => handleSubmit}
                disabled={isSubmitting}
              >
                Сохранить
              </LocalButton>
            </div>
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

export default RouteNew;
