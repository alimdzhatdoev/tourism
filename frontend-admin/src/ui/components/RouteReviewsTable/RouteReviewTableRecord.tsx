import React, { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import cn from 'classnames';
import { IconButton, Rating } from '@mui/material';
import { Close } from '@mui/icons-material';
import StarIcon from '@mui/icons-material/Star';
import { RouteReview, RouteReviewPhoto } from '@app/core/models';
import { useDeleteRouteReviewMutation } from '@app/core/store/route_reviews';
import { ArrowIcon } from '@app/assets/icons';
import { ImageViewer } from '../ImageViewer';
import type { TableCell } from './RouteReviewsTable';

interface Props {
  review: RouteReview;
  fullView?: boolean;
  isLastReview?: boolean;
}

export const RouteReviewTableRecord: React.FC<Props> = ({
  review,
  isLastReview,
}) => {
  const [isClosedComment, setCloseComment] = useState(true);

  const [viewerOpenId, setViewerOpenId] = useState<
    RouteReviewPhoto['id'] | undefined
  >(undefined);

  const [deleteRouteReviewApi, { isError }] = useDeleteRouteReviewMutation();

  const { id, createdDttm, createdBy, route, text, photos, starRate } = review;

  const handleDeleteReview = useCallback(async () => {
    await deleteRouteReviewApi({ id });
    if (isError) return toast.error('Произошла ошибка', { toastId: id });
    return toast.success('Отзыв удален!');
  }, [deleteRouteReviewApi, id, isError]);

  const handleOpenPhotoView = (photo_id: RouteReviewPhoto['id']) =>
    setViewerOpenId(photo_id);

  const handleClosePhotoView = () => setViewerOpenId(undefined);

  const TABLE_CELLS: TableCell[] = [
    {
      className: 'col-span-2 pt-1 border-r border-dark_stroke text-sm',
      content: dayjs(createdDttm).format('DD.MM.YYYY'),
    },
    {
      className: 'col-span-2 pt-1 border-r border-dark_stroke text-sm',
      content: createdBy.fullName,
    },
    {
      className:
        'col-span-2 pl-2 pt-1 border-r border-dark_stroke text-sm truncate',
      content: route.kind.name,
    },
    {
      className:
        'col-span-2 flex items-start justify-center pt-1 border-r border-dark_stroke text-sm',
      content: route.tags.length
        ? route.tags.map(t => t.tag.name).join(', ')
        : '-',
    },
    {
      className:
        'col-span-2 flex items-start justify-center pt-1 border-r border-dark_stroke text-sm',
      content: route.name,
    },
    {
      className:
        'col-span-2 flex items-start justify-center pt-1 border-r border-dark_stroke text-sm',
      content: (
        <Rating
          readOnly
          value={starRate.id}
          emptyIcon={
            <StarIcon
              className="opacity-80 text-main_grey"
              fontSize="inherit"
            />
          }
        />
      ),
    },
    {
      className: cn(
        'col-span-3 px-2 pt-1 border-r border-dark_stroke text-sm h-full items-center justify-between flex flex-row',
        {
          truncate: isClosedComment,
        },
      ),
      length: text?.length,
      content: (
        <>
          <span className={cn({ 'whitespace-normal': !isClosedComment })}>
            {text && text.length > 18 && isClosedComment
              ? text?.slice(0, 11) + '...'
              : text}
          </span>
          {!!photos.length && (
            <span className="flex justify-start overflow-x-auto overscroll-x-contain mt-2 pb-2">
              {photos.map(p => (
                <img
                  key={p.id}
                  src={p.file}
                  alt={route.name}
                  className="active:scale-[0.98] w-[60px] h-[60px] transition rounded-lg mr-2 object-cover cursor-pointer"
                  onClick={() => handleOpenPhotoView(p.id)}
                  role="presentation"
                />
              ))}
            </span>
          )}
        </>
      ),
    },
    {
      className: 'flex items-center justify-center',
      content: (
        <IconButton onClick={handleDeleteReview}>
          <Close color="error" />
        </IconButton>
      ),
    },
  ];

  const handleToggleComment = () => {
    setCloseComment(prevState => !prevState);
  };

  return (
    <>
      <div
        className={cn(
          'grid grid-cols-16 text-center border-t border-x border-dark_stroke min-h-[48px] h-full',
          {
            'rounded-b-3xl border-b': isLastReview,
          },
        )}
      >
        {TABLE_CELLS.map(({ className, content, length }, i) => (
          <span key={className + i.toString()} className={className}>
            {content}
            {length ? (
              length > 18 && (
                <div
                  className="text-yellow_text cursor-pointer flex justify-center items-center"
                  onClick={handleToggleComment}
                >
                  {isClosedComment ? 'Подробнее' : 'Свернуть'}
                  <ArrowIcon
                    className="ml-1.5 stroke-yellow_text"
                    width={14}
                    height={14}
                    direction={isClosedComment ? 'bottom' : 'top'}
                  />
                </div>
              )
            ) : (
              <></>
            )}
          </span>
        ))}
      </div>

      {photos && viewerOpenId && (
        <ImageViewer
          src={photos.map(p => p.file)}
          onClose={handleClosePhotoView}
          currentIndex={photos.findIndex(p => p.id === viewerOpenId)}
          backgroundStyle={{ backgroundColor: '#00000090' }}
          closeOnClickOutside
          disableScroll
        />
      )}
    </>
  );
};
