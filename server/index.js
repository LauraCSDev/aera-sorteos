import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { fetchInstagramComments, extractPostShortcode } from "./instagram.js";
import {
  initDatabase,
  saveRaffle,
  getRaffles,
  getRaffleById,
} from "./database.js";

// Configurar __dirname para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar .env desde la raíz del proyecto (un nivel arriba de server/)
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Inicializar base de datos
initDatabase();

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "A-ERA Sorteos API funcionando" });
});

// Obtener comentarios de un post
app.post("/api/fetch-comments", async (req, res) => {
  try {
    const { postUrl } = req.body;

    console.log("\n📨 Nueva petición:", postUrl);

    if (!postUrl) {
      return res.status(400).json({ error: "URL del post es requerida" });
    }

    const shortcode = extractPostShortcode(postUrl);
    console.log("📝 Shortcode extraído:", shortcode);
    
    if (!shortcode) {
      return res.status(400).json({ error: "URL de Instagram inválida" });
    }

    console.log("🔄 Iniciando fetch de comentarios...");
    const comments = await fetchInstagramComments(shortcode);
    console.log(`✅ Fetch completo: ${comments.length} comentarios`);

    res.json({
      success: true,
      shortcode,
      totalComments: comments.length,
      comments,
      isExample: false, // Siempre False porque ya no usamos datos de ejemplo
    });
  } catch (error) {
    console.error("❌ Error completo:", error);
    res.status(500).json({
      success: false,
      error: "Error al obtener comentarios",
      message: error.message,
    });
  }
});

// Ejecutar sorteo con reglas
app.post("/api/run-raffle", async (req, res) => {
  try {
    const { postUrl, comments, rules } = req.body;

    if (!comments || comments.length === 0) {
      return res.status(400).json({ error: "No hay comentarios para sortear" });
    }

    // Aplicar filtros según las reglas
    let eligibleComments = [...comments];

    // Filtrar por cantidad mínima de etiquetas
    if (rules.minTags && rules.minTags > 0) {
      eligibleComments = eligibleComments.filter((comment) => {
        const tags = (comment.text.match(/@\w+/g) || []).length;
        return tags >= rules.minTags;
      });
    }

    // Filtrar por palabras clave requeridas
    if (rules.requiredWords && rules.requiredWords.length > 0) {
      eligibleComments = eligibleComments.filter((comment) => {
        const text = comment.text.toLowerCase();
        return rules.requiredWords.some((word) =>
          text.includes(word.toLowerCase()),
        );
      });
    }

    // Excluir usuarios específicos
    if (rules.excludedUsers && rules.excludedUsers.length > 0) {
      const excludedLower = rules.excludedUsers.map((u) => u.toLowerCase());
      eligibleComments = eligibleComments.filter(
        (comment) => !excludedLower.includes(comment.username.toLowerCase()),
      );
    }

    // Asegurar usuarios únicos
    if (rules.uniqueUsers) {
      const seenUsers = new Set();
      eligibleComments = eligibleComments.filter((comment) => {
        if (seenUsers.has(comment.username)) {
          return false;
        }
        seenUsers.add(comment.username);
        return true;
      });
    }

    if (eligibleComments.length === 0) {
      return res.status(400).json({
        error: "No hay comentarios que cumplan las reglas del sorteo",
      });
    }

    // Seleccionar ganador aleatorio
    const winnerIndex = Math.floor(Math.random() * eligibleComments.length);
    const winner = eligibleComments[winnerIndex];

    // Guardar sorteo en la base de datos
    const raffleId = saveRaffle({
      postUrl,
      totalComments: comments.length,
      eligibleComments: eligibleComments.length,
      winner: winner.username,
      winnerComment: winner.text,
      rules: JSON.stringify(rules),
      allEligible: JSON.stringify(eligibleComments.map((c) => c.username)),
    });

    res.json({
      success: true,
      raffleId,
      winner: {
        username: winner.username,
        comment: winner.text,
        timestamp: winner.timestamp,
      },
      stats: {
        totalComments: comments.length,
        eligibleComments: eligibleComments.length,
        filteredOut: comments.length - eligibleComments.length,
      },
      eligibleParticipants: eligibleComments.map((c) => c.username),
    });
  } catch (error) {
    console.error("Error running raffle:", error);
    res.status(500).json({
      error: "Error al ejecutar el sorteo",
      message: error.message,
    });
  }
});

// Obtener historial de sorteos
app.get("/api/raffles", (req, res) => {
  try {
    const raffles = getRaffles();
    res.json({ success: true, raffles });
  } catch (error) {
    console.error("Error getting raffles:", error);
    res.status(500).json({ error: "Error al obtener historial" });
  }
});

// Obtener detalle de un sorteo específico
app.get("/api/raffle/:id", (req, res) => {
  try {
    const raffle = getRaffleById(req.params.id);
    if (!raffle) {
      return res.status(404).json({ error: "Sorteo no encontrado" });
    }
    res.json({ success: true, raffle });
  } catch (error) {
    console.error("Error getting raffle:", error);
    res.status(500).json({ error: "Error al obtener sorteo" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📊 API disponible en http://localhost:${PORT}/api`);

  const hasSessionId =
    process.env.INSTAGRAM_SESSION_ID &&
    process.env.INSTAGRAM_SESSION_ID !== "your_session_id_here" &&
    process.env.INSTAGRAM_SESSION_ID.length > 0;

  console.log("");
  if (hasSessionId) {
    console.log("✅ Instagram Session ID configurado - SOLO DATOS REALES");
    console.log("✅ Sistema anti-bloqueo activado (delays 3-6s, retry automático)");
  } else {
    console.log("❌ Instagram Session ID NO configurado");
    console.log("❌ LA APLICACIÓN NO FUNCIONARÁ SIN EL SESSION ID");
    console.log("📝 Para configurarlo, ver: INSTAGRAM_SETUP.md");
  }
  console.log("");
});
