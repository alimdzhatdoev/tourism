import { BaseModel } from 'sjs-base-model';
import Creator from './Creator';
import PostSection from './PostSection';
import BaseFile from './BaseFile';

export default class Post extends BaseModel {
  public id: number = 0;
  public createdDttm: string = '';
  public createdBy: Creator = Creator as any;

  public sectionId: PostSection['id'] = 0;
  public section: PostSection = PostSection as any;
  public coverData: BaseFile = BaseFile as any;
  public cover: string = '';

  public title: string = '';
  public text: string = '';
  public publishedAt: string | null = null;

  constructor(data: Partial<Post>) {
    super({ expand: true });
    this.update(data);
  }
}
