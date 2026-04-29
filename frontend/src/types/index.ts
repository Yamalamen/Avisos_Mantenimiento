export type TipoTrabajo = 'Clima' | 'Fontanería' | 'Electricidad' | 'Cerrajería' | 'Obra' | 'PCI' | 'Varios';

export type EstadoPresupuesto = 'no_procede' | 'pendiente' | 'datos_guardados' | 'lanzado_gva';
export type RevisionPresupuesto = 'pendiente_revision' | 'aceptado' | 'desestimado';
export type EstadoMaterial = 'no_necesario' | 'solicitar' | 'listado' | 'pedido_formalmente';
export type EstadoAviso = 'pendiente' | 'terminado' | 'terminado_cerrado';

export interface DatosAdjuntos {
  texto: string;
  imagenes: string[];
  audioTranscripcion: string;
}

export interface HistorialEntry {
  timestamp: string;
  campo: string;
  valorAnterior: string;
  valorNuevo: string;
}

export interface Aviso {
  id: string;
  aviso: string;
  fecha: string;
  tecnicoAsignado: string;
  tipoTrabajo: TipoTrabajo;

  estadoPresupuesto: EstadoPresupuesto;
  datosPresupuesto: DatosAdjuntos;
  presupuestoArchivo: string | null;
  revisionPresupuesto: RevisionPresupuesto;

  estadoMaterial: EstadoMaterial;
  datosMaterial: DatosAdjuntos;

  estadoAviso: EstadoAviso;

  orden: number;
  historial: HistorialEntry[];
}

export type TabType = TipoTrabajo | 'Todos';

export type ModalType = 'presupuesto' | 'material' | null;
