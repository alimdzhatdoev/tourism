from django.http import HttpRequest, HttpResponseRedirect


def get_http_refresh_response(request: HttpRequest) -> HttpResponseRedirect:
    """Get redirect for refreshing the page
    I.e. same page with same query parameters
    """
    return HttpResponseRedirect(
        request.META["PATH_INFO"] + "?" + request.META["QUERY_STRING"]
    )
