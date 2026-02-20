from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .models import Business, User, Product, ChatMessage
from .serializers import BusinessSerializer, UserSerializer, ProductSerializer, ChatMessageSerializer
from .permissions import CanCreateProduct, CanApproveProduct, CanManageUsers
import os

@swagger_auto_schema(
    method='post',
    operation_description="Authenticate user and obtain JWT tokens",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['username', 'password'],
        properties={
            'username': openapi.Schema(type=openapi.TYPE_STRING, description='Username'),
            'password': openapi.Schema(type=openapi.TYPE_STRING, description='Password'),
        },
    ),
    responses={
        200: openapi.Response(
            description="Login successful",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'access': openapi.Schema(type=openapi.TYPE_STRING, description='Access token'),
                    'refresh': openapi.Schema(type=openapi.TYPE_STRING, description='Refresh token'),
                    'user': openapi.Schema(type=openapi.TYPE_OBJECT, description='User details'),
                }
            )
        ),
        401: 'Invalid credentials'
    }
)
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    
    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserSerializer(user).data
        })
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

@swagger_auto_schema(
    method='get',
    operation_description="Get current authenticated user details",
    responses={200: UserSerializer}
)
@api_view(['GET'])
def me_view(request):
    return Response(UserSerializer(request.user).data)

class BusinessViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing businesses.
    
    Provides CRUD operations for business entities.
    Requires authentication.
    """
    queryset = Business.objects.all()
    serializer_class = BusinessSerializer
    permission_classes = [IsAuthenticated]

class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing users.
    
    Provides CRUD operations for users with role-based access control.
    Only admins can create, update, or delete users.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'destroy']:
            return [CanManageUsers()]
        return [IsAuthenticated()]
    
    def perform_create(self, serializer):
        if not self.request.user.can_manage_users():
            raise PermissionError("Only admins can create users")
        serializer.save()

class ProductViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing products.
    
    Provides CRUD operations for products with role-based access control.
    - Admins and approvers can see all products
    - Other users can only see products from their business
    - Products can be approved by users with approval permissions
    """
    serializer_class = ProductSerializer
    
    def get_queryset(self):
        if self.action == 'list_public':
            return Product.objects.filter(status=Product.APPROVED).order_by('-created_at')
        if self.request.user.is_authenticated:
            # Admins and approvers can see all products, others see only their business products
            if self.request.user.role in ['admin', 'approver']:
                return Product.objects.all().order_by('-created_at')
            return Product.objects.filter(business=self.request.user.business).order_by('-created_at')
        return Product.objects.none()
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update']:
            return [CanCreateProduct()]
        elif self.action == 'approve':
            return [CanApproveProduct()]
        elif self.action == 'list_public':
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, business=self.request.user.business)
    
    @swagger_auto_schema(
        operation_description="Approve a product (changes status to 'approved')",
        responses={200: ProductSerializer}
    )
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        product = self.get_object()
        product.status = Product.APPROVED
        product.save()
        return Response(ProductSerializer(product).data)
    
    @swagger_auto_schema(
        operation_description="Get list of approved products (public endpoint)",
        responses={200: ProductSerializer(many=True)}
    )
    @action(detail=False, methods=['get'], url_path='public')
    def list_public(self, request):
        products = self.get_queryset()
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)

