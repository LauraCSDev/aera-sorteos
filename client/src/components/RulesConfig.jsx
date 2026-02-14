import { useState } from 'react';
import { Settings, Play, ArrowLeft, Hash, Filter, UserX, Users } from 'lucide-react';

function RulesConfig({ rules, setRules, onRunRaffle, onBack, loading, commentsCount }) {
  const [newWord, setNewWord] = useState('');
  const [newUser, setNewUser] = useState('');

  const addRequiredWord = () => {
    if (newWord.trim() && !rules.requiredWords.includes(newWord.trim())) {
      setRules({
        ...rules,
        requiredWords: [...rules.requiredWords, newWord.trim()]
      });
      setNewWord('');
    }
  };

  const removeRequiredWord = (word) => {
    setRules({
      ...rules,
      requiredWords: rules.requiredWords.filter(w => w !== word)
    });
  };

  const addExcludedUser = () => {
    if (newUser.trim() && !rules.excludedUsers.includes(newUser.trim())) {
      setRules({
        ...rules,
        excludedUsers: [...rules.excludedUsers, newUser.trim()]
      });
      setNewUser('');
    }
  };

  const removeExcludedUser = (user) => {
    setRules({
      ...rules,
      excludedUsers: rules.excludedUsers.filter(u => u !== user)
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-aera-oliva/10 p-2 rounded-lg">
          <Settings className="w-6 h-6 text-aera-oliva" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Configuración del Sorteo</h2>
          <p className="text-sm text-gray-600">{commentsCount} comentarios cargados</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Mínimo de etiquetas */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Hash className="w-4 h-4" />
            Mínimo de Etiquetas (@)
          </label>
          <input
            type="number"
            min="0"
            value={rules.minTags}
            onChange={(e) => setRules({ ...rules, minTags: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aera-oliva focus:border-transparent"
          />
          <p className="mt-1 text-xs text-gray-500">
            Comentarios deben tener al menos esta cantidad de @menciones
          </p>
        </div>

        {/* Palabras clave requeridas */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Filter className="w-4 h-4" />
            Palabras Clave Requeridas
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequiredWord())}
              placeholder="Ej: participo, quiero ganar"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aera-oliva focus:border-transparent"
            />
            <button
              onClick={addRequiredWord}
              className="px-4 py-2 bg-aera-oliva text-white rounded-lg hover:bg-aera-oliva/90 transition"
            >
              +
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {rules.requiredWords.map(word => (
              <span
                key={word}
                className="inline-flex items-center gap-1 px-3 py-1 bg-aera-oliva/10 text-aera-oliva rounded-full text-sm"
              >
                {word}
                <button onClick={() => removeRequiredWord(word)} className="hover:text-aera-oliva/80">
                  ×
                </button>
              </span>
            ))}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Solo comentarios que contengan alguna de estas palabras
          </p>
        </div>

        {/* Usuarios excluidos */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <UserX className="w-4 h-4" />
            Usuarios Excluidos
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newUser}
              onChange={(e) => setNewUser(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addExcludedUser())}
              placeholder="@username"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aera-oliva focus:border-transparent"
            />
            <button
              onClick={addExcludedUser}
              className="px-4 py-2 bg-aera-oliva text-white rounded-lg hover:bg-aera-oliva/90 transition"
            >
              +
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {rules.excludedUsers.map(user => (
              <span
                key={user}
                className="inline-flex items-center gap-1 px-3 py-1 bg-aera-oliva/10 text-aera-oliva rounded-full text-sm"
              >
                {user}
                <button onClick={() => removeExcludedUser(user)} className="hover:text-aera-oliva/80">
                  ×
                </button>
              </span>
            ))}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Estos usuarios no podrán participar
          </p>
        </div>

        {/* Usuarios únicos */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="uniqueUsers"
            checked={rules.uniqueUsers}
            onChange={(e) => setRules({ ...rules, uniqueUsers: e.target.checked })}
            className="w-5 h-5 text-aera-oliva rounded focus:ring-aera-oliva"
          />
          <label htmlFor="uniqueUsers" className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
            <Users className="w-4 h-4" />
            Solo una entrada por usuario
          </label>
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver
        </button>
        <button
          onClick={onRunRaffle}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-aera-oliva text-white font-semibold rounded-lg hover:bg-aera-oliva/90 transition disabled:opacity-50"
        >
          <Play className="w-5 h-5" />
          {loading ? 'Sorteando...' : 'Ejecutar Sorteo'}
        </button>
      </div>
    </div>
  );
}

export default RulesConfig;
