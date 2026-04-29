import { useState } from 'react';
import { useAvisosStore } from './store/useAvisosStore';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { TabsNavigation } from './components/TabsNavigation';
import { AvisosTable } from './components/AvisosTable';
import { DataEntryModal } from './components/DataEntryModal';
import { ImportModal } from './components/ImportModal';

export default function App() {
  const { darkMode, modalOpen } = useAvisosStore();
  const [showImport, setShowImport] = useState(false);

  return (
    <div className={`h-full flex flex-col ${darkMode ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Header onImport={() => setShowImport(true)} />
      <SearchBar />
      <TabsNavigation />
      <AvisosTable />

      {modalOpen && <DataEntryModal />}
      {showImport && <ImportModal onClose={() => setShowImport(false)} />}
    </div>
  );
}
