import { useStorage } from '@app/hooks';
import React from 'react';
import { Navigate } from 'react-router-dom';
import { SYSTEM_ROUTES_ENUM, UI_ROUTES_ENUM } from '../Router';

interface Props {
  children: React.ReactNode;
  redirectPath?: SYSTEM_ROUTES_ENUM | UI_ROUTES_ENUM;
}

export const PrivateRoute: React.FC<Props> = ({
  children,
  redirectPath = SYSTEM_ROUTES_ENUM.MAIN,
}) => {
  const { isAuthorized } = useStorage();

  if (!isAuthorized) return <Navigate to={redirectPath} />;

  return <>{children}</>;
};
