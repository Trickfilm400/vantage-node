FROM node:16-alpine3.15 AS builder

WORKDIR /build

# copy files and run build, then install production dependencies
COPY . .
RUN npm ci
RUN npm run build
RUN npm ci --only=production

FROM node:16-alpine3.15

MAINTAINER Trickfilm400, info@trickfilm400.de

WORKDIR /app

# copy project files
COPY package.json .
COPY package-lock.json .
COPY static/ ./static
COPY healthCheck.js .
COPY --from=builder /build/dist/ ./dist/
COPY --from=builder /build/node_modules/ ./node_modules/

# healthcheck
HEALTHCHECK --interval=10s --retries=2 CMD node healthCheck.js || exit 1

# change user permissions
RUN chown node:node -R *
# switch to node user for more security
USER node

ENTRYPOINT ["node", "."]