@swagger_auto_schema(
    method='post',
    operation_description="Send a message to the AI chatbot and get a response",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['message'],
        properties={
            'message': openapi.Schema(type=openapi.TYPE_STRING, description='User message to the chatbot'),
        },
    ),
    responses={
        200: ChatMessageSerializer,
        400: 'Message cannot be empty'
    }
)
@api_view(['POST'])
@permission_classes([AllowAny])
def chatbot_view(request):
    user_message = request.data.get('message', '')
    
    if not user_message.strip():
        return Response({'error': 'Message cannot be empty'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Check if OpenAI API key is available
        api_key = os.getenv('OPENAI_API_KEY')
        
        if not api_key or api_key in ['your_openai_api_key_here', 'demo_mode']:
            # Fallback response when no API key is configured
            products = Product.objects.filter(status=Product.APPROVED)
            
            if products.exists():
                product_list = "\n".join([f"• {p.name}: {p.description} - ${p.price} (by {p.business.name})" for p in products[:5]])
                ai_response = f"Hello! I'm the marketplace assistant. Here are some of our featured products:\n\n{product_list}\n\nNote: AI features are currently limited. Please contact support for more assistance."
            else:
                ai_response = "Hello! Welcome to our marketplace. Currently, there are no products available, but feel free to check back later or contact our support team for assistance."
        else:
            # Try to use OpenAI API
            try:
                from openai import OpenAI
                client = OpenAI(api_key=api_key)
                
                products = Product.objects.filter(status=Product.APPROVED)
                product_data = [f"{p.name}: {p.description} - ${p.price} (by {p.business.name})" for p in products]
                context = "Available products:\n" + "\n".join(product_data) if product_data else "No products are currently available."
                
                response = client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {"role": "system", "content": f"You are a helpful assistant for a product marketplace. {context}. Be friendly and helpful in answering questions about products."},
                        {"role": "user", "content": user_message}
                    ]
                )
                
                ai_response = response.choices[0].message.content
                
            except Exception as openai_error:
                # Handle OpenAI API errors (quota exceeded, invalid key, etc.)
                print(f"OpenAI API error: {str(openai_error)}")
                
                # Provide intelligent fallback responses based on user question
                products = Product.objects.filter(status=Product.APPROVED)
                user_question = user_message.lower()
                
                if "quota" in str(openai_error).lower() or "billing" in str(openai_error).lower():
                    # Intelligent responses based on question type
                    if any(word in user_question for word in ["what products", "available", "show me", "list"]):
                        if products.exists():
                            product_list = "\n".join([f"• {p.name}: {p.description} - ${p.price} (by {p.business.name})" for p in products])
                            ai_response = f"Hi! I'm Zuri, your AI shopping assistant. Here are all our available products:\n\n{product_list}"
                        else:
                            ai_response = "Hi! I'm Zuri, your AI shopping assistant. Currently, there are no products available in our marketplace."
                    
                    elif any(word in user_question for word in ["under", "less than", "below", "cheaper"]):
                        # Extract price if mentioned
                        import re
                        price_match = re.search(r'\$?(\d+(?:\.\d+)?)', user_question)
                        if price_match:
                            max_price = float(price_match.group(1))
                            affordable_products = products.filter(price__lte=max_price)
                            if affordable_products.exists():
                                product_list = "\n".join([f"• {p.name}: {p.description} - ${p.price} (by {p.business.name})" for p in affordable_products])
                                ai_response = f"Here are products under ${max_price}:\n\n{product_list}"
                            else:
                                ai_response = f"Sorry, we don't have any products under ${max_price} at the moment."
                        else:
                            # Default to $50 if no price specified but "under" is mentioned
                            affordable_products = products.filter(price__lte=50)
                            if affordable_products.exists():
                                product_list = "\n".join([f"• {p.name}: {p.description} - ${p.price} (by {p.business.name})" for p in affordable_products])
                                ai_response = f"Here are products under $50:\n\n{product_list}"
                            else:
                                ai_response = "Sorry, we don't have any products under $50 at the moment."
                    
                    elif any(word in user_question for word in ["tell me about", "about", "describe", "details", "info"]):
                        # Extract product name from question - try multiple approaches
                        product_mentioned = None
                        
                        # First, try exact name matches
                        for product in products:
                            if product.name.lower() in user_question:
                                product_mentioned = product
                                break
                        
                        # If no exact match, try partial matches
                        if not product_mentioned:
                            for product in products:
                                product_words = product.name.lower().split()
                                if any(word in user_question for word in product_words if len(word) > 2):
                                    product_mentioned = product
                                    break
                        
                        if product_mentioned:
                            ai_response = f"I'm Zuri! Here's what I know about {product_mentioned.name}:\n\n{product_mentioned.description}\n\nPrice: ${product_mentioned.price}\nSold by: {product_mentioned.business.name}"
                        else:
                            # Show all products if no specific one mentioned
                            if products.exists():
                                product_list = "\n".join([f"• {p.name}: {p.description} - ${p.price} (by {p.business.name})" for p in products[:3]])
                                ai_response = f"I'm Zuri, your AI assistant! Here are some of our products:\n\n{product_list}\n\nWhich specific product would you like to know more about?"
                            else:
                                ai_response = "I'm Zuri! Currently, there are no products available to describe."
                    
                    elif any(word in user_question for word in ["expensive", "most expensive", "highest price", "priciest"]):
                        if products.exists():
                            expensive_products = products.order_by('-price')[:3]
                            product_list = "\n".join([f"• {p.name}: {p.description} - ${p.price} (by {p.business.name})" for p in expensive_products])
                            ai_response = f"Here are our most expensive products:\n\n{product_list}"
                        else:
                            ai_response = "Currently, there are no products available."
                    
                    elif any(word in user_question for word in ["cheap", "cheapest", "lowest price", "affordable"]):
                        if products.exists():
                            cheap_products = products.order_by('price')[:3]
                            product_list = "\n".join([f"• {p.name}: {p.description} - ${p.price} (by {p.business.name})" for p in cheap_products])
                            ai_response = f"Here are our most affordable products:\n\n{product_list}"
                        else:
                            ai_response = "Currently, there are no products available."
                    
                    elif any(word in user_question for word in ["business", "seller", "company", "store"]):
                        if products.exists():
                            businesses = set(p.business.name for p in products)
                            business_list = "\n".join([f"• {business}" for business in businesses])
                            ai_response = f"Here are the businesses selling on our marketplace:\n\n{business_list}"
                        else:
                            ai_response = "Currently, there are no businesses with products on our marketplace."
                    
                    else:
                        # Generic helpful response
                        if products.exists():
                            product_count = products.count()
                            sample_products = products[:2]
                            product_list = "\n".join([f"• {p.name} - ${p.price}" for p in sample_products])
                            ai_response = f"Hello! I'm Zuri, your AI shopping assistant. I'd be happy to help! We have {product_count} products available. Here are a couple:\n\n{product_list}\n\nYou can ask me about:\n- What products are available?\n- Which products are under $X?\n- Tell me about [product name]\n- What's the cheapest/most expensive product?"
                        else:
                            ai_response = "Hello! I'm Zuri, your AI shopping assistant. Welcome to our marketplace! Currently, there are no products available, but feel free to check back later."
                else:
                    # Other API errors
                    if products.exists():
                        product_list = "\n".join([f"• {p.name}: {p.description} - ${p.price} (by {p.business.name})" for p in products[:3]])
                        ai_response = f"Hello! Here are some of our products:\n\n{product_list}\n\nFor more detailed assistance, please contact our support team."
                    else:
                        ai_response = "Hello! Welcome to our marketplace. Please contact our support team for assistance."
        
        # Save chat message
        chat_message = ChatMessage.objects.create(
            user=request.user if request.user.is_authenticated else None,
            user_message=user_message,
            ai_response=ai_response
        )
        
        return Response(ChatMessageSerializer(chat_message).data)
        
    except Exception as e:
        # Log the error for debugging
        print(f"Chatbot error: {str(e)}")
        
        # Return a friendly fallback response
        fallback_response = "I'm sorry, I'm having trouble processing your request right now. Please try again later or contact our support team for assistance."
        
        try:
            chat_message = ChatMessage.objects.create(
                user=request.user if request.user.is_authenticated else None,
                user_message=user_message,
                ai_response=fallback_response
            )
            return Response(ChatMessageSerializer(chat_message).data)
        except Exception as save_error:
            print(f"Error saving chat message: {str(save_error)}")
            return Response({
                'user_message': user_message,
                'ai_response': fallback_response,
                'timestamp': '2024-01-01T00:00:00Z'
            })

@swagger_auto_schema(
    method='get',
    operation_description="Get chat history (last 20 messages)",
    responses={200: ChatMessageSerializer(many=True)}
)
@api_view(['GET'])
@permission_classes([AllowAny])
def chat_history_view(request):
    messages = ChatMessage.objects.all().order_by('-timestamp')[:20]
    return Response(ChatMessageSerializer(messages, many=True).data)

@swagger_auto_schema(
    method='delete',
    operation_description="Clear all chat history",
    responses={
        200: openapi.Response(description="Chat history cleared successfully"),
        500: 'Internal server error'
    }
)
@api_view(['DELETE'])
@permission_classes([AllowAny])
def clear_chat_history_view(request):
    try:
        ChatMessage.objects.all().delete()
        return Response({'message': 'Chat history cleared successfully'})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
