import React, { FC, useMemo } from 'react';
import {
  Box,
  BoxProps,
  Checkbox,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { useGetGroupsListQuery } from '@app/core/store/groups';
import { LocalSelectV2 } from '@app/ui/components';
import { asx } from '@app/utils/sx';
import { ConditionalFieldset } from './ConditionalFieldset';
import { FormInterface } from '../FormParts.types';

export const GroupKindFieldset: FC<BoxProps & FormInterface> = ({
  setValue,
  values,
  sx,
  ...containerProps
}) => {
  const groupsApi = useGetGroupsListQuery({
    expand: ['subgroups', 'kind'],
    size: 9999,
  });

  const groups = useMemo(
    () => groupsApi.data?.data.results ?? [],
    [groupsApi.data],
  );

  const selectedGroups = useMemo(
    () => groups.filter(g => values.groups.includes(g.id.toString())),
    [groups, values.groups],
  );

  const subgroups = useMemo(() => {
    if (selectedGroups.length) {
      return selectedGroups.flatMap(g => g.subgroups);
    } else {
      return groups.flatMap(g => g.subgroups);
    }
  }, [groups, selectedGroups]);

  const handleSelectorChange = (event: SelectChangeEvent<unknown>) => {
    const { value, name } = event.target;
    const newValue =
      typeof value === 'string' ? value.split(', ') : (value as string[]);

    if (name === 'groups') {
      const oldSubgroups = subgroups.filter(sg =>
        values.subgroups.includes(sg.id.toString()),
      );

      const newSubgroups = oldSubgroups.filter(sg =>
        newValue.includes(sg.groupId.toString()),
      );

      setValue(
        'subgroups',
        newSubgroups.map(sg => sg.id.toString()),
      );
    }

    if (name === 'subgroups') {
      const selected = subgroups.find(sg => sg.id.toString() === value);

      if (selected) {
        setValue('groups', [...values.groups, selected.id.toString()]);
      }
    }

    setValue(name, newValue);
  };

  return (
    <Box
      sx={[
        { display: 'flex', flexDirection: 'column', gap: '24px' },
        ...asx(sx),
      ]}
      {...containerProps}
    >
      <Box sx={{ display: 'flex', gap: '24px' }}>
        <LocalSelectV2
          label="Группа *"
          name="groups"
          value={values.groups}
          onChange={handleSelectorChange}
          sx={{ width: '400px' }}
          renderValue={selected =>
            (selected as string[])
              .map(id => groups.find(g => g.id.toString() === id)?.name)
              .join(', ')
          }
          multiple
        >
          {groups.map(g => (
            <MenuItem key={g.id} value={g.id.toString()}>
              <Checkbox checked={values.groups.includes(g.id.toString())} />
              {g.name}
            </MenuItem>
          ))}
        </LocalSelectV2>

        <LocalSelectV2
          label="Подгруппа"
          name="subgroups"
          disabled={!values.groups.length}
          value={values.subgroups}
          renderValue={selected =>
            (selected as string[])
              .map(id => subgroups.find(sg => sg.id.toString() === id)?.name)
              .join(', ')
          }
          onChange={handleSelectorChange}
          sx={{ width: '400px' }}
          multiple
        >
          {subgroups.length ? (
            subgroups.map(sg => (
              <MenuItem key={sg.id} value={sg.id.toString()}>
                <Checkbox
                  checked={values.subgroups.includes(sg.id.toString())}
                />
                {sg.name}
              </MenuItem>
            ))
          ) : (
            <MenuItem>Нет доступных подгрупп</MenuItem>
          )}
        </LocalSelectV2>
      </Box>

      <ConditionalFieldset
        setValue={setValue}
        values={values}
        groupKindNames={selectedGroups.map(g => g.kind.name)}
      />
    </Box>
  );
};
