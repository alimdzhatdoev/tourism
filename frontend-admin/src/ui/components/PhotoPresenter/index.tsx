import React, { useCallback, useState } from 'react';
import cn from 'classnames';
import { Close, Menu } from '@mui/icons-material';
import { Menu as ContextMenu, IconButton, MenuItem } from '@mui/material';
import { ConfirmationModal } from '../ConfirmationModal';

type MenuRecord = {
  label: string;
  action: (id: number) => void;
};

interface Props {
  id: number;
  file: string;
  onClick: (id: number) => void;
  onClickDelete?: ((id: number) => Promise<any>) | ((id: number) => void); // TODO boolean value
  onChangeOrder?: ((id: number) => Promise<any>) | ((id: number) => void); // TODO boolean value
  isMain?: boolean;
  entityName?: string;
  className?: string;
  menuItems?: MenuRecord[];
}

export const PhotoPresenter: React.FC<Props> = ({
  id,
  file,
  onClick,
  onClickDelete,
  isMain = false,
  entityName,
  className,
  menuItems,
}) => {
  const [openConfirmationModal, setOpenConfirmationModal] =
    useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<HTMLElement | undefined>(undefined);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      onClick(id);
    },
    [id, onClick],
  );

  const handleDeletePhoto = useCallback(async () => {
    onClickDelete && onClickDelete(id);
    return true; // TODO прокинуть true из промиса onClickDelete
  }, [id, onClickDelete]);

  const handleDeleteClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      setOpenConfirmationModal(true);
    },
    [],
  );

  const handleMenuClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      setMenuOpen(e.currentTarget);
    },
    [],
  );

  const handleMenuItemClick = useCallback(
    (index: number) => {
      const item = menuItems?.at(index);
      if (!item) return;
      item.action(id);
      setMenuOpen(undefined);
    },
    [id, menuItems],
  );

  return (
    <>
      <div
        className={cn(
          'group relative',
          {
            'w-[300px] h-[250px] mr-5': isMain,
            'w-[140px] h-[115px]': !isMain,
          },
          className,
        )}
      >
        <img
          src={file}
          alt={entityName}
          className={cn(
            'rounded-xl h-full w-full object-cover cursor-pointer',
            {
              'border-2 border-yellow_button': isMain,
            },
          )}
        />
        <div
          className="absolute top-0 left-0 opacity-0 bg-black group-hover:opacity-50 h-full w-full cursor-pointer transition rounded-xl"
          onClick={handleClick}
          role="presentation"
        >
          <div
            className={cn('flex items-center w-full text-white', {
              'justify-between': menuItems?.length,
              'justify-end': !menuItems?.length,
            })}
          >
            {!!menuItems?.length && (
              <IconButton
                onClick={handleMenuClick}
                color="inherit"
                disableRipple
              >
                <Menu />
              </IconButton>
            )}
            <IconButton
              onClick={handleDeleteClick}
              color="inherit"
              disableRipple
            >
              <Close />
            </IconButton>
          </div>
        </div>
      </div>

      {!!menuItems?.length && (
        <ContextMenu
          open={!!menuOpen}
          anchorEl={menuOpen}
          onClose={() => setMenuOpen(undefined)}
        >
          {menuItems.map(({ label }, index) => (
            <MenuItem
              disableRipple
              key={label}
              onClick={() => handleMenuItemClick(index)}
            >
              {label}
            </MenuItem>
          ))}
        </ContextMenu>
      )}

      <ConfirmationModal
        open={openConfirmationModal}
        onClose={() => setOpenConfirmationModal(false)}
        onConfirm={handleDeletePhoto}
        title="Удалить фото?"
        cancelTitle="Оставить"
      />
    </>
  );
};
