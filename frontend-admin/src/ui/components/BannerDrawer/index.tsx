import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  Autocomplete,
  Checkbox,
  Drawer,
  DrawerProps,
  FormControlLabel,
  IconButton,
  TextField,
} from '@mui/material';
import { Form, Formik } from 'formik';
import { Close } from '@mui/icons-material';
import { Attraction, Banner, Route, RoutePhoto } from '@app/core/models';
import { LocalInput } from '../LocalInput';
import { LocalButton } from '../LocalButton';
import { useGetAttractionsListQuery } from '@app/core/store/attractions';
import {
  useCreateBannerMutation,
  useGetBannerQuery,
  useUpdateBannerMutation,
} from '@app/core/store/banner';
import {
  ImagePicker,
  ImageViewer,
  PhotoPresenter,
  SegmentedControl,
} from '@app/ui/components';
import { useGetRoutesListQuery } from '@app/core/store/routes';

interface Props extends DrawerProps {
  mode?: 'view' | 'edit';
  bannerId?: Banner['id'];
  onSubmit?: () => void;
}

const CHOOSE_ENTITY: {
  title: string;
  value: 'attraction' | 'route';
}[] = [
  { title: 'Объекты', value: 'attraction' },
  { title: 'Маршруты', value: 'route' },
];

