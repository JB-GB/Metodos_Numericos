import numpy as np
from PIL import Image, ImageDraw

# Crear imagen de prueba (PNG)
ancho, alto = 300, 150
img = Image.new("L", (ancho, alto), 255)  # fondo blanco
draw = ImageDraw.Draw(img)

# Dibujar un contorno oscuro (ejemplo: arco parabólico)
puntos = [(x, int(50 + 30*np.sin(x/40))) for x in range(20, ancho-20)]
for x, y in puntos:
    draw.line([(x, y), (x, alto)], fill=0)  # rellenamos hacia abajo para que tenga contorno

# Guardar imagen de prueba
ruta_prueba = "./imagen_prueba.png"
img.save(ruta_prueba)
ruta_prueba