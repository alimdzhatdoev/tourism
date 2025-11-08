import React, { memo, useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Paper,
  PaperProps,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { asx } from '@app/utils/sx';
import { v4 as uuidv4 } from 'uuid';
import { Add, Close, Delete } from '@mui/icons-material';

type Data = {
  title: string;
  items: Record<string, string>;
};

type Errors = { title: boolean; items: Array<string> };

type State = {
  data: Data;
  errors: Errors;
  editItemUuid: string;
};

const INITIAL_UUID = uuidv4();

const INITIAL_ITEMS: Data['items'] = {
  [INITIAL_UUID]: '',
};

const INITIAL_DATA: Data = {
  title: '',
  items: INITIAL_ITEMS,
};

const INITIAL_ERRORS: Errors = {
  title: false,
  items: [],
};

const INITIAL_STATE: State = {
  data: INITIAL_DATA,
  errors: INITIAL_ERRORS,
  editItemUuid: INITIAL_UUID,
};

type ExternalValue = { title: string; items: Array<string> };

interface TitledListProps extends Omit<PaperProps, 'onChange'> {
  initialValue?: ExternalValue;
  onChange?: (
    value: ExternalValue,
    errors: { title: boolean; items: Array<string> },
  ) => void;
  listIndex?: number;
  onDeleteClick?: () => void;
}

export const TitledList: React.FC<TitledListProps> = memo(
  ({ sx, initialValue, onChange, listIndex, onDeleteClick, ...props }) => {
    const [state, setState] = useState(() => {
      if (initialValue) {
        return {
          errors: INITIAL_ERRORS,
          editItemUuid: '',
          data: {
            title: initialValue.title,
            items: initialValue.items.reduce(
              (acc, cur) => ({
                ...acc,
                [uuidv4()]: cur,
              }),
              {} as Data['items'],
            ),
          },
        };
      } else {
        return INITIAL_STATE;
      }
    });

    const handleStateChange = (newState: State) => {
      const errors = {
        title: !newState.data.title,
        items: Object.entries(newState.data.items)
          .filter(([_, v]) => !v)
          .map(([uuid]) => uuid),
      };

      onChange?.(
        {
          title: newState.data.title,
          items: Object.values(newState.data.items),
        },
        errors,
      );

      return { ...newState, errors };
    };

    const deleteItem = (uuid: string) => {
      setState(p => {
        const newState = {
          ...p,
          data: {
            ...p.data,
            items: Object.entries(p.data.items).reduce(
              (acc, [curUuid, curValue]) => {
                if (curUuid === uuid) {
                  return acc;
                } else {
                  return {
                    ...acc,
                    [curUuid]: curValue,
                  };
                }
              },
              {} as Data['items'],
            ),
          },
        };

        return handleStateChange(newState);
      });
    };

    const isAddMoreDisabled = Object.values(state.data.items).some(v => !v);

    return (
      <Paper
        sx={[
          {
            padding: '30px',
            borderRadius: '20px',
            display: 'flex',
            flexDirection: 'column',
            maxWidth: 'calc((100% - 60px) / 2 - 50px)',
            width: '100%',
            gap: '25px',
          },
          ...asx(sx),
        ]}
        elevation={10}
        {...props}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          {typeof listIndex === 'number' ? (
            <Typography fontSize="24px">Раздел {listIndex + 1}</Typography>
          ) : null}

          <Tooltip title="Удалить раздел">
            <IconButton onClick={onDeleteClick}>
              <Close />
            </IconButton>
          </Tooltip>
        </Box>

        <TextField
          label="Заголовок"
          value={state.data.title}
          onChange={e =>
            setState(p => {
              const newState = {
                ...p,
                data: { ...p.data, title: e.target.value },
              };

              return handleStateChange(newState);
            })
          }
          // error={state.errors.title}
        />

        {Object.entries(state.data.items).map(([uuid, value], index) => (
          <Box
            key={uuid}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              minHeight: '56px',
            }}
          >
            <Typography>{index + 1}.</Typography>

            <TextField
              fullWidth
              label="Наименование"
              value={value}
              onChange={e =>
                setState(p => {
                  const newState = {
                    ...p,
                    data: {
                      ...p.data,
                      items: {
                        ...p.data.items,
                        [uuid]: e.target.value,
                      },
                    },
                  };

                  return handleStateChange(newState);
                })
              }
              // error={state.errors.items.includes(uuid)}
            />

            <Tooltip title="Удалить">
              <span>
                <IconButton
                  onClick={() => deleteItem(uuid)}
                  disabled={Object.values(state.data.items).length === 1}
                >
                  <Delete />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        ))}

        <Tooltip
          title={isAddMoreDisabled ? 'Сначала введите намиенование' : undefined}
        >
          <span>
            <Button
              fullWidth
              variant="contained"
              disabled={isAddMoreDisabled}
              onClick={() =>
                setState(p => {
                  const newUuid = uuidv4();
                  const newState = {
                    ...p,
                    editItemUuid: newUuid,
                    data: {
                      ...p.data,
                      items: { ...p.data.items, [newUuid]: '' },
                    },
                  };

                  return handleStateChange(newState);
                })
              }
              startIcon={<Add />}
            >
              Добавить элемент
            </Button>
          </span>
        </Tooltip>
      </Paper>
    );
  },
);
