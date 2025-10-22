# ./rngfrontend/Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
# Нужны dev deps для сборки
RUN npm ci
COPY . .
RUN npm run build

# Если хочется похудеть node_modules до рантайма, можно так:
# RUN npm prune --omit=dev

FROM nginx:alpine
RUN apk add --no-cache curl
# свой nginx.conf с history fallback (см. ниже)
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
