# System Architecture Overview

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│                      (Next.js + React)                       │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Public  │  │  Login   │  │Dashboard │  │ Chatbot  │   │
│  │  Page    │  │  Page    │  │  Page    │  │  Page    │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                              │
│                    ┌──────────────┐                         │
│                    │  API Client  │                         │
│                    │  (Axios)     │                         │
│                    └──────────────┘                         │
└─────────────────────────┬────────────────────────────────────┘
                          │ HTTP/REST
                          │ JWT Token
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                         Backend                              │
│                    (Django + DRF)                            │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                    API Layer                          │  │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐        │  │
│  │  │ Auth   │ │Business│ │Product │ │Chatbot │        │  │
│  │  │ Views  │ │ Views  │ │ Views  │ │ Views  │        │  │
│  │  └────────┘ └────────┘ └────────┘ └────────┘        │  │
│  └──────────────────────────────────────────────────────┘  │
│                          │                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Business Logic Layer                     │  │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐       │  │
│  │  │Permissions │ │Serializers │ │ Validators │       │  │
│  │  └────────────┘ └────────────┘ └────────────┘       │  │
│  └──────────────────────────────────────────────────────┘  │
│                          │                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                   Data Layer                          │  │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐        │  │
│  │  │Business│ │  User  │ │Product │ │ChatMsg │        │  │
│  │  │ Model  │ │ Model  │ │ Model  │ │ Model  │        │  │
│  │  └────────┘ └────────┘ └────────┘ └────────┘        │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────┬────────────────────────────────────┘
                          │
                          ▼
                  ┌───────────────┐
                  │   SQLite DB   │
                  └───────────────┘

                          │
                          ▼ (Chatbot only)
                  ┌───────────────┐
                  │  OpenAI API   │
                  │  GPT-3.5      │
                  └───────────────┘
```

---

## Data Model

```
┌─────────────────┐
│    Business     │
├─────────────────┤
│ id              │
│ name            │
│ created_at      │
└────────┬────────┘
         │
         │ 1:N
         │
         ▼
┌─────────────────┐
│      User       │
├─────────────────┤
│ id              │
│ username        │
│ email           │
│ password        │
│ role            │◄────┐
│ business_id     │     │
│ first_name      │     │
│ last_name       │     │
└────────┬────────┘     │
         │              │
         │ 1:N          │ N:1
         │              │
         ▼              │
┌─────────────────┐     │
│    Product      │     │
├─────────────────┤     │
│ id              │     │
│ name            │     │
│ description     │     │
│ price           │     │
│ status          │     │
│ business_id     │─────┘
│ created_by_id   │─────┐
│ created_at      │     │
│ updated_at      │     │
└─────────────────┘     │
                        │
                        │ N:1
                        │
                        ▼
                ┌─────────────────┐
                │  ChatMessage    │
                ├─────────────────┤
                │ id              │
                │ user_id         │
                │ user_message    │
                │ ai_response     │
                │ timestamp       │
                └─────────────────┘
```

---

## User Roles & Permissions

```
┌──────────────────────────────────────────────────────────┐
│                         ADMIN                             │
│  ✓ Create/Edit/Delete Products                           │
│  ✓ Approve Products                                       │
│  ✓ Create/Edit/Delete Users                              │
│  ✓ Manage Business                                        │
│  ✓ Full Access                                            │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│                        APPROVER                           │
│  ✓ Create/Edit/Delete Products                           │
│  ✓ Approve Products                                       │
│  ✗ Manage Users                                           │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│                         EDITOR                            │
│  ✓ Create/Edit/Delete Products                           │
│  ✗ Approve Products                                       │
│  ✗ Manage Users                                           │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│                         VIEWER                            │
│  ✓ View Products                                          │
│  ✗ Create/Edit/Delete Products                           │
│  ✗ Approve Products                                       │
│  ✗ Manage Users                                           │
└──────────────────────────────────────────────────────────┘
```

---

## Product Workflow

```
┌─────────┐
│  DRAFT  │
└────┬────┘
     │
     │ Editor creates product
     │
     ▼
┌──────────────────┐
│ PENDING_APPROVAL │
└────┬─────────────┘
     │
     │ Approver reviews
     │
     ▼
┌──────────┐
│ APPROVED │ ──────► Visible to Public
└──────────┘
```

---

## Authentication Flow

```
1. User Login
   │
   ├─► POST /api/login/
   │   { username, password }
   │
   ▼
