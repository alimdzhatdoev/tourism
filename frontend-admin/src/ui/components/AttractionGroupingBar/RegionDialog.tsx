import React, { FC, useMemo, useState } from 'react';
import { Group, Region } from '@app/core/models';
import {
  Box,
  Button,
  Dialog,
  DialogProps,
  TextField,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { ConfirmationModal } from '../ConfirmationModal';
import {
  useCreateRegionMutation,
  useDeleteRegionMutation,
  useUpdateRegionMutation,
} from '@app/core/store/regions';
import { toast } from 'react-toastify';
import { useDeleteLocationMutation } from '@app/core/store/locations';
import {
  useDeleteAttractionMutation,
  useGetAttractionsListQuery,
} from '@app/core/store/attractions';
import { useSearchParams } from 'react-router-dom';
import { FullscreenPreloader } from '../Preloaders';
import { handleError } from '@app/utils';
import { useDeleteExcursionMutation } from '@app/core/store/excursions';
import { useDeleteCityMutation } from '@app/core/store/cities';

const validationSchema = yup.object().shape({
  region: yup.string().required('Введите название'),
});

interface FormikData {
  region: string;
}

interface RegionDialogProps extends DialogProps {
  region?: Region;
  onSave?: () => void;
}

export const RegionDialog: FC<RegionDialogProps> = ({
  region,
  onClose,
  onSave,
  ...dialogProps
}) => {
  const [, setSearchParams] = useSearchParams();

  const [confirm, setConfirm] = useState(false);

  const attractionsApi = useGetAttractionsListQuery(
    {
      filters: {
        location__region_id: region?.id,
      },
      expand: ['excursions'],
    },
    {
      skip: !region,
    },
  );

  const regionAttractions = useMemo(
    () => attractionsApi.data?.data.results ?? [],
    [attractionsApi.data],
  );

  const regionAttractionsExcursions = useMemo(
    () => attractionsApi.data?.data.results.flatMap(a => a.excursions) ?? [],
    [attractionsApi.data],
  );

  const [updateRegion] = useUpdateRegionMutation();
  const [createRegion] = useCreateRegionMutation();

  const [deleteExcursion] = useDeleteExcursionMutation();
  const [deleteAttraction] = useDeleteAttractionMutation();
  const [deleteLocation] = useDeleteLocationMutation();
  const [deleteCity] = useDeleteCityMutation();
  const [deleteRegion] = useDeleteRegionMutation();

  const submitApi = async (values: FormikData, id?: Group['id']) => {
    try {
      if (id) {
        await updateRegion({ ...values, id }).unwrap();
      } else {
        await createRegion(values).unwrap();
      }
      return true;
    } catch (error) {
      handleError(error);
      return false;
    }
  };

  const handleFormikSubmit = async (values: FormikData) => {
    const isSubmitted = await submitApi(values, region?.id);
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
        region: region?.region ?? '',
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
    if (!region) return;

    const toastId = toast.loading('Удаление региона');
    try {
      await Promise.all(
        regionAttractionsExcursions.map(excursion =>
          deleteExcursion({ id: excursion.id }).unwrap(),
        ),
      );

      await Promise.all(
        regionAttractions.map(attraction =>
          deleteAttraction({ id: attraction.id }).unwrap(),
        ),
      );

      await Promise.all(
        region.locations.map(location =>
          deleteLocation({ id: location.id }).unwrap(),
        ),
      );

      await Promise.all(
        region.cities.map(city => deleteCity({ id: city.id }).unwrap()),
      );

      await deleteRegion({ id: region.id }).unwrap();

      setSearchParams(prev => {
        prev.delete('location__region_id');
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
          {region ? region.region : 'Новый регион'}
        </Typography>
        {region ? (
          <Button color="error" onClick={handleDeleteClick}>
            Удалить
          </Button>
        ) : null}
      </Box>
      <TextField
        label="Название *"
        name="region"
        value={values.region}
        onChange={handleChange}
        fullWidth
      />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          margin: '16px 0 0 0',
          width: '100%',
        }}
      >
        <Button variant="contained" onClick={handleCancelClick}>
          {region ? 'Закрыть без изменений' : 'Отмена'}
        </Button>
        <Button
          onClick={handleAcceptClick}
          disabled={region ? !dirty || !isValid : !isValid}
        >
          {region ? 'Сохранить изменения' : 'Создать'}
        </Button>
      </Box>
      <ConfirmationModal
        open={confirm}
        title="Вы действительно хотите удалить этот регион?"
        description={
          regionAttractions.length
            ? [
                `С ним будут удалены следующие объекты:\n`,
                ...regionAttractions.map((a, i) => `${i + 1}. ${a.name}`),
              ].join('\n')
            : ''
        }
        onConfirm={handleConfirm}
        onClose={() => setConfirm(false)}
      />
    </Dialog>
  );
};
