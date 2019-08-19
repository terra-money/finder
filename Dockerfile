FROM node:lts-alpine as builder
WORKDIR /app
COPY package*.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn run build

FROM nginx:stable-alpine
COPY --from=builder /app/build /usr/share/nginx/html

ARG rpcUrl="http:\\/\\/localhost:26657"
ARG lcdUrl="http:\\/\\/localhost:1317"

ENV RPC_URL $rpcUrl
ENV LCD_URL $lcdUrl

EXPOSE 80
