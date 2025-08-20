# AttendanceHub - Enterprise HR Time & Attendance Platform

A comprehensive HR attendance platform built with React, Node.js, and PostgreSQL for enterprise-grade employee time tracking, attendance management, and payroll processing.

## 🚀 Features

- **Time Tracking**: Clock-in/out with geolocation verification
- **Employee Management**: Complete CRUD operations for employee data
- **Multi-Language Support**: English, Arabic, Hebrew with RTL support
- **Role-Based Access**: Employee, Manager, HR Admin, Auditor roles
- **PWA Support**: Mobile-first design with offline capabilities
- **Real-time Analytics**: Dashboard with attendance metrics
- **PTO Management**: Leave requests and approval workflows
- **Device Management**: Support for biometric time clocks
- **Audit Trails**: Comprehensive logging and compliance features

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Session-based authentication
- **Build Tools**: Vite + ESBuild
- **State Management**: TanStack React Query
- **Mobile**: Progressive Web App (PWA)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd attendancehub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/attendancehub
   SESSION_SECRET=your-super-secret-session-key-here
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5000`

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open Drizzle Studio for database management

## 🏗️ Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utility functions
├── server/                 # Backend Express application
│   ├── routes.ts           # API routes
│   ├── storage.ts          # Database operations
│   └── auth-simple.ts      # Authentication logic
├── shared/                 # Shared TypeScript types and schemas
│   └── schema.ts           # Database schema definitions
├── public/                 # Static assets
└── migrations/             # Database migration files
```

## 🔐 Authentication

The platform uses a simple session-based authentication system for development. In production, this would integrate with enterprise identity providers.

**Test Accounts:**
- Employee: ID `46581947`
- Manager: ID `manager-1` 
- HR Admin: ID `hr-admin-1`

## 🌍 Multi-Language Support

The platform supports:
- **English** (LTR)
- **Arabic** (RTL) 
- **Hebrew** (RTL)

Language switching is available in the user interface with automatic RTL layout support.

## 📱 PWA Features

- Offline capability
- Install prompts on mobile devices
- Service worker for caching
- Responsive design for all screen sizes

## 🔒 Security Features

- Input validation using Zod schemas
- SQL injection prevention with parameterized queries
- Session-based authentication with secure cookies
- Role-based access control
- Audit logging for all operations
- GDPR/CCPA compliance features

## 🚀 Deployment

### Replit Deployment
This project is optimized for Replit deployment:

1. Import this repository into Replit
2. Set up the PostgreSQL database in Replit
3. Configure environment variables in Replit Secrets
4. The project will auto-configure and deploy

### Manual Deployment
For other platforms:

1. Build the project: `npm run build`
2. Set up PostgreSQL database
3. Configure environment variables
4. Run: `npm start`

## 📊 Database Schema

The platform uses PostgreSQL with the following main tables:
- `users` - User accounts and authentication
- `employees` - Employee data and profiles
- `punches` - Time clock entries
- `timesheets` - Calculated time periods
- `pto_requests` - Leave requests and approvals
- `devices` - Time clock device management
- `audit_logs` - System activity tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review existing issues
- Create a new issue with detailed information

---

Built with ❤️ for enterprise HR teams worldwide.