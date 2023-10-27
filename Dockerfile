FROM node:18-alpine as dev
WORKDIR /app
COPY . .
RUN npm ci
EXPOSE 8888
RUN npm run build
CMD ["npm", "run", "start:prod"]
