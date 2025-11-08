import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import cn from 'classnames';
import dayjs from 'dayjs';
import { Form, Formik } from 'formik';
import { toast } from 'react-toastify';
import DragListView from 'react-drag-listview';
import { IconButton, MenuItem, Skeleton } from '@mui/material';
import { Close, Menu } from '@mui/icons-material';
import {
  ArrowOutlinedIcon,
  ClockFilledIcon,
  CompassIcon,
  EyeIcon,
  FolderIcon,
  MarkerIcon,
  TickIcon,
} from '@app/assets/icons';
import { Route, RoutePhoto, RouteStop } from '@app/core/models';
import {
  useDeleteRouteMutation,
  useGetRouteQuery,
  useUpdateRouteMutation,
} from '@app/core/store/routes';
import {
  useCreateRoutePhotoMutation,
  useDeleteRoutePhotoMutation,
  useLazyGetRoutePhotosListQuery,
  useUpdateRoutePhotoMutation,
} from '@app/core/store/route_photos';
import { useGetRouteReviewsListQuery } from '@app/core/store/route_reviews';
import { RouteUpdateRequest } from '@app/core/types/requests';
import {
  ConfirmationModal,
  ImagePicker,
  ImageViewer,
  LocalButton,
  LocalInput,
  LocalSelect,
  LocalSelectV2,
  PhotoPresenter,
  RouteReviewsTable,
  SectionsList,
  SegmentedControl,
  TablePreloader,
} from '@app/ui/components';
import { ROUTE_SEASONS, ROUTE_STATUSES_ENUM } from '@app/core/models/Route';
import { useGetAttractionsListQuery } from '@app/core/store/attractions';
import {
  useCreateRouteStopMutation,
  useDeleteRouteStopMutation,
  useLazyGetRouteStopsListQuery,
  useUpdateRouteStopMutation,
} from '@app/core/store/route_stops';
import { handleError } from '@app/utils';
import { RoutePropertiesBar } from '@app/ui/components/RoutePropertiesBar';
import { ToTakeWithYou } from '@app/ui/components/ToTakeWithYou';

const TOP_BUTTONS: {
  title: string;
  value: 'card' | 'reviews';
}[] = [
  { title: 'Карточка маршрута', value: 'card' },
  { title: 'Отзывы по маршруту', value: 'reviews' },
];

const iconWithStatus: Record<ROUTE_STATUSES_ENUM, React.ReactNode> = {
  [ROUTE_STATUSES_ENUM.PUBLICATION]: <TickIcon />,
  [ROUTE_STATUSES_ENUM.CREATION]: <ClockFilledIcon color="#F4C851" />,
  [ROUTE_STATUSES_ENUM.VERIFICATION]: <ClockFilledIcon color="#F4C851" />,
  [ROUTE_STATUSES_ENUM.SUSPENSION]: <FolderIcon />,
};

const ROUTE_DIFFICULTIES = [
  { text: '1', value: 1 },
  { text: '2', value: 2 },
  { text: '3', value: 3 },
  { text: '4', value: 4 },
  { text: '5', value: 5 },
];

