# Métodos numéricos
## Diferenciación e integración numéricas

### Diferenciación numérica

#### Fórmula de diferencias

De la definición de derivada:

$ f'(x_0) = lim_{h -> 0} (f(x_0 + h) - f(x_0)) / h $

Para obtener una aproximación a $f'(x_0)$ basta evaluar:

$ (f(x_0 + h) - f(x_0)) / h $

para valores pequeños de $h$.

Nomenclatura:
Esta aproximación se conoce como fórmula de diferencias hacia adelante si $h > 0$ y como fórmula de diferencias hacia atrás si $h < 0$.

Observación:
Según el teorema de Taylor, el error de aproximación de esta fórmula está acotado por $M|h|/2$, donde $M$ es una cota de $|f''(x)|$ para los valores de $x$ entre $x_0$ y $x_0 + h$.

Ejemplo:
Aproximar la derivada de $ln(x)$ en $x_0 = 1.8$ para $h = 0.1$, $h = 0.05$ y $h = 0.01$, y determinar las cotas del error.

#### Fórmulas de n + 1 puntos

Sean $x_0 < x_1 < ... < x_n$, entonces:

$ f(x) ≈ Σ_{j=0}^{n} f(x_j)L_j(x) $

donde $L_j$ son los polinomios de Lagrange. Entonces, en los puntos $x_0, x_1, ..., x_n$:

$ f'(x_k) ≈ Σ_{j=0}^{n} f(x_j)L'_j(x_k) $

con un margen de error de:

$ M / (n+1)! * Π_{j=0, j ≠ k}^{n} (x_k - x_j) $

donde $M$ es una cota de $|f^{(n+1)}(x)|$ para los valores de $x$ entre $x_0$ y $x_n$.

#### Fórmulas de 3 puntos

Sean $x_0$, $x_1 = x_0 + h_1$ y $x_2 = x_0 + h_2$, entonces:

$ L_0(x) = ((x - x_1)(x - x_2)) / ((x_0 - x_1)(x_0 - x_2)) = (x^2 - (x_1 + x_2)x + x_1x_2) / (h_1h_2) $

Con lo cual:

$ L'_0(x) = (2x - (x_1 + x_2)) / (h_1h_2) = (2x - 2x_0 - (h_1 + h_2)) / (h_1h_2) $

Análogamente:

$ L'_1(x) = (2x - 2x_0 - h_2) / (h_1(h_1 - h_2)) $
$ L'_2(x) = (2x - 2x_0 - h_1) / (h_2(h_2 - h_1)) $

Por lo tanto:

$ f'(x_0) = -f(x_0)(h_1 + h_2)/(h_1h_2) - f(x_0 + h_1)h_2/(h_1(h_1 - h_2)) - f(x_0 + h_2)h_1/(h_2(h_2 - h_1)) $

