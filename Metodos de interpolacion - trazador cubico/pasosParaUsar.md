

## Antes que nada
Instalar paqueterias necesarias:
Es necesario que instales librerias escenciales para el correcto funcionamiento del programa. Las librerias que utiliza este programa son numpy, pillow y matplotlib. En el archivo de codigo podemos ver 'argparse' y 'sys' pero estas son nativas de python para el control de acciones sobre el Sistema Operativo.
A continuacion, un resumen de cada libreria y que funcion tiene en este programa.

#### [Numpy](https://numpy.org/)
NumPy es una biblioteca fundamental para la computación científica en Python. Su objeto principal es el ndarray (N-dimensional array), que es una estructura de datos eficiente y flexible para representar vectores, matrices y arreglos multidimensionales homogéneos (todos los elementos son del mismo tipo de dato).
En este programa se utiliza para manejar arrays y calculos que complicarian la lectura del codigo.

#### [Pillow](https://pypi.org/project/pillow/)
Pillow es la librería estándar de facto en Python para el procesamiento y manipulación de imágenes. Es un fork (una versión mejorada y mantenida activamente) de la histórica Python Imaging Library (PIL), que estaba descontinuada y no soportaba Python 3.
En este programa se utiliza para permitirnos procesar las imagenes que utilicemos.

#### [Matplotlib](https://matplotlib.org/)
Matplotlib es la librería de visualización de datos 2D y 3D más popular y fundamental en Python. Su principal objetivo es permitir crear gráficos de alta calidad, ya sean estáticos, animados o interactivos, de forma muy flexible y personalizable. Fue diseñada para tener una interfaz similar a la de MATLAB.
En este programa cumple su funcion mas basica, la de mostrar visualmente las partes graficas.

Adicionalmente podemos recurrir a librerias mas potentes 

#### [OpenCV (o CV2)](https://pypi.org/project/opencv-python/)
OpenCV es la biblioteca de código abierto más grande y popular del mundo para la Visión por Computadora (Computer Vision) y el Aprendizaje Automático (Machine Learning). Fue diseñada para la eficiencia y el tiempo real.
En este programa puede utilizarse para permitirnos procesar las imagenes con un mayor detalle, permitiendonos analizar mas tipos de imagenes.

#### [Scipy](https://scipy.org/es/)
SciPy es una de las bibliotecas fundamentales en el ecosistema de computación científica y técnica de Python. Se considera una extensión de NumPy, que es la base para el manejo eficiente de arrays y matrices.
Mientras que NumPy proporciona el tipo de dato principal (el array N-dimensional) y operaciones básicas, SciPy ofrece el conjunto de algoritmos y funciones de alto nivel para resolver problemas comunes en ciencia, ingeniería y análisis de datos.

Para instalar todas estas dependencias sin ir de una por una, puedes hacerlo ejecutando el siguiente comando:
~~~ bash
pip install -r requirements.txt
~~~


## Ejecucion
En la consola, tienes que ejecutar con 




## Explicación
La interpolación por trazadores cúbicos es un método numérico que permite aproximar un conjunto de puntos mediante funciones polinómicas de grado tres, unidas de manera que garanticen suavidad en la curva.
Se utiliza ampliamente porque evita oscilaciones excesivas (problema típico de polinomios de alto grado) y mantiene continuidad hasta la segunda derivada.

### Concepto basico
Supongamos que tenemos una serie de puntos ordenados:
$$
(x_0,y_0), (x_1,y_1), \cdots (x_n,y_n)
$$

El objetivo es construir, para cada intervalo $[x_i,x_{i+1}]$, un polinomio cúbico:
$$
S_i(x)=a_i+b_i(x-x_i)+c_i(x-x_i)^{2}+d_i(x-x_i)^{3}
$$

De manera que:
1. $S_i(x_i)=y_i$
2. $S_i(x_{i}+1)=y_{i}+1$
3. $S'_i(x_{i}+1)=S'_{i+1}(x_{i+1})$ (Continuidad de la primera derivada)
4. $S''_i(x_{i+1})=S''_{i+1}(x_{i+1})$ (Continuidad de la segunda derivada)
Estas condiciones aseguran que la curva no tenga quiebres.

Trazador cubico natural
---
Definición de longitudes de intervalo
$$
h_i=x_{i+1}-x_i
$$
Esto mide la separación entre los nodos.


Trazador cubico 








