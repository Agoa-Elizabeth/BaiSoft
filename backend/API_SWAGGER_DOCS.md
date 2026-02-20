# API Documentation with Swagger

This project uses **drf-yasg** (Yet Another Swagger Generator) to provide interactive API documentation.

## Accessing the Documentation

Once the Django server is running, you can access the API documentation at:

### Swagger UI (Interactive)
```
http://localhost:8000/swagger/
```
- Interactive interface to test API endpoints
- Try out requests directly from the browser
- View request/response schemas

### ReDoc (Alternative UI)
```
http://localhost:8000/redoc/
```
- Clean, responsive documentation
- Better for reading and understanding the API

### Root URL
```
http://localhost:8000/
```
- Redirects to Swagger UI by default

### JSON/YAML Schema
```
http://localhost:8000/swagger.json
http://localhost:8000/swagger.yaml
```
- Raw OpenAPI schema files
- Can be imported into other tools (Postman, Insomnia, etc.)

## Features

The Swagger documentation includes:

- **All API Endpoints**: Complete list of available endpoints
- **Request/Response Schemas**: Detailed structure of data
- **Authentication**: JWT token authentication support
- **Try It Out**: Test endpoints directly from the browser
- **Role-Based Permissions**: Documentation of access control
- **Examples**: Sample requests and responses

## API Endpoints Overview

### Authentication
- `POST /api/login/` - Login and obtain JWT tokens
- `GET /api/me/` - Get current user details

### Products
- `GET /api/products/` - List products (filtered by role)
- `POST /api/products/` - Create a new product
- `GET /api/products/{id}/` - Get product details
- `PUT /api/products/{id}/` - Update a product
- `DELETE /api/products/{id}/` - Delete a product
- `POST /api/products/{id}/approve/` - Approve a product
- `GET /api/products/public/` - List approved products (public)

### Users
- `GET /api/users/` - List users (admin only)
- `POST /api/users/` - Create a new user (admin only)
- `GET /api/users/{id}/` - Get user details
- `PUT /api/users/{id}/` - Update a user (admin only)
- `DELETE /api/users/{id}/` - Delete a user (admin only)

### Businesses
- `GET /api/businesses/` - List businesses
- `POST /api/businesses/` - Create a new business
- `GET /api/businesses/{id}/` - Get business details
- `PUT /api/businesses/{id}/` - Update a business
- `DELETE /api/businesses/{id}/` - Delete a business

### AI Chatbot
- `POST /api/chatbot/` - Send message to AI chatbot
- `GET /api/chat-history/` - Get chat history
- `DELETE /api/chat-history/clear/` - Clear chat history

## Using Authentication in Swagger

1. Click the **"Authorize"** button at the top right
2. Login using the `/api/login/` endpoint to get your access token
3. Copy the `access` token from the response
4. Enter it in the format: `Bearer <your-token>`
5. Click **"Authorize"**
6. Now you can test authenticated endpoints

## Example: Testing an Endpoint

1. Navigate to http://localhost:8000/swagger/
2. Find the endpoint you want to test (e.g., `GET /api/products/`)
3. Click on the endpoint to expand it
4. Click **"Try it out"**
5. Fill in any required parameters
6. Click **"Execute"**
7. View the response below

## Roles & Permissions

The API uses role-based access control:

- **Admin**: Full access to all resources
- **Editor**: Can create and edit products
- **Approver**: Can approve products
- **Viewer**: Read-only access

These permissions are documented in each endpoint's description.

## Installation

The Swagger documentation is already configured. If you need to reinstall:

```bash
cd backend
pip install -r requirements.txt
```

## Configuration

Swagger is configured in:
- `backend/marketplace/settings.py` - Added `drf_yasg` to `INSTALLED_APPS`
- `backend/marketplace/urls.py` - Swagger URL patterns and schema configuration
- `backend/core/views.py` - Endpoint documentation decorators

## Customization

To customize the API documentation, edit the schema configuration in `backend/marketplace/urls.py`:

```python
schema_view = get_schema_view(
    openapi.Info(
        title="Your API Title",
        default_version='v1',
        description="Your API Description",
        # ... more configuration
    ),
    # ...
)
```

## Production Considerations

In production, you may want to:
- Restrict access to documentation endpoints
- Use `permission_classes=(permissions.IsAdminUser,)` for schema view
- Disable Swagger UI and only expose the JSON/YAML schema
- Use environment variables to control documentation availability
