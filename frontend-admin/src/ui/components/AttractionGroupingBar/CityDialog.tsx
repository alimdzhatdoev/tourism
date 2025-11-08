import React, { FC, useMemo, useState } from 'react';
import { Group, City } from '@app/core/models';
import {
  Box,
  Button,
  Dialog,
  DialogProps,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { ConfirmationModal } from '../ConfirmationModal';
import {
  useCreateCityMutation,
  useDeleteCityMutation,
  useUpdateCityMutation,
} from '@app/core/store/cities';
import { useGetRegionsListQuery } from '@app/core/store/regions';
import { LocalSelectV2 } from '../LocalSelectV2/LocalSelectV2';
import { toast } from 'react-toastify';
import { handleError } from '@app/utils';
import { useDeleteLocationMutation } from '@app/core/store/locations';
import {
  useDeleteAttractionMutation,
  useGetAttractionsListQuery,
} from '@app/core/store/attractions';
import { useDeleteExcursionMutation } from '@app/core/store/excursions';
import { useSearchParams } from 'react-router-dom';
import { FullscreenPreloader } from '../Preloaders';

const validationSchema = yup.object().shape({
  city: yup.string().required('Введите название'),
});

interface FormikData {
  city: string;
  region: string | number;
}

interface CityDialogProps extends DialogProps {
  city?: City;
  onSave?: () => void;
}

export const CityDialog: FC<CityDialogProps> = ({
  city,
  onClose,
  onSave,
  ...dialogProps
}) => {
  const [, setSearchParams] = useSearchParams();

  const [confirm, setConfirm] = useState(false);

  const attractionsApi = useGetAttractionsListQuery(
    {
      filters: {
        location__city_id: city?.id,
      },
      expand: ['excursions'],
    },
    {
      skip: !city,
    },
  );

  const [updateCity] = useUpdateCityMutation();
  const [createCity] = useCreateCityMutation();

  const [deleteExcursion] = useDeleteExcursionMutation();
  const [deleteAttraction] = useDeleteAttractionMutation();
  const [deleteLocation] = useDeleteLocationMutation();
  const [deleteCity] = useDeleteCityMutation();

  const regionsApi = useGetRegionsListQuery({ size: 9999 });
  const regions = regionsApi.data?.data.results ?? [];

  const cityAttractions = useMemo(
    () => attractionsApi.data?.data.results ?? [],
    [attractionsApi.data],
  );

  const cityAttractionsExcursions = useMemo(
    () => attractionsApi.data?.data.results.flatMap(a => a.excursions) ?? [],
    [attractionsApi.data],
  );

  const submitApi = async (values: FormikData, id?: Group['id']) => {
    try {
      if (id) {
        await updateCity({ ...values, id }).unwrap();
      } else {
        await createCity(values).unwrap();
      }
      return true;
    } catch (error) {
      handleError(error);
      return false;
    }
  };

  const handleFormikSubmit = async (values: FormikData) => {
    const isSubmitted = await submitApi(values, city?.id);
    if (isSubmitted) {
      onSave?.();
      onClose?.({}, 'backdropClick');
    }
  };

  const { values, handleChange, handleSubmit, dirty, isValid } =
    useFormik<FormikData>({
      validationSchema,
      onSubmit: handleFormikSubmit,
      initialValues: {
        city: city?.city ?? '',
        region: city?.regionId ?? '',
      },
    });

  const handleCancelClick = () => {
    onClose?.({}, 'backdropClick');
  };

  const handleAcceptClick = () => {
    handleSubmit();
  };

  const handleDeleteClick = () => {
    setConfirm(true);
  };

  const handleConfirm = async () => {
    if (!city) return;

    const toastId = toast.loading('Удаление города');
    try {
      await Promise.all(
        cityAttractionsExcursions.map(excursion =>
          deleteExcursion({ id: excursion.id }).unwrap(),
        ),
      );

      await Promise.all(
        cityAttractions.map(attraction =>
          deleteAttraction({ id: attraction.id }).unwrap(),
        ),
      );

      await Promise.all(
        city.locations.map(location =>
          deleteLocation({ id: location.id }).unwrap(),
        ),
      );

      await deleteCity({ id: city.id }).unwrap();

      setSearchParams(prev => {
        prev.delete('location__city_id');
        return prev;
      });

      onClose?.({}, 'backdropClick');
    } catch (error) {
      handleError(error);
      setConfirm(false);
    } finally {
      toast.done(toastId);
    }
  };

  if (attractionsApi.isLoading) {
    return <FullscreenPreloader />;
  }

  return (
    <Dialog
      onClose={onClose}
      PaperProps={{
        sx: {
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          padding: '20px',
          alignItems: 'flex-start',
          gap: '16px',
        },
      }}
      {...dialogProps}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          margin: '0 0 16px 0',
          width: '100%',
        }}
      >
        <Typography sx={{ fontSize: '30px' }}>
          {city ? city.city : 'Новый населенный пункт'}
        </Typography>
        {City ? (
          <Button color="error" onClick={handleDeleteClick}>
            Удалить
          </Button>
        ) : null}
      </Box>
      <TextField
        label="Название *"
        name="city"
        value={values.city}
        onChange={handleChange}
        fullWidth
      />
      <LocalSelectV2
        label="Регион *"
        value={values.region}
        onChange={handleChange}
        inputProps={{ name: 'region' }}
        sx={{ width: '100%' }}
      >
        {regions.map(r => (
          <MenuItem key={r.id} value={r.id}>
            {r.region}
          </MenuItem>
        ))}
      </LocalSelectV2>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          margin: '16px 0 0 0',
          width: '100%',
        }}
      >
        <Button variant="contained" onClick={handleCancelClick}>
          {City ? 'Закрыть без изменений' : 'Отмена'}
        </Button>
        <Button
          onClick={handleAcceptClick}
          disabled={City ? !dirty || !isValid : !isValid}
        >
          {City ? 'Сохранить изменения' : 'Создать'}
        </Button>
      </Box>
      <ConfirmationModal
        open={confirm}
        title="Вы действительно хотите удалить этот город?"
        description={
          cityAttractions.length
            ? [
                `С ним будут удалены следующие объекты:\n`,
                ...cityAttractions.map((a, i) => `${i + 1}. ${a.name}`),
              ].join('\n')
            : ''
        }
        onConfirm={handleConfirm}
        onClose={() => setConfirm(false)}
      />
    </Dialog>
  );
};
