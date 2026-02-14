# A-ERA Sorteos - Sistema de Sorteos para Instagram

Sistema completo para realizar sorteos en Instagram con reglas personalizables.

## 🚀 Características

- 🎯 Consulta comentarios de posts de Instagram
- 🎲 Sorteo aleatorio con sistema justo
- 📋 Reglas personalizables:
  - Cantidad mínima de etiquetas
  - Filtrar comentarios por palabras clave
  - Excluir usuarios específicos
  - Verificar seguidores
- 💾 Historial de sorteos
- 🎨 Interface moderna y responsive

## 📦 Instalación

```bash
# Instalar dependencias del proyecto completo
npm run install-all

# Copiar archivo de configuración
cp .env.example .env
```

## 🔧 Configuración

Edita el archivo `.env` con tus credenciales:

```env
PORT=3001
INSTAGRAM_SESSION_ID=tu_session_id_aqui
```

### 🔑 Obtener Instagram Session ID (Para posts reales)

#### Método 1: Chrome / Edge

1. **Abre Instagram** en tu navegador e inicia sesión
2. **Presiona F12** para abrir DevTools
3. Ve a la pestaña **Application** (ubicada arriba)
4. En el menú lateral izquierdo, expande **Cookies**
5. Haz clic en `https://www.instagram.com`
6. Busca la cookie llamada **`sessionid`**
7. **Haz doble clic** en el valor para seleccionarlo
8. **Copia** el valor completo (Ctrl+C)
9. Pégalo en tu archivo `.env`:
   ```env
   INSTAGRAM_SESSION_ID=tu_valor_copiado_aqui
   ```

#### Método 2: Firefox

1. **Abre Instagram** e inicia sesión
2. **Presiona F12** para abrir las herramientas
3. Ve a la pestaña **Storage**
4. Expande **Cookies** en el menú lateral
5. Haz clic en `https://www.instagram.com`
6. Busca `sessionid` en la lista
7. **Copia** el valor completo
8. Pégalo en tu `.env`

#### Método 3: Usando Extensión (Más fácil)

1. **Instala** la extensión [EditThisCookie](https://chrome.google.com/webstore/detail/editthiscookie/) o similar
2. Ve a **Instagram** (logueado)
3. Haz clic en el **icono** de la extensión
4. Busca la cookie **`sessionid`**
5. Haz clic en el **ícono de copiar** junto al valor
6. Pega en tu `.env`

#### ⚠️ Importante sobre el Session ID

- **NO lo compartas** con nadie (da acceso a tu cuenta)
- Si cambias tu contraseña de Instagram, el sessionid se invalida
- El sessionid puede expirar después de ~90 días
- Considera crear una **cuenta secundaria** de Instagram para sorteos
- El archivo `.env` ya está en `.gitignore` (no se subirá a GitHub)

#### 🧪 Modo de Desarrollo (Sin Session ID)

Si **NO** agregas el sessionid, el sistema funciona con **datos de ejemplo**:
- 16 comentarios ficticios pre-cargados
- Perfecto para probar el sistema
- Todas las funciones operativas

Para usar **posts reales de Instagram**, el sessionid es **obligatorio**.

## 🎮 Uso

```bash
# Iniciar servidor y cliente
npm run dev

# Solo servidor (http://localhost:3001)
npm run server

# Solo cliente (http://localhost:5173)
npm run client
```

## 🏗️ Estructura del Proyecto

```
A-ERA-sorteos/
├── server/           # Backend Node.js/Express
│   ├── index.js      # Servidor principal
│   ├── instagram.js  # Servicios de Instagram
│   └── database.js   # Base de datos SQLite
├── client/           # Frontend React
│   └── src/
│       ├── components/  # Componentes React
│       ├── App.jsx      # Aplicación principal
│       └── main.jsx     # Punto de entrada
└── package.json
```

## 📝 API Endpoints

- `POST /api/fetch-comments` - Obtener comentarios de un post
- `POST /api/run-raffle` - Ejecutar sorteo con reglas
- `GET /api/raffles` - Historial de sorteos
- `GET /api/raffle/:id` - Detalle de sorteo específico

## 🎯 Reglas de Sorteo

- **Mínimo de etiquetas**: Define cuántas @ debe tener el comentario
- **Palabras clave**: Solo incluye comentarios que contengan ciertas palabras
- **Lista de exclusión**: Excluye usuarios específicos del sorteo
- **Usuarios únicos**: Evita entradas duplicadas del mismo usuario

## 📄 Licencia

MIT
