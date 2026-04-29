import { Search, X } from 'lucide-react';
import { useAvisosStore } from '../store/useAvisosStore';

export function SearchBar() {
  const { searchQuery, setSearchQuery, darkMode, avisos, estadoFilter, setEstadoFilter, activeTab } = useAvisosStore();

  const tabAvisos = activeTab === 'Todos' ? avisos : avisos.filter(a => a.tipoTrabajo === activeTab);
  const filtered = tabAvisos.filter(a => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return [a.aviso, a.fecha, a.tecnicoAsignado, a.tipoTrabajo, a.estadoAviso].some(v => v.toLowerCase().includes(q));
  });

  return (
    <div className={`px-4 py-3 border-b flex items-center gap-4 flex-wrap ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="relative flex-1 min-w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por cualquier campo..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className={`w-full pl-9 pr-8 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all
            ${darkMode
              ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'}`}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Estado:</span>
        <select
          value={estadoFilter}
          onChange={e => setEstadoFilter(e.target.value as typeof estadoFilter)}
          className={`text-sm px-3 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500
            ${darkMode
              ? 'bg-gray-800 border-gray-600 text-white'
              : 'bg-white border-gray-300 text-gray-900'}`}
        >
          <option value="todos">Todos</option>
          <option value="pendiente">Pendientes</option>
          <option value="terminado">Terminados</option>
          <option value="terminado_cerrado">Cerrados</option>
        </select>
      </div>

      <span className={`text-sm ml-auto ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        {filtered.length} {filtered.length === 1 ? 'aviso' : 'avisos'}
      </span>
    </div>
  );
}
