import {FC} from 'react'
import {useGetExcursionBookingsListQuery} from '@/core/store/excursion_bookings'
import {BookingTile} from '../_tiles'
import {useSelector} from 'react-redux'
import {miscStateSelector} from '@/core/store/misc'
import {ModalContent, ModalContentProps} from '../Modal'

export interface MyBookingsModalProps extends ModalContentProps {}

export const MyBookingsModal: FC<MyBookingsModalProps> = ({
  children,
  onClose,
  ...props
}) => {
  const {user} = useSelector(miscStateSelector)
  const {data} = useGetExcursionBookingsListQuery(
    {
      filters: {
        created_by_id: user!.id,
      },
      expand: {
        excursion_time__excursion_date__excursion__attraction__photos: true,
      },
    },
    {
      skip: !user?.id,
    },
  )

  const bookings = data?.data.results ?? []

  if (!user?.id) return null

  return (
    <ModalContent onClose={onClose} title='Мои бронирования' {...props}>
      {bookings.map(booking => (
        <BookingTile
          key={booking.id}
          {...booking.bookingTileProps}
          onClick={() => close()}
        />
      ))}
      {children}
    </ModalContent>
  )
}
