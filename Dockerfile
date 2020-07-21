FROM node:lts-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG SENTRY_DSN
RUN REACT_APP_SENTRY_DSN=${SENTRY_DSN} npm run build

FROM nginx:stable-alpine
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80
