# frontend-web/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy dependency definitions
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build for production (optional, but good practice)
RUN npm run build

# Expose the port
EXPOSE 3000

# Start the app
CMD ["npm", "run", "dev"]
