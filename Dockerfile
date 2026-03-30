FROM node:20-alpine AS build
WORKDIR /app
COPY mini-app/package.json mini-app/package-lock.json ./
RUN npm ci
COPY mini-app/ .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE ${PORT:-80}
CMD sh -c "sed -i 's/listen 80/listen '${PORT:-80}'/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"
