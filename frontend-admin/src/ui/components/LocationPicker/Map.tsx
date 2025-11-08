import cn from 'classnames';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import MapGL, { Marker, MapRef, MapLayerMouseEvent } from 'react-map-gl';
import marker from '@app/assets/start.png';

const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

interface Props {
  initialView: {
    latitude: number;
    longitude: number;
    zoom: number;
  };
  width: number;
  height: number;
  className?: string;
  onCenterChanged: (latlng: { lon: number; lat: number }) => void;
}

export const Map = React.forwardRef<MapRef, Props>(
  (
    { initialView, height, width, className, onCenterChanged },
    forwardedRef,
  ) => {
    const [centerState, setCenterState] = useState<
      | {
          lng: number;
          lat: number;
        }
      | undefined
    >(undefined);

    const innerRef = useRef<MapRef | null>(null);

    const mapRef =
      forwardedRef && typeof forwardedRef !== 'function'
        ? forwardedRef
        : innerRef;

    const loadCenter = useCallback(() => {
      setTimeout(() => {
        const ref = mapRef.current;
        const center = ref?.getCenter();
        if (!center) return;
        setCenterState(center);
      }, 50);
    }, [mapRef]);

    const handleSetCenter = () => {
      const center = mapRef.current?.getCenter();
      setCenterState(center);
    };

    const handleClickMap = ({ lngLat }: MapLayerMouseEvent) => {
      const coords = { lat: lngLat.lat, lng: lngLat.lng - 0.00021 };
      setCenterState(coords);
      mapRef.current?.setCenter(coords);
    };

    useEffect(() => {
      if (!centerState) return;
      onCenterChanged({ lat: centerState.lat, lon: centerState.lng });
    }, [centerState, onCenterChanged]);

    useEffect(() => {
      loadCenter();
    }, [loadCenter]);

    return (
      <div className={cn('overflow-hidden', className)}>
        <MapGL
          ref={mapRef}
          mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
          style={{ height, width }}
          initialViewState={initialView}
          onClick={handleClickMap}
          onDrag={handleSetCenter}
          onZoom={handleSetCenter}
          mapStyle="mapbox://styles/mapbox/dark-v10"
        >
          {centerState ? (
            <Marker
              latitude={centerState.lat}
              longitude={centerState.lng}
              offset={[width / 2, -height]}
              anchor="center"
            >
              <img src={marker} alt="marker" className="block h-10 w-10" />
            </Marker>
          ) : null}
        </MapGL>
      </div>
    );
  },
);

export default Map;
