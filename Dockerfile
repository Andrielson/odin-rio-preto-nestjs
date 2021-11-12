# syntax=docker/dockerfile:1
FROM node:lts-alpine3.14 AS installer

RUN apk add --no-cache g++ make python3

WORKDIR /usr/local/src

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

################################################################################
# Rebuild the source code only when needed
FROM node:lts-alpine3.14 AS builder

WORKDIR /usr/local/src

COPY . .

COPY --from=installer /usr/local/src/node_modules ./node_modules

RUN yarn build && \
    yarn install --production --ignore-scripts --prefer-offline

################################################################################
# Production image, copy all the files and run next
FROM node:lts-alpine3.14 AS runner

WORKDIR /srv

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

COPY --from=builder --chown=nestjs:nodejs /usr/local/src/dist ./dist
COPY --from=builder /usr/local/src/node_modules ./node_modules
COPY --from=builder /usr/local/src/package.json ./package.json

USER nestjs

CMD ["node", "dist/main"]