from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    BusinessViewSet, UserViewSet, ProductViewSet,
    login_view, me_view, chatbot_view, chat_history_view, clear_chat_history_view
)

router = DefaultRouter()
router.register(r'businesses', BusinessViewSet)
router.register(r'users', UserViewSet)
router.register(r'products', ProductViewSet, basename='product')

urlpatterns = [
    path('', include(router.urls)),
    path('login/', login_view, name='login'),
    path('me/', me_view, name='me'),
    path('chatbot/', chatbot_view, name='chatbot'),
    path('chat-history/', chat_history_view, name='chat-history'),
    path('clear-chat-history/', clear_chat_history_view, name='clear-chat-history'),
]
