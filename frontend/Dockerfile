<<<<<<< HEAD
FROM node:20 AS build

WORKDIR /app
COPY package*.json ./
=======
FROM node:18 AS build
WORKDIR /app
COPY package.json package-lock.json* ./
>>>>>>> upstream/main
RUN npm install
COPY . .
RUN npm run build

<<<<<<< HEAD

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
=======
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
>>>>>>> upstream/main
