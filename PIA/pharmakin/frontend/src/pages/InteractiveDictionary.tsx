import { useState, useEffect } from 'react'
import { Search, BookMarked, ExternalLink } from 'lucide-react'
import axios from 'axios'

interface Term {
  id: string
  term: string
  definition: string
  category: string
  relatedTerms?: string[]
  formula?: string
  unit?: string
}

const InteractiveDictionary = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTerm, setSelectedTerm] = useState<Term | null>(null)
  const [allTerms, setAllTerms] = useState<Term[]>([])

  // Base de datos de términos (en producción podría venir de una API)
  useEffect(() => {
    const terms: Term[] = [
      {
        id: 'farmacocinetica',
        term: 'Farmacocinética',
        definition: 'Rama de la farmacología que estudia los procesos que experimenta un fármaco en el organismo: absorción, distribución, metabolismo y eliminación (ADME).',
        category: 'Concepto General',
        relatedTerms: ['farmacodinamia', 'absorcion', 'distribucion', 'metabolismo', 'eliminacion'],
        formula: 'ADME'
      },
      {
        id: 'farmacodinamia',
        term: 'Farmacodinamia',
        definition: 'Estudio de los efectos bioquímicos y fisiológicos de los fármacos y sus mecanismos de acción.',
        category: 'Concepto General',
        relatedTerms: ['farmacocinetica']
      },
      {
        id: 'absorcion',
        term: 'Absorción',
        definition: 'Proceso por el cual un fármaco entra al torrente sanguíneo desde el sitio de administración. Depende de la vía de administración (oral, IV, tópica).',
        category: 'Proceso ADME',
        relatedTerms: ['farmacocinetica', 'via_administracion', 'constante_absorcion']
      },
      {
        id: 'distribucion',
        term: 'Distribución',
        definition: 'Movimiento del fármaco desde la sangre hacia los tejidos y órganos del cuerpo. Se caracteriza por el volumen de distribución (V).',
        category: 'Proceso ADME',
        relatedTerms: ['farmacocinetica', 'volumen_distribucion']
      },
      {
        id: 'metabolismo',
        term: 'Metabolismo',
        definition: 'Transformación química del fármaco en el organismo, principalmente en el hígado, para facilitar su eliminación.',
        category: 'Proceso ADME',
        relatedTerms: ['farmacocinetica', 'eliminacion']
      },
      {
        id: 'eliminacion',
        term: 'Eliminación',
        definition: 'Remoción del fármaco del organismo, principalmente a través de los riñones (orina) o el hígado (bilis).',
        category: 'Proceso ADME',
        relatedTerms: ['farmacocinetica', 'metabolismo', 'clearance']
      },
      {
        id: 'volumen_distribucion',
        term: 'Volumen de Distribución (V)',
        definition: 'Volumen aparente en el que se distribuye el fármaco en el organismo. Se calcula como V = Dosis / Concentración inicial. Unidades: litros (L).',
        category: 'Parámetro Farmacocinético',
        relatedTerms: ['distribucion', 'concentracion'],
        formula: 'V = D / C₀',
        unit: 'L'
      },
      {
        id: 'clearance',
        term: 'Clearance (Q)',
        definition: 'Volumen de plasma depurado del fármaco por unidad de tiempo. Indica la eficiencia de eliminación del organismo. Unidades: L/h.',
        category: 'Parámetro Farmacocinético',
        relatedTerms: ['eliminacion', 'tasa_eliminacion'],
        formula: 'Q = k × V',
        unit: 'L/h'
      },
      {
        id: 'vida_media',
        term: 'Vida Media (t₁/₂)',
        definition: 'Tiempo necesario para que la concentración del fármaco se reduzca a la mitad de su valor inicial. Relacionado con la constante de eliminación: t₁/₂ = ln(2) / k.',
        category: 'Parámetro Farmacocinético',
        relatedTerms: ['constante_eliminacion', 'clearance'],
        formula: 't₁/₂ = ln(2) / k = 0.693 / k',
        unit: 'h'
      },
      {
        id: 'constante_eliminacion',
        term: 'Constante de Eliminación (k)',
        definition: 'Constante que describe la velocidad de eliminación del fármaco. Relacionada con el clearance y volumen: k = Q / V. Unidades: 1/h.',
        category: 'Parámetro Farmacocinético',
        relatedTerms: ['clearance', 'volumen_distribucion', 'vida_media'],
        formula: 'k = Q / V',
        unit: '1/h'
      },
      {
        id: 'constante_absorcion',
        term: 'Constante de Absorción (ka)',
        definition: 'Constante que describe la velocidad de absorción del fármaco desde el sitio de administración. Valores mayores indican absorción más rápida. Unidades: 1/h.',
        category: 'Parámetro Farmacocinético',
        relatedTerms: ['absorcion', 'via_administracion'],
        formula: 'u(t) = ka × D × e^(-ka × t)',
        unit: '1/h'
      },
      {
        id: 'concentracion',
        term: 'Concentración (C)',
        definition: 'Cantidad de fármaco presente en el plasma sanguíneo por unidad de volumen. Se mide típicamente en mg/L o μg/mL.',
        category: 'Variable',
        relatedTerms: ['volumen_distribucion', 'dosis'],
        unit: 'mg/L'
      },
      {
        id: 'cme',
        term: 'Concentración Mínima Efectiva (CME)',
        definition: 'Concentración mínima del fármaco necesaria para producir el efecto terapéutico deseado. Por debajo de este valor, el fármaco no es efectivo.',
        category: 'Ventana Terapéutica',
        relatedTerms: ['cmt', 'ventana_terapeutica', 'concentracion'],
        unit: 'mg/L'
      },
      {
        id: 'cmt',
        term: 'Concentración Máxima Tolerada (CMT)',
        definition: 'Concentración máxima del fármaco que puede alcanzarse sin producir efectos tóxicos. Por encima de este valor, el fármaco puede ser peligroso.',
        category: 'Ventana Terapéutica',
        relatedTerms: ['cme', 'ventana_terapeutica', 'concentracion'],
        unit: 'mg/L'
      },
      {
        id: 'ventana_terapeutica',
        term: 'Ventana Terapéutica',
        definition: 'Rango de concentraciones del fármaco entre la CME y la CMT. El fármaco debe mantenerse dentro de este rango para ser efectivo y seguro.',
        category: 'Concepto Clínico',
        relatedTerms: ['cme', 'cmt', 'concentracion'],
        formula: 'CME < C(t) < CMT'
      },
      {
        id: 'via_administracion',
        term: 'Vía de Administración',
        definition: 'Ruta por la cual se introduce el fármaco en el organismo. Las principales son: oral, intravenosa (IV), tópica, intramuscular, subcutánea, etc.',
        category: 'Concepto General',
        relatedTerms: ['absorcion', 'constante_absorcion']
      },
      {
        id: 'modelo_compartimento',
        term: 'Modelo de Compartimento',
        definition: 'Modelo matemático que simplifica el organismo en uno o más compartimentos homogéneos donde el fármaco se distribuye. El modelo de compartimento único asume distribución instantánea.',
        category: 'Modelo Matemático',
        relatedTerms: ['farmacocinetica', 'ecuacion_diferencial'],
        formula: 'V × dC/dt = u(t) - Q × C(t)'
      },
      {
        id: 'ecuacion_diferencial',
        term: 'Ecuación Diferencial',
        definition: 'Ecuación que relaciona una función con sus derivadas. En farmacocinética, describe cómo cambia la concentración del fármaco con el tiempo.',
        category: 'Modelo Matemático',
        relatedTerms: ['modelo_compartimento', 'metodos_numericos'],
        formula: 'V × dC/dt = u(t) - Q × C(t)'
      },
      {
        id: 'metodos_numericos',
        term: 'Métodos Numéricos',
        definition: 'Técnicas computacionales para aproximar soluciones de ecuaciones diferenciales cuando no es posible obtener una solución analítica exacta. Incluyen Euler, Runge-Kutta, etc.',
        category: 'Método Computacional',
        relatedTerms: ['ecuacion_diferencial', 'euler', 'runge_kutta']
      },
      {
        id: 'euler',
        term: 'Método de Euler',
        definition: 'Método numérico de primer orden para resolver ecuaciones diferenciales. Utiliza la derivada en el punto actual: C(t+dt) = C(t) + dt × dC/dt. Simple pero menos preciso.',
        category: 'Método Numérico',
        relatedTerms: ['metodos_numericos', 'runge_kutta'],
        formula: 'C(t+dt) = C(t) + dt × dC/dt'
      },
      {
        id: 'runge_kutta',
        term: 'Método de Runge-Kutta 4',
        definition: 'Método numérico de cuarto orden que utiliza un promedio ponderado de cuatro estimaciones de la derivada. Más preciso que Euler pero requiere más cálculos.',
        category: 'Método Numérico',
        relatedTerms: ['metodos_numericos', 'euler', 'comparacion_metodos'],
        formula: 'C(t+dt) = C(t) + (dt/6) × (k₁ + 2k₂ + 2k₃ + k₄)'
      },
      {
        id: 'comparacion_metodos',
        term: 'Comparación de Métodos Numéricos',
        definition: 'Análisis de las diferencias entre métodos numéricos (Euler, RK4) y la solución exacta. Las diferencias en las gráficas se deben a: (1) Error de truncamiento: Euler tiene error O(Δt), RK4 tiene error O(Δt⁴), (2) Acumulación de error: Euler acumula error más rápidamente, (3) Precisión inicial: RK4 puede mostrar pequeñas diferencias al inicio porque usa información de puntos futuros, pero globalmente es más preciso. La solución exacta es la referencia "verdadera" pero requiere integración numérica para u(t) compleja.',
        category: 'Análisis',
        relatedTerms: ['euler', 'runge_kutta', 'metodos_numericos', 'error_numerico']
      },
      {
        id: 'rmse',
        term: 'RMSE (Root Mean Square Error)',
        definition: 'Métrica que resume el error promedio cuadrático entre la solución exacta y la aproximada. Se obtiene tomando la raíz cuadrada del promedio de los errores cuadráticos. Valores pequeños indican que la curva numérica sigue de cerca a la solución exacta.',
        category: 'Métrica de Error',
        relatedTerms: ['error_numerico', 'comparacion_metodos'],
        formula: 'RMSE = \\sqrt{\\frac{1}{n} \\sum_{i=1}^{n} (C_{exacto,i} - C_{aprox,i})^2}'
      },
      {
        id: 'error_numerico',
        term: 'Error Numérico',
        definition: 'Diferencia entre la solución exacta y la aproximación numérica. Incluye error de truncamiento (por aproximar derivadas) y error de redondeo (por precisión finita de la computadora). En farmacocinética, errores pequeños (< 1%) son generalmente aceptables.',
        category: 'Análisis',
        relatedTerms: ['comparacion_metodos', 'euler', 'runge_kutta', 'rmse']
      },
      {
        id: 'biodisponibilidad',
        term: 'Biodisponibilidad (F)',
        definition: 'Fracción de la dosis administrada que llega al torrente sanguíneo sin cambios. Para vía IV, F=1 (100%). Para vía oral, F<1 debido a pérdidas en el tracto gastrointestinal y metabolismo de primer paso. La biodisponibilidad afecta las concentraciones plasmáticas y puede explicar por qué algunas dosis orales resultan en concentraciones más bajas.',
        category: 'Parámetro Farmacocinético',
        relatedTerms: ['absorcion', 'via_administracion', 'concentracion'],
        formula: 'F = AUC_oral / AUC_iv'
      }
    ]
    setAllTerms(terms)
  }, [])

  const filteredTerms = allTerms.filter(term =>
    term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    term.definition.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleTermClick = (term: Term) => {
    setSelectedTerm(term)
  }

  const handleRelatedTermClick = (termId: string) => {
    const term = allTerms.find(t => t.id === termId)
    if (term) {
      setSelectedTerm(term)
      setSearchTerm('')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <BookMarked className="w-8 h-8 text-indigo-600" />
          <h1 className="text-4xl font-bold text-indigo-900">Diccionario Interactivo</h1>
        </div>
        <p className="text-gray-600 mb-8">
          Explora términos relacionados con farmacocinética. Haz clic en términos relacionados para navegar.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel de búsqueda y lista */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-lg shadow-lg p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar término..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-4 max-h-96 overflow-y-auto">
              <h3 className="font-bold mb-3">Términos ({filteredTerms.length})</h3>
              <div className="space-y-2">
                {filteredTerms.map(term => (
                  <button
                    key={term.id}
                    onClick={() => handleTermClick(term)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedTerm?.id === term.id
                        ? 'bg-indigo-100 border-2 border-indigo-500'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="font-semibold text-sm">{term.term}</div>
                    <div className="text-xs text-gray-500 mt-1">{term.category}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Panel de detalles */}
          <div className="lg:col-span-2">
            {selectedTerm ? (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">{selectedTerm.term}</h2>
                    <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                      {selectedTerm.category}
                    </span>
                  </div>
                </div>

                <div className="prose max-w-none mb-6">
                  <p className="text-gray-700 text-lg leading-relaxed">{selectedTerm.definition}</p>
                </div>

                {selectedTerm.formula && (
                  <div className="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-500 mb-4">
                    <h3 className="font-bold mb-2">Fórmula:</h3>
                    <p className="font-mono text-lg">{selectedTerm.formula}</p>
                  </div>
                )}

                {selectedTerm.unit && (
                  <div className="mb-4">
                    <span className="text-sm text-gray-600">Unidad: </span>
                    <span className="font-mono font-semibold">{selectedTerm.unit}</span>
                  </div>
                )}

                {selectedTerm.relatedTerms && selectedTerm.relatedTerms.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="font-bold mb-3">Términos Relacionados:</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedTerm.relatedTerms.map(relatedId => {
                        const relatedTerm = allTerms.find(t => t.id === relatedId)
                        if (!relatedTerm) return null
                        return (
                          <button
                            key={relatedId}
                            onClick={() => handleRelatedTermClick(relatedId)}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 transition-colors flex items-center gap-1"
                          >
                            {relatedTerm.term}
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <BookMarked className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Selecciona un término para ver su definición</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default InteractiveDictionary

