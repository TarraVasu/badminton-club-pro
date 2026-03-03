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
# djongo doesn't support NOT filters well — delete non-superusers one by one
for u in User.objects.all():
    if not u.is_superuser:
        u.delete()

# ==============================================================
# DEMO USER — logs in as demo / demo123
# Sees a rich, pre-filled dataset for showcasing the app
# ==============================================================
print("Creating Demo User...")
demo_user, _ = User.objects.get_or_create(username='demo', email='demo@badminton.com')
demo_user.set_password('demo123')
demo_user.first_name = 'Demo'
demo_user.last_name = 'User'
demo_user.save()

DEMO_NAMES = [
    "Arjun Sharma", "Priya Menon", "Ravi Kumar", "Sneha Patel",
    "Anil Verma", "Divya Nair", "Karthik Raj", "Meera Iyer",
    "Suresh Babu", "Lakshmi Das", "Vijay Singh", "Ananya Reddy",
    "Demo User", "Rohit Joshi", "Kavya Pillai",
]

demo_players_cache = []

# Create demo player linked to the demo user
demo_self_player = Player.objects.create(
    user=demo_user,
    name='Demo User',
    email='demo@badminton.com',
    phone='+91 9000000001',
    level='Advanced',
    wins=45,
    losses=12,
    points=3800,
    status='Active',
    avatar='DU',
    joinDate='2023-01-15',
    matchesPlayed=57,
    jerseyNumber='99',
)
demo_players_cache.append(demo_self_player)

# Other demo players — each needs a User because MongoDB enforces unique on user_id
demo_other_names = [n for n in DEMO_NAMES if n != 'Demo User']
demo_levels = ['Beginner', 'Intermediate', 'Advanced']
for i, name in enumerate(demo_other_names):
    first = name.split()[0][0] + name.split()[1][0]
    slug = name.lower().replace(' ', '')
    demo_sub_user, created = User.objects.get_or_create(
        username=f'demoplayer{i+1}',
        email=f'{slug}@demo.com'
    )
    if created:
        demo_sub_user.set_password('demo123')
        demo_sub_user.save()
    player = Player.objects.create(
        user=demo_sub_user,
        name=name,
        email=f"{slug}@demo.com",
        phone=f"+91 9876{str(i+1).zfill(6)}",
        level=random.choice(demo_levels),
        wins=random.randint(10, 60),
        losses=random.randint(5, 40),
        points=random.randint(800, 4500),
        status=random.choice(['Active', 'Active', 'Active', 'Inactive']),
        avatar=first,
        joinDate=f"2023-{random.randint(1, 12):02d}-{random.randint(1, 28):02d}",
        matchesPlayed=random.randint(15, 100),
        jerseyNumber=str(random.randint(1, 50)),
    )
    demo_players_cache.append(player)

print(f"  → Created {len(demo_players_cache)} demo players")

# Demo Matches (is_demo=True)
print("Creating Demo Matches...")
DEMO_COURTS = ['Court A', 'Court B', 'Court C', 'Court D']
demo_match_data = [
    ("Arjun Sharma", "Ravi Kumar", 21, 15, "Completed", "Arjun Sharma", "38 min"),
    ("Priya Menon", "Sneha Patel", 21, 18, "Completed", "Priya Menon", "45 min"),
    ("Demo User", "Karthik Raj", 21, 10, "Completed", "Demo User", "30 min"),
    ("Anil Verma", "Vijay Singh", 19, 21, "Completed", "Vijay Singh", "52 min"),
    ("Meera Iyer", "Ananya Reddy", 21, 14, "Completed", "Meera Iyer", "41 min"),
    ("Demo User", "Rohit Joshi", 0, 0, "Scheduled", "-", "-"),
    ("Arjun Sharma", "Demo User", 0, 0, "Live", "-", "Ongoing"),
    ("Lakshmi Das", "Kavya Pillai", 21, 16, "Completed", "Lakshmi Das", "35 min"),
    ("Suresh Babu", "Divya Nair", 17, 21, "Completed", "Divya Nair", "49 min"),
    ("Karthik Raj", "Priya Menon", 0, 0, "Scheduled", "-", "-"),
]
for i, (p1, p2, s1, s2, st, winner, dur) in enumerate(demo_match_data):
    Match.objects.create(
        player1=p1, player2=p2,
        score1=s1, score2=s2,
        date=f"2024-0{random.randint(1,3)}-{random.randint(1,28):02d}",
        court=random.choice(DEMO_COURTS),
        type=random.choice(['Singles', 'Doubles']),
        status=st, winner=winner, duration=dur,
        is_demo=True,
    )
