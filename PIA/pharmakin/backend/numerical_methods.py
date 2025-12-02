"""
Módulo de Métodos Numéricos para Farmacocinética
Implementa los métodos de Euler, Runge-Kutta y solución exacta
para resolver la ecuación diferencial: V * dC/dt = u(t) - Q * C(t)
"""

import numpy as np
from typing import List, Tuple, Callable


def exact_solution(
    t: np.ndarray,
    V: float,
    Q: float,
    u: Callable[[float], float],
    C0: float = 0.0
) -> np.ndarray:
    """
    Solución exacta de la ecuación diferencial farmacocinética.
    
    Para la ecuación: V * dC/dt = u(t) - Q * C(t)
    La solución exacta es: C(t) = e^(-Q*t/V) * [C0 + ∫(u(s)/V * e^(Q*s/V)) ds]
    
    Para u(t) constante (bolus): u(t) = D*δ(t) o u(t) = constante
    Para infusión constante: u(t) = u0
    
    Parámetros:
    -----------
    t : np.ndarray
        Array de tiempos donde calcular la solución
    V : float
        Volumen plasmático efectivo (L)
    Q : float
        Tasa de eliminación metabólica (L/h)
    u : Callable
        Función que describe la tasa de administración u(t)
    C0 : float
        Concentración inicial (mg/L), por defecto 0
    
    Retorna:
    --------
    np.ndarray
        Concentraciones en cada punto de tiempo
    """
    dt = t[1] - t[0] if len(t) > 1 else 0.1
    C = np.zeros_like(t)
    C[0] = C0
    
    # Constante k = Q/V para simplificar cálculos
    k = Q / V
    
    # Factor de integración: e^(-k*t)
    # Usamos integración numérica mejorada (regla del trapecio compuesta)
    for i in range(1, len(t)):
        # Integración numérica del término u(s)/V * e^(k*s) desde 0 hasta t[i]
        # Usando regla del trapecio compuesta para mayor precisión
        integral = 0.0
        
        # Punto inicial
        s0 = 0.0
        exp_factor_0 = np.exp(k * s0)
        u0 = u(s0)
        integral += 0.5 * (u0 / V) * exp_factor_0 * dt
        
        # Puntos intermedios
        for j in range(1, i):
            s = t[j]
            exp_factor = np.exp(k * s)
            u_val = u(s)
            integral += (u_val / V) * exp_factor * dt
        
        # Punto final
        s_final = t[i]
        exp_factor_final = np.exp(k * s_final)
        u_final = u(s_final)
        integral += 0.5 * (u_final / V) * exp_factor_final * dt
        
        # Solución exacta usando factor integrante
        # C(t) = e^(-k*t) * [C0 + ∫(u(s)/V * e^(k*s)) ds]
        C[i] = np.exp(-k * t[i]) * (C0 + integral)
    
    return C


def euler_method(
    t: np.ndarray,
    V: float,
    Q: float,
    u: Callable[[float], float],
    C0: float = 0.0
) -> np.ndarray:
    """
    Método de Euler para resolver la ecuación diferencial farmacocinética.
    
    El método de Euler es un método de primer orden que aproxima:
    C(t+dt) ≈ C(t) + dt * dC/dt
    
    Donde: dC/dt = (u(t) - Q*C(t)) / V
    
    Parámetros:
    -----------
    t : np.ndarray
        Array de tiempos (puntos de malla)
    V : float
        Volumen plasmático efectivo (L)
    Q : float
        Tasa de eliminación metabólica (L/h)
    u : Callable
        Función de tasa de administración u(t)
    C0 : float
        Concentración inicial (mg/L)
    
    Retorna:
    --------
    np.ndarray
        Concentraciones aproximadas en cada punto de tiempo
    """
    dt = t[1] - t[0] if len(t) > 1 else 0.1
    C = np.zeros_like(t)
    C[0] = C0
    
    # Iteración de Euler
    for i in range(len(t) - 1):
        # Derivada en el punto actual
        dC_dt = (u(t[i]) - Q * C[i]) / V
        
        # Aproximación de Euler: C(t+dt) = C(t) + dt * dC/dt
        C[i + 1] = C[i] + dt * dC_dt
    
    return C


def runge_kutta_4(
    t: np.ndarray,
    V: float,
    Q: float,
    u: Callable[[float], float],
    C0: float = 0.0
) -> np.ndarray:
    """
    Método de Runge-Kutta de cuarto orden (RK4) para resolver la EDO.
    
    RK4 es un método de cuarto orden que proporciona mayor precisión que Euler.
    Utiliza un promedio ponderado de cuatro estimaciones de la derivada:
    - k1: derivada en el punto actual
    - k2: derivada en el punto medio usando k1
    - k3: derivada en el punto medio usando k2
    - k4: derivada en el punto final usando k3
    
    C(t+dt) = C(t) + (dt/6) * (k1 + 2*k2 + 2*k3 + k4)
    
    Parámetros:
    -----------
    t : np.ndarray
        Array de tiempos (puntos de malla)
    V : float
        Volumen plasmático efectivo (L)
    Q : float
        Tasa de eliminación metabólica (L/h)
    u : Callable
        Función de tasa de administración u(t)
    C0 : float
        Concentración inicial (mg/L)
    
    Retorna:
    --------
    np.ndarray
        Concentraciones aproximadas en cada punto de tiempo
    """
    dt = t[1] - t[0] if len(t) > 1 else 0.1
    C = np.zeros_like(t)
    C[0] = C0
    
    # Función que define la derivada dC/dt
    def dC_dt_func(t_val: float, C_val: float) -> float:
        """Calcula la derivada dC/dt = (u(t) - Q*C) / V"""
        return (u(t_val) - Q * C_val) / V
    
    # Iteración de Runge-Kutta 4
    for i in range(len(t) - 1):
        # k1: pendiente en el punto inicial
        k1 = dt * dC_dt_func(t[i], C[i])
        
        # k2: pendiente en el punto medio usando k1
        k2 = dt * dC_dt_func(t[i] + dt/2, C[i] + k1/2)
        
        # k3: pendiente en el punto medio usando k2
        k3 = dt * dC_dt_func(t[i] + dt/2, C[i] + k2/2)
        
        # k4: pendiente en el punto final usando k3
        k4 = dt * dC_dt_func(t[i] + dt, C[i] + k3)
        
        # Promedio ponderado de las cuatro pendientes
        C[i + 1] = C[i] + (k1 + 2*k2 + 2*k3 + k4) / 6
    
    return C


