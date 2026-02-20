from rest_framework import serializers
from .models import Business, User, Product, ChatMessage

class BusinessSerializer(serializers.ModelSerializer):
    class Meta:
        model = Business
        fields = ['id', 'name', 'created_at']

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'role', 'business', 'first_name', 'last_name']
        extra_kwargs = {'password': {'write_only': True}}
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class ProductSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)
    business_name = serializers.CharField(source='business.name', read_only=True)
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'status', 'business', 'created_by', 
                  'created_by_name', 'business_name', 'created_at', 'updated_at']
        read_only_fields = ['created_by', 'created_at', 'updated_at']
    
    def validate_description(self, value):
        """Validate that description does not exceed 100 words"""
        word_count = len(value.strip().split())
        if word_count > 100:
            raise serializers.ValidationError(f'Description must not exceed 100 words. Current count: {word_count}')
        return value

class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['id', 'user_message', 'ai_response', 'timestamp']
