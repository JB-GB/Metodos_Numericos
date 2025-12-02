import { useState } from 'react'
import { BookOpen, ArrowRight } from 'lucide-react'
import MathDisplay from '../components/MathDisplay'

const EducationalZone = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>('intro')

  const sections = [
    {
      id: 'intro',
      title: 'Introducción a la Farmacocinética',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            La <strong>farmacocinética</strong> es la rama de la farmacología que estudia los procesos 
            que experimenta un fármaco en el organismo desde su administración hasta su eliminación. 
            Estos procesos incluyen: absorción, distribución, metabolismo y eliminación (ADME).
          </p>
          <h3 className="text-xl font-bold mt-6 mb-3">Procesos ADME</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Absorción:</strong> Proceso por el cual el fármaco entra al torrente sanguíneo</li>
            <li><strong>Distribución:</strong> Movimiento del fármaco desde la sangre hacia los tejidos</li>
            <li><strong>Metabolismo:</strong> Transformación química del fármaco (principalmente en el hígado)</li>
            <li><strong>Eliminación:</strong> Remoción del fármaco del organismo (principalmente por riñones)</li>
          </ul>
        </div>
      )
    },
    {
      id: 'modelo',
      title: 'Modelo de Compartimento Único',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            El modelo de compartimento único es una simplificación que asume que el organismo 
            se comporta como un único compartimento homogéneo donde el fármaco se distribuye 
            instantáneamente.
          </p>
          <div className="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-500">
            <h4 className="font-bold mb-2">Ecuación Diferencial:</h4>
            <MathDisplay math="V \frac{dC}{dt} = u(t) - Q \cdot C(t)" />
          </div>
          <div className="space-y-2 mt-4">
            <p><strong>V:</strong> Volumen plasmático efectivo (L) - Representa el espacio de distribución del fármaco</p>
            <p><strong>Q:</strong> Tasa de eliminación metabólica (L/h) - Velocidad de eliminación del fármaco</p>
            <p><strong>u(t):</strong> Tasa de administración - Depende de la vía de administración</p>
            <p><strong>C(t):</strong> Concentración del fármaco en sangre en el tiempo t (mg/L)</p>
          </div>
        </div>
      )
    },
    {
      id: 'vias',
      title: 'Vías de Administración',
      content: (
        <div className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-bold mb-2">Vía Oral</h4>
              <p className="text-sm text-gray-700">
                El fármaco se absorbe a través del tracto gastrointestinal. 
                La absorción sigue un modelo de primer orden con constante ka.
              </p>
              <div className="text-xs mt-2 text-gray-600">
                <MathDisplay math="u(t) = k_a \cdot D \cdot e^{-k_a t}" />
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-bold mb-2">Vía Intravenosa (IV)</h4>
              <p className="text-sm text-gray-700">
                El fármaco se administra directamente al torrente sanguíneo. 
                La absorción es instantánea (bolus).
              </p>
              <div className="text-xs mt-2 text-gray-600">
                <MathDisplay math="u(t) = D \cdot \delta(t)" />
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-bold mb-2">Vía Tópica</h4>
              <p className="text-sm text-gray-700">
                El fármaco se aplica sobre la piel (pomadas, geles). 
                La absorción es más lenta que la vía oral.
              </p>
              <div className="text-xs mt-2 text-gray-600">
                <MathDisplay math="u(t) = k_{a,\text{lento}} \cdot D \cdot e^{-k_{a,\text{lento}} t}" />
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'parametros',
      title: 'Parámetros Farmacocinéticos',
      content: (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-bold mb-2">Vida Media (t₁/₂)</h4>
              <p className="text-sm text-gray-700">
                Tiempo necesario para que la concentración del fármaco se reduzca a la mitad.
              </p>
              <MathDisplay math="t_{1/2} = \frac{\ln(2)}{k} = \frac{\ln(2) \cdot V}{Q}" />
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-bold mb-2">Volumen de Distribución (V)</h4>
              <p className="text-sm text-gray-700">
                Volumen aparente en el que se distribuye el fármaco. 
                Relaciona la dosis con la concentración inicial.
              </p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-bold mb-2">Clearance (Q)</h4>
              <p className="text-sm text-gray-700">
                Volumen de plasma depurado del fármaco por unidad de tiempo. 
                Indica la eficiencia de eliminación.
              </p>
            </div>
            <div className="border-l-4 border-orange-500 pl-4">
              <h4 className="font-bold mb-2">Ventana Terapéutica</h4>
              <p className="text-sm text-gray-700">
                Rango de concentraciones entre CME (mínima efectiva) y CMT (máxima tóxica). 
                El fármaco debe mantenerse dentro de este rango para ser efectivo y seguro.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'metodos',
      title: 'Métodos Numéricos',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Para resolver la ecuación diferencial farmacocinética, utilizamos métodos numéricos 
            que aproximan la solución exacta.
          </p>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-bold mb-2">Método de Euler</h4>
              <p className="text-sm text-gray-700 mb-2">
                Método de primer orden que utiliza la derivada en el punto actual para predecir 
                el siguiente valor.
              </p>
              <div className="text-xs bg-white p-2 rounded">
                <MathDisplay math="C(t+\Delta t) = C(t) + \Delta t \cdot \frac{dC}{dt}" />
              </div>
              <p className="text-xs mt-2 text-gray-600">
                <strong>Ventaja:</strong> Simple y rápido<br/>
                <strong>Desventaja:</strong> Menor precisión, error acumulativo
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-bold mb-2">Método de Runge-Kutta 4 (RK4)</h4>
              <p className="text-sm text-gray-700 mb-2">
                Método de cuarto orden que utiliza un promedio ponderado de cuatro estimaciones 
                de la derivada para mayor precisión.
              </p>
              <div className="text-xs bg-white p-2 rounded">
                <MathDisplay math="C(t+\Delta t) = C(t) + \frac{\Delta t}{6}\left(k_1 + 2k_2 + 2k_3 + k_4\right)" />
              </div>
              <p className="text-xs mt-2 text-gray-600">
                <strong>Ventaja:</strong> Mayor precisión que Euler<br/>
                <strong>Desventaja:</strong> Más cálculos por paso
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-bold mb-2">Solución Exacta</h4>
              <p className="text-sm text-gray-700 mb-2">
                Solución analítica de la ecuación diferencial usando el método del factor integrante.
              </p>
              <div className="text-xs bg-white p-2 rounded">
                <MathDisplay math="C(t) = e^{-\frac{Q}{V}t} \left[C_0 + \int_0^t \frac{u(s)}{V} e^{\frac{Q}{V}s} ds\right]" />
              </div>
              <p className="text-xs mt-2 text-gray-600">
                <strong>Ventaja:</strong> Solución exacta (sin error numérico)<br/>
                <strong>Desventaja:</strong> Requiere integración numérica para u(t) compleja
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'aplicaciones',
      title: 'Aplicaciones en Ingeniería Biomédica',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Los modelos farmacocinéticos son fundamentales en el diseño de tratamientos médicos:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Dosificación personalizada:</strong> Ajustar dosis según características del paciente</li>
            <li><strong>Optimización de regímenes:</strong> Determinar frecuencia y cantidad óptimas</li>
            <li><strong>Prevención de toxicidad:</strong> Asegurar que las concentraciones no excedan límites tóxicos</li>
            <li><strong>Desarrollo de fármacos:</strong> Evaluar eficacia y seguridad en etapas tempranas</li>
            <li><strong>Monitoreo terapéutico:</strong> Interpretar niveles plasmáticos en pacientes</li>
          </ul>
        </div>
      )
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-8 h-8 text-indigo-600" />
          <h1 className="text-4xl font-bold text-indigo-900">Zona Educativa</h1>
        </div>
        <p className="text-gray-600 mb-8">
          Aprende sobre farmacocinética, modelos matemáticos y métodos numéricos
        </p>

        <div className="space-y-4">
          {sections.map((section) => (
            <div key={section.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <button
                onClick={() => setExpandedSection(
                  expandedSection === section.id ? null : section.id
                )}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h2 className="text-xl font-bold text-gray-800">{section.title}</h2>
                <ArrowRight
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    expandedSection === section.id ? 'rotate-90' : ''
                  }`}
                />
              </button>
              {expandedSection === section.id && (
                <div className="px-6 pb-6 border-t border-gray-200">
                  {section.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default EducationalZone

