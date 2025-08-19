# Use Node.js 18 Alpine as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Verify tsx installation
RUN npx tsx --version

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose port
EXPOSE 3333

# Start the application
CMD ["npm", "run", "start:dev"] 