from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import viewsets, status
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from .models import Player, Match, Session, Payment
from .serializers import PlayerSerializer, MatchSerializer, SessionSerializer, PaymentSerializer

class PlayerViewSet(viewsets.ModelViewSet):
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer

class MatchViewSet(viewsets.ModelViewSet):
    queryset = Match.objects.all()
    serializer_class = MatchSerializer

class SessionViewSet(viewsets.ModelViewSet):
    queryset = Session.objects.all()
    serializer_class = SessionSerializer

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

class CustomObtainAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        username = request.data.get('username', '').strip()
        password = request.data.get('password')

        if not username or not password:
            return Response({'error': 'Please provide both username and password'}, status=status.HTTP_400_BAD_REQUEST)

        from django.contrib.auth import get_user_model
        from django.db.models import Q
        User = get_user_model()

        # Check if user exists (case-insensitive and checking both username and email)
        # Using a single query with Q for better compatibility with Djongo
        user_found = User.objects.filter(Q(username__iexact=username) | Q(email__iexact=username)).first()
        
        if not user_found:
            return Response({'error': 'user_not_found'}, status=status.HTTP_404_NOT_FOUND)

        # User exists, now check password
        # First try authenticating with the raw input (could be username or email)
        user = authenticate(username=username, password=password)
        
        # If that fails, try authenticating with the actual username we found in the DB
        if user is None and user_found:
            user = authenticate(username=user_found.username, password=password)

        if user is None:
            return Response({'error': 'invalid_password'}, status=status.HTTP_401_UNAUTHORIZED)

        if not user.is_active:
            return Response({'error': 'User account is disabled'}, status=status.HTTP_403_FORBIDDEN)

        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'email': user.email,
            'username': user.username,
            'full_name': f"{user.first_name} {user.last_name}".strip() or user.username,
            'is_staff': user.is_staff
        })
