import { useEffect, useState } from 'react';
import { Trophy, Sparkles, RotateCcw, Users, MessageCircle, Filter } from 'lucide-react';

function WinnerDisplay({ winner, onReset }) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20}%`,
                backgroundColor: ['#5e8b4e', '#e9e4e1'][
                  Math.floor(Math.random() * 2)
                ],
                height: `${Math.random() * 10 + 5}px`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${Math.random() * 2 + 2}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Winner Card */}
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-aera-oliva">
        {/* Header */}
        <div className="aera-gradient text-white p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <Sparkles className="absolute top-4 left-4 w-8 h-8 animate-pulse" />
            <Sparkles className="absolute top-8 right-8 w-6 h-6 animate-pulse" style={{ animationDelay: '0.5s' }} />
            <Sparkles className="absolute bottom-4 left-1/4 w-7 h-7 animate-pulse" style={{ animationDelay: '1s' }} />
            <Sparkles className="absolute bottom-8 right-1/4 w-5 h-5 animate-pulse" style={{ animationDelay: '1.5s' }} />
          </div>
          <Trophy className="w-20 h-20 mx-auto mb-4 animate-bounce" />
          <h1 className="text-4xl font-bold mb-2">¡TENEMOS GANADOR!</h1>
          <p className="text-xl text-white/90">El sorteo ha finalizado exitosamente</p>
        </div>

        {/* Winner Info */}
        <div className="p-8">
          <div className="bg-gradient-to-br from-aera-arena to-aera-oliva/10 rounded-xl p-8 mb-6 border-2 border-aera-oliva/30">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-aera-oliva rounded-full mb-4 shadow-lg">
                <span className="text-4xl">👑</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                @{winner.winner.username}
              </h2>
              <p className="text-gray-600">¡Felicidades por tu victoria!</p>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-500 mb-1">Comentario ganador:</p>
              <p className="text-gray-800 italic">"{winner.winner.comment}"</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-100">
              <MessageCircle className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{winner.stats.totalComments}</div>
              <div className="text-xs text-gray-600">Comentarios</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center border border-green-100">
              <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{winner.stats.eligibleComments}</div>
              <div className="text-xs text-gray-600">Elegibles</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4 text-center border border-red-100">
              <Filter className="w-6 h-6 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-600">{winner.stats.filteredOut}</div>
              <div className="text-xs text-gray-600">Filtrados</div>
            </div>
          </div>

          {/* Participants List */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">
              Todos los participantes elegibles ({winner.eligibleParticipants.length}):
            </h3>
            <div className="max-h-40 overflow-y-auto">
              <div className="flex flex-wrap gap-2">
                {winner.eligibleParticipants.map((username, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full text-sm ${
                      username === winner.winner.username
                        ? 'bg-aera-oliva/20 text-aera-carbon font-bold border-2 border-aera-oliva'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    @{username}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                const text = `🎉 ¡Felicidades @${winner.winner.username}! 🎉\n\n¡Eres el ganador del sorteo!\n\nSorteo realizado con A-ERA Sorteos\n✅ ${winner.stats.totalComments} comentarios\n✅ ${winner.stats.eligibleComments} participantes elegibles\n✅ Sorteo 100% justo y transparente`;
                navigator.clipboard.writeText(text);
                alert('¡Mensaje copiado! Puedes pegarlo en Instagram');
              }}
              className="flex-1 px-6 py-3 bg-aera-oliva text-white rounded-lg hover:bg-aera-oliva/90 transition font-semibold"
            >
              📋 Copiar Anuncio
            </button>
            <button
              onClick={onReset}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-aera-oliva text-white rounded-lg hover:bg-aera-oliva/90 transition font-semibold"
            >
              <RotateCcw className="w-5 h-5" />
              Nuevo Sorteo
            </button>
          </div>
        </div>
      </div>

      {/* Share Section */}
      <div className="mt-6 bg-white rounded-xl p-6 shadow-lg text-center">
        <p className="text-gray-600 mb-2">
          ¿Te gustó A-ERA Sorteos? Comparte esta herramienta con otros creadores 🚀
        </p>
        <p className="text-sm text-gray-500">
          Sorteos justos, transparentes y fáciles de usar
        </p>
      </div>
    </div>
  );
}

export default WinnerDisplay;
