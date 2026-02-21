from django.db import models

class Player(models.Model):
    name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    level = models.CharField(max_length=50)
    wins = models.IntegerField(default=0)
    losses = models.IntegerField(default=0)
    points = models.IntegerField(default=0)
    status = models.CharField(max_length=50)
    avatar = models.CharField(max_length=10)
    joinDate = models.DateField()
    matchesPlayed = models.IntegerField(default=0)
    image = models.ImageField(upload_to='player_pics/', null=True, blank=True)

    def __str__(self):
        return self.name

class Match(models.Model):
    player1 = models.CharField(max_length=150)
    player2 = models.CharField(max_length=150)
    score1 = models.IntegerField(default=0)
    score2 = models.IntegerField(default=0)
    date = models.DateField()
    court = models.CharField(max_length=50)
    type = models.CharField(max_length=50)
    status = models.CharField(max_length=50)
    winner = models.CharField(max_length=150, blank=True, null=True)
    duration = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.player1} vs {self.player2}"

class Session(models.Model):
    title = models.CharField(max_length=150)
    date = models.DateField()
    time = models.CharField(max_length=50)
    court = models.CharField(max_length=50)
    coach = models.CharField(max_length=150)
    players = models.IntegerField(default=0)
    maxPlayers = models.IntegerField(default=0)
    type = models.CharField(max_length=50)
    status = models.CharField(max_length=50)
    fee = models.IntegerField(default=0)

    def __str__(self):
        return self.title

class Payment(models.Model):
    player = models.CharField(max_length=150)
    amount = models.IntegerField(default=0)
    type = models.CharField(max_length=50)
    date = models.DateField()
    status = models.CharField(max_length=50)
    method = models.CharField(max_length=50)
    reference = models.CharField(max_length=150, blank=True, null=True)

    def __str__(self):
        return f"{self.player} - {self.amount}"
