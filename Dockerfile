# Step 1: Build the Vite React App
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the app for production
RUN npm run build

# Step 2: Serve with Nginx
FROM nginx:alpine

# Copy our custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 8080 (Cloud Run prefers 8080 by default)
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
