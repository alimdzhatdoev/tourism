import {useRef} from 'react'
import {
  useCreateAttractionLikeMutation,
  useDeleteAttractionLikeMutation,
} from '../store/attractions'
import {Attraction} from '../models'

export const useAttractionLike = () => {
  const prosessingIds = useRef<Array<number>>([])

  const [createLike] = useCreateAttractionLikeMutation()
  const [deleteLike] = useDeleteAttractionLikeMutation()

  const toggleLike = async ({
    id,
    isLiked,
  }: {
    id: Attraction['id']
    isLiked: boolean
  }) => {
    if (prosessingIds.current.includes(id)) {
      return
    }

    prosessingIds.current.push(id)

    try {
      if (isLiked) {
        await deleteLike({id}).unwrap()
      } else {
        await createLike({id}).unwrap()
      }
    } catch (error) {
      console.error(error)
    } finally {
      prosessingIds.current = prosessingIds.current.filter(
        processingId => processingId !== id,
      )
    }
  }

  return {toggleLike}
}
