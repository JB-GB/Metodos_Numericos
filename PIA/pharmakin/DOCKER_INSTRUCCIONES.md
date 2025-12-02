# Instrucciones para Ejecutar con Docker

## Requisitos
- Docker instalado
- Docker Compose instalado (viene con Docker Desktop)

## Ejecución Rápida

### Windows
```bash
start.bat
```

### Linux/Mac
```bash
chmod +x start.sh
./start.sh
```

O manualmente:
```bash
docker-compose up --build
```

## Acceso a la Aplicación

Una vez que los contenedores estén corriendo, abre tu navegador en:
- **http://localhost:5000**

La aplicación estará completamente funcional.

## Detener la Aplicación

Presiona `Ctrl+C` en la terminal, o ejecuta:
```bash
docker-compose down
```

## Reconstruir desde Cero

Si necesitas reconstruir completamente:
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up
```

## Notas

- La primera vez puede tardar varios minutos mientras descarga las imágenes y construye el proyecto
- El frontend se construye automáticamente dentro del contenedor
- Los datos de principios activos se cargan desde `backend/data/active_principles.json`
- El puerto 5000 debe estar libre en tu sistema

