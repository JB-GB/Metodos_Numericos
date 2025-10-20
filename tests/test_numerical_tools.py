import math
import os
import sys

# Añadir la carpeta 'Metodos de aproximacion' al path para poder importar el módulo
tests_dir = os.path.dirname(__file__)
module_dir = os.path.abspath(os.path.join(tests_dir, '..', 'Metodos de aproximacion'))
if module_dir not in sys.path:
    sys.path.insert(0, module_dir)

import numerical_tools as nt  # type: ignore


def test_exact_derivative_x_ln_x():
    x = 2.0
    assert math.isclose(nt.exact_derivative_x_ln_x(x), 1.0 + math.log(x), rel_tol=1e-12)


def test_forward_backward_central_on_linear():
    # Para f(x)=3x+2 la derivada es 3 exacta. Probar con h pequeño.
    def f(x):
        return 3.0 * x + 2.0

    x0 = 1.5
    h = 1e-6
    fwd = nt.forward_difference(f, x0, h)
    bwd = nt.backward_difference(f, x0, h)
    cen = nt.central_difference(f, x0, h)

    assert abs(fwd - 3.0) < 1e-6
    assert abs(bwd - 3.0) < 1e-6
    assert abs(cen - 3.0) < 1e-9


def test_exact_integral_1_plus_ln_x():
    a = 1.0
    b = 2.0
    I = nt.exact_integral_of_1_plus_ln_x(a, b)
    # valor conocido b ln b - a ln a
    assert math.isclose(I, b * math.log(b) - a * math.log(a), rel_tol=1e-12)
