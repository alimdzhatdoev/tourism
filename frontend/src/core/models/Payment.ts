import {BaseModel} from 'sjs-base-model'
import Creator from './Creator'

export type Currency =
  | 'RUB'
  | 'EUR'
  | 'USD'
  | 'GBP'
  | 'UAH'
  | 'BYR'
  | 'KZT'
  | 'AZN'
  | 'CHF'
  | 'CZK'
  | 'CAD'
  | 'PLN'
  | 'SEK'
  | 'TRY'
  | 'CNY'
  | 'INR'
  | 'BLR'
  | 'ZAR'
  | 'UZS'
  | 'BGN'
  | 'RON'
  | 'AUD'
  | 'HKD'
  | 'GEL'
  | 'KGS'
  | 'AMD'
  | 'AED'

export type CultureNames = 'ru-RU' | 'en-US' | 'kk' | 'uk' | 'pl' | 'vi' | 'tr'

export default class Payment extends BaseModel {
  public id: number = 0
  public createdDttm: string = ''
  public createdBy: Creator = Creator as any

  public amount: number = 0
  public currency: Currency = 'RUB'
  public cultureName: CultureNames = 'ru-RU'
  public name: string = ''
  public isSuccess: boolean = false

  public paymentUrl: string | null = null
  public transactionId: number | null = null
  public description: string | null = null
  public accountId: string | null = null
  public email: string | null = null

  public AcsUrl: string = ''
  public MD: number | null = null
  public PaReq: string | null = null
  public TermUrl: string | null = null

  public get needs3DS() {
    return !this.isSuccess && this.AcsUrl && this.PaReq && this.MD
  }

  constructor(data: Partial<Payment>) {
    super({expand: true})
    this.update(data)
  }
}
