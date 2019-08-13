FROM node:10.16.1

RUN mkdir -p /root/web-app-be
COPY ./package.json ./package-lock.json /root/web-app-be/
WORKDIR /root/web-app-be
RUN npm install
CMD ["node", "app.js"]
