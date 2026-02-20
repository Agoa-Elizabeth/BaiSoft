# BiaSoft Product Marketplace

A modern, full-stack product marketplace application with AI-powered shopping assistance.

## 🚀 Features

### Core Functionality
- **Product Management**: Create, edit, approve, and manage products
- **User Roles**: Admin, Editor, Approver, and Viewer with different permissions
- **Business Management**: Multi-business support with isolated product catalogs
- **Authentication**: JWT-based secure authentication system

### AI Assistant - Zuri
- **Intelligent Chatbot**: AI-powered shopping assistant named Zuri
- **Product Queries**: Ask about products, prices, and availability
- **Natural Language**: Understands questions like "What products are under $50?"
- **Fallback Mode**: Works even without OpenAI API with smart responses

### Modern UI/UX
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern Landing Page**: Attractive hero section with product showcase
- **Admin Dashboard**: Comprehensive management interface
- **Clean Interface**: Professional design with intuitive navigation

## 🛠️ Tech Stack

### Backend
- **Django 4.2.7**: Python web framework
- **Django REST Framework**: API development
- **JWT Authentication**: Secure token-based auth
- **SQLite**: Database (easily configurable for PostgreSQL/MySQL)
- **OpenAI Integration**: AI chatbot functionality

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **CSS3**: Modern styling with responsive design
- **Axios**: HTTP client for API calls

##  Installation

### Prerequisites
- Python 3.8+
- Node.js 16+
- Git

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables
Create `backend/.env`:
```env
SECRET_KEY=your-django-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
OPENAI_API_KEY=your-openai-api-key  # Optional for AI features
```

##  Usage

### Getting Started
1. Start the backend server: `python manage.py runserver`
2. Start the frontend: `npm run dev`
3. Visit `http://localhost:3000`
4. Create an admin user: `python manage.py createsuperuser`

### User Roles
- **Admin**: Full system access, user management, business management
- **Editor**: Create and edit products
- **Approver**: Approve products for public listing
- **Viewer**: Read-only access to business products

### AI Assistant
- Visit `/products/chatbot` to chat with Zuri
- Ask questions like:
  - "What products are available?"
  - "Show me products under $100"
  - "Tell me about [product name]"

## Architecture

```
├── backend/                 # Django REST API
│   ├── core/               # Main app with models, views, serializers
│   ├── marketplace/        # Django project settings
│   └── requirements.txt    # Python dependencies
├── frontend/               # Next.js application
│   ├── app/               # App Router pages
│   ├── lib/               # API utilities
│   └── package.json       # Node.js dependencies
└── docs/                  # Documentation files
```

##  Security Features

- JWT token authentication
- Role-based access control
- CORS protection
- Input validation and sanitization
- Environment variable configuration

##  AI Features

### Zuri AI Assistant
- Intelligent product recommendations
- Natural language query processing
- Fallback responses when AI is unavailable
- Chat history management
- Context-aware responses

##  Responsive Design

- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interface
- Accessible design principles

##  Deployment

### Production Checklist
- [ ] Set `DEBUG=False` in production
- [ ] Configure proper `SECRET_KEY`
- [ ] Set up production database (PostgreSQL recommended)
- [ ] Configure static file serving
- [ ] Set up HTTPS
- [ ] Configure environment variables

### Recommended Hosting
- **Backend**: Railway, Heroku, DigitalOcean
- **Frontend**: Vercel, Netlify
- **Database**: PostgreSQL on Railway, AWS RDS

##  Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

##  License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

##  Team

- **Developer**: Elizabeth Agoa
- **AI Assistant**: Zuri (OpenAI-powered)

##  Support

For support, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ using Django, Next.js, and AI**