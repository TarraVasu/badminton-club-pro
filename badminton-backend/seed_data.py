import requests
import json
import datetime

BASE_URL = "http://127.0.0.1:8000/api/"

players = [
    { "name": 'Arjun Sharma', "email": 'arjun@mail.com', "phone": '+91 9876543210', "level": 'Advanced', "wins": 48, "losses": 12, "points": 2340, "status": 'Active', "avatar": 'AS', "joinDate": '2023-01-15', "matchesPlayed": 60 },
    { "name": 'Priya Mehta', "email": 'priya@mail.com', "phone": '+91 9876543211', "level": 'Intermediate', "wins": 35, "losses": 18, "points": 1890, "status": 'Active', "avatar": 'PM', "joinDate": '2023-03-20', "matchesPlayed": 53 },
    { "name": 'Rahul Verma', "email": 'rahul@mail.com', "phone": '+91 9876543212', "level": 'Beginner', "wins": 15, "losses": 25, "points": 820, "status": 'Active', "avatar": 'RV', "joinDate": '2023-06-10', "matchesPlayed": 40 },
    { "name": 'Sneha Patel', "email": 'sneha@mail.com', "phone": '+91 9876543213', "level": 'Advanced', "wins": 42, "losses": 15, "points": 2150, "status": 'Active', "avatar": 'SP', "joinDate": '2022-11-05', "matchesPlayed": 57 },
    { "name": 'Kiran Kumar', "email": 'kiran@mail.com', "phone": '+91 9876543214', "level": 'Intermediate', "wins": 28, "losses": 22, "points": 1450, "status": 'Inactive', "avatar": 'KK', "joinDate": '2023-02-28', "matchesPlayed": 50 },
    { "name": 'Deepa Nair', "email": 'deepa@mail.com', "phone": '+91 9876543215', "level": 'Intermediate', "wins": 32, "losses": 16, "points": 1680, "status": 'Active', "avatar": 'DN', "joinDate": '2023-04-12', "matchesPlayed": 48 },
    { "name": 'Vikram Singh', "email": 'vikram@mail.com', "phone": '+91 9876543216', "level": 'Advanced', "wins": 55, "losses": 8, "points": 2780, "status": 'Active', "avatar": 'VS', "joinDate": '2022-09-01', "matchesPlayed": 63 },
    { "name": 'Anita Rao', "email": 'anita@mail.com', "phone": '+91 9876543217', "level": 'Beginner', "wins": 10, "losses": 30, "points": 550, "status": 'Active', "avatar": 'AR', "joinDate": '2023-08-20', "matchesPlayed": 40 }
]

matches = [
    { "player1": 'Arjun Sharma', "player2": 'Vikram Singh', "score1": 21, "score2": 15, "date": '2024-02-18', "court": 'Court A', "type": 'Singles', "status": 'Completed', "winner": 'Arjun Sharma', "duration": '45 min' },
    { "player1": 'Priya Mehta', "player2": 'Sneha Patel', "score1": 18, "score2": 21, "date": '2024-02-18', "court": 'Court B', "type": 'Singles', "status": 'Completed', "winner": 'Sneha Patel', "duration": '38 min' },
    { "player1": 'Rahul Verma', "player2": 'Kiran Kumar', "score1": 21, "score2": 19, "date": '2024-02-19', "court": 'Court A', "type": 'Singles', "status": 'Completed', "winner": 'Rahul Verma', "duration": '52 min' },
    { "player1": 'Arjun Sharma', "player2": 'Sneha Patel', "score1": 0, "score2": 0, "date": '2024-02-21', "court": 'Court C', "type": 'Singles', "status": 'Scheduled', "winner": '-', "duration": '-' },
    { "player1": 'Deepa Nair', "player2": 'Anita Rao', "score1": 21, "score2": 12, "date": '2024-02-17', "court": 'Court B', "type": 'Singles', "status": 'Completed', "winner": 'Deepa Nair', "duration": '30 min' },
    { "player1": 'Vikram Singh', "player2": 'Rahul Verma', "score1": 0, "score2": 0, "date": '2024-02-22', "court": 'Court A', "type": 'Singles', "status": 'Scheduled', "winner": '-', "duration": '-' },
    { "player1": 'Priya Mehta', "player2": 'Deepa Nair', "score1": 21, "score2": 17, "date": '2024-02-16', "court": 'Court C', "type": 'Singles', "status": 'Completed', "winner": 'Priya Mehta', "duration": '42 min' },
    { "player1": 'Kiran Kumar', "player2": 'Anita Rao', "score1": 0, "score2": 0, "date": '2024-02-21', "court": 'Court B', "type": 'Singles', "status": 'Live', "winner": '-', "duration": 'Ongoing' }
]

