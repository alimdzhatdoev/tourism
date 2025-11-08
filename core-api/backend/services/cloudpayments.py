from cloudpayments import CloudPayments
from cloudpayments.errors import CloudPaymentsError, PaymentError
from cloudpayments.models import Transaction, Secure3d


class Payer:
    def __init__(self, phone, **kwargs):
        self.data = {
            "Phone": phone
        }


class CustomCloudPayments(CloudPayments):
    def charge_card(self, cryptogram, amount, currency, ip_address, name=None,
                    invoice_id=None, description=None, account_id=None,
                    email=None, data=None, require_confirmation=False,
                    service_fee=None, payer=None):
        params = {
            'Amount': amount,
            'Currency': currency,
            'IpAddress': ip_address,
            'CardCryptogramPacket': cryptogram,
        }
        if name is not None:
            params['Name'] = name
        if invoice_id is not None:
            params['InvoiceId'] = invoice_id
        if description is not None:
            params['Description'] = description
        if account_id is not None:
            params['AccountId'] = account_id
        if email is not None:
            params['Email'] = email
        if service_fee is not None:
            params['PayerServiceFee'] = service_fee
        if payer is not None:
            params['Payer'] = Payer(**payer).data
        if data is not None:
            params['JsonData'] = data

        endpoint = ('payments/cards/auth' if require_confirmation else
                    'payments/cards/charge')
        response = self._send_request(endpoint, params)

        if response['Success']:
            return Transaction.from_dict(response['Model'])
        if response['Message']:
            raise CloudPaymentsError(response)
        if 'ReasonCode' in response['Model']:
            raise PaymentError(response)
        return Secure3d.from_dict(response['Model'])
