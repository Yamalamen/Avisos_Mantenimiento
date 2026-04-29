import * as XLSX from 'xlsx';
import type { Aviso, TipoTrabajo } from '../types';
import { createAviso } from '../store/useAvisosStore';

const TIPOS_VALIDOS: TipoTrabajo[] = ['Clima', 'Fontanería', 'Electricidad', 'Cerrajería', 'Obra', 'PCI', 'Varios'];

function normalizeTipo(raw: string): TipoTrabajo {
  if (!raw) return 'Varios';
  const lower = raw.toLowerCase().trim();
  const match = TIPOS_VALIDOS.find(t => t.toLowerCase() === lower);
  return match ?? 'Varios';
}

export interface ParseResult {
  avisos: Aviso[];
  preview: Record<string, string>[];
  errors: string[];
}

export function parseExcelFile(file: File): Promise<ParseResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target!.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows: string[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

        if (rows.length < 2) {
          resolve({ avisos: [], preview: [], errors: ['El archivo no contiene datos'] });
          return;
        }

        const dataRows = rows.slice(1).filter(r => r.some(c => c !== ''));
        const errors: string[] = [];
        const avisos: Aviso[] = dataRows.map((row, i) => {
          const aviso = String(row[0] ?? '').trim();
          if (!aviso) errors.push(`Fila ${i + 2}: campo 'Aviso' vacío`);
          return createAviso({
            aviso: aviso || `AVISO_${i}`,
            fecha: String(row[1] ?? '').trim(),
            tecnicoAsignado: String(row[2] ?? '').trim(),
            tipoTrabajo: normalizeTipo(String(row[3] ?? '')),
            orden: i,
          });
        });

        const preview = dataRows.slice(0, 5).map(row => ({
          Aviso: String(row[0] ?? ''),
          Fecha: String(row[1] ?? ''),
          'Técnico': String(row[2] ?? ''),
          'Tipo': String(row[3] ?? ''),
        }));

        resolve({ avisos, preview, errors });
      } catch (err) {
        reject(new Error('Error al leer el archivo: ' + String(err)));
      }
    };
    reader.onerror = () => reject(new Error('Error al leer el archivo'));
    reader.readAsArrayBuffer(file);
  });
}

export function exportToJSON(avisos: Aviso[]) {
  const blob = new Blob([JSON.stringify(avisos, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `avisos_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
