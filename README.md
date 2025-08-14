# HR Platform

A comprehensive, full-stack HR management platform built with modern technologies, featuring AI-powered CV processing, role-based access control, and real-time notifications.

## 🚀 Overview

HR Platform is a sophisticated human resources management system designed to streamline the entire recruitment and HR workflow. The platform combines modern web technologies with AI capabilities to provide an efficient, scalable, and user-friendly solution for HR professionals.

### Key Features
- **AI-Powered CV Processing**: Automated extraction and analysis of candidate information
- **Role-Based Access Control**: Secure, granular permission system
- **Real-Time Notifications**: Email and system notifications with React templates
- **Social Authentication**: Google and LinkedIn login integration
- **Multi-Language Support**: English and French interfaces
- **Responsive Design**: Mobile-first approach for all devices
- **Microservices Architecture**: Scalable and maintainable backend design

## 🏗️ System Architecture

### High-Level Architecture
The platform follows a modern microservices architecture with clear separation of concerns:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   External      │
│   (Next.js)     │◄──►│   (NestJS)      │◄──►│   Services      │
│                 │    │                 │    │                 │
│ • React 18      │    │ • REST API      │    │ • AWS S3        │
│ • TypeScript    │    │ • Microservices │    │ • OpenAI        │
│ • Tailwind CSS  │    │ • PostgreSQL    │    │ • Google OAuth  │
│ • JWT Auth      │    │ • Redis         │    │ • LinkedIn OAuth│
└─────────────────┘    │ • RabbitMQ      │    └─────────────────┘
                       └─────────────────┘
```

[drawio diagram achitecture](https://viewer.diagrams.net/index.html?tags=%7B%7D&lightbox=1&highlight=0000ff&edit=_blank&layers=1&nav=1&dark=auto#G1HBof7Yj-n-o4OyQ2VwIHJydMYfLWswSI)

### Technology Stack

#### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context + Custom Hooks
- **UI Components**: shadcn/ui
- **Testing**: Cypress E2E

#### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL with Sequelize ORM
- **Cache**: Redis
- **Message Queue**: RabbitMQ
- **File Storage**: AWS S3
- **AI Services**: OpenAI integration

#### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Database**: PostgreSQL
- **Caching**: Redis
- **Message Broker**: RabbitMQ
- **Cloud Services**: AWS (S3, TextExtract)

## 🔐 Authentication & Security

### Authentication Flow
1. **User Registration**: Email/password or social login
2. **JWT Token Generation**: Secure token-based authentication
3. **Session Management**: Redis-backed session storage
4. **Permission Validation**: Role-based access control
5. **Route Protection**: Middleware-based security

### Security Features
- **JWT with Refresh Tokens**: Secure authentication
- **Rate Limiting**: Protection against abuse
- **Input Validation**: DTO-based request validation
- **SQL Injection Protection**: ORM-level security
- **XSS Protection**: Output sanitization
- **CORS Configuration**: Frontend security

## 🗄️ Data Architecture

### Database Design
- **PostgreSQL**: Primary relational database
- **Sequelize ORM**: Object-relational mapping
- **Migration System**: Version-controlled schema changes
- **Seeding**: Automated initial data population

### Core Data Models
- **Users**: User accounts and profiles
- **Admins**: Administrative users
- **Jobs**: Job postings and requirements
- **CVs**: Candidate resumes and extracted data
- **Sessions**: User session management
- **Permissions**: Role and permission definitions
- **Companies**: Company information
- **Admin Notes**: Administrative annotations

### Data Relationships
- **One-to-Many**: User → Sessions, User → CVs
- **Many-to-Many**: Users ↔ Permissions, Users ↔ Roles
- **Polymorphic**: Admin Notes (can reference multiple entities)

## 🤖 AI-Powered Features

### CV Processing Pipeline
1. **Document Upload**: PDF/DOC file upload
2. **OCR Extraction**: Text extraction from documents
3. **AI Analysis**: OpenAI-powered content analysis
4. **Data Extraction**: Skills, education, experience parsing
5. **Data Validation**: Automated verification and enrichment
6. **Profile Creation**: Structured candidate profiles

### AI Capabilities
- **Text Analysis**: Natural language processing
- **Skill Extraction**: Automated skill identification
- **Content Generation**: AI-assisted content creation
- **Data Enrichment**: Enhanced candidate profiles
- **Intelligent Matching**: Job-candidate compatibility scoring

## 📧 Notification System

### Email Infrastructure
- **React Templates**: Component-based email design
- **Multi-Language**: English and French support
- **Responsive Layouts**: Mobile-optimized emails
- **Template Engine**: Dynamic content generation

### Notification Types
- **Welcome Emails**: New user onboarding
- **Job Notifications**: Candidate alerts
- **Admin Alerts**: System event notifications
- **Custom Notifications**: API-driven messaging

### Message Queuing
- **RabbitMQ**: Reliable message delivery
- **Asynchronous Processing**: Background task handling
- **Email Queuing**: Reliable notification delivery
- **Scalable Architecture**: Handle high message volumes

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18 or higher
- **Docker**: Docker and Docker Compose
- **Database**: PostgreSQL (or use Docker)
- **Cache**: Redis (or use Docker)
- **Message Queue**: RabbitMQ (or use Docker)

### Quick Start
```bash
# Clone the repository
git clone <repository-url>
cd hr_platform

# Start backend services
cd backend
npm install
npm run infra:up
npm run start:dev

# Start frontend (in new terminal)
cd ../frontend
npm install
npm run dev
```

### Environment Configuration
```bash
# Backend environment
cp backend/.env.example backend/.env
# Configure database, Redis, RabbitMQ, AWS, and OpenAI settings

# Frontend environment
cp frontend/.env.example frontend/.env.local
# Configure API endpoints and OAuth settings
```

## 🐳 Docker Development

### Infrastructure Services
```bash
# Start all infrastructure services
cd backend
npm run infra:up

# Services available:
# - PostgreSQL: localhost:8083
# - Redis: localhost:6379
# - RabbitMQ: localhost:5672 (Management: localhost:15672)
```

### Full Docker Development
```bash
# Complete containerized development
cd backend
npm run dev:full

# View logs
npm run dev:full:logs
```

## 📚 API Documentation

### Backend API
- **Swagger UI**: http://localhost:3000/api
- **OpenAPI JSON**: http://localhost:3000/api-json
- **Postman Collection**: Available in `/docs` folder

### Frontend API Routes
- **Authentication**: `/api/auth/*`
- **User Management**: `/api/user/*`
- **CV Processing**: `/api/cv/*`
- **File Upload**: `/api/upload/*`

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm run test              # Unit tests
npm run test:watch        # Watch mode
npm run test:cov          # Coverage report
npm run test:e2e          # End-to-end tests
```

### Frontend Testing
```bash
cd frontend
npm run cypress:open      # Open Cypress
npm run cypress:run       # Run tests
```

## 🚀 Deployment

### Production Build
```bash
# Backend
cd backend
npm run build
npm run start:prod

# Frontend
cd frontend
npm run build
npm run start
```

### Docker Production
```bash
# Build and run production containers
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Variables
```env
# Production environment variables
NODE_ENV=production
DB_HOST=your-production-db
REDIS_URL=your-production-redis
RABBITMQ_URL=your-production-rabbitmq
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
OPENAI_API_KEY=your-openai-key
```
