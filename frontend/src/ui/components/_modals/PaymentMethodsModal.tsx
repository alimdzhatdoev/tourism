import {FC} from 'react'
import {User} from '@/core/models'
import {ModalContent, ModalContentProps} from '../Modal'

interface PaymentMethodsModalProps extends ModalContentProps {
  userId?: User['id']
}

export const PaymentMethodsModal: FC<PaymentMethodsModalProps> = ({
  onClose,
  userId,
  ...props
}) => {
  if (!userId) return null

  return <ModalContent onClose={onClose} {...props}></ModalContent>
}
