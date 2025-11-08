import React, { memo, useCallback } from 'react';
import { Rating } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import cn from 'classnames';
import { Route } from '@app/core/models';
import noPhoto from '@app/assets/no-photo-placeholder.png';
import { ClockFilledIcon, FolderIcon, TickIcon } from '@app/assets/icons';
import { ROUTE_STATUSES_ENUM } from '@app/core/models/Route';

const iconWithStatus: Record<ROUTE_STATUSES_ENUM, React.ReactNode> = {
  [ROUTE_STATUSES_ENUM.PUBLICATION]: <TickIcon />,
  [ROUTE_STATUSES_ENUM.CREATION]: <ClockFilledIcon color="#F4C851" />,
  [ROUTE_STATUSES_ENUM.VERIFICATION]: <ClockFilledIcon color="#F4C851" />,
  [ROUTE_STATUSES_ENUM.SUSPENSION]: <FolderIcon />,
};

interface Props {
  route: Route;
  onClick?: (id: Route['id']) => void;
  className?: string;
}

export const RouteCard: React.FC<Props> = memo(
  ({ route, className, onClick }) => {
    const {
      name,
      id,
      lengthWithPostfix,
      duration,
      rating,
      description,
      declentedReviewCount,
      photos,
      status,
    } = route;

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
          backgroundImage: photos?.length
            ? `url(${photos[0].file})`
            : `url(${noPhoto})`,
        }}
        onClick={handleAttractionClick}
      >
        <span
          className={cn(
            'self-end flex items-center justify-center w-10 h-10 rounded-lg bg-menu_dark',
            {
              'bg-yellow_button': status.id === ROUTE_STATUSES_ENUM.PUBLICATION,
              'bg-menu_dark': status.id !== ROUTE_STATUSES_ENUM.PUBLICATION,
            },
          )}
        >
          {iconWithStatus[status.id]}
        </span>
        <div className="flex flex-col">
          <span className="self-start text-xl max-w-[90%] line-clamp-2">
            {name}
          </span>
          <div className="flex items-center text-sm my-2">
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
          <span className="text-sm font-muller_regular line-clamp-6">
            {description}
          </span>
          <div className="flex items-center mt-5 h-10">
            <div className="flex flex-col items-start justify-between">
              <span className="text-lg">{duration}</span>
              <span className="text-sm">{lengthWithPostfix}</span>
            </div>
          </div>
        </div>
      </div>
    );
  },
);
