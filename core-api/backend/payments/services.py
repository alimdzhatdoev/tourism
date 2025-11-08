from logging import getLogger

from cloudpayments import Secure3d, Transaction

from payments.models import Payment
from config.settings import client

logger = getLogger(__name__)


def get_client_ip(meta: dict) -> str:
    x_forwarded_for = meta.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = meta.get('REMOTE_ADDR')
    return ip


def create_payment(payment: Payment, cryptogram: str, ip_address: str):
    data = dict(
        cryptogram=cryptogram,
        amount=float(payment.amount),
        ip_address=ip_address,
        currency=payment.currency,
        invoice_id=payment.id,
        payer=payment.payer,
        account_id=payment.created_by.id
    )
    if payment.name:
        data.update(name=payment.name.upper())

    result = client.charge_card(**data)

    if isinstance(result, Transaction):
        payment.transaction_id = result.id
        payment.is_success = True
        payment.save()
        return {
            "_acs_url": None,
            "_m_d": None,
            "_pa_req": None,
        }
    elif isinstance(result, Secure3d):
        # 3d_secure required
        payment.transaction_id = result.transaction_id
        payment.save()
        return {
            "_acs_url": result.acs_url,
            "_m_d": result.transaction_id,
            "_pa_req": result.pa_req,
        }


def finish_payment(payment: Payment, transaction_id: int = None, pa_res: str = None):
    result = client.finish_3d_secure_authentication(
        transaction_id=transaction_id, pa_res=pa_res
    )
    payment.is_success = True
    payment.save()
    return result
