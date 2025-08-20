# AttendanceHub - Enterprise Time & Attendance Platform

## Overview

AttendanceHub is a comprehensive HR attendance platform built as a full-stack TypeScript application following the official HR Attendance Platform Requirements Document (v3). The system provides secure, policy-aware time tracking, team management, PTO requests, payroll reporting, and device management capabilities for enterprise environments. It follows a modern monorepo structure with a React frontend and Express backend, designed to handle multi-tenant operations with role-based access control.

The platform supports multiple clock-in methods including biometric devices, web interfaces, kiosks, and mobile/PWA applications, with geolocation tracking and photo evidence capabilities. It includes sophisticated policy engines for calculating overtime, break rules, and payroll compliance with audit trails and export capabilities.

## Requirements Alignment (v3 Document)

**Core Vision**: Deliver a secure, policy-aware Time & Attendance platform that ingests events from biometric/edge devices, enables review/approval, calculates payable time accurately, and produces payroll-ready outputs.

**Key Requirements Met**:
- Multi-channel time capture (web clock, mobile PWA)
- Policy engine foundation (rounding, grace, breaks, overtime)
- Timesheet review and approval workflows
- PTO/leave management with accruals
- Role-based access control (Employee, Manager, HR Admin, Auditor)
- Multi-language support (English, Arabic, Hebrew)
- Audit trail and security measures
- Device management capabilities
- Reporting and export functionality

## User Preferences

Preferred communication style: Simple, everyday language.

## Development Guidelines (Updated Aug 18, 2025)

**Priority Order:**
1. Security first - protect user data, validate inputs, use secure coding practices
2. Correctness second - don't break working features, fix bugs only when necessary
3. Documentation third - JSDoc format with @param, @returns, @throws
4. Maintainability last - style improvements only if no security/correctness conflicts

**Code Modification Rules:**
- Only modify code when it improves security, fixes bugs, or adds required documentation
- Never rewrite working code just for style
- Use camelCase for variables/functions, PascalCase for classes, UPPER_SNAKE_CASE for constants
- 2 spaces indentation, semicolons required, opening braces on same line

**Security Requirements:**
- Validate and sanitize all inputs
- Use parameterized queries/ORM, never manual SQL strings
- Hash passwords with bcrypt/Argon2
- Encrypt sensitive data (employee IDs, personal info)
- Environment variables for secrets, never hardcode
- Generic error messages to users, detailed logs on server
- Rate-limit auth routes
- GDPR/CCPA compliance for HR data

## Security Implementation Status (Applied Aug 18, 2025)

**Completed Security Measures:**
- ✓ Added comprehensive JSDoc documentation with @security and @compliance tags
- ✓ Input validation using Zod schemas enforced across all API endpoints  
- ✓ Role-based access control documented and enforced in storage layer
- ✓ Audit logging middleware capturing all data modifications
- ✓ Tenant isolation implemented in database queries
- ✓ Generic error messages to users, detailed logging on server
- ✓ Hash-based duplicate detection for punch records
- ✓ Database operations use parameterized queries via Drizzle ORM
- ✓ Environment variables used for all secrets (DATABASE_URL, SESSION_SECRET)

**Security Documentation Added:**
- File-level security overviews for all backend modules
- Method-level @security tags explaining data protection measures
- @compliance annotations for GDPR/CCPA requirements
- Security considerations documented in schema definitions

**Code Quality Improvements:**
- Fixed TypeScript diagnostics and type safety issues
- Added proper error handling and validation
- Implemented secure coding patterns throughout
- Enhanced documentation following JSDoc standards

## Recent Platform Fixes (Aug 20, 2025)

**Critical Issues Resolved:**
- ✅ Fixed all LSP diagnostics errors - platform now error-free
- ✅ Resolved duplicate translation keys causing 25+ console warnings
- ✅ Improved location service error handling - no more console spam
- ✅ Added graceful geolocation error handling with user-friendly messages
- ✅ Fixed TypeScript type safety issues in clock-card component
- ✅ Enhanced Service Worker for proper PWA functionality

