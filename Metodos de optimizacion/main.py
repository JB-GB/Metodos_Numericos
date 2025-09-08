"""
Programa de Métodos de Aproximación de Raíces para Funciones Continuas
Autor: JB-GB
Descripción: Implementación de 5 métodos numéricos para encontrar raíces y mínimos
"""

import math

# ==============================================================================
# DEFINICIÓN DE LA FUNCIÓN Y SUS DERIVADAS
# ==============================================================================

def f(x):
    """
    Función objetivo: f(x) = (1/2)x³ + e^(-x)
    Esta es la función para la cual buscaremos raíces o puntos mínimos

    Parámetros:
        x: valor de entrada (float)
    Retorna:
        valor de f(x) (float)
    """
    return 0.5 * x**3 + math.exp(-x)

def f_prima(x):
    """
    Primera derivada de f(x): f'(x) = (3/2)x² - e^(-x)
    Necesaria para el método de Newton-Raphson y para encontrar mínimos

    Parámetros:
        x: valor de entrada (float)
    Retorna:
        valor de f'(x) (float)
    """
    return 1.5 * x**2 - math.exp(-x)

def f_doble_prima(x):
    """
    Segunda derivada de f(x): f''(x) = 3x + e^(-x)
    Necesaria para el método de Newton-Raphson cuando buscamos mínimos

    Parámetros:
        x: valor de entrada (float)
    Retorna:
        valor de f''(x) (float)
    """
    return 3 * x + math.exp(-x)

# ==============================================================================
# IMPLEMENTACIÓN DE LOS MÉTODOS NUMÉRICOS
# ==============================================================================

def metodo_biseccion(a, b, tolerancia, max_iter, buscar_minimo=False):
    """
    MÉTODO DE BISECCIÓN
    -------------------
    Algoritmo: Divide el intervalo [a,b] por la mitad repetidamente.
    Si f(a) y f(b) tienen signos opuestos, la raíz está en el intervalo.
    En cada iteración, se conserva la mitad donde cambia el signo.

    Ventajas: Simple, robusto, siempre converge si existe raíz
    Desventajas: Convergencia lenta (lineal)

    Parámetros:
        a: límite inferior del intervalo (float)
        b: límite superior del intervalo (float)
        tolerancia: error máximo permitido (float)
        max_iter: número máximo de iteraciones (int)
        buscar_minimo: si True, busca el mínimo usando f'(x) = 0
    """

    print("\n" + "="*70)
    print("MÉTODO DE BISECCIÓN")
    print("="*70)

    # Seleccionar la función objetivo según lo que buscamos
    func = f_prima if buscar_minimo else f
    nombre_func = "f'(x)" if buscar_minimo else "f(x)"

    # Verificar el teorema de Bolzano (cambio de signo)
    if func(a) * func(b) >= 0:
        print(f"  Advertencia: {nombre_func} no cambia de signo en [{a}, {b}]")
        print("El método podría no converger a una raíz.")

    # Inicialización de variables
    iteracion = 0
    error = abs(b - a)

    # Encabezado de la tabla de resultados
    print(f"\n{'Iter':<6} {'a':<12} {'b':<12} {'c':<12} {nombre_func+'(c)':<12} {'Error':<12}")
    print("-" * 70)

    while iteracion < max_iter and error > tolerancia:
        # Punto medio del intervalo
        c = (a + b) / 2
        fc = func(c)

        # Mostrar resultados de la iteración actual
        print(f"{iteracion+1:<6} {a:<12.8f} {b:<12.8f} {c:<12.8f} {fc:<12.8f} {error:<12.8f}")

        # Criterio de parada: f(c) es suficientemente pequeño
        if abs(fc) < tolerancia:
            break

        # Decidir en qué mitad continuar
        if func(a) * fc < 0:
            b = c  # La raíz está en [a, c]
        else:
            a = c  # La raíz está en [c, b]

        # Actualizar error y contador
        error = abs(b - a) / 2
        iteracion += 1

    # Resultado final
    raiz = (a + b) / 2
    print("\n" + "="*70)
    if buscar_minimo:
        print(f"✓ Mínimo encontrado en x = {raiz:.8f}")
        print(f"  Valor mínimo f(x) = {f(raiz):.8f}")
    else:
        print(f"✓ Raíz aproximada: x = {raiz:.8f}")
        print(f"  Valor de f(x) = {func(raiz):.8f}")
    print(f"  Iteraciones realizadas: {iteracion}")
    print(f"  Error final: {error:.2e}")

    return raiz, iteracion

