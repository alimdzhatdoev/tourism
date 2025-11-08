def is_visitor_number_correct(request_method, visitors, excursion_time, instance):
    if request_method == "POST" and visitors > excursion_time.get_available_places():
        return False

    elif request_method in ("PUT", "PATCH"):
        if instance.excursion_time.id == excursion_time.id:
            if visitors > (excursion_time.get_available_places() + instance.visitors):
                return False
        else:
            if visitors > excursion_time.get_available_places():
                return False

    return True
