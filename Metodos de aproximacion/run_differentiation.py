"""
Runner para el inciso 1 de Objectives.md

Calcula aproximaciones de f'(2) para f(x)=x ln x con h=0.1 usando varias
fórmulas. Genera una tabla con la aproximación, el error absoluto y la cota
teórica estimada (usando muestreo numérico de derivadas).

Salida: archivos CSV y XLSX en la carpeta `outputs/`.
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
    f_x_ln_x,
    forward_difference,
    backward_difference,
    central_difference,
    three_point_forward,
    three_point_backward,
    exact_derivative_x_ln_x,
    max_abs_on_interval,
)


def estimate_cota_forward(h: float, a: float, b: float) -> float:
    """Cota teórica aproximada para forward/backward (error ≤ M * |h| / 2),
    donde M = max |f''(x)| en [a,b]."""
    # f(x)=x ln x => f''(x) = 1/x
    def f2(x):
        return 1.0 / x
    M = max_abs_on_interval(f2, a, b)
    return M * abs(h) / 2.0


def estimate_cota_central(h: float, a: float, b: float) -> float:
    """Cota para central (error ≈ M h^2 / 6) con M = max |f'''(x)|."""
    # f(x)=x ln x => f'''(x) = -1/x^2
    def f3(x):
        return -1.0 / (x * x)
    M = max_abs_on_interval(f3, a, b)
    return M * (h ** 2) / 6.0


def estimate_cota_three_point(h: float, a: float, b: float) -> float:
    """Cota para fórmulas de 3 puntos (extremos), error ≈ M h^2 / 3, M = max |f'''|."""
    def f3(x):
        return -1.0 / (x * x)
    M = max_abs_on_interval(f3, a, b)
    return M * (h ** 2) / 3.0


def parse_args():
    p = argparse.ArgumentParser(description="Runner diferenciación: f(x)=x ln x en x0 con h")
    p.add_argument("--x0", type=float, default=2.0, help="punto donde se aproxima la derivada")
    p.add_argument("--h", type=float, default=0.1, help="incremento h")
    p.add_argument("--outdir", type=str, default=None, help="carpeta de salida para resultados")
    p.add_argument("--no-pandas", action="store_true", help="usar CSV nativo en lugar de pandas")
    return p.parse_args()


def main(x0: Optional[float] = None, h: Optional[float] = None, outdir: Optional[str] = None, no_pandas: bool = False):
    # Parámetros del ejercicio
    if x0 is None or h is None:
        args = parse_args()
        x0 = args.x0
        h = args.h
        outdir = args.outdir
        no_pandas = args.no_pandas

    # Para las cotas evaluamos en el intervalo que abarque puntos usados:
    a = x0 - 2 * h
    b = x0 + 2 * h

    # Calcular aproximaciones
    approx = {
        "Forward (1-step)": forward_difference(f_x_ln_x, x0, h),
        "Backward (1-step)": backward_difference(f_x_ln_x, x0, h),
        "Central (3-pt)": central_difference(f_x_ln_x, x0, h),
        "3-pt forward (left)": three_point_forward(f_x_ln_x, x0, h),
        "3-pt backward (right)": three_point_backward(f_x_ln_x, x0, h),
    }

    exact = exact_derivative_x_ln_x(x0)

    rows = []
    for name, value in approx.items():
        if "Forward" in name and "3-pt" not in name:
            cota = estimate_cota_forward(h, a, b)
        elif "Backward" in name and "3-pt" not in name:
            cota = estimate_cota_forward(h, a, b)
        elif "Central" in name:
            cota = estimate_cota_central(h, a, b)
        else:
            # 3-pt forward/backward endpoints
            cota = estimate_cota_three_point(h, a, b)

        rows.append({
            "Metodo": name,
            "Aproximacion": value,
            "Valor exacto": exact,
            "Error absoluto": abs(value - exact),
            "Cota teorica (estimada)": cota,
        })

    # Construir DataFrame si pandas está disponible y no se solicitó no_pandas
    if outdir is None:
        outdir = os.path.join(os.path.dirname(__file__), "outputs")
    os.makedirs(outdir, exist_ok=True)

    csv_path = os.path.join(outdir, "differentiation_results.csv")
    xlsx_path = os.path.join(outdir, "differentiation_results.xlsx")

    if (not no_pandas) and (pd is not None):
        df = pd.DataFrame(rows)
        df.to_csv(csv_path, index=False)
        try:
            df.to_excel(xlsx_path, index=False)
        except Exception:
            pass
        print("Resultados de diferenciación:")
        print(df.to_string(index=False))
        print(f"CSV guardado en: {csv_path}")
        print(f"XLSX guardado en: {xlsx_path} (si la librería está instalada)")
    else:
        # Escribir CSV nativo
        with open(csv_path, "w", newline='', encoding='utf-8') as fh:
            writer = csv.DictWriter(fh, fieldnames=["Metodo", "Aproximacion", "Valor exacto", "Error absoluto", "Cota teorica (estimada)"])
            writer.writeheader()
            for r in rows:
                writer.writerow(r)
        print("Resultados de diferenciación (CSV nativo):")
        for r in rows:
            print(r)
        print(f"CSV guardado en: {csv_path}")
        if (pd is None):
            print("pandas no detectado: no se generó XLSX")


if __name__ == "__main__":
    main()
