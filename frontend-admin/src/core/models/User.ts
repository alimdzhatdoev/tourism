import { BaseModel } from 'sjs-base-model';

type Point = {
  lat: number;
  lon: number;
};

export enum GENDER_ENUM {
  MALE = 'M',
  FEMALE = 'F',
}

export type UserExpand = Array<'favourite_attractions'>;

export default class User extends BaseModel {
  public id: number = 0;
  public firstName: string = '';
  public lastName: string = '';
  public email: string = '';
  public phone: string | null = '';
  public isPhoneVerified: boolean = false;
  public isStaff: boolean = false;
  public isActive: boolean = false;
  /**
   * 'SRID=4326;POINT (`longtitude` `latitude`)'
   * @example `SRID=4326;POINT (30.03300177183692 60.05653819637438)`
   */
  public lastLocation: string | null = null;
  public middleName: string | null = null;
  public birthDate: string | null = null;
  public gender: { id: GENDER_ENUM; label: string } = {
    id: GENDER_ENUM.MALE,
    label: 'MALE',
  };
  public file: string | null = null;
  public fileBase64: string | null = null;

  public get fullName() {
    if (!this.firstName.length && !this.lastName.length) return undefined;

    return [this.firstName, this.middleName, this.lastName]
      .filter(Boolean)
      .map(n => n![0].toUpperCase() + n?.slice(1).toLowerCase())
      .join(' ');
  }

  public get ruGender() {
    return this.gender?.id === GENDER_ENUM.MALE ? 'Мужской' : 'Женский';
  }

  public get pointForMap(): Point | undefined {
    if (!this.lastLocation) return undefined;
    const regex = /.*?\(([^)]*)\).*/g;
    const result = regex.exec(this.lastLocation);
    const [lat, lon]: string[] = result ? result[1].split(' ').reverse() : [];
    return lat && lon ? { lat: Number(lat), lon: Number(lon) } : undefined;
  }

  public generateSRIDString(point: Point) {
    return `SRID=4326;POINT (${point.lon} ${point.lat})`;
  }

  constructor(data: Partial<User>) {
    super({ expand: true });
    this.update(data);
  }
}
