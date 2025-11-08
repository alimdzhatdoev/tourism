import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Form, Formik } from 'formik';
import { toast } from 'react-toastify';
import { IconButton } from '@mui/material';
import { initAxiosInstance } from '@app/core/services/api';
import { useLazyGetMeQuery, useSignInMutation } from '@app/core/store/users';
import { UserSignInRequest } from '@app/core/types/requests';
import { useStorage } from '@app/hooks';
import { LocalButton, LocalInput } from '@app/ui/components';
import { UI_ROUTES_ENUM } from '@app/ui/components/Router';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { setUserState } from '@app/core/store/user/actions';
import { User } from '@app/core/models';

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { writeStorage, isAuthorized } = useStorage();
  const navigate = useNavigate();

  const [signInApi] = useSignInMutation();
  const [getMeApi] = useLazyGetMeQuery();

  const handleSignIn = async (values: UserSignInRequest) => {
    try {
      const {
        data: { access, refresh },
      } = await signInApi(values).unwrap();
      writeStorage(JSON.stringify({ access, refresh }));
      initAxiosInstance();
      const { data } = await getMeApi({}).unwrap();
      setUserState({ user: data as User, accessToken: access });
      setTimeout(() => navigate(UI_ROUTES_ENUM.ATTRACTIONS), 1500);
      return toast.success('Авторизация прошла успешно!', { autoClose: 1100 });
    } catch (error) {
      console.error(error);
    }

    return toast.error('Ошибка авторизации. Проверьте e-mail и пароль');
  };

  if (isAuthorized) return <Navigate to={UI_ROUTES_ENUM.ATTRACTIONS} />;

  return (
    <div className="w-screen h-screen flex bg-menu_dark">
      <div className="m-auto w-[450px] pb-[50px]">
        <p className='text-center text-white text-[20px] pb-[20px]'>
          Панель администратора
        </p>
        <Formik<UserSignInRequest>
          initialValues={{ email: '', password: '' }}
          onSubmit={handleSignIn}
        >
          {({ handleSubmit }) => (
            <Form className="w-2/3 mx-auto mt-3" onSubmit={handleSubmit}>
              <LocalInput name="email" placeholder="Email" />
              <span className="h-4 block"></span>
              <LocalInput
                name="password"
                placeholder="Пароль"
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      disableRipple
                      onClick={() => setShowPassword(!showPassword)}
                      size="small"
                      className="text-main_light"
                    >
                      {showPassword ? (
                        <VisibilityOff
                          sx={{ color: 'black' }}
                          fontSize="small"
                          color="inherit"
                        />
                      ) : (
                        <Visibility
                          sx={{ color: 'black' }}
                          fontSize="small"
                          color="inherit"
                        />
                      )}
                    </IconButton>
                  ),
                }}
              />
              <LocalButton className="w-full mt-10" type="submit">
                Войти
              </LocalButton>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
