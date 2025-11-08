import { BaseModel } from 'sjs-base-model';

export type RouteSeason = 'winter' | 'spring' | 'summer' | 'autumn' | 'all';

export default class RouteProperties extends BaseModel {
  public season: RouteSeason | null = null;
  public riseDegree: number | null = null;
  public isOvernight: boolean | null = null;
  public isFamily: boolean | null = null;
  public isOnHorseback: boolean | null = null;
  public isOnFoot: boolean | null = null;
  public isOnQuadBike: boolean | null = null;
  public isOnCar: boolean | null = null;
  public isSwimming: boolean | null = null;

  constructor(data: Partial<Location>) {
    super({ expand: true });
    this.update(data);
  }
}
