# HR Platform Backend

A comprehensive NestJS-based backend application for HR management with microservices architecture, Docker infrastructure, and advanced features including AI-powered CV processing, role-based access control, and real-time notifications.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- Docker & Docker Compose
- PostgreSQL client (optional, for direct DB access)
- Redis (for caching and sessions)
- RabbitMQ (for message queuing)

### Installation
```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Configure environment variables
# See .env.example for required variables
```

## 🏗️ Architecture Overview

### Technology Stack
- **Framework**: NestJS (Node.js framework)
- **Language**: TypeScript
- **Database**: PostgreSQL with Sequelize ORM
- **Cache**: Redis
- **Message Queue**: RabbitMQ
- **Authentication**: JWT + Passport strategies
- **File Storage**: AWS S3
- **AI Services**: OpenAI integration
- **Testing**: Jest + Supertest
- **Documentation**: Swagger/OpenAPI

### Architecture Pattern
- **Modular Architecture**: Feature-based modules
- **CQRS Pattern**: Command Query Responsibility Segregation
- **Repository Pattern**: Data access abstraction
- **Service Layer**: Business logic encapsulation
- **Middleware Stack**: Request processing pipeline

### Core Modules
```
src/
├── admin/           # Admin management system
├── auth/            # Authentication & authorization
├── users/           # User management
├── jobs/            # Job posting & management
├── cv/              # CV processing & AI extraction
├── notifications/   # Email & notification system
├── sessions/        # Session management
├── permissions/     # RBAC permission system
├── aws/             # AWS services integration
├── openai/          # AI services integration
├── rabbitmq/        # Message queuing
└── rate-limit/      # Rate limiting & protection
```

## 🔐 Authentication & Authorization

### Authentication Methods
- **JWT-based authentication** with refresh tokens
- **Social login integration** (Google, LinkedIn)
- **Session-based authentication** with Redis
- **Multi-factor authentication** support

### Authorization System
- **Role-Based Access Control (RBAC)**
- **Permission-based access control**
- **CASL integration** for policy management
- **Route-level protection** with guards

### Security Features
- **Rate limiting** with configurable thresholds
- **Input validation** with DTOs and pipes
- **SQL injection protection** via Sequelize
- **XSS protection** with sanitization
- **CORS configuration** for frontend integration

## 🗄️ Database Architecture

### Database Design
- **PostgreSQL** as primary database
- **Sequelize ORM** for database operations
- **Migration system** for schema versioning
- **Seeding system** for initial data

### Key Models
- **Users**: User accounts and profiles
- **Admins**: Administrative users
- **Jobs**: Job postings and requirements
- **CVs**: Candidate resumes and data
- **Sessions**: User session management
- **Permissions**: Role and permission definitions
- **Companies**: Company information
- **Admin Notes**: Administrative annotations

### Data Relationships
- **One-to-Many**: User → Sessions, User → CVs
- **Many-to-Many**: Users ↔ Permissions, Users ↔ Roles
- **Polymorphic**: Admin Notes (can reference multiple entities)

## 🤖 AI-Powered Features

### CV Processing
- **OCR Text Extraction**: Document text extraction
- **AI Data Extraction**: Skills, education, experience parsing
- **Intelligent Matching**: Job-candidate compatibility scoring
- **Data Validation**: Automated data verification

### OpenAI Integration
- **Text Analysis**: CV content analysis
- **Skill Extraction**: Automated skill identification
- **Content Generation**: AI-assisted content creation
- **Data Enrichment**: Enhanced candidate profiles

## 📧 Notification System

### Email System
- **Template-based emails** (React templates)
- **Multi-language support** (EN/FR)
- **Scheduled emails** with RabbitMQ
- **Email queuing** for reliability

### Notification Types
- **Welcome emails** for new users
- **Job notifications** for candidates
- **Admin alerts** for system events
- **Custom notifications** via API

### React Email Templates
- **Component-based** email design
- **Responsive layouts** for all devices
- **Brand consistency** across all communications
- **Easy customization** and maintenance

## 🔄 Message Queuing

### RabbitMQ Integration
- **Asynchronous processing** for heavy tasks
- **Email queuing** for reliable delivery
- **Background job processing**
- **Scalable message handling**

