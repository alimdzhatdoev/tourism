import { Location } from '@app/core/models';
import {
  useCreateCityMutation,
  useGetCitiesListQuery,
} from '@app/core/store/cities';
import { useCreateLocationMutation } from '@app/core/store/locations';
import {
  useCreateRegionMutation,
  useGetRegionsListQuery,
} from '@app/core/store/regions';
import { toast } from 'react-toastify';

const handleError = (error: unknown) => {
  console.error(error);
  toast.warn('Произошла ошибка создания местоположения');
};

export const useCreateLocation = () => {
  const [createLocationApi] = useCreateLocationMutation();
  const [createRegionApi] = useCreateRegionMutation();
  const [createCityApi] = useCreateCityMutation();

  const citiesApi = useGetCitiesListQuery({ size: 1000 });
  const cities = citiesApi.data?.data.results ?? [];

  const regionsApi = useGetRegionsListQuery({ size: 1000, expand: ['cities'] });
  const regions = regionsApi.data?.data.results ?? [];

  const createLocation = async (location: Location) => {
    const region = regions.find(r => r.region === location.region.region);
    const city = cities.find(c => c.city === location.city.city);

    let regionId = region?.id ?? 0;
    let cityId = city?.id ?? 0;

    if (regionId === 0 && cityId === 0) {
      try {
        const { data } = await createRegionApi({
          region: location.region.region,
        }).unwrap();
        regionId = data.id;
      } catch (error) {
        handleError(error);
      }
    }

    if (cityId === 0) {
      try {
        const { data } = await createCityApi({
          city: location.city.city,
          region: regionId,
        }).unwrap();
        cityId = data.id;
      } catch (error) {
        handleError(error);
      }
    }

    let locationId = 0;

    try {
      const { data } = await createLocationApi({
        city: cityId,
        address: location.address ?? '',
        formatted: location.formatted,
        lat: location.lat,
        lon: location.lon,
      }).unwrap();
      locationId = data?.id ?? 0;
    } catch (error) {
      handleError(error);
    }
    return locationId;
  };

  return createLocation;
};