**Current Status:**
- Platform running smoothly without console errors
- Multi-language support fully functional (English, Arabic, Hebrew)  
- Location services handle permission denied/unavailable gracefully
- All authentication and time tracking features working properly
- TypeScript errors completely resolved across all components
- Proper type safety implemented for all data structures

## System Architecture

### Frontend Architecture
- **React + TypeScript SPA** using Vite for build tooling and hot module replacement
- **UI Framework**: shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **State Management**: TanStack React Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation schemas
- **Theme System**: CSS variables with dark/light mode support

### Backend Architecture
- **Express.js REST API** with TypeScript for type safety
- **Authentication**: Replit OIDC integration with session-based auth using express-session
- **Authorization**: Role-based access control (Employee, Manager, HR Admin, Auditor) with tenant isolation
- **Middleware Stack**: Request logging, audit trails, authentication guards, and error handling

### Data Storage Solutions
- **Primary Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Connection Pool**: Neon serverless PostgreSQL with WebSocket support
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple
- **Schema Management**: Drizzle migrations in `migrations/` directory

### Authentication and Authorization
- **OIDC Provider**: Replit authentication with JWT tokens
- **Session Management**: Encrypted sessions stored in PostgreSQL with configurable TTL
- **Multi-tenancy**: Tenant isolation enforced at database and API level
- **Role Hierarchy**: Granular permissions with site-based access control

### Data Models and Relationships
- **User Management**: Users linked to employees with role assignments
- **Time Tracking**: Punches, timesheets, and policy calculations
- **Organizational**: Sites, managers, and hierarchical reporting
- **Leave Management**: PTO requests with approval workflows
- **Device Management**: Physical time clocks with status monitoring
- **Audit Trail**: Comprehensive logging of all system actions

### Policy Engine
- **Time Calculations**: Rounding rules, grace periods, break deductions
- **Overtime Logic**: Multiple overtime thresholds with different rates
- **Compliance**: Labor law compliance with configurable rules per jurisdiction

### API Structure
- **RESTful Endpoints**: Standard HTTP methods with JSON payloads
- **Authentication Routes**: Login/logout with OIDC flow
- **Resource APIs**: CRUD operations for punches, timesheets, employees, PTO
- **Analytics Endpoints**: Reporting and dashboard data aggregation
- **Device APIs**: Clock device integration and status monitoring

## External Dependencies

### Core Framework Dependencies
- **React 18** with TypeScript for frontend development
- **Express.js** with TypeScript for backend API server
- **Vite** for frontend build tooling and development server
- **Node.js** runtime environment

### Database and ORM
- **PostgreSQL** as primary database (configured for Neon serverless)
- **Drizzle ORM** for type-safe database queries and schema management
- **@neondatabase/serverless** for PostgreSQL connection pooling

### Authentication Services
- **Replit OIDC** for user authentication and session management
- **openid-client** for OIDC protocol implementation
- **Passport.js** with OIDC strategy for authentication middleware

### UI and Styling
- **Tailwind CSS** for utility-first styling with custom design system
- **Radix UI** component primitives for accessible UI components
- **Lucide React** for consistent iconography
- **shadcn/ui** component library built on Radix primitives

### Development and Build Tools
- **TypeScript** for type safety across full stack
- **ESBuild** for server-side bundling and optimization
- **PostCSS** with Autoprefixer for CSS processing
- **Drizzle Kit** for database migrations and schema management

### Data Management
- **TanStack React Query** for server state management and caching
- **React Hook Form** with **@hookform/resolvers** for form handling
- **Zod** for runtime type validation and schema generation
- **date-fns** for date manipulation and formatting

### Session and Security
- **express-session** with **connect-pg-simple** for PostgreSQL session storage
- **WebSocket** support via ws package for real-time features

### Monitoring and Logging
- **Built-in audit logging** system with PostgreSQL storage
- **Request/response logging** middleware for API monitoring
- **Error tracking** with structured error handling