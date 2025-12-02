import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Brush,
  ReferenceLine,
  ComposedChart,
  Area
} from 'recharts'
import { Play, Pause, RotateCcw, Info } from 'lucide-react'
import MathDisplay from '../components/MathDisplay'

interface ActivePrinciple {
  id: number
  commercial_name: string
  pharmacokinetic_params: {
    half_life: number
    volume: number
    clearance: number
    ka: number
    cme: number
    cmt: number
  }
}

interface SimulationData {
  time: number[]
  exact: number[]
  euler: number[]
  runge_kutta: number[]
  errors: {
    euler: any
    runge_kutta: any
  }
}

const MainPanel = () => {
  const [activePrinciples, setActivePrinciples] = useState<ActivePrinciple[]>([])
  const [selectedPrinciple, setSelectedPrinciple] = useState<ActivePrinciple | null>(null)
  const [dose, setDose] = useState(650)
  const [interval, setInterval] = useState(6)
  const [numDoses, setNumDoses] = useState(4)
  const [route, setRoute] = useState<'oral' | 'iv' | 'topical'>('oral')
  const [simulationData, setSimulationData] = useState<SimulationData | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [showMethod, setShowMethod] = useState<'exact' | 'euler' | 'runge_kutta' | 'all'>('all')
  const [timeStep, setTimeStep] = useState(0.1)
  const [zoomMin, setZoomMin] = useState(0)
  const [zoomMax, setZoomMax] = useState(200)
  // Patient customization
  const [patientWeight, setPatientWeight] = useState(70) // kg
  const [patientAge, setPatientAge] = useState(35)
  const [dosePerKg, setDosePerKg] = useState(false)
  const [visibleEffectiveV, setVisibleEffectiveV] = useState<number | null>(null)
  const [visibleEffectiveQ, setVisibleEffectiveQ] = useState<number | null>(null)

  // Selection / zoom helpers
  const chartContainerRef = useRef<HTMLDivElement | null>(null)
  const [selectionRect, setSelectionRect] = useState<null | { x1: number; y1: number; x2: number; y2: number }>(null)
  const [selectStart, setSelectStart] = useState<null | { time: number; chartY: number }>(null)
  const [xDomain, setXDomain] = useState<[number | undefined, number | undefined]>([undefined, undefined])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Cargar principios activos
  useEffect(() => {
    axios.get('/api/active-principles')
      .then(res => {
        setActivePrinciples(res.data)
        if (res.data.length > 0) {
          setSelectedPrinciple(res.data[0])
          setDose(res.data[0].pharmacokinetic_params.cme * 10)
        }
      })
      .catch(err => console.error('Error cargando principios activos:', err))
  }, [])

  // Ejecutar simulación cuando cambian los parámetros
  useEffect(() => {
    if (selectedPrinciple) {
      runSimulation()
    }
  }, [selectedPrinciple, dose, interval, numDoses, route, timeStep, patientWeight, patientAge, dosePerKg])

  useEffect(() => {
    if (selectedPrinciple) {
      const defaultMax = selectedPrinciple.pharmacokinetic_params.cmt * 1.2
      setZoomMax(defaultMax)
      setZoomMin(0)
    }
  }, [selectedPrinciple])

  const runSimulation = async () => {
    if (!selectedPrinciple) {
      setError('Por favor selecciona un principio activo')
      return
    }

    setLoading(true)
    setError(null)
    const params = selectedPrinciple.pharmacokinetic_params
    const t_max = numDoses * interval + 12

    try {
      // compute effective V (scale with weight) and effective Q (age-related reduction)
      const baseV = params.volume
      const baseQ = params.clearance
      const weightScale = patientWeight / 70
      const effectiveV = Number((baseV * weightScale).toFixed(3))
      const ageOver = Math.max(0, patientAge - 30)
      const reduction = Math.min(0.4, 0.004 * ageOver) // clamp to 40% max
      const effectiveQ = Number((baseQ * (1 - reduction)).toFixed(3))

      const response = await axios.post('/api/simulate', {
        t_max,
        dt: timeStep,
        V: effectiveV,
        Q: effectiveQ,
        dose: dosePerKg ? Math.round(dose * patientWeight) : dose,
        route,
        ka: params.ka,
        num_doses: numDoses,
        interval
      })

      if (response.data && response.data.time && response.data.time.length > 0) {
        setSimulationData(response.data)
        setCurrentTime(0)
        setError(null)
        setVisibleEffectiveV(effectiveV)
        setVisibleEffectiveQ(effectiveQ)
      } else {
        setError('La simulación no devolvió datos válidos')
      }
    } catch (error: any) {
      console.error('Error en simulación:', error)
      setError(error.response?.data?.error || 'Error al ejecutar la simulación. Verifica que el backend esté corriendo.')
    } finally {
      setLoading(false)
    }
  }

  // Animación
  useEffect(() => {
    let animationFrame: NodeJS.Timeout
    if (isPlaying && simulationData && currentTime < simulationData.time.length - 1) {
      animationFrame = setTimeout(() => {
        setCurrentTime(prev => prev + 1)
      }, 50)
    } else if (simulationData && currentTime >= simulationData.time.length - 1) {
      setIsPlaying(false)
    }
    return () => clearTimeout(animationFrame)
  }, [isPlaying, currentTime, simulationData])

  const getCurrentStatus = () => {
    if (!simulationData || !selectedPrinciple) return { text: 'Calculando...', color: 'text-gray-500' }
    const conc = simulationData.exact[currentTime] || 0
    const params = selectedPrinciple.pharmacokinetic_params
    if (conc < params.cme) return { text: 'SUBTERAPÉUTICO', color: 'text-yellow-600' }
    if (conc > params.cmt) return { text: '⚠️ ZONA TÓXICA', color: 'text-red-600' }
    return { text: '✅ RANGO TERAPÉUTICO', color: 'text-green-600' }
  }

  const prepareChartData = () => {
    if (!simulationData) return []
    
    return simulationData.time.map((t, i) => ({
      time: t,
      exact: showMethod === 'all' || showMethod === 'exact' ? simulationData.exact[i] : null,
      euler: showMethod === 'all' || showMethod === 'euler' ? simulationData.euler[i] : null,
      runge_kutta: showMethod === 'all' || showMethod === 'runge_kutta' ? simulationData.runge_kutta[i] : null,
      cme: selectedPrinciple?.pharmacokinetic_params.cme || 0,
      cmt: selectedPrinciple?.pharmacokinetic_params.cmt || 0
    }))
  }

  const status = getCurrentStatus()
  const chartData = prepareChartData()
  const zoomCeiling = selectedPrinciple ? selectedPrinciple.pharmacokinetic_params.cmt * 1.5 : 250
  // Ensure zoom boundaries are consistent and safe
  const minGap = 0.5
  const safeZoomMin = Math.max(0, Math.min(zoomMin, zoomMax - minGap))
  const safeZoomMax = Math.max(zoomMax, safeZoomMin + minGap)

  const handleMouseDown = (e: any) => {
    if (!e || e.activeLabel === undefined) return
    setSelectStart({ time: e.activeLabel, chartY: e.chartY })
    setSelectionRect({ x1: e.chartX, y1: e.chartY, x2: e.chartX, y2: e.chartY })
  }

  const handleMouseMove = (e: any) => {
    if (!selectStart || !e) return
    setSelectionRect(prev => prev ? { ...prev, x2: e.chartX, y2: e.chartY } : null)
  }

  const handleMouseUp = (e: any) => {
    if (!selectStart || !e || e.activeLabel === undefined) {
      setSelectionRect(null)
      setSelectStart(null)
      return
    }

    const startTime = Math.min(selectStart.time as number, e.activeLabel as number)
    const endTime = Math.max(selectStart.time as number, e.activeLabel as number)

    if (!simulationData || !simulationData.time) {
      setSelectionRect(null)
      setSelectStart(null)
      return
    }

    const times = simulationData.time
    const startIdx = times.findIndex(t => t >= startTime)
    const endIdx = times.length - 1 - [...times].reverse().findIndex(t => t <= endTime)

    const idxA = Math.max(0, startIdx)
    const idxB = Math.min(simulationData.time.length - 1, endIdx === -1 ? times.length - 1 : endIdx)

    if (idxB - idxA < 0) {
      setSelectionRect(null)
      setSelectStart(null)
      return
    }

    // compute min and max across numeric series (ignore CME/CMT)
    const candidates: number[] = []
    for (let i = idxA; i <= idxB; i++) {
      const v1 = simulationData.exact[i]
      const v2 = simulationData.euler[i]
      const v3 = simulationData.runge_kutta[i]
      if (typeof v1 === 'number' && !isNaN(v1)) candidates.push(v1)
      if (typeof v2 === 'number' && !isNaN(v2)) candidates.push(v2)
      if (typeof v3 === 'number' && !isNaN(v3)) candidates.push(v3)
      if ((simulationData as any).exact_numeric && typeof (simulationData as any).exact_numeric[i] === 'number') {
        candidates.push((simulationData as any).exact_numeric[i])
      }
    }

    if (candidates.length === 0) {
      setSelectionRect(null)
      setSelectStart(null)
      return
    }

    const minVal = Math.min(...candidates)
    const maxVal = Math.max(...candidates)
    const padding = Math.max((maxVal - minVal) * 0.12, 0.5)
    const newYMin = Math.max(0, minVal - padding)
    const newYMax = maxVal + padding

    setZoomMin(newYMin)
    setZoomMax(newYMax)
    setXDomain([startTime, endTime])

    setSelectionRect(null)
    setSelectStart(null)
  }

  const handleDoubleClick = () => {
    setZoomMin(0)
    setZoomMax(selectedPrinciple ? selectedPrinciple.pharmacokinetic_params.cmt * 1.2 : 200)
    setXDomain([undefined, undefined])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-indigo-900 mb-2">Panel Principal</h1>
        <p className="text-gray-600 mb-6">Simulador Interactivo de Farmacocinética</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel de Configuración */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">⚙️ Configuración</h2>
              
                <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Principio Activo
                  </label>
                  <select 
                    value={selectedPrinciple?.id || ''}
                    onChange={(e) => {
                      const principle = activePrinciples.find(p => p.id === parseInt(e.target.value))
                      setSelectedPrinciple(principle || null)
                      if (principle) {
                        setDose(principle.pharmacokinetic_params.cme * 10)
                      }
                    }}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    {activePrinciples.map(p => (
                      <option key={p.id} value={p.id}>{p.commercial_name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Dosis por toma (mg): {dose}
                    </label>
                    <div className="relative group">
                      <Info className="w-4 h-4 text-gray-400 cursor-help" />
                      <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
                        Cantidad de fármaco administrada en cada toma. Se mide en miligramos (mg).
                      </div>
                    </div>
                  </div>
                  <input 
                    type="range"
                    min="100"
                    max="1000"
                    step="50"
                    value={dose}
                    onChange={(e) => setDose(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* Personalización del paciente */}
                <div className="mt-2 p-3 border rounded bg-gray-50">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Personalizar paciente</h4>
                  <div className="text-xs text-gray-600 space-y-2">
                    <div className="flex justify-between">
                      <span>Peso: {patientWeight} kg</span>
                      <span className="font-semibold" />
                    </div>
                    <input type="range" min={30} max={150} value={patientWeight} onChange={(e) => setPatientWeight(Number(e.target.value))} className="w-full" />

                    <div className="flex justify-between">
                      <span>Edad: {patientAge} años</span>
                      <span className="font-semibold" />
                    </div>
                    <input type="range" min={1} max={100} value={patientAge} onChange={(e) => setPatientAge(Number(e.target.value))} className="w-full" />

                    <label className="flex items-center gap-2 mt-2">
                      <input type="checkbox" checked={dosePerKg} onChange={(e) => setDosePerKg(e.target.checked)} />
                      <span className="text-xs text-gray-700">Dosis en mg/kg</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Intervalo (horas): {interval}
                  </label>
                  <input 
                    type="range"
                    min="2"
                    max="12"
                    step="1"
                    value={interval}
                    onChange={(e) => setInterval(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de dosis: {numDoses}
                  </label>
                  <input 
                    type="range"
                    min="1"
                    max="8"
                    step="1"
                    value={numDoses}
                    onChange={(e) => setNumDoses(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vía de administración
                  </label>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center">
                      <input 
                        type="radio"
                        value="oral"
                        checked={route === 'oral'}
                        onChange={(e) => setRoute(e.target.value as 'oral')}
                        className="mr-2"
                      />
                      Oral
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="radio"
                        value="iv"
                        checked={route === 'iv'}
                        onChange={(e) => setRoute(e.target.value as 'iv')}
                        className="mr-2"
                      />
                      Intravenosa (IV)
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="radio"
                        value="topical"
                        checked={route === 'topical'}
                        onChange={(e) => setRoute(e.target.value as 'topical')}
                        className="mr-2"
                      />
                      Tópica (Pomada)
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Método a mostrar
                  </label>
                  <select
                    value={showMethod}
                    onChange={(e) => setShowMethod(e.target.value as any)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="all">Todos los métodos</option>
                    <option value="exact">Solución Exacta</option>
                    <option value="euler">Método de Euler</option>
                    <option value="runge_kutta">Runge-Kutta 4</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Paso numérico (Δt): {timeStep.toFixed(2)} h
                  </label>
                  <input
                    type="range"
                    min="0.05"
                    max="0.5"
                    step="0.05"
                    value={timeStep}
                    onChange={(e) => {
                      const value = Number(e.target.value)
                      setTimeStep(value)
                    }}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Valores pequeños de Δt hacen que Euler y RK4 sigan más de cerca la solución exacta (mayor precisión).
                  </p>
                  {visibleEffectiveV !== null && visibleEffectiveQ !== null && (
                    <div className="mt-3 p-3 rounded bg-indigo-50 border border-indigo-100 text-sm text-gray-700">
                      <div className="flex justify-between">
                        <span>V (efectiva):</span>
                        <strong>{visibleEffectiveV} L</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Q (efectiva):</span>
                        <strong>{visibleEffectiveQ} L/h</strong>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Calculados desde peso/edad.</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {selectedPrinciple && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3">🎯 Ventana Terapéutica</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>CME (Mínima):</span>
                    <span className="font-bold text-green-600">
                      {selectedPrinciple.pharmacokinetic_params.cme} mg/L
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>CMT (Máxima):</span>
                    <span className="font-bold text-red-600">
                      {selectedPrinciple.pharmacokinetic_params.cmt} mg/L
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                  <h4 className="text-sm font-semibold text-gray-700">Zoom en eje Y</h4>
                  <div>
                    <label className="text-xs text-gray-500 flex justify-between">
                      <span>Mínimo: {safeZoomMin.toFixed(1)} mg/L</span>
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={zoomCeiling}
                      step="1"
                      value={safeZoomMin}
                      onChange={(e) => {
                        const value = Number(e.target.value)
                        setZoomMin(Math.min(value, zoomMax - 0.5))
                      }}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 flex justify-between">
                      <span>Máximo: {safeZoomMax.toFixed(1)} mg/L</span>
                    </label>
                    <input
                      type="range"
                      min={safeZoomMin + 0.5}
                      max={zoomCeiling}
                      step="1"
                      value={safeZoomMax}
                      onChange={(e) => {
                        const value = Number(e.target.value)
                        setZoomMax(Math.max(value, zoomMin + 0.5))
                      }}
                      className="w-full"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Usa estos controles para acercar la gráfica y observar mejor las diferencias entre métodos.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Panel de Visualización */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">📊 Concentración vs Tiempo</h2>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                  <button 
                    onClick={() => {
                      setCurrentTime(0)
                      setIsPlaying(false)
                    }}
                    className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    <RotateCcw size={20} />
                  </button>
                </div>
              </div>

              {loading && (
                <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Calculando simulación...</p>
                  </div>
                </div>
              )}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 font-semibold">Error: {error}</p>
                  <p className="text-red-600 text-sm mt-2">Verifica que el backend esté corriendo en http://localhost:5000</p>
                </div>
              )}
              {!loading && !error && simulationData && chartData.length > 0 && (
                <div ref={chartContainerRef} className="relative">
                <ComposedChart
                  width={700}
                  height={400}
                  data={chartData.slice(0, currentTime || chartData.length)}
                  onMouseDown={(e) => handleMouseDown(e)}
                  onMouseMove={(e) => handleMouseMove(e)}
                  onMouseUp={(e) => handleMouseUp(e)}
                  onDoubleClick={handleDoubleClick}
                >
                  <Brush dataKey="time" height={30} travellerWidth={10} stroke="#8884d8" />
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="time" 
                    label={{ value: 'Tiempo (horas)', position: 'insideBottom', offset: -5 }}
                    domain={[xDomain[0] ?? 'dataMin', xDomain[1] ?? 'dataMax']}
                    type="number"
                  />
                  <YAxis 
                    label={{ value: 'Concentración (mg/L)', angle: -90, position: 'insideLeft' }}
                    domain={[Math.max(0, safeZoomMin), safeZoomMax]}
                  />
                  <Tooltip />
                  <Legend verticalAlign="top" align="right" />
                  
                  {/* Zona terapéutica */}
                  <Area 
                    type="monotone" 
                    dataKey="cmt" 
                    fill="#fee"
                    stroke="none"
                    fillOpacity={0.3}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="cme" 
                    fill="#efe"
                    stroke="none"
                    fillOpacity={0.3}
                  />
                  
                  {selectedPrinciple && (
                    <>
                      <ReferenceLine 
                        y={selectedPrinciple.pharmacokinetic_params.cme} 
                        stroke="#4CAF50" 
                        strokeDasharray="3 3" 
                        label="CME" 
                      />
                      <ReferenceLine 
                        y={selectedPrinciple.pharmacokinetic_params.cmt} 
                        stroke="#f44336" 
                        strokeDasharray="3 3" 
                        label="CMT" 
                      />
                    </>
                  )}
                  
                  {(showMethod === 'all' || showMethod === 'exact') && (
                    <Line 
                      type="monotone" 
                      dataKey="exact" 
                      stroke="#2196F3" 
                      strokeWidth={3}
                      dot={false}
                      name="Solución Exacta"
                    />
                  )}
                  {(showMethod === 'all' || showMethod === 'euler') && (
                    <Line 
                      type="monotone" 
                      dataKey="euler" 
                      stroke="#FF9800" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                      name="Método de Euler"
                    />
                  )}
                  {(showMethod === 'all' || showMethod === 'runge_kutta') && (
                    <Line 
                      type="monotone" 
                      dataKey="runge_kutta" 
                      stroke="#9C27B0" 
                      strokeWidth={2}
                      strokeDasharray="3 3"
                      dot={false}
                      name="Runge-Kutta 4"
                    />
                  )}
                </ComposedChart>
                {selectionRect && (
                  <div
                    style={{
                      position: 'absolute',
                      left: Math.min(selectionRect.x1, selectionRect.x2),
                      top: Math.min(selectionRect.y1, selectionRect.y2),
                      width: Math.abs(selectionRect.x2 - selectionRect.x1),
                      height: Math.abs(selectionRect.y2 - selectionRect.y1),
                      background: 'rgba(33,150,243,0.12)',
                      border: '1px solid rgba(33,150,243,0.35)',
                      pointerEvents: 'none'
                    }}
                  />
                )}
                </div>
              )}
              {!loading && !error && (!simulationData || chartData.length === 0) && (
                <div className="flex items-center justify-center h-96">
                  <p className="text-gray-500">No hay datos para mostrar. Ajusta los parámetros y espera a que se calcule la simulación.</p>
                </div>
              )}
            </div>

            {/* Lógica detrás de la gráfica */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">🧠 Lógica detrás de la Gráfica</h3>
              <div className="text-sm text-gray-700 space-y-4">
                <div>
                  <strong>Ecuación diferencial:</strong>
                  <MathDisplay math="V \frac{dC}{dt} = u(t) - Q \cdot C(t)" />
                </div>
                <div className="space-y-2">
                  <p>
                    <strong>V:</strong> Volumen plasmático efectivo (L) - Espacio donde se distribuye el fármaco
                  </p>
                  <p>
                    <strong>Q:</strong> Tasa de eliminación metabólica (L/h) - Velocidad a la que el organismo elimina el fármaco
                  </p>
                  <p>
                    <strong>u(t):</strong> Tasa de administración - Depende de la vía:
                  </p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>IV: <MathDisplay math="u(t) = D \cdot \delta(t)" inline /></li>
                    <li>Oral: <MathDisplay math="u(t) = k_a \cdot D \cdot e^{-k_a (t-t_0)}" inline /></li>
                    <li>Tópica: Similar a oral pero con <MathDisplay math="k_a" inline /> más pequeño</li>
                  </ul>
                </div>
                <div>
                  <strong>Métodos numéricos:</strong>
                  <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
                    <li>
                      <strong>Euler:</strong> <MathDisplay math="C(t+\Delta t) = C(t) + \Delta t \cdot \frac{dC}{dt}" inline />
                    </li>
                    <li>
                      <strong>Runge-Kutta 4:</strong> <MathDisplay math="C(t+\Delta t) = C(t) + \frac{\Delta t}{6}(k_1 + 2k_2 + 2k_3 + k_4)" inline />
                    </li>
                  </ul>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg mt-4">
                  <p className="text-xs">
                    <strong>Nota sobre el código:</strong> El algoritmo implementado refleja exactamente los métodos descritos en los apuntes. 
                    Cada método numérico calcula paso a paso la concentración usando la derivada <MathDisplay math="\frac{dC}{dt} = \frac{u(t) - Q \cdot C(t)}{V}" inline /> 
                    en diferentes puntos del intervalo, siguiendo las fórmulas teóricas.
                  </p>
                </div>
              </div>
            </div>

            {/* Estado Actual */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">📍 Estado Actual</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm text-gray-600">Tiempo</div>
                  <div className="text-xl font-bold text-blue-600">
                    {simulationData?.time[currentTime]?.toFixed(1) || 0} h
                  </div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-sm text-gray-600">Concentración</div>
                  <div className="text-xl font-bold text-purple-600">
                    {simulationData?.exact[currentTime]?.toFixed(1) || 0} mg/L
                  </div>
                </div>
                <div className="col-span-2 text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Estado</div>
                  <div className={`text-lg font-bold ${status.color}`}>
                    {status.text}
                  </div>
                </div>
              </div>
            </div>

            {/* Errores de métodos numéricos */}
            {simulationData && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3">📈 Comparación de Métodos</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 border-l-4 border-orange-500">
                    <div className="text-xs text-gray-600">Error Máximo (Euler)</div>
                    <div className="text-lg font-bold">
                      {simulationData.errors.euler.max_error.toFixed(4)} mg/L
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      RMSE: {simulationData.errors.euler.rmse.toFixed(4)} mg/L
                    </div>
                  </div>
                  <div className="p-3 border-l-4 border-purple-500">
                    <div className="text-xs text-gray-600">Error Máximo (RK4)</div>
                    <div className="text-lg font-bold">
                      {simulationData.errors.runge_kutta.max_error.toFixed(4)} mg/L
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      RMSE: {simulationData.errors.runge_kutta.rmse.toFixed(4)} mg/L
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Explicación sobre concentraciones subterapéuticas */}
            {simulationData && selectedPrinciple && (
              <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3">⚠️ Nota sobre Concentraciones Subterapéuticas</h3>
                <div className="text-sm text-gray-700 space-y-2">
                  <p>
                    Si observas que el paracetamol (u otro fármaco) marca "SUBTERAPÉUTICO" con dosis orales, 
                    esto puede deberse a varios factores:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>
                      <strong>Absorción gradual:</strong> La vía oral tiene absorción lenta. El fármaco no entra 
                      instantáneamente al plasma como en IV, sino que se absorbe gradualmente según la constante kₐ.
                    </li>
                    <li>
                      <strong>Biodisponibilidad:</strong> No toda la dosis oral llega al plasma. Parte se pierde 
                      en el tracto gastrointestinal o es metabolizada antes de llegar al plasma (efecto de primer paso).
                    </li>
                    <li>
                      <strong>Parámetros del modelo:</strong> Los parámetros farmacocinéticos (V, Q, kₐ) pueden variar 
                      entre individuos. El modelo usa valores promedio.
                    </li>
                    <li>
                      <strong>Ventana terapéutica:</strong> La CME puede ser alta para algunos fármacos. Si la dosis 
                      o frecuencia no son suficientes, puede haber períodos subterapéuticos.
                    </li>
                  </ul>
                  <p className="mt-3">
                    <strong>Solución:</strong> Aumenta la dosis, reduce el intervalo entre dosis, o considera usar 
                    formulaciones de liberación prolongada. En la práctica clínica, estos modelos ayudan a optimizar 
                    el régimen de dosificación.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainPanel

