from .. import services


class CustomerApp:
    @staticmethod
    def get_all():
        return services.customers.get_all_customers()

    @staticmethod
    def get_or_create(*, phone: str):
        return services.customers.get_or_create_customer(phone=phone)


class VerificationCodeApp:
    @staticmethod
    def request(*, request_id: str):
        if services.verification.is_test_user_phone(phone=request_id):
            code = services.verification.get_new_verification_code(
                request_id=request_id
            )
            code.value = "1234"  # Это ни на что не влияет, т.к. код не сохраняется
            return code

        return services.verification.request_verification_code(request_id=request_id)

    @staticmethod
    def verify(*, request_id: str, value: str):
        if services.verification.is_test_user_phone(phone=request_id):
            if value != "1234":
                raise services.verification.exceptions.VerificationCodeInvalid
            return True

        return services.verification.verify_verification_code(
            request_id=request_id, value=value
        )
