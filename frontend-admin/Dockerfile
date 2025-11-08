FROM node:16-alpine as builder
WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn install --ignore-scripts
COPY . .
RUN yarn build
# Prune off the dev dependencies after build step
RUN yarn install --production --ignore-scripts

FROM nginx:1.21.0-alpine as production
ENV NODE_ENV production
COPY --from=builder /app/build /usr/share/nginx/html
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
# Default nginx port
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]