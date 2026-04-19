# Stage 1: Build the Vite React App
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy the rest of the application source
COPY . .

# Build the app for production
RUN npm run build

# Stage 2: Run with Express server
FROM node:20-alpine

WORKDIR /app

# Copy package files and install production-only dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy the built frontend from builder stage
COPY --from=builder /app/dist ./dist

# Copy the backend server
COPY server.js ./

# Expose port 8080 (Cloud Run default)
EXPOSE 8080

# Start the Express server
CMD ["node", "server.js"]
