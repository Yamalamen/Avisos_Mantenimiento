import type { Aviso } from '../types';
import { useAvisosStore } from '../store/useAvisosStore';

interface Props {
  aviso: Aviso;
}

export function PresupuestoButton({ aviso }: Props) {
  const { setEstadoPresupuesto, openModal, savePresupuestoArchivo } = useAvisosStore();
  const { id, estadoPresupuesto } = aviso;

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => savePresupuestoArchivo(id, ev.target!.result as string);
    reader.readAsDataURL(file);
  }

  if (estadoPresupuesto === 'no_procede') {
    return (
      <button
        onClick={() => setEstadoPresupuesto(id, 'pendiente')}
        title="Click para marcar como pendiente de presupuesto"
        className="px-3 py-1 rounded-full text-xs font-medium bg-gray-500 hover:bg-gray-600 text-white transition-colors"
      >
        No procede
      </button>
    );
  }

  if (estadoPresupuesto === 'pendiente') {
    return (
      <div className="flex gap-1 flex-wrap">
        <button
          onClick={() => setEstadoPresupuesto(id, 'no_procede')}
          title="Volver a 'No procede'"
          className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-500 hover:bg-yellow-600 text-white transition-colors"
        >
          Pendiente Presupuesto
        </button>
        <button
          onClick={() => openModal('presupuesto', id)}
          title="Añadir datos para presupuestar"
          className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-400 hover:bg-yellow-500 text-white transition-colors"
        >
          Datos para presupuestar
        </button>
      </div>
    );
  }

  if (estadoPresupuesto === 'datos_guardados') {
    return (
      <div className="flex gap-1 flex-wrap items-center">
        <button
          onClick={() => openModal('presupuesto', id)}
          title="Ver datos y subir presupuesto"
          className="px-3 py-1 rounded-full text-xs font-medium bg-orange-500 hover:bg-orange-600 text-white transition-colors"
        >
          Ver Datos Presupuesto
        </button>
        <label
          title="Subir archivo de presupuesto"
          className="px-3 py-1 rounded-full text-xs font-medium bg-orange-400 hover:bg-orange-500 text-white transition-colors cursor-pointer"
        >
          Subir Presupuesto
          <input type="file" className="hidden" onChange={handleFileUpload} />
        </label>
      </div>
    );
  }

  return (
    <button
      onClick={() => openModal('presupuesto', id)}
      title="Ver datos del presupuesto lanzado"
      className="px-3 py-1 rounded-full text-xs font-medium bg-orange-600 hover:bg-orange-700 text-white transition-colors"
    >
      Presupuesto lanzado a GVA
    </button>
  );
}

export function RevisionPresupuestoButton({ aviso }: Props) {
  const { setRevisionPresupuesto } = useAvisosStore();
  const { id, estadoPresupuesto, revisionPresupuesto } = aviso;

  if (estadoPresupuesto !== 'lanzado_gva') return null;

  if (revisionPresupuesto === 'pendiente_revision') {
    return (
      <div className="flex gap-1 flex-wrap">
        <button
          onClick={() => setRevisionPresupuesto(id, 'aceptado')}
          title="Marcar como aceptado"
          className="px-3 py-1 rounded-full text-xs font-medium bg-gray-400 hover:bg-green-500 text-white transition-colors"
        >
          Pendiente revisión
        </button>
      </div>
    );
  }

  if (revisionPresupuesto === 'aceptado') {
    return (
      <button
        onClick={() => setRevisionPresupuesto(id, 'desestimado')}
        title="Cambiar a desestimado"
        className="px-3 py-1 rounded-full text-xs font-medium bg-green-500 hover:bg-green-600 text-white transition-colors"
      >
        Aceptado
      </button>
    );
  }

  return (
    <button
      onClick={() => setRevisionPresupuesto(id, 'pendiente_revision')}
      title="Volver a pendiente de revisión"
      className="px-3 py-1 rounded-full text-xs font-medium bg-red-500 hover:bg-red-600 text-white transition-colors"
    >
      Desestimado
    </button>
  );
}
