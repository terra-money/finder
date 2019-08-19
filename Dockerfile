FROM node:lts-alpine as builder
WORKDIR /app
COPY package*.json yarn.lock ./
RUN yarn install
COPY . .
ARG SENTRY_DSN
RUN REACT_APP_SENTRY_DSN=${SENTRY_DSN} yarn run build

FROM nginx:stable-alpine
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80
