FROM node:18-alpine as dev
WORKDIR /app
COPY . ./
RUN npm ci
EXPOSE 8888
CMD ["npm", "run", "start:dev"]