def iteracion_punto_fijo(x0, tolerancia, max_iter, buscar_minimo=False):
    """
    MÉTODO DE ITERACIÓN DE PUNTO FIJO
    ----------------------------------
    Algoritmo: Transforma f(x) = 0 en x = g(x) y busca el punto fijo.
    Itera: x_{n+1} = g(x_n) hasta convergencia.

    Para f(x) = (1/2)x³ + e^(-x), usamos g(x) = -ln((1/2)x³)
    Para mínimos, aplicamos el método a f'(x) = 0

    Ventajas: Simple de implementar
    Desventajas: Requiere |g'(x)| < 1 para convergencia

    Parámetros:
        x0: valor inicial (float)
        tolerancia: error máximo permitido (float)
        max_iter: número máximo de iteraciones (int)
        buscar_minimo: si True, busca el mínimo
    """

    print("\n" + "="*70)
    print("MÉTODO DE ITERACIÓN DE PUNTO FIJO")
    print("="*70)

    def g(x):
        """Función de iteración g(x) para f(x) = 0"""
        try:
            if buscar_minimo:
                # Para f'(x) = 0: (3/2)x² = e^(-x)
                # Despejamos: x = sqrt(2/3 * e^(-x))
                return math.sqrt(2/3 * math.exp(-x))
            else:
                # Para f(x) = 0: (1/2)x³ = -e^(-x)
                # Esta ecuación es difícil de resolver, usamos una aproximación
                return -0.5 * x**3 + x + math.exp(-x)
        except:
            return x  # En caso de error matemático

    # Inicialización
    x_actual = x0
    iteracion = 0
    error = float('inf')

    # Encabezado de la tabla
    print(f"\n{'Iter':<6} {'x_n':<15} {'g(x_n)':<15} {'Error':<15}")
    print("-" * 60)

    while iteracion < max_iter and error > tolerancia:
        try:
            x_nuevo = g(x_actual)
            error = abs(x_nuevo - x_actual)

            print(f"{iteracion+1:<6} {x_actual:<15.10f} {x_nuevo:<15.10f} {error:<15.10e}")

            x_actual = x_nuevo
            iteracion += 1

            # Verificar divergencia
            if abs(x_actual) > 1e10:
                print("\n  El método está divergiendo")
                break

        except:
            print("\n  Error numérico en la iteración")
            break

    # Resultado final
    print("\n" + "="*70)
    if buscar_minimo:
        print(f"✓ Mínimo encontrado en x = {x_actual:.8f}")
        print(f"  Valor mínimo f(x) = {f(x_actual):.8f}")
    else:
        print(f"✓ Raíz aproximada: x = {x_actual:.8f}")
        print(f"  Valor de f(x) = {f(x_actual):.8f}")
    print(f"  Iteraciones realizadas: {iteracion}")
    print(f"  Error final: {error:.2e}")

    return x_actual, iteracion

