import React from 'react';
import { RouteReview } from '@app/core/models';
import { RouteReviewTableRecord } from './RouteReviewTableRecord';

export type TableCell = {
  className: string;
  content: React.ReactNode;
  length?: number;
};

const TABLE_HEADER_CELLS: TableCell[] = [
  {
    className:
      'col-span-2 flex items-center justify-center border-r border-dark_stroke',
    content: 'Дата',
  },
  {
    className:
      'col-span-2 flex items-center justify-center border-r border-dark_stroke',
    content: 'Пользователь',
  },
  {
    className:
      'col-span-2 flex items-center justify-center border-r border-dark_stroke',
    content: 'Вид маршрута',
  },
  {
    className:
      'col-span-2 flex items-center justify-center border-r border-dark_stroke',
    content: 'Категория',
  },
  {
    className:
      'col-span-2 flex items-center justify-center border-r border-dark_stroke',
    content: 'Название маршрута',
  },
  {
    className:
      'col-span-2 flex items-center justify-center border-r border-dark_stroke',
    content: 'Оценка',
  },
  {
    className:
      'col-span-3 flex items-center justify-center border-r border-dark_stroke',
    content: 'Комментарий',
  },
  {
    className: '',
    content: '',
  },
];

interface Props {
  reviews: RouteReview[];
}

export const RouteReviewsTable: React.FC<Props> = ({ reviews }) => {
  if (!reviews?.length) {
    return (
      <div className="flex items-center justify-center w-full mt-10">
        <span>Отзывов ещё нет</span>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-16 bg-menu_dark rounded-t-3xl h-12 text-center border-x border-menu_dark">
        {TABLE_HEADER_CELLS.map(({ className, content }, i) => (
          <span key={content + i.toString()} className={className}>
            {content}
          </span>
        ))}
      </div>
      {reviews.map((r, i, arr) => (
        <RouteReviewTableRecord
          key={r.id}
          review={r}
          isLastReview={i === arr.length - 1}
        />
      ))}
    </>
  );
};
