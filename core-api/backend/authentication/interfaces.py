from logging import getLogger

from services.redsms import RedSMSClient

logger = getLogger(__name__)


def send_message(*, text: str, to: str):
    client = RedSMSClient()
    client.send_sms(text=text, to=to)
