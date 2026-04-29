import { useAvisosStore } from '../store/useAvisosStore';
import type { TabType } from '../types';

const TABS: TabType[] = ['Todos', 'Clima', 'Fontanería', 'Electricidad', 'Cerrajería', 'Obra', 'PCI', 'Varios'];

const TAB_COLORS: Record<string, string> = {
  Todos: 'bg-gray-500',
  Clima: 'bg-sky-500',
  Fontanería: 'bg-blue-600',
  Electricidad: 'bg-yellow-500',
  Cerrajería: 'bg-orange-500',
  Obra: 'bg-stone-500',
  PCI: 'bg-red-500',
  Varios: 'bg-purple-500',
};

export function TabsNavigation() {
  const { activeTab, setActiveTab, avisos, darkMode } = useAvisosStore();

  function count(tab: TabType) {
    return tab === 'Todos' ? avisos.length : avisos.filter(a => a.tipoTrabajo === tab).length;
  }

  return (
    <div className={`border-b overflow-x-auto ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="flex min-w-max px-4">
        {TABS.map(tab => {
          const isActive = activeTab === tab;
          const badgeColor = TAB_COLORS[tab] ?? 'bg-gray-500';
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                ${isActive
                  ? `border-blue-500 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`
                  : `border-transparent ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`
                }`}
            >
              {tab}
              <span className={`${badgeColor} text-white text-xs px-1.5 py-0.5 rounded-full min-w-5 text-center`}>
                {count(tab)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
