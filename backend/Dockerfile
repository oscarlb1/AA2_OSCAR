FROM node:lts-alpine

# Instalar json-server globalmente
RUN npm install -g json-server

# Directorio de trabajo
WORKDIR /app

# Copiar la base de datos
COPY db.json .

# Exponer el puerto 3000 (puerto por defecto de json-server)
EXPOSE 3000

# Levantar json-server escuchando en todas las interfaces
CMD ["json-server", "--watch", "db.json", "--host", "0.0.0.0", "--port", "3000"]
