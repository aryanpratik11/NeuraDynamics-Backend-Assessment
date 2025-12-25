# from Node.js image
FROM node:18-alpine

WORKDIR /app

# Copy and install dependencies
COPY package*.json ./
RUN npm install

# Copy codes
COPY . .

# Expose port
EXPOSE 3000

# Start server
CMD ["node", "server.js"]
