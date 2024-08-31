FROM node
WORKDIR /app

COPY . .
EXPOSE 3000

COPY package*.json ./

RUN npm start
