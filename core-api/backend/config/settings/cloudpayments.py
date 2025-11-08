import os

from cloudpayments.errors import CloudPaymentsError

from services.cloudpayments import CustomCloudPayments


if os.getenv("CLOUDPAYMENTS_PUBLIC_ID") and os.getenv("CLOUDPAYMENTS_API_SECRET_KEY"):
    client = CustomCloudPayments(
        public_id=os.getenv("CLOUDPAYMENTS_PUBLIC_ID"),
        api_secret=os.getenv("CLOUDPAYMENTS_API_SECRET_KEY")
    )
else:
    class Client:
        def __getattribute__(self, name):
            raise CloudPaymentsError(None, message="No Cloudpayments credentials")

    client: CustomCloudPayments = Client()
