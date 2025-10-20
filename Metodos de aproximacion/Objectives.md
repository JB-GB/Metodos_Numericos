Tengo una tarea que resolver. Para ello quiero realizar un proyecto que pueda ser reutilizablle y nos ayude a realizar diferentes ejercicios. Para esto tenemos que cumplir con ciertos requisitos, en seguida, listo los puntos que la tarea propone y posterior a ello, propongo condiciones.

### Requisitos de la tarea
___
1. Considere $f(x)=x\ln{x}$. Tomando $h=0.1$ aproxime $f'(2)$ mediante:
a) La fórmula de diferencias hacia adelante.
b) La fórmula de diferencias hacia atrás.
c) La fórmula del punto medio de 3 puntos.
d) La fórmula del punto extremo izquierdo de 3 puntos.
e) La fórmula del punto extremo derecho de 3 puntos.
f) Mediante el cálculo diferencial calcule el valor exacto.
g) Disponga los resultados en una tabla resumen que incluya la cota de error teórico de
cada técnica.

2. Aproxime el valor de la integral de $f(x)=1+\ln{x}$ en el intervalo $[1, 2]$.
a) La regla del punto medio.
b) La regla del trapecio.
c) La regla de Simpson.
d) La regla de Simpson compuesta partiendo en 2 subintervalos.
e) La regla del punto medio compuesta partiendo en 5 subintervalos.
f) Mediante el cálculo integral calcule el valor exacto.
g) Disponga los resultados en una tabla resumen que incluya la cota de error teórico de
cada técnica.

### Condiciones del proyecto
___
- El proyecto tiene que ser reutilizable y preferentemente visual. Utilizando Python como herramienta principal.
- Evitar el uso de librerias para las matematicas. Todas las formulas y algoritmos, deben ser representados paso por paso, respetando las notas del archivo "diferenciacion_Integracion.md" como referencia y bibliografia. Solo librerias de representacion grafica para las tablas estan permitidas.
- Priorizar la presicion de los calculos. Queremos intentar que los calculos sean los mas precisos posibles. Así que supongo que para lograr esto, lo mejor es anidar las funciones y calculos, pero sin olvidar el siguiente punto...
- Comentar y explicar incluso las cosas basicas de cada funcion/variable/etc. Esto para lograr que incluso los usuarios mas basico e inexpertos de python, entiendan que hace cada cosa que los programas esten haciendo.
- Creo conveniente realizar un programa (o programas, como veas mas conveniente) que pueda ser llamado, donde contenga todas las herramientas que vimos en "diferenciacion_Integracion.md" mas a parte la integracion exacta (digase de otra manera, todas las herramientas que necesitamos para la tarea). A manera de que podamos destinar otro archivo para recibir la funcion y condiciones propuestas para cada inciso, desde el cual llamaremos al archivo anteriormente descrito para colocar cada una de los resultados y disponer de ellos en una tabla junto al error teorico. Quiza sea interesante explorar la opcion de usar Jupyter notebooks como herramienta de visualizacion. Pandas para guardar los datos.
Me gustaria ya sea que plantearas y describieras una manera mas visual de introducir los incisos de una manera mas visual, para quiza en una siguiente version, actualizar el objetivo.