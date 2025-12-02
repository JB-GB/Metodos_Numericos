import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import MainPanel from './pages/MainPanel'
import EducationalZone from './pages/EducationalZone'
import InteractiveDictionary from './pages/InteractiveDictionary'
import ActivePrinciples from './pages/ActivePrinciples'
import UseCase from './pages/UseCase'

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 ml-64">
          <Routes>
            <Route path="/" element={<MainPanel />} />
            <Route path="/educacion" element={<EducationalZone />} />
            <Route path="/diccionario" element={<InteractiveDictionary />} />
            <Route path="/principios-activos" element={<ActivePrinciples />} />
            <Route path="/caso-uso" element={<UseCase />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App

