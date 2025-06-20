# Use official Node.js runtime
FROM node:18

# Create app directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your gateway code
COPY . .

# Expose port your gateway listens on
EXPOSE 3004

# Start the gateway
CMD ["node", "index.js"]
