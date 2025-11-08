import {BaseModel} from 'sjs-base-model'
import Attraction from './Attraction'
import Creator from './Creator'
import Route from './Route'

import {Nullable, Optional} from 'types-helpers'
import {BannerItemProps} from '@/ui/components'

export interface BannersFilters {
  ordering: 'created_dttm' | '-created_dttm'
  search: string
  page: number
  size: number
}

export type BannerExpand = Array<'attraction' | 'route'>

export default class Banner extends BaseModel {
  public id: number = 0
  public createdDttm: string = ''
  public createdBy: Creator = Creator as any
  public title: string = ''
  public subtitle: string = ''
  public file: Nullable<string> = null
  public fileBase64: Nullable<string> = null
  public order: number = 0
  public isActive: boolean = false

  public route: Route = Route as any
  public attraction: Attraction = Attraction as any

  public routeId: Route['id'] = 0
  public attractionId: Attraction['id'] = 0

  public get bannerItemProps(): BannerItemProps {
    let navigatePath: Optional<string> = undefined
    let bannerText: Pick<BannerItemProps, 'title' | 'subtitle'> = {}

    if (this.routeId) {
      navigatePath = `routes/${this.routeId}`
    }

    if (this.attractionId) {
      navigatePath = `places/${this.attractionId}`
    }

    if (this.title) {
      bannerText.title = this.title
      bannerText.subtitle = this.subtitle ?? bannerText.subtitle
    }

    return {
      id: this.id,
      imageSrc: this.file ?? '',
      navigatePath,
      ...bannerText,
    }
  }

  constructor(data: Partial<Banner>) {
    super({expand: true})
    this.update(data)
  }
}