const RouteView: React.FC = () => {
  const [viewerOpenId, setViewerOpenId] = useState<
    RoutePhoto['id'] | undefined
  >(undefined);
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [activeSegment, setActiveSegment] =
    useState<(typeof TOP_BUTTONS)[0]['value']>('card');
  const { id: paramsId } = useParams();

  const navigate = useNavigate();

  const back = () => navigate('/routes');

  const handleSegmentClick = (v: typeof activeSegment) => {
    setActiveSegment(v);
  };

  const {
    data: routeData,
    isError,
    isLoading,
  } = useGetRouteQuery(
    {
      id: Number(paramsId),
      expand: ['photos', 'reviews__photos', 'tags__tag', 'kind'],
    },
    { skip: !paramsId },
  );

  const { data: attractionsData } = useGetAttractionsListQuery({
    size: 1000,
  });
  const [getRoutePhotosApi, { data: routePhotosApi }] =
    useLazyGetRoutePhotosListQuery();
  const [updateRouteApi] = useUpdateRouteMutation();
  const [deleteRouteApi] = useDeleteRouteMutation();
  const { data: routeReviewsData, isError: routeReviewsLoadError } =
    useGetRouteReviewsListQuery(
      {
        expand: ['photos', 'route__tags__tag'],
        filters: { route_id: Number(paramsId) },
      },
      { skip: !paramsId },
    );
  const [createRoutePhotoApi] = useCreateRoutePhotoMutation();
  const [updateRoutePhotoApi] = useUpdateRoutePhotoMutation();
  const [deleteRoutePhotoApi] = useDeleteRoutePhotoMutation();
  const [getRouteStopsApi, { data: routeStopsData }] =
    useLazyGetRouteStopsListQuery();
  const [createRouteStopsApi] = useCreateRouteStopMutation();
  const [updateRouteStopsApi] = useUpdateRouteStopMutation();
  const [deleteRouteStopsApi] = useDeleteRouteStopMutation();

  const route = routeData?.data ? (routeData?.data as Route) : undefined;

  const loadRoutePhotos = useCallback(async () => {
    await getRoutePhotosApi({
      size: 10000,
    });
  }, [getRoutePhotosApi]);

  useEffect(() => {
    loadRoutePhotos();
  }, [loadRoutePhotos]);

  const loadRouteStops = useCallback(async () => {
    await getRouteStopsApi({
      expand: ['attraction'],
      filters: { route_id: Number(paramsId) },
    });
  }, [getRouteStopsApi, paramsId]);

  useEffect(() => {
    loadRouteStops();
  }, [loadRouteStops]);

  if (!route) return <></>;

  const { id, name, description, status, publishedDttm, viewCount, likeCount } =
    route;

  const initialValues = {
    route: route,
    totalDurationHours: route?.totalDuration
      ? Math.floor(route?.totalDuration / 60)
      : null,
    totalDurationMinutes: route?.totalDuration
      ? Math.floor(route?.totalDuration % 60)
      : null,
  };

  const statusLabel: Record<ROUTE_STATUSES_ENUM, string> = {
    [ROUTE_STATUSES_ENUM.PUBLICATION]: `— Размещено ${dayjs(
      publishedDttm,
    ).format('D MMMM HH:mm')}`,
    [ROUTE_STATUSES_ENUM.CREATION]: '— На рассмотрении',
    [ROUTE_STATUSES_ENUM.VERIFICATION]: '— На рассмотрении',
    [ROUTE_STATUSES_ENUM.SUSPENSION]: '— В архиве',
  };

  const routePhotos = routePhotosApi?.data
    ? routePhotosApi?.data.results.filter(
        ({ routeId, file }) => routeId === id && typeof file === 'string',
      )
    : [];

  const routeReviews = routeReviewsData?.data.results ?? [];

  const mainPhoto = routePhotos.length
    ? routePhotos.find(p => p.order === 0) || routePhotos[0]
    : undefined;

  const attractions = attractionsData?.data.results ?? [];

  const routeStops = routeStopsData?.data
    ? routeStopsData?.data.results
        .slice()
        .sort((a, b) => (a.order > b.order ? 1 : -1))
    : [];

  const isPublished = status.id === ROUTE_STATUSES_ENUM.PUBLICATION;

  const deleteRoute = async () => {
    try {
      await deleteRouteApi({ id }).unwrap();
      back();
    } catch (error) {
      handleError(error);
    }
  };

  const updateRoute = async (
    value: Omit<RouteUpdateRequest, 'id' | 'name' | 'description'>,
  ) => {
    try {
      await updateRouteApi({
        id,
        name,
        description,
        ...value,
      }).unwrap();
    } catch (error) {
      handleError(error);
    }
  };

  const handleUploadPhoto = async ([file_base64]: string[]) => {
    try {
      await createRoutePhotoApi({
        route: id,
        file_base64,
      }).unwrap();
      toast.success('Фото загружено!');
      await loadRoutePhotos();
    } catch (error) {
      handleError(error);
    }
  };

  const handleMakeAnMainPhoto = async (photoId: RoutePhoto['id']) => {
    try {
      await updateRoutePhotoApi({
        id: photoId,
        route: id,
        order: 0,
      }).unwrap();

      await Promise.all(
        routePhotos
          .filter(p => p.id !== photoId)
          .map(
            async (p, i) =>
              await updateRoutePhotoApi({
                id: p.id,
                route: id,
                order: i + 1,
              }).unwrap(),
          ),
      );

      toast.success('Фото обновлено!');
    } catch (error) {
      handleError(error);
    }
  };

  const handleDeletePhoto = async (photoId: RoutePhoto['id']) => {
    try {
      await deleteRoutePhotoApi({
        id: photoId,
      }).unwrap();
      toast.success('Фото удалено!');
    } catch (error) {
      handleError(error);
    }
  };

  const handleCreateRouteStop = async (
    attractionId: RouteStop['attractionId'],
  ) => {
    if (routeStops.findIndex(s => s.attractionId === attractionId) !== -1) {
      toast.warn('Этот объект уже есть в списке');
      return;
    }

    try {
      await createRouteStopsApi({
        route: id,
        attraction: attractionId,
        order: routeStops.length ? routeStops.length + 1 : 0,
      }).unwrap();
      toast.success('Точка в маршрут добавлена!');
      loadRouteStops();
    } catch (error) {
      toast.warn('Не удалось добавить точку в маршрут');
      handleError(error);
    }
  };

  const handleUpdateRouteStop = async (
    stopId: RouteStop['id'],
    attractionId: RouteStop['attractionId'],
    order: number,
  ) => {
    try {
      await updateRouteStopsApi({
        id: stopId,
        route: id,
        order,
        attraction: attractionId,
      }).unwrap();
      toast.success('Точки маршрута обновлены!');
    } catch (error) {
      toast.warn('Не удалось обновить точки маршрута');
      handleError(error);
    }
  };

  const handleDeleteRouteStop = async (stopId: RouteStop['id']) => {
    try {
      await deleteRouteStopsApi({
        id: stopId,
      }).unwrap();
      toast.success('Точка удалена из маршрута!');
    } catch (error) {
      toast.warn('Не удалось удалить точку из маршрута');
      handleError(error);
    }
  };

  const handleSubmitRoute = async (values: typeof initialValues) => {
    const durationHours = Number(values.totalDurationHours) ?? 0;
    const durationMinutes = Number(values.totalDurationMinutes) ?? 1;

    let customProperties: RouteUpdateRequest['customProperties'] = null;

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

    try {
      await updateRouteApi({
        id: values.route.id,
        name: values.route.name,
        description: values.route.description,
        total_distance: values.route.totalDistance,
        total_duration: durationHours * 60 + durationMinutes,
        main_details: values.route.mainDetails,
        difficulty: values.route.difficulty.id,
        properties: values.route.properties ? { ...values.route.properties } : null,
        customProperties,
      }).unwrap();
      toast.success('Маршрут обновлен!');
    } catch (error) {
      handleError(error);
    }
  };

  if (isError) {
    toast.error('Ошибка загрузки маршрута');
  }

  if (routeReviewsLoadError && activeSegment === 'reviews') {
    toast.error('Ошибка загрузки отзывов');
  }

  return (
    <>
      <div>
        <div className="flex items-center justify-between h-[48px] mb-10">
          <div className="w-1/3 flex items-center h-full">
            <LocalButton asIcon variant="contained" onClick={back}>
              <ArrowOutlinedIcon direction="left" />
            </LocalButton>
            <span className="text-3xl ml-4">
              {TOP_BUTTONS.find(b => b.value === activeSegment)?.title}
            </span>
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
                Удалить маршрут
              </LocalButton>
            )}
          </div>
        </div>
        {activeSegment === 'card' ? (
          <>
            <div className="flex items-center justify-between w-full py-10 border-y border-dark_stroke">
              <div className="flex items-center">
                <span
                  className={cn(
                    'self-end flex items-center justify-center w-10 h-10 rounded-lg bg-menu_dark',
                    {
                      'bg-yellow_button': isPublished,
                      'bg-menu_dark': !isPublished,
                    },
                  )}
                >
                  {iconWithStatus[status.id]}
                </span>
                <span className="ml-2.5">{statusLabel[status.id]}</span>
              </div>
              <div className="flex items-center justify-end">
                <span className="flex">
                  <EyeIcon />
                  <span className="ml-1.5">{viewCount}</span>
                </span>
                <span className="flex ml-5">
                  <CompassIcon />
                  {/* TODO views on map icon */}
                  <span className="ml-1.5">0</span>
                </span>
                <span className="flex ml-5 mr-10">
                  <MarkerIcon />
                  <span className="ml-1.5">{likeCount}</span>
                </span>
                <LocalButton
                  className="w-44"
                  variant="contained"
                  onClick={() => {
                    updateRoute({
                      status: isPublished
                        ? ROUTE_STATUSES_ENUM.SUSPENSION
                        : ROUTE_STATUSES_ENUM.PUBLICATION,
                      published_dttm: isPublished
                        ? null
                        : dayjs().toISOString(),
                    });
                  }}
                >
                  {isPublished ? 'Снять с публикации' : 'Опубликовать'}
                </LocalButton>
              </div>
            </div>
            <div className="py-10 border-b border-dark_stroke">
              <span className="text-xl mb-3.5 block">Галерея фотографий</span>
              {routePhotos.length ? (
                <div className="flex">
                  <PhotoPresenter
                    id={mainPhoto?.id!}
                    file={mainPhoto?.file!}
                    onClick={setViewerOpenId}
                    onClickDelete={handleDeletePhoto}
                    isMain
                  />
                  <div className="flex flex-wrap gap-5">
                    {routePhotos.length > 1 &&
                      routePhotos.slice(1).map(p => (
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
              onSubmit={handleSubmitRoute}
            >
              {({ isSubmitting, handleSubmit, setFieldValue, values }) => (
                <Form>
                  <div className="py-10 border-b border-dark_stroke">
                    <div className="flex justify-between pb-10 border-b border-dark_stroke">
                      <div className="w-[32%]">
                        <LocalInput
                          name="route.name"
                          label="Название маршрута *"
                        />
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
                              {
                                ROUTE_SEASONS[
                                  season as keyof typeof ROUTE_SEASONS
                                ]
                              }
                            </MenuItem>
                          ))}
                        </LocalSelectV2>
                      </div>
                    </div>

                    <div className="flex-col  space-y-6 pt-10 pb-10 border-b border-dark_stroke">
                      <span className="text-xl mb-2.5">Взять с собой</span>

                      <ToTakeWithYou
                        initialValue={
                          values.route.customProperties?.toTakeWithYou ||
                          undefined
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
                          values.route.customProperties?.listDescription ||
                          undefined
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
                      <LocalInput
                        label="Важно знать"
                        name="route.mainDetails"
                        rows={5}
                        multiline
                        maxLenght={128}
                      />
                    </div>
                    <div className="flex space-x-8 pt-10">
                      <LocalInput
                        label="Общая дистанция, км"
                        name="route.totalDistance"
                      />
                      <LocalInput
                        label="Общее время, часы"
                        name="totalDurationHours"
                      />
                      <LocalInput
                        label="Общее время, минуты"
                        name="totalDurationMinutes"
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
                          items={attractions.map(a => ({
                            text: a.name,
                            value: a.id,
                          }))}
                          onSelect={async v => handleCreateRouteStop(Number(v))}
                        />
                        {!!routeStops.length && (
                          <div className="mt-4">
                            <DragListView
                              onDragEnd={async (from, to) => {
                                const stop = routeStops.at(from)!;
                                await handleUpdateRouteStop(
                                  stop.id,
                                  stop.attractionId,
                                  to,
                                );
                              }}
                              nodeSelector="#draggableItem"
                            >
                              {routeStops.map((s, i) => (
                                <div
                                  key={`${s.attractionId}_${i.toString()}`}
                                  id="draggableItem"
                                  className="flex items-center justify-between py-2"
                                >
                                  <div className="flex items-center justify-start">
                                    <IconButton>
                                      <Menu sx={{ color: 'black' }} />
                                    </IconButton>
                                    <span className="font-muller_regular text-xl ml-5">
                                      {s.attraction.name}
                                    </span>
                                  </div>
                                  <IconButton
                                    onClick={async e => {
                                      e.stopPropagation();
                                      await handleDeleteRouteStop(s.id);
                                    }}
                                  >
                                    <Close />
                                  </IconButton>
                                </div>
                              ))}
                            </DragListView>
                          </div>
                        )}
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
          </>
        ) : (
          <>
            {isLoading && !routeReviews.length ? (
              <TablePreloader rowsNumber={8} rowHeight={50} />
            ) : (
              <RouteReviewsTable reviews={routeReviews} />
            )}
          </>
        )}
      </div>

      {!!routePhotos.length && viewerOpenId && (
        <ImageViewer
          src={routePhotos
            .filter(({ file }) => typeof file === 'string')
            .map(({ file }) => file!)}
          onClose={() => setViewerOpenId(undefined)}
          currentIndex={routePhotos.findIndex(p => p.id === viewerOpenId)}
        />
      )}

      <ConfirmationModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={deleteRoute}
      />
    </>
  );
};

export default RouteView;
