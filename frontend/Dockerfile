FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Construimos la app para producción (optimización)
RUN npm run build

EXPOSE 3000

# Iniciamos el servidor de Next.js
CMD ["npm", "start"]