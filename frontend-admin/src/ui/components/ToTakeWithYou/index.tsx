import React, { useState } from 'react';
import { Box, BoxProps, Button } from '@mui/material';
import { asx } from '@app/utils/sx';
import { v4 as uuidv4 } from 'uuid';
import { RouteCustomProperties } from '@app/core/models/Route';
import { TitledList } from '../TitledList';
import { Add } from '@mui/icons-material';

type ExternalValue = NonNullable<RouteCustomProperties['toTakeWithYou']>;

type ValueItem = ExternalValue[number];

type State = {
  values: Record<string, ValueItem>;
};

const INITIAL_VALUE_ITEM: ValueItem = {
  items: [],
  title: '',
};

interface ToTakeWithYouProps extends Omit<BoxProps, 'onChange'> {
  initialValue?: ExternalValue;
  onChange?: (newValue: ExternalValue) => void;
}

export const ToTakeWithYou: React.FC<ToTakeWithYouProps> = ({
  initialValue,
  onChange,
  sx,
  ...props
}) => {
  const [state, setState] = useState<State>(() => {
    if (!initialValue) {
      return {
        values: {},
      };
    } else {
      return {
        values: initialValue.reduce((acc, cur) => {
          return {
            ...acc,
            [uuidv4()]: cur,
          };
        }, {} as Record<string, ValueItem>),
      };
    }
  });

  const handleStateChange = (newState: State) => {
    onChange?.(Object.values(newState.values));
    return { ...newState };
  };

  const handleDeleteList = (uuid: string) => {
    setState(p => {
      const newState = {
        ...p,
        values: Object.entries(p.values).reduce((acc, [curUuid, curValues]) => {
          if (curUuid === uuid) {
            return acc;
          } else {
            return { ...acc, [curUuid]: curValues };
          }
        }, {} as Record<string, ValueItem>),
      };

      return handleStateChange(newState);
    });
  };

  const handleListValueChange = (uuid: string) => (newValue: ValueItem) => {
    setState(p => {
      const newState = {
        ...p,
        values: {
          ...p.values,
          [uuid]: newValue,
        },
      };

      return handleStateChange(newState);
    });
  };

  return (
    <Box
      sx={[
        {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '30px',
        },
        ...asx(sx),
      ]}
      {...props}
    >
      {Object.keys(state.values).map((uuid, index) => (
        <TitledList
          key={uuid}
          listIndex={index}
          onDeleteClick={() => handleDeleteList(uuid)}
          initialValue={state.values[uuid]}
          onChange={handleListValueChange(uuid)}
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
};
