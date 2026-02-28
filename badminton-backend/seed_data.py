import requests
import json
import datetime
import random

BASE_URL = "http://127.0.0.1:8000/api/"

players = [
    { "name": f"Player {i}", "email": f"player{i}@mail.com", "phone": f"+91 9876543{str(i).zfill(3)}", "level": random.choice(['Beginner', 'Intermediate', 'Advanced']), "wins": random.randint(5, 50), "losses": random.randint(5, 50), "points": random.randint(500, 3000), "status": random.choice(['Active', 'Active', 'Active', 'Inactive']), "avatar": f"P{i}", "joinDate": f"2023-{random.randint(1, 12):02d}-{random.randint(1, 28):02d}", "matchesPlayed": random.randint(10, 100) } for i in range(1, 21)
]

# Ensure at least one admin so they can login.
players.append({ "name": 'Admin User', "email": 'admin@mail.com', "phone": '+91 9999999999', "level": 'Advanced', "wins": 100, "losses": 10, "points": 5000, "status": 'Active', "avatar": 'AU', "joinDate": '2022-01-01', "matchesPlayed": 110 })

matches = []
for i in range(1, 21):
    p1 = random.choice(players)['name']
    p2 = random.choice(players)['name']
    while p1 == p2:
        p2 = random.choice(players)['name']
    
    score1 = random.randint(0, 21)
    score2 = random.randint(0, 21) if score1 == 21 else 21
    status = random.choice(['Completed', 'Completed', 'Completed', 'Scheduled', 'Live'])
    if status in ['Scheduled', 'Live']:
        score1, score2, winner = 0, 0, '-'
        duration = '-' if status == 'Scheduled' else 'Ongoing'
    else:
        winner = p1 if score1 > score2 else p2
        duration = f"{random.randint(20, 60)} min"

    matches.append({
        "player1": p1, "player2": p2, "score1": score1, "score2": score2, 
        "date": f"2024-02-{random.randint(1, 28):02d}", "court": f"Court {random.choice(['A', 'B', 'C', 'D'])}", 
        "type": random.choice(['Singles', 'Doubles']), "status": status, "winner": winner, "duration": duration
    })

sessions = [
    { "title": f"Session {i}", "date": f"2024-02-{random.randint(1, 28):02d}", "time": f"{random.randint(6, 20):02d}:00", "court": f"Court {random.choice(['A', 'B', 'C', 'D'])}", "coach": f"Coach {random.choice(['Rajan', 'Priya', 'Anil', 'Suresh'])}", "players": random.randint(2, 12), "maxPlayers": 12, "type": random.choice(['Training', 'Practice', 'Tournament', 'Workshop']), "status": random.choice(['Upcoming', 'Ongoing', 'Completed', 'Full']), "fee": random.choice([300, 400, 500, 600]) } for i in range(1, 21)
]

payments = [
    { "player": random.choice(players)['name'], "amount": random.choice([500, 1500, 2500, 3500]), "type": random.choice(['Monthly Fee', 'Tournament Fee', 'Session Fee', 'Registration Fee']), "date": f"2024-02-{random.randint(1, 28):02d}", "status": random.choice(['Paid', 'Paid', 'Pending', 'Overdue']), "method": random.choice(['UPI', 'Card', 'Cash', 'Bank Transfer', '-']), "reference": f"TXN00{i+1000}" } for i in range(1, 21)
]


def load_data(endpoint, data_list):
    print(f"Loading {endpoint} ({len(data_list)} items)...")
    url = f"{BASE_URL}{endpoint}/"
    for item in data_list:
        try:
            response = requests.post(url, json=item)
            if response.status_code == 201:
                pass # print(f"  [OK] Added")
            else:
                print(f"  [FAIL] Failed: {response.text}")
        except Exception as e:
            print(f"  Error: {e}")
    print(f"  [OK] Finished loading {endpoint}")

if __name__ == "__main__":
    load_data("players", players)
    load_data("matches", matches)
    load_data("sessions", sessions)
    load_data("payments", payments)
    print("\nData load complete!")