export const BannerDrawer: React.FC<Props> = ({
  mode,
  bannerId,
  onClose,
  onSubmit,
  ...props
}) => {
  const [photo, setPhoto] = useState<RoutePhoto['fileBase64']>(null);
  const [viewerOpenIndex, setViewerOpenIndex] = useState<number | undefined>(
    undefined,
  );

  const [activeSegment, setActiveSegment] =
    useState<(typeof CHOOSE_ENTITY)[0]['value']>('attraction');

  const { data: attractionsDataApi } = useGetAttractionsListQuery({});
  const { data: routesDataApi } = useGetRoutesListQuery({});

  const attractions = attractionsDataApi?.data
    ? attractionsDataApi?.data.results
    : [];

  const routes = routesDataApi?.data ? routesDataApi?.data.results : [];

  const { data: bannerData } = useGetBannerQuery(
    {
      id: bannerId!,
      expand: ['attraction', 'route'],
    },
    { skip: !bannerId },
  );

  const [createBannerApi, { isError: createBannerError }] =
    useCreateBannerMutation();
  const [updateBannerApi, { isError: updateBannerError }] =
    useUpdateBannerMutation();

  const bannerForView = bannerData?.data
    ? (bannerData.data as Banner)
    : undefined;

  const isCreateMode = !mode && !bannerId && !bannerForView;

  useEffect(() => {
    // if the bannerForView has an existing attraction
    setActiveSegment(
      isCreateMode || bannerForView?.attraction.id !== 0
        ? 'attraction'
        : 'route',
    );
    setPhoto(bannerForView?.file ?? null);
  }, [bannerForView, isCreateMode]);

  const initialValues =
    !isCreateMode && bannerForView ? bannerForView : new Banner({});

  const handleSubmitBanner = async (values: Banner) => {
    try {
      if (isCreateMode) {
        await createBannerApi({
          title: values.title,
          subtitle: values.subtitle,
          fileBase64: photo,
          order: values.order,
          isActive: values.isActive,
          attraction: values.attraction ? values.attraction.id : null,
          route: values.route ? values.route.id : null,
        }).unwrap();
        if (!createBannerError) {
          handleModalClose();
          return toast.success('Баннер успешно создан!');
        }
      } else {
        await updateBannerApi({
          title: values.title,
          subtitle: values.subtitle,
          ...(photo !== bannerForView?.file && { fileBase64: photo }),
          order: values.order,
          isActive: values.isActive,
          attraction: values.attraction?.id ? values.attraction.id : null,
          route: values.route?.id ? values.route.id : null,
          id: values.id,
        }).unwrap();
        if (!updateBannerError) {
          handleModalClose();
          return toast.success('Баннер успешно обновлен!');
        }
      }
    } catch (error) {
      console.error(error);
      return toast.warn(
        `Произошла ошибка ${bannerForView ? 'обновления' : 'создания'} баннера`,
      );
    }

    return toast.warn(
      `Произошла ошибка ${bannerForView ? 'обновления' : 'создания'} баннера`,
    );
  };

  const handleSegmentClick = (v: typeof activeSegment) => {
    setActiveSegment(v);
  };

  const handlePinPhoto = async (base64strings: string[]) => {
    setPhoto(base64strings[0]);
    return toast.success('Фото прикреплено!');
  };

  const handleUnpinPhoto = (_: number) => {
    setPhoto(null);
    return toast.success('Фото откреплено!');
  };

  const handleModalClose = useCallback(
    (e?: React.MouseEvent<HTMLButtonElement>) => {
      onClose?.(e ?? {}, 'backdropClick');
      onSubmit?.();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  if (!isCreateMode && !bannerForView) return <></>;

  return (
    <Drawer {...props} onClose={onClose} anchor="right">
      {!!photo && typeof viewerOpenIndex === 'number' && (
        <ImageViewer
          src={[photo]}
          onClose={() => setViewerOpenIndex(undefined)}
          currentIndex={viewerOpenIndex}
        />
      )}

      <div className="flex items-center justify-between px-5 py-8 border-b border-dark_stroke">
        <span className="text-xl">
          {isCreateMode ? 'Новый баннер' : `Баннер ${bannerForView?.id}`}
        </span>
        <IconButton
          onClick={handleModalClose}
          className="active:text-yellow_button"
        >
          <Close fontSize="large" color="inherit" />
        </IconButton>
      </div>
      <Formik<Banner>
        initialValues={initialValues}
        onSubmit={handleSubmitBanner}
      >
        {({ handleSubmit, values, handleChange, setFieldValue }) => (
          <Form>
            <div className="flex flex-col items-stretch justify-between max-h-screen px-5 py-8">
              <div className="mb-7">
                <SegmentedControl<typeof activeSegment>
                  buttons={CHOOSE_ENTITY}
                  onSegmentClick={handleSegmentClick}
                  activeSegment={activeSegment}
                />
              </div>
              <div className="mb-7">
                <span className="text-xl mb-2 block">Баннер</span>
                {photo ? (
                  <div className="flex">
                    <PhotoPresenter
                      id={0}
                      file={photo ?? ''}
                      onClick={setViewerOpenIndex}
                      onClickDelete={handleUnpinPhoto}
                      isMain
                    />
                  </div>
                ) : (
                  <ImagePicker onPickPhoto={handlePinPhoto} isLarge />
                )}
              </div>
              <div className="mb-7">
                <LocalInput
                  name="title"
                  label="Заголовок баннера"
                  disabled={mode === 'view'}
                />
              </div>
              <div className="mb-7">
                <LocalInput
                  name="subtitle"
                  label="Описание баннера"
                  disabled={mode === 'view'}
                />
              </div>
              <div className="mb-7">
                <FormControlLabel
                  name="isActive"
                  control={
                    <Checkbox
                      checked={values.isActive}
                      onChange={handleChange}
                    />
                  }
                  label={<span className="font-muller_medium">Активен</span>}
                  disabled={mode === 'view'}
                />
              </div>
              <div className="mb-7">
                <span className="text-xl mb-2.5 block">
                  {activeSegment === 'attraction' ? 'Объект' : 'Маршрут'}
                </span>
                <Autocomplete<Attraction | Route>
                  size="small"
                  getOptionLabel={option => option.name!}
                  filterOptions={options => options}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  filterSelectedOptions
                  options={
                    activeSegment === 'attraction' ? attractions : routes
                  }
                  value={
                    activeSegment === 'attraction'
                      ? values.attraction
                      : values.route
                  }
                  renderInput={params => (
                    <TextField
                      {...params}
                      defaultValue={bannerForView?.entityName ?? ''}
                      disabled={mode === 'view'}
                      name={activeSegment}
                      size="medium"
                    />
                  )}
                  onChange={(_, v) => {
                    if (activeSegment === 'attraction') {
                      setFieldValue('route', null);
                      return setFieldValue('attraction', v);
                    }

                    setFieldValue('attraction', null);
                    return setFieldValue('route', v);
                  }}
                  disabled={mode === 'view'}
                />
              </div>

              <div className="mb-7">
                <LocalInput
                  name="order"
                  label="Порядковый номер"
                  disabled={mode === 'view'}
                />
              </div>

              {mode !== 'view' && (
                <div className="justify-self-end self-stretch mt-auto mb-0">
                  <LocalButton
                    type="submit"
                    onClick={() => handleSubmit}
                    className="w-full"
                    disabled={
                      !values.title ||
                      !values.subtitle ||
                      !(
                        (values.attraction.id &&
                          activeSegment === 'attraction') ||
                        (values.route.id && activeSegment === 'route')
                      )
                    }
                  >
                    Сохранить
                  </LocalButton>
                </div>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </Drawer>
  );
};
