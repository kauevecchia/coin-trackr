<div align="center">
  <img src="frontend/public/images/dashboard-screenshot.png" alt="CoinTrackr Logo" width="120" height="120">
  
  # CoinTrackr
  
  **Track Your Crypto Portfolio Like a Pro**
</div>

CoinTrackr is a modern cryptocurrency portfolio tracking application that helps you monitor your crypto investments, track real-time prices, and analyze your portfolio performance with an intuitive dashboard. Built with cutting-edge technologies, it provides transparency, security, and comprehensive analytics for your digital assets.

## Table of Contents

- [Introduction](#introduction)
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

## Conclusion

CoinTrackr provides a comprehensive solution for cryptocurrency portfolio management, combining modern web technologies with real-time data updates to deliver an exceptional user experience. Whether you're a casual investor or a serious trader, CoinTrackr helps you make informed decisions about your crypto investments.

---

If you find any bugs or have a feature request, please open an issue on [GitHub](https://github.com/kauevecchia/coin-trackr/issues).