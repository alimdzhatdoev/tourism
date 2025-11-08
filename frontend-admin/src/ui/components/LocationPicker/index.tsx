import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  CircularProgress,
  Dialog,
  InputAdornment,
  TextField,
} from '@mui/material';
import { MagnifyingGlassIcon } from '@app/assets/icons';
import { LocalButton } from '@app/ui/components';
import Map from './Map';
import {
  useGeocodeAddressToLatlngMutation,
  useGeocodeLatlngToAddressMutation,
} from '@app/core/store/users';
import { useDebounce } from '@app/hooks';
import { Location } from '@app/core/models';
import { MapRef } from 'react-map-gl';
import { isValidCoordinateString } from '@app/utils/isValidCoordinateString';

const DEFAULT_COORDS = { lat: 59.89, lon: 30.32 };
const DEFAULT_ZOOM = 16;
const FLY_TO_ZOOM = 15;

interface Props {
  onPickLocation: (Location: Location) => void;
  noButton?: { open: boolean; onClose: () => void };
  initialCoords?: { lat: number; lon: number };
  initialZoom?: number;
}

export const LocationPicker: React.FC<Props> = ({
  onPickLocation,
  initialCoords = DEFAULT_COORDS,
  initialZoom = DEFAULT_ZOOM,
  noButton,
}) => {
  const [openPickLocationModal, setOpenPickLocationModal] =
    useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>();
  const [coords, setCoords] = useState<
    { lon: number; lat: number } | undefined
  >();

  const debouncedCoords = useDebounce(coords, 1000);
  const debouncedSearchQuery = useDebounce(searchQuery, 1000);

  const [geocodeLatlngApi, { data, isLoading }] =
    useGeocodeLatlngToAddressMutation();

  const [geocodeAddressApi] = useGeocodeAddressToLatlngMutation();

  const address = data?.data.Address;

  const mapRef = useRef<MapRef | null>(null);

  const handleCenterChanged = (latlng: NonNullable<typeof coords>) => {
    // prevent rerender
    if (coords && latlng.lat === coords.lat && latlng.lon === coords.lon) {
      return;
    }
    setCoords(latlng);
  };

  const loadAddress = useCallback(async () => {
    if (!debouncedCoords) return;

    await geocodeLatlngApi(debouncedCoords).unwrap();
  }, [debouncedCoords, geocodeLatlngApi]);

  const loadCoordinates = useCallback(async () => {
    if (!debouncedSearchQuery) return;

    let latCoordinate;
    let lonCoordinate;

    if (isValidCoordinateString(debouncedSearchQuery)) {
      const [lat, lon] = debouncedSearchQuery.split(',');
      latCoordinate = Number(lat);
      lonCoordinate = Number(lon);
    } else {
      const coordinatesData = await geocodeAddressApi({
        address: debouncedSearchQuery,
      }).unwrap();

      const coordinates = coordinatesData.data.coordinates;
      if (!coordinates) return;

      const [lon, lat] = coordinates;
      latCoordinate = Number(lat);
      lonCoordinate = Number(lon);
    }

    if (!latCoordinate || !lonCoordinate) return;

    mapRef.current?.flyTo({
      center: [lonCoordinate, latCoordinate],
      zoom: FLY_TO_ZOOM,
    });

    await geocodeLatlngApi({ lon: lonCoordinate, lat: latCoordinate });
  }, [debouncedSearchQuery, geocodeAddressApi, geocodeLatlngApi]);

  const handlePickAddress = () => {
    if (!address || !debouncedCoords) return;
    const { lat, lon } = debouncedCoords;
    const location = address.location(lat, lon);
    //  location.point = location.generateSRIDString(debouncedCoords);
    onPickLocation(location);
    handleCloseDialog();
  };

  useEffect(() => {
    loadAddress();
  }, [debouncedCoords, loadAddress]);

  useEffect(() => {
    loadCoordinates();
  }, [debouncedSearchQuery, loadCoordinates]);

  useEffect(() => {
    if (noButton) {
      setOpenPickLocationModal(noButton.open);
    }
  }, [noButton]);

  const handleCloseDialog = () => {
    if (noButton) {
      noButton.onClose();
      return;
    }
    setOpenPickLocationModal(false);
  };

  return (
    <>
      {!noButton ? (
        <div className="flex flex-col">
          <span className="text-xl mb-2.5">Местоположение</span>
          <LocalButton
            variant="contained"
            type="button"
            className="text-start h-14 border border-main_grey"
            onClick={() => {
              setOpenPickLocationModal(true);
            }}
          >
            Добавить
          </LocalButton>
        </div>
      ) : null}

      <Dialog
        open={openPickLocationModal}
        onClose={handleCloseDialog}
        PaperProps={{
          style: {
            borderRadius: 24,
          },
        }}
        maxWidth="xl"
      >
        <div className="flex bg-main_dark font-muller_regular w-[1200px] relative">
          <div className="flex flex-col justify-between items-center w-[390px] p-5">
            <TextField
              fullWidth
              placeholder="Поиск"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MagnifyingGlassIcon />
                  </InputAdornment>
                ),
              }}
            />
            <div className="flex flex-col items-center">
              {isLoading ? (
                <CircularProgress />
              ) : (
                <>
                  <span>Двигайте карту, чтобы указать место</span>
                  {
                    <span className="text-center mt-2">
                      {address ? address.formatted : 'Адрес не найден'}
                    </span>
                  }
                </>
              )}
            </div>
            <LocalButton onClick={handlePickAddress}>Сохранить</LocalButton>
          </div>

          <Map
            ref={mapRef}
            width={810}
            height={600}
            onCenterChanged={handleCenterChanged}
            initialView={{
              latitude: initialCoords.lat,
              longitude: initialCoords.lon,
              zoom: initialZoom,
            }}
          />
          <div
            className="absolute z-10 top-5 right-5 w-28 h-11 flex items-center justify-center p-[0.5px] bg-gradient-to-tr from-main_grey via-[#F1EDFA] to-main_grey cursor-pointer rounded-md"
            role="presentation"
            onClick={handleCloseDialog}
          >
            <span className="w-full h-full rounded-[5.5px] flex items-center justify-center text-center bg-menu_dark hover:bg-green_button">
              Закрыть
            </span>
          </div>
        </div>
      </Dialog>
    </>
  );
};
