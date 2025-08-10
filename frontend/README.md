# HR Platform Frontend

A comprehensive Next.js 14 frontend application for HR management with AI-powered CV processing, role-based access control, and modern authentication system.

## 🏗️ Architecture Overview

### Core Architecture
The frontend follows a modern, scalable architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Architecture                    │
├─────────────────────────────────────────────────────────────┤
│  App Router (Next.js 14)                                   │
│  ├── Public Routes (Login, Signup, Auth)                  │
│  ├── Protected Routes (Dashboard, Account, Candidates)    │
│  └── API Routes (Auth, CV, User)                          │
├─────────────────────────────────────────────────────────────┤
│  Component Layer                                           │
│  ├── Layout Components (Sidebar, Navigation)              │
│  ├── Feature Components (Candidates, Forms, Dashboard)    │
│  └── UI Components (shadcn/ui + Custom)                   │
├─────────────────────────────────────────────────────────────┤
│  Business Logic Layer                                      │
│  ├── Custom Hooks (useAuth, usePermissions)               │
│  ├── Services (File Upload, API Integration)              │
│  └── State Management (Context + Local State)             │
├─────────────────────────────────────────────────────────────┤
│  Data Access Layer                                         │
│  ├── API Routes (Next.js API)                             │
│  ├── External API Integration (Backend)                   │
│  └── Local Storage & Caching                              │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Custom components
- **State Management**: React Context + Custom Hooks
- **Authentication**: JWT + Social OAuth (Google, LinkedIn)
- **Form Handling**: React Hook Form + Zod validation
- **File Management**: AWS S3 integration
- **Testing**: Cypress E2E

## 🔐 Authentication & Authorization System

### Authentication Flow
```
User Login → JWT Token Generation → Token Storage (Cookies) → Route Protection → Permission Validation
```

### Authentication Methods
- **Email/Password**: Traditional login system
- **Google OAuth**: Social authentication via Google
- **LinkedIn OAuth**: Professional network authentication
- **JWT Tokens**: Secure token-based authentication
- **Session Management**: Persistent user sessions

### Route Protection
- **Middleware-based**: Automatic route protection
- **Public Routes**: Login, signup, auth callbacks
- **Protected Routes**: Dashboard, account, candidates
- **Permission Guards**: Role-based component rendering

### Security Features
- **Token Validation**: JWT token verification
- **Route Guards**: Component-level permission checking
- **Secure Cookies**: HTTP-only cookie storage
- **CSRF Protection**: Built-in Next.js security

## 🎯 Core Features

### 1. User Management System
- **User Registration**: Multi-step onboarding process
- **Profile Management**: Complete user profile creation
- **Role Assignment**: Candidate, Publisher, Admin roles
- **Account Settings**: User preferences and settings

### 2. CV Processing & Management
- **Document Upload**: Secure file upload to AWS S3
- **AI Extraction**: CV data extraction and parsing
- **Skills Management**: Skill proficiency tracking
- **Education Tracking**: Academic background management
- **Experience Management**: Professional experience logging

### 3. Candidate Management
- **Candidate Dashboard**: Comprehensive candidate overview
- **Profile Viewing**: Detailed candidate profiles
- **Search & Filter**: Advanced candidate search
- **Status Tracking**: Application progress monitoring
- **Admin Notes**: Internal candidate annotations

### 4. Multi-Step Form System
- **Progressive Forms**: Step-by-step data collection
- **Form Persistence**: Data caching between steps
- **Validation**: Real-time form validation
- **File Integration**: Document upload integration
- **Progress Tracking**: Visual progress indicators

### 5. Dashboard & Analytics
- **Activity Feed**: Real-time platform activity
- **Statistics Cards**: Key metrics and KPIs
- **Recent Candidates**: Latest candidate updates
- **Quick Actions**: Common task shortcuts

## 🗂️ Application Structure

### App Router Structure
```
app/
├── (dashboard)/              # Protected dashboard routes
│   ├── layout.tsx           # Dashboard layout with sidebar
│   ├── dashboard/            # Main dashboard page
│   ├── candidates/           # Candidate management
│   ├── contacts/             # Contact management
│   ├── referals/             # Referral system
│   └── account/              # User account management
├── auth/                     # Authentication routes
│   ├── google/callback/      # Google OAuth callback
│   └── linkedin/callback/    # LinkedIn OAuth callback
├── api/                      # API routes
│   ├── auth/                 # Authentication endpoints
│   ├── cv/                   # CV processing endpoints
│   └── user/                 # User management endpoints
├── login/                    # Login page
├── signup/                   # Registration page
└── getstarted/               # Onboarding page
```

