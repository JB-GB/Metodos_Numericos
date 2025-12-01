import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, Area, ComposedChart } from 'recharts';
import { Play, Pause, RotateCcw, Download } from 'lucide-react';

const PharmaKinSimulator = () => {
  // Medicamentos predefinidos
  type MedicationKey = 'paracetamol' | 'ibuprofeno' | 'amoxicilina' | 'cafeina';

  type Medication = {
    name: string;
    halfLife: number;
    volume: number;
    ka: number;
    cme: number;
    cmt: number;
    defaultDose: number;
  };

  const medications: Record<MedicationKey, Medication> = {
    paracetamol: {
      name: 'Paracetamol',
      halfLife: 2.5,
      volume: 50,
      ka: 1.2,
      cme: 10,
      cmt: 200,
      defaultDose: 650
    },
    ibuprofeno: {
      name: 'Ibuprofeno',
      halfLife: 2.0,
      volume: 12,
      ka: 1.5,
      cme: 15,
      cmt: 200,
      defaultDose: 400
    },
    amoxicilina: {
      name: 'Amoxicilina',
      halfLife: 1.2,
      volume: 25,
      ka: 1.8,
      cme: 4,
      cmt: 100,
      defaultDose: 500
    },
    cafeina: {
      name: 'Cafeína',
      halfLife: 5.0,
      volume: 40,
      ka: 2.0,
      cme: 5,
      cmt: 80,
      defaultDose: 100
    }
  };

  const [selectedMed, setSelectedMed] = useState<MedicationKey>('paracetamol');
  const [dose, setDose] = useState(650);
  const [interval, setInterval] = useState(6);
  const [numDoses, setNumDoses] = useState(4);
  const [route, setRoute] = useState('oral');
  const [simulationData, setSimulationData] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [metrics, setMetrics] = useState({});

  const med = medications[selectedMed];

  // Calcular constante de eliminación desde vida media
  const k = 0.693 / med.halfLife;

  // Función para calcular concentración (modelo simplificado)
  const calculateConcentration = (t, doses) => {
    let concentration = 0;
    
    doses.forEach(doseTime => {
      if (t >= doseTime) {
        const timeSinceDose = t - doseTime;
        
        if (route === 'oral') {
          // Modelo con absorción
          const a = (dose / med.volume) * med.ka / (med.ka - k);
          concentration += a * (Math.exp(-k * timeSinceDose) - Math.exp(-med.ka * timeSinceDose));
        } else {
          // IV - entrada instantánea
          concentration += (dose / med.volume) * Math.exp(-k * timeSinceDose);
        }
      }
    });
    
    return concentration;
  };

  // Simular
  const runSimulation = () => {
    const doseTimes = [];
    for (let i = 0; i < numDoses; i++) {
      doseTimes.push(i * interval);
    }

    const totalTime = numDoses * interval + 12; // 12 horas extra
    const dataPoints = [];
    let maxConc = 0;
    let tmax = 0;
    let timeInRange = 0;

    for (let t = 0; t <= totalTime; t += 0.1) {
      const conc = calculateConcentration(t, doseTimes);
      dataPoints.push({
        time: parseFloat(t.toFixed(1)),
        concentration: parseFloat(conc.toFixed(2)),
        cme: med.cme,
        cmt: med.cmt
      });

      if (conc > maxConc) {
        maxConc = conc;
        tmax = t;
      }

      if (conc >= med.cme && conc <= med.cmt) {
        timeInRange += 0.1;
      }
    }

    const percentInRange = (timeInRange / totalTime * 100).toFixed(1);

    setSimulationData(dataPoints);
    setMetrics({
      cmax: maxConc.toFixed(2),
      tmax: tmax.toFixed(1),
      halfLife: med.halfLife,
      percentInRange: percentInRange
    });
  };

  useEffect(() => {
    runSimulation();
  }, [selectedMed, dose, interval, numDoses, route]);

  // Animación
  useEffect(() => {
    let animationFrame;
    if (isPlaying && currentTime < simulationData.length - 1) {
      animationFrame = setTimeout(() => {
        setCurrentTime(prev => prev + 1);
      }, 50);
    } else if (currentTime >= simulationData.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(animationFrame);
  }, [isPlaying, currentTime, simulationData.length]);

  const getCurrentStatus = () => {
    if (!simulationData[currentTime]) return { text: 'Calculando...', color: 'text-gray-500' };
    const conc = simulationData[currentTime].concentration;
    if (conc < med.cme) return { text: 'SUBTERAPÉUTICO', color: 'text-yellow-600' };
    if (conc > med.cmt) return { text: '⚠️ ZONA TÓXICA', color: 'text-red-600' };
    return { text: '✅ RANGO TERAPÉUTICO', color: 'text-green-600' };
  };

  const status = getCurrentStatus();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-indigo-900 mb-2">PharmaKin Simulator</h1>
        <p className="text-gray-600 mb-6">Simulador Interactivo de Farmacocinética</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel de Configuración */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">⚙️ Configuración</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medicamento
                  </label>
                  <select 
                    value={selectedMed}
                    onChange={(e) => {
                      setSelectedMed(e.target.value);
                      setDose(medications[e.target.value].defaultDose);
                    }}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    {Object.keys(medications).map(key => (
                      <option key={key} value={key}>{medications[key].name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dosis por toma (mg): {dose}
                  </label>
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
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input 
                        type="radio"
                        value="oral"
                        checked={route === 'oral'}
                        onChange={(e) => setRoute(e.target.value)}
                        className="mr-2"
                      />
                      Oral
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="radio"
                        value="iv"
                        checked={route === 'iv'}
                        onChange={(e) => setRoute(e.target.value)}
                        className="mr-2"
                      />
                      IV
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">🎯 Ventana Terapéutica</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>CME (Mínima):</span>
                  <span className="font-bold text-green-600">{med.cme} mg/L</span>
                </div>
                <div className="flex justify-between">
                  <span>CMT (Máxima):</span>
                  <span className="font-bold text-red-600">{med.cmt} mg/L</span>
                </div>
              </div>
            </div>
          </div>

          {/* Panel de Visualización */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">📊 Concentración vs Tiempo</h2>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setIsPlaying(!isPlaying);
                    }}
                    className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                  <button 
                    onClick={() => {
                      setCurrentTime(0);
                      setIsPlaying(false);
                    }}
                    className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    <RotateCcw size={20} />
                  </button>
                </div>
              </div>

              <ComposedChart width={700} height={400} data={simulationData.slice(0, currentTime || simulationData.length)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="time" 
                  label={{ value: 'Tiempo (horas)', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  label={{ value: 'Concentración (mg/L)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip />
                <Legend />
                
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
                
                <ReferenceLine y={med.cme} stroke="#4CAF50" strokeDasharray="3 3" label="CME" />
                <ReferenceLine y={med.cmt} stroke="#f44336" strokeDasharray="3 3" label="CMT" />
                
                <Line 
                  type="monotone" 
                  dataKey="concentration" 
                  stroke="#2196F3" 
                  strokeWidth={3}
                  dot={false}
                  name="Concentración"
                />
              </ComposedChart>
            </div>

            {/* Estado Actual */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">📍 Estado Actual</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm text-gray-600">Tiempo</div>
                  <div className="text-xl font-bold text-blue-600">
                    {simulationData[currentTime]?.time.toFixed(1) || 0} h
                  </div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-sm text-gray-600">Concentración</div>
                  <div className="text-xl font-bold text-purple-600">
                    {simulationData[currentTime]?.concentration.toFixed(1) || 0} mg/L
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

            {/* Métricas */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">📈 Métricas Clave</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 border-l-4 border-indigo-500">
                  <div className="text-xs text-gray-600">Cmax</div>
                  <div className="text-lg font-bold">{metrics.cmax} mg/L</div>
                </div>
                <div className="p-3 border-l-4 border-green-500">
                  <div className="text-xs text-gray-600">Tmax</div>
                  <div className="text-lg font-bold">{metrics.tmax} h</div>
                </div>
                <div className="p-3 border-l-4 border-purple-500">
                  <div className="text-xs text-gray-600">Vida Media</div>
                  <div className="text-lg font-bold">{metrics.halfLife} h</div>
                </div>
                <div className="p-3 border-l-4 border-blue-500">
                  <div className="text-xs text-gray-600">Tiempo en rango</div>
                  <div className="text-lg font-bold">{metrics.percentInRange}%</div>
                </div>
              </div>
            </div>

            {/* Recomendaciones */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-lg p-6 border-l-4 border-indigo-500">
              <h3 className="text-lg font-bold text-gray-800 mb-3">💡 Recomendaciones</h3>
              <div className="space-y-2 text-sm">
                {parseFloat(metrics.percentInRange) >= 80 ? (
                  <div className="flex items-start gap-2">
                    <span className="text-green-600">✅</span>
                    <span>El régimen de dosificación mantiene concentraciones terapéuticas durante el {metrics.percentInRange}% del tiempo.</span>
                  </div>
                ) : (
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-600">⚠️</span>
                    <span>El régimen solo mantiene concentraciones terapéuticas durante el {metrics.percentInRange}% del tiempo. Considere ajustar el intervalo o la dosis.</span>
                  </div>
                )}
                
                {parseFloat(metrics.cmax) > med.cmt && (
                  <div className="flex items-start gap-2">
                    <span className="text-red-600">🚨</span>
                    <span>La concentración máxima ({metrics.cmax} mg/L) supera el límite tóxico. Reduzca la dosis o aumente el intervalo.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmaKinSimulator;