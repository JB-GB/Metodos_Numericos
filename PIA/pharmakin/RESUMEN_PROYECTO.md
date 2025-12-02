# Resumen del Proyecto PharmaKin

## ✅ Proyecto Completado

Se ha desarrollado exitosamente el **Producto Integrador de Aprendizaje: PharmaKin**, un simulador interactivo de farmacocinética con métodos numéricos.

## 🎯 Características Implementadas

### Backend (Python)
- ✅ **Métodos Numéricos Completos**:
  - Solución Exacta (usando factor integrante)
  - Método de Euler (primer orden)
  - Método de Runge-Kutta 4 (cuarto orden)
- ✅ **API REST con Flask**:
  - Endpoint `/api/simulate` para simulaciones
  - Endpoint `/api/active-principles` para consultar principios activos
  - Endpoint `/api/active-principles/search` para búsqueda
- ✅ **Base de Datos de Principios Activos**:
  - 6 principios activos con información completa
  - Parámetros farmacocinéticos para cada uno
  - Información de presentaciones y costos

### Frontend (React + TypeScript)
- ✅ **Panel Principal**:
  - Simulación en tiempo real
  - Comparación de métodos numéricos
  - Visualización de ventana terapéutica
  - Ajuste de parámetros en tiempo real
  - Explicación de la lógica detrás de la gráfica
- ✅ **Zona Educativa**:
  - Introducción a farmacocinética
  - Modelo de compartimento único
  - Vías de administración (oral, IV, tópica)
  - Parámetros farmacocinéticos
  - Métodos numéricos explicados
  - Aplicaciones en ingeniería biomédica
- ✅ **Diccionario Interactivo**:
  - 20+ términos relacionados con farmacocinética
  - Navegación entre términos relacionados
  - Fórmulas y definiciones
  - Búsqueda interactiva
- ✅ **Principios Activos (Pokedex)**:
  - Base de datos visual
  - Búsqueda y filtrado
  - Información completa de cada principio activo
  - Parámetros farmacocinéticos
- ✅ **Caso de Uso**:
  - Ejemplo práctico paso a paso
  - Comparación detallada de métodos
  - Análisis de errores
  - Gráficas comparativas

### Navegación
- ✅ Menú lateral con todas las secciones
- ✅ Diseño responsive y moderno
- ✅ Interfaz intuitiva y educativa

## 📁 Estructura del Proyecto

```
PIA/pharmakin/
├── backend/
│   ├── app.py                    # Servidor Flask
│   ├── numerical_methods.py     # Métodos numéricos (comentados)
│   ├── requirements.txt         # Dependencias Python
│   ├── run.py                   # Script de ejecución
│   └── data/
│       └── active_principles.json  # Base de datos
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx              # Componente principal
│   │   ├── components/
│   │   │   └── Sidebar.tsx     # Menú lateral
│   │   └── pages/              # Todas las páginas
│   ├── package.json            # Dependencias Node.js
│   └── vite.config.ts          # Configuración Vite
│
├── README.md                   # Documentación principal
├── INSTRUCCIONES.md            # Guía de instalación
└── RESUMEN_PROYECTO.md         # Este archivo
```

## 🔬 Ecuación Diferencial Implementada

```
V × dC/dt = u(t) - Q × C(t)
```

Donde:
- **V**: Volumen plasmático efectivo (L)
- **Q**: Tasa de eliminación metabólica (L/h)
- **u(t)**: Tasa de administración (depende de la vía)
- **C(t)**: Concentración del fármaco (mg/L)

## 📊 Métodos Numéricos

1. **Solución Exacta**: 
   - Usa factor integrante: `C(t) = e^(-Q×t/V) × [C₀ + ∫(u(s)/V × e^(Q×s/V)) ds]`
   - Integración numérica con regla del trapecio compuesta

2. **Método de Euler**:
   - Aproximación de primer orden: `C(t+dt) = C(t) + dt × dC/dt`
   - Simple pero menos preciso

3. **Runge-Kutta 4**:
   - Aproximación de cuarto orden
   - Mayor precisión que Euler
   - Usa promedio ponderado de 4 estimaciones

## 🎨 Tecnologías Utilizadas

### Backend
- Python 3.8+
- Flask (API REST)
- NumPy (cálculos numéricos)
- Flask-CORS (soporte CORS)

### Frontend
- React 18
- TypeScript
- Vite (build tool)
- React Router (navegación)
- Recharts (gráficas)
- Tailwind CSS (estilos)
- Lucide React (iconos)
- Axios (peticiones HTTP)

## 🚀 Cómo Ejecutar

### Backend
```bash
cd PIA/pharmakin/backend
pip install -r requirements.txt
python app.py
```

### Frontend
```bash
cd PIA/pharmakin/frontend
npm install
npm run dev
```

Ver `INSTRUCCIONES.md` para detalles completos.

## 📝 Comentarios en el Código

Todo el código de métodos numéricos está **extensamente comentado** para que los desarrolladores puedan entender:
- Qué hace cada método
- Cómo funciona matemáticamente
- Por qué se implementa de esa manera
- Relación con la teoría farmacocinética

## 🎓 Valor Educativo

El proyecto cumple con todos los requisitos:
- ✅ Modela un problema de ingeniería biomédica con EDO
- ✅ Implementa métodos numéricos (Euler, Runge-Kutta)
- ✅ Compara con solución exacta
- ✅ Presenta resultados con gráficas y tablas
- ✅ Incluye interpretación del problema
- ✅ Es educativo y accesible
- ✅ Destaca aplicaciones en ingeniería

## 🔄 Próximos Pasos (Opcional)

Si deseas expandir el proyecto:
- Agregar más principios activos a la base de datos
- Implementar modelos de múltiples compartimentos
- Agregar más métodos numéricos (Adams-Bashforth, etc.)
- Incluir análisis de sensibilidad
- Agregar exportación de datos
- Implementar historial de simulaciones

## ✨ Características Destacadas

1. **Interfaz Moderna**: Diseño limpio y profesional con Tailwind CSS
2. **Tiempo Real**: Simulaciones que se actualizan instantáneamente
3. **Educativo**: Contenido explicativo en cada sección
4. **Completo**: Todas las funcionalidades solicitadas implementadas
5. **Documentado**: Código comentado y documentación completa
6. **Extensible**: Fácil agregar nuevos principios activos o métodos

---

**Proyecto desarrollado como Producto Integrador de Aprendizaje para Métodos Numéricos**

