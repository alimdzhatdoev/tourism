from typing import Any, Dict, Tuple


def str2bool(v: str) -> bool:
    if v.lower() in ("yes", "true", "t", "1"):
        return True
    elif v.lower() in ("no", "false", "f", "0"):
        return False
    raise ValueError("Unexpected boolean string")


def diff_dicts(a: Dict, b: Dict, missing: Any = None) -> Dict[str, Tuple[Any, Any]]:
    """
    Find keys and values which differ from `a` to `b` as a dict.

    If a value differs from `a` to `b` then the value in the returned dict will
    be: `(a_value, b_value)`. If either is missing then the token from
    `missing` will be used instead.

    :param a: The from dict
    :param b: The to dict
    :param missing: A token used to indicate the dict did not include this key
    :return: A dict of keys to tuples with the matching value from a and b
    """
    return {
        key: (a.get(key, missing), b.get(key, missing))
        for key in dict(set(a.items()) ^ set(b.items())).keys()
    }
