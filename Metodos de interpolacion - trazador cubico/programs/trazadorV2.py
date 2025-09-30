#!/usr/bin/env python3
"""
Programa: trazador_contorno.py
Descripción:
  - Procesa una imagen PNG.
  - Extrae el contorno superior con N puntos.
  - Determina si se puede describir como función.
  - Construye un spline cúbico (natural o sujeto).
  - Muestra los resultados gráficamente.

Dependencias:
  pip install pillow matplotlib numpy
"""

import argparse
import sys
import numpy as np
import matplotlib.pyplot as plt
from PIL import Image

# ==========================================================
# FUNCIONES AUXILIARES
# ==========================================================

def extraer_contorno_superior(ruta_imagen, num_puntos=30):
    """
    Procesa la imagen con Pillow (PIL), convierte a escala de grises,
    binariza y extrae el contorno superior en 'num_puntos' igualmente espaciados.
    """
    try:
        img = Image.open(ruta_imagen).convert("L")  # escala de grises
    except Exception as e:
        raise FileNotFoundError(f"No se pudo abrir la imagen: {e}")

    img_np = np.array(img)

    # Binarizamos (umbral en 127)
    binary = (img_np < 127).astype(np.uint8)  # 1 = contorno/blanco, 0 = fondo/negro

    x_vals = []
    y_vals = []
    altura, ancho = binary.shape

    # Escogemos columnas equiespaciadas
    for col in np.linspace(0, ancho - 1, num_puntos, dtype=int):
        filas = np.where(binary[:, col] > 0)[0]  # buscamos el primer "1"
        if len(filas) > 0:
            fila_superior = filas[0]
            x_vals.append(col)
            # invertimos eje Y para que se vea como cartesiano
            y_vals.append(altura - fila_superior)

    if len(x_vals) < 2:
        raise ValueError("No se pudo extraer suficiente contorno para describir una función.")

    return np.array(x_vals), np.array(y_vals), img


def es_funcion(x_vals):
    """
    Verifica si el contorno extraído cumple la definición de función:
    cada valor de x corresponde a un único valor de y.
    """
    return len(np.unique(x_vals)) == len(x_vals)


# ==========================================================
# TRAZADOR CUBICO
# ==========================================================

def spline_cubico(x, y, tipo="natural", m0=None, mn=None):
    """
    Calcula los coeficientes de un spline cúbico.
    - tipo = "natural" → segunda derivada 0 en extremos
    - tipo = "sujeto" → pendiente inicial y final definidas (m0, mn)
    """
    n = len(x) - 1
    h = [x[i+1] - x[i] for i in range(n)]

    # Paso 1: Calcular alphas
    alpha = [0]*(n+1)
    if tipo == "natural":
        for i in range(1, n):
            alpha[i] = (3/h[i])*(y[i+1]-y[i]) - (3/h[i-1])*(y[i]-y[i-1])
    elif tipo == "sujeto":
        if m0 is None or mn is None:
            raise ValueError("Para spline sujeto debe indicar m0 y mn")
        alpha[0] = 3*((y[1]-y[0])/h[0] - m0)
        alpha[n] = 3*(mn - (y[n]-y[n-1])/h[n-1])
        for i in range(1, n):
            alpha[i] = (3/h[i])*(y[i+1]-y[i]) - (3/h[i-1])*(y[i]-y[i-1])

    # Paso 2: Resolver sistema tridiagonal
    l = [1]*(n+1)
    mu = [0]*(n+1)
    z = [0]*(n+1)

    if tipo == "natural":
        l[0] = 1
        mu[0] = z[0] = 0
    else:  # sujeto
        l[0] = 2*h[0]
        mu[0] = 0.5
        z[0] = alpha[0]/l[0]

    for i in range(1, n):
        l[i] = 2*(x[i+1]-x[i-1]) - h[i-1]*mu[i-1]
        mu[i] = h[i]/l[i]
        z[i] = (alpha[i] - h[i-1]*z[i-1]) / l[i]

    if tipo == "natural":
        l[n] = 1
        z[n] = 0
    else:  # sujeto
        l[n] = h[n-1]*(2 - mu[n-1])
        z[n] = (alpha[n] - h[n-1]*z[n-1]) / l[n]

    # Paso 3: Back substitution
    c = [0]*(n+1)
    b = [0]*n
    d = [0]*n
    a = [y[i] for i in range(n)]

    c[n] = z[n]
    for j in reversed(range(n)):
        c[j] = z[j] - mu[j]*c[j+1]
        b[j] = ((y[j+1]-y[j])/h[j]) - (h[j]*(c[j+1]+2*c[j]))/3
        d[j] = (c[j+1]-c[j])/(3*h[j])

    return a, b, c, d


def evaluar_spline(x, a, b, c, d, x_eval):
    """
    Evalúa el spline cúbico en los puntos x_eval.
    """
    y_eval = []
    n = len(a)
    for xe in x_eval:
        # localizar intervalo
        for i in range(n):
            if x[i] <= xe <= x[i+1]:
                dx = xe - x[i]
                val = a[i] + b[i]*dx + c[i]*dx**2 + d[i]*dx**3
                y_eval.append(val)
                break
    return np.array(y_eval)


# ==========================================================
# MAIN
# ==========================================================

def main():
    parser = argparse.ArgumentParser(description="Spline cúbico sobre contorno superior de una imagen PNG")
    parser.add_argument("--numero", type=int, required=True, help="Cantidad de puntos a extraer")
    parser.add_argument("--tipo", choices=["natural", "sujeto"], default="natural",
                        help="Tipo de spline: natural o sujeto")
    parser.add_argument("--m0", type=float, default=None, help="Pendiente inicial (solo sujeto)")
    parser.add_argument("--mn", type=float, default=None, help="Pendiente final (solo sujeto)")
    parser.add_argument("imagen", help="Ruta de la imagen PNG")
    args = parser.parse_args()

    try:
        x_vals, y_vals, img = extraer_contorno_superior(args.imagen, args.numero)
    except Exception as e:
        sys.exit(f"Error al procesar la imagen: {e}")

    if not es_funcion(x_vals):
        sys.exit("El contorno extraído NO puede describirse como función.")

    # Graficar puntos sobre imagen
    plt.imshow(img, cmap="gray", alpha=0.3)
    plt.scatter(x_vals, img.height - y_vals, color="red", s=30, label="Puntos contorno")
    plt.legend()
    plt.title("Contorno superior (puntos extraídos)")
    plt.show(block=True)

    # Construir spline
    a, b, c, d = spline_cubico(x_vals, y_vals, tipo=args.tipo, m0=args.m0, mn=args.mn)

    # Evaluar spline en puntos finos
    x_eval = np.linspace(min(x_vals), max(x_vals), 500)
    y_eval = evaluar_spline(x_vals, a, b, c, d, x_eval)

    # Graficar spline
    plt.imshow(img, cmap="gray", alpha=0.3)
    plt.scatter(x_vals, img.height - y_vals, color="red", s=30, label="Puntos")
    plt.plot(x_eval, img.height - y_eval, color="blue", label="Spline cúbico")
    plt.legend()
    plt.title(f"Spline cúbico ({args.tipo})")
    plt.show(block=True)


if __name__ == "__main__":
    main()
