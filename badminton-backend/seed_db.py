import os
import django
import random
import datetime

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'badminton_backend.settings')
django.setup()

from api.models import Player, Match, Session, Payment
from django.contrib.auth.models import User

print("Clearing old data...")
Player.objects.all().delete()
Match.objects.all().delete()
Session.objects.all().delete()
Payment.objects.all().delete()

print("Creating Players...")
players_cache = []
for i in range(1, 21):
    username = f"player{i}"
    user, created = User.objects.get_or_create(username=username, email=f"{username}@mail.com")
    if created:
        user.set_password("password123")
        user.save()
    
    player = Player.objects.create(
        user=user,
        name=f"Player {i}",
        email=user.email,
        phone=f"+91 9876543{str(i).zfill(3)}",
        level=random.choice(['Beginner', 'Intermediate', 'Advanced']),
        wins=random.randint(5, 50),
        losses=random.randint(5, 50),
        points=random.randint(500, 3000),
        status=random.choice(['Active', 'Active', 'Active', 'Inactive']),
        avatar=f"P{i}",
        joinDate=f"2023-{random.randint(1, 12):02d}-{random.randint(1, 28):02d}",
        matchesPlayed=random.randint(10, 100)
    )
    players_cache.append(player)

admin_user, _ = User.objects.get_or_create(username="admin", email="admin@mail.com")
admin_user.set_password("admin123")
admin_user.is_superuser = True
admin_user.is_staff = True
admin_user.save()

try:
    Player.objects.create(
        user=admin_user,
        name='Admin User',
        email='admin@mail.com',
        phone='+91 9999999999',
        level='Advanced',
        wins=100,
        losses=10,
        points=5000,
        status='Active',
        avatar='AU',
        joinDate='2022-01-01',
        matchesPlayed=110
    )
except Exception:
    pass

print("Creating Matches...")
for i in range(1, 21):
    p1 = random.choice(players_cache).name
    p2 = random.choice(players_cache).name
    while p1 == p2:
        p2 = random.choice(players_cache).name
    
    score1 = random.randint(0, 21)
    score2 = random.randint(0, 21) if score1 == 21 else 21
    status = random.choice(['Completed', 'Completed', 'Completed', 'Scheduled', 'Live'])
    if status in ['Scheduled', 'Live']:
        score1, score2, winner = 0, 0, '-'
        duration = '-' if status == 'Scheduled' else 'Ongoing'
    else:
        winner = p1 if score1 > score2 else p2
        duration = f"{random.randint(20, 60)} min"

    Match.objects.create(
        player1=p1, player2=p2, score1=score1, score2=score2, 
        date=f"2024-02-{random.randint(1, 28):02d}", court=f"Court {random.choice(['A', 'B', 'C', 'D'])}", 
        type=random.choice(['Singles', 'Doubles']), status=status, winner=winner, duration=duration
    )

print("Creating Sessions...")
for i in range(1, 21):
    Session.objects.create(
        title=f"Session {i}", date=f"2024-02-{random.randint(1, 28):02d}", time=f"{random.randint(6, 20):02d}:00", 
        court=f"Court {random.choice(['A', 'B', 'C', 'D'])}", coach=f"Coach {random.choice(['Rajan', 'Priya', 'Anil', 'Suresh'])}", 
        players=random.randint(2, 12), maxPlayers=12, type=random.choice(['Training', 'Practice', 'Tournament', 'Workshop']), 
        status=random.choice(['Upcoming', 'Ongoing', 'Completed', 'Full']), fee=random.choice([300, 400, 500, 600])
    )

print("Creating Payments...")
for i in range(1, 21):
    Payment.objects.create(
        player=random.choice(players_cache).name, amount=random.choice([500, 1500, 2500, 3500]), 
        type=random.choice(['Monthly Fee', 'Tournament Fee', 'Session Fee', 'Registration Fee']), 
        date=f"2024-02-{random.randint(1, 28):02d}", status=random.choice(['Paid', 'Paid', 'Pending', 'Overdue']), 
        method=random.choice(['UPI', 'Card', 'Cash', 'Bank Transfer', '-']), reference=f"TXN00{i+1000}"
    )

print("\nData load complete!")
