# HR Platform Frontend

A modern Next.js 14 frontend application for HR management with TypeScript, Tailwind CSS, and comprehensive authentication system.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- pnpm or npm
- Modern web browser

### Installation
```bash
# Install dependencies
pnpm install
# or
npm install

# Copy environment file (if not exists)
cp .env.example .env.local
```

### Development
```bash
# Start development server
pnpm dev
# or
npm run dev

# Build for production
pnpm build
# or
npm run build

# Start production server
pnpm start
# or
npm run start
```

## 🏗️ Architecture Overview

### Technology Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context + Custom Hooks
- **Authentication**: JWT with social login (Google, LinkedIn)
- **Testing**: Cypress E2E
- **Package Manager**: pnpm

### Project Structure
```
frontend/
├── app/                    # Next.js App Router
│   ├── (dashboard)/       # Protected dashboard routes
│   ├── auth/              # Authentication routes
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components (shadcn/ui)
│   ├── auth/             # Authentication components
│   ├── dashboard/        # Dashboard-specific components
│   └── form-steps/       # Multi-step form components
├── lib/                   # Utility libraries
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API services
│   └── stores/           # State stores
├── hooks/                 # Additional custom hooks
├── interfaces/            # TypeScript interfaces
└── public/                # Static assets
```

## 🔐 Authentication System

### Features
- **JWT-based authentication** with refresh tokens
- **Social login integration** (Google, LinkedIn)
- **Role-based access control** (RBAC)
- **Protected routes** with middleware
- **Session management** with cookies

### Authentication Flow
1. User initiates login (email/password or social)
2. Backend validates credentials and returns JWT tokens
3. Frontend stores tokens in secure cookies
4. Middleware validates tokens on protected routes
5. Permission system checks user roles and permissions

### Protected Routes
- `/dashboard/*` - Main application dashboard
- `/account/*` - User account management
- `/candidates/*` - Candidate management
- `/contacts/*` - Contact management

## 🎨 UI Components

### Component Library
- **shadcn/ui**: Modern, accessible UI components
- **Custom components**: Tailored for HR platform needs
- **Responsive design**: Mobile-first approach
- **Dark/Light mode**: Theme support

### Key Components
- **AppSidebar**: Main navigation sidebar
- **CandidateCard**: Candidate display component
- **MultiStepForm**: Multi-step form wizard
- **PermissionGuard**: Route protection component
- **FormCacheIndicator**: Form state persistence

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile-First Features
- Touch-friendly interfaces
- Responsive navigation
- Optimized forms for mobile
- Progressive enhancement

## 🔄 State Management

### Context Providers
- **AuthContext**: User authentication state
- **PermissionContext**: User permissions and roles
- **FormCacheContext**: Form data persistence

### Custom Hooks
- **useAuth**: Authentication state and methods
- **usePermissions**: Permission checking
- **useFormCache**: Form data caching
- **useMobile**: Responsive breakpoint detection

## 🧪 Testing

### E2E Testing with Cypress
```bash
# Run Cypress tests
pnpm cypress:open
# or
npm run cypress:open

# Run tests in headless mode
pnpm cypress:run
# or
npm run cypress:run
```

### Test Structure
- **E2E tests**: User journey testing
- **Component tests**: Individual component testing
- **Integration tests**: API integration testing

## 🚀 Performance Optimization

### Features
- **Next.js Image optimization**
- **Code splitting** with dynamic imports
- **Lazy loading** for components
- **Bundle analysis** and optimization
- **Service worker** for caching

### Build Optimization
- **Tree shaking** for unused code removal
- **Minification** and compression
- **Asset optimization** and caching
- **CDN-ready** static assets

## 🔧 Configuration

### Environment Variables
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_LINKEDIN_CLIENT_ID=your_linkedin_client_id
```

### Next.js Configuration
- **App Router**: Modern Next.js routing
- **TypeScript**: Strict type checking
- **ESLint**: Code quality enforcement
- **Prettier**: Code formatting
- **Tailwind**: Utility-first CSS framework

## 📦 Available Scripts

### Development
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm type-check` - TypeScript type checking

### Testing
- `pnpm cypress:open` - Open Cypress test runner
- `pnpm cypress:run` - Run Cypress tests
- `pnpm test` - Run all tests

### Build & Deploy
- `pnpm build` - Production build
- `pnpm export` - Static export
- `pnpm analyze` - Bundle analysis

## 🚀 Deployment

### Production Build
```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

### Static Export
```bash
# Export static files
pnpm export

# Deploy to any static hosting service
```

### Docker Deployment
```dockerfile
# Use multi-stage build for optimization
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

## 🔍 Development Tools

### Code Quality
- **ESLint**: JavaScript/TypeScript linting
- **Prettier**: Code formatting
- **TypeScript**: Static type checking
- **Husky**: Git hooks for quality checks

### Development Experience
- **Hot reload**: Instant feedback during development
- **TypeScript**: IntelliSense and error detection
- **Tailwind CSS**: Rapid UI development
- **Component library**: Consistent design system

## 📚 Additional Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Best Practices
- **Component composition**: Reusable and maintainable components
- **Type safety**: Full TypeScript coverage
- **Performance**: Optimized rendering and loading
- **Accessibility**: WCAG compliance
- **SEO**: Search engine optimization

## 🤝 Contributing

### Development Workflow
1. Create feature branch
2. Implement changes with tests
3. Run linting and type checking
4. Submit pull request
5. Code review and approval

### Code Standards
- Follow TypeScript best practices
- Use consistent naming conventions
- Write meaningful commit messages
- Include tests for new features
- Update documentation as needed

## 📄 License

MIT License - see LICENSE file for details