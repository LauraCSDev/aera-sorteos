import { useState } from "react";
import Header from "./components/Header";
import PostInput from "./components/PostInput";
import RulesConfig from "./components/RulesConfig";
import CommentsPreview from "./components/CommentsPreview";
import WinnerDisplay from "./components/WinnerDisplay";
import HistorySection from "./components/HistorySection";
import { apiClient } from "./config";

function App() {
  const [step, setStep] = useState(1);
  const [postUrl, setPostUrl] = useState("");
  const [comments, setComments] = useState([]);
  const [rules, setRules] = useState({
    minTags: 0,
    requiredWords: [],
    excludedUsers: [],
    uniqueUsers: true,
  });
  const [winner, setWinner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFetchComments = async (url) => {
    setLoading(true);
    setError("");

    try {
      const response = await apiClient.post("/api/fetch-comments", {
        postUrl: url,
      });

      if (response.success) {
        setComments(response.comments);
        setPostUrl(url);
        setStep(2);
      }
    } catch (err) {
      setError(err.message || "Error al obtener comentarios");
    } finally {
      setLoading(false);
    }
  };

  const handleRunRaffle = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await apiClient.post("/api/run-raffle", {
        postUrl,
        comments,
        rules,
      });

      if (response.success) {
        setWinner(response);
        setStep(3);
      }
    } catch (err) {
      setError(err.message || "Error al ejecutar el sorteo");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setPostUrl("");
    setComments([]);
    setWinner(null);
    setError("");
    setRules({
      minTags: 0,
      requiredWords: [],
      excludedUsers: [],
      uniqueUsers: true,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-aera-arena via-white to-aera-oliva/10">
      <Header />

      <main className="container px-4 py-8 mx-auto max-w-7xl">
        {error && (
          <div className="flex items-center gap-2 px-4 py-3 mb-6 text-red-700 border border-red-200 rounded-lg bg-red-50">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Paso 1: Ingresar URL del post */}
        {step === 1 && (
          <PostInput onSubmit={handleFetchComments} loading={loading} />
        )}

        {/* Paso 2: Configurar reglas y ver comentarios */}
        {step === 2 && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <RulesConfig
              rules={rules}
              setRules={setRules}
              onRunRaffle={handleRunRaffle}
              onBack={() => setStep(1)}
              loading={loading}
              commentsCount={comments.length}
            />
            <CommentsPreview comments={comments} rules={rules} />
          </div>
        )}

        {/* Paso 3: Mostrar ganador */}
        {step === 3 && winner && (
          <WinnerDisplay winner={winner} onReset={handleReset} />
        )}

        {/* Historial de sorteos */}
        {step === 1 && <HistorySection />}
      </main>

      <footer className="mt-12 bg-white border-t border-gray-200">
        <div className="container px-4 py-6 mx-auto text-center text-gray-600">
          <p>A-ERA Sorteos © 2026 - Sistema de sorteos para Instagram</p>
          <p className="mt-2 text-sm">
            Desarrollado con ❤️ para hacer sorteos justos y transparentes
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
