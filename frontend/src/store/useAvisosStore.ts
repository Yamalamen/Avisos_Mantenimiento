import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Aviso, TabType, EstadoPresupuesto, RevisionPresupuesto,
  EstadoMaterial, EstadoAviso, DatosAdjuntos, TipoTrabajo
} from '../types';

function logChange(aviso: Aviso, campo: string, anterior: string, nuevo: string): Aviso {
  return {
    ...aviso,
    historial: [
      ...aviso.historial,
      { timestamp: new Date().toISOString(), campo, valorAnterior: anterior, valorNuevo: nuevo }
    ]
  };
}

const emptyDatos = (): DatosAdjuntos => ({ texto: '', imagenes: [], audioTranscripcion: '' });

interface AvisosState {
  avisos: Aviso[];
  searchQuery: string;
  activeTab: TabType;
  darkMode: boolean;
  estadoFilter: EstadoAviso | 'todos';
  modalOpen: { type: 'presupuesto' | 'material'; avisId: string } | null;

  setAvisos: (avisos: Aviso[]) => void;
  addAvisos: (avisos: Aviso[]) => void;
  updateAviso: (id: string, updates: Partial<Aviso>) => void;
  reorderAvisos: (activeId: string, overId: string) => void;
  setSearchQuery: (q: string) => void;
  setActiveTab: (tab: TabType) => void;
  toggleDarkMode: () => void;
  setEstadoFilter: (f: EstadoAviso | 'todos') => void;
  openModal: (type: 'presupuesto' | 'material', avisId: string) => void;
  closeModal: () => void;
  clearAll: () => void;

  // Presupuesto actions
  setEstadoPresupuesto: (id: string, estado: EstadoPresupuesto) => void;
  saveDatosPresupuesto: (id: string, datos: DatosAdjuntos) => void;
  savePresupuestoArchivo: (id: string, archivo: string) => void;
  setRevisionPresupuesto: (id: string, revision: RevisionPresupuesto) => void;

  // Material actions
  setEstadoMaterial: (id: string, estado: EstadoMaterial) => void;
  saveDatosMaterial: (id: string, datos: DatosAdjuntos) => void;

  // Aviso actions
  setEstadoAviso: (id: string, estado: EstadoAviso) => void;
}

export const useAvisosStore = create<AvisosState>()(
  persist(
    (set, get) => ({
      avisos: [],
      searchQuery: '',
      activeTab: 'Todos',
      darkMode: false,
      estadoFilter: 'todos',
      modalOpen: null,

      setAvisos: (avisos) => set({ avisos }),
      addAvisos: (nuevos) => {
        const existing = get().avisos;
        const maxOrden = existing.length ? Math.max(...existing.map(a => a.orden)) : -1;
        const merged = [...existing];
        nuevos.forEach((n, i) => {
          const idx = merged.findIndex(e => e.aviso === n.aviso);
          if (idx >= 0) {
            merged[idx] = { ...merged[idx], aviso: n.aviso, fecha: n.fecha, tecnicoAsignado: n.tecnicoAsignado, tipoTrabajo: n.tipoTrabajo };
          } else {
            merged.push({ ...n, orden: maxOrden + 1 + i });
          }
        });
        set({ avisos: merged });
      },
      updateAviso: (id, updates) =>
        set(s => ({ avisos: s.avisos.map(a => a.id === id ? { ...a, ...updates } : a) })),

      reorderAvisos: (activeId, overId) => {
        const { avisos } = get();
        const oldIndex = avisos.findIndex(a => a.id === activeId);
        const newIndex = avisos.findIndex(a => a.id === overId);
        if (oldIndex === -1 || newIndex === -1) return;
        const reordered = [...avisos];
        const [moved] = reordered.splice(oldIndex, 1);
        reordered.splice(newIndex, 0, moved);
        set({ avisos: reordered.map((a, i) => ({ ...a, orden: i })) });
      },

      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setActiveTab: (activeTab) => set({ activeTab }),
      toggleDarkMode: () => set(s => ({ darkMode: !s.darkMode })),
      setEstadoFilter: (estadoFilter) => set({ estadoFilter }),
      openModal: (type, avisId) => set({ modalOpen: { type, avisId } }),
      closeModal: () => set({ modalOpen: null }),
      clearAll: () => set({ avisos: [] }),

      setEstadoPresupuesto: (id, estado) =>
        set(s => ({
          avisos: s.avisos.map(a => {
            if (a.id !== id) return a;
            return logChange({ ...a, estadoPresupuesto: estado }, 'estadoPresupuesto', a.estadoPresupuesto, estado);
          })
        })),

      saveDatosPresupuesto: (id, datos) =>
        set(s => ({
          avisos: s.avisos.map(a =>
            a.id === id
              ? { ...a, datosPresupuesto: datos, estadoPresupuesto: 'datos_guardados' }
              : a
          )
        })),

      savePresupuestoArchivo: (id, archivo) =>
        set(s => ({
          avisos: s.avisos.map(a =>
            a.id === id
              ? { ...a, presupuestoArchivo: archivo, estadoPresupuesto: 'lanzado_gva' }
              : a
          )
        })),

      setRevisionPresupuesto: (id, revision) =>
        set(s => ({
          avisos: s.avisos.map(a => {
            if (a.id !== id) return a;
            return logChange({ ...a, revisionPresupuesto: revision }, 'revisionPresupuesto', a.revisionPresupuesto, revision);
          })
        })),

      setEstadoMaterial: (id, estado) =>
        set(s => ({
          avisos: s.avisos.map(a => {
            if (a.id !== id) return a;
            return logChange({ ...a, estadoMaterial: estado }, 'estadoMaterial', a.estadoMaterial, estado);
          })
        })),

      saveDatosMaterial: (id, datos) =>
        set(s => ({
          avisos: s.avisos.map(a =>
            a.id === id
              ? { ...a, datosMaterial: datos, estadoMaterial: 'listado' }
              : a
          )
        })),

      setEstadoAviso: (id, estado) =>
        set(s => ({
          avisos: s.avisos.map(a => {
            if (a.id !== id) return a;
            return logChange({ ...a, estadoAviso: estado }, 'estadoAviso', a.estadoAviso, estado);
          })
        })),
    }),
    { name: 'avisos_mantenimiento_data' }
  )
);

export function createAviso(data: Partial<Aviso> & { aviso: string; tipoTrabajo: TipoTrabajo }): Aviso {
  return {
    id: crypto.randomUUID(),
    aviso: data.aviso,
    fecha: data.fecha ?? '',
    tecnicoAsignado: data.tecnicoAsignado ?? '',
    tipoTrabajo: data.tipoTrabajo,
    estadoPresupuesto: 'no_procede',
    datosPresupuesto: emptyDatos(),
    presupuestoArchivo: null,
    revisionPresupuesto: 'pendiente_revision',
    estadoMaterial: 'no_necesario',
    datosMaterial: emptyDatos(),
    estadoAviso: 'pendiente',
    orden: data.orden ?? 0,
    historial: [],
  };
}
