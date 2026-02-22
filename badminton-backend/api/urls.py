from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PlayerViewSet, MatchViewSet, SessionViewSet, PaymentViewSet, ProfileView

router = DefaultRouter()
router.register(r'players', PlayerViewSet)
router.register(r'matches', MatchViewSet)
router.register(r'sessions', SessionViewSet)
router.register(r'payments', PaymentViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('profile/', ProfileView.as_view(), name='profile'),
]
