FROM node:10.16.1

# This Dockerfile builds a monolithic container for running the API and 
# serving the front-end from the same container/server

# NOTE: Host (local) paths are relative to the root of the pictochat git repo

# Install dependencies
RUN mkdir -p /pictochat/
WORKDIR /pictochat
COPY ./package.json ./package-lock.json ./
RUN npm install

# Install back-end deps.
RUN mkdir -p /pictochat/pictochat-be
WORKDIR /pictochat/pictochat-be
COPY ./package.json ./package-lock.json ./
RUN npm install

# Install front-end deps.
RUN mkdir -p /pictochat/pictochat-fe
WORKDIR /pictochat/pictochat-fe
COPY ./package.json ./package-lock.json ./
RUN npm install
