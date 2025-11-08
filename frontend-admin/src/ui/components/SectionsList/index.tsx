import React, { ChangeEvent, memo, useCallback, useState } from 'react';
import {
  Box,
  BoxProps,
  Button,
  IconButton,
  Paper,
  PaperProps,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { asx } from '@app/utils/sx';
import { RouteCustomProperties } from '@app/core/models/Route';
import { v4 as uuidv4 } from 'uuid';
import { Add, Close } from '@mui/icons-material';

interface SectionProps extends Omit<PaperProps, 'onChange'> {
  index: number;
  onDeleteClick: () => void;
  onChange: (
    field: 'title' | 'text',
  ) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  title: string;
  text: string;
}

const Section: React.FC<SectionProps> = memo(
  ({ title, text, onChange, onDeleteClick, index, sx, ...props }) => {
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography fontSize="24px">Раздел {index + 1}</Typography>
          <Tooltip title="Удалить раздел">
            <IconButton onClick={onDeleteClick}>
              <Close />
            </IconButton>
          </Tooltip>
        </Box>

        <TextField
          fullWidth
          label="Заголовок"
          value={title}
          onChange={onChange('title')}
        />

        <TextField
          fullWidth
          multiline
          minRows={3}
          label="Текст"
          value={text}
          onChange={onChange('text')}
        />
      </Paper>
    );
  },
);

type ExternalValue = NonNullable<
  RouteCustomProperties['listDescription']
>[number];

type State = {
  values: Record<string, ExternalValue>;
  editItemUuid: string;
};

const INITIAL_STATE: State = {
  values: {},
  editItemUuid: '',
};

const INITIAL_VALUE_ITEM: ExternalValue = {
  title: '',
  text: '',
};

interface SectionsListProps extends Omit<BoxProps, 'onChange'> {
  initialValue?: Array<ExternalValue>;
  onChange?: (newValue: Array<ExternalValue>) => void;
}

export const SectionsList: React.FC<SectionsListProps> = memo(
  ({ sx, initialValue, onChange, ...props }) => {
    const [state, setState] = useState<State>(() => {
      if (initialValue) {
        return {
          editItemUuid: '',
          values: initialValue.reduce((acc, cur) => {
            return {
              ...acc,
              [uuidv4()]: cur,
            };
          }, {} as Record<string, ExternalValue>),
        };
      } else {
        return INITIAL_STATE;
      }
    });

    const handleStateChange = (newState: State) => {
      onChange?.(Object.values(newState.values));
      return { ...newState };
    };

    const createInputChangeHandler = useCallback(
      (uuid: string) =>
        (field: 'title' | 'text') =>
        (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
          setState(p => {
            const newState = {
              ...p,
              values: {
                ...p.values,
                [uuid]: { ...p.values[uuid], [field]: event.target.value },
              },
            };

            return handleStateChange(newState);
          });
        },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [],
    );

    const createSectionDeleteHandler = useCallback(
      (uuid: string) => () => {
        setState(p => {
          const newState = {
            ...p,
            values: Object.entries(p.values).reduce(
              (acc, [curUuid, curValue]) => {
                if (uuid === curUuid) {
                  return acc;
                } else {
                  return {
                    ...acc,
                    [curUuid]: curValue,
                  };
                }
              },
              {} as Record<string, ExternalValue>,
            ),
          };

          return handleStateChange(newState);
        });
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [],
    );

    return (
      <Box
        sx={[
          {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: '30px',
            alignItems: 'flex-start',
          },
          ...asx(sx),
        ]}
        {...props}
      >
        {Object.keys(state.values).map((uuid, index) => (
          <Section
            key={uuid}
            index={index}
            text={state.values[uuid].text}
            title={state.values[uuid].title}
            onChange={createInputChangeHandler(uuid)}
            onDeleteClick={createSectionDeleteHandler(uuid)}
          />
        ))}

        <Button
          variant="contained"
          onClick={() =>
            setState(p => ({
              ...p,
              values: { ...p.values, [uuidv4()]: INITIAL_VALUE_ITEM },
            }))
          }
          sx={[Object.keys(state.values).length !== 0 && { aspectRatio: 1 }]}
        >
          <Add />
          {Object.keys(state.values).length === 0 ? 'Добавить раздел' : null}
        </Button>
      </Box>
    );
  },
);
