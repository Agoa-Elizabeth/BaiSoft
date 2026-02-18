from django.db import models
from django.contrib.auth.models import AbstractUser

class Business(models.Model):
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class User(AbstractUser):
    ADMIN = 'admin'
    EDITOR = 'editor'
    APPROVER = 'approver'
    VIEWER = 'viewer'
    
    ROLE_CHOICES = [
        (ADMIN, 'Admin'),
        (EDITOR, 'Editor'),
        (APPROVER, 'Approver'),
        (VIEWER, 'Viewer'),
    ]
    
    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='users', null=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=VIEWER)
    
    def can_create_product(self):
        return self.role in [self.ADMIN, self.EDITOR, self.APPROVER]
    
    def can_approve_product(self):
        return self.role in [self.ADMIN, self.APPROVER]
    
    def can_manage_users(self):
        return self.role == self.ADMIN

class Product(models.Model):
    DRAFT = 'draft'
    PENDING_APPROVAL = 'pending_approval'
    APPROVED = 'approved'
    
    STATUS_CHOICES = [
        (DRAFT, 'Draft'),
        (PENDING_APPROVAL, 'Pending Approval'),
        (APPROVED, 'Approved'),
    ]
    
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=DRAFT)
    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='products')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='products')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name

class ChatMessage(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chat_messages', null=True, blank=True)
    user_message = models.TextField()
    ai_response = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-timestamp']
