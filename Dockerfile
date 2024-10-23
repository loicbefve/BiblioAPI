# Use the official Node.js image
FROM node:23-alpine AS build

# Set the working directory
WORKDIR /usr/src/app

# Copy the package.json and yarn.lock files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of your application code
COPY . .

# Build the application
RUN yarn build

# Production Stage
FROM node:23-alpine AS production

# Set the working directory
WORKDIR /usr/src/app

# Copy only necessary files from the build stage
COPY --from=build /usr/src/app .

# Install production dependencies only
RUN yarn install --production

# Expose the port the app runs on
EXPOSE 3000

# Command to run your application
CMD [ "yarn", "start" ]
