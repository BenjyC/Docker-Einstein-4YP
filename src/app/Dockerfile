FROM node:8.11.4-alpine
RUN apk update

RUN mkdir -p /src
RUN npm install express-generator -g
RUN apk add python

WORKDIR /src
COPY ./app /src
RUN npm install

EXPOSE 3000
CMD node app/bin/www
