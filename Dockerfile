FROM node:18-alpine as dev
WORKDIR /app
COPY . .
RUN npm ci
EXPOSE 3337
RUN npm run build
CMD ["npm", "run", "start:prod"]
