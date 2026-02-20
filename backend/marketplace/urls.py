from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="Product Marketplace API",
        default_version='v1',
        description="""
        # Product Marketplace API Documentation
        
        A comprehensive API for managing products, users, businesses, and AI-powered chatbot interactions.
        
        ## Features
        - **Authentication**: JWT-based authentication system
        - **Products**: Create, read, update, delete, and approve products
        - **Users**: User management with role-based permissions (Admin, Editor, Approver, Viewer)
        - **Businesses**: Business entity management
        - **AI Chatbot**: Intelligent product recommendations and queries
        
        ## Authentication
        Most endpoints require authentication. Use the `/api/login/` endpoint to obtain JWT tokens.
        Include the access token in the Authorization header: `Bearer <token>`
        
        ## Roles & Permissions
        - **Admin**: Full access to all resources
        - **Editor**: Can create and edit products
        - **Approver**: Can approve products
        - **Viewer**: Read-only access
        """,
        terms_of_service="https://www.example.com/terms/",
        contact=openapi.Contact(email="contact@marketplace.local"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('core.urls')),
    
    # Swagger UI endpoints
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('', schema_view.with_ui('swagger', cache_timeout=0), name='api-docs'),
]
