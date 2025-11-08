import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Box,
  BoxProps,
  MenuItem,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import { asx } from '@app/utils/sx';
import { useGetRegionsListQuery } from '@app/core/store/regions';
import { Location } from '@app/core/models';
import { LocalSelectV2, LocationPicker } from '@app/ui/components';
import { LocationUpdateRequest } from '@app/core/types/requests';
import {
  useCreateLocationMutation,
  useUpdateLocationMutation,
} from '@app/core/store/locations';
import { toast } from 'react-toastify';
import {
  useGeocodeAddressToLatlngMutation,
  useGeocodeLatlngToAddressMutation,
} from '@app/core/store/users';
import { useGetCitiesListQuery } from '@app/core/store/cities';

type CreateLocationData = Omit<LocationUpdateRequest, 'id'>;

interface LocationFieldsetProps extends BoxProps {
  location?: Location;
}

export interface LocationFieldsetRef {
  submit: () => Promise<number>;
}

export const LocationFieldset = forwardRef<
  LocationFieldsetRef,
  LocationFieldsetProps
>(({ location, sx, ...containerProps }, ref) => {
  const [locationData, setLocationData] = useState<CreateLocationData>({
    address: '',
    city: '',
    lat: '',
    lon: '',
  });

  const [regionId, setRegionId] = useState(location?.regionId ?? '');
  const [openPicker, setOpenPicker] = useState(false);

  const initialized = useRef(false);

  const [createLocation] = useCreateLocationMutation();
  const [updateLocation] = useUpdateLocationMutation();

  const [getCoordinates, geocoderApi] = useGeocodeAddressToLatlngMutation();
  const [geocodeLatlngApi] = useGeocodeLatlngToAddressMutation();
  const regionsApi = useGetRegionsListQuery({ size: 1000 });
  const citiesApi = useGetCitiesListQuery({ size: 1000 });

  const initialCoordinates = useMemo(() => {
    if (locationData.lon && locationData.lat) {
      return {
        lat: Number(locationData.lat),
        lon: Number(locationData.lon),
      };
    }
    if (!geocoderApi.data && location) return location.coordinates;
    if (!geocoderApi.data) return undefined;
    const [lon, lat] = geocoderApi.data.data.coordinates;
    return {
      lat,
      lon,
    };
  }, [locationData.lon, locationData.lat, geocoderApi.data, location]);

  const regions = useMemo(
    () => regionsApi.data?.data.results ?? [],
    [regionsApi.data],
  );

  const selectedRegion = useMemo(
    () => regions.find(r => r.id.toString() === regionId),
    [regions, regionId],
  );

  const cities = useMemo(() => {
    const allCities = citiesApi.data?.data.results ?? [];
    if (!regionId) return allCities;
    return allCities.filter(c => c.regionId == regionId);
  }, [citiesApi.data?.data.results, regionId]);

  const handleSelectorChange = (event: SelectChangeEvent<unknown>) => {
    const value = `${event.target.value}`;
    if (event.target.name === 'region' && regionId !== value) {
      setLocationData(p => ({ ...p, lat: '', lon: '', address: '', city: '' }));
      setRegionId(value);
    }
    if (event.target.name === 'city') {
      const selected = cities.find(c => `${c.id}` === value);
      if (selected) setRegionId(`${selected.regionId}`);
      setLocationData(p => ({
        ...p,
        lat: '',
        lon: '',
        address: '',
        city: value,
      }));
    }
  };

  const submit = async () => {
    try {
      if (location?.id) {
        const changed = Object.keys(locationData).some(key => {
          if (key === 'city') {
            return locationData.city !== location.cityId;
          }
          return (
            locationData[key as keyof CreateLocationData] !==
            location[key as keyof typeof location]
          );
        });
        if (changed) {
          await updateLocation({ id: location.id, ...locationData }).unwrap();
        }
        return location.id;
      } else {
        const { data } = await createLocation(locationData).unwrap();
        return data.id;
      }
    } catch (error) {
      console.error(error);
      toast.warn('Ошибка создания/обновления местоположения');
      return 0;
    }
  };

  const handlePickLocation = async (_location: Location) => {
    const res = await geocodeLatlngApi({
      lat: _location.lat,
      lon: _location.lon,
    }).unwrap();

    const regionName = (res.data.Address.Components as any).findLast(
      (x: any) => x.kind === 'province',
    )?.name;
    const cityName = res.data.Address.Components.find(
      x => x.kind === 'locality',
    )?.name;

    if (regionName) {
      const region = regions.find(
        x =>
          x.region.toLowerCase().includes(regionName.toLowerCase()) ||
          regionName.toLowerCase().includes(x.region.toLowerCase()),
      );

      if (region) {
        setRegionId(region.id);
      } else {
        setRegionId('');
      }
    } else {
      setRegionId('');
    }

    const city = cityName
      ? cities.find(
          x =>
            x.city.toLowerCase().includes(cityName.toLowerCase()) ||
            cityName.toLowerCase().includes(x.city.toLowerCase()),
        )?.id ?? ''
      : '';

    setLocationData(p => ({
      ...p,
      address: city ? _location.address ?? '' : '',
      city,
      ..._location.coordinates,
    }));
    setOpenPicker(false);
  };

  useEffect(() => {
    if (locationData.city && selectedRegion) {
      const selectedCity = cities.find(c => `${c.id}` === locationData.city);
      const address = `${selectedRegion.region}, ${selectedCity?.city}`;
      getCoordinates({ address });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, locationData.city, cities]);

  useEffect(() => {
    if (location && !initialized.current) {
      initialized.current = true;
      setLocationData(p => ({
        ...p,
        address: location.address ?? '',
        city: location.cityId,
        lat: location.lat,
        lon: location.lon,
      }));
    }
  }, [location]);

  useImperativeHandle(ref, () => ({
    submit,
  }));

  return (
    <>
      <Box
        sx={[
          {
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            columnGap: '24px',
          },
          ...asx(sx),
        ]}
        {...containerProps}
      >
        <span style={{ gridColumn: '1 / -1' }} className="text-xl mb-2.5">
          Местопложение
        </span>
        <LocalSelectV2
          label="Регион *"
          name="region"
          value={regionId}
          onChange={handleSelectorChange}
        >
          {regions.map(r => (
            <MenuItem key={r.id} value={r.id}>
              {r.region}
            </MenuItem>
          ))}
        </LocalSelectV2>

        <LocalSelectV2
          label="Город *"
          name="city"
          value={locationData.city}
          onChange={handleSelectorChange}
        >
          {cities.map(c => (
            <MenuItem key={c.id} value={c.id}>
              {c.city}
            </MenuItem>
          ))}
        </LocalSelectV2>

        <TextField
          label="Адрес *"
          value={locationData.address}
          onClick={() => setOpenPicker(true)}
          disabled={!locationData.city}
        />
      </Box>

      <LocationPicker
        initialCoords={initialCoordinates}
        noButton={{
          open: openPicker,
          onClose: () => setOpenPicker(false),
        }}
        onPickLocation={handlePickLocation}
      />
    </>
  );
});
