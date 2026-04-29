import { Moon, Sun, Download, Trash2, Wrench } from 'lucide-react';
import { useAvisosStore } from '../store/useAvisosStore';
import { exportToJSON } from '../utils/excelParser';

interface HeaderProps {
  onImport: () => void;
}

export function Header({ onImport }: HeaderProps) {
  const { avisos, darkMode, toggleDarkMode, clearAll } = useAvisosStore();

  const pendientes = avisos.filter(a => a.estadoAviso === 'pendiente').length;
  const terminados = avisos.filter(a => a.estadoAviso === 'terminado').length;
  const cerrados = avisos.filter(a => a.estadoAviso === 'terminado_cerrado').length;

  function handleClear() {
    if (confirm('¿Eliminar todos los avisos? Esta acción no se puede deshacer.')) {
      clearAll();
    }
  }

  return (
    <header className={`sticky top-0 z-40 border-b shadow-md ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="max-w-full px-4 py-3 flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-shrink-0">
          <Wrench className="w-6 h-6 text-blue-500" />
          <h1 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Gestión de Avisos
          </h1>
        </div>

        <div className="flex gap-3 text-sm flex-wrap">
          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full font-medium">
            {pendientes} pendientes
          </span>
          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
            {terminados} terminados
          </span>
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
            {cerrados} cerrados
          </span>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={onImport}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <span>↑</span>
            Importar Excel/CSV
          </button>

          <button
            onClick={() => exportToJSON(avisos)}
            title="Exportar datos"
            className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
          >
            <Download className="w-5 h-5" />
          </button>

          <button
            onClick={handleClear}
            title="Limpiar todos los datos"
            className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>

          <button
            onClick={toggleDarkMode}
            title="Cambiar tema"
            className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700 text-yellow-400' : 'hover:bg-gray-100 text-gray-600'}`}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
}
