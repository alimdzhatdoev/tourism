import random
import string


def get_random_password():
    characters = string.ascii_letters + string.digits
    return "".join(random.choice(characters) for i in range(9))