def metodo_newton_raphson(x0, tolerancia, max_iter, buscar_minimo=False):
    """
    MÉTODO DE NEWTON-RAPHSON
    ------------------------
    Algoritmo: Usa la derivada para aproximación lineal.
    Fórmula: x_{n+1} = x_n - f(x_n)/f'(x_n)

    Para mínimos: Aplicamos el método a f'(x) = 0
    Fórmula: x_{n+1} = x_n - f'(x_n)/f''(x_n)

    Ventajas: Convergencia cuadrática (muy rápida)
    Desventajas: Requiere derivada, sensible al punto inicial

    Parámetros:
        x0: valor inicial (float)
        tolerancia: error máximo permitido (float)
        max_iter: número máximo de iteraciones (int)
        buscar_minimo: si True, busca el mínimo
    """

    print("\n" + "="*70)
    print("MÉTODO DE NEWTON-RAPHSON")
    print("="*70)

    # Inicialización
    x_actual = x0
    iteracion = 0
    error = float('inf')

    # Encabezado de la tabla
    if buscar_minimo:
        print(f"\n{'Iter':<6} {'x_n':<15} {'f\'(x_n)':<15} {'f\'\'(x_n)':<15} {'Error':<15}")
    else:
        print(f"\n{'Iter':<6} {'x_n':<15} {'f(x_n)':<15} {'f\'(x_n)':<15} {'Error':<15}")
    print("-" * 75)

    while iteracion < max_iter and error > tolerancia:
        if buscar_minimo:
            # Para encontrar mínimos: resolver f'(x) = 0
            fx = f_prima(x_actual)
            fpx = f_doble_prima(x_actual)

            if abs(fpx) < 1e-10:
                print("\n  Derivada segunda muy pequeña, el método puede fallar")
                break

            x_nuevo = x_actual - fx / fpx
            error = abs(x_nuevo - x_actual)

            print(f"{iteracion+1:<6} {x_actual:<15.10f} {fx:<15.10f} {fpx:<15.10f} {error:<15.10e}")
        else:
            # Para encontrar raíces: resolver f(x) = 0
            fx = f(x_actual)
            fpx = f_prima(x_actual)

            if abs(fpx) < 1e-10:
                print("\n  Derivada muy pequeña, el método puede fallar")
                break

            x_nuevo = x_actual - fx / fpx
            error = abs(x_nuevo - x_actual)

            print(f"{iteracion+1:<6} {x_actual:<15.10f} {fx:<15.10f} {fpx:<15.10f} {error:<15.10e}")

        x_actual = x_nuevo
        iteracion += 1

        # Verificar convergencia
        if abs(fx) < tolerancia:
            break

    # Resultado final
    print("\n" + "="*70)
    if buscar_minimo:
        print(f"✓ Mínimo encontrado en x = {x_actual:.8f}")
        print(f"  Valor mínimo f(x) = {f(x_actual):.8f}")
        print(f"  Verificación f'(x) = {f_prima(x_actual):.2e}")
    else:
        print(f"✓ Raíz aproximada: x = {x_actual:.8f}")
        print(f"  Valor de f(x) = {f(x_actual):.2e}")
    print(f"  Iteraciones realizadas: {iteracion}")
    print(f"  Error final: {error:.2e}")

    return x_actual, iteracion

def metodo_secante(x0, x1, tolerancia, max_iter, buscar_minimo=False):
    """
    MÉTODO DE LA SECANTE
    --------------------
    Algoritmo: Aproxima la derivada usando dos puntos anteriores.
    Fórmula: x_{n+1} = x_n - f(x_n) * (x_n - x_{n-1}) / (f(x_n) - f(x_{n-1}))

    Es como Newton-Raphson pero sin calcular derivadas explícitamente.

    Ventajas: No requiere derivada, convergencia superlineal
    Desventajas: Requiere dos puntos iniciales, puede diverger

    Parámetros:
        x0, x1: dos valores iniciales (float)
        tolerancia: error máximo permitido (float)
        max_iter: número máximo de iteraciones (int)
        buscar_minimo: si True, busca el mínimo
    """

    print("\n" + "="*70)
    print("MÉTODO DE LA SECANTE")
    print("="*70)

    # Seleccionar función según objetivo
    func = f_prima if buscar_minimo else f
    nombre_func = "f'(x)" if buscar_minimo else "f(x)"

    # Inicialización con dos puntos
    x_ant = x0
    x_actual = x1
    iteracion = 0
    error = abs(x1 - x0)

    # Encabezado de la tabla
    print(f"\n{'Iter':<6} {'x_{n-1}':<15} {'x_n':<15} {nombre_func+'_n':<15} {'Error':<15}")
    print("-" * 75)

    while iteracion < max_iter and error > tolerancia:
        fx_ant = func(x_ant)
        fx_actual = func(x_actual)

        # Evitar división por cero
        denominador = fx_actual - fx_ant
        if abs(denominador) < 1e-10:
            print("\n  Denominador muy pequeño, el método puede fallar")
            break

        # Fórmula de la secante
        x_nuevo = x_actual - fx_actual * (x_actual - x_ant) / denominador
        error = abs(x_nuevo - x_actual)

        print(f"{iteracion+1:<6} {x_ant:<15.10f} {x_actual:<15.10f} {fx_actual:<15.10f} {error:<15.10e}")

        # Actualizar puntos para siguiente iteración
        x_ant = x_actual
        x_actual = x_nuevo
        iteracion += 1

        # Verificar convergencia
        if abs(func(x_actual)) < tolerancia:
            break

    # Resultado final
    print("\n" + "="*70)
    if buscar_minimo:
        print(f"✓ Mínimo encontrado en x = {x_actual:.8f}")
        print(f"  Valor mínimo f(x) = {f(x_actual):.8f}")
    else:
        print(f"✓ Raíz aproximada: x = {x_actual:.8f}")
        print(f"  Valor de f(x) = {f(x_actual):.2e}")
    print(f"  Iteraciones realizadas: {iteracion}")
    print(f"  Error final: {error:.2e}")

    return x_actual, iteracion

