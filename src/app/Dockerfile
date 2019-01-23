FROM node:8.11.4-alpine

RUN mkdir -p /src
RUN npm install express-generator -g

WORKDIR /src
COPY ./app /src
RUN npm install

EXPOSE 3000
CMD node app/bin/www
