import bermamytImage from './mock-bermamyt.png'
import melnitsaImage from './mock-melnitsa.png'
import polyanaImage from './mock-polyana.png'
import shumkaImage from './mock-shumka.png'
import mockPlaceBanner from './mock-place-banner.png'

interface MockBanner {
  id: number
  imageSrc: string
  navigatePath?: string
}
export interface MockPlace {
  id: number
  name: string
  image: string
  description: string
  banners: Array<MockBanner>
}

export const MOCK_BANNERS: Array<MockBanner> = [
  {
    id: 1,
    imageSrc: mockPlaceBanner,
  },
  {
    id: 2,
    imageSrc: mockPlaceBanner,
  },
  {
    id: 3,
    imageSrc: mockPlaceBanner,
  },
  {
    id: 4,
    imageSrc: mockPlaceBanner,
  },
]

export const MOCK_PLACES: Array<MockPlace> = [
  {
    id: 1,
    name: 'Чертова мельница',
    image: melnitsaImage,
    description:
      'Величественный Эльбрус с севера лучше всего наьлбдать с большого горного плато Бермамыт. Отсюда огромная двуглавая гора видна как на ладони!',
    banners: MOCK_BANNERS,
  },
  {
    id: 2,
    name: 'Плато Бермамыт',
    image: bermamytImage,
    description:
      'Величественный Эльбрус с севера лучше всего наьлбдать с большого горного плато Бермамыт. Отсюда огромная двуглавая гора видна как на ладони!',
    banners: MOCK_BANNERS,
  },
  {
    id: 3,
    name: 'Софийская поляна',
    image: polyanaImage,
    description:
      'Величественный Эльбрус с севера лучше всего наьлбдать с большого горного плато Бермамыт. Отсюда огромная двуглавая гора видна как на ладони!',
    banners: MOCK_BANNERS,
  },
  {
    id: 4,
    name: 'Водопад Шумка',
    image: shumkaImage,
    description:
      'Величественный Эльбрус с севера лучше всего наьлбдать с большого горного плато Бермамыт. Отсюда огромная двуглавая гора видна как на ладони!',
    banners: MOCK_BANNERS,
  },
  {
    id: 5,
    name: 'Софийская поляна 2',
    image: polyanaImage,
    description:
      'Величественный Эльбрус с севера лучше всего наьлбдать с большого горного плато Бермамыт. Отсюда огромная двуглавая гора видна как на ладони!',
    banners: MOCK_BANNERS,
  },
]
