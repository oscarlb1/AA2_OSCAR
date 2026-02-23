FROM node:lts-alpine

# Directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json primero para aprovechar la caché de Docker
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del proyecto
COPY . .

# Exponer el puerto de Vite en modo desarrollo
EXPOSE 5173

# Levantar Vite en modo desarrollo accesible desde fuera del contenedor
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]