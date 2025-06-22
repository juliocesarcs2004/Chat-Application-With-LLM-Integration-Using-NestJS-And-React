# --- Stage 1: Build ---
# Use an official Node.js image with Alpine Linux for the build stage
FROM node:18-alpine AS builder

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the dependency files and install them
# This leverages Docker's layer caching, reinstalling dependencies only if package.json changes
COPY package*.json ./
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the application for production
RUN npm run build

# Remove development dependencies to reduce the final image size
RUN npm prune --production

# --- Stage 2: Run ---
# Use a smaller base image for the run stage
FROM node:18-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy the production dependencies and build artifacts from the 'builder' stage
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist

# Expose the port the application will run on
EXPOSE 3000

# Set the command to start the application
CMD [ "node", "dist/main" ]