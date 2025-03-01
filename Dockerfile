FROM node:20.11.0

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --quiet --no-optional --no-fund --loglevel=error

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Set the working directory for runtime
WORKDIR /app

EXPOSE 3001

CMD ["npm", "run", "start:prod"]