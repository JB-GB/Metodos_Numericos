# Dockerfile para PharmaKin - Aplicación completa
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# Copiar archivos del frontend
COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# Backend Python
FROM python:3.11-slim

WORKDIR /app

# Instalar dependencias del backend
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código del backend
COPY backend/ ./

# Crear directorio para datos
RUN mkdir -p data

# Copiar datos
COPY backend/data/ ./data/

# Copiar build del frontend
COPY --from=frontend-builder /app/frontend/dist ./static

# Verificar que los archivos se copiaron correctamente
RUN ls -la ./static/ || echo "Static folder created"
RUN test -f ./static/index.html && echo "index.html found" || echo "index.html NOT found"

# Exponer puerto
EXPOSE 5000

# Comando para ejecutar
CMD ["python", "app.py"]

