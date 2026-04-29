import type { Aviso } from '../types';
import { useAvisosStore } from '../store/useAvisosStore';

interface Props {
  aviso: Aviso;
}

export function MaterialButton({ aviso }: Props) {
  const { setEstadoMaterial, openModal } = useAvisosStore();
  const { id, estadoMaterial } = aviso;

  if (estadoMaterial === 'no_necesario') {
    return (
      <button
        onClick={() => openModal('material', id)}
        title="Click para solicitar material"
        className="px-3 py-1 rounded-full text-xs font-medium bg-gray-400 hover:bg-blue-500 text-white transition-colors"
      >
        No necesario
      </button>
    );
  }

  if (estadoMaterial === 'solicitar') {
    return (
      <button
        onClick={() => openModal('material', id)}
        className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500 hover:bg-blue-600 text-white transition-colors animate-pulse"
      >
        Solicitar material
      </button>
    );
  }

  if (estadoMaterial === 'listado') {
    return (
      <div className="flex gap-1 flex-wrap">
        <button
          onClick={() => openModal('material', id)}
          title="Ver datos del material"
          className="px-3 py-1 rounded-full text-xs font-medium bg-orange-500 hover:bg-orange-600 text-white transition-colors"
        >
          Material listado
        </button>
        <button
          onClick={() => setEstadoMaterial(id, 'pedido_formalmente')}
          title="Marcar como pedido formalmente"
          className="px-3 py-1 rounded-full text-xs font-medium bg-gray-400 hover:bg-green-500 text-white transition-colors"
        >
          Pedir formalmente
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-1 flex-wrap">
      <button
        onClick={() => openModal('material', id)}
        title="Ver datos del material"
        className="px-3 py-1 rounded-full text-xs font-medium bg-orange-500 hover:bg-orange-600 text-white transition-colors"
      >
        Material listado
      </button>
      <button
        className="px-3 py-1 rounded-full text-xs font-medium bg-green-500 text-white cursor-default"
        disabled
      >
        Material pedido
      </button>
    </div>
  );
}
