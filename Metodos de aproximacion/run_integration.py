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
import argparse
import csv
from typing import Optional
try:
    import pandas as pd
except Exception:
    pd = None

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


def parse_args():
    p = argparse.ArgumentParser(description="Runner integración para f(x)=1+ln x en [a,b]")
    p.add_argument("--a", type=float, default=1.0, help="límite inferior a")
    p.add_argument("--b", type=float, default=2.0, help="límite superior b")
    p.add_argument("--outdir", type=str, default=None, help="carpeta de salida para resultados")
    p.add_argument("--no-pandas", action="store_true", help="usar CSV nativo en lugar de pandas")
    return p.parse_args()


def main(a: Optional[float] = None, b: Optional[float] = None, outdir: Optional[str] = None, no_pandas: bool = False):
    if a is None or b is None:
        args = parse_args()
        a = args.a
        b = args.b
        outdir = args.outdir
        no_pandas = args.no_pandas

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

    if outdir is None:
        outdir = os.path.join(os.path.dirname(__file__), "outputs")
    os.makedirs(outdir, exist_ok=True)

    csv_path = os.path.join(outdir, "integration_results.csv")
    xlsx_path = os.path.join(outdir, "integration_results.xlsx")

    if (not no_pandas) and (pd is not None):
        df = pd.DataFrame(rows)
        df.to_csv(csv_path, index=False)
        try:
            df.to_excel(xlsx_path, index=False)
        except Exception:
            pass
        print("Resultados de integración:")
        print(df.to_string(index=False))
        print(f"CSV guardado en: {csv_path}")
        print(f"XLSX guardado en: {xlsx_path} (si la librería está instalada)")
    else:
        with open(csv_path, "w", newline='', encoding='utf-8') as fh:
            writer = csv.DictWriter(fh, fieldnames=["Metodo", "Aproximacion", "Valor exacto", "Error absoluto", "Cota teorica (estimada)"])
            writer.writeheader()
            for r in rows:
                writer.writerow(r)
        print("Resultados de integración (CSV nativo):")
        for r in rows:
            print(r)
        print(f"CSV guardado en: {csv_path}")
        if (pd is None):
            print("pandas no detectado: no se generó XLSX")


if __name__ == "__main__":
    main()
