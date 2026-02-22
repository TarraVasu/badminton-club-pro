from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
from django.db.models import Q

UserModel = get_user_model()

class EmailBackend(ModelBackend):
    """
    Custom authentication backend that allows users to log in using their email address.
    """
    def authenticate(self, request, username=None, password=None, **kwargs):
        if username is None:
            username = kwargs.get(UserModel.USERNAME_FIELD)
        
        try:
            # Check if the 'username' provided is actually an email or the username
            user = UserModel.objects.filter(Q(username__iexact=username) | Q(email__iexact=username)).distinct()
            if user.exists():
                user_obj = user.first()
                if user_obj.check_password(password):
                    return user_obj
        except Exception:
            return None
        return None
