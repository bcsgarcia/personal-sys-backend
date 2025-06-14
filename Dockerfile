FROM node:20.11.0-alpine

# Instalar curl para healthcheck
RUN apk add --no-cache curl

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev dependencies for build)
RUN npm ci --quiet --no-optional --no-fund

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Debug: List contents of dist directory
RUN ls -la dist/

# Remove dev dependencies after build
RUN npm prune --production

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership of the app directory
RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/personal/health || exit 1

CMD ["node", "dist/main.js"]


#FROM node:20.11.0
#
## Create app directory
#WORKDIR /app
#
## Copy package files
#COPY package*.json ./
#
## Install dependencies including dev dependencies for build
#RUN npm install --quiet --no-optional --no-fund --loglevel=error
#
## Copy source code
#COPY . .
#
## Build the application
#RUN npm run build
#
## Remove dev dependencies
#RUN npm prune --production
#
## Debug: List contents of dist directory
#RUN ls -la dist/
#
## Set the working directory for runtime
#WORKDIR /app
#
#EXPOSE 3000
#
#CMD ["node", "dist/main.js"]