2. Backend Validates
   │
   ├─► Check credentials
   │   Generate JWT token
   │
   ▼
3. Return Token
   │
   ├─► { access, refresh, user }
   │
   ▼
4. Frontend Stores Token
   │
   ├─► localStorage.setItem('token', ...)
   │
   ▼
5. Subsequent Requests
   │
   ├─► Authorization: Bearer <token>
   │
   ▼
6. Backend Validates Token
   │
   ├─► Decode JWT
   │   Check expiration
   │   Load user
   │
   ▼
7. Process Request
```

---

## API Request Flow

```
Frontend                Backend                 Database
   │                       │                       │
   │  POST /api/products/  │                       │
   ├──────────────────────►│                       │
   │                       │                       │
   │                       │  Validate JWT         │
   │                       ├───────────────────────┤
   │                       │                       │
   │                       │  Check Permissions    │
   │                       │  (CanCreateProduct)   │
   │                       │                       │
   │                       │  Validate Data        │
   │                       │  (Serializer)         │
   │                       │                       │
   │                       │  INSERT INTO products │
   │                       ├──────────────────────►│
   │                       │                       │
   │                       │  Return product       │
   │                       │◄──────────────────────┤
   │                       │                       │
   │  201 Created          │                       │
   │◄──────────────────────┤                       │
   │  { product data }     │                       │
   │                       │                       │
```

---

## Chatbot Flow

```
User                Frontend              Backend              OpenAI
 │                     │                     │                   │
 │  Type message       │                     │                   │
 ├────────────────────►│                     │                   │
 │                     │                     │                   │
 │                     │  POST /api/chatbot/ │                   │
 │                     ├────────────────────►│                   │
 │                     │                     │                   │
 │                     │                     │  Get products     │
 │                     │                     │  (approved only)  │
 │                     │                     │                   │
 │                     │                     │  Build context    │
 │                     │                     │                   │
 │                     │                     │  API call         │
 │                     │                     ├──────────────────►│
 │                     │                     │                   │
 │                     │                     │  AI response      │
 │                     │                     │◄──────────────────┤
 │                     │                     │                   │
 │                     │                     │  Save to DB       │
 │                     │                     │                   │
 │                     │  Response           │                   │
 │                     │◄────────────────────┤                   │
 │                     │                     │                   │
 │  Display response   │                     │                   │
 │◄────────────────────┤                     │                   │
 │                     │                     │                   │
```

---

## Technology Stack Details

### Backend
- **Framework**: Django 4.2.7
- **API**: Django REST Framework 3.14.0
- **Authentication**: djangorestframework-simplejwt 5.3.0
- **CORS**: django-cors-headers 4.3.1
- **AI**: openai 1.3.0
- **Database**: SQLite (dev), PostgreSQL (prod)

### Frontend
- **Framework**: Next.js 14.0.4
- **UI Library**: React 18
- **Language**: TypeScript 5
- **HTTP Client**: Axios 1.6.2
- **Styling**: CSS (custom)

### Infrastructure
- **Development**: Local servers
- **Production**: AWS/Heroku/Vercel (recommended)
- **Database**: PostgreSQL (recommended)
- **Caching**: Redis (recommended)
- **Storage**: S3 (for product images)

---

## Security Measures

1. **Authentication**
   - JWT tokens with expiration
   - Password hashing (Django default)
   - CSRF protection

2. **Authorization**
   - Role-based access control
   - Permission classes
   - Object-level permissions

3. **Data Validation**
   - Serializer validation
   - Model constraints
   - Input sanitization

4. **API Security**
   - CORS configuration
   - Rate limiting (recommended)
   - HTTPS (production)

---

## Scalability Considerations

### Current (Development)
- Single server
- SQLite database
- No caching
- No load balancing

### Production Recommendations
- Multiple application servers
- PostgreSQL with read replicas
- Redis for caching and sessions
- CDN for static assets
- Load balancer (Nginx/AWS ALB)
- Horizontal scaling with Docker/Kubernetes
- Message queue for async tasks (Celery + RabbitMQ)

---

## Monitoring & Logging

### Recommended Tools
- **Application Monitoring**: Sentry, New Relic
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **Metrics**: Prometheus + Grafana
- **Uptime**: Pingdom, UptimeRobot
- **Performance**: Google Lighthouse, WebPageTest

### Key Metrics to Track
- API response times
- Error rates
- User authentication success/failure
- Product approval workflow times
- Chatbot usage and response times
- Database query performance
