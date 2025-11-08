import React, { useCallback, useEffect, useMemo, useState } from 'react';
import cn from 'classnames';
import { toast } from 'react-toastify';
import { Form, Formik } from 'formik';
import {
  Checkbox,
  Drawer,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Radio,
  RadioGroup,
  TablePagination,
  TextField,
} from '@mui/material';
import { MagnifyingGlassIcon } from '@app/assets/icons';
import {
  useDeleteUserMutation,
  useGetMeQuery,
  useLazyGetUsersQuery,
  useUpdateUserMutation,
} from '@app/core/store/users';
import { useDebounce, useURLPagination } from '@app/hooks';
import { LocalButton, LocalInput, TablePreloader } from '@app/ui/components';
import { Close, Delete, Edit } from '@mui/icons-material';
import { User } from '@app/core/models';
import { GENDER_ENUM } from '@app/core/models/User';
import { useSelector } from 'react-redux';
import { userStateSelector } from '@app/core/store/user/selectors';

const TABLE_HEADER_CELLS = [
  {
    className:
      'col-span-3 flex items-center justify-center border-r border-dark_stroke',
    content: 'Имя',
  },
  {
    className:
      'col-span-3 flex items-center justify-center border-r border-dark_stroke',
    content: 'Фамилия',
  },
  {
    className:
      'col-span-3 flex items-center justify-center border-r border-dark_stroke',
    content: 'Почта',
  },
  {
    className: 'col-span-3',
    content: '',
  },
];

