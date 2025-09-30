#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Programa: Trazador cúbico sobre contorno superior de imagen PNG
Autor: JB-GB
Descripción:
    Este programa toma una imagen PNG y detecta su contorno superior.
    Luego verifica si dicho contorno puede describirse como una función
    (es decir, un valor único de y para cada x).
    Si es posible, grafica los puntos sobre la imagen y después
    construye un trazador cúbico desde cero, mostrando la interpolación.
    
Uso:
    python trazador_contorno.py --numero 30 ruta_de_la_imagen.png
"""

import argparse                     # para manejo de argumentos desde línea de comandos
import numpy as np                  # para manejo de arrays y cálculos numéricos
from PIL import Image               # para manejo de imágenes
import matplotlib.pyplot as plt     # para visualización gráfica
import sys                          # para manejo de errores y salidas (funciones del sistema)


# ==============================================================
#  FUNCIONES AUXILIARES
# ==============================================================

def cargar_imagen(ruta):
    """Carga la imagen en escala de grises. 
    Si no existe o no es válida, lanza error."""
    try:
        img = Image.open(ruta).convert("L")  # Escala de grises
        return np.array(img)
    except FileNotFoundError:
        sys.exit("Error: No se encontró la imagen en la ruta especificada.")
    except Exception as e:
        sys.exit(f"Error al cargar la imagen: {e}")


def extraer_contorno_superior(img, num_puntos):
    """
    Extrae el contorno superior de la imagen.
    - Recorremos cada columna (x) buscando el primer píxel oscuro (contorno).
    - Retornamos puntos (x, y) espaciados según num_puntos.

    img: matriz numpy (grises, 0=negro, 255=blanco).
    """
    alto, ancho = img.shape
    puntos = []

    for x in range(ancho):
        columna = img[:, x]  # todos los píxeles en esta columna
        # buscamos el primer píxel oscuro (<128)
        ys = np.where(columna < 128)[0]
        if len(ys) > 0:
            y_top = ys[0]
            puntos.append((x, y_top))

    if len(puntos) == 0:
        sys.exit("Error: No se detectó contorno en la imagen.")

    # Reducimos los puntos seleccionando uniformemente
    indices = np.linspace(0, len(puntos) - 1, num_puntos, dtype=int)
    puntos_reducidos = [puntos[i] for i in indices]

    return np.array(puntos_reducidos)


def verificar_funcion(puntos):
    """
    Verifica si el contorno puede describirse como función.
    Es decir, que para cada x solo exista un único y.
    """
    xs = puntos[:, 0]
    if len(xs) != len(set(xs)):
        sys.exit("Error: El contorno no puede representarse como función.")
    return True


# ==============================================================
#  TRAZADOR CÚBICO (Natural)
# ==============================================================

def trazador_cubico(x, y):
    """
    Construye un trazador cúbico natural desde cero.
    Retorna coeficientes de los polinomios cúbicos por intervalos.
    
    Explicación:
    - Resolvemos un sistema tridiagonal para obtener las segundas derivadas (M).
    - Luego calculamos coeficientes del polinomio cúbico en cada intervalo.
    """
    n = len(x) - 1
    h = np.diff(x)  # longitudes entre puntos
    alphas = [0] * (n + 1)

    # Paso 1: Construcción del sistema
    for i in range(1, n):
        alphas[i] = (3/h[i])*(y[i+1] - y[i]) - (3/h[i-1])*(y[i] - y[i-1])

    # Matriz tridiagonal
    l = [1] + [0]*(n)
    mu = [0]*(n+1)
    z = [0]*(n+1)

    for i in range(1, n):
        l_i = 2*(x[i+1] - x[i-1]) - h[i-1]*mu[i-1]
        l.append(l_i)
        mu[i] = h[i]/l_i
        z[i] = (alphas[i] - h[i-1]*z[i-1]) / l_i

    l.append(1)
    z[n] = 0

    # Paso 2: Resolver para c, b, d
    c = [0]*(n+1)
    b = [0]*n
    d = [0]*n
    a = [yi for yi in y]

    for j in range(n-1, -1, -1):
        c[j] = z[j] - mu[j]*c[j+1]
        b[j] = (a[j+1] - a[j])/h[j] - h[j]*(c[j+1] + 2*c[j])/3
        d[j] = (c[j+1] - c[j]) / (3*h[j])

    # Retornamos coeficientes de cada tramo
    return [(a[i], b[i], c[i], d[i], x[i]) for i in range(n)]


def evaluar_trazador(coefs, x_vals):
    """
    Evalúa el trazador cúbico en los puntos x_vals.
    """
    resultados = []
    for x in x_vals:
        for (a, b, c, d, x_i) in coefs:
            if x >= x_i:
                valor = a + b*(x - x_i) + c*(x - x_i)**2 + d*(x - x_i)**3
        resultados.append(valor)
    return resultados


# ==============================================================
#  VISUALIZACIÓN
# ==============================================================

def mostrar_puntos(img, puntos):
    """Muestra la imagen atenuada y los puntos encima."""
    plt.imshow(img, cmap="gray", alpha=0.3)  # imagen tenue
    plt.scatter(puntos[:, 0], puntos[:, 1], color="red", s=30)
    plt.title("Contorno superior detectado")
    plt.gca().invert_yaxis()  # para que el origen esté arriba
    plt.show()


def mostrar_trazador(img, puntos, coefs):
    """Muestra el trazador cúbico sobre la imagen."""
    x_vals = np.linspace(puntos[:,0].min(), puntos[:,0].max(), 500)
    y_vals = evaluar_trazador(coefs, x_vals)

    plt.imshow(img, cmap="gray", alpha=0.3)
    plt.scatter(puntos[:, 0], puntos[:, 1], color="red", s=30, label="Puntos")
    plt.plot(x_vals, y_vals, color="blue", label="Trazador cúbico")
    plt.title("Trazador cúbico sobre contorno")
    plt.gca().invert_yaxis()
    plt.legend()
    plt.show()


# ==============================================================
#  MAIN
# ==============================================================

def main():
    parser = argparse.ArgumentParser(description="Trazador cúbico del contorno superior de una imagen PNG.")
    parser.add_argument("--numero", type=int, required=True, help="Cantidad de puntos a usar del contorno.")
    parser.add_argument("ruta", type=str, help="Ruta de la imagen PNG")
    args = parser.parse_args()

    # 1. Cargar imagen
    img = cargar_imagen(args.ruta)

    # 2. Extraer contorno superior
    puntos = extraer_contorno_superior(img, args.numero)

    # 3. Verificar si puede describirse como función
    verificar_funcion(puntos)

    # 4. Mostrar puntos sobre la imagen
    mostrar_puntos(img, puntos)

    # 5. Construir trazador cúbico
    x, y = puntos[:, 0], puntos[:, 1]
    coefs = trazador_cubico(x, y)

    # 6. Mostrar trazador sobre la imagen
    mostrar_trazador(img, puntos, coefs)

    input("Presiona ENTER para salir...")


if __name__ == "__main__":
    main()
