import { useState, useRef, useEffect } from 'react';
import { X, Mic, MicOff, Paperclip, Save, ImageIcon } from 'lucide-react';
import { useAvisosStore } from '../store/useAvisosStore';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import type { DatosAdjuntos } from '../types';

export function DataEntryModal() {
  const { modalOpen, avisos, closeModal, saveDatosPresupuesto, saveDatosMaterial, darkMode } = useAvisosStore();
  const { isListening, start, stop, supported } = useSpeechRecognition();

  const aviso = modalOpen ? avisos.find(a => a.id === modalOpen.avisId) : null;
  const isPresupuesto = modalOpen?.type === 'presupuesto';

  const existingData = aviso
    ? (isPresupuesto ? aviso.datosPresupuesto : aviso.datosMaterial)
    : null;

  const [texto, setTexto] = useState('');
  const [imagenes, setImagenes] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (existingData) {
      setTexto(existingData.texto);
      setImagenes(existingData.imagenes);
    } else {
      setTexto('');
      setImagenes([]);
    }
  }, [modalOpen]);

  if (!modalOpen || !aviso) return null;
  const currentAviso = aviso;

  function handleAudio() {
    if (isListening) {
      stop();
    } else {
      start((transcript) => {
        setTexto(prev => prev + (prev ? ' ' : '') + transcript);
      });
    }
  }

  function handleImages(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => {
        setImagenes(prev => [...prev, ev.target!.result as string]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  }

  function removeImage(idx: number) {
    setImagenes(prev => prev.filter((_, i) => i !== idx));
  }

  function handleSave() {
    const datos: DatosAdjuntos = { texto, imagenes, audioTranscripcion: '' };
    if (isPresupuesto) {
      saveDatosPresupuesto(currentAviso.id, datos);
    } else {
      saveDatosMaterial(currentAviso.id, datos);
    }
    closeModal();
  }

  const title = isPresupuesto ? 'Datos para presupuestar' : 'Solicitar material';
  const isReadOnly = isPresupuesto
    ? currentAviso.estadoPresupuesto === 'lanzado_gva'
    : currentAviso.estadoMaterial === 'pedido_formalmente';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={`w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-5 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div>
            <h2 className="text-lg font-bold">{title}</h2>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Aviso: {currentAviso.aviso}
            </p>
          </div>
          <button
            onClick={closeModal}
            className={`p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
          {/* Text area */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Descripción / Notas</label>
              {supported && !isReadOnly && (
                <button
                  onClick={handleAudio}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                    ${isListening
                      ? 'bg-red-500 text-white animate-pulse'
                      : darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  {isListening ? 'Detener grabación' : 'Grabar audio'}
                </button>
              )}
            </div>
            <textarea
              value={texto}
              onChange={e => setTexto(e.target.value)}
              readOnly={isReadOnly}
              placeholder={isReadOnly ? 'Sin datos' : 'Describe los detalles del presupuesto o material necesario...'}
              rows={6}
              className={`w-full px-4 py-3 rounded-xl border text-sm resize-none outline-none focus:ring-2 focus:ring-blue-500 transition-all
                ${darkMode
                  ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-500'
                  : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'}
                ${isReadOnly ? 'opacity-70 cursor-not-allowed' : ''}`}
            />
          </div>

          {/* Image upload */}
          {!isReadOnly && (
            <div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed text-sm font-medium transition-colors w-full justify-center
                  ${darkMode
                    ? 'border-gray-600 text-gray-400 hover:border-blue-500 hover:text-blue-400'
                    : 'border-gray-300 text-gray-500 hover:border-blue-500 hover:text-blue-600'}`}
              >
                <Paperclip className="w-4 h-4" />
                Adjuntar imágenes
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImages}
              />
            </div>
          )}

          {/* Image previews */}
          {imagenes.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2 flex items-center gap-1">
                <ImageIcon className="w-4 h-4" />
                Imágenes adjuntas ({imagenes.length})
              </p>
              <div className="grid grid-cols-3 gap-2">
                {imagenes.map((img, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={img}
                      alt={`Imagen ${i + 1}`}
                      className="w-full h-24 object-cover rounded-lg border"
                    />
                    {!isReadOnly && (
                      <button
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`flex justify-end gap-3 p-5 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <button
            onClick={closeModal}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
          >
            {isReadOnly ? 'Cerrar' : 'Cancelar'}
          </button>
          {!isReadOnly && (
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium bg-green-600 hover:bg-green-700 text-white transition-colors"
            >
              <Save className="w-4 h-4" />
              Guardar datos
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
