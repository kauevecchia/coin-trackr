# CoinTrackr

**Track Your Crypto Portfolio Like a Pro**

CoinTrackr is a modern cryptocurrency portfolio tracking application that helps you monitor your crypto investments, track real-time prices, and analyze your portfolio performance with an intuitive dashboard. Built with cutting-edge technologies, it provides transparency, security, and comprehensive analytics for your digital assets.

## Table of Contents

- [Introduction](#introduction)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Features](#features)
- [Conclusion](#conclusion)

## Introduction

- **Portfolio Management**: Track buy/sell transactions with automatic P&L calculations
- **Real-time Dashboard**: Live portfolio overview with current values and performance metrics
- **Price Updates**: Automatic cryptocurrency price updates via CoinGecko API
- **WebSocket Integration**: Real-time price updates and portfolio changes
- **Analytics**: Interactive charts showing portfolio distribution and performance
- **Secure Authentication**: JWT-based login/register system with encrypted passwords
- **Transaction History**: Complete transaction log with filtering capabilities
- **Responsive Design**: Mobile-friendly interface with modern UI components

## Project Structure

### Front-End

```
frontend/                    # Next.js React application
├── src/
│   ├── app/                 # App Router pages and layouts
│   │   ├── (app)/          # Protected app routes
│   │   │   ├── account/    # User account management
│   │   │   ├── analytics/  # Portfolio analytics
│   │   │   ├── dashboard/ # Main dashboard
│   │   │   ├── portfolio/ # Portfolio overview
│   │   │   └── transactions/ # Transaction management
│   │   └── (auth)/         # Authentication routes
│   │       ├── login/      # Login page
│   │       └── register/   # Registration page
│   ├── components/         # Reusable UI components
│   │   ├── analytics/      # Analytics components
│   │   ├── auth/          # Authentication components
│   │   └── ui/            # Base UI components (shadcn/ui)
│   ├── hooks/             # Custom React hooks
│   ├── contexts/          # React context providers
│   ├── services/          # API service layers
│   ├── schemas/           # Form validation schemas
│   ├── lib/               # Utility libraries
│   │   └── recharts/      # Chart components
│   └── styles/            # Global styles
├── public/                # Static assets
│   └── images/            # Image assets
├── components.json        # shadcn/ui configuration
├── next.config.ts         # Next.js configuration
├── package.json           # Frontend dependencies
└── tsconfig.json          # TypeScript configuration
```

### Back-End

```
backend/                   # Node.js Express API
├── src/
│   ├── http/              # HTTP layer
│   │   ├── controllers/   # Route controllers
│   │   │   ├── admin/     # Admin endpoints
│   │   │   ├── crypto/    # Crypto data endpoints
│   │   │   ├── transactions/ # Transaction endpoints
│   │   │   └── users/     # User management endpoints
│   │   └── middlewares/   # Express middlewares
│   ├── use-cases/         # Business logic layer
│   │   ├── factories/     # Use case factories
│   │   └── errors/        # Custom error classes
│   ├── repositories/      # Data access layer
│   │   ├── prisma/        # Prisma implementations
│   │   └── in-memory/     # In-memory implementations (testing)
│   ├── services/          # External service integrations
│   ├── lib/               # Shared utilities
│   ├── cron/              # Scheduled tasks
│   ├── config/            # Configuration files
│   ├── env/               # Environment configuration
│   ├── utils/             # Utility functions
│   │   └── test/          # Test utilities
│   ├── scripts/           # Utility scripts
│   └── generated/         # Generated files
├── prisma/                # Database schema and migrations
│   ├── migrations/        # Database migration files
│   └── vitest-environment-prisma/ # Test environment setup
├── docker-compose.yml    # Production Docker setup
├── docker-compose.dev.yml # Development Docker setup
├── Dockerfile            # Production Docker image
├── Dockerfile.dev        # Development Docker image
├── package.json          # Backend dependencies
└── tsconfig.json         # TypeScript configuration
└── README.md                 # Project documentation
```

## Technologies Used

### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - Modern UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Radix UI** - Accessible components
- **Recharts** - Interactive charts
- **React Hook Form** - Form management
- **Socket.io Client** - Real-time communication
- **Lucide React** - Beautiful icons

### Backend

- **Node.js** + **Express.js** - Web server
- **TypeScript** - Type-safe development
- **PostgreSQL** - Relational database
- **Prisma** - Modern ORM and migrations
- **JWT** - Secure authentication
- **bcryptjs** - Password hashing
- **Socket.io** - Real-time communication
- **node-cron** - Scheduled tasks
- **Axios** - HTTP client
- **Zod** - Schema validation
- **Vitest** - Unit testing

## Installation

Before you start, ensure you have `node`, `npm`, and `docker` installed on your machine.

1. **Clone the repository**:
   
   ```bash
   git clone https://github.com/your-username/coin-trackr.git
   ```

2. **Navigate to the repository**:

   ```bash
   cd coin-trackr
   ```

3. **Install the dependencies**:

   - For Frontend:
   
     ```bash
     cd frontend && npm install
     ```

   - For Backend:

     ```bash
     cd backend && npm install
     ```

4. **Configure environment variables**:

   Create `.env` file in backend directory:

   ```env
   NODE_ENV=development
   PORT=3333
   DATABASE_URL=postgresql://username:password@localhost:5432/coin-trackr-api
   JWT_SECRET=your-super-secret-jwt-key
   COINGECKO_API_KEY=your-coingecko-api-key
   CRON_SCHEDULE=*/5 * * * *
   CRON_TIMEZONE=America/Sao_Paulo
   CRON_ENABLED=true
   ```

5. **Setup database**:

   ```bash
   cd backend && npx prisma migrate dev
   cd backend && npm run run:populate-cache
   ```

## Running the Application

- **To run the frontend**:

  ```bash
  cd frontend && npm run dev
  ```

  This starts the Next.js application on `http://localhost:3000`.

- **To run the backend**:

  ```bash
  cd backend && npm run start:dev
  ```

  This starts the Node.js server on `http://localhost:3333`.

- **To run with Docker**:

  For development:
  ```bash
  cd backend && docker compose -f docker-compose.dev.yml up --build
  ```

  For production:
  ```bash
  cd backend && docker compose up --build
  ```

## Features

- **🔐 Secure Authentication**: JWT-based login/register system with encrypted passwords
- **💼 Portfolio Management**: Track buy/sell transactions with automatic P&L calculations
- **📊 Real-time Dashboard**: Live portfolio overview with current values and performance metrics
- **📈 Analytics**: Interactive charts showing portfolio distribution and performance
- **🔄 Price Updates**: Automatic cryptocurrency price updates via CoinGecko API
- **⚡ WebSocket Integration**: Real-time price updates and portfolio changes
- **📱 Responsive Design**: Mobile-friendly interface with modern UI components
- **👤 Account Management**: User profile management and password reset functionality
- **📋 Transaction History**: Complete transaction log with filtering capabilities
- **🛡️ Data Security**: Enterprise-grade security and encryption

---

If you find any bugs or have a feature request, please open an issue on [GitHub](https://github.com/kauevecchia/coin-trackr/issues).