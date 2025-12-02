# Guía para Verificar el Problema del 404

## Pasos de Diagnóstico

### 1. Verificar que el contenedor esté corriendo

```powershell
docker ps
```

Deberías ver un contenedor llamado `pharmakin-app` corriendo.

### 2. Verificar los logs del contenedor

```powershell
docker logs pharmakin-app
```

Busca mensajes de error o información sobre dónde está buscando los archivos estáticos.

### 3. Verificar que el frontend se construyó

```powershell
docker exec pharmakin-app ls -la /app/static/
```

Deberías ver archivos como `index.html`, `assets/`, etc.

### 4. Verificar el endpoint de salud

Abre en el navegador:
```
http://localhost:5000/api/health
```

Deberías ver: `{"status":"ok"}`

### 5. Verificar qué archivos hay en static

```powershell
docker exec pharmakin-app ls -la /app/static/
docker exec pharmakin-app cat /app/static/index.html | head -20
```

---

## Solución Rápida: Reconstruir el Contenedor

Si el frontend no se construyó correctamente:

```powershell
cd C:\Users\jorge\Downloads\Cursor\Metodos_Numericos\PIA\pharmakin
docker-compose down
docker-compose build --no-cache
docker-compose up
```

Esto reconstruirá todo desde cero.

---

## Alternativa: Ejecutar Manualmente (Sin Docker)

Si Docker sigue dando problemas, ejecuta manualmente:

**Terminal 1 - Backend:**
```powershell
cd C:\Users\jorge\Downloads\Cursor\Metodos_Numericos\PIA\pharmakin\backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

**Terminal 2 - Frontend:**
```powershell
cd C:\Users\jorge\Downloads\Cursor\Metodos_Numericos\PIA\pharmakin\frontend
npm install
npm run dev
```

Luego abre: **http://localhost:3000**

