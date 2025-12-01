# Código Python para resolver el ejercicio pedido.
# Se ejecuta sin librerías externas (solo módulos estándar: csv, math).
# Calcula aproximaciones con varios métodos y guarda una tabla CSV con los resultados.

import math
import csv
from typing import List, Tuple

# --- Definición del problema ---
x0 = 1.0
y0 = 0.0
xf = 5.0
h = 0.4
N = int(round((xf - x0) / h))  # número de pasos: 10
xs = [x0 + i * h for i in range(N + 1)]

# f(x,y) = 1 + y/x
def f(x: float, y: float) -> float:
    return 1.0 + y / x

# Derivadas necesarias para los métodos de Taylor (en este ODE concreto):
# y'  = 1 + y/x  (depende de y)
# y'' = 1/x      (solo depende de x)
# y''' = -1/x^2
# y''''= 2/x^3
def y1(x: float, y: float) -> float:
    return 1.0 + y / x

def y2(x: float, y: float) -> float:
    return 1.0 / x

def y3(x: float, y: float) -> float:
    return -1.0 / (x * x)

def y4(x: float, y: float) -> float:
    return 2.0 / (x ** 3)

# Solución exacta (resuelta analíticamente): y = x * ln(x)
def exact(x: float) -> float:
    return x * math.log(x)

# ---------------------- Métodos numéricos (implementaciones) ----------------------

def euler_method(f, x0, y0, h, N) -> List[float]:
    """Método de Euler explícito"""
    w = y0
    xs_local = [x0 + i*h for i in range(N+1)]
    result = [w]
    x = x0
    for i in range(N):
        # wi+1 = wi + h * f(xi, wi)
        w = w + h * f(x, w)
        x = x + h
        result.append(w)
    return result

def taylor_method(order: int, x0, y0, h, N) -> List[float]:
    """
    Método de Taylor de orden 2,3 o 4.
    Para este ODE en particular usamos las derivadas calculadas arriba.
    y(x+h) ≈ y + h*y' + h^2/2*y'' + h^3/6*y''' + h^4/24*y''''
    """
    if order not in (2,3,4):
        raise ValueError("order must be 2, 3 or 4")
    w = y0
    result = [w]
    x = x0
    for i in range(N):
        # evaluamos derivadas en (x, w)
        yp = y1(x, w)
        ypp = y2(x, w)
        increment = h * yp + (h**2 / 2.0) * ypp
        if order >= 3:
            yppp = y3(x, w)
            increment += (h**3 / 6.0) * yppp
        if order >= 4:
            y4v = y4(x, w)
            increment += (h**4 / 24.0) * y4v
        w = w + increment
        x = x + h
        result.append(w)
    return result

def midpoint_method(f, x0, y0, h, N) -> List[float]:
    """Método del punto medio (método de Runge-Kutta de orden 2)"""
    w = y0
    x = x0
    res = [w]
    for i in range(N):
        k1 = f(x, w)
        k2 = f(x + h/2.0, w + (h/2.0)*k1)
        w = w + h * k2
        x = x + h
        res.append(w)
    return res

def modified_euler(f, x0, y0, h, N) -> List[float]:
    """
    Método modificado de Euler (trapecio explícito): 
    calcula primero predictor con Euler y luego corrige con promedio de f.
    wi_euler = wi + h f(xi, wi)
    wi+1 = wi + (h/2) [ f(xi,wi) + f(xi+1, wi_euler) ]
    """
    w = y0
    x = x0
    res = [w]
    for i in range(N):
        w_euler = w + h * f(x, w)
        w = w + (h/2.0) * (f(x, w) + f(x + h, w_euler))
        x = x + h
        res.append(w)
    return res

def heun_pdf_variant(f, x0, y0, h, N) -> List[float]:
    """
    Método denominado "Heun" según el PDF provisto (variante de 3 etapas):
    k1 = h/3 * f(xi, wi)
    k2 = 2h/3 * f(xi + h/3, wi + k1)
    wi+1 = wi + h/4 * [ f(xi, wi) + 3 f(xi + 2h/3, wi + k2) ]
    """
    w = y0
    x = x0
    res = [w]
    for i in range(N):
        k1 = (h/3.0) * f(x, w)
        k2 = (2.0*h/3.0) * f(x + h/3.0, w + k1)
        w = w + (h/4.0) * ( f(x, w) + 3.0 * f(x + 2.0*h/3.0, w + k2) )
        x = x + h
        res.append(w)
    return res

def rk4(f, x0, y0, h, N) -> List[float]:
    """Runge-Kutta clásico de orden 4"""
    w = y0
    x = x0
    res = [w]
    for i in range(N):
        k1 = h * f(x, w)
        k2 = h * f(x + h/2.0, w + k1/2.0)
        k3 = h * f(x + h/2.0, w + k2/2.0)
        k4 = h * f(x + h, w + k3)
        w = w + (k1 + 2.0*k2 + 2.0*k3 + k4) / 6.0
        x = x + h
        res.append(w)
    return res

