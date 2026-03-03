from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PlayerViewSet, MatchViewSet, SessionViewSet, PaymentViewSet, ProfileView, PingView

router = DefaultRouter()
router.register(r'players', PlayerViewSet, basename='player')
router.register(r'matches', MatchViewSet, basename='match')
router.register(r'sessions', SessionViewSet, basename='session')
router.register(r'payments', PaymentViewSet, basename='payment')

urlpatterns = [
    path('', include(router.urls)),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('ping/', PingView.as_view(), name='ping'),
]