print(f"  → Created {len(demo_match_data)} demo matches")

# Demo Sessions (is_demo=True)
print("Creating Demo Sessions...")
demo_session_data = [
    ("Morning Drills", "06:00", "Court A", "Coach Rajan", 8, 12, "Training", "Upcoming", 400),
    ("Footwork Fundamentals", "08:00", "Court B", "Coach Priya", 10, 10, "Workshop", "Full", 500),
    ("Beginner Bootcamp", "10:00", "Court C", "Coach Anil", 6, 12, "Training", "Ongoing", 300),
    ("Advanced Smash Clinic", "16:00", "Court A", "Coach Rajan", 4, 8, "Practice", "Upcoming", 600),
    ("Tournament Prep", "18:00", "Court D", "Coach Suresh", 12, 16, "Tournament", "Upcoming", 500),
    ("Weekend Rally", "07:00", "Court B", "Coach Priya", 14, 16, "Practice", "Completed", 400),
    ("Junior Training", "09:00", "Court C", "Coach Anil", 8, 12, "Training", "Completed", 300),
    ("Mixed Doubles Clinic", "17:00", "Court A", "Coach Rajan", 8, 8, "Practice", "Full", 450),
    ("Evening Practice", "19:00", "Court D", "Coach Suresh", 3, 12, "Practice", "Upcoming", 350),
    ("Championship Warmup", "15:00", "Court B", "Coach Priya", 16, 16, "Tournament", "Ongoing", 600),
]
for title, time, court, coach, players, maxp, typ, st, fee in demo_session_data:
    Session.objects.create(
        title=title,
        date=f"2024-0{random.randint(1,3)}-{random.randint(1,28):02d}",
        time=time, court=court, coach=coach,
        players=players, maxPlayers=maxp,
        type=typ, status=st, fee=fee,
        is_demo=True,
    )
print(f"  → Created {len(demo_session_data)} demo sessions")

# Demo Payments (is_demo=True)
print("Creating Demo Payments...")
demo_payment_data = [
    ("Demo User", 1500, "Monthly Fee", "Paid", "UPI", "TXN001001"),
    ("Arjun Sharma", 500, "Session Fee", "Paid", "Card", "TXN001002"),
    ("Priya Menon", 2500, "Tournament Fee", "Paid", "Bank Transfer", "TXN001003"),
    ("Demo User", 600, "Session Fee", "Paid", "UPI", "TXN001004"),
    ("Ravi Kumar", 1500, "Monthly Fee", "Pending", "-", None),
    ("Sneha Patel", 3500, "Registration Fee", "Paid", "Card", "TXN001005"),
    ("Demo User", 1500, "Monthly Fee", "Paid", "UPI", "TXN001006"),
    ("Karthik Raj", 500, "Session Fee", "Overdue", "-", None),
    ("Meera Iyer", 2500, "Tournament Fee", "Paid", "Cash", "TXN001007"),
    ("Vijay Singh", 1500, "Monthly Fee", "Pending", "-", None),
]
for player, amount, typ, st, method, ref in demo_payment_data:
    Payment.objects.create(
        player=player, amount=amount, type=typ,
        date=f"2024-0{random.randint(1,3)}-{random.randint(1,28):02d}",
        status=st, method=method, reference=ref,
        is_demo=True,
    )
print(f"  → Created {len(demo_payment_data)} demo payments")


