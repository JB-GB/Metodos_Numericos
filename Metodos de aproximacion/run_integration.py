"""
Runner para el inciso 2 de Objectives.md

Calcula aproximaciones de la integral de f(x)=1+ln x en [1,2] usando varias
reglas (punto medio, trapecio, Simpson, Simpson compuesta con 2 subintervalos,
Punto medio compuesta con 5 subintervalos). Calcula la integral exacta, estima
las cotas de error y exporta una tabla con los resultados.
"""
from __future__ import annotations
import os
import math
import pandas as pd

from numerical_tools import (
    f_1_plus_ln_x,
    midpoint_rule,
    trapezoid_rule,
    simpson_rule,
    composite_simpson,
    composite_midpoint,
    max_abs_on_interval,
    exact_integral_of_1_plus_ln_x,
)


def cota_midpoint(a: float, b: float) -> float:
    """Error acotado por ((b-a)^3 / 24) * M, con M = max |f''(x)| en [a,b]"""
    # f(x)=1+ln x => f''(x) = -1/x^2
    def f2(x):
        return -1.0 / (x * x)
    M = max_abs_on_interval(lambda x: abs(f2(x)), a, b)
    return ((b - a) ** 3) / 24.0 * M


def cota_trapezoid(a: float, b: float) -> float:
    def f2(x):
        return -1.0 / (x * x)
    M = max_abs_on_interval(lambda x: abs(f2(x)), a, b)
    return ((b - a) ** 3) / 12.0 * M


def cota_simpson(a: float, b: float) -> float:
    # f(x)=1+ln x => f''''(x) = 6 / x^4  ??? (calculado analíticamente si se desea)
    # Para evitar errores simbólicos, estimamos M = max |f''''(x)| por muestreo.
    def f4(x):
        # derivada cuarta de 1 + ln x es 6 / x^4 ?
        return 6.0 / (x ** 4)
    M = max_abs_on_interval(lambda x: abs(f4(x)), a, b)
    return ((b - a) ** 5) / 2880.0 * M


def main():
    a = 1.0
    b = 2.0

    results = []

    # Punto medio simple
    I_mid = midpoint_rule(f_1_plus_ln_x, a, b)
    results.append(("Midpoint (simple)", I_mid, cota_midpoint(a, b)))

    # Trapecio simple
    I_trap = trapezoid_rule(f_1_plus_ln_x, a, b)
    results.append(("Trapezoid (simple)", I_trap, cota_trapezoid(a, b)))

    # Simpson simple
    I_simp = simpson_rule(f_1_plus_ln_x, a, b)
    results.append(("Simpson (simple)", I_simp, cota_simpson(a, b)))

    # Simpson compuesta con 2 subintervalos (n=2 -> m=1 pareja?)
    # El enunciado pide "partiendo en 2 subintervalos" -> n=2 (par), por tanto m=1
    I_simp_comp = composite_simpson(f_1_plus_ln_x, a, b, m=1)
    results.append(("Simpson compuesta (2 subintervalos)", I_simp_comp, cota_simpson(a, b)))

    # Punto medio compuesta con 5 subintervalos
    I_mid_comp = composite_midpoint(f_1_plus_ln_x, a, b, n=5)
    # Para la cota compuesta del punto medio, cada subintervalo tiene h=(b-a)/n
    # y el error total ≤ n * ((h^3)/24) * max|f''| = (b-a) * h^2 / 24 * M
    h = (b - a) / 5.0
    def f2(x):
        return -1.0 / (x * x)
    M2 = max_abs_on_interval(lambda x: abs(f2(x)), a, b)
    cota_mid_comp = 5 * ((h ** 3) / 24.0) * M2
    results.append(("Midpoint compuesta (5 subintervalos)", I_mid_comp, cota_mid_comp))

    # Exacto
    I_exact = exact_integral_of_1_plus_ln_x(a, b)

    rows = []
    for name, val, cota in results:
        rows.append({
            "Metodo": name,
            "Aproximacion": val,
            "Valor exacto": I_exact,
            "Error absoluto": abs(val - I_exact),
            "Cota teorica (estimada)": cota,
        })

    df = pd.DataFrame(rows)

    outdir = os.path.join(os.path.dirname(__file__), "outputs")
    os.makedirs(outdir, exist_ok=True)

    csv_path = os.path.join(outdir, "integration_results.csv")
    xlsx_path = os.path.join(outdir, "integration_results.xlsx")

    df.to_csv(csv_path, index=False)
    try:
        df.to_excel(xlsx_path, index=False)
    except Exception:
        pass

    print("Resultados de integración:")
    print(df.to_string(index=False))
    print(f"CSV guardado en: {csv_path}")
    print(f"XLSX guardado en: {xlsx_path} (si la librería está instalada)")


if __name__ == "__main__":
    main()
