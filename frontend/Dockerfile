FROM node:16-alpine as builder
WORKDIR /app
COPY . .
RUN yarn install --ignore-scripts && yarn build

FROM nginx:1.21.0-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY ./nginx/default.conf /etc/nginx/nginx.conf
EXPOSE 80

CMD ["/bin/sh", "-c", "envsubst < /usr/share/nginx/html/template-runtime-env.js > /usr/share/nginx/html/runtime-env.js && nginx -g \"daemon off;\""]