import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  BookOpen, 
  BookMarked, 
  Database, 
  FlaskConical,
  Pill
} from 'lucide-react'

const Sidebar = () => {
  const location = useLocation()

  const menuItems = [
    { path: '/', icon: Home, label: 'Panel Principal' },
    { path: '/educacion', icon: BookOpen, label: 'Zona Educativa' },
    { path: '/diccionario', icon: BookMarked, label: 'Diccionario Interactivo' },
    { path: '/principios-activos', icon: Database, label: 'Principios Activos' },
    { path: '/caso-uso', icon: FlaskConical, label: 'Caso de Uso (Métodos)' },
  ]

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-indigo-900 text-white shadow-lg">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <Pill className="w-8 h-8" />
          <h1 className="text-2xl font-bold">PharmaKin</h1>
        </div>
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-indigo-700 text-white'
                    : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-indigo-800">
        <p className="text-xs text-indigo-300 text-center">
          Simulador de Farmacocinética
        </p>
      </div>
    </div>
  )
}

export default Sidebar

