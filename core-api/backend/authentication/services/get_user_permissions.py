from typing import Dict

from django.contrib.auth import get_user_model

User = get_user_model()


def get_dict_of_user_permissions(user: User) -> Dict[str, dict]:
    """
    Get a permission dictionary from a user permission set,
    broken down by application and model
    Ex.: {'dispatch': {'loadlineitemtype': ['add', 'delete']}}
    """
    permissions = {}
    for permission in user.get_all_permissions():
        # parse permission string, ex.: 'dispatch.add_loadlineitemtype'
        app_name = permission.split(".")[0]
        permission_model = permission.split(".")[1]
        perm = permission_model.split("_")[0]
        model = permission_model.split("_")[1]

        if app_name in permissions:
            if model in permissions[app_name]:
                permissions[app_name][model].append(perm)
            else:
                permissions[app_name][model] = [perm]
        else:
            permissions[app_name] = {model: [perm]}

    return permissions
