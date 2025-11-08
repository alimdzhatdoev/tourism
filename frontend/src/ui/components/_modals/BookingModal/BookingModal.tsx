import {FC, useEffect, useRef, useState} from 'react'
import {Excursion, ExcursionTime, Payment} from '@/core/models'
import {SwipeableList} from '../../_common'
import {
  Box,
  Button,
  Divider,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material'
import {formatMoney, handleError} from '@/core/utils'
import {Nullable} from 'types-helpers'
import dayjs, {Dayjs} from 'dayjs'
import {DateCalendar, LocalizationProvider} from '@mui/x-date-pickers'
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs'
import {useGetExcursionQuery} from '@/core/store/excursions'
import {Mousewheel} from 'swiper/modules'
import {styles as s} from './BookingModal.styles'
import {useBreakpointValues} from '@/core/hooks'
import {SwiperProps} from 'swiper/react'
import {PaymentKind, RU_PAYMENT_KINDS} from '@/core/models/ExcursionBooking'
import {
  CountControl,
  CreditCard,
  CreditCardData,
  CreditCardRef,
  ModalContent,
  ModalContentProps,
} from '../..'
import {useCreateExcursionBookingMutation} from '@/core/store/excursion_bookings'
import {useCreatePaymentMutation} from '@/core/store/payments'
import {useSelector} from 'react-redux'
import {miscStateSelector} from '@/core/store/misc'
import {BookingTile} from '../../_tiles'
import {useNavigate} from 'react-router-dom'

/**
 *  Cloudpayments api
 */
declare const cp: any
const publicKey = 'pk_d9c416d28b2516c46652c49e670e5'
interface BookingData {
  comment: string
  date: Nullable<Dayjs>
  excursionTime: Nullable<ExcursionTime>
  visitors: number
  paymentKind: PaymentKind
  cardDetails: CreditCardData | null
}

const INITIAL_BOOKING_DATA: BookingData = {
  comment: '',
  visitors: 1,
  date: null,
  excursionTime: null,
  paymentKind: 'CARD',
  cardDetails: null,
}

const MOBILE_SWIPER_PROPS: SwiperProps = {
  slidesPerView: 4,
  spaceBetween: '8px',
}

const DESKTOP_SWIPER_PROPS: SwiperProps = {
  slidesPerView: 7,
  spaceBetween: '8px',
  direction: 'vertical',
  mousewheel: true,
  modules: [Mousewheel],
}

export interface BookingModalProps extends ModalContentProps {
  excursionId?: Excursion['id']
  name: string
  imageSrc: string
  type: string
}

export const BookingModal: FC<BookingModalProps> = ({
  children,
  excursionId,
  imageSrc,
  name,
  type,
  onClose,
  ...props
}) => {
  const [isValid, setIsValid] = useState<boolean>(true)
  const [data, setData] = useState<BookingData>(INITIAL_BOOKING_DATA)
  const wasSubmittedOnce = useRef<boolean>(false)
  const creditCardRef = useRef<CreditCardRef>(null)

  const navigate = useNavigate()

  const {user} = useSelector(miscStateSelector)

  const [createExcursionBooking, excursionBookingApi] =
    useCreateExcursionBookingMutation()
  const [createPayment, paymentApi] = useCreatePaymentMutation()
  const {data: excursionData} = useGetExcursionQuery(
    {
      id: excursionId!,
      expand: {
        schedule_dates__times: true,
      },
    },
    {
      skip: !excursionId,
    },
  )

  const {value: swiperProps} = useBreakpointValues<SwiperProps>(
    MOBILE_SWIPER_PROPS,
    {
      lg: DESKTOP_SWIPER_PROPS,
      xl: DESKTOP_SWIPER_PROPS,
    },
  )

  const isLoading = [
    excursionBookingApi.isLoading,
    paymentApi.isLoading,
  ].includes(true)

  const excursion = excursionData?.data
  const dates = excursion?.scheduleDates ?? []
  const times = dates.find(d => dayjs(d.date).isSame(data.date))?.times ?? []

  const validate = ({paymentKind, cardDetails, excursionTime}: typeof data) => {
    let isDataValid: boolean = true

    if (wasSubmittedOnce.current) {
      if (paymentKind === 'CARD' && creditCardRef.current) {
        isDataValid = creditCardRef.current.validate(cardDetails)
      }

      if (!excursionTime) {
        isDataValid = false
      }

      if (paymentKind === 'CARD' && !cardDetails) {
        isDataValid = false
      }
    }

    setIsValid(isDataValid)

    return isDataValid
  }

  const setBookingData =
    <T extends keyof BookingData>(field: T) =>
    (value: BookingData[T]) => {
      let newData = {...data, [field]: value}
      if (field === 'paymentKind' && value === 'CASH') {
        newData.cardDetails = null
      }
      if (field === 'excursionTime') {
        newData.visitors = INITIAL_BOOKING_DATA.visitors
      }
      if (field === 'date') {
        newData.excursionTime = null
        newData.visitors = INITIAL_BOOKING_DATA.visitors
      }
      validate(newData)
      setData(newData)
    }

  const handleClick = async () => {
    wasSubmittedOnce.current = true

    const allValid = validate(data)

    if (!allValid) return

    if (data.paymentKind === 'CARD') {
      const checkout = new cp.Checkout(publicKey)
      const [expDateMonth, expDateYear] = data.cardDetails!.term.split('/')

      let cryptogram: Nullable<string> = null

      try {
        cryptogram = (await checkout.createPaymentCryptogram({
          cardNumber: data.cardDetails!.number,
          cvv: data.cardDetails!.cvv,
          expDateMonth,
          expDateYear,
        })) as string
      } catch (error) {
        handleError(error)
        return
      }

      let payment: Nullable<Payment> = null

      try {
        const response = await createPayment({
          cryptogram,
          amount: data.excursionTime!.price * data.visitors,
          email: user!.email,
          description: name,
        }).unwrap()
        payment = response.data
      } catch (error) {
        handleError(error)
        return
      }

      if (payment.needs3DS) {
        // console.log(payment)
      }
    }

    try {
      await createExcursionBooking({
        comment: data.comment,
        visitors: data.visitors,
        excursion_time: data.excursionTime?.id!,
        payment_kind: data.paymentKind,
      }).unwrap()

      navigate('/profile/bookings')
      onClose?.()
    } catch (error) {
      handleError(error)
    }
  }

  useEffect(() => {
    // if (!user) authorizationModal.open({onDismiss: close})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!excursionId) return null

  return (
    <ModalContent onClose={onClose} title='Бронирование' {...props}>
      <BookingTile
        name={name}
        hint={type}
        imageSrc={imageSrc}
        sx={{marginTop: '20px'}}
      />

      <Box sx={s.blockRoot}>
        <Box sx={s.blockTitle}>
          <Typography sx={s.blockText}>
            {data.excursionTime
              ? 'Выбранная дата и время'
              : 'Выбрать дату и время'}
          </Typography>
        </Box>

        <Box sx={s.dateTimeContainer}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              disablePast
              value={data.date}
              sx={s.calendar}
              onChange={setBookingData('date')}
              views={['month', 'day']}
              shouldDisableDate={date =>
                dates.findIndex(v => date.isSame(dayjs(v.date))) < 0
              }
            />
          </LocalizationProvider>
          <SwipeableList
            items={times}
            sx={s.timesList}
            fallback={<Box sx={s.timesList} />}
            slotProps={{swiper: swiperProps}}
            keyExtractor={time => time.id}
            renderItem={time => (
              <Button
                variant='contained'
                onClick={() => setBookingData('excursionTime')(time)}
                sx={[
                  s.timeButton,
                  data.excursionTime &&
                    data.excursionTime.id !== time.id &&
                    s.timeButtonNotSelected,
                ]}
              >
                {time.time.slice(0, 5)}
              </Button>
            )}
          />
        </Box>
      </Box>

      <Box sx={s.blockRoot}>
        <Box sx={s.blockTitle}>
          <Typography sx={s.blockText}>Количество человек</Typography>
          <CountControl
            onChange={setBookingData('visitors')}
            initialValue={INITIAL_BOOKING_DATA.visitors}
            limits={[1, data.excursionTime?.maxVisitors]}
            disabled={!data.excursionTime}
          />
        </Box>
        <Typography sx={s.visitorsConut}>
          {data.excursionTime
            ? `${data.excursionTime.maxVisitors} максимум`
            : 'Выберите дату и время'}
        </Typography>
      </Box>

      <Box sx={s.blockRoot}>
        <Box sx={s.blockTitle}>
          <Typography sx={s.blockText}>Способ оплаты</Typography>
        </Box>
        <RadioGroup
          sx={{flexDirection: 'row'}}
          value={data.paymentKind}
          onChange={(_e, v) => setBookingData('paymentKind')(v as PaymentKind)}
        >
          {Object.entries(RU_PAYMENT_KINDS).map(([value, ruName]) => (
            <FormControlLabel
              key={value}
              value={value}
              control={<Radio />}
              label={ruName}
            />
          ))}
        </RadioGroup>
        {data.paymentKind === 'CARD' ? (
          <CreditCard
            ref={creditCardRef}
            onChange={setBookingData('cardDetails')}
          />
        ) : null}
      </Box>

      {data.excursionTime ? (
        <Box sx={s.blockRoot}>
          <Box sx={s.blockTextWrapper}>
            <Typography sx={s.blockText}>Количество человек</Typography>
            <Typography sx={s.blockText}>{data.visitors}</Typography>
          </Box>
          <Divider />
          <Box sx={s.blockTitle}>
            <Typography sx={s.blockText}>Итого</Typography>
            <Typography sx={s.blockText}>
              {formatMoney(data.visitors * data.excursionTime.price)}
            </Typography>
          </Box>
        </Box>
      ) : null}

      <Button
        variant='outlined'
        disabled={!isValid || isLoading}
        onClick={handleClick}
        sx={s.payButton}
      >
        {isLoading ? 'Ожидайте...' : 'Оплатить'}
      </Button>

      {children}
    </ModalContent>
  )
}
