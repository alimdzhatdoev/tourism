import {FC, useState} from 'react'
import {Rating} from '../Rating/Rating'
import {Attraction, Route} from '@/core/models'
import {Button, TextField, Typography} from '@mui/material'
import {useCreateAttractionReviewMutation} from '@/core/store/attraction_reviews'
import {useCreateRouteReviewMutation} from '@/core/store/route_reviews'
import {ModalContent, ModalContentProps} from '../Modal'
import {APP_FONTS} from '@/ui/themes/baseTheme'

export interface ReviewModalProps extends ModalContentProps {
  rating?: number
  entityId: Attraction['id'] | Route['id']
  entityType: 'attraction' | 'route'
  entityName: string
  onAdd?: () => void
}

type Data = {
  rating: number
  comment: string
}

export const ReviewModal: FC<ReviewModalProps> = ({
  rating,
  entityId,
  entityType,
  entityName,
  onAdd,
  onClose,
  ...props
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [data, setData] = useState<Data>({rating: rating ?? 0, comment: ''})

  const [createAttractionReview] = useCreateAttractionReviewMutation()
  const [createRouteReview] = useCreateRouteReviewMutation()

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)

      if (entityType === 'attraction') {
        await createAttractionReview({
          star_rate: data.rating ?? rating,
          text: data.comment,
          attraction: entityId,
        }).unwrap()
      } else {
        await createRouteReview({
          star_rate: data.rating ?? rating,
          text: data.comment,
          route: entityId,
        }).unwrap()
      }
      onAdd?.()
      onClose?.()
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <ModalContent
      title='Оставить отзыв'
      maxWidth={678}
      onClose={onClose}
      {...props}
    >
      <Typography
        sx={t => ({
          fontWeight: 700,
          textTransform: 'uppercase',
          fontFamily: APP_FONTS.oswald,
          fontSize: '32px',
          marginBottom: '20px',
          [t.breakpoints.down('lg')]: {
            fontSize: '24px',
          },
        })}
      >
        {entityName}
      </Typography>

      <Rating
        rating={rating}
        onChange={v => setData(p => ({...p, rating: v}))}
        addMode
        wasSet
      />

      <TextField
        label='Комментарий'
        placeholder='Поделитесь своим мнением'
        value={data.comment}
        onChange={e => setData(p => ({...p, comment: e.target.value}))}
        multiline
        fullWidth
      />

      <Button
        disabled={isSubmitting}
        onClick={handleSubmit}
        sx={t => ({
          marginTop: '30px',
          [t.breakpoints.down('lg')]: {width: '100%'},
        })}
        variant='outlined'
      >
        {isSubmitting ? 'Отправляем...' : 'Отправить'}
      </Button>
    </ModalContent>
  )
}
