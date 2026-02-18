from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import Business, User, Product, ChatMessage

@admin.register(Business)
class BusinessAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at']
    search_fields = ['name']

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['username', 'email', 'role', 'business', 'is_staff']
    list_filter = ['role', 'business', 'is_staff']
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Business Info', {'fields': ('business', 'role')}),
    )

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'status', 'business', 'created_by', 'created_at']
    list_filter = ['status', 'business']
    search_fields = ['name', 'description']
    actions = ['approve_products']
    
    def approve_products(self, request, queryset):
        queryset.update(status=Product.APPROVED)
    approve_products.short_description = "Approve selected products"

@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ['user', 'user_message', 'timestamp']
    list_filter = ['timestamp']
