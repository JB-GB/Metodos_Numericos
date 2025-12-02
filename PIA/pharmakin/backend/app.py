"""
API Backend para PharmaKin
Expone endpoints para simulación farmacocinética y acceso a datos
"""

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import numpy as np
from numerical_methods import simulate_pharmacokinetics
import json
import os

# Configurar Flask para servir el frontend
# En desarrollo: static_folder='../static' (fuera del backend)
# En Docker: static_folder='./static' (en el mismo directorio)
# First preference: if frontend has a built `dist` folder use it directly (dev or production)
static_candidates = [
    os.path.join(os.path.dirname(__file__), '..', 'frontend', 'dist'),
    os.path.join(os.path.dirname(__file__), '..', 'static'),
    os.path.join(os.path.dirname(__file__), 'static')
]

static_path = None
for cand in static_candidates:
    if os.path.exists(cand):
        static_path = cand
        break

if not static_path:
    # leave default (Flask will still create app with a non-existing folder but we will handle it)
    static_path = os.path.join(os.path.dirname(__file__), '..', 'static')

app = Flask(__name__, static_folder=static_path, static_url_path='')
CORS(app)  # Permitir CORS para el frontend React
print(f"[startup] Flask serving static files from: {static_path}")

# Cargar base de datos de principios activos
DB_PATH = os.path.join(os.path.dirname(__file__), 'data', 'active_principles.json')

def load_active_principles():
    """Carga la base de datos de principios activos"""
    try:
        with open(DB_PATH, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return []


@app.route('/api/simulate', methods=['POST'])
def simulate():
    """
    Endpoint para simular farmacocinética
    
    Body esperado:
    {
        "t_max": 24.0,
        "dt": 0.1,
        "V": 50.0,
        "Q": 20.0,
        "dose": 650.0,
        "route": "oral",
        "ka": 1.2,
        "num_doses": 4,
        "interval": 6.0
    }
    """
    try:
        data = request.json
        
        # Validar parámetros requeridos
        required = ['t_max', 'dt', 'V', 'Q', 'dose', 'route']
        for param in required:
            if param not in data:
                return jsonify({'error': f'Parámetro faltante: {param}'}), 400
        
        # Parámetros opcionales con valores por defecto
        ka = data.get('ka', 1.0)
        num_doses = data.get('num_doses', 1)
        interval = data.get('interval', 0.0)
        
        # Ejecutar simulación
        results = simulate_pharmacokinetics(
            t_max=float(data['t_max']),
            dt=float(data['dt']),
            V=float(data['V']),
            Q=float(data['Q']),
            dose=float(data['dose']),
            route=data['route'],
            ka=ka if ka else None,
            num_doses=int(num_doses),
            interval=float(interval)
        )
        
        return jsonify(results), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/active-principles', methods=['GET'])
def get_active_principles():
    """Obtiene todos los principios activos"""
    principles = load_active_principles()
    return jsonify(principles), 200


@app.route('/api/active-principles/<int:principle_id>', methods=['GET'])
def get_active_principle(principle_id):
    """Obtiene un principio activo específico por ID"""
    principles = load_active_principles()
    principle = next((p for p in principles if p['id'] == principle_id), None)
    
    if principle:
        return jsonify(principle), 200
    else:
        return jsonify({'error': 'Principio activo no encontrado'}), 404


@app.route('/api/active-principles/search', methods=['GET'])
def search_active_principles():
    """Busca principios activos por nombre"""
    query = request.args.get('q', '').lower()
    principles = load_active_principles()
    
    if query:
        filtered = [
            p for p in principles
            if query in p.get('commercial_name', '').lower() or
               query in p.get('formula_name', '').lower() or
               query in p.get('description', '').lower()
        ]
        return jsonify(filtered), 200
    else:
        return jsonify(principles), 200


@app.route('/api/health', methods=['GET'])
def health():
    """Endpoint de salud para verificar que el servidor está funcionando"""
    return jsonify({'status': 'ok'}), 200


# Servir el frontend en producción
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_frontend(path):
    """Sirve el frontend React en producción"""
    static_dir = app.static_folder
    
    # Si no existe el directorio estático, retornar error útil
    if not os.path.exists(static_dir):
        return jsonify({
            'error': 'Frontend no encontrado',
            'static_folder': static_dir,
            'message': 'El frontend no se construyó correctamente. Verifica el build.'
        }), 500
    
    # Si es la raíz o una ruta de la app, servir index.html
    if path == '' or not path.startswith('api') and not os.path.exists(os.path.join(static_dir, path)):
        index_path = os.path.join(static_dir, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_dir, 'index.html')
        else:
            return jsonify({
                'error': 'index.html no encontrado',
                'static_folder': static_dir,
                'files': os.listdir(static_dir) if os.path.exists(static_dir) else []
            }), 500
    
    # Servir archivos estáticos (JS, CSS, imágenes, etc.)
    file_path = os.path.join(static_dir, path)
    if os.path.exists(file_path) and os.path.isfile(file_path):
        return send_from_directory(static_dir, path)
    else:
        # Si no existe el archivo, servir index.html para SPA routing
        return send_from_directory(static_dir, 'index.html')


if __name__ == '__main__':
    # Crear directorio de datos si no existe
    os.makedirs(os.path.join(os.path.dirname(__file__), 'data'), exist_ok=True)
    
    # Ejecutar servidor
    debug_mode = os.getenv('FLASK_DEBUG', '0') == '1'
    app.run(debug=debug_mode, host='0.0.0.0', port=5000)

