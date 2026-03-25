# Usa una versión ligera de Node.js
FROM node:20-alpine

# Crea la carpeta de trabajo dentro del docker
WORKDIR /app

# Copia archivos de dependencias e instala
COPY package*.json ./
RUN npm install

# Copia el resto del código
COPY . .

# Expone el puerto que usa nuestro backend
EXPOSE 3001

# Comando para iniciar el servidor
CMD ["node", "index.js"]