import React from 'react';
import cn from 'classnames';
import { useLocation } from 'react-router-dom';
import { UI_ROUTES_ENUM } from '../Router';
import { Menu } from '../Menu';

interface Props {
  children: NonNullable<React.ReactNode>;
  className?: string;
}

export const Layout: React.FC<Props> = ({ children, className }) => {
  const { pathname } = useLocation();

  const pathnameBase =
    pathname.indexOf('/', 1) === -1
      ? pathname
      : pathname.slice(0, pathname.indexOf('/', 1));

  const needShowMenu = Object.values(UI_ROUTES_ENUM).includes(
    pathnameBase as UI_ROUTES_ENUM,
  );

  return (
    <div
      className={cn(className, {
        'flex items-start': needShowMenu,
      })}
    >
      {needShowMenu ? (
        <>
          <div className="w-1/5 h-full sticky top-0">
            <Menu />
          </div>
          <div className="w-full min-h-screen flex flex-col p-10">
            {children}
          </div>
        </>
      ) : (
        <div>{children}</div>
      )}
    </div>
  );
};
