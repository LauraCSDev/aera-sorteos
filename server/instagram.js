import axios from "axios";

/**
 * Extrae el shortcode de una URL de Instagram
 * @param {string} url - URL del post de Instagram
 * @returns {string|null} - Shortcode del post
 */
export function extractPostShortcode(url) {
  const patterns = [
    /instagram\.com\/p\/([A-Za-z0-9_-]+)/,
    /instagram\.com\/reel\/([A-Za-z0-9_-]+)/,
    /instagr\.am\/p\/([A-Za-z0-9_-]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  // Si no coincide con ningún patrón, tal vez ya es un shortcode
  if (/^[A-Za-z0-9_-]+$/.test(url)) {
    return url;
  }

  return null;
}

/**
 * Obtiene el CSRF Token desde Instagram
 * @param {string} shortcode - Shortcode del post
 * @param {string} sessionId - Session ID de Instagram
 * @returns {Promise<string>} - CSRF Token
 */
async function getCsrfToken(shortcode, sessionId) {
  try {
    const response = await axios.get(`https://www.instagram.com/p/${shortcode}/`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
        "Accept-Encoding": "gzip, deflate, br",
        Cookie: `sessionid=${sessionId}`,
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Cache-Control": "max-age=0",
      },
      maxRedirects: 0,
      validateStatus: (status) => status >= 200 && status < 400,
    });

    // Extraer csrftoken de las cookies de respuesta
    const cookies = response.headers['set-cookie'] || [];
    for (const cookie of cookies) {
      const match = cookie.match(/csrftoken=([^;]+)/);
      if (match) {
        console.log("   ✅ CSRF Token obtenido");
        return match[1];
      }
    }

    // Si no viene en set-cookie, buscar en el HTML
    const html = response.data;
    const csrfMatch = html.match(/"csrf_token":"([^"]+)"/);
    if (csrfMatch) {
      console.log("   ✅ CSRF Token extraído del HTML");
      return csrfMatch[1];
    }

    throw new Error("No se pudo obtener CSRF token");
  } catch (error) {
    console.error("   ❌ Error obteniendo CSRF token:", error.message);
    throw error;
  }
}

/**
 * Obtiene comentarios de un post de Instagram usando sessionid con paginación completa
 * @param {string} shortcode - Shortcode del post
 * @param {string} sessionId - Session ID de Instagram
 * @returns {Promise<Array>} - Array de comentarios
 */
