import type { Aviso } from '../types';
import { useAvisosStore } from '../store/useAvisosStore';

interface Props {
  aviso: Aviso;
}

export function EstadoAvisoButton({ aviso }: Props) {
  const { setEstadoAviso } = useAvisosStore();
  const { id, estadoAviso } = aviso;

  if (estadoAviso === 'pendiente') {
    return (
      <button
        onClick={() => setEstadoAviso(id, 'terminado')}
        title="Click para marcar como terminado"
        className="px-3 py-1 rounded-full text-xs font-medium bg-gray-400 hover:bg-blue-500 text-white transition-colors"
      >
        Estado aviso
      </button>
    );
  }

  if (estadoAviso === 'terminado') {
    return (
      <button
        onClick={() => setEstadoAviso(id, 'terminado_cerrado')}
        title="Click para marcar como terminado y cerrado"
        className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500 hover:bg-blue-600 text-white transition-colors"
      >
        Terminado
      </button>
    );
  }

  return (
    <button
      onClick={() => setEstadoAviso(id, 'pendiente')}
      title="Click para volver a pendiente"
      className="px-3 py-1 rounded-full text-xs font-medium bg-green-500 hover:bg-green-600 text-white transition-colors"
    >
      Terminado y cerrado
    </button>
  );
}
