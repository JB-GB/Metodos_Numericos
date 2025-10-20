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
