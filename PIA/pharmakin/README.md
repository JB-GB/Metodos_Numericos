# PharmaKin - Simulador de Farmacocinética

Proyecto Integrador de Aprendizaje que implementa un simulador interactivo de farmacocinética con métodos numéricos.

## 🚀 Inicio Rápido

### Opción 1: Docker (Recomendado - Un Solo Comando)
```bash
# Windows
start.bat

# Linux/Mac
./start.sh
```
Luego abre: **http://localhost:5000**

### Opción 2: Manual
Ver [GUIA_EJECUCION.md](GUIA_EJECUCION.md) para instrucciones detalladas paso a paso.

## Descripción

PharmaKin es una herramienta educativa que permite:
- Simular la concentración de fármacos en sangre usando diferentes métodos numéricos
- Comparar métodos de Euler, Runge-Kutta 4 y solución exacta
- Explorar principios activos y sus parámetros farmacocinéticos
- Aprender sobre farmacocinética a través de contenido educativo interactivo

## Estructura del Proyecto

```
pharmakin/
├── backend/              # API Python (Flask)
│   ├── app.py           # Servidor Flask
│   ├── numerical_methods.py  # Implementación de métodos numéricos
│   ├── requirements.txt
│   └── data/
│       └── active_principles.json  # Base de datos de principios activos
└── frontend/            # Aplicación React
    ├── src/
    │   ├── App.tsx
    │   ├── components/
    │   │   └── Sidebar.tsx
    │   └── pages/
    │       ├── MainPanel.tsx
    │       ├── EducationalZone.tsx
    │       ├── InteractiveDictionary.tsx
    │       ├── ActivePrinciples.tsx
    │       └── UseCase.tsx
    ├── package.json
    └── vite.config.ts
```

## Requisitos

- Python 3.8+
- Node.js 16+
- npm o yarn

## Instalación y Ejecución

### Backend (Python)

1. Navegar a la carpeta del backend:
```bash
cd PIA/pharmakin/backend
```

2. Crear un entorno virtual (recomendado):
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate
```

3. Instalar dependencias:
```bash
pip install -r requirements.txt
```

4. Ejecutar el servidor:
```bash
python app.py
```

El servidor estará disponible en `http://localhost:5000`

### Frontend (React)

1. Navegar a la carpeta del frontend:
```bash
cd PIA/pharmakin/frontend
```

2. Instalar dependencias:
```bash
npm install
```

3. Ejecutar en modo desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## Características

### Panel Principal
- Simulación en tiempo real de concentración de fármacos
- Comparación de métodos numéricos (Euler, Runge-Kutta, Exacto)
- Visualización de ventana terapéutica
- Ajuste de parámetros en tiempo real

### Zona Educativa
- Introducción a farmacocinética
- Modelo de compartimento único
- Vías de administración
- Parámetros farmacocinéticos
- Métodos numéricos explicados

### Diccionario Interactivo
- Términos relacionados con farmacocinética
- Navegación entre términos relacionados
- Fórmulas y definiciones

### Principios Activos
- Base de datos de principios activos
- Información farmacocinética completa
- Búsqueda y filtrado

### Caso de Uso
- Ejemplo práctico paso a paso
- Comparación detallada de métodos numéricos
- Análisis de errores

## Ecuación Diferencial

El modelo farmacocinético se basa en la ecuación:

```
V × dC/dt = u(t) - Q × C(t)
```

Donde:
- **V**: Volumen plasmático efectivo (L)
- **Q**: Tasa de eliminación metabólica (L/h)
- **u(t)**: Tasa de administración (depende de la vía)
- **C(t)**: Concentración del fármaco en sangre (mg/L)

## Métodos Numéricos Implementados

1. **Solución Exacta**: Usando factor integrante
2. **Método de Euler**: Aproximación de primer orden
3. **Runge-Kutta 4**: Aproximación de cuarto orden

## Notas

- Las imágenes de principios activos se cargan desde URLs externas (Unsplash)
- El proyecto está diseñado para ser educativo y de referencia
- Todos los métodos numéricos están comentados en detalle

## Autor

Proyecto desarrollado como Producto Integrador de Aprendizaje para Métodos Numéricos.

