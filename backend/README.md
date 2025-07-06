# HR Platform Backend

A NestJS-based backend application for HR management with Docker infrastructure support.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- Docker & Docker Compose
- PostgreSQL client (optional, for direct DB access)

### Installation
```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env
```

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


### Database Initialization
The database is automatically initialized with:
- Database creation
- User permissions setup
- Initial schema (via Sequelize auto-sync in development)

### Direct Database Access
```bash
# Connect to PostgreSQL
psql -h localhost -p 8083 -U postgres -d hrplatform

# Or using Docker
docker compose exec postgres psql -U postgres -d hrplatform
```

## 🐳 Docker Services

### Infrastructure Services
- **PostgreSQL**: Database server (port 8083)
- **Redis**: Caching and session storage (port 6379)
- **RabbitMQ**: Message queue (ports 5672, 15672 for management)

### Application Service
- **App**: NestJS application (port 3000)

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

## 🔧 Troubleshooting

### Common Issues

#### Port Conflicts
If you get port conflicts, modify the ports in `.env`:
```env
DB_PORT=8084  # Change from 8083
```

#### Database Connection Issues
```bash
# Restart PostgreSQL
npm run infra:restart

# Check PostgreSQL logs
docker compose logs postgres
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

## 📚 API Documentation

Once the application is running:
- **Swagger UI**: http://localhost:3000/api
- **OpenAPI JSON**: http://localhost:3000/api-json

## 🚀 Production

For production deployment:
```bash
# Build the application
npm run build

# Start in production mode
npm run start:prod
```

## 📝 License

MIT License
