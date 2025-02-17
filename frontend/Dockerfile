FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# React uygulamasını development modunda çalıştır
ENV NODE_ENV=development
ENV CI=true
ENV WDS_SOCKET_PORT=0

EXPOSE 3000

# React uygulamasını başlat
CMD ["npm", "start"] 