import {BaseModel} from 'sjs-base-model'

export default class BaseFile extends BaseModel {
  public fileBase64: string | null = null
  public fileName: string | null = null
  public file: string | null = null

  constructor(data: Partial<BaseFile>) {
    super({expand: true})
    this.update(data)
  }
}
