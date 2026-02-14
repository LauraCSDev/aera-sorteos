import { useState } from "react";
import { Link2, Loader } from "lucide-react";

function PostInput({ onSubmit, loading }) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim());
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="p-8 bg-white border border-gray-100 shadow-xl rounded-2xl">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-aera-oliva">
            <Link2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="mb-2 text-3xl font-bold text-gray-800">
            Comienza tu Sorteo
          </h2>
          <p className="text-gray-600">
            Ingresa la URL del post de Instagram para cargar los comentarios
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              URL del Post de Instagram
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.instagram.com/p/ABC123..."
              className="w-full px-4 py-3 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-aera-oliva focus:border-transparent"
              disabled={loading}
            />
            <p className="mt-2 text-sm text-gray-500">
              Acepta URLs de posts y reels de Instagram
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="w-full bg-[#5e8b4e] text-white font-semibold py-4 rounded-lg hover:bg-aera-oliva/90 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Cargando comentarios...
              </>
            ) : (
              "Cargar Comentarios"
            )}
          </button>
        </form>

        <div className="pt-6 mt-8 border-t border-gray-200">
          <h3 className="mb-3 font-semibold text-gray-800">
            📋 Instrucciones:
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="font-bold text-aera-oliva">1.</span>
              <span>Copia la URL completa del post de Instagram</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-aera-oliva">2.</span>
              <span>Pégala en el campo de arriba</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-aera-oliva">3.</span>
              <span>Configura las reglas del sorteo</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-aera-oliva">4.</span>
              <span>¡Ejecuta el sorteo y conoce al ganador!</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default PostInput;
