import { useEffect, useState } from 'react';
import { History, Trophy, Calendar, Users } from 'lucide-react';
import axios from 'axios';

function HistorySection() {
  const [raffles, setRaffles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRaffles();
  }, []);

  const fetchRaffles = async () => {
    try {
      const response = await axios.get('/api/raffles');
      if (response.data.success) {
        setRaffles(response.data.raffles);
      }
    } catch (error) {
      console.error('Error fetching raffles:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mt-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aera-oliva mx-auto"></div>
      </div>
    );
  }

  if (raffles.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-aera-arena p-2 rounded-lg">
            <History className="w-6 h-6 text-aera-oliva" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Historial de Sorteos</h2>
            <p className="text-sm text-gray-600">Últimos sorteos realizados</p>
          </div>
        </div>

        <div className="space-y-4">
          {raffles.slice(0, 10).map((raffle) => (
            <div
              key={raffle.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-5 h-5 text-aera-oliva" />
                    <span className="font-semibold text-gray-800">
                      @{raffle.winner}
                    </span>
                    <span className="text-xs bg-aera-oliva/10 text-aera-oliva px-2 py-0.5 rounded-full">
                      Ganador
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {raffle.winner_comment}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {raffle.eligible_comments}/{raffle.total_comments} elegibles
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(raffle.created_at).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {raffles.length > 10 && (
          <div className="mt-4 text-center text-sm text-gray-500">
            Mostrando los 10 sorteos más recientes de {raffles.length} totales
          </div>
        )}
      </div>
    </div>
  );
}

export default HistorySection;
