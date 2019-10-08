FROM node:10.16.1

# This Dockerfile builds a monolithic container for running the API and 
# serving the front-end from the same container/server

# NOTE: Host (local) paths are relative to the root of the pictochat git repo


RUN mkdir -p /pictochat/
WORKDIR /pictochat

COPY . ./

# Install dependencies
#COPY ./package.json ./package-lock.json ./
RUN npm install && npm run build
