FROM node:10.16.1

RUN mkdir -p /root/web-app
COPY ./package.json ./package-lock.json /root/web-app/
WORKDIR /root/web-app
RUN npm install
