"""
Módulo: numerical_tools.py
Contiene implementaciones paso-a-paso de métodos numéricos para
diferenciación e integración según las notas en
`diferenciacion_Integracion.md`.

Restricción: No usar librerías para cálculos numéricos fundamentales;
solo se usan `math` y pequeñas utilidades de Python.
Las funciones están documentadas en español y devuelven valores escalares
o estructuras sencillas para facilitar su uso por scripts externos.
"""
from __future__ import annotations
import math
from typing import Callable, Tuple, List


# -----------------------------
# DIFERENCIACIÓN NUMÉRICA
# -----------------------------

def forward_difference(f: Callable[[float], float], x: float, h: float) -> float:
    """Aproxima f'(x) usando la fórmula de diferencias hacia adelante:

    (f(x+h) - f(x)) / h

    Parámetros:
    - f: función de un solo argumento (float -> float)
    - x: punto donde se aproxima la derivada
    - h: incremento pequeño (positivo)

    Devuelve:
    - Aproximación de f'(x) como float
    """
    return (f(x + h) - f(x)) / h


def backward_difference(f: Callable[[float], float], x: float, h: float) -> float:
    """Aproxima f'(x) usando la fórmula de diferencias hacia atrás:

    (f(x) - f(x-h)) / h
    """
    return (f(x) - f(x - h)) / h


def central_difference(f: Callable[[float], float], x: float, h: float) -> float:
    """Aproximación del punto medio de 3 puntos (central):

    (f(x+h) - f(x-h)) / (2h)
    """
    return (f(x + h) - f(x - h)) / (2 * h)


def three_point_forward(f: Callable[[float], float], x: float, h: float) -> float:
    """Fórmula de 3 puntos en punto extremo izquierdo:

    (-3 f(x) + 4 f(x+h) - f(x+2h)) / (2h)
    """
    return (-3 * f(x) + 4 * f(x + h) - f(x + 2 * h)) / (2 * h)


def three_point_backward(f: Callable[[float], float], x: float, h: float) -> float:
    """Fórmula de 3 puntos en punto extremo derecho:

    (3 f(x) - 4 f(x-h) + f(x-2h)) / (2h)
    """
    return (3 * f(x) - 4 * f(x - h) + f(x - 2 * h)) / (2 * h)


# -----------------------------
# DERIVADAS EXACTAS CONOCIDAS (CASO ESPECÍFICO)
# -----------------------------

def exact_derivative_x_ln_x(x: float) -> float:
    """Derivada exacta de f(x) = x * ln(x): f'(x) = 1 + ln(x)

    Esta función es útil para comparar aproximaciones con el valor exacto.
    """
    return 1.0 + math.log(x)


# -----------------------------
# BOUNDS / COTAS USANDO MUESTREO
# -----------------------------

def max_abs_on_interval(func: Callable[[float], float], a: float, b: float, samples: int = 1000) -> float:
    """Evalúa `func` en una malla de `samples` puntos entre [a,b] y devuelve
    el máximo absoluto observado. Se usa para estimar la constante M de las
    cotas de error (por ejemplo, max |f''(x)| en un intervalo).

    Nota: Esto es una estimación numérica; si se requiere exactitud simbólica,
    el usuario debe proveer la derivada analítica.
    """
    if a > b:
        a, b = b, a
    if samples < 2:
        samples = 2
    max_val = 0.0
    for i in range(samples):
        t = a + (b - a) * i / (samples - 1)
        try:
            v = abs(func(t))
        except Exception:
            v = float('inf')
        if v > max_val:
            max_val = v
    return max_val


# -----------------------------
# INTEGRACIÓN NUMÉRICA
# -----------------------------

def midpoint_rule(f: Callable[[float], float], a: float, b: float) -> float:
    """Regla del punto medio simple en [a,b].

    Aproximación: (b-a) * f((a+b)/2)
    """
    m = 0.5 * (a + b)
    return (b - a) * f(m)


def trapezoid_rule(f: Callable[[float], float], a: float, b: float) -> float:
    """Regla del trapecio simple en [a,b].

    Aproximación: (b-a) * (f(a) + f(b)) / 2
    """
    return (b - a) * (f(a) + f(b)) / 2.0


