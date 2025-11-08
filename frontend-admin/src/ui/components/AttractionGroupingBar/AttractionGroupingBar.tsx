import React, {
  FC,
  MouseEventHandler,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { Box, BoxProps, SelectChangeEvent } from '@mui/material';
import { asx } from '@app/utils/sx';
import { useSearchParams } from 'react-router-dom';
import { useGetGroupsListQuery } from '@app/core/store/groups';
import { City, Group, Region, Subgroup } from '@app/core/models';
import { useGetSubgroupsListQuery } from '@app/core/store/subgroups';
import { GroupDialog } from './GroupDialog';
import { GroupingSelect } from './GroupingSelect';
import { GroupingSelectItem } from './GroupingSelectItem';
import { SubgroupDialog } from './SubgroupDialog';
import { useGetRegionsListQuery } from '@app/core/store/regions';
import { useGetCitiesListQuery } from '@app/core/store/cities';
import { RegionDialog } from './RegionDialog';
import { CityDialog } from './CityDialog';

type ParameterName =
  | 'group_id'
  | 'subgroup_id'
  | 'location__region_id'
  | 'location__city_id';

interface GroupDialogState {
  name: 'group_id';
  payload?: Group;
}
interface SubgroupDialogState {
  name: 'subgroup_id';
  payload?: Subgroup;
}
interface RegionDialogState {
  name: 'location__region_id';
  payload?: Region;
}
interface CityDialogState {
  name: 'location__city_id';
  payload?: City;
}
type DialogState =
  | GroupDialogState
  | SubgroupDialogState
  | RegionDialogState
  | CityDialogState
  | null;

interface AttractionGroupingBarProps extends BoxProps {}

export const AttractionGroupingBar: FC<AttractionGroupingBarProps> = ({
  sx: containerSx,
  ...containerProps
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [select, setSelect] = useState<ParameterName | null>(null);
  const [dialog, setDialog] = useState<DialogState>(null);

  const groupsApi = useGetGroupsListQuery({
    size: 9999,
    expand: ['subgroups', 'attractions__excursions'],
  });
  const subgroupsApi = useGetSubgroupsListQuery({
    size: 9999,
    expand: ['attractions__excursions'],
  });
  const regionsApi = useGetRegionsListQuery({
    size: 9999,
    expand: ['locations', 'cities'],
  });
  const citiesApi = useGetCitiesListQuery({
    size: 9999,
    expand: ['locations'],
  });

  const getParametersValue = useCallback(
    (parameterName: ParameterName) =>
      parseInt(searchParams.get(parameterName) || '', 10) || '',
    [searchParams],
  );

  const groups = useMemo(
    () => groupsApi.data?.data.results ?? [],
    [groupsApi.data],
  );

  const subgroups = useMemo(() => {
    const selectedGroupId = getParametersValue('group_id');
    const allSubgroups = subgroupsApi.data?.data.results ?? [];
    return selectedGroupId
      ? allSubgroups.filter(sg => sg.groupId === selectedGroupId)
      : allSubgroups;
  }, [subgroupsApi.data, getParametersValue]);

  const regions = useMemo(
    () => regionsApi.data?.data.results ?? [],
    [regionsApi.data],
  );

  const cities = useMemo(() => {
    const selectedRegionId = getParametersValue('location__region_id');
    const allCities = citiesApi.data?.data.results ?? [];
    return selectedRegionId
      ? allCities.filter(c => c.regionId === selectedRegionId)
      : allCities;
  }, [citiesApi.data, getParametersValue]);

  const refetch: Record<ParameterName, Function> = {
    group_id: groupsApi.refetch,
    subgroup_id: subgroupsApi.refetch,
    location__region_id: regionsApi.refetch,
    location__city_id: citiesApi.refetch,
  };

  const toggleDialog = (name: ParameterName) => () => {
    setSelect(null);
    setDialog(() => ({ name }));
  };

  const toggleSelect = (name: ParameterName | null) => () => setSelect(name);
  const handleCloseDialog = () => setDialog(null);
  const handleDialogSaveClick = () => refetch[dialog!.name]();

  const handleEditClick =
    (
      dialogData: NonNullable<DialogState>,
    ): MouseEventHandler<HTMLButtonElement> =>
    event => {
      event.stopPropagation();
      setSelect(null);
      setDialog(dialogData);
    };

  const handleSelectChange =
    (name: ParameterName) => (event: SelectChangeEvent<unknown>) => {
      if (!event.target.value) return;

      setSearchParams(prev => {
        const value = `${event.target.value}`;

        if (name === 'group_id') {
          prev.delete('subgroup_id');
        }

        if (name === 'subgroup_id') {
          const selectedSubgroup = subgroups.find(sg => `${sg.id}` === value);
          const groupId = `${selectedSubgroup?.groupId}` ?? '';
          if (selectedSubgroup) prev.set('group_id', groupId);
        }

        if (name === 'location__region_id') {
          prev.delete('location__city_id');
        }

        if (name === 'location__city_id') {
          const selectedCity = cities.find(c => `${c.id}` === value);
          const regionId = `${selectedCity?.regionId}` ?? '';
          if (regionId) prev.set('location__region_id', regionId);
        }

        prev.set(name, value);
        return prev;
      });
    };

  const handleRemoveClick = (name: ParameterName) => () => {
    setSearchParams(prev => {
      prev.delete(name);
      return prev;
    });
  };

  return (
    <Box
      {...containerProps}
      sx={[
        { display: 'flex', width: '100%', gap: '20px' },
        ...asx(containerSx),
      ]}
    >
      <GroupingSelect
        onClose={toggleSelect(null)}
        open={select === 'group_id'}
        onOpen={toggleSelect('group_id')}
        onAddClick={toggleDialog('group_id')}
        value={getParametersValue('group_id')}
        onChange={handleSelectChange('group_id')}
        onClearClick={handleRemoveClick('group_id')}
        isLoading={groupsApi.isFetching}
        label="Группа"
      >
        {groups.map(group => (
          <GroupingSelectItem
            key={group.id}
            value={group.id}
            onEditClick={handleEditClick({ name: 'group_id', payload: group })}
            src={group.icon}
          >
            {group.name}
          </GroupingSelectItem>
        ))}
      </GroupingSelect>
      <GroupingSelect
        onClose={toggleSelect(null)}
        open={select === 'subgroup_id'}
        onOpen={toggleSelect('subgroup_id')}
        onAddClick={toggleDialog('subgroup_id')}
        value={getParametersValue('subgroup_id')}
        onChange={handleSelectChange('subgroup_id')}
        onClearClick={handleRemoveClick('subgroup_id')}
        isLoading={subgroupsApi.isFetching}
        label="Подгруппа"
      >
        {subgroups.map(subgroup => (
          <GroupingSelectItem
            key={subgroup.id}
            value={subgroup.id}
            onEditClick={handleEditClick({
              name: 'subgroup_id',
              payload: subgroup,
            })}
            src={subgroup.icon}
          >
            {subgroup.name}
          </GroupingSelectItem>
        ))}
      </GroupingSelect>

      <GroupingSelect
        onClose={toggleSelect(null)}
        open={select === 'location__region_id'}
        onOpen={toggleSelect('location__region_id')}
        onAddClick={toggleDialog('location__region_id')}
        value={getParametersValue('location__region_id')}
        onChange={handleSelectChange('location__region_id')}
        onClearClick={handleRemoveClick('location__region_id')}
        isLoading={regionsApi.isFetching}
        label="Регион"
      >
        {regions.map(region => (
          <GroupingSelectItem
            noImage
            key={region.id}
            value={region.id}
            onEditClick={handleEditClick({
              name: 'location__region_id',
              payload: region,
            })}
          >
            {region.region}
          </GroupingSelectItem>
        ))}
      </GroupingSelect>

      <GroupingSelect
        onClose={toggleSelect(null)}
        open={select === 'location__city_id'}
        onOpen={toggleSelect('location__city_id')}
        onAddClick={toggleDialog('location__city_id')}
        value={getParametersValue('location__city_id')}
        onChange={handleSelectChange('location__city_id')}
        onClearClick={handleRemoveClick('location__city_id')}
        isLoading={citiesApi.isFetching}
        label="Населенный пункт"
      >
        {cities.map(city => (
          <GroupingSelectItem
            noImage
            key={city.id}
            value={city.id}
            onEditClick={handleEditClick({
              name: 'location__city_id',
              payload: city,
            })}
          >
            {city.city}
          </GroupingSelectItem>
        ))}
      </GroupingSelect>

      {dialog?.name === 'group_id' ? (
        <GroupDialog
          group={dialog.payload}
          onSave={handleDialogSaveClick}
          onClose={handleCloseDialog}
          open
        />
      ) : null}

      {dialog?.name === 'subgroup_id' ? (
        <SubgroupDialog
          subgroup={dialog.payload}
          onSave={handleDialogSaveClick}
          onClose={handleCloseDialog}
          open
        />
      ) : null}

      {dialog?.name === 'location__region_id' ? (
        <RegionDialog
          region={dialog.payload}
          onSave={handleDialogSaveClick}
          onClose={handleCloseDialog}
          open
        />
      ) : null}

      {dialog?.name === 'location__city_id' ? (
        <CityDialog
          city={dialog.payload}
          onSave={handleDialogSaveClick}
          onClose={handleCloseDialog}
          open
        />
      ) : null}
    </Box>
  );
};
