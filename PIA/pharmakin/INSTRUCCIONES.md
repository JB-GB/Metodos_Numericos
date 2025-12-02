# Instrucciones de Instalación y Uso - PharmaKin

## Requisitos Previos

- **Python 3.8 o superior**
- **Node.js 16 o superior** (incluye npm)
- **Navegador web moderno** (Chrome, Firefox, Edge)

## Instalación Paso a Paso

### 1. Backend (Python)

#### Opción A: Con entorno virtual (Recomendado)

```bash
# Navegar a la carpeta del backend
cd PIA/pharmakin/backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# En Windows:
venv\Scripts\activate
# En Linux/Mac:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar servidor
python app.py
```

#### Opción B: Sin entorno virtual

```bash
cd PIA/pharmakin/backend
pip install -r requirements.txt
python app.py
```

El servidor estará disponible en: **http://localhost:5000**

### 2. Frontend (React)

Abre una **nueva terminal** (mantén el backend corriendo):

```bash
# Navegar a la carpeta del frontend
cd PIA/pharmakin/frontend

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

La aplicación estará disponible en: **http://localhost:3000**

## Uso de la Aplicación

### Panel Principal
1. Selecciona un principio activo del menú desplegable
2. Ajusta los parámetros (dosis, intervalo, número de dosis, vía)
3. Observa la simulación en tiempo real
4. Compara los diferentes métodos numéricos

### Zona Educativa
- Explora los conceptos de farmacocinética
- Aprende sobre el modelo matemático
- Entiende los métodos numéricos

### Diccionario Interactivo
- Busca términos relacionados con farmacocinética
- Navega entre términos relacionados
- Consulta fórmulas y definiciones

### Principios Activos
- Explora la base de datos de principios activos
- Consulta información farmacocinética
- Busca por nombre o descripción

### Caso de Uso
- Revisa un ejemplo práctico paso a paso
- Compara métodos numéricos en detalle
- Analiza los errores de cada método

## Solución de Problemas

### El backend no inicia
- Verifica que Python esté instalado: `python --version`
- Asegúrate de tener todas las dependencias: `pip install -r requirements.txt`
- Verifica que el puerto 5000 no esté en uso

### El frontend no inicia
- Verifica que Node.js esté instalado: `node --version`
- Asegúrate de haber ejecutado `npm install`
- Verifica que el puerto 3000 no esté en uso

### No se cargan los datos
- Verifica que el backend esté corriendo en http://localhost:5000
- Revisa la consola del navegador para errores
- Verifica la conexión a internet (para imágenes)

### Errores de CORS
- Asegúrate de que el backend tenga `flask-cors` instalado
- Verifica que el proxy en `vite.config.ts` esté configurado correctamente

## Estructura de Archivos Importantes

```
pharmakin/
├── backend/
│   ├── app.py                    # Servidor Flask principal
│   ├── numerical_methods.py     # Métodos numéricos (Euler, RK4, Exacto)
│   ├── requirements.txt         # Dependencias Python
│   └── data/
│       └── active_principles.json  # Base de datos de principios activos
│
└── frontend/
    ├── src/
    │   ├── App.tsx              # Componente principal con rutas
    │   ├── components/
    │   │   └── Sidebar.tsx      # Menú lateral
    │   └── pages/               # Páginas de la aplicación
    ├── package.json             # Dependencias Node.js
    └── vite.config.ts           # Configuración de Vite
```

## Notas Importantes

1. **Mantén ambos servidores corriendo**: El backend (puerto 5000) y el frontend (puerto 3000) deben estar activos simultáneamente.

2. **Primera ejecución**: La primera vez que ejecutes `npm install` puede tardar varios minutos.

3. **Imágenes**: Las imágenes de principios activos se cargan desde URLs externas. Si no hay internet, verás placeholders.

4. **Datos**: La base de datos de principios activos está en formato JSON y se puede editar directamente en `backend/data/active_principles.json`.

## Desarrollo

Para modificar el código:

- **Backend**: Los métodos numéricos están en `numerical_methods.py` con comentarios detallados
- **Frontend**: Los componentes están en `src/pages/` y `src/components/`
- **Datos**: Agregar nuevos principios activos en `backend/data/active_principles.json`

## Contacto y Soporte

Si encuentras problemas o tienes preguntas sobre el proyecto, revisa:
- El archivo `README.md` para información general
- Los comentarios en el código para entender la implementación
- La documentación de los métodos numéricos en `numerical_methods.py`

