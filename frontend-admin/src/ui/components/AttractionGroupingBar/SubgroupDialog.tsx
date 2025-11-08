import React, { FC, useState } from 'react';
import { Group, Subgroup } from '@app/core/models';
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
import { LocalSelectV2 } from '../LocalSelectV2/LocalSelectV2';
import { hideNumberControls } from '@app/constants/sx';
import { ImagePickerV2 } from '../ImagePickerV2/ImagePickerV2';
import {
  useCreateSubgroupMutation,
  useDeleteSubgroupMutation,
  useUpdateSubgroupMutation,
} from '@app/core/store/subgroups';
import { useGetGroupsListQuery } from '@app/core/store/groups';
import { omitEmpty } from '@app/utils/omitEmpty';
import { toast } from 'react-toastify';
import { useDeleteExcursionMutation } from '@app/core/store/excursions';
import { useDeleteAttractionMutation } from '@app/core/store/attractions';
import { useSearchParams } from 'react-router-dom';
import { handleError } from '@app/utils';

const validationSchema = yup.object().shape({
  name: yup.string().required('Введите название'),
  group: yup.string().required('Укажите группу'),
  position: yup.string().required('Укажите позицию'),
});

interface FormikData {
  name: string;
  icon: string | null;
  position: string;
  group: string;
}

interface SubgroupDialogProps extends DialogProps {
  subgroup?: Subgroup;
  onSave?: () => void;
}

export const SubgroupDialog: FC<SubgroupDialogProps> = ({
  subgroup,
  onClose,
  onSave,
  ...dialogProps
}) => {
  const [, setSearchParams] = useSearchParams();

  const [confirm, setConfirm] = useState(false);
  const [preview, setPreview] = useState(subgroup?.icon || '');

  const [updateGroup] = useUpdateSubgroupMutation();
  const [createGroup] = useCreateSubgroupMutation();

  const [deleteExcursion] = useDeleteExcursionMutation();
  const [deleteAttraction] = useDeleteAttractionMutation();
  const [deleteGroup] = useDeleteSubgroupMutation();

  const groupsApi = useGetGroupsListQuery({});
  const groups = groupsApi.data?.data.results ?? [];

  const submitApi = async (values: FormikData, id?: Group['id']) => {
    const preparedData = omitEmpty(values, 'position');

    try {
      if (id) {
        await updateGroup({ ...preparedData, id }).unwrap();
      } else {
        await createGroup(preparedData).unwrap();
      }
      return true;
    } catch (error) {
      handleError(error);
      return false;
    }
  };

  const handleFormikSubmit = async (values: FormikData) => {
    const isSubmitted = await submitApi(values, subgroup?.id);
    if (isSubmitted) {
      onSave?.();
      onClose?.({}, 'backdropClick');
    }
  };

  const { values, setFieldValue, handleChange, handleSubmit, dirty, isValid } =
    useFormik<FormikData>({
      validationSchema,
      onSubmit: handleFormikSubmit,
      initialValues: {
        name: subgroup?.name ?? '',
        icon: subgroup?.icon || null,
        position: subgroup?.position?.toString() ?? '',
        group: subgroup?.groupId.toString() ?? '',
      },
    });

  const handleAddImage = async (files: File[]) => {
    if (!files.length) return;
    const [file] = files;
    setFieldValue('icon', file);
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

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
    if (!subgroup) return;

    const toastId = toast.loading('Удаление подгруппы');

    try {
      await Promise.all(
        subgroup.attractions.flatMap(a =>
          a.excursions.map(e => deleteExcursion({ id: e.id }).unwrap()),
        ),
      );

      await Promise.all(
        subgroup.attractions.map(attraction =>
          deleteAttraction({ id: attraction.id }).unwrap(),
        ),
      );

      await deleteGroup({ id: subgroup.id }).unwrap();

      setSearchParams(prev => {
        prev.delete('subgroup_id');
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
          {subgroup ? subgroup.name : 'Новая подгруппа'}
        </Typography>
        {subgroup ? (
          <Button color="error" onClick={handleDeleteClick}>
            Удалить
          </Button>
        ) : null}
      </Box>
      <ImagePickerV2
        onDrop={handleAddImage}
        imagePreview={preview}
        label="Иконка"
        sx={{ width: '100%' }}
      />
      <TextField
        label="Название *"
        name="name"
        value={values.name}
        onChange={handleChange}
        fullWidth
      />
      <LocalSelectV2
        label="Группа *"
        value={values.group}
        onChange={handleChange}
        inputProps={{ name: 'group' }}
        sx={{ width: '100%' }}
      >
        {groups.map(g => (
          <MenuItem key={g.id} value={g.id.toString()}>
            {g.name}
          </MenuItem>
        ))}
      </LocalSelectV2>
      <TextField
        label="Позиция *"
        name="position"
        type="number"
        sx={hideNumberControls}
        value={values.position}
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
          {subgroup ? 'Закрыть без изменений' : 'Отмена'}
        </Button>
        <Button
          onClick={handleAcceptClick}
          disabled={subgroup ? !dirty || !isValid : !isValid}
        >
          {subgroup ? 'Сохранить изменения' : 'Создать'}
        </Button>
      </Box>
      <ConfirmationModal
        title="Вы действительно хотите удалить эту подгруппу?"
        description={
          subgroup?.attractions.length
            ? [
                `С ней будут удалены следующие объекты:\n`,
                ...subgroup.attractions.map((a, i) => `${i + 1}. ${a.name}`),
              ].join('\n')
            : ''
        }
        open={confirm}
        onConfirm={handleConfirm}
        onClose={() => setConfirm(false)}
      />
    </Dialog>
  );
};
