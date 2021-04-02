#
# Builder stage.
# This state compile our React App to get the JavaScript code
#
FROM node:12.13.0 AS builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig*.json ./
COPY ./src ./src
COPY ./public ./public
RUN npm ci --quiet && npm run build

# Stage 2
FROM nginx:1.17.1-alpine
COPY --from=builder /usr/src/app/build /usr/share/nginx/html