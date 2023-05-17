# Base image
FROM nginx:latest

# Copy the build files to the nginx HTML directory
COPY ./dist/acme-explorer /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx when the container is run
CMD ["nginx", "-g", "daemon off;"]