import { BaseModel } from 'sjs-base-model';
import Chat from './Chat';
import Creator from './Creator';

export type ChatMessageExpand = Array<'chat'>;

export default class ChatMessage extends BaseModel {
  public id: number = 0;
  public createdDttm: string = '';
  public createdBy: Creator = Creator as any;

  public message: string | null = null;
  public file: string | null = null;
  public fileBase64: string | null = null;
  public fileName: string | null = null;
  public isRead: boolean = false;

  public chatId: Chat['id'] = 0;
  public chat: Chat = Chat as any;

  constructor(data: Partial<ChatMessage>) {
    super({ expand: true });
    this.update(data);
  }
}
