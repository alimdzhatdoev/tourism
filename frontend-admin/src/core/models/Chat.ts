import { BaseModel } from 'sjs-base-model';
import ChatMessage from './ChatMessage';
import Creator from './Creator';

export type ChatExpand = Array<'messages'>;

export default class Chat extends BaseModel {
  public id: number = 0;
  public createdDttm: string = '';
  public createdBy: Creator = Creator as any;

  public creatorUnreadMessageCount: number = 0;
  public adminUnreadMessageCount: number = 0;

  public messages: ChatMessage[] = [ChatMessage as any];

  constructor(data: Partial<Chat>) {
    super({ expand: true });
    this.update(data);
  }
}
