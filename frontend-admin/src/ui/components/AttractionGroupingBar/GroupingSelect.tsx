import React, { FC, MouseEventHandler } from 'react';
import {
  LocalSelectV2,
  LocalSelectV2tProps,
} from '../LocalSelectV2/LocalSelectV2';
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  MenuItem,
} from '@mui/material';
import { Add, Close } from '@mui/icons-material';

export interface GroupingSelectProps extends LocalSelectV2tProps {
  onAddClick?: MouseEventHandler<HTMLButtonElement>;
  onClearClick?: MouseEventHandler<HTMLButtonElement>;
  isLoading?: boolean;
}

export const GroupingSelect: FC<GroupingSelectProps> = ({
  onAddClick,
  children,
  onClearClick,
  value,
  isLoading = false,
  ...props
}) => {
  return (
    <LocalSelectV2
      endAdornment={
        value ? (
          <InputAdornment
            position="end"
            sx={{ margin: '0 15px 0 0', cursor: 'pointer' }}
          >
            <IconButton onClick={onClearClick}>
              <Close fontSize="small" />
            </IconButton>
          </InputAdornment>
        ) : null
      }
      value={value}
      {...props}
    >
      <MenuItem>
        <Button
          variant="contained"
          sx={{ gap: '10px', textTransform: 'none', fontSize: '18px' }}
          onClick={onAddClick}
          fullWidth
        >
          <Add />
          Добавить
        </Button>
      </MenuItem>
      <Divider />
      {isLoading && !children ? (
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <CircularProgress sx={{ margin: '10px 0' }} />
        </Box>
      ) : null}
      {children}
    </LocalSelectV2>
  );
};
