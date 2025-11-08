import React, { useCallback } from 'react';
import { Dialog, DialogProps } from '@mui/material';
import { LocalButton } from '../LocalButton';

interface Props extends DialogProps {
  /**
   * Confirm function must returns an boolean value (promise result).
   * They will call onClose function if promise result === `true`
   * @type {() => Promise<boolean>}
   */
  onConfirm: () => Promise<any> | any;
  /**
   * Custom title
   * @type {string}
   */
  title?: string;
  /**
   * Custom description
   * @type {string}
   */
  description?: string;
  /**
   * Custom confirm button title
   * @type {string}
   */
  confirmTitle?: string;
  /**
   * Custom cancel button title
   * @type {string}
   */
  cancelTitle?: string;
}

export const ConfirmationModal: React.FC<Props> = ({
  title = 'Вы уверены?',
  confirmTitle = 'Да',
  cancelTitle = 'Нет',
  description,
  onConfirm,
  onClose,
  ...props
}) => {
  const handleCancelClick = useCallback(
    (e?: React.MouseEvent<HTMLButtonElement>) =>
      onClose && onClose(e ?? {}, 'backdropClick'),
    [onClose],
  );

  const handleConfirmClick = useCallback(async () => {
    const result = await onConfirm();
    if (result) handleCancelClick();
  }, [handleCancelClick, onConfirm]);

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
        <span className="text-2xl whitespace-pre-line">{title}</span>

        {description ? (
          <span className="text-m whitespace-pre-line w-full mt-4">
            {description}
          </span>
        ) : null}

        <div className="min-w-32 w-[120%] flex items-center justify-around mt-4">
          <LocalButton
            variant="danger"
            onClick={handleConfirmClick}
            className="min-w-[70px]"
          >
            {confirmTitle}
          </LocalButton>
          <LocalButton onClick={handleCancelClick} className="min-w-[70px]">
            {cancelTitle}
          </LocalButton>
        </div>
      </div>
    </Dialog>
  );
};