# ==============================================================
# REAL DATA — for actual users (is_demo=False by default)
# ==============================================================
print("\nCreating Real Players (player1–player5)...")
real_players_cache = []
real_names = [
    ("Neeraj Chopra", "NC"), ("Saina Nehwal", "SN"),
    ("PV Sindhu", "PS"), ("Kidambi Srikanth", "KS"), ("HS Prannoy", "HP"),
]
for i, (name, avatar) in enumerate(real_names, start=1):
    username = f"player{i}"
    user, created = User.objects.get_or_create(username=username, email=f"{username}@mail.com")
    if created:
        user.set_password("password123")
        user.save()
    player = Player.objects.create(
        user=user,
        name=name,
        email=user.email,
        phone=f"+91 9500{str(i).zfill(6)}",
        level=random.choice(['Intermediate', 'Advanced']),
        wins=random.randint(5, 30),
        losses=random.randint(3, 20),
        points=random.randint(500, 2000),
        status='Active',
        avatar=avatar,
        joinDate=f"2024-{random.randint(1, 6):02d}-{random.randint(1, 28):02d}",
        matchesPlayed=random.randint(8, 50),
    )
    real_players_cache.append(player)

print(f"  → Created {len(real_players_cache)} real players")

# Real Matches (is_demo=False — default)
print("Creating Real Matches...")
for i in range(8):
    p1 = random.choice(real_players_cache).name
    p2 = random.choice(real_players_cache).name
    while p1 == p2:
        p2 = random.choice(real_players_cache).name
    score1 = random.randint(0, 21)
    score2 = random.randint(0, 21) if score1 == 21 else 21
    st = random.choice(['Completed', 'Completed', 'Scheduled'])
    if st == 'Scheduled':
        score1, score2, winner, dur = 0, 0, '-', '-'
    else:
        winner = p1 if score1 > score2 else p2
        dur = f"{random.randint(20, 60)} min"
    Match.objects.create(
        player1=p1, player2=p2, score1=score1, score2=score2,
        date=f"2024-{random.randint(4,6):02d}-{random.randint(1,28):02d}",
        court=random.choice(DEMO_COURTS),
        type=random.choice(['Singles', 'Doubles']),
        status=st, winner=winner, duration=dur,
        is_demo=False,
    )
print("  → Created 8 real matches")

# Real Sessions (is_demo=False)
print("Creating Real Sessions...")
for i in range(6):
    Session.objects.create(
        title=f"Club Session {i+1}",
        date=f"2024-{random.randint(4,6):02d}-{random.randint(1,28):02d}",
        time=f"{random.randint(6, 20):02d}:00",
        court=random.choice(DEMO_COURTS),
        coach=random.choice(["Coach Rajan", "Coach Priya", "Coach Anil"]),
        players=random.randint(2, 10), maxPlayers=12,
        type=random.choice(['Training', 'Practice', 'Tournament']),
        status=random.choice(['Upcoming', 'Completed']),
        fee=random.choice([300, 400, 500]),
        is_demo=False,
    )
print("  → Created 6 real sessions")

# Real Payments (is_demo=False)
print("Creating Real Payments...")
for i, p in enumerate(real_players_cache):
    Payment.objects.create(
        player=p.name,
        amount=random.choice([500, 1500, 2500]),
        type=random.choice(['Monthly Fee', 'Session Fee']),
        date=f"2024-{random.randint(4,6):02d}-{random.randint(1,28):02d}",
        status=random.choice(['Paid', 'Paid', 'Pending']),
        method=random.choice(['UPI', 'Card', 'Cash']),
        reference=f"TXN00{i+2000}",
        is_demo=False,
    )
print(f"  → Created {len(real_players_cache)} real payments")


# ==============================================================
# ADMIN USER — sees everything
# ==============================================================
print("\nCreating Admin User...")
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
        wins=100, losses=10, points=5000,
        status='Active', avatar='AU',
        joinDate='2022-01-01', matchesPlayed=110,
    )
except Exception:
    pass

print("\n✅ Seed complete!")
print("━" * 40)
print("👤 demo   / demo123   → sees demo data")
print("👤 admin  / admin123  → sees ALL data")
print("👤 player1 / password123  → sees real data")
print("━" * 40)
