# Use the official Node.js base image
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json .

# Install dependencies
RUN npm install

# Install PM2 globally
RUN npm install pm2 -g

# Copy your application code
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Use PM2 to start your app using index.js as the entry point
CMD ["pm2-runtime", "index.js"]