def metodo_seccion_aurea(a, b, tolerancia, max_iter):
    """
    MÉTODO DE LA SECCIÓN ÁUREA
    --------------------------
    Algoritmo: Optimización para encontrar mínimos/máximos sin derivadas.
    Usa la proporción áurea φ = (√5 - 1)/2 ≈ 0.618 para dividir el intervalo.

    Similar a bisección pero para optimización, mantiene proporciones
    que minimizan el número de evaluaciones de la función.

    Ventajas: No requiere derivadas, robusto para funciones unimodales
    Desventajas: Solo para optimización, convergencia lineal

    Parámetros:
        a: límite inferior del intervalo (float)
        b: límite superior del intervalo (float)
        tolerancia: error máximo permitido (float)
        max_iter: número máximo de iteraciones (int)
    """

    print("\n" + "="*70)
    print("MÉTODO DE LA SECCIÓN ÁUREA (para encontrar mínimo)")
    print("="*70)

    # Razón áurea
    phi = (math.sqrt(5) - 1) / 2  # ≈ 0.618

    # Puntos iniciales usando la razón áurea
    x1 = a + (1 - phi) * (b - a)
    x2 = a + phi * (b - a)

    # Evaluaciones iniciales
    f1 = f(x1)
    f2 = f(x2)

    iteracion = 0
    error = abs(b - a)

    # Encabezado de la tabla
    print(f"\n{'Iter':<6} {'a':<12} {'b':<12} {'x1':<12} {'x2':<12} {'f(x1)':<12} {'f(x2)':<12} {'Error':<12}")
    print("-" * 100)

    while iteracion < max_iter and error > tolerancia:
        print(f"{iteracion+1:<6} {a:<12.8f} {b:<12.8f} {x1:<12.8f} {x2:<12.8f} {f1:<12.8f} {f2:<12.8f} {error:<12.8f}")

        if f1 < f2:
            # El mínimo está en [a, x2]
            b = x2
            x2 = x1
            f2 = f1
            x1 = a + (1 - phi) * (b - a)
            f1 = f(x1)
        else:
            # El mínimo está en [x1, b]
            a = x1
            x1 = x2
            f1 = f2
            x2 = a + phi * (b - a)
            f2 = f(x2)

        error = abs(b - a)
        iteracion += 1

    # El mínimo está en el punto medio del intervalo final
    x_min = (a + b) / 2
    f_min = f(x_min)

    # Resultado final
    print("\n" + "="*70)
    print(f"✓ Mínimo encontrado en x = {x_min:.8f}")
    print(f"  Valor mínimo f(x) = {f_min:.8f}")
    print(f"  Iteraciones realizadas: {iteracion}")
    print(f"  Error final (tamaño del intervalo): {error:.2e}")

    # Verificación con la derivada
    print(f"  Verificación f'(x) = {f_prima(x_min):.2e} (debe ser ≈ 0)")

    return x_min, iteracion

# ==============================================================================
# FUNCIONES AUXILIARES
# ==============================================================================

def mostrar_funcion():
    """Muestra la función cargada en el programa"""
    print("\n" + "="*70)
    print("FUNCIÓN CARGADA EN EL PROGRAMA")
    print("="*70)
    print("\n  f(x) = (1/2)x³ + e^(-x)")
    print("\n  Primera derivada: f'(x) = (3/2)x² - e^(-x)")
    print("  Segunda derivada: f''(x) = 3x + e^(-x)")
    print("\n" + "="*70)

