"""
WSGI config for badminton_backend project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/howto/deployment/wsgi/
"""

import os
import sys
import django.utils

# Compatibility patch for djongo
try:
    from django.utils import six
except ImportError:
    try:
        import six
        django.utils.six = six
        sys.modules['django.utils.six'] = six
    except ImportError:
        pass

from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "badminton_backend.settings")

application = get_wsgi_application()
