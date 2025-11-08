import React, { FC, useState } from 'react';
import { Group } from '@app/core/models';
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
import {
  useCreateGroupMutation,
  useDeleteGroupMutation,
  useUpdateGroupMutation,
} from '@app/core/store/groups';
import * as yup from 'yup';
import { ConfirmationModal } from '../ConfirmationModal';
import { useGetGroupKindsListQuery } from '@app/core/store/group_kinds';
import { LocalSelectV2 } from '../LocalSelectV2/LocalSelectV2';
import { hideNumberControls } from '@app/constants/sx';
import { ImagePickerV2 } from '../ImagePickerV2/ImagePickerV2';
import { omitEmpty } from '@app/utils/omitEmpty';
import { LocalCheckbox } from '../LocalCheckbox/LocalCheckbox';
import { toast } from 'react-toastify';
import { handleError } from '@app/utils';
import { useSearchParams } from 'react-router-dom';
import { useDeleteAttractionMutation } from '@app/core/store/attractions';
import { useDeleteExcursionMutation } from '@app/core/store/excursions';
import { useDeleteSubgroupMutation } from '@app/core/store/subgroups';

const validationSchema = yup.object().shape({
  name: yup.string().required('Введите название'),
  kind: yup.string().required('Укажите тип'),
});

interface FormikData {
  name: string;
  icon: string | null;
  position: string;
  kind: string;
  isUserCanContribute: boolean;
}

interface GroupDialogProps extends DialogProps {
  group?: Group;
  onSave?: () => void;
}

export const GroupDialog: FC<GroupDialogProps> = ({
  group,
  onClose,
  onSave,
  ...dialogProps
}) => {
  const [, setSearchParams] = useSearchParams();

  const [confirm, setConfirm] = useState(false);
  const [preview, setPreview] = useState(group?.icon || '');

  const [updateGroup] = useUpdateGroupMutation();
  const [createGroup] = useCreateGroupMutation();

  const [deleteSubgroup] = useDeleteSubgroupMutation();
  const [deleteExcursion] = useDeleteExcursionMutation();
  const [deleteAttraction] = useDeleteAttractionMutation();
  const [deleteGroup] = useDeleteGroupMutation();

  const groupKinsApi = useGetGroupKindsListQuery({});
  const groupKinds = groupKinsApi.data?.data.results ?? [];

  const submitApi = async (values: FormikData, id?: Group['id']) => {
    const toastId = toast.loading(id ? 'Обновление группы' : 'Создание группы');

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
    } finally {
      toast.done(toastId);
    }
  };

  const handleFormikSubmit = async (values: FormikData) => {
    const isSubmitted = await submitApi(values, group?.id);
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
        name: group?.name ?? '',
        icon: group?.icon || null,
        position: group?.position?.toString() ?? '',
        kind: group?.kindId.toString() ?? '',
        isUserCanContribute: group?.isUserCanContribute ?? false,
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
    if (!group) return;

    const toastId = toast.loading('Удаление группы');

    try {
      await Promise.all(
        group.attractions.flatMap(a =>
          a.excursions.map(e => deleteExcursion({ id: e.id }).unwrap()),
        ),
      );

      await Promise.all(
        group.attractions.map(attraction =>
          deleteAttraction({ id: attraction.id }).unwrap(),
        ),
      );

      await Promise.all(
        group.subgroups.map(subgroup =>
          deleteSubgroup({ id: subgroup.id }).unwrap(),
        ),
      );

      await deleteGroup({ id: group.id }).unwrap();

      setSearchParams(prev => {
        prev.delete('group_id');
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
          {group ? group.name : 'Новая группа'}
        </Typography>
        {group ? (
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
        label="Тип *"
        value={values.kind}
        onChange={handleChange}
        inputProps={{ name: 'kind' }}
        sx={{ width: '100%' }}
      >
        {groupKinds.map(gk => (
          <MenuItem key={gk.id} value={gk.id.toString()}>
            {gk.name}
          </MenuItem>
        ))}
      </LocalSelectV2>
      <TextField
        label="Позиция"
        name="position"
        type="number"
        sx={hideNumberControls}
        value={values.position}
        onChange={handleChange}
        fullWidth
      />

      <LocalCheckbox
        name="isUserCanContribute"
        slotProps={{
          checkbox: {
            checked: values.isUserCanContribute,
            onChange: handleChange,
          },
          labelSpan: { children: 'Доступна для пользователей' },
        }}
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
          {group ? 'Закрыть без изменений' : 'Отмена'}
        </Button>
        <Button
          onClick={handleAcceptClick}
          disabled={group ? !dirty || !isValid : !isValid}
        >
          {group ? 'Сохранить изменения' : 'Создать'}
        </Button>
      </Box>
      <ConfirmationModal
        open={confirm}
        title="Вы действительно хотите удалить эту группу?"
        description={
          group?.attractions.length
            ? [
                `С ней будут удалены следующие объекты:\n`,
                ...group.attractions.map((a, i) => `${i + 1}. ${a.name}`),
              ].join('\n')
            : ''
        }
        onConfirm={handleConfirm}
        onClose={() => setConfirm(false)}
      />
    </Dialog>
  );
};
