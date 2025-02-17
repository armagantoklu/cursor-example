FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Node.js uygulamasını development modunda çalıştır
ENV NODE_ENV=development

EXPOSE 5000

# Nodemon ile çalıştır (development için)
CMD ["npx", "nodemon", "server.js"] 