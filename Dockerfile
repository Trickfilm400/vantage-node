FROM node:14-alpine3.13

MAINTAINER Trickfilm400, info@trickfilm400.de

WORKDIR /app

COPY dist/ .
COPY package.json .
COPY static/ /static
COPY package-lock.json .
RUN npm ci

ENTRYPOINT ["npm", "start"]
