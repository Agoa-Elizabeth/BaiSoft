from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from core.models import Business, User, Product

class ProductMarketplaceTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.business = Business.objects.create(name="Test Business")
        
        self.admin = User.objects.create_user(
            username="admin",
            password="admin123",
            business=self.business,
            role="admin"
        )
        
        self.editor = User.objects.create_user(
            username="editor",
            password="editor123",
            business=self.business,
            role="editor"
        )
        
        self.approver = User.objects.create_user(
            username="approver",
            password="approver123",
            business=self.business,
            role="approver"
        )
        
        self.viewer = User.objects.create_user(
            username="viewer",
            password="viewer123",
            business=self.business,
            role="viewer"
        )
    
    def test_login(self):
        response = self.client.post('/api/login/', {
            'username': 'admin',
            'password': 'admin123'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
    
    def test_editor_can_create_product(self):
        self.client.force_authenticate(user=self.editor)
        response = self.client.post('/api/products/', {
            'name': 'Test Product',
            'description': 'Test Description',
            'price': 99.99,
            'business': self.business.id
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    
    def test_viewer_cannot_create_product(self):
        self.client.force_authenticate(user=self.viewer)
        response = self.client.post('/api/products/', {
            'name': 'Test Product',
            'description': 'Test Description',
            'price': 99.99,
            'business': self.business.id
        })
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_approver_can_approve_product(self):
        product = Product.objects.create(
            name='Test Product',
            description='Test',
            price=99.99,
            business=self.business,
            created_by=self.editor,
            status='pending_approval'
        )
        
        self.client.force_authenticate(user=self.approver)
        response = self.client.post(f'/api/products/{product.id}/approve/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        product.refresh_from_db()
        self.assertEqual(product.status, 'approved')
    
    def test_public_products_only_shows_approved(self):
        Product.objects.create(
            name='Approved Product',
            description='Test',
            price=99.99,
            business=self.business,
            created_by=self.admin,
            status='approved'
        )
        
        Product.objects.create(
            name='Draft Product',
            description='Test',
            price=99.99,
            business=self.business,
            created_by=self.admin,
            status='draft'
        )
        
        response = self.client.get('/api/products/public/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Approved Product')
