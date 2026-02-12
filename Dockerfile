# Step 1: Build the React application
FROM node:20-slim AS build

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Get value from Cloud Build and set it as an environment variable
ARG VITE_PUBLIC_API_URL
ENV VITE_PUBLIC_API_URL=$VITE_PUBLIC_API_URL

# Build the application
RUN npm run build

# Step 2: Serve the application using Nginx
FROM nginx:alpine

# Copy the build output to the Nginx html directory
# Vite defaults to 'dist'
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 8080 (Cloud Run default)
EXPOSE 8080

# Start Nginx
# We use a shell to replace the port in the config if the PORT env var is provided
CMD ["/bin/sh", "-c", "sed -i 's/8080/'\"$PORT\"'/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