# ---------------------- Cálculos ----------------------
euler_vals = euler_method(f, x0, y0, h, N)
taylor2_vals = taylor_method(2, x0, y0, h, N)
taylor3_vals = taylor_method(3, x0, y0, h, N)
taylor4_vals = taylor_method(4, x0, y0, h, N)
midpoint_vals = midpoint_method(f, x0, y0, h, N)
modified_euler_vals = modified_euler(f, x0, y0, h, N)
heun_vals = heun_pdf_variant(f, x0, y0, h, N)
rk4_vals = rk4(f, x0, y0, h, N)

exact_vals = [exact(x) for x in xs]

# Errores absolutos por método
def abs_errors(approx: List[float], exact: List[float]) -> List[float]:
    return [abs(a - b) for a,b in zip(approx, exact)]

errors = {
    "Euler": abs_errors(euler_vals, exact_vals),
    "Taylor2": abs_errors(taylor2_vals, exact_vals),
    "Taylor3": abs_errors(taylor3_vals, exact_vals),
    "Taylor4": abs_errors(taylor4_vals, exact_vals),
    "Midpoint": abs_errors(midpoint_vals, exact_vals),
    "ModifiedEuler": abs_errors(modified_euler_vals, exact_vals),
    "Heun": abs_errors(heun_vals, exact_vals),
    "RK4": abs_errors(rk4_vals, exact_vals),
}

# ---------------------- Demostración numérica de "bien planteado" ----------------------
# Teoría: f(x,y) = 1 + y/x -> ∂f/∂y = 1/x, en [1,5] es continua y acotada -> Lipschitz en y.
# Constante de Lipschitz K = max_x (1/x) = 1 en [1,5].
K_numeric = max(1.0/x for x in xs)

# Experimento numérico: resolver con una perturbación pequeña en la condición inicial y comparar diferencias.
epsilon = 1e-6
euler_base = euler_method(f, x0, y0, h, N)
euler_perturbed = euler_method(f, x0, y0 + epsilon, h, N)
max_diff = max(abs(a-b) for a,b in zip(euler_base, euler_perturbed))
# Según el bien planteado esperamos diferencia proporcional a epsilon (≈ C * epsilon)
ratio = max_diff / epsilon if epsilon != 0 else float('inf')

# ---------------------- Guardar CSV con resultados ----------------------
csv_filename = "./soluciones_metodos_ecs.csv"
with open(csv_filename, "w", newline="") as csvfile:
    writer = csv.writer(csvfile)
    header = ["x", "exact", "Euler", "Taylor2", "Taylor3", "Taylor4", "Midpoint", "ModifiedEuler", "Heun", "RK4"]
    writer.writerow(header)
    for i, x in enumerate(xs):
        row = [
            f"{x:.6f}",
            f"{exact_vals[i]:.12e}",
            f"{euler_vals[i]:.12e}",
            f"{taylor2_vals[i]:.12e}",
            f"{taylor3_vals[i]:.12e}",
            f"{taylor4_vals[i]:.12e}",
            f"{midpoint_vals[i]:.12e}",
            f"{modified_euler_vals[i]:.12e}",
            f"{heun_vals[i]:.12e}",
            f"{rk4_vals[i]:.12e}",
        ]
        writer.writerow(row)

# ---------------------- Imprimir resumen de resultados ----------------------
print("Resolución del ODE y' = 1 + y/x en [1,5], y(1)=0, con h = 0.4 (N = {})\n".format(N))

print("Demostración (numérica) de que el problema es bien planteado:")
print("  ∂f/∂y = 1/x es continua en [1,5]. Constante de Lipschitz (numérica) K = {:.6f}".format(K_numeric))
print("  Experimento: Euler con perturbación ε = {:.1e}: max|w - w_pert| = {:.6e}, ratio = {:.6f}".format(epsilon, max_diff, ratio))
print("  (ratio ≈ C sugiere estabilidad: diferencia proporcional a ε)\n")

# Mostrar tabla compacta en consola (x, exact, RK4, Euler, errores max en cada método)
print("{:>8} {:>18} {:>14} {:>14} {:>10}".format("x", "exact", "RK4", "Euler", "err(Euler)"))
for i,x in enumerate(xs):
    print(f"{x:8.4f} {exact_vals[i]:18.10e} {rk4_vals[i]:14.8e} {euler_vals[i]:14.8e} {errors['Euler'][i]:10.2e}")

print("\nErrores máximos por método:")
for name, errlist in errors.items():
    print(f"  {name:15s}: max error = {max(errlist):.3e}")

print("\nCSV guardado en:", csv_filename)

# También devolvemos algunas estructuras por si se usan más adelante (esto aparece en la salida de la celda)
{
    "xs": xs,
    "exact": exact_vals,
    "Euler": euler_vals,
    "Taylor2": taylor2_vals,
    "Taylor3": taylor3_vals,
    "Taylor4": taylor4_vals,
    "Midpoint": midpoint_vals,
    "ModifiedEuler": modified_euler_vals,
    "Heun": heun_vals,
    "RK4": rk4_vals,
    "csv": csv_filename,
    "K_numeric": K_numeric,
    "perturbation_experiment": {"epsilon": epsilon, "max_diff": max_diff, "ratio": ratio}
}