sessions = [
    { "title": 'Morning Drills', "date": '2024-02-21', "time": '06:00 AM', "court": 'Court A', "coach": 'Coach Rajan', "players": 8, "maxPlayers": 10, "type": 'Training', "status": 'Ongoing', "fee": 500 },
    { "title": 'Beginner Basics', "date": '2024-02-21', "time": '09:00 AM', "court": 'Court B', "coach": 'Coach Priya', "players": 5, "maxPlayers": 8, "type": 'Training', "status": 'Upcoming', "fee": 300 },
    { "title": 'Competitive Practice', "date": '2024-02-22', "time": '05:00 PM', "court": 'Court C', "coach": 'Coach Rajan', "players": 12, "maxPlayers": 12, "type": 'Practice', "status": 'Full', "fee": 400 },
    { "title": 'Evening Smash Session', "date": '2024-02-20', "time": '07:00 PM', "court": 'Court A', "coach": 'Coach Anil', "players": 10, "maxPlayers": 10, "type": 'Practice', "status": 'Completed', "fee": 450 },
    { "title": 'Weekend Tournament Prep', "date": '2024-02-23', "time": '10:00 AM', "court": 'All Courts', "coach": 'Coach Rajan', "players": 6, "maxPlayers": 16, "type": 'Tournament', "status": 'Upcoming', "fee": 600 },
    { "title": 'Advanced Tactics', "date": '2024-02-24', "time": '04:00 PM', "court": 'Court B', "coach": 'Coach Priya', "players": 4, "maxPlayers": 6, "type": 'Training', "status": 'Upcoming', "fee": 550 }
]

payments = [
    { "player": 'Arjun Sharma', "amount": 2500, "type": 'Monthly Fee', "date": '2024-02-01', "status": 'Paid', "method": 'UPI', "reference": 'TXN001234' },
    { "player": 'Priya Mehta', "amount": 2500, "type": 'Monthly Fee', "date": '2024-02-01', "status": 'Paid', "method": 'Card', "reference": 'TXN001235' },
    { "player": 'Rahul Verma', "amount": 2500, "type": 'Monthly Fee', "date": '2024-02-05', "status": 'Pending', "method": 'Cash', "reference": 'TXN001236' },
    { "player": 'Sneha Patel', "amount": 3500, "type": 'Tournament Fee', "date": '2024-02-10', "status": 'Paid', "method": 'UPI', "reference": 'TXN001237' },
    { "player": 'Kiran Kumar', "amount": 2500, "type": 'Monthly Fee', "date": '2024-02-01', "status": 'Overdue', "method": '-', "reference": '-' },
    { "player": 'Deepa Nair', "amount": 500, "type": 'Session Fee', "date": '2024-02-18', "status": 'Paid', "method": 'UPI', "reference": 'TXN001238' },
    { "player": 'Vikram Singh', "amount": 2500, "type": 'Monthly Fee', "date": '2024-02-01', "status": 'Paid', "method": 'Bank Transfer', "reference": 'TXN001239' },
    { "player": 'Anita Rao', "amount": 1500, "type": 'Registration Fee', "date": '2024-02-20', "status": 'Paid', "method": 'Cash', "reference": 'TXN001240' }
]

def load_data(endpoint, data_list):
    print(f"Loading {endpoint}...")
    url = f"{BASE_URL}{endpoint}/"
    for item in data_list:
        try:
            response = requests.post(url, json=item)
            if response.status_code == 201:
                print(f"  ✓ Added")
            else:
                print(f"  ✗ Failed: {response.text}")
        except Exception as e:
            print(f"  Error: {e}")

if __name__ == "__main__":
    load_data("players", players)
    load_data("matches", matches)
    load_data("sessions", sessions)
    load_data("payments", payments)
    print("\nData load complete!")
