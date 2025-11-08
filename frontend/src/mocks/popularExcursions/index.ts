import {MOCK_BANNERS} from '../popularPlaces'
import mockBermamyt from './mock-bermamyt.png'
import mockMedovye from './mock-medovye.png'
import mockSofijskie from './mock-sofijskie.png'
import mockSufidzhinskie from './mock-sufrudzhinskie.png'

export interface MockExcursion {
  id: number
  image: string
  name: string
  locationName: string
  rating: string
  minPrice: number
  description: string
  banners: typeof MOCK_BANNERS
}

export const MOCK_POPULAR_EXCURSIONS: Array<MockExcursion> = [
  {
    id: 1,
    image: mockBermamyt,
    locationName: 'Архыз, КЧР',
    minPrice: 4500,
    name: 'Софийские водопады и прочие прекрасности',
    rating: '4.3',
    description:
      'Величественный Эльбрус с севера лучше всего наьлбдать с  плато Бермамыт. Отсюда огромная двуглавая гора видна как на ладони!',
    banners: MOCK_BANNERS,
  },
  {
    id: 2,
    image: mockMedovye,
    locationName: 'Архыз, КЧР',
    minPrice: 4500,
    name: 'Медовые водопады',
    rating: '4',
    description:
      'Величественный Эльбрус с севера лучше всего наьлбдать с  плато Бермамыт. Отсюда огромная двуглавая гора видна как на ладони!',
    banners: MOCK_BANNERS,
  },
  {
    id: 3,
    image: mockSofijskie,
    locationName: 'Домбай, КЧР',
    minPrice: 4500,
    name: 'Софийские водопады',
    rating: '5',
    description:
      'Величественный Эльбрус с севера лучше всего наьлбдать с  плато Бермамыт. Отсюда огромная двуглавая гора видна как на ладони!',
    banners: MOCK_BANNERS,
  },
  {
    id: 4,
    image: mockSufidzhinskie,
    locationName: 'Архыз, КЧР',
    minPrice: 4500,
    name: 'Суфруджинские водопады',
    rating: '5',
    description:
      'Величественный Эльбрус с севера лучше всего наьлбдать с  плато Бермамыт. Отсюда огромная двуглавая гора видна как на ладони!',
    banners: MOCK_BANNERS,
  },
  {
    id: 5,
    image: mockSofijskie,
    locationName: 'Домбай, КЧР',
    minPrice: 4500,
    name: 'Софийские водопады 2',
    rating: '5',
    description:
      'Величественный Эльбрус с севера лучше всего наьлбдать с  плато Бермамыт. Отсюда огромная двуглавая гора видна как на ладони!',
    banners: MOCK_BANNERS,
  },
]
