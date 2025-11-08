import { BaseModel } from 'sjs-base-model';
import Creator from './Creator';
import Region from './Region';
import City from './City';
import Location from './Location';

class GeocoderAddressAddressComponent extends BaseModel {
  kind: string = '';
  name: string = '';

  constructor(data: Partial<GeocoderAddressAddressComponent>) {
    super({ expand: true });
    this.update(data);
  }
}

class GeocoderAddressAddress extends BaseModel {
  countryCode: string = '';
  formatted: string = '';
  Components: Array<GeocoderAddressAddressComponent> = [
    GeocoderAddressAddressComponent as any,
  ];

  public location(lat: number, lon: number) {
    const c = this.Components.reduce(
      (acc, cur) => ({ ...acc, [cur.kind]: cur.name }),
      {} as Record<string, string>,
    );

    const data = {
      city: c.locality || c.province || '',
      region: c.province || '',
      street: c.street || '',
      house: c.house || '',
    };

    return new Location({
      lat,
      lon,
      city: new City({ city: data.city }),
      region: new Region({ region: data.region }),
      address: [data.street, data.house].filter(Boolean).join(', '),
    });
  }

  constructor(data: Partial<GeocoderAddressAddress>) {
    super({ expand: true });
    this.update(data);
  }
}

export default class GeocoderAddress extends BaseModel {
  public id: number = 0;
  public createdDttm: string = '';
  public createdBy: Creator = Creator as any;

  public text: string = '';
  public precision: string = '';
  public kind: string = '';
  public Address: GeocoderAddressAddress = GeocoderAddressAddress as any;

  public lon: number = 0;
  public lat: number = 0;
  public coordinates: [number, number] = [0, 0];

  public get hasCoordinates() {
    return Boolean(this.lon + this.lat);
  }

  constructor(data: Partial<GeocoderAddress>) {
    super({ expand: true });
    this.update(data);
  }
}