### Queue Types
- **Email Queue**: Notification processing
- **CV Processing Queue**: AI analysis tasks
- **Admin Task Queue**: Administrative operations
- **System Event Queue**: System-wide notifications

## 🐳 Development Setup

This project supports multiple development workflows with Docker infrastructure.

### Option 1: Hybrid Development (Recommended)
**Local app + Docker infrastructure** - Best for development with hot reload and debugging.

```bash
# Start infrastructure services (PostgreSQL, Redis, RabbitMQ)
npm run infra:up

# Start the application locally with hot reload
npm run start:dev

# Or use the combined command
npm run dev
```

### Option 2: Full Docker Development
**Everything in Docker** - Complete containerized environment.

```bash
# Start everything in Docker
npm run dev:full

# With logs
npm run dev:full:logs
```

### Option 3: Debug Mode
**Local app + Docker infrastructure with debugging**

```bash
# Start infrastructure and app in debug mode
npm run dev:debug
```

## 📋 Available Scripts

### Core Development Scripts
- `npm run start:dev` - Start application with hot reload
- `npm run start:debug` - Start application in debug mode
- `npm run build` - Build the application
- `npm run lint` - Run ESLint with auto-fix

### Infrastructure Management
- `npm run infra:up` - Start infrastructure services (PostgreSQL, Redis, RabbitMQ)
- `npm run infra:down` - Stop all infrastructure services
- `npm run infra:logs` - View infrastructure logs in real-time
- `npm run infra:restart` - Restart infrastructure services
- `npm run infra:status` - Check infrastructure service status

### Docker Management
- `npm run docker:start` - Start all services in Docker
- `npm run dev:full` - Start everything in Docker
- `npm run dev:full:logs` - Start everything with logs
- `npm run logs:app` - View application logs
- `npm run logs:all` - View all service logs
- `npm run restart:app` - Restart the application container
- `npm run rebuild:app` - Rebuild and restart the application container

### Development Workflows
- `npm run dev` - Hybrid development (infrastructure + local app)
- `npm run dev:debug` - Hybrid development with debugging
- `npm run clean` - Clean up Docker volumes and containers

### Testing
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:cov` - Run tests with coverage
- `npm run test:e2e` - Run end-to-end tests

### Code Quality
- `npm run format` - Format code with Prettier
- `npm run lint` - Lint code with ESLint

### API Documentation
- `npm run generate:sdk` - Generate client SDK from OpenAPI spec

## 🗄️ Database Setup

### PostgreSQL Configuration
- **Port**: 8083 (configurable via `DB_PORT` in `.env`)
- **Default Database**: `hrplatform`
- **Connection Pool**: Optimized for production workloads
- **SSL Support**: Configurable for production environments

### Database Initialization
The database is automatically initialized with:
- Database creation
- User permissions setup
- Initial schema (via Sequelize auto-sync in development)
- Basic roles and permissions seeding
- Sample data for development

### Direct Database Access
```bash
# Connect to PostgreSQL
psql -h localhost -p 8083 -U postgres -d hrplatform

# Or using Docker
docker compose exec postgres psql -U postgres -d hrplatform
```

### Migration Management
```bash
# Run migrations
npx sequelize-cli db:migrate

# Undo last migration
npx sequelize-cli db:migrate:undo

# Run seeders
npx sequelize-cli db:seed:all
```

## 🐳 Docker Services

### Infrastructure Services
- **PostgreSQL**: Database server (port 8083)
- **Redis**: Caching and session storage (port 6379)
- **RabbitMQ**: Message queue (ports 5672, 15672 for management)

### Application Service
- **App**: NestJS application (port 3000)

### Service Dependencies
- **Health checks** for all services
- **Automatic restart** on failure
- **Volume persistence** for data
- **Network isolation** for security

## 🔍 Monitoring & Logs

### View Logs
```bash
# Infrastructure logs
npm run infra:logs

# Application logs
npm run logs:app

# All logs
npm run logs:all
```

### Health Checks
```bash
# Check service status
npm run infra:status

