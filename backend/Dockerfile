# ---- Build Stage ----
FROM node:18-bullseye-slim AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including devDependencies for TypeScript)
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the TypeScript code
RUN npm run build

# ---- Production Stage ----
FROM node:18-bullseye-slim

WORKDIR /app

# Copy only production package files
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production --legacy-peer-deps

# Copy compiled code from builder
COPY --from=builder /app/dist ./dist

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Expose port
EXPOSE 5000

# Start the application
CMD ["node", "dist/server.js"]
