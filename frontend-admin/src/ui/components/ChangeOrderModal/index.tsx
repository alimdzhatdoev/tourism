import React, { useCallback, useState } from 'react';
import {
  Dialog,
  DialogProps,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { LocalButton } from '../LocalButton';

interface Props extends DialogProps {
  /**
   * Custom title
   * @type {string}
   */
  title?: string;
  /**
   * Custom confirm button title
   * @type {string}
   */
  confirmTitle?: string;
  maxOrder: number;
  handleSetNewOrder: (newOrder: number) => void;
}

export const ChangeImageOrderModal: React.FC<Props> = ({
  onClose,
  handleSetNewOrder,
  maxOrder,
  title = 'Порядок изображения',
  confirmTitle = 'Сохранить',
  ...props
}) => {
  const [newOrder, setNewOrder] = useState<string | undefined>(undefined);

  const handleChange = (event: SelectChangeEvent) => {
    setNewOrder(event.target.value);
  };

  const handleCancelClick = useCallback(
    (e?: React.MouseEvent<HTMLButtonElement>) =>
      onClose && onClose(e ?? {}, 'backdropClick'),
    [onClose],
  );

  const handleConfirmClick = useCallback(async () => {
    if (typeof newOrder == 'undefined') return;

    handleSetNewOrder(Number(newOrder));
    handleCancelClick();
  }, [handleCancelClick, handleSetNewOrder, newOrder]);

  return (
    <Dialog
      {...props}
      onClose={onClose}
      PaperProps={{
        style: {
          borderRadius: 24,
        },
      }}
    >
      <div className="flex flex-col items-center bg-main_dark p-10 text-main_light min-h-full">
        <span className="text-2xl">{title}</span>

        <div className="min-w-32 w-full flex items-baseline justify-around gap-x-6 mt-8 mb-10">
          <Select
            name="order"
            className="min-w-[240px]"
            value={newOrder}
            onChange={handleChange}
          >
            {Array.from(Array(maxOrder).keys()).map(item => (
              <MenuItem value={item} key={item}>
                {item + 1}
              </MenuItem>
            ))}
          </Select>
          <LocalButton onClick={handleConfirmClick} className="min-w-[70px]">
            {confirmTitle}
          </LocalButton>
        </div>
      </div>
    </Dialog>
  );
};
