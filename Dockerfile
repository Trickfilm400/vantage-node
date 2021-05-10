FROM node:14-alpine3.13

MAINTAINER Trickfilm400, info@trickfilm400.de

WORKDIR /app

COPY package.json .
COPY package-lock.json .
COPY static/ /static
COPY healthCheck.js .
COPY dist/ .
RUN npm ci

HEALTHCHECK --interval=10s --retries=2 CMD node healthCheck.js || exit 1

ENTRYPOINT ["npm", "start"]