async function fetchWithSessionId(shortcode, sessionId) {
  console.log("🔑 Intentando obtener comentarios con Session ID...");

  // Primero, obtener el CSRF token
  console.log("🔐 Obteniendo CSRF token...");
  const csrfToken = await getCsrfToken(shortcode, sessionId);

  // User agents realistas para rotar
  const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0",
  ];

  const getHeaders = () => ({
    "User-Agent": userAgents[Math.floor(Math.random() * userAgents.length)],
    Accept: "*/*",
    "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
    "Accept-Encoding": "gzip, deflate, br",
    Referer: `https://www.instagram.com/p/${shortcode}/`,
    "X-IG-App-ID": "936619743392459",
    "X-ASBD-ID": "198387",
    "X-CSRFToken": csrfToken,
    "X-Requested-With": "XMLHttpRequest",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    Cookie: `sessionid=${sessionId}; csrftoken=${csrfToken}${process.env.INSTAGRAM_DS_USER_ID ? `; ds_user_id=${process.env.INSTAGRAM_DS_USER_ID}` : ''}`,
    Connection: "keep-alive",
  });

  try {
    const commentsUrl = "https://www.instagram.com/graphql/query/";
    const allComments = [];
    let hasNextPage = true;
    let endCursor = null;
    let pageCount = 0;
    const perPage = 12; // Reducido de 50 a 12 para ser menos sospechoso
    let retryCount = 0;
    const maxRetries = 3;

    console.log("📥 Iniciando descarga de comentarios...");
    console.log("⏱️  Usando delays de 3-6 segundos entre páginas para evitar bloqueos");

    while (hasNextPage && pageCount < 100) {
      // límite de seguridad
      pageCount++;

      const variables = {
        shortcode: shortcode,
        first: perPage,
        ...(endCursor && { after: endCursor }),
      };

      try {
        const response = await axios.get(commentsUrl, {
          headers: getHeaders(),
          params: {
            query_hash: "bc3296d1ce80a24b1b6e40b1e72903f5",
            variables: JSON.stringify(variables),
          },
          timeout: 20000,
          maxRedirects: 0, // No seguir redirecciones (Instagram redirige cuando bloquea)
          validateStatus: (status) => status >= 200 && status < 400, // Aceptar 3xx también
        });

        // Debug: Ver estructura de respuesta
        console.log("   🔍 Status:", response.status);
        console.log("   🔍 Headers Location:", response.headers?.location);
        console.log("   🔍 Tiene data:", !!response.data);
        console.log("   🔍 Tipo de data:", typeof response.data);
        console.log("   🔍 Data (primeros 200 chars):", JSON.stringify(response.data).slice(0, 200));
        
        // Si es un redirect, Instagram está bloqueando
        if (response.status === 302 || response.status === 301) {
          console.error("   ❌ Instagram está redirigiendo - Session ID rechazado");
          throw new Error("Session ID inválido o expirado - Instagram redirige a login");
        }
        
        if (response.data?.status === 'fail' || response.data?.message) {
          console.error("   ❌ Instagram respuesta de error:", response.data);
          throw new Error(`Instagram error: ${response.data?.message || 'Unknown error'}`);
        }

        const commentData =
          response.data?.data?.shortcode_media?.edge_media_to_parent_comment;

        if (!commentData) {
          console.error("   ❌ Estructura de respuesta:", JSON.stringify(response.data, null, 2).slice(0, 500));
          throw new Error("No se pudo obtener estructura de comentarios - Session ID inválido o post no existe");
        }

        const edges = commentData.edges || [];
        const pageInfo = commentData.page_info;

        // Agregar comentarios de esta página
        const pageComments = edges.map((edge) => ({
          username: edge.node.owner.username,
          text: edge.node.text,
          timestamp: new Date(edge.node.created_at * 1000).toISOString(),
          id: edge.node.id,
        }));

        allComments.push(...pageComments);

        console.log(
          `   📄 Página ${pageCount}: +${pageComments.length} comentarios (Total: ${allComments.length})`,
        );

        // Reset retry count después de un éxito
        retryCount = 0;

        // Verificar si hay más páginas
        hasNextPage = pageInfo?.has_next_page || false;
        endCursor = pageInfo?.end_cursor || null;

        // Pausa variable entre requests (3-6 segundos con distribución aleatoria)
        if (hasNextPage) {
          const baseDelay = 3000;
          const randomDelay = Math.floor(Math.random() * 3000); // 0-3 segundos adicionales
          const totalDelay = baseDelay + randomDelay;

          console.log(`   ⏳ Esperando ${(totalDelay / 1000).toFixed(1)}s antes de la siguiente página...`);
          await new Promise((resolve) => setTimeout(resolve, totalDelay));
        }
      } catch (pageError) {
        // Manejo de errores con retry y exponential backoff
        if (pageError.response?.status === 429 || pageError.response?.status === 403) {
          console.warn(`   ⚠️  Rate limit detectado (${pageError.response.status})`);

          if (retryCount < maxRetries) {
            retryCount++;
            const backoffDelay = Math.pow(2, retryCount) * 5000; // 10s, 20s, 40s
            console.log(`   ⏳ Esperando ${backoffDelay / 1000}s antes de reintentar (intento ${retryCount}/${maxRetries})...`);
            await new Promise((resolve) => setTimeout(resolve, backoffDelay));
            pageCount--; // No contar esta página como intentada
            continue; // Reintentar la misma página
          } else {
            console.error("   ❌ Máximo de reintentos alcanzado, deteniendo paginación");
            break;
          }
        } else {
          throw pageError; // Re-lanzar otros errores
        }
      }
    }

    if (pageCount >= 100) {
      console.warn("⚠️  Alcanzado límite de seguridad de 100 páginas");
    }

    console.log(
      `✅ Descarga completa: ${allComments.length} comentarios en ${pageCount} página(s)`,
    );
    return allComments;
  } catch (error) {
    console.error("❌ Error con sessionid:", error.message);
    if (error.response) {
      console.error("   Status:", error.response.status);
      console.error("   URL:", error.config?.url);
      if (error.response.status === 429) {
        console.error("   💡 Sugerencia: Instagram está limitando las peticiones. Espera unos minutos antes de reintentar.");
      } else if (error.response.status === 302 || error.response.status === 301) {
        console.error("   💡 Instagram está redirigiendo - Probablemente el Session ID es inválido o expiró.");
        throw new Error("Session ID inválido o expirado. Por favor, obtén uno nuevo desde Instagram.");
      } else if (error.response.status === 401 || error.response.status === 403) {
        console.error("   💡 Acceso no autorizado - Verifica tu Session ID.");
        throw new Error("Session ID inválido. Por favor, obtén uno nuevo desde Instagram.");
      }
    } else if (error.code === 'ERR_FR_TOO_MANY_REDIRECTS') {
      console.error("   💡 Demasiadas redirecciones - Session ID probablemente inválido");
      throw new Error("Session ID inválido o expiró. Instagram está bloqueando el acceso. Obtén un nuevo Session ID.");
    }
    throw error;
  }
}