con un margen de error de $M|h_1h_2| / 6$, donde $M$ es una cota de $|f'''(x)|$ para los valores de $x$ entre los tres puntos (observe que $h1$ o $h2$ pueden ser negativos).

#### Fórmula del punto medio (3 puntos)

Si $h_1 = -h$ y $h_2 = h$ (es decir, $x_0$ es el punto central):

$ f'(x_0) ≈ (f(x_0 + h) - f(x_0 - h)) / (2h) $

con un error de $Mh^2 / 6$.

#### Fórmulas de los puntos extremos (3 puntos)

Si $h_1 = h$ y $h_2 = 2h$ (punto extremo izquierdo):

$ f'(x_0) ≈ (-3f(x_0) + 4f(x_0 + h) - f(x_0 + 2h)) / (2h) $

Si $h_1 = -h$ y $h_2 = -2h$ (punto extremo derecho):

$ f'(x_0) ≈ (3f(x_0) - 4f(x_0 - h) + f(x_0 - 2h)) / (2h) $

Ambas con un error de $Mh^2 / 3$.

**Ejemplo**: Supongamos que se tienen los valores de la tabla para una función $f(x)$. Aproximar $f′(2)$

| x   | f(x)      |
| --- | --------- |
| 1.8 | 10.889365 |
| 1.9 | 12.703199 |
| 2.0 | 14.778112 |
| 2.1 | 17.148957 |
| 2.2 | 19.855030 |

**Observación**: En el ejemplo anterior $f(x) = xe^x$. ¿Qué tan buenas fueron las aproximaciones?
En este ejemplo, $f(x) = x e^x$. ¿Qué tan buenas fueron las aproximaciones?
Existen fórmulas populares para derivadas con 5 puntos. A mayor número de puntos se espera mayor precisión, pero la creciente cantidad de operaciones puede acarrear un mayor error de redondeo.

#### Aproximación de la segunda derivada

De la definición:

$ f''(x_0) ≈ (f'(x_0 + h) - f'(x_0)) / h $

Sustituyendo:

$ f'(x_0 + h) ≈ (f(x_0 + h) - f(x_0)) / h \quad$ y $ f'(x_0) ≈ (f(x_0) - f(x_0 - h)) / h $

Entonces:

$ f''(x_0) ≈ (f(x_0 + h) - 2f(x_0) + f(x_0 - h)) / h^2 $

con un error de $Mh^2 / 12$, donde $M$ es una cota de $|f^{(4)}(x)|$ para los valores de $x$ entre $x_0−h$ y $x_0+h$.

## Integración numérica

Sea $f$ integrable en $[a,b]$ y sean $a ≤ x_0 < x_1 < ... < x_n ≤ b$, con lo cual:

$ f(x) ≈ Σ_{j=0}^{n} f(x_j)L_j(x) $

Entonces:

$ ∫a^b f(x) dx ≈ Σ{j=0}^{n} f(x_j) ∫_a^b L_j(x) dx $

Los siguientes métodos se basan en esta idea, tomando los puntos $x_j$ equidistantes.
Se denominan fórmulas cerradas de n+1 puntos de Newton-Cotes.

#### Regla del punto medio

Aplicando con $n=0$ y $x_0 = (a+b)/2$:

$ ∫_a^b f(x) dx ≈ (b-a) f((a+b)/2) $

Error acotado por $((b-a)^3 / 24) M$, donde $M$ es una cota de $|f''(x)|$.

#### Regla del trapecio

Con $n=1$, $x_0=a$, $x_1=b$:

$ ∫_a^b f(x) dx ≈ (b-a) * (f(a) + f(b)) / 2 $

Error acotado por $((b-a)^3 / 12) M$, donde $M$ es una cota de $|f''(x)|$.

#### Regla de Simpson

Con $n=2$, $x_0=a$, $x_1=(a+b)/2$, $x_2=b$:

$ ∫_a^b f(x) dx ≈ (b-a)/6 * [ f(a) + 4f((a+b)/2) + f(b) ] $

Error acotado por $((b-a)^5 / 2880) M$, donde $M$ es una cota de $|f^{(4)}(x)|$.

Observación:
Como el error involucra la cuarta derivada, la regla de Simpson es exacta para polinomios de grado ≤ 3.

#### Ejercicios

Aproximar las siguientes integrales y verificar su error teórico:

$f(x) = x^3 - 3x + 2$ en $[-1, 3]$

$f(x) = cos(x)$ en $[0, 2π/3]$

$f(x) = e^x$ en $[0, 2]$

$f(x) = 1/(x+1)$ en $[0, 2]$

#### Reglas compuestas

Dado que las fórmulas de error involucran $(b - a)$, la precisión disminuye en intervalos grandes.
Sabemos que:

$ ∫_a^b f(x) dx = ∫_a^m f(x) dx + ∫_m^b f(x) dx $

y, más generalmente:

$ ∫a^b f(x) dx = ∫{x_0}^{x_1} f(x) dx + ∫{x_1}^{x_2} f(x) dx + ... + ∫{x_{n-1}}^{x_n} f(x) dx $

Por lo tanto, una buena idea es dividir el intervalo de integración en subintervalos pequeños.

Ejercicio:
Aproximar alguna de las integrales anteriores mediante una regla compuesta.

Observación:
El error total de una regla compuesta es la suma de los errores de cada subintervalo.

#### Algoritmo: Regla de Simpson compuesta

Entrada: valores $a$, $b$, entero positivo $n$, función $f(x)$ o valores $f(x_i)$ correspondientes.
Salida: valor $I ≈ ∫_a^b f(x) dx$

Paso 1: $h ← (b - a)/(2n)$
$I1 ← 0$
$I2 ← 0$
$x ← a + h$

Paso 2: Mientras $x < b$ hacer:
$I1 ← I1 + f(x)$
$I2 ← I2 + f(x + h)$
$x ← x + 2h$

Paso 3: $I ← (h/3) * [ f(a) + 4I1 + 2I2 - f(b) ]$

Paso 4: Devolver $I$ y terminar.