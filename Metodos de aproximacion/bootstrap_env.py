"""
bootstrap_env.py

Script multiplataforma para crear un entorno virtual en la raíz del proyecto
e instalar las dependencias listadas en `requirements.txt` dentro de
la carpeta `Metodos de aproximacion`.

Uso: python bootstrap_env.py

Este script funciona en Windows y Linux/macOS. Crea un venv en
`../.venv` (un nivel arriba, en la raíz del repo) y ejecuta pip install -r
para que los scripts y el notebook funcionen de forma automática.
"""
from __future__ import annotations
import os
import sys
import subprocess
import venv


def create_venv(venv_path: str) -> None:
    if os.path.exists(venv_path):
        print(f"Entorno virtual ya existe en: {venv_path}")
        return
    print(f"Creando entorno virtual en: {venv_path}")
    venv.EnvBuilder(with_pip=True).create(venv_path)


def get_python_executable(venv_path: str) -> str:
    if sys.platform == "win32":
        return os.path.join(venv_path, "Scripts", "python.exe")
    else:
        return os.path.join(venv_path, "bin", "python")


def install_requirements(python_exe: str, requirements_file: str) -> None:
    if not os.path.exists(requirements_file):
        raise FileNotFoundError(f"requirements.txt no encontrado en {requirements_file}")
    print(f"Instalando dependencias desde {requirements_file} usando {python_exe}")
    subprocess.check_call([python_exe, "-m", "pip", "install", "-r", requirements_file])


def main():
    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    venv_path = os.path.join(repo_root, ".venv")
    requirements_file = os.path.join(os.path.dirname(__file__), "requirements.txt")

    create_venv(venv_path)
    python_exe = get_python_executable(venv_path)
    install_requirements(python_exe, requirements_file)

    print("Bootstrap completado. Activa el venv y ejecuta los scripts o abre el notebook:")
    if sys.platform == "win32":
        print(r".\\.venv\\Scripts\\Activate.ps1 (PowerShell)")
        print(r".\\.venv\\Scripts\\activate.bat (CMD)")
    else:
        print("source .venv/bin/activate")


if __name__ == "__main__":
    main()