// NOTA: Ya no usamos datos mock. Solo datos reales de Instagram.
// Si el INSTAGRAM_SESSION_ID no está configurado, la aplicación fallará con un error claro.

// Función fetchByScraping removida - solo usamos sessionid para garantizar datos reales
export async function fetchInstagramComments(shortcode) {
  const sessionId = process.env.INSTAGRAM_SESSION_ID;

  // Verificar que haya session ID configurado
  if (!sessionId || sessionId === "your_session_id_here") {
    throw new Error(
      "❌ INSTAGRAM_SESSION_ID no configurado. Por favor, agrega tu Session ID de Instagram en el archivo .env para obtener comentarios reales."
    );
  }

  // Método 1: Con sessionid (el más confiable y el único que usaremos)
  try {
    const comments = await fetchWithSessionId(shortcode, sessionId);
    if (comments.length > 0) {
      console.log(
        `✅ Obtenidos ${comments.length} comentarios reales con sessionid`,
      );
      return comments;
    }
    
    // Si retorna 0 comentarios, puede ser que el post realmente no tenga comentarios
    console.log("ℹ️  El post no tiene comentarios o aún no se han cargado");
    return [];
  } catch (error) {
    console.error("❌ Error obteniendo comentarios de Instagram:", error.message);
    if (error.response?.status === 429) {
      throw new Error(
        "Instagram está limitando las peticiones (rate limit). Por favor, espera 10-15 minutos antes de reintentar."
      );
    }
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error(
        "El INSTAGRAM_SESSION_ID es inválido o ha expirado. Por favor, obtén uno nuevo desde las DevTools de tu navegador."
      );
    }
    throw new Error(`No se pudieron obtener comentarios: ${error.message}`);
  }
}

// NOTA: Ya no usamos datos mock. Solo datos reales de Instagram.
// Si el INSTAGRAM_SESSION_ID no está configurado, la aplicación fallará con un error claro.

/**
 * Obtiene información básica de un post de Instagram
 * @param {string} shortcode - Shortcode del post
 * @returns {Promise<Object>} - Información del post
 */
export async function getPostInfo(shortcode) {
  try {
    const url = `https://www.instagram.com/p/${shortcode}/`;

    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    // Extraer datos básicos del HTML
    const data = response.data;
    const likesMatch = data.match(/"edge_media_preview_like":{"count":(\d+)}/);
    const commentsMatch = data.match(/"edge_media_to_comment":{"count":(\d+)}/);

    return {
      likes: likesMatch ? parseInt(likesMatch[1]) : 0,
      comments: commentsMatch ? parseInt(commentsMatch[1]) : 0,
      url: url,
    };
  } catch (error) {
    console.error("Error getting post info:", error.message);
    return { likes: 0, comments: 0, url: "" };
  }
}
