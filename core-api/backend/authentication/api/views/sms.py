from rest_framework import permissions, status, views
from rest_framework.response import Response

from services.smsc_api import SMSC


class SMSCodeView(views.APIView):
    def __init__(self):
        super().__init__()
        self.smsc = SMSC()

    def get_permissions(self):
        return [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        code = request.data.get("code")
        if user.phone_verify_code == code:
            user.is_phone_verified = True
            user.is_active = True
            user.save()
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(
                status=status.HTTP_400_BAD_REQUEST, data={"error": "Incorrect code"}
            )

    def post(self, request):
        phone = request.data.get("phone")
        response = self.smsc.send_sms(phone, "code", format=9)
        if len(response > 2):
            user = request.user
            user.phone_verify_code = response[-1]
            user.save()
        else:
            return Response(
                status=status.HTTP_400_BAD_REQUEST, data={"error": response[-1]}
            )