def solicitar_parametros(metodo_num):
    """
    Solicita los parámetros necesarios según el método seleccionado

    Parámetros:
        metodo_num: número del método seleccionado (int)

    Retorna:
        diccionario con los parámetros ingresados
    """
    params = {}

    print("\n--- Ingreso de Parámetros ---")

    # Parámetros comunes
    if metodo_num in [1, 5]:  # Bisección y Sección Áurea requieren intervalo
        params['a'] = float(input("Límite inferior del intervalo (a): "))
        params['b'] = float(input("Límite superior del intervalo (b): "))
    elif metodo_num == 4:  # Secante requiere dos puntos iniciales
        params['x0'] = float(input("Primer valor inicial (x0): "))
        params['x1'] = float(input("Segundo valor inicial (x1): "))
    else:  # Newton-Raphson e Iteración de punto fijo
        params['x0'] = float(input("Valor inicial (x0): "))

    # Tolerancia y máximo de iteraciones
    params['tolerancia'] = float(input("Tolerancia para el error (ej: 1e-6): "))
    params['max_iter'] = int(input("Número máximo de iteraciones: "))

    # Para métodos que pueden buscar raíces o mínimos
    if metodo_num in [1, 2, 3, 4]:
        print("\n¿Qué desea encontrar?")
        print("1. Raíz de f(x) = 0")
        print("2. Mínimo de f(x)")
        opcion = input("Seleccione (1 o 2): ")
        params['buscar_minimo'] = (opcion == '2')

    return params

# ==============================================================================
# PROGRAMA PRINCIPAL
# ==============================================================================

def main():
    """Función principal del programa"""

    print("\n" + "="*70)
    print(" PROGRAMA DE MÉTODOS DE APROXIMACIÓN DE RAÍCES")
    print(" Y OPTIMIZACIÓN PARA FUNCIONES CONTINUAS")
    print("="*70)

    while True:
        # Mostrar función actual
        mostrar_funcion()

        # Menú de métodos
        print("\nMÉTODOS DISPONIBLES:")
        print("-" * 40)
        print("1. Método de Bisección")
        print("2. Iteración de Punto Fijo")
        print("3. Método de Newton-Raphson")
        print("4. Método de la Secante")
        print("5. Método de la Sección Áurea")
        print("0. Salir del programa")
        print("-" * 40)

        try:
            opcion = int(input("\nSeleccione un método (0-5): "))

            if opcion == 0:
                print("\n¡Gracias por usar el programa!")
                break
            elif opcion < 1 or opcion > 5:
                print("\n  Opción no válida. Intente nuevamente.")
                continue

            # Solicitar parámetros
            params = solicitar_parametros(opcion)

            # Ejecutar método seleccionado
            if opcion == 1:
                metodo_biseccion(params['a'], params['b'], 
                               params['tolerancia'], params['max_iter'],
                               params.get('buscar_minimo', False))
            elif opcion == 2:
                iteracion_punto_fijo(params['x0'], 
                                   params['tolerancia'], params['max_iter'],
                                   params.get('buscar_minimo', False))
            elif opcion == 3:
                metodo_newton_raphson(params['x0'], 
                                    params['tolerancia'], params['max_iter'],
                                    params.get('buscar_minimo', False))
            elif opcion == 4:
                metodo_secante(params['x0'], params['x1'],
                             params['tolerancia'], params['max_iter'],
                             params.get('buscar_minimo', False))
            elif opcion == 5:
                metodo_seccion_aurea(params['a'], params['b'],
                                   params['tolerancia'], params['max_iter'])

            # Preguntar si desea continuar
            print("\n" + "="*70)
            continuar = input("\n¿Desea probar otro método? (s/n): ")
            if continuar.lower() != 's':
                print("\n¡Gracias por usar el programa!")
                break

        except ValueError:
            print("\n  Error: Ingrese valores numéricos válidos.")
        except Exception as e:
            print(f"\n  Error inesperado: {e}")

if __name__ == "__main__":
    main()
