import { BaseModel } from 'sjs-base-model';
import Creator from './Creator';
import Region from './Region';
import City from './City';

export type Point = {
  lat: number;
  lon: number;
};

export type LocationExpand = Array<'region' | 'city'>;

export default class Location extends BaseModel {
  public id: number = 0;
  public createdDttm: string = '';
  public createdBy: Creator = Creator as any;
  public point: {
    coordinates: [number, number];
    type: string;
  } = {
    coordinates: [0, 0],
    type: '',
  };
  public address: string | null = null;
  public formatted: string | null = null;
  public lat: number = 0;
  public lon: number = 0;

  public region: Region = Region as any;
  public city: City = City as any;

  public regionId: Region['id'] = 0;
  public cityId: City['id'] = 0;

  public get locationSummary() {
    if (!this.region.region || !this.city.city) return this.formatted;

    return [this.region.region, this.city.city, this.address]
      .filter(Boolean)
      .join(', ');
  }

  public get coordinates() {
    return {
      lat: this.lat,
      lon: this.lon,
    };
  }

  /**
   * backend: `SRID=4326;POINT (30.03300177183692 60.05653819637438)`
   *
   * @example { lat: 60.05653819637438, lon: 30.03300177183692 }
   * @type {Point}
   */
  // public get pointForMap(): Point | undefined {
  //   if (!this.point) return undefined;
  //   const regex = /.*?\(([^)]*)\).*/g;
  //   const result = regex.exec(this.point);
  //   const [lat, lon]: string[] = result ? result[1].split(' ').reverse() : [];
  //   return lat && lon ? { lat: Number(lat), lon: Number(lon) } : undefined;
  // }

  public generateSRIDString(point: Point) {
    return `SRID=4326;POINT (${point.lon} ${point.lat})`;
  }

  constructor(data: Partial<Location>) {
    super({ expand: true });
    this.update({
      ...data,
      lat: data.lat ?? data.point?.coordinates[1] ?? 0,
      lon: data.lon ?? data.point?.coordinates[0] ?? 0,
    });
  }
}
