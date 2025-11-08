import React, { memo, useCallback } from 'react';
import dayjs from 'dayjs';
import { Rating } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import cn from 'classnames';
import Attraction, {
  ATTRACTION_STATUSES_ENUM,
} from '@app/core/models/Attraction';
import noPhoto from '@app/assets/no-photo-placeholder.png';
import {
  ClockFilledIcon,
  EyeIcon,
  FolderIcon,
  HeartIcon,
  MarkerIcon,
  TickIcon,
} from '@app/assets/icons';

const iconWithStatus: Record<ATTRACTION_STATUSES_ENUM, React.ReactNode> = {
  [ATTRACTION_STATUSES_ENUM.PUBLISHED]: <TickIcon />,
  [ATTRACTION_STATUSES_ENUM.CREATION]: <ClockFilledIcon color="#F4C851" />,
  [ATTRACTION_STATUSES_ENUM.ARCHIVE]: <FolderIcon />,
};

interface Props {
  attraction: Attraction;
  onClick?: (id: Attraction['id']) => void;
  className?: string;
  hideStatus?: boolean;
}

export const AttractionCard: React.FC<Props> = memo(
  ({ attraction, className, onClick, hideStatus }) => {
    const {
      name,
      id,
      location,
      rating,
      declentedReviewCount,
      likes,
      views,
      containedRoutes,
      status,
      publishedDttm,
      isUserAdded,
    } = attraction;

    const textWithStatus: Record<ATTRACTION_STATUSES_ENUM, string> = {
      [ATTRACTION_STATUSES_ENUM.PUBLISHED]: `Размещено ${dayjs(
        publishedDttm,
      ).format('D MMMM HH:mm')}`,
      [ATTRACTION_STATUSES_ENUM.CREATION]: 'На рассмотрении',
      [ATTRACTION_STATUSES_ENUM.ARCHIVE]: 'В архиве',
    };

    const handleAttractionClick = useCallback(
      () => onClick && onClick(id),
      [id, onClick],
    );

    return (
      <div
        className={cn(
          'text-main_dark bg-cover bg-center h-96 w-72 relative flex flex-col justify-between p-5 cursor-pointer rounded-xl shadow-[0_-130px_30px_-10px_rgba(0,0,0,0.4)_inset] hover:shadow-[0_-130px_30px_-10px_rgba(0,0,0,0.5)_inset] active:scale-[.98] transition',
          className,
        )}
        style={{
          backgroundImage: `url(${
            attraction.cover ? attraction.cover : noPhoto
          })`,
        }}
        onClick={handleAttractionClick}
      >
        <span
          className={cn(
            {
              'self-end flex items-center justify-center w-10 h-10 rounded-lg bg-menu_dark':
                !hideStatus,
            },
            {
              'bg-yellow_button':
                status.id === ATTRACTION_STATUSES_ENUM.PUBLISHED,
              'bg-menu_dark': status.id !== ATTRACTION_STATUSES_ENUM.PUBLISHED,
            },
          )}
        >
          {hideStatus ? '' : iconWithStatus[status.id]}
        </span>
        <div className="flex flex-col">
          <span className="self-start text-xl max-w-[85%] truncate">
            {name}
          </span>
          <span className="self-start text-sm max-w-[95%] truncate">
            {location.locationSummary}
          </span>
          <div className="flex items-center text-sm">
            <Rating
              value={rating}
              precision={0.1}
              readOnly
              emptyIcon={
                <StarIcon
                  className="opacity-80 text-main_grey"
                  fontSize="inherit"
                />
              }
            />
            <span className="text-yellow_text mx-2">{rating}</span>
            <span className="text-xs">{declentedReviewCount}</span>
          </div>
          <div className="flex mt-4 max-w-[95%] truncate">
            <span className="flex">
              <EyeIcon />
              <span className="ml-1.5">{views}</span>
            </span>
            <span className="flex ml-4">
              <HeartIcon />
              <span className="ml-1.5">{likes}</span>
            </span>
            <span className="flex ml-4">
              <MarkerIcon />
              <span className="ml-1.5">{containedRoutes}</span>
            </span>
          </div>
          {isUserAdded && (
            <span className="text-sm mt-3.5">{textWithStatus[status.id]}</span>
          )}
        </div>
      </div>
    );
  },
);
