import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'badminton_backend.settings')
django.setup()
from api.models import Player
try:
    Player.objects.create(name='p1', email='p@m.com', phone='1', level='l', wins=1, losses=2, points=3, status='s', avatar='a', joinDate='2023-01-01', matchesPlayed=10)
    print("Success")
except Exception as e:
    import traceback
    traceback.print_exc()
