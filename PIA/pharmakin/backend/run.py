#!/usr/bin/env python
"""
Script para ejecutar el servidor Flask de PharmaKin
"""

from app import app

if __name__ == '__main__':
    print("=" * 50)
    print("PharmaKin Backend Server")
    print("=" * 50)
    print("Servidor iniciando en http://localhost:5000")
    print("Presiona Ctrl+C para detener el servidor")
    print("=" * 50)
    app.run(debug=True, port=5000, host='0.0.0.0')

