import mockBannerImage from './mock_banner.png'

export interface MockBanner {
  id: number
  imageSrc: string
  navigatePath: string
}

export const MOCK_BANNERS: Array<MockBanner> = [
  {id: 1, imageSrc: mockBannerImage, navigatePath: '/mock-banner-1-link-path'},
  {id: 2, imageSrc: mockBannerImage, navigatePath: '/mock-banner-2-link-path'},
]