# Health check endpoints
curl http://localhost:3000/health
```

### Monitoring Features
- **Application metrics** collection
- **Performance monitoring** with DataDog
- **Error tracking** and alerting
- **Resource usage** monitoring

## 🔧 Troubleshooting

### Common Issues

#### Port Conflicts
If you get port conflicts, modify the ports in `.env`:
```env
DB_PORT=8084  # Change from 8083
REDIS_PORT=6380  # Change from 6379
RABBITMQ_PORT=5673  # Change from 5672
```

#### Database Connection Issues
```bash
# Restart PostgreSQL
npm run infra:restart

# Check PostgreSQL logs
docker compose logs postgres

# Verify connection settings
docker compose exec postgres psql -U postgres -c "\l"
```

#### Clean Start
```bash
# Clean everything and start fresh
npm run clean
npm run dev
```

### Reset Database
```bash
# Remove volumes and restart
docker compose down -v
npm run infra:up
```

### Performance Issues
```bash
# Check resource usage
docker stats

# Monitor application performance
npm run logs:app | grep "performance"

# Database query optimization
docker compose exec postgres psql -U postgres -d hrplatform -c "SELECT * FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10;"
```

## 📚 API Documentation

Once the application is running:
- **Swagger UI**: http://localhost:3000/api
- **OpenAPI JSON**: http://localhost:3000/api-json
- **Postman Collection**: Available in `/docs` folder

### API Features
- **RESTful endpoints** with consistent patterns
- **Request/Response validation** with DTOs
- **Error handling** with standardized responses
- **Rate limiting** for API protection
- **Authentication middleware** for protected routes

### Client SDK
- **Auto-generated TypeScript client**
- **Type-safe API calls**
- **Error handling** and retry logic
- **Request/response interceptors**

## 🚀 Production

### Production Deployment
```bash
# Build the application
npm run build

# Start in production mode
npm run start:prod
```

### Environment Configuration
```env
NODE_ENV=production
DB_HOST=your-production-db-host
DB_PORT=5432
DB_NAME=hrplatform_prod
REDIS_URL=your-production-redis-url
RABBITMQ_URL=your-production-rabbitmq-url
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=your-aws-region
```

### Production Considerations
- **SSL/TLS** for secure connections
- **Load balancing** for high availability
- **Database clustering** for scalability
- **Monitoring and alerting** setup
- **Backup and recovery** procedures
- **Security hardening** measures

## 🔒 Security Features

### Authentication Security
- **JWT token rotation** for enhanced security
- **Session invalidation** on logout
- **Password hashing** with bcrypt
- **Rate limiting** for brute force protection

### Data Security
- **Input sanitization** to prevent injection attacks
- **Output encoding** to prevent XSS
- **CORS configuration** for frontend security
- **Environment variable** protection

### Infrastructure Security
- **Docker security** best practices
- **Network isolation** between services
- **Volume encryption** for sensitive data
- **Regular security updates** for dependencies

## 📊 Performance Optimization

### Database Optimization
- **Connection pooling** for efficient database connections
- **Query optimization** with Sequelize
- **Indexing strategy** for fast queries
- **Caching layer** with Redis

### Application Optimization
- **Code splitting** for smaller bundles
- **Lazy loading** for modules
- **Memory management** for long-running processes
- **Async processing** for heavy operations

## 🤝 Contributing

### Development Workflow
1. **Fork the repository**
2. **Create feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit changes** (`git commit -m 'Add amazing feature'`)
4. **Push to branch** (`git push origin feature/amazing-feature`)
5. **Open Pull Request**

### Code Standards
- **TypeScript strict mode** compliance
- **ESLint rules** adherence
- **Prettier formatting** consistency
- **Test coverage** requirements
- **Documentation updates** for new features

### Testing Requirements
- **Unit tests** for all new functionality
- **Integration tests** for API endpoints
- **E2E tests** for critical user flows
- **Performance tests** for new features

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

### Getting Help
- **Documentation**: Check this README and code comments
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Use GitHub Discussions for questions
- **Wiki**: Additional documentation in repository wiki

### Community
- **Contributors**: List of project contributors
- **Code of Conduct**: Community guidelines
- **Changelog**: Version history and updates
- **Roadmap**: Future development plans
