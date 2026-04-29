import { useState, useRef } from 'react';
import { Upload, X, AlertCircle, CheckCircle } from 'lucide-react';
import { useAvisosStore } from '../store/useAvisosStore';
import { parseExcelFile } from '../utils/excelParser';
import type { Aviso } from '../types';

interface Props {
  onClose: () => void;
}

type ImportMode = 'replace' | 'merge';

export function ImportModal({ onClose }: Props) {
  const { setAvisos, addAvisos, darkMode } = useAvisosStore();
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<Record<string, string>[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [parsed, setParsed] = useState<Aviso[]>([]);
  const [mode, setMode] = useState<ImportMode>('merge');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function processFile(f: File) {
    setLoading(true);
    setSuccess('');
    setErrors([]);
    try {
      const result = await parseExcelFile(f);
      setFile(f);
      setPreview(result.preview);
      setParsed(result.avisos);
      setErrors(result.errors);
    } catch (err) {
      setErrors([String(err)]);
    } finally {
      setLoading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) processFile(f);
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) processFile(f);
  }

  function handleImport() {
    if (!parsed.length) return;
    if (mode === 'replace') {
      setAvisos(parsed);
    } else {
      addAvisos(parsed);
    }
    setSuccess(`${parsed.length} avisos importados correctamente`);
    setTimeout(() => onClose(), 1500);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={`w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-5 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div>
            <h2 className="text-lg font-bold">Importar Excel / CSV</h2>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Columnas esperadas: Aviso · Fecha · Técnico · Tipo de trabajo
            </p>
          </div>
          <button onClick={onClose} className={`p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
          {/* Drop zone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors
              ${dragOver ? 'border-blue-500 bg-blue-50' : darkMode ? 'border-gray-600 hover:border-gray-400' : 'border-gray-300 hover:border-gray-400'}`}
          >
            <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400" />
            {file ? (
              <div>
                <p className="font-medium text-green-600">{file.name}</p>
                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Click para cambiar archivo
                </p>
              </div>
            ) : (
              <div>
                <p className="font-medium">Arrastra tu archivo aquí o haz click</p>
                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Formatos: .xlsx, .xls, .csv
                </p>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={handleFileInput}
          />

          {/* Errors */}
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">Advertencias ({errors.length})</p>
                <ul className="text-sm text-red-700 mt-1 list-disc pl-4">
                  {errors.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
              </div>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <p className="text-sm font-medium text-green-800">{success}</p>
            </div>
          )}

          {/* Preview */}
          {preview.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">
                Vista previa ({parsed.length} avisos encontrados — mostrando primeros 5)
              </p>
              <div className="overflow-x-auto rounded-xl border">
                <table className="w-full text-sm">
                  <thead className={`${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <tr>
                      {Object.keys(preview[0]).map(k => (
                        <th key={k} className={`px-3 py-2 text-left text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{k}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
                    {preview.map((row, i) => (
                      <tr key={i} className={darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}>
                        {Object.values(row).map((v, j) => (
                          <td key={j} className="px-3 py-2">{v}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Import mode */}
          {parsed.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Modo de importación</p>
              <div className="flex gap-3">
                {(['merge', 'replace'] as ImportMode[]).map(m => (
                  <label key={m} className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 cursor-pointer transition-colors
                    ${mode === m
                      ? 'border-blue-500 bg-blue-50'
                      : darkMode ? 'border-gray-600 hover:border-gray-400' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <input type="radio" value={m} checked={mode === m} onChange={() => setMode(m)} className="sr-only" />
                    <div>
                      <p className="text-sm font-medium">
                        {m === 'merge' ? 'Añadir a los existentes' : 'Reemplazar todos'}
                      </p>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {m === 'merge' ? 'Merge por número de aviso' : 'Borra los datos actuales'}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`flex justify-end gap-3 p-5 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <button
            onClick={onClose}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
          >
            Cancelar
          </button>
          <button
            onClick={handleImport}
            disabled={!parsed.length || loading}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Procesando...' : `Importar ${parsed.length ? `(${parsed.length})` : ''}`}
          </button>
        </div>
      </div>
    </div>
  );
}
