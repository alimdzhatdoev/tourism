import { BaseModel } from 'sjs-base-model';

export default class PostSection extends BaseModel {
  public id: number = 0;
  public name: string = '';
  public slug: string = '';

  constructor(data: Partial<PostSection>) {
    super({ expand: true });
    this.update(data);
  }
}
