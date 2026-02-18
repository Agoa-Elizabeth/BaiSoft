# API Documentation

Base URL: `http://localhost:8000/api`

## Authentication

All endpoints except `/login/`, `/products/public/`, `/chatbot/`, and `/chat-history/` require authentication.

Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_token>
```

---

## Endpoints

### Authentication

#### Login
```http
POST /api/login/
```

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin",
    "business": 1
  }
}
```

#### Get Current User
```http
GET /api/me/
```

**Response:**
```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@example.com",
  "role": "admin",
  "business": 1,
  "first_name": "Admin",
  "last_name": "User"
}
```

---

### Businesses

#### List Businesses
```http
GET /api/businesses/
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Example Business",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

#### Create Business
```http
POST /api/businesses/
```

**Request Body:**
```json
{
  "name": "New Business"
}
```

#### Get Business
```http
GET /api/businesses/{id}/
```

#### Update Business
```http
PATCH /api/businesses/{id}/
```

#### Delete Business
```http
DELETE /api/businesses/{id}/
```

---

### Users

#### List Users
```http
GET /api/users/
```

**Response:**
```json
[
  {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin",
    "business": 1,
    "first_name": "Admin",
    "last_name": "User"
  }
]
```

#### Create User (Admin Only)
```http
POST /api/users/
```

**Request Body:**
```json
{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "password123",
  "role": "editor",
  "business": 1,
  "first_name": "New",
  "last_name": "User"
}
```

**Roles:**
- `admin` - Full access
- `editor` - Create/edit products
- `approver` - Approve products
- `viewer` - View only

#### Get User
```http
GET /api/users/{id}/
```

#### Update User (Admin Only)
```http
PATCH /api/users/{id}/
```

#### Delete User (Admin Only)
```http
DELETE /api/users/{id}/
```

---

### Products

#### List Business Products (Authenticated)
```http
GET /api/products/
```

Returns all products for the authenticated user's business.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Laptop Pro",
    "description": "High-performance laptop",
    "price": "1299.99",
    "status": "approved",
    "business": 1,
    "created_by": 1,
    "created_by_name": "admin",
    "business_name": "Example Business",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

**Status Values:**
- `draft` - Not submitted for approval
- `pending_approval` - Awaiting approval
- `approved` - Approved and visible to public

#### List Public Products (No Auth Required)
```http
GET /api/products/public/
```

Returns only approved products from all businesses.

#### Create Product
```http
POST /api/products/
```

**Permissions:** Admin, Editor, Approver

**Request Body:**
```json
{
  "name": "New Product",
  "description": "Product description",
  "price": "99.99",
  "status": "draft"
}
```

**Note:** `business` and `created_by` are automatically set from the authenticated user.

#### Get Product
```http
GET /api/products/{id}/
```

#### Update Product
```http
PATCH /api/products/{id}/
```

**Permissions:** Admin, Editor, Approver

**Request Body:**
```json
{
  "name": "Updated Name",
  "description": "Updated description",
  "price": "149.99",
  "status": "pending_approval"
}
```

#### Delete Product
```http
DELETE /api/products/{id}/
```

**Permissions:** Admin, Editor, Approver

#### Approve Product
```http
POST /api/products/{id}/approve/
```

**Permissions:** Admin, Approver

**Response:**
```json
{
  "id": 1,
  "name": "Product Name",
  "status": "approved",
  ...
}
```

---

### AI Chatbot

#### Send Message
```http
POST /api/chatbot/
```

**No authentication required**

**Request Body:**
```json
{
  "message": "What products are available?"
}
```

**Response:**
```json
{
  "id": 1,
  "user_message": "What products are available?",
  "ai_response": "We have several products available including...",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

**Example Questions:**
- "What products are available?"
- "Which products are under $50?"
- "Tell me about the Laptop Pro"
- "What's the cheapest product?"
- "Show me all electronics"

#### Get Chat History
```http
GET /api/chat-history/
```

**No authentication required**

Returns the last 20 chat messages.

**Response:**
```json
[
  {
    "id": 1,
    "user_message": "What products are available?",
    "ai_response": "We have several products...",
    "timestamp": "2024-01-01T00:00:00Z"
  }
]
```

---

## Error Responses

### 400 Bad Request
```json
{
  "field_name": ["Error message"]
}
```

### 401 Unauthorized
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### 403 Forbidden
```json
{
  "detail": "You do not have permission to perform this action."
}
```

### 404 Not Found
```json
{
  "detail": "Not found."
}
```

### 500 Internal Server Error
```json
{
  "error": "Error message"
}
```

---

## Permission Matrix

| Endpoint | Admin | Editor | Approver | Viewer | Public |
|----------|-------|--------|----------|--------|--------|
| POST /login/ | ✅ | ✅ | ✅ | ✅ | ✅ |
| GET /me/ | ✅ | ✅ | ✅ | ✅ | ❌ |
| GET /businesses/ | ✅ | ✅ | ✅ | ✅ | ❌ |
| POST /businesses/ | ✅ | ✅ | ✅ | ✅ | ❌ |
| GET /users/ | ✅ | ✅ | ✅ | ✅ | ❌ |
| POST /users/ | ✅ | ❌ | ❌ | ❌ | ❌ |
| GET /products/ | ✅ | ✅ | ✅ | ✅ | ❌ |
| GET /products/public/ | ✅ | ✅ | ✅ | ✅ | ✅ |
| POST /products/ | ✅ | ✅ | ✅ | ❌ | ❌ |
| PATCH /products/{id}/ | ✅ | ✅ | ✅ | ❌ | ❌ |
| DELETE /products/{id}/ | ✅ | ✅ | ✅ | ❌ | ❌ |
| POST /products/{id}/approve/ | ✅ | ❌ | ✅ | ❌ | ❌ |
| POST /chatbot/ | ✅ | ✅ | ✅ | ✅ | ✅ |
| GET /chat-history/ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## Example Usage with curl

### Login and Get Token
```bash
curl -X POST http://localhost:8000/api/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Create Product
```bash
curl -X POST http://localhost:8000/api/products/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Product",
    "description": "Description",
    "price": "99.99",
    "status": "draft"
  }'
```

### Approve Product
```bash
curl -X POST http://localhost:8000/api/products/1/approve/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Public Products
```bash
curl http://localhost:8000/api/products/public/
```

### Chat with AI
```bash
curl -X POST http://localhost:8000/api/chatbot/ \
  -H "Content-Type: application/json" \
  -d '{"message": "What products are available?"}'
```

---

## Rate Limiting

Currently no rate limiting is implemented. For production, consider:
- 100 requests per minute for authenticated users
- 20 requests per minute for public endpoints
- 10 requests per minute for chatbot

---

## Pagination

Currently not implemented. For production, add pagination:
```
GET /api/products/?page=1&page_size=20
```

---

## Filtering & Search

Currently not implemented. For production, add filtering:
```
GET /api/products/?status=approved&min_price=50&max_price=100&search=laptop
```
