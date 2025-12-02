# 🚀 Guía Paso a Paso para Ejecutar PharmaKin

Esta guía te mostrará cómo ejecutar el proyecto PharmaKin de dos maneras: con Docker (más fácil) o manualmente.

---

## 📋 Opción 1: Ejecutar con Docker (Recomendado - Más Fácil)

### Requisitos Previos
- ✅ Docker Desktop instalado ([Descargar aquí](https://www.docker.com/products/docker-desktop))
- ✅ Docker Compose (viene incluido con Docker Desktop)

### Pasos

#### Windows:
1. **Abre PowerShell o CMD** en la carpeta del proyecto
   ```bash
   cd PIA\pharmakin
   ```

2. **Ejecuta el script de inicio**
   ```bash
   start.bat
   ```
   
   O manualmente:
   ```bash
   docker-compose up --build
   ```

3. **Espera a que termine la construcción**
   - La primera vez puede tardar 5-10 minutos
   - Verás mensajes como "Building frontend..." y "Building backend..."
   - Al final verás: "Running on http://0.0.0.0:5000"

4. **Abre tu navegador**
   - Ve a: **http://localhost:5000**
   - ¡La aplicación debería estar funcionando!

#### Linux/Mac:
1. **Abre una terminal** en la carpeta del proyecto
   ```bash
   cd PIA/pharmakin
   ```

2. **Da permisos de ejecución al script** (solo la primera vez)
   ```bash
   chmod +x start.sh
   ```

3. **Ejecuta el script**
   ```bash
   ./start.sh
   ```
   
   O manualmente:
   ```bash
   docker-compose up --build
   ```

4. **Espera y abre el navegador**
   - Ve a: **http://localhost:5000**

### Detener la Aplicación
- Presiona `Ctrl + C` en la terminal donde está corriendo
- O ejecuta: `docker-compose down`

---

## 📋 Opción 2: Ejecutar Manualmente (Sin Docker)

### Requisitos Previos
- ✅ Python 3.8 o superior
- ✅ Node.js 16 o superior ([Descargar aquí](https://nodejs.org/))
- ✅ npm (viene con Node.js)

### Paso 1: Configurar el Backend (Python)

1. **Abre una terminal** y navega a la carpeta del backend
   ```bash
   cd PIA\pharmakin\backend
   ```

2. **Crea un entorno virtual** (recomendado)
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate
   
   # Linux/Mac
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Instala las dependencias**
   ```bash
   pip install -r requirements.txt
   ```

4. **Verifica que el archivo de datos existe**
   - Debe existir: `backend/data/active_principles.json`
   - Si no existe, créalo con la estructura correcta

5. **Ejecuta el servidor backend**
   ```bash
   python app.py
   ```
   
   Deberías ver:
   ```
   * Running on http://127.0.0.1:5000
   ```

### Paso 2: Configurar el Frontend (React)

1. **Abre una NUEVA terminal** (deja el backend corriendo)

2. **Navega a la carpeta del frontend**
   ```bash
   cd PIA\pharmakin\frontend
   ```

3. **Instala las dependencias** (solo la primera vez)
   ```bash
   npm install
   ```
   
   ⚠️ Esto puede tardar varios minutos la primera vez

4. **Ejecuta el servidor de desarrollo**
   ```bash
   npm run dev
   ```
   
   Deberías ver:
   ```
   VITE v5.x.x  ready in xxx ms
   ➜  Local:   http://localhost:3000/
   ```

### Paso 3: Acceder a la Aplicación

1. **Abre tu navegador**
   - Ve a: **http://localhost:3000**
   - El frontend se conectará automáticamente al backend en el puerto 5000

2. **Verifica que todo funciona**
   - Deberías ver el menú lateral
   - Puedes navegar entre las diferentes secciones
   - El Panel Principal debería mostrar la simulación

---

## 🔧 Solución de Problemas

### Problema: "Puerto 5000 ya está en uso"
**Solución:**
- Cierra otras aplicaciones que usen el puerto 5000
- O cambia el puerto en `backend/app.py`:
  ```python
  app.run(debug=True, port=5001)  # Cambia a otro puerto
  ```

### Problema: "Puerto 3000 ya está en uso"
**Solución:**
- Cierra otras aplicaciones que usen el puerto 3000
- O Vite usará automáticamente el siguiente puerto disponible

### Problema: "Error al conectar con el backend"
**Solución:**
1. Verifica que el backend esté corriendo en http://localhost:5000
2. Abre http://localhost:5000/api/health en el navegador
3. Deberías ver: `{"status":"ok"}`
4. Si no funciona, revisa los logs del backend

### Problema: "Module not found" en Python
**Solución:**
```bash
# Asegúrate de estar en el entorno virtual
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

# Reinstala dependencias
pip install -r requirements.txt
```

### Problema: "npm install falla"
**Solución:**
```bash
# Limpia la caché
npm cache clean --force

# Elimina node_modules y reinstala
rm -rf node_modules package-lock.json
npm install
```

### Problema: Docker no inicia
**Solución:**
1. Verifica que Docker Desktop esté corriendo
2. Verifica que tengas suficiente espacio en disco
3. Intenta reconstruir:
   ```bash
   docker-compose down
   docker-compose build --no-cache
   docker-compose up
   ```

---

## 📝 Verificación Rápida

### ✅ Checklist Backend
- [ ] Python instalado (`python --version`)
- [ ] Dependencias instaladas (`pip list` muestra flask, numpy, etc.)
- [ ] Backend corriendo en http://localhost:5000
- [ ] `/api/health` responde con `{"status":"ok"}`

### ✅ Checklist Frontend
- [ ] Node.js instalado (`node --version`)
- [ ] Dependencias instaladas (`npm list` muestra react, etc.)
- [ ] Frontend corriendo en http://localhost:3000
- [ ] Puedes ver la interfaz en el navegador

### ✅ Checklist Docker
- [ ] Docker Desktop instalado y corriendo
- [ ] `docker-compose up` ejecutado sin errores
- [ ] Aplicación accesible en http://localhost:5000

---

## 🎯 Comandos Rápidos de Referencia

### Docker
```bash
# Iniciar
docker-compose up --build

# Detener
docker-compose down

# Ver logs
docker-compose logs -f

# Reconstruir desde cero
docker-compose down
docker-compose build --no-cache
docker-compose up
```

### Backend Manual
```bash
# Activar entorno virtual
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar
python app.py
```

### Frontend Manual
```bash
# Instalar dependencias
npm install

# Ejecutar desarrollo
npm run dev

# Construir para producción
npm run build
```

---

## 📞 ¿Necesitas Ayuda?

Si encuentras problemas:
1. Revisa los logs en la terminal
2. Verifica que todos los requisitos estén instalados
3. Asegúrate de que los puertos no estén en uso
4. Revisa que los archivos de datos existan

---

## 🎉 ¡Listo!

Una vez que la aplicación esté corriendo, podrás:
- ✅ Simular farmacocinética en el Panel Principal
- ✅ Aprender en la Zona Educativa
- ✅ Consultar el Diccionario Interactivo
- ✅ Explorar Principios Activos
- ✅ Ver el Caso de Uso detallado

¡Disfruta usando PharmaKin! 🚀

