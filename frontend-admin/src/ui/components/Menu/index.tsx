import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import cn from 'classnames';
import { useStorage } from '@app/hooks';
import {
  ChatIcon,
  ClockFilledIcon,
  DiscountIcon,
  HomeIcon,
  LeaveIcon,
  MarkerIcon,
  UserIcon,
  TransportIcon,
  UsersChatIcon,
} from '@app/assets/icons';
import { SYSTEM_ROUTES_ENUM, UI_ROUTES_ENUM } from '../Router';
import { userStateSelector } from '@app/core/store/user/selectors';
import { Newspaper } from '@mui/icons-material';
import CollectionsIcon from '@mui/icons-material/Collections';
import RateReviewIcon from '@mui/icons-material/RateReview';

type MenuItem = {
  path: UI_ROUTES_ENUM;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  name: string;
};

const MENU: MenuItem[] = [
  // {
  //   path: UI_ROUTES_ENUM.ANALYTICS,
  //   name: 'Аналитика',
  //   Icon: GraphIcon,
  // },
  {
    path: UI_ROUTES_ENUM.ATTRACTIONS,
    name: 'Объекты',
    Icon: HomeIcon,
  },
  {
    path: UI_ROUTES_ENUM.POSTS,
    name: 'Новости',
    Icon: Newspaper as any,
  },
  {
    path: UI_ROUTES_ENUM.USERS_GALLERY,
    name: 'Галлерея',
    Icon: CollectionsIcon as any,
  },
  {
    path: UI_ROUTES_ENUM.ROUTES,
    name: 'Маршруты',
    Icon: MarkerIcon,
  },
  {
    path: UI_ROUTES_ENUM.EXCURSIONS,
    name: 'Экскурсии',
    Icon: TransportIcon,
  },
  {
    path: UI_ROUTES_ENUM.BANNERS,
    name: 'Баннеры',
    Icon: DiscountIcon,
  },
  {
    path: UI_ROUTES_ENUM.USERS,
    name: 'Пользователи',
    Icon: UserIcon,
  },
  {
    path: UI_ROUTES_ENUM.REVIEWS,
    name: 'Отзывы',
    Icon: ChatIcon,
  },
  {
    path: UI_ROUTES_ENUM.BOOKINGS,
    name: 'Бронирования',
    Icon: ClockFilledIcon,
  },
  {
    path: UI_ROUTES_ENUM.CHATS,
    name: 'Чаты',
    Icon: UsersChatIcon,
  },
  {
    path: UI_ROUTES_ENUM.FEEDBACKS,
    name: 'Обратная связь',
    Icon: RateReviewIcon as any,
  },
];

export const Menu: React.FC = memo(() => {
  const navigate = useNavigate();
  const { clearStorage } = useStorage();

  const { user } = useSelector(userStateSelector);

  const handleLogout = () => {
    clearStorage();
    toast.info('Выход из системы...', { autoClose: 1100 });
    setTimeout(() => navigate(SYSTEM_ROUTES_ENUM.MAIN), 1500);
  };

  return (
    <div className="w-full min-w-[285px] bg-menu_dark min-h-screen py-10 flex flex-col justify-between select-none">
      <div>
        {/* <Link
          to={SYSTEM_ROUTES_ENUM.MAIN}
          className="self-center block pb-10 border-b"
        >
          <h1 className="uppercase font-graphie text-center text-4xl text-main_dark">
            travel
          </h1>
        </Link> */}

        {user && (
          <div className="flex space-x-3 mt-8 px-12 text-white">
            {/* <div>
              {user.file ? (
                <img
                  className="w-8 h-8 rounded-full"
                  src={user.file}
                  alt="avatar"
                />
              ) : (
                <UserIcon className="w-8 h-8" color="#FFF" />
              )}
            </div> */}
            <div>
              <p>{user.fullName}</p>
              <p>{user.email}</p>
            </div>
          </div>
        )}

        <div className="flex flex-col mt-10 self-start px-12">
          {MENU.map(({ Icon, name, path }) => (
            <NavLink
              key={name + path}
              to={path}
              className={({ isActive }) =>
                cn('flex items-center mb-9 transition', {
                  'text-main_dark': isActive,
                })
              }
            >
              <span>{<Icon color="currentColor" />}</span>
              <span className="ml-4 text-lg">{name}</span>
            </NavLink>
          ))}
        </div>
      </div>
      <div
        className="flex items-center active:text-yellow_text cursor-pointer transition px-12"
        onClick={handleLogout}
      >
        <span>{<LeaveIcon color="currentColor" />}</span>
        <span className="ml-4 text-lg">Выйти</span>
      </div>
    </div>
  );
});
