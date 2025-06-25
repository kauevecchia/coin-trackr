# Coin Trackr Backend - Docker Setup

This document explains how to run the coin-trackr backend using Docker.

## Prerequisites

- Docker
- Docker Compose

## Quick Start

### Development Environment

1. **Clone the repository and navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create a `.env` file with your environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Then edit `.env` with your actual values:
   ```env
   NODE_ENV=development
   PORT=3333
   DATABASE_URL=postgresql://docker:docker@localhost:5432/coin-trackr-api
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   COINGECKO_API_KEY=your-coingecko-api-key-here
   ```

3. **Start the development environment:**
   ```bash
   docker-compose -f docker-compose.dev.yml up --build
   ```

4. **Run database migrations:**
   ```bash
   docker-compose -f docker-compose.dev.yml exec backend npx prisma migrate dev
   ```

5. **Access the application:**
   - Backend API: http://localhost:3333
   - PostgreSQL: localhost:5432

### Production Environment

1. **Start the production environment:**
   ```bash
   docker-compose up --build
   ```

2. **Run database migrations:**
   ```bash
   docker-compose exec backend npx prisma migrate deploy
   ```

## Services

### PostgreSQL Database
- **Port:** 5432
- **User:** docker
- **Password:** docker
- **Database:** coin-trackr-api
- **Volume:** postgres_data (persistent data)

### Backend API
- **Port:** 3333
- **Environment:** Development/Production
- **Hot Reload:** Enabled in development

### Redis (Optional)
- **Port:** 6379
- **Purpose:** Caching and sessions
- **Volume:** redis_data (persistent data)

## Useful Commands

### Development
```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up

# Start in background
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f backend

# Stop services
docker-compose -f docker-compose.dev.yml down

# Rebuild and start
docker-compose -f docker-compose.dev.yml up --build
```

### Production
```bash
# Start production environment
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down

# Rebuild and start
docker-compose up --build
```

### Database Operations
```bash
# Run migrations
docker-compose exec backend npx prisma migrate dev

# Generate Prisma client
docker-compose exec backend npx prisma generate

# Open Prisma Studio
docker-compose exec backend npx prisma studio

# Reset database
docker-compose exec backend npx prisma migrate reset
```

### Cleanup
```bash
# Remove all containers and volumes
docker-compose down -v

# Remove all images
docker-compose down --rmi all

# Clean up everything
docker system prune -a
```

## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment mode | `development` | No |
| `PORT` | Application port | `3333` | No |
| `DATABASE_URL` | PostgreSQL connection string | - | Yes |
| `JWT_SECRET` | JWT signing secret | - | Yes |
| `COINGECKO_API_KEY` | CoinGecko API key | - | Yes |

## Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   # Check what's using the port
   lsof -i :3333
   # or
   netstat -tulpn | grep :3333
   ```

2. **Database connection issues:**
   ```bash
   # Check if PostgreSQL is running
   docker-compose ps
   
   # Check database logs
   docker-compose logs postgres
   ```

3. **Permission issues:**
   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER .
   ```

4. **Build issues:**
   ```bash
   # Clean build cache
   docker builder prune
   
   # Rebuild without cache
   docker-compose build --no-cache
   ```

### Health Checks

The services include health checks to ensure they're running properly:

- **PostgreSQL:** Checks if the database is ready to accept connections
- **Redis:** Checks if Redis is responding to ping commands

## Development Tips

1. **Hot Reloading:** The development setup includes volume mounts for hot reloading. Changes to your code will automatically restart the application.

2. **Database Persistence:** Data is persisted in Docker volumes, so it survives container restarts.

3. **Environment Variables:** Use the `.env` file for local development and set proper environment variables in production.

4. **Logs:** Use `docker-compose logs -f [service-name]` to follow logs in real-time.

## Production Considerations

1. **Security:** Change default passwords and secrets
2. **Environment Variables:** Use proper secrets management
3. **SSL/TLS:** Configure HTTPS in production
4. **Monitoring:** Add health checks and monitoring
5. **Backup:** Set up database backups
6. **Scaling:** Consider using Docker Swarm or Kubernetes for scaling 