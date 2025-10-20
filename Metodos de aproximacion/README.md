Proyecto: Métodos numéricos — Diferenciación e Integración

Instrucciones rápidas:

1) Crear un entorno virtual (recomendado) e instalar dependencias:

   En PowerShell:

   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   pip install -r requirements.txt

2) Ejecutar los scripts:

   python run_differentiation.py
   python run_integration.py   # pendiente de implementar

3) Salidas:

   Los resultados se guardan en `outputs/` dentro de esta carpeta.

Notas:
- Las implementaciones evitan librerías para el cálculo numérico (se usan
  fórmulas paso a paso). Solo se usan librerías para exportar/mostrar tablas.
- Leer `diferenciacion_Integracion.md` para la explicación teórica de cada
  fórmula.

Bootstrap multiplataforma (Windows / Linux / macOS)
-----------------------------------------------

Se incluyó un helper `bootstrap_env.py` que crea un entorno virtual y
instala las dependencias desde `requirements.txt`. Esto hace que el proyecto
sea fácil de ejecutar tanto en Windows como en Linux.

Pasos rápidos:

- En Windows (PowerShell):

   python bootstrap_env.py
   .\.venv\Scripts\Activate.ps1
   python run_differentiation.py

- En Linux / macOS:

   python3 bootstrap_env.py
   source .venv/bin/activate
   python run_differentiation.py

Notebook de reporte
-------------------

Se agregó `report.ipynb` que carga las funciones del módulo, muestra tablas
y grafica errores (si `pandas` y `matplotlib` están disponibles). Abre el
notebook después de activar el entorno virtual.

Automatización y modo sin pandas
--------------------------------

Los runners aceptan `--no-pandas` para generar CSV nativo en caso de que
no quieras instalar `pandas`/`openpyxl`. Ejemplos:

   python run_differentiation.py --no-pandas
   python run_integration.py --no-pandas

Si prefieres que todo sea automático (bootstrap + ejecución), puedes ejecutar:

Windows PowerShell:

   python bootstrap_env.py; .\.venv\Scripts\Activate.ps1; python run_differentiation.py

Linux/macOS:

   python3 bootstrap_env.py && source .venv/bin/activate && python run_differentiation.py

