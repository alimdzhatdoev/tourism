import { BaseModel } from 'sjs-base-model';
import Creator from './Creator';

export enum CURRENCY_ENUM {
  RUB = 'RUB',
  EUR = 'EUR',
  USD = 'USD',
  GBP = 'GBP',
  UAH = 'UAH',
  BYR = 'BYR',
  KZT = 'KZT',
  AZN = 'AZN',
  CHF = 'CHF',
  CZK = 'CZK',
  CAD = 'CAD',
  PLN = 'PLN',
  SEK = 'SEK',
  TRY = 'TRY',
  CNY = 'CNY',
  INR = 'INR',
  BLR = 'BLR',
  ZAR = 'ZAR',
  UZS = 'UZS',
  BGN = 'BGN',
  RON = 'RON',
  AUD = 'AUD',
  HKD = 'HKD',
  GEL = 'GEL',
  KGS = 'KGS',
  AMD = 'AMD',
  AED = 'AED',
}

export enum CULTURE_NAMES_ENUM {
  RU = 'ru-RU',
  EN = 'en-US',
  KK = 'kk',
  UK = 'uk',
  PL = 'pl',
  VI = 'vi',
  TR = 'tr',
}

export default class Payment extends BaseModel {
  public id: number = 0;
  public createdDttm: string = '';
  public createdBy: Creator = Creator as any;

  public amount: number = 0;
  public currency: CURRENCY_ENUM = CURRENCY_ENUM.RUB;
  public cultureName: CULTURE_NAMES_ENUM = CULTURE_NAMES_ENUM.RU;
  public name: string = '';
  public isSuccess: boolean = false;

  public paymentUrl: string | null = null;
  public invoiceId: string | null = null;
  public description: string | null = null;
  public accountId: string | null = null;
  public email: string | null = null;

  constructor(data: Partial<Payment>) {
    super({ expand: true });
    this.update(data);
  }
}
