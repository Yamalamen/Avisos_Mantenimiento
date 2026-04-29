import { useMemo } from 'react';
import {
  useReactTable, getCoreRowModel, getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import type { SortingState, ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext, verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { useAvisosStore } from '../store/useAvisosStore';
import type { Aviso } from '../types';
import { PresupuestoButton, RevisionPresupuestoButton } from './PresupuestoButton';
import { MaterialButton } from './MaterialButton';
import { EstadoAvisoButton } from './EstadoAvisoButton';

const TIPO_COLORS: Record<string, string> = {
  Clima: 'bg-sky-100 text-sky-700',
  Fontanería: 'bg-blue-100 text-blue-700',
  Electricidad: 'bg-yellow-100 text-yellow-700',
  Cerrajería: 'bg-orange-100 text-orange-700',
  Obra: 'bg-stone-100 text-stone-700',
  PCI: 'bg-red-100 text-red-700',
  Varios: 'bg-purple-100 text-purple-700',
};

const ROW_BORDER: Record<string, string> = {
  pendiente: 'border-l-4 border-l-gray-300',
  terminado: 'border-l-4 border-l-blue-400',
  terminado_cerrado: 'border-l-4 border-l-green-500',
};

function SortableRow({ aviso, darkMode, children }: { aviso: Aviso; darkMode: boolean; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: aviso.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`${ROW_BORDER[aviso.estadoAviso]} ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'} transition-colors`}
    >
      <td className={`px-2 py-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-gray-200">
          <GripVertical className="w-4 h-4" />
        </button>
      </td>
      {children}
    </tr>
  );
}

export function AvisosTable() {
  const { avisos, searchQuery, activeTab, estadoFilter, reorderAvisos, darkMode } = useAvisosStore();
  const [sorting, setSorting] = useState<SortingState>([]);

  const filteredAvisos = useMemo(() => {
    let list = activeTab === 'Todos' ? avisos : avisos.filter(a => a.tipoTrabajo === activeTab);
    if (estadoFilter !== 'todos') list = list.filter(a => a.estadoAviso === estadoFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(a =>
        [a.aviso, a.fecha, a.tecnicoAsignado, a.tipoTrabajo, a.estadoAviso, a.estadoPresupuesto, a.estadoMaterial]
          .some(v => v.toLowerCase().includes(q))
      );
    }
    return [...list].sort((a, b) => a.orden - b.orden);
  }, [avisos, activeTab, estadoFilter, searchQuery]);

  const columns = useMemo<ColumnDef<Aviso>[]>(() => [
    {
      accessorKey: 'aviso',
      header: 'Aviso',
      cell: ({ getValue }) => (
        <span className="font-mono text-sm font-semibold">{getValue<string>()}</span>
      ),
    },
    {
      accessorKey: 'fecha',
      header: 'Fecha',
      cell: ({ getValue }) => <span className="text-sm whitespace-nowrap">{getValue<string>()}</span>,
    },
    {
      accessorKey: 'tecnicoAsignado',
      header: 'Técnico Asignado',
      cell: ({ getValue }) => <span className="text-sm">{getValue<string>()}</span>,
    },
    {
      accessorKey: 'tipoTrabajo',
      header: 'Tipo de trabajo',
      cell: ({ getValue }) => {
        const tipo = getValue<string>();
        return (
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${TIPO_COLORS[tipo] ?? 'bg-gray-100 text-gray-700'}`}>
            {tipo}
          </span>
        );
      },
    },
    {
      id: 'presupuesto',
      header: 'Presupuesto',
      cell: ({ row }) => <PresupuestoButton aviso={row.original} />,
      enableSorting: false,
    },
    {
      id: 'estadoPresupuesto',
      header: 'Estado del presupuesto',
      cell: ({ row }) => <RevisionPresupuestoButton aviso={row.original} />,
      enableSorting: false,
    },
    {
      id: 'material',
      header: 'Material',
      cell: ({ row }) => <MaterialButton aviso={row.original} />,
      enableSorting: false,
    },
    {
      id: 'estadoMaterial',
      header: 'Estado del material',
      cell: ({ row }) => {
        const { estadoMaterial } = row.original;
        const labels: Record<string, string> = {
          no_necesario: '',
          solicitar: '',
          listado: '',
          pedido_formalmente: '✓ Material pedido',
        };
        const colors: Record<string, string> = {
          pedido_formalmente: 'text-green-600 text-xs font-medium',
        };
        return labels[estadoMaterial]
          ? <span className={colors[estadoMaterial]}>{labels[estadoMaterial]}</span>
          : null;
      },
      enableSorting: false,
    },
    {
      id: 'estadoAviso',
      header: 'Estado del aviso',
      cell: ({ row }) => <EstadoAvisoButton aviso={row.original} />,
      enableSorting: false,
    },
  ], []);

  const table = useReactTable({
    data: filteredAvisos,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: row => row.id,
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorderAvisos(String(active.id), String(over.id));
    }
  }

  if (filteredAvisos.length === 0) {
    return (
      <div className={`flex-1 flex flex-col items-center justify-center p-16 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        <div className="text-5xl mb-4">📋</div>
        <p className="text-lg font-medium mb-2">No hay avisos</p>
        <p className="text-sm">
          {avisos.length === 0
            ? 'Importa un archivo Excel o CSV para comenzar'
            : 'No se encontraron avisos con los filtros actuales'}
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <table className="w-full border-collapse min-w-max">
        <thead className={`sticky top-0 z-10 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <tr>
            <th className="w-8 px-2 py-3" />
            {table.getFlatHeaders().map(header => (
              <th
                key={header.id}
                className={`px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide select-none
                  ${darkMode ? 'text-gray-400 border-b border-gray-700' : 'text-gray-500 border-b border-gray-200'}
                  ${header.column.getCanSort() ? 'cursor-pointer hover:text-blue-500' : ''}`}
                onClick={header.column.getToggleSortingHandler()}
              >
                <div className="flex items-center gap-1">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {header.column.getCanSort() && (
                    header.column.getIsSorted() === 'asc' ? <ChevronUp className="w-3 h-3" /> :
                    header.column.getIsSorted() === 'desc' ? <ChevronDown className="w-3 h-3" /> :
                    <ChevronsUpDown className="w-3 h-3 opacity-40" />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={filteredAvisos.map(a => a.id)} strategy={verticalListSortingStrategy}>
            <tbody className={`divide-y ${darkMode ? 'divide-gray-800' : 'divide-gray-100'}`}>
              {table.getRowModel().rows.map(row => (
                <SortableRow key={row.id} aviso={row.original} darkMode={darkMode}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-3 py-2 align-middle">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </SortableRow>
              ))}
            </tbody>
          </SortableContext>
        </DndContext>
      </table>
    </div>
  );
}
