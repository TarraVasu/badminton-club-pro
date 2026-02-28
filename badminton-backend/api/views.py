from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import viewsets, status
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
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

        try:
            # User authentication via EmailBackend (handles both username and email)
            user = authenticate(username=username, password=password)

            if user is None:
                # Check if user exists to provide specific error
                user_exists = User.objects.filter(Q(username__iexact=username) | Q(email__iexact=username)).exists()
                if not user_exists:
                    return Response({'error': 'user_not_found'}, status=status.HTTP_404_NOT_FOUND)
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
                'is_staff': user.is_staff,
                'is_superuser': user.is_superuser
            })
        except Exception as e:
            print(f"Login error: {str(e)}")
            return Response({'error': 'internal_server_error', 'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            player = Player.objects.get(user=request.user)
            serializer = PlayerSerializer(player)
            return Response(serializer.data)
        except Player.DoesNotExist:
            player = Player.objects.create(
                user=request.user,
                name=request.user.username,
                email=request.user.email,
                avatar=request.user.username[0].upper() if request.user.username else '?',
                joinDate=request.user.date_joined.date()
            )
            serializer = PlayerSerializer(player)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request):
        try:
            player = Player.objects.get(user=request.user)
            serializer = PlayerSerializer(player, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Player.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