const Users: React.FC = () => {
  const [editUserId, setEditUserId] = useState<User['id'] | undefined>(
    undefined,
  );
  const [searchTerm, setSearchTerm] = useState<string>('');

  const search = useDebounce(searchTerm);

  const { user } = useSelector(userStateSelector);

  const [getUsersApi, { data, isLoading, isFetching, isError }] =
    useLazyGetUsersQuery({});

  const { data: getMeData } = useGetMeQuery(
    {},
    {
      skip: user.id !== 0, // user exist in store
    },
  );

  const [deleteUserApi] = useDeleteUserMutation();
  const [updateUserApi] = useUpdateUserMutation();

  const deleteUser = async (id: User['id']) => {
    if (id === user.id || id === getMeData?.data.id) {
      toast.warn('Нельзя удалить самого себя');
      return;
    }

    try {
      await deleteUserApi({ id });
      toast.success('Пользователь удален!');
    } catch (error) {
      console.error(error);
      // @ts-ignore
      toast.error(`Ошибка удаления: ${error.detail}`);
    }
  };

  const updateUser = async (values: User) => {
    try {
      await updateUserApi({
        id: values.id,
        email: values.email,
        gender: values.gender.id,
        phone: values.phone,
        first_name: values.firstName,
        last_name: values.lastName,
        middle_name: values.middleName,
        birth_date: values.birthDate,
        is_staff: values.isStaff,
      });
      setEditUserId(undefined);
      toast.success('Пользователь обновлен!');
    } catch (error) {
      console.error(error);
      setEditUserId(undefined);
      // @ts-ignore
      toast.error(`Ошибка удаления: ${error.detail}`);
    }
  };

  const {
    page,
    size,
    total,
    pageCount,
    setTotal,
    setPageCount,
    handlePaginationChange,
  } = useURLPagination({
    defaultPage: 1,
    defaultSize: 10,
  });

  const users = useMemo(
    () => (data?.data ? data.data.results : []),
    [data?.data],
  );

  const userToView = useMemo(() => {
    if (!data?.data || !users.length) return undefined;

    return users.find(u => u.id === editUserId);
  }, [data?.data, users, editUserId]);

  const isContentLoading = isFetching || isLoading;

  const loadUsers = useCallback(async () => {
    await getUsersApi({ search: search.length ? search : undefined });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  useEffect(() => {
    if (data?.data) {
      setTotal(data.data.count);
      setPageCount(data.data.pageCount);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.data]);

  useEffect(() => {
    loadUsers();

    return () => {
      setEditUserId(undefined);
    };
  }, [loadUsers]);

  if (isError) {
    toast.error('Ошибка загрузки пользователей');
  }

  return (
    <>
      <div className="flex items-center justify-between h-11">
        <span className="text-3xl">Пользователи</span>
      </div>
      <div className="flex items-stretch mt-12 mb-10">
        <div className="w-1/3">
          <TextField
            fullWidth
            placeholder="Поиск"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MagnifyingGlassIcon />
                </InputAdornment>
              ),
            }}
          />
        </div>
      </div>

      {isContentLoading && !users.length ? (
        <TablePreloader />
      ) : (
        <div>
          <div className="grid grid-cols-12 bg-menu_dark rounded-t-3xl h-12 text-center border-x border-menu_dark">
            {TABLE_HEADER_CELLS.map(({ className, content }, i) => (
              <span key={i.toString() + content} className={className}>
                {content}
              </span>
            ))}
          </div>
          {users.map((u, i) => (
            <div
              key={u.id}
              className={cn(
                'grid grid-cols-12 text-center border-t border-x border-dark_stroke min-h-[48px] h-full',
                {
                  'rounded-b-3xl border-b': i === users.length - 1,
                },
              )}
            >
              <span className="col-span-3 pt-1 border-r border-dark_stroke text-sm">
                {u.firstName.length ? u.firstName : '-'}
              </span>
              <span className="col-span-3 pt-1 border-r border-dark_stroke text-sm">
                {u.lastName.length ? u.lastName : '-'}
              </span>
              <span className="col-span-3 pt-1 border-r border-dark_stroke text-sm">
                {u.email}
              </span>
              <span className="col-span-3 flex items-center justify-center gap-2">
                <IconButton onClick={() => setEditUserId(u.id)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => deleteUser(u.id)}>
                  <Delete />
                </IconButton>
              </span>
            </div>
          ))}
        </div>
      )}

      <TablePagination
        component="div"
        rowsPerPage={size}
        labelRowsPerPage={
          <span className="font-muller_medium">Записей на странице:</span>
        }
        labelDisplayedRows={pagination => (
          <span className="font-muller_medium">{`${pagination.page} стр.`}</span>
        )}
        page={page}
        count={total !== 0 ? total * 10 : -1}
        onPageChange={(_, p) => {
          if (p > pageCount) return;
          handlePaginationChange('page', p);
        }}
        onRowsPerPageChange={e =>
          handlePaginationChange('size', Number(e.target.value))
        }
      />

      <Drawer
        open={!!userToView}
        onClose={() => setEditUserId(undefined)}
        anchor="right"
        PaperProps={{ sx: { paddingBottom: '30px' } }}
      >
        <div className="flex items-center justify-between px-5 py-8 border-b border-dark_stroke">
          <span className="text-xl">
            {userToView?.fullName ?? 'Карточка пользователя'}
          </span>
          <IconButton
            onClick={() => setEditUserId(undefined)}
            className="active:text-yellow_button"
          >
            <Close fontSize="large" color="inherit" />
          </IconButton>
        </div>
        <Formik<User> initialValues={userToView!} onSubmit={updateUser}>
          {({ handleSubmit, values, handleChange, setFieldValue }) => (
            <Form>
              <div className="flex flex-col items-stretch justify-between max-h-screen px-5 py-8">
                <div className="mb-7">
                  <LocalInput name="firstName" label="Имя" required />
                </div>
                <div className="mb-7">
                  <LocalInput name="middleName" label="Отчество" />
                </div>
                <div className="mb-7">
                  <LocalInput name="lastName" label="Фамилия" required />
                </div>
                <div className="mb-7">
                  <LocalInput
                    name="email"
                    label="Email"
                    type="email"
                    required
                  />
                </div>
                <div className="mb-7">
                  <LocalInput name="birthDate" label="Дата рождения" />
                </div>
                <div className="mb-7">
                  <LocalInput name="phone" label="Номер телефона" />
                </div>
                <div className="mb-7">
                  <FormControlLabel
                    name="isStaff"
                    control={
                      <Checkbox
                        checked={values.isStaff}
                        onChange={handleChange}
                      />
                    }
                    label={
                      <span className="font-muller_medium">Сотрудник</span>
                    }
                  />
                </div>
                <div className="mb-7">
                  <span className="text-xl">Пол</span>
                  <RadioGroup>
                    <FormControlLabel
                      name="gender"
                      control={
                        <Radio
                          checked={values.gender?.id === GENDER_ENUM.MALE}
                        />
                      }
                      onChange={() =>
                        setFieldValue('gender.id', GENDER_ENUM.MALE)
                      }
                      label="Мужской"
                    />
                    <FormControlLabel
                      name="gender"
                      control={
                        <Radio
                          checked={values.gender?.id === GENDER_ENUM.FEMALE}
                        />
                      }
                      onChange={() =>
                        setFieldValue('gender.id', GENDER_ENUM.FEMALE)
                      }
                      label="Женский"
                    />
                  </RadioGroup>
                </div>

                <div className="justify-self-end self-stretch mt-auto mb-0">
                  <LocalButton
                    type="submit"
                    onClick={() => handleSubmit}
                    className="w-full"
                  >
                    Сохранить
                  </LocalButton>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </Drawer>
    </>
  );
};

export default Users;
