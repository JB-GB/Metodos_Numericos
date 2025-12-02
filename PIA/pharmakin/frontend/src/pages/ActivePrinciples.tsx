import { useState, useEffect } from 'react'
import { Search, Database, Pill, DollarSign, FlaskConical } from 'lucide-react'
import axios from 'axios'

interface ActivePrinciple {
  id: number
  commercial_name: string
  formula_name: string
  description: string
  uses: string[]
  presentations: Array<{
    form: string
    doses: string[]
    route: string
  }>
  cost: {
    low: number
    high: number
    currency: string
  }
  image_url: string
  pharmacokinetic_params: {
    half_life: number
    volume: number
    clearance: number
    ka: number
    cme: number
    cmt: number
  }
}

const ActivePrinciples = () => {
  const [principles, setPrinciples] = useState<ActivePrinciple[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPrinciple, setSelectedPrinciple] = useState<ActivePrinciple | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/active-principles')
      .then(res => {
        setPrinciples(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error cargando principios activos:', err)
        setLoading(false)
      })
  }, [])

  const filteredPrinciples = principles.filter(p =>
    p.commercial_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.formula_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando principios activos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Database className="w-8 h-8 text-indigo-600" />
          <h1 className="text-4xl font-bold text-indigo-900">Principios Activos Disponibles</h1>
        </div>
        <p className="text-gray-600 mb-8">
          Base de datos de principios activos con información farmacocinética completa
        </p>

        {/* Búsqueda */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nombre comercial, fórmula o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de principios activos */}
          <div className="lg:col-span-1 space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
            {filteredPrinciples.map(principle => (
              <div
                key={principle.id}
                onClick={() => setSelectedPrinciple(principle)}
                className={`bg-white rounded-lg shadow-md p-4 cursor-pointer transition-all ${
                  selectedPrinciple?.id === principle.id
                    ? 'ring-2 ring-indigo-500 bg-indigo-50'
                    : 'hover:shadow-lg'
                }`}
              >
                <div className="flex items-start gap-3">
                  <img
                    src={principle.image_url}
                    alt={principle.commercial_name}
                    className="w-16 h-16 object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64?text=No+Image'
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800">{principle.commercial_name}</h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {principle.formula_name}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Detalles del principio activo seleccionado */}
          <div className="lg:col-span-2">
            {selectedPrinciple ? (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-start gap-6 mb-6">
                  <img
                    src={selectedPrinciple.image_url}
                    alt={selectedPrinciple.commercial_name}
                    className="w-32 h-32 object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/128?text=No+Image'
                    }}
                  />
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                      {selectedPrinciple.commercial_name}
                    </h2>
                    <p className="text-gray-600 font-mono text-sm mb-4">
                      {selectedPrinciple.formula_name}
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      {selectedPrinciple.description}
                    </p>
                  </div>
                </div>

                {/* Usos */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <Pill className="w-5 h-5" />
                    Usos Terapéuticos
                  </h3>
                  <div className="grid md:grid-cols-2 gap-2">
                    {selectedPrinciple.uses.map((use, idx) => (
                      <div key={idx} className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-700">• {use}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Presentaciones */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-3">Presentaciones Comerciales</h3>
                  <div className="space-y-3">
                    {selectedPrinciple.presentations.map((presentation, idx) => (
                      <div key={idx} className="border-l-4 border-indigo-500 pl-4">
                        <div className="font-semibold text-gray-800">{presentation.form}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          Dosis: {presentation.doses.join(', ')}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Vía: {presentation.route}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Costos */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Rango de Costos
                  </h3>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-lg">
                      <span className="font-semibold">{selectedPrinciple.cost.currency} </span>
                      <span className="text-2xl font-bold text-green-600">
                        {selectedPrinciple.cost.low}
                      </span>
                      {' - '}
                      <span className="text-2xl font-bold text-green-600">
                        {selectedPrinciple.cost.high}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Parámetros Farmacocinéticos */}
                <div>
                  <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <FlaskConical className="w-5 h-5" />
                    Parámetros Farmacocinéticos
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600">Vida Media</div>
                      <div className="text-2xl font-bold text-indigo-600">
                        {selectedPrinciple.pharmacokinetic_params.half_life} h
                      </div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600">Volumen (V)</div>
                      <div className="text-2xl font-bold text-blue-600">
                        {selectedPrinciple.pharmacokinetic_params.volume} L
                      </div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600">Clearance (Q)</div>
                      <div className="text-2xl font-bold text-purple-600">
                        {selectedPrinciple.pharmacokinetic_params.clearance} L/h
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600">Constante Absorción (ka)</div>
                      <div className="text-2xl font-bold text-green-600">
                        {selectedPrinciple.pharmacokinetic_params.ka} 1/h
                      </div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600">CME</div>
                      <div className="text-2xl font-bold text-yellow-600">
                        {selectedPrinciple.pharmacokinetic_params.cme} mg/L
                      </div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600">CMT</div>
                      <div className="text-2xl font-bold text-red-600">
                        {selectedPrinciple.pharmacokinetic_params.cmt} mg/L
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Selecciona un principio activo para ver sus detalles</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ActivePrinciples

