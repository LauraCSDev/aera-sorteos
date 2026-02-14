import { MessageCircle, User, Clock } from 'lucide-react';

function CommentsPreview({ comments, rules }) {
  // Filtrar comentarios según las reglas actuales
  const getEligibleComments = () => {
    let eligible = [...comments];

    if (rules.minTags > 0) {
      eligible = eligible.filter(comment => {
        const tags = (comment.text.match(/@\w+/g) || []).length;
        return tags >= rules.minTags;
      });
    }

    if (rules.requiredWords.length > 0) {
      eligible = eligible.filter(comment => {
        const text = comment.text.toLowerCase();
        return rules.requiredWords.some(word => text.includes(word.toLowerCase()));
      });
    }

    if (rules.excludedUsers.length > 0) {
      const excludedLower = rules.excludedUsers.map(u => u.toLowerCase());
      eligible = eligible.filter(comment => 
        !excludedLower.includes(comment.username.toLowerCase())
      );
    }

    if (rules.uniqueUsers) {
      const seenUsers = new Set();
      eligible = eligible.filter(comment => {
        if (seenUsers.has(comment.username)) {
          return false;
        }
        seenUsers.add(comment.username);
        return true;
      });
    }

    return eligible;
  };

  const eligibleComments = getEligibleComments();
  const isEligible = (comment) => eligibleComments.some(c => c.id === comment.id);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-aera-oliva/10 p-2 rounded-lg">
            <MessageCircle className="w-6 h-6 text-aera-oliva" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Vista Previa</h2>
            <p className="text-sm text-gray-600">
              {eligibleComments.length} de {comments.length} elegibles
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-aera-oliva">{eligibleComments.length}</div>
          <div className="text-xs text-gray-500">Participantes</div>
        </div>
      </div>

      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
        {comments.map((comment) => {
          const eligible = isEligible(comment);
          return (
            <div
              key={comment.id}
              className={`p-4 rounded-lg border-2 transition ${
                eligible
                  ? 'bg-aera-oliva/5 border-aera-oliva/30'
                  : 'bg-gray-50 border-gray-200 opacity-50'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <User className={`w-4 h-4 ${eligible ? 'text-aera-oliva' : 'text-gray-400'}`} />
                  <span className={`font-semibold ${eligible ? 'text-aera-oliva' : 'text-gray-600'}`}>
                    @{comment.username}
                  </span>
                  {eligible && (
                    <span className="text-xs bg-aera-oliva text-white px-2 py-0.5 rounded-full">
                      ✓ Elegible
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  {new Date(comment.timestamp).toLocaleDateString()}
                </div>
              </div>
              <p className={`text-sm ${eligible ? 'text-gray-700' : 'text-gray-500'}`}>
                {comment.text}
              </p>
            </div>
          );
        })}
      </div>

      {comments.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No hay comentarios para mostrar</p>
        </div>
      )}
    </div>
  );
}

export default CommentsPreview;
