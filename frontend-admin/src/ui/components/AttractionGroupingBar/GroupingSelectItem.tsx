import React, { FC, MouseEventHandler } from 'react';
import {
  Box,
  IconButton,
  MenuItem,
  MenuItemProps,
  Typography,
} from '@mui/material';
import { Edit, NoPhotography } from '@mui/icons-material';
import { asx } from '@app/utils/sx';

export interface GroupingSelectItemProps
  extends Omit<MenuItemProps, 'children'> {
  onEditClick?: MouseEventHandler<HTMLButtonElement>;
  children: string;
  src?: string | null;
  noImage?: boolean;
}
export const GroupingSelectItem: FC<GroupingSelectItemProps> = ({
  src,
  onEditClick,
  sx,
  children,
  noImage = false,
  ...props
}) => {
  return (
    <MenuItem sx={[{ display: 'flex', gap: '20px' }, ...asx(sx)]} {...props}>
      {src && !noImage ? (
        <Box
          component="img"
          src={src}
          sx={{
            width: '50px',
            height: '50px',
            objectFit: 'cover',
            borderRadius: '8px',
          }}
        />
      ) : null}
      {!src && !noImage ? (
        <Box
          sx={{
            minWidth: '50px',
            height: '50px',
            backgroundColor: 'rgba(255, 255, 255, 0.10)',
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <NoPhotography
            fontSize="small"
            htmlColor="rgba(255, 255, 255, 0.25)"
          />
        </Box>
      ) : null}
      <Typography sx={{ width: '100%' }}>{children}</Typography>
      <IconButton color="primary" onClick={onEditClick}>
        <Edit fontSize="small" />
      </IconButton>
    </MenuItem>
  );
};
