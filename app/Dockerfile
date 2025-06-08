# Use the official Node.js image as the base image
FROM node:20-alpine as build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install --frozen-lockfile

# Copy the rest of your application's source code
COPY . .

# Build the React app for production
RUN npm run build

# Use a lightweight web server (nginx) to serve the built React app
FROM nginx:alpine

# Copy the built app from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