def calculate_error(exact: np.ndarray, approximate: np.ndarray) -> dict:
    """
    Calcula métricas de error entre solución exacta y aproximada.
    
    Parámetros:
    -----------
    exact : np.ndarray
        Valores de la solución exacta
    approximate : np.ndarray
        Valores de la solución aproximada
    
    Retorna:
    --------
    dict
        Diccionario con diferentes métricas de error
    """
    # Error absoluto en cada punto
    absolute_error = np.abs(exact - approximate)
    
    # Error relativo (evitando división por cero)
    relative_error = np.where(
        exact != 0,
        np.abs((exact - approximate) / exact) * 100,
        0
    )
    
    # Error cuadrático medio (RMSE)
    mse = np.mean((exact - approximate) ** 2)
    rmse = np.sqrt(mse)
    
    # Error máximo
    max_error = np.max(absolute_error)
    max_relative_error = np.max(relative_error)
    
    return {
        'absolute_error': absolute_error.tolist(),
        'relative_error': relative_error.tolist(),
        'rmse': float(rmse),
        'max_error': float(max_error),
        'max_relative_error': float(max_relative_error),
        'mean_absolute_error': float(np.mean(absolute_error))
    }


def simulate_pharmacokinetics(
    t_max: float,
    dt: float,
    V: float,
    Q: float,
    dose: float,
    route: str,
    ka: float = None,
    num_doses: int = 1,
    interval: float = 0.0
) -> dict:
    """
    Simula la farmacocinética usando múltiples métodos numéricos.
    
    Parámetros:
    -----------
    t_max : float
        Tiempo máximo de simulación (horas)
    dt : float
        Paso de tiempo (horas)
    V : float
        Volumen plasmático efectivo (L)
    Q : float
        Tasa de eliminación metabólica (L/h)
    dose : float
        Dosis administrada (mg)
    route : str
        Vía de administración: 'iv', 'oral', 'topical'
    ka : float
        Constante de absorción (1/h) para vía oral
    num_doses : int
        Número de dosis
    interval : float
        Intervalo entre dosis (horas)
    
    Retorna:
    --------
    dict
        Diccionario con resultados de todos los métodos
    """
    # Crear array de tiempos
    t = np.arange(0, t_max + dt, dt)
    # Constante de absorción efectiva (si no se proporciona, usar 1.0)
    ka_effective = ka if ka is not None else 1.0
    
    # Definir función de administración u(t)
    def u(t_val: float) -> float:
        """Función que describe la tasa de administración"""
        if route == 'iv':
            # Infusión intravenosa instantánea (bolus) en t=0
            # Para múltiples dosis, se suman los efectos
            total = 0.0
            for i in range(num_doses):
                dose_time = i * interval
                if abs(t_val - dose_time) < dt/2:  # Aproximación de delta de Dirac
                    total += dose / dt  # Normalización para que la integral sea 'dose'
            return total
        elif route == 'oral':
            # Absorción de primer orden con constante ka
            # Modelo: u(t) = F * ka * D * e^{-ka (t - t_dose)}
            F = 1.0  # Biodisponibilidad (fracción de dosis que llega al plasma)
            total = 0.0
            for i in range(num_doses):
                dose_time = i * interval
                if t_val >= dose_time:
                    time_since_dose = t_val - dose_time
                    total += ka_effective * F * dose * np.exp(-ka_effective * time_since_dose)
            return total
        elif route == 'topical':
            # Para pomadas, modelo simplificado de absorción lenta
            ka_topical = ka_effective * 0.3
            total = 0.0
            for i in range(num_doses):
                dose_time = i * interval
                if t_val >= dose_time:
                    time_since_dose = t_val - dose_time
                    total += ka_topical * dose * np.exp(-ka_topical * time_since_dose)
            return total
        else:
            return 0.0
    
    # Calcular soluciones con diferentes métodos
    C_exact = exact_solution(t, V, Q, u, C0=0.0)
    C_euler = euler_method(t, V, Q, u, C0=0.0)
    C_rk4 = runge_kutta_4(t, V, Q, u, C0=0.0)
    
    # Calcular errores
    error_euler = calculate_error(C_exact, C_euler)
    error_rk4 = calculate_error(C_exact, C_rk4)
    
    # Preparar resultados
    results = {
        'time': t.tolist(),
        'exact': C_exact.tolist(),
        'euler': C_euler.tolist(),
        'runge_kutta': C_rk4.tolist(),
        'errors': {
            'euler': error_euler,
            'runge_kutta': error_rk4
        }
    }
    
    return results

