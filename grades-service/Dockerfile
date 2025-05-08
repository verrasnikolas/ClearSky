# Use Node.js 18 as the base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files first to leverage Docker caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all project files
COPY . .

# Command to run the app
CMD ["node", "index.js"]