def simpson_rule(f: Callable[[float], float], a: float, b: float) -> float:
    """Regla de Simpson simple en [a,b].

    Aproximación: (b-a)/6 * [ f(a) + 4 f((a+b)/2) + f(b) ]
    """
    m = 0.5 * (a + b)
    return (b - a) / 6.0 * (f(a) + 4.0 * f(m) + f(b))


def composite_midpoint(f: Callable[[float], float], a: float, b: float, n: int) -> float:
    """Regla del punto medio compuesta con n subintervalos (n entero positivo).

    Divide [a,b] en n subintervalos de ancho h = (b-a)/n y aplica midpoint en
    cada subintervalo.
    """
    if n <= 0:
        raise ValueError("n debe ser entero positivo")
    h = (b - a) / n
    total = 0.0
    for i in range(n):
        left = a + i * h
        right = left + h
        total += midpoint_rule(f, left, right)
    return total


def composite_simpson(f: Callable[[float], float], a: float, b: float, m: int) -> float:
    """Regla de Simpson compuesta usando `m` subintervalos por pareja.

    El algoritmo típico pide un número `n` par de subintervalos; aquí `m` es el
    número de pares (es decir, n = 2*m). Se sigue el pseudocódigo del apunte.
    """
    if m <= 0:
        raise ValueError("m debe ser entero positivo")
    n = 2 * m
    h = (b - a) / n
    I1 = 0.0
    I2 = 0.0
    x = a + h
    # sumar f(a + 2k h) y f(a + (2k-1) h) por el algoritmo
    while x < b:
        I1 += f(x)
        I2 += f(x + h)
        x += 2 * h
    return (h / 3.0) * (f(a) + 4.0 * I1 + 2.0 * I2 - f(b))


# -----------------------------
# FUNCIONES ESPECÍFICAS DE LOS EJERCICIOS
# -----------------------------

def f_x_ln_x(x: float) -> float:
    """Función f(x) = x * ln(x) definida para x>0.

    Se implementa con protección básica para valores no permitidos.
    """
    if x <= 0.0:
        raise ValueError("x debe ser > 0 para x*ln(x)")
    return x * math.log(x)


def f_1_plus_ln_x(x: float) -> float:
    """Función f(x) = 1 + ln(x), definida para x>0."""
    if x <= 0.0:
        raise ValueError("x debe ser > 0 para ln(x)")
    return 1.0 + math.log(x)


def exact_integral_of_1_plus_ln_x(a: float, b: float) -> float:
    """Integral exacta de f(x)=1+ln(x): ∫(1 + ln x) dx = x ln x (verificación)

    En efecto, ∫ 1 dx = x, ∫ ln x dx = x ln x - x, sumando da x ln x.
    Por lo tanto, la integral definida entre a y b es: [x ln x]_a^b = b ln b - a ln a
    """
    # Verificar dominio
    if a <= 0.0 or b <= 0.0:
        raise ValueError("a y b deben ser > 0 para esta integral")
    return b * math.log(b) - a * math.log(a)


def exact_integral_of_f_x_ln_x(a: float, b: float) -> float:
    """Integral exacta de f(x)=x ln x: ∫ x ln x dx = (x^2/2) ln x - x^2/4 + C

    No es estrictamente necesario para la tarea, pero se deja como utilidad.
    """
    if a <= 0.0 or b <= 0.0:
        raise ValueError("a y b deben ser > 0 para esta integral")
    def F(x: float) -> float:
        return 0.5 * x * x * math.log(x) - 0.25 * x * x
    return F(b) - F(a)


__all__ = [
    "forward_difference",
    "backward_difference",
    "central_difference",
    "three_point_forward",
    "three_point_backward",
    "exact_derivative_x_ln_x",
    "max_abs_on_interval",
    "midpoint_rule",
    "trapezoid_rule",
    "simpson_rule",
    "composite_midpoint",
    "composite_simpson",
    "f_x_ln_x",
    "f_1_plus_ln_x",
    "exact_integral_of_1_plus_ln_x",
    "exact_integral_of_f_x_ln_x",
]
