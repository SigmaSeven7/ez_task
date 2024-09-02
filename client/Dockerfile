# # Use an official Node.js runtime as a parent image
# FROM node:20-bullseye AS build

# # Set the working directory
# WORKDIR /app

# # Copy package.json and package-lock.json
# COPY package*.json ./

# # Install dependencies
# RUN npm install

# # Copy the rest of the application code
# COPY . .

# # Build the application
# RUN npm run build

# # Use an official Nginx image as the base image for serving the built application
# FROM nginx:alpine
# # Copy the built application from the build stage
# # COPY --from=build /app/dist /usr/share/nginx/html
# # # Copy the Nginx configuration file
# # COPY nginx.conf /etc/nginx/conf.d/default.conf

# COPY --from=build /app/dist /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# # Expose port 80
# EXPOSE 80
# # Start Nginx server
# CMD ["nginx", "-g", "daemon off;"]

# Use an official Node.js runtime as a parent image
FROM node:20-bullseye

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]