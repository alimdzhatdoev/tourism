import {useRef} from 'react'
import {
  useCreateRouteLikeMutation,
  useDeleteRouteLikeMutation,
} from '../store/routes'
import {Route} from '../models'

export const useRouteLike = () => {
  const prosessingIds = useRef<Array<number>>([])

  const [createLike] = useCreateRouteLikeMutation()
  const [deleteLike] = useDeleteRouteLikeMutation()

  const toggleLike = async ({
    id,
    isLiked,
  }: {
    id: Route['id']
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
