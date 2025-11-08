import React from 'react';
import { AttractionReview } from '@app/core/models';
import { AttractionReviewTableRecord } from './AttractionReviewTableRecord';

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
    content: 'Территория',
  },
  {
    className:
      'col-span-2 flex items-center justify-center border-r border-dark_stroke',
    content: 'Категория',
  },
  {
    className:
      'col-span-2 flex items-center justify-center border-r border-dark_stroke',
    content: 'Название объекта',
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
  reviews: AttractionReview[];
  PaginationComponent?: React.ReactElement;
}

export const AttractionReviewsTable: React.FC<Props> = ({
  reviews,
  PaginationComponent,
}) => {
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
        <AttractionReviewTableRecord
          key={r.id}
          review={r}
          isLastReview={i === arr.length - 1}
        />
      ))}
      {PaginationComponent}
    </>
  );
};