### Component Architecture
```
components/
├── layout/                   # Layout components
│   ├── app-sidebar.tsx      # Main navigation sidebar
│   └── navigation/          # Navigation components
├── auth/                     # Authentication components
│   ├── ProtectedRoute.tsx   # Route protection
│   └── RedirectIfAuthenticated.tsx
├── candidates/               # Candidate management
│   ├── CandidateCard.tsx    # Candidate display
│   ├── CandidateDetails.tsx # Detailed candidate view
│   └── CandidateFilter.tsx  # Search and filtering
├── dashboard/                # Dashboard components
│   ├── ActivityFeed.tsx     # Activity timeline
│   ├── RecentCandidates.tsx # Recent updates
│   └── StatsCard.tsx        # Metric displays
├── form-steps/               # Multi-step forms
│   ├── multi-step-form.tsx  # Main form orchestrator
│   ├── personal-info-form.tsx
│   ├── documents-form.tsx   # File upload forms
│   ├── skills-form.tsx      # Skills management
│   ├── education-form.tsx   # Education tracking
│   └── form-success.tsx     # Completion page
└── ui/                       # Base UI components (shadcn/ui)
```

### Core Libraries & Services
```
lib/
├── hooks/                    # Custom React hooks
│   ├── useAuth.ts           # Authentication state
│   ├── usePermissions.ts    # Permission checking
│   └── useFormCache.ts      # Form data persistence
├── services/                 # Business logic services
│   ├── fileUpload.ts        # File upload management
│   └── tokenService.ts      # Token management
├── dal/                      # Data access layer
│   └── auth.ts              # Authentication API calls
├── stores/                   # State management
│   └── form-cache-store.ts  # Form data caching
├── axiosInstance.tsx         # HTTP client configuration
├── apiErrorHandler.ts        # Error handling
├── models.ts                 # Data models
└── types.ts                  # TypeScript type definitions
```

## 🔄 Data Flow & State Management

### State Management Architecture
```
User Action → Component → Hook → Service → API → Backend
    ↓
Response → Service → Hook → Component → UI Update
```

### Key State Patterns
- **Authentication State**: Global auth context
- **Permission State**: User permissions and roles
- **Form State**: Multi-step form data persistence
- **UI State**: Component-specific state management
- **Cache State**: Form data and API response caching

### Data Persistence
- **Form Cache**: Local storage for form data
- **Session Storage**: User session information
- **API Caching**: Response caching for performance
- **File Storage**: AWS S3 for document storage

## 🚀 Key Functionalities

### 1. Multi-Step Registration Process
- **Personal Information**: Basic user details
- **Document Upload**: CV and profile picture
- **Skills Assessment**: Professional skills tracking
- **Contact Information**: Professional links and contact
- **Education History**: Academic background
- **Profile Completion**: Final profile review

### 2. AI-Powered CV Processing
- **Document Analysis**: CV content extraction
- **Skill Recognition**: Automated skill identification
- **Data Validation**: Content verification
- **Profile Enrichment**: Enhanced candidate profiles

### 3. Advanced Candidate Management
- **Profile Viewing**: Comprehensive candidate information
- **Status Tracking**: Application progress monitoring
- **Admin Tools**: Internal management features
- **Communication**: Candidate interaction tools

### 4. Role-Based Access Control
- **Permission System**: Granular access control
- **Role Management**: User role assignment
- **Feature Access**: Component-level permissions
- **Admin Controls**: Administrative features

## 🔧 Development & Deployment

### Development Commands
```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run tests
pnpm cypress:open
```

### Environment Configuration
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_LINKEDIN_CLIENT_ID=your_linkedin_client_id
```

### Build & Deploy
- **Static Export**: `pnpm export`
- **Docker Deployment**: Multi-stage Docker builds
- **Vercel Deployment**: Optimized for Next.js
- **Custom Hosting**: Any Node.js hosting platform

## 🧪 Testing Strategy

### Testing Architecture
- **E2E Testing**: Cypress for user journey testing
- **Component Testing**: Individual component validation
- **Integration Testing**: API integration testing
- **Performance Testing**: Load and stress testing

### Test Coverage
- **User Authentication**: Login, registration, OAuth
- **Form Validation**: Multi-step form workflows
- **API Integration**: Backend communication
- **User Flows**: Complete user journeys

## 📊 Performance & Optimization

### Performance Features
- **Code Splitting**: Dynamic imports and lazy loading
- **Image Optimization**: Next.js image optimization
- **Bundle Optimization**: Tree shaking and minification
- **Caching Strategy**: Multiple caching layers

### Optimization Techniques
- **Lazy Loading**: Component and route lazy loading
- **Memoization**: React optimization patterns
- **Bundle Analysis**: Performance monitoring
- **CDN Integration**: Static asset optimization

## 🔒 Security Implementation

### Security Measures
- **JWT Security**: Secure token handling
- **Route Protection**: Middleware-based security
- **Input Validation**: Form and API validation
- **XSS Protection**: Output sanitization
- **CSRF Protection**: Built-in security features

### Authentication Security
- **Token Rotation**: Regular token refresh
- **Secure Storage**: HTTP-only cookies
- **Permission Validation**: Role-based access
- **Session Management**: Secure session handling

---

**HR Platform Frontend** - Modern, scalable, and feature-rich HR management interface built with Next.js 14 and TypeScript.