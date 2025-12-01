# Producto Integrador de Aprendizaje: PharmaKin
El proyecto nace de la necesidad de resolver un problema: "Elija un problema de estudio en la ingenieria biomédica que se modele matematicamente a traves de una ecuacion diferencial (ordinaria o parcial). Para dicha ecuacion diferencial, formule un problema especifico con los datos particulares de un caso de estudio. Haga un programa que codifique un algoritmo que resuelva numericamente dicho problema. Implemente el programa para calcular los valores de la solucion del problema particular en los puntos de malla correspondientes. Presente los resultados así como su interpretacion en el problema modelado de la ingenieria biomédica y acompañe de tablas y/o graficas". Dicho eso, quize ir mas allá. Quiero realizar este proyecto de modo que no sea un programa mas, si no que sirva para educar y que sirva como referencia a medicos y biomedicos. Pero es importante hacer visible y cumplir con el enunciado anterior.

De varios lugares encontré el problema de la farmacocinética y me llamó la atencion. De dos fuentes leí lo siguiente:

**Farmacocinética de fármacos (modelo de compartimento)**
En farmacocinética se usa el modelo de compartimento único para describir cómo varía la concentración $C(t)$ de un fármaco en sangre tras su administración. El balance de masa se suele plantear como:
$$
V\frac{dC}{dt}= u(t)-Q C(t)
$$
, donde $V$ es el volumen plasmático efectivo, $u(t)$ la tasa de administración (por ejemplo infusión intravenosa) y $Q$ la tasa de eliminación metabólica. Esta ecuación diferencial lineal de primer orden (analogía con decaimiento exponencial) se resuelve numéricamente para obtener $C(t)$. Conociendo la concentración plasmática se puede determinar la dosis y frecuencia de administración necesarias. Este tipo de modelo se emplea para planificar tratamientos con antibióticos, quimioterápicos, anestésicos, etc., y puede implementarse interactivamente variando parámetros (volumen, clearance, dosis) para ver cómo cambia la curva de concentración en el tiempo.

**Farmacocinética: Concentración de fármaco en sangre**
Modela cómo varía la concentración de un medicamento en el torrente sanguíneo con el tiempo. Usa ecuaciones diferenciales simples que representan absorción, distribución y eliminación. Es muy visual (gráficas de concentración vs tiempo) y útil para determinar dosis óptimas y frecuencia de administración.
Atractivo: Los estudiantes pueden ver cómo calcular cuándo tomar la siguiente dosis de un antibiótico o analgésico.

Quisiera que el proyecto estuviera enfocado a sacar de estos dos, una herramienta que funcione para ejemplificar y explicar a detalle para que funciona esto, ademas del como funciona y como se resuelve.
---

## Requisitos del proyecto
He revisado un mockup de version primitiva de este proyecto, este no tiene muchas de las funciones que quiero, pero quiza te sirva como referencia de la interfaz primaria que me gustaria tener.

Recordemos que es importante mostrar lo relacionado a los metodos numericos. Se que en este tipo de problemas podriamos usar Runge-Kutta y Euler para realizar los calculos. Quisiera que tambien hubiera un apartado para comparar las soluciones arrojadas por los diferentes metodos y compararlos junto con el metodo de exactitud.

Para ello podemos agregar un apartado en el que resolvamos paso a paso mediante los 3 metodos (exactos, euler y range-kutta) con un caso especifico, de manera que podamos demostrar la complejidad y exactitud de los metodos.

Para la interfaz principal, me gustaria que pudieramos tener mas 'principios activos' quiza exista ya una biblioteca o algun repositorio de donde tomar esta informacion, de este modo poder incluirlo en nuestros glosarios y dar un contexto mas especifico de que es lo que estamos modelando. En cuanto a las formas farmaceuticas, al igual que ene el mockup, sería bueno que ademas de contar con via oral e intravenosa, contaramos con la via semi-solida en forma de pomada. Aun sabiendo que hay presentaciones de diferentes tipos de dosis, me gustaria mantener la posibilidad de variar la dosis en la interfaz principal.

