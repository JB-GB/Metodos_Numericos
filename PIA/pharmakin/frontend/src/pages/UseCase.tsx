import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
  BarChart,
  Bar
} from 'recharts'
import { FlaskConical, Calculator, TrendingUp, AlertCircle, ArrowRight } from 'lucide-react'
import MathDisplay from '../components/MathDisplay'

interface SimulationData {
  time: number[]
  exact: number[]
  euler: number[]
  runge_kutta: number[]
  errors: {
    euler: {
      absolute_error: number[]
      relative_error: number[]
      rmse: number
      max_error: number
      max_relative_error: number
      mean_absolute_error: number
    }
    runge_kutta: {
      absolute_error: number[]
      relative_error: number[]
      rmse: number
      max_error: number
      max_relative_error: number
      mean_absolute_error: number
    }
  }
}

const UseCase = () => {
  const [simulationData, setSimulationData] = useState<SimulationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState(0)

  // Caso de uso: Paciente con paracetamol
  const useCase = {
    title: 'Caso Clínico: Tratamiento con Paracetamol',
    description: `Un paciente de 70 kg requiere tratamiento con paracetamol para el alivio del dolor. 
    Se administrarán 4 dosis de 650 mg cada 6 horas por vía oral. 
    Necesitamos determinar si este régimen mantiene concentraciones terapéuticas y comparar 
    los métodos numéricos con la solución exacta.`,
    parameters: {
      V: 50, // L
      Q: 20, // L/h
      dose: 650, // mg
      ka: 1.2, // 1/h
      route: 'oral',
      num_doses: 4,
      interval: 6, // horas
      t_max: 30, // horas
      dt: 0.1
    }
  }

  useEffect(() => {
    // Ejecutar simulación del caso de uso
    axios.post('/api/simulate', useCase.parameters)
      .then(res => {
        setSimulationData(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error en simulación:', err)
        setLoading(false)
      })
  }, [])

  const steps = [
    {
      title: '1. Planteamiento del Problema',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            Tenemos un problema farmacocinético que se modela con la ecuación diferencial:
          </p>
          <MathDisplay math="V \frac{dC}{dt} = u(t) - Q \cdot C(t)" />
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h4 className="font-bold mb-2">Parámetros del caso:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li><strong>V</strong> = {useCase.parameters.V} L (volumen de distribución)</li>
              <li><strong>Q</strong> = {useCase.parameters.Q} L/h (clearance o tasa de eliminación)</li>
              <li><strong>Dosis</strong> = {useCase.parameters.dose} mg cada {useCase.parameters.interval} horas</li>
              <li><strong>Número de dosis</strong> = {useCase.parameters.num_doses}</li>
              <li><strong>Vía</strong> = {useCase.parameters.route}</li>
              <li><strong>kₐ</strong> = {useCase.parameters.ka} 1/h (constante de absorción)</li>
            </ul>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-bold mb-2">Objetivo:</h4>
            <p className="text-sm">
              Resolver esta ecuación usando tres métodos diferentes y comparar sus resultados:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-sm mt-2">
              <li>Solución Exacta (analítica)</li>
              <li>Método de Euler (numérico, primer orden)</li>
              <li>Método de Runge-Kutta 4 (numérico, cuarto orden)</li>
            </ol>
          </div>
        </div>
      )
    },
    {
      title: '2. Solución Exacta - Paso a Paso',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            La solución exacta se obtiene usando el <strong>método del factor integrante</strong>.
          </p>
          <div className="bg-green-50 p-4 rounded-lg space-y-3">
            <div>
              <h4 className="font-bold mb-2">Paso 1: Forma estándar</h4>
              <p className="text-sm mb-2">Reescribimos la ecuación en forma estándar:</p>
              <MathDisplay math="\frac{dC}{dt} + \frac{Q}{V} C(t) = \frac{u(t)}{V}" />
            </div>
            <div>
              <h4 className="font-bold mb-2">Paso 2: Factor integrante</h4>
              <p className="text-sm mb-2">El factor integrante es:</p>
              <MathDisplay math="\mu(t) = e^{\int \frac{Q}{V} dt} = e^{\frac{Q}{V} t}" />
            </div>
            <div>
              <h4 className="font-bold mb-2">Paso 3: Solución general</h4>
              <p className="text-sm mb-2">Multiplicamos ambos lados por el factor integrante e integramos:</p>
              <MathDisplay math="C(t) = e^{-\frac{Q}{V} t} \left[ C_0 + \int_0^t \frac{u(s)}{V} e^{\frac{Q}{V} s} ds \right]" />
            </div>
            <div>
              <h4 className="font-bold mb-2">Paso 4: Implementación en código</h4>
              <div className="bg-white p-3 rounded text-xs font-mono overflow-x-auto">
                <pre>{`# Para cada punto de tiempo t[i]:
k = Q / V  # Constante de eliminación
integral = 0.0

# Integración numérica (regla del trapecio)
for j in range(i):
    s = t[j]
    integral += (u(s) / V) * exp(k * s) * dt

# Solución exacta
C[i] = exp(-k * t[i]) * (C0 + integral)`}</pre>
              </div>
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
            <p className="text-sm">
              <strong>Nota:</strong> Esta solución es "exacta" en el sentido de que usa la fórmula analítica, 
              pero requiere integración numérica para calcular la integral cuando u(t) es compleja (como en vía oral).
            </p>
          </div>
        </div>
      )
    },
    {
      title: '3. Método de Euler - Paso a Paso',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            El método de Euler es el método numérico más simple. Aproxima la derivada usando diferencias finitas.
          </p>
          <div className="bg-orange-50 p-4 rounded-lg space-y-3">
            <div>
              <h4 className="font-bold mb-2">Paso 1: Aproximación de la derivada</h4>
              <p className="text-sm mb-2">Usamos la definición de derivada:</p>
              <MathDisplay math="\frac{dC}{dt} \approx \frac{C(t+\Delta t) - C(t)}{\Delta t}" />
            </div>
            <div>
              <h4 className="font-bold mb-2">Paso 2: Sustitución en la EDO</h4>
              <p className="text-sm mb-2">Sustituimos en la ecuación diferencial:</p>
              <MathDisplay math="\frac{C(t+\Delta t) - C(t)}{\Delta t} = \frac{u(t) - Q \cdot C(t)}{V}" />
            </div>
            <div>
              <h4 className="font-bold mb-2">Paso 3: Fórmula de Euler</h4>
              <p className="text-sm mb-2">Despejamos C(t+Δt):</p>
              <MathDisplay math="C(t+\Delta t) = C(t) + \Delta t \cdot \frac{u(t) - Q \cdot C(t)}{V}" />
            </div>
            <div>
              <h4 className="font-bold mb-2">Paso 4: Implementación en código</h4>
              <div className="bg-white p-3 rounded text-xs font-mono overflow-x-auto">
                <pre>{`# Inicialización
C[0] = C0  # Concentración inicial

# Iteración de Euler
for i in range(len(t) - 1):
    # Calcular derivada en el punto actual
    dC_dt = (u(t[i]) - Q * C[i]) / V
    
    # Aproximación de Euler
    C[i + 1] = C[i] + dt * dC_dt`}</pre>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-2">Paso 5: Interpretación del algoritmo</h4>
              <p className="text-sm">
                El algoritmo refleja exactamente la fórmula teórica: en cada paso, calculamos la pendiente 
                (derivada) en el punto actual y avanzamos una distancia Δt en esa dirección. Es como 
                seguir una línea recta tangente a la curva.
              </p>
            </div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
            <p className="text-sm">
              <strong>Limitación:</strong> Este método tiene error de truncamiento de primer orden O(Δt). 
              Para pasos grandes, puede acumular error significativo.
            </p>
          </div>
        </div>
      )
    },
    {
      title: '4. Método de Runge-Kutta 4 - Paso a Paso',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            El método RK4 mejora la precisión usando un promedio ponderado de cuatro estimaciones de la derivada.
          </p>
          <div className="bg-purple-50 p-4 rounded-lg space-y-3">
            <div>
              <h4 className="font-bold mb-2">Paso 1: Cuatro estimaciones de la pendiente</h4>
              <p className="text-sm mb-2">Calculamos la pendiente en cuatro puntos diferentes:</p>
              <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                <li><strong>k₁:</strong> Pendiente en el punto inicial (t, C(t))</li>
                <li><strong>k₂:</strong> Pendiente en el punto medio usando k₁</li>
                <li><strong>k₃:</strong> Pendiente en el punto medio usando k₂</li>
                <li><strong>k₄:</strong> Pendiente en el punto final usando k₃</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-2">Paso 2: Fórmulas de RK4</h4>
              <div className="space-y-2 text-sm">
                <MathDisplay math="k_1 = \Delta t \cdot f(t, C(t))" />
                <MathDisplay math="k_2 = \Delta t \cdot f\left(t + \frac{\Delta t}{2}, C(t) + \frac{k_1}{2}\right)" />
                <MathDisplay math="k_3 = \Delta t \cdot f\left(t + \frac{\Delta t}{2}, C(t) + \frac{k_2}{2}\right)" />
                <MathDisplay math="k_4 = \Delta t \cdot f(t + \Delta t, C(t) + k_3)" />
                <MathDisplay math="C(t+\Delta t) = C(t) + \frac{1}{6}(k_1 + 2k_2 + 2k_3 + k_4)" />
              </div>
              <p className="text-xs mt-2 text-gray-600">
                Donde <MathDisplay math="f(t, C) = \frac{u(t) - Q \cdot C}{V}" inline />
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-2">Paso 3: Implementación en código</h4>
              <div className="bg-white p-3 rounded text-xs font-mono overflow-x-auto">
                <pre>{`# Función que define la derivada
def dC_dt_func(t_val, C_val):
    return (u(t_val) - Q * C_val) / V

# Iteración de Runge-Kutta 4
for i in range(len(t) - 1):
    k1 = dt * dC_dt_func(t[i], C[i])
    k2 = dt * dC_dt_func(t[i] + dt/2, C[i] + k1/2)
    k3 = dt * dC_dt_func(t[i] + dt/2, C[i] + k2/2)
    k4 = dt * dC_dt_func(t[i] + dt, C[i] + k3)
    
    # Promedio ponderado
    C[i + 1] = C[i] + (k1 + 2*k2 + 2*k3 + k4) / 6`}</pre>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-2">Paso 4: Interpretación del algoritmo</h4>
              <p className="text-sm">
                El algoritmo refleja la teoría de RK4: en lugar de usar solo la pendiente en un punto (como Euler), 
                "exploramos" la función en cuatro puntos diferentes y promediamos sus pendientes. Esto da una mejor 
                estimación de cómo cambia la función en todo el intervalo.
              </p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <h4 className="font-bold mb-2 text-sm">¿Por qué RK4 puede estar "desfasado" al principio?</h4>
              <p className="text-xs text-gray-700">
                RK4 puede mostrar pequeñas diferencias al inicio porque:
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs mt-2 ml-4">
                <li>Usa información de puntos futuros (k₂, k₃, k₄) que pueden no estar disponibles perfectamente al inicio</li>
                <li>La condición inicial C₀ = 0 puede causar que las primeras estimaciones sean menos precisas</li>
                <li>Para funciones con cambios rápidos (como absorción oral), RK4 puede "sobreestimar" ligeramente al inicio</li>
                <li>Sin embargo, <strong>RK4 es más preciso globalmente</strong> - el error acumulado es mucho menor que Euler</li>
              </ul>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
            <p className="text-sm">
              <strong>Ventaja:</strong> Error de truncamiento de cuarto orden O(Δt⁴). Mucho más preciso que Euler, 
              especialmente para pasos más grandes.
            </p>
          </div>
        </div>
      )
    },
    {
      title: '5. Comparación de Resultados',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Ahora comparamos los tres métodos visualmente y analizamos sus errores.
          </p>
          {simulationData ? (
            <>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Gráfica Comparativa
                </h3>
                <ComposedChart width={800} height={400} data={simulationData.time.map((t, i) => ({
                  time: t,
                  exact: simulationData.exact[i],
                  euler: simulationData.euler[i],
                  runge_kutta: simulationData.runge_kutta[i]
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" label={{ value: 'Tiempo (horas)', position: 'insideBottom', offset: -5 }} />
                  <YAxis label={{ value: 'Concentración (mg/L)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="exact" stroke="#2196F3" strokeWidth={3} dot={false} name="Solución Exacta" />
                  <Line type="monotone" dataKey="euler" stroke="#FF9800" strokeWidth={2} dot={false} name="Método de Euler" />
                  <Line type="monotone" dataKey="runge_kutta" stroke="#9C27B0" strokeWidth={2} dot={false} name="Runge-Kutta 4" />
                </ComposedChart>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-bold mb-2">Análisis de las Diferencias entre Gráficas:</h4>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>
                    <strong>Solución Exacta (línea azul sólida):</strong> Es la referencia "verdadera". 
                    Usa la fórmula analítica pero requiere integración numérica para u(t) compleja.
                  </li>
                  <li>
                    <strong>Método de Euler (línea naranja punteada):</strong> Puede mostrar desviaciones 
                    más notables, especialmente en regiones de cambio rápido. El error se acumula con el tiempo.
                  </li>
                  <li>
                    <strong>Runge-Kutta 4 (línea morada punteada):</strong> Sigue muy de cerca la solución exacta. 
                    Puede haber pequeñas diferencias al inicio debido a cómo estima las pendientes, pero 
                    globalmente es mucho más preciso que Euler.
                  </li>
                  <li>
                    <strong>¿Por qué las diferencias?</strong> Los métodos numéricos aproximan la solución verdadera. 
                    Euler usa solo la pendiente actual, mientras que RK4 "explora" la función en múltiples puntos, 
                    dando una mejor aproximación.
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Análisis de Errores
                </h3>
                <BarChart width={800} height={300} data={simulationData.time.slice(0, 100).map((t, i) => ({
                  time: t,
                  'Error Euler': Math.abs(simulationData.errors.euler.absolute_error[i]),
                  'Error RK4': Math.abs(simulationData.errors.runge_kutta.absolute_error[i])
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis label={{ value: 'Error Absoluto (mg/L)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Error Euler" fill="#FF9800" />
                  <Bar dataKey="Error RK4" fill="#9C27B0" />
                </BarChart>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Métricas de Error
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold mb-3 text-orange-600">Método de Euler</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Error Máximo:</span>
                        <span className="font-bold">{simulationData.errors.euler.max_error.toFixed(6)} mg/L</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Error Relativo Máximo:</span>
                        <span className="font-bold">{simulationData.errors.euler.max_relative_error.toFixed(4)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>RMSE:</span>
                        <span className="font-bold">{simulationData.errors.euler.rmse.toFixed(6)} mg/L</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Error Medio Absoluto:</span>
                        <span className="font-bold">{simulationData.errors.euler.mean_absolute_error.toFixed(6)} mg/L</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold mb-3 text-purple-600">Runge-Kutta 4</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Error Máximo:</span>
                        <span className="font-bold">{simulationData.errors.runge_kutta.max_error.toFixed(6)} mg/L</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Error Relativo Máximo:</span>
                        <span className="font-bold">{simulationData.errors.runge_kutta.max_relative_error.toFixed(4)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>RMSE:</span>
                        <span className="font-bold">{simulationData.errors.runge_kutta.rmse.toFixed(6)} mg/L</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Error Medio Absoluto:</span>
                        <span className="font-bold">{simulationData.errors.runge_kutta.mean_absolute_error.toFixed(6)} mg/L</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-bold mb-2">Conclusión:</h4>
                  <p className="text-sm text-gray-700">
                    El método de Runge-Kutta 4 muestra significativamente menor error que el método de Euler 
                    (típicamente 100-1000 veces menor para el mismo paso de tiempo). Esto confirma que RK4 
                    es más preciso, aunque requiere más cálculos por paso. Para aplicaciones farmacocinéticas 
                    donde la precisión es importante, RK4 es la mejor opción entre los métodos numéricos simples.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
              <p className="text-sm text-gray-700">
                Aún no hay datos para mostrar. Verifica que el backend esté corriendo en{' '}
                <span className="font-mono text-xs text-indigo-700">http://localhost:5000</span> y vuelve a este paso.
              </p>
            </div>
          )}
        </div>
      )
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Calculando soluciones...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <FlaskConical className="w-8 h-8 text-indigo-600" />
          <h1 className="text-4xl font-bold text-indigo-900">Caso de Uso: Métodos Numéricos</h1>
        </div>

        {/* Descripción del caso */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-3">{useCase.title}</h2>
          <p className="text-gray-700 leading-relaxed">{useCase.description}</p>
        </div>

        {/* Navegación de pasos */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {steps.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setStep(idx)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-2 ${
                  step === idx
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {s.title}
                {step === idx && <ArrowRight className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>

        {/* Contenido del paso actual */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-2xl font-bold mb-4">{steps[step].title}</h3>
          {steps[step].content}
        </div>

        {/* Navegación */}
        <div className="flex justify-between">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className={`px-4 py-2 rounded-lg ${
              step === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            Anterior
          </button>
          <button
            onClick={() => setStep(Math.min(steps.length - 1, step + 1))}
            disabled={step === steps.length - 1}
            className={`px-4 py-2 rounded-lg ${
              step === steps.length - 1
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  )
}

export default UseCase
