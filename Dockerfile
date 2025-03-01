FROM node:20.11.0

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies including dev dependencies for build
RUN npm install --quiet --no-optional --no-fund --loglevel=error

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Remove dev dependencies
RUN npm prune --production

# Verify the build output exists
RUN ls -la dist/src/main.js || exit 1

# Set the working directory for runtime
WORKDIR /app

EXPOSE 3001

CMD ["node", "dist/src/main.js"]