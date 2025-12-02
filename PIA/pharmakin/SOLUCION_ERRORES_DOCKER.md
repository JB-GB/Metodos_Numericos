# Solución de Errores de Docker

## Error: "The system cannot find the file specified" / "dockerDesktopLinuxEngine"

Este error significa que **Docker Desktop no está corriendo** en tu sistema.

### Solución Paso a Paso:

#### 1. Verificar que Docker Desktop esté instalado

1. Busca "Docker Desktop" en el menú de inicio de Windows
2. Si no lo encuentras, necesitas instalarlo:
   - Descarga desde: https://www.docker.com/products/docker-desktop
   - Instala Docker Desktop para Windows
   - Reinicia tu computadora después de la instalación

#### 2. Iniciar Docker Desktop

1. **Abre Docker Desktop** desde el menú de inicio
2. **Espera a que inicie completamente**:
   - Verás un ícono de Docker en la bandeja del sistema (abajo a la derecha)
   - El ícono debe estar verde/activo (no gris)
   - Puede tardar 1-2 minutos en iniciar completamente

3. **Verifica que esté corriendo**:
   - Haz clic derecho en el ícono de Docker en la bandeja
   - Debe decir "Docker Desktop is running"

#### 3. Verificar Docker desde PowerShell

Abre PowerShell y ejecuta:
```powershell
docker --version
docker ps
```

Si ves la versión de Docker y una lista (aunque esté vacía), Docker está funcionando.

#### 4. Intentar de nuevo

Una vez que Docker Desktop esté corriendo:
```powershell
cd PIA\pharmakin
.\start.bat
```

---

## Error: "version is obsolete" (Warning)

Este es solo un **warning**, no un error crítico. Ya lo corregimos eliminando la línea `version: '3.8'` del `docker-compose.yml`.

---

## Si Docker Desktop no inicia

### Problema: Docker Desktop no arranca

**Posibles causas:**
1. **WSL 2 no está instalado** (requerido para Docker Desktop en Windows)
2. **Virtualización no habilitada** en BIOS
3. **Hyper-V no está habilitado**

### Solución 1: Instalar WSL 2

1. Abre PowerShell **como Administrador**
2. Ejecuta:
```powershell
wsl --install
```
3. Reinicia tu computadora
4. Intenta abrir Docker Desktop de nuevo

### Solución 2: Verificar Virtualización

1. Presiona `Windows + R`
2. Escribe `msinfo32` y presiona Enter
3. Busca "Virtualización habilitada en el firmware"
4. Debe decir "Sí"
5. Si dice "No", necesitas habilitarla en la BIOS de tu computadora

### Solución 3: Usar Modo Manual (Sin Docker)

Si Docker sigue dando problemas, puedes ejecutar el proyecto manualmente:

**Terminal 1 - Backend:**
```powershell
cd PIA\pharmakin\backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

**Terminal 2 - Frontend:**
```powershell
cd PIA\pharmakin\frontend
npm install
npm run dev
```

Luego abre: http://localhost:3000

---

## Verificación Rápida

Ejecuta estos comandos para verificar:

```powershell
# Verificar Docker
docker --version
docker ps

# Verificar que Docker Desktop esté corriendo
Get-Process "Docker Desktop"
```

Si todos los comandos funcionan, Docker está listo.

---

## Resumen

✅ **Error principal**: Docker Desktop no está corriendo
✅ **Solución**: Abre Docker Desktop y espera a que inicie completamente
✅ **Warning**: Ya corregido (versión eliminada de docker-compose.yml)

Si después de seguir estos pasos sigue sin funcionar, usa la **Opción Manual** que no requiere Docker.

