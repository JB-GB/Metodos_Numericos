
Considere la siguiente ecuación diferencial con valor inicial y realice lo que se pide:
$y'(x)=1+\frac{y}{x},\quad1\leq x\leq5,\quad y(1)=0$

1. demuestre que el problema es bien planteado (mediante métodos numéricos. Prepara el algoritmo paso a paso en c++, de la manera mas nativa y sin librerías externas)
2. Resuelva numéricamente con un tamaño de paso igual a 0.4 mediante: 
	1. El método de Euler.
	2. El método de Taylor de orden 2.
	3. El método de Taylor de orden 3.
	4. El método de Taylor de orden 4.
	5. El método del punto medio.
	6. El método modificado de Euler.
	7. El método de Heun.
	8. El método de Runge-Kutta de orden 4.
3. Mediante las técnicas de ecuaciones diferenciales obtenga la funcion exacta $y(x)$.
4. Haga una tabla que muestre los valores aproximados de los $y_i$ obtenidos por cada método (elabora la tabla csv):


1. Necesito que podamos elegir entre la ecuacion dada del ejercicio, o que podamos escribir nuestra ecuación.
2. Necesito que se programe una funcion para conocer si el problema esta bien planteado mediante la **condición de Lipschitz** 
3. Modelar cada metodo numerico para resolver la ecuacion. Despues de escribir cada metodo, quisiera que se comentara el paso a paso que se sigue para entender que hace cada "funcion"
4. Modelar una manera de obtener la funcion exacta 
5. Al terminar los calculos, realice una tabla con los resultados exactos.