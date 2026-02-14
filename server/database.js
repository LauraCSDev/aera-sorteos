import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'raffles.db'));

/**
 * Inicializa la base de datos y crea las tablas necesarias
 */
export function initDatabase() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS raffles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_url TEXT NOT NULL,
      total_comments INTEGER NOT NULL,
      eligible_comments INTEGER NOT NULL,
      winner TEXT NOT NULL,
      winner_comment TEXT NOT NULL,
      rules TEXT,
      all_eligible TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.exec(createTableSQL);
  console.log('✅ Base de datos inicializada');
}

/**
 * Guarda un sorteo en la base de datos
 * @param {Object} raffleData - Datos del sorteo
 * @returns {number} - ID del sorteo guardado
 */
export function saveRaffle(raffleData) {
  const stmt = db.prepare(`
    INSERT INTO raffles (
      post_url, 
      total_comments, 
      eligible_comments, 
      winner, 
      winner_comment, 
      rules,
      all_eligible
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const info = stmt.run(
    raffleData.postUrl,
    raffleData.totalComments,
    raffleData.eligibleComments,
    raffleData.winner,
    raffleData.winnerComment,
    raffleData.rules,
    raffleData.allEligible
  );

  return info.lastInsertRowid;
}

/**
 * Obtiene todos los sorteos
 * @param {number} limit - Límite de resultados
 * @returns {Array} - Array de sorteos
 */
export function getRaffles(limit = 50) {
  const stmt = db.prepare(`
    SELECT 
      id,
      post_url,
      total_comments,
      eligible_comments,
      winner,
      winner_comment,
      created_at
    FROM raffles
    ORDER BY created_at DESC
    LIMIT ?
  `);

  return stmt.all(limit);
}

/**
 * Obtiene un sorteo específico por ID
 * @param {number} id - ID del sorteo
 * @returns {Object|null} - Datos del sorteo
 */
export function getRaffleById(id) {
  const stmt = db.prepare(`
    SELECT *
    FROM raffles
    WHERE id = ?
  `);

  const raffle = stmt.get(id);
  
  if (raffle) {
    // Parsear JSON
    raffle.rules = JSON.parse(raffle.rules);
    raffle.all_eligible = JSON.parse(raffle.all_eligible);
  }

  return raffle;
}

/**
 * Elimina un sorteo
 * @param {number} id - ID del sorteo
 * @returns {boolean} - True si se eliminó correctamente
 */
export function deleteRaffle(id) {
  const stmt = db.prepare('DELETE FROM raffles WHERE id = ?');
  const info = stmt.run(id);
  return info.changes > 0;
}

/**
 * Obtiene estadísticas generales
 * @returns {Object} - Estadísticas
 */
export function getStats() {
  const totalRaffles = db.prepare('SELECT COUNT(*) as count FROM raffles').get();
  const totalParticipants = db.prepare('SELECT SUM(total_comments) as total FROM raffles').get();

  return {
    totalRaffles: totalRaffles.count,
    totalParticipants: totalParticipants.total || 0
  };
}
