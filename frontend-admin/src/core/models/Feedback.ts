import { BaseModel } from 'sjs-base-model';

export default class Feedback extends BaseModel {
  public id: number = 0;
  public createdAt: string = '';
  public seenAt: string = '';
  public name: string = '';
  public message: null | string = null;
  public subject: null | string = null;
  public email: null | string = null;
  public phone: null | string = null;

  constructor(data: Partial<Feedback>) {
    super({ expand: true });
    this.update(data);
  }
}