Me agrada la idea principal que se capta en el mockup, sería genial si pudieramos incluir al lado de la grafica, un apartado donde enseñemos la logica detras de la grafica. Ademas de que me gusta el apartado de estado actual. Si tienes ideas para mejorar esto, aplicalas y te doy retroalimentacion.

Recordemos que el objetivo de este proyecto, es tener una demostracion que incluso alumnos brillantes de bachilleres puedan entender (No hagas mencion de esto en el codigo ni en ninguna parte), que destaque como el ingeniero puede aplicar esto en diferentes lugares.

Quiero que el proyecto este desarrollado en Python y con stack de React para interfaces. Todo el codigo que escribas, mas que nada, la logica de los metodos numericos asi como la solucion al problema exacto, debe estar comentado, de modo que los devs puedan leer el codigo y entender la operacion.
Al ser un proyecto que se ejecutara en computadoras con acceso a internet, podria decirse que disponemos de acceso para realizar una aplicacion que no guarde algunas imagenes, si no que las tome de internet, esto para mantener ligero el proyecto. Pero si piensas que es mejor que se disponga de ellas en el proyecto, puedes poner placeholders y darme una descripcion de que imagen deberia descargar y colocar.

Quiero un menu lateral izquierdo que permita acceder a:
- Panel principal
- Zona educativa
- Diccionario interactivo
- Principios activos disponibles
- Caso de uso (Métodos)

### Panel principal
Este apartado es el principal dedicado a la interfaz donde podra el usuario colocar los parametros que el crea mas interesantes. Esto me gustaria que pudiera modificarse en tiempo real y que permitiera comparar los resultados que tendriamos con "Runge-Kutta" y "Euler". Idealmente me gustaria que tuviera los elementos del mockup, añadiendo elementos explicativos que te permitan entender el por que de cada cosa.

### Zona educativa
De principio quisiera un apartado en el cual sirva como introduccion, donde se vea toda la teoria de como funciona la farmacocinetica y farmacokinetica. Para acceder a esto, me gustaria que estuviera en el menú de la parte izquierda como una opción.
Me gustaria que al mantener el mouse encima de varios terminos en todas las interfaces, salga un texto explicando las siglas o con una definicion rapida de lo que es.
Tambien seria bueno tener un glosario/diccionario que hiciera referencia como si fueran notas y pudieras conectar terminos y entender el por qué aun sin saber nada, desde cero. Algo similar a las notas en obsidian, pero que sirva para este proyecto.

### Diccionario interactivo
Esta es la parte que comentaba que me gustaria que fuera como un diccionario y graficos de obsidian. Mas que nada, me gustaria que el usuario pueda acceder a un concepto diferente de manera rapida. De modo que sea dinamica la manera de usar esta herramienta.

### Principios activos disponibles
Este apartado debe ser como una "pokedex" de todos los principios activos de los que tenemos informacion.
Los datos que tenemos aqui deben poder servir para la interfaz principal. 
Si no existe alguna biblioteca en internet, o api o lo que sea, me gustaría que investigaras entonces y crearas dicha biblioteca de informacion para ejecucion en local. Me gustaria contar con:
- Nombre comercial
- Nombre formula
- Descripcion 
- Para que se usa
- Presentaciones comerciales
- Costos
- Imagen
De tal manera que al acceder a esta seccion, el usuario pueda buscar un medicamento con el cual le gustaria intentar usar la interfaz. Vaya, que esta parte sirva de interfaz para corroborar si existe o no un medicamento en el proyecto.

### Caso de uso
En este apartado me gustaria que estuviera la descripcion de un caso especifico (Que pueda ser modelado con esta aplicacion). Uno donde pueda profundizar y comparar los metodos numericos y el metodo exacto como sugerí anteriormente.
---

## Apuntes de la clase
Los apuntes de la clase, asi como los algoritmos que vimos y ejemplos, estan en el pdf en la carpeta de Apuntes. De preferencia, basarse de ahi para expresar los algoritmos. Asi mismo, si vez preferente otro metodo numerico contenido en ese pdf, usarlo y comparar.