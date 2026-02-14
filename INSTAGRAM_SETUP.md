# 📸 Guía Completa: Obtener Session ID de Instagram

Esta guía te explica **paso a paso** cómo obtener tu Session ID de Instagram para usar posts reales en el sistema de sorteos.

## 🎯 ¿Para qué sirve el Session ID?

El Session ID es una cookie que demuestra que has iniciado sesión en Instagram. Con ella, el sistema puede:
- ✅ Obtener comentarios de posts públicos
- ✅ Acceder a posts de cuentas que sigues
- ✅ Ver todos los comentarios (no solo los primeros)

**IMPORTANTE**: El Session ID **NO** es tu contraseña, pero da acceso a tu cuenta. Manténlo privado.

---

## 🖥️ Método 1: Google Chrome / Microsoft Edge

### Paso 1: Abre Instagram
- Ve a https://www.instagram.com
- Inicia sesión normalmente con tu cuenta

### Paso 2: Abre las Herramientas de Desarrollador
- **Opción A**: Presiona la tecla `F12`
- **Opción B**: Click derecho en cualquier parte → "Inspeccionar"
- **Opción C**: `Ctrl + Shift + I` (Windows) o `Cmd + Option + I` (Mac)

### Paso 3: Ve a la pestaña "Application"
```
En la barra superior de DevTools verás pestañas:
Elements | Console | Sources | Network | [Application] ← Haz click aquí
```

### Paso 4: Navega a las Cookies
```
En el menú lateral izquierdo:
├── Application
│   ├── Storage
│   │   ├── Local Storage
│   │   ├── Session Storage
│   │   ├── 🍪 Cookies  ← Expande esto
│   │   │   └── https://www.instagram.com  ← Haz click aquí
```

### Paso 5: Encuentra "sessionid"
Verás una tabla con estas columnas:
```
Name          | Value                          | Domain          | Path
---------------------------------------------------------------------------
sessionid     | 12345678%3AABCxyz123...       | .instagram.com  | /
```

### Paso 6: Copia el valor
1. **Haz doble click** sobre el valor (columna "Value")
2. El texto se seleccionará (debería verse azul)
3. Presiona **Ctrl+C** para copiarlo
4. ¡Listo! Ya tienes tu sessionid

### Paso 7: Agrégalo al archivo .env
1. Abre el archivo `.env` en la raíz del proyecto
2. Busca la línea: `INSTAGRAM_SESSION_ID=your_session_id_here`
3. Reemplázala con:
   ```env
   INSTAGRAM_SESSION_ID=el_valor_que_copiaste_aqui
   ```
4. **Guarda el archivo** (Ctrl+S)

---

## 🦊 Método 2: Mozilla Firefox

### Paso 1: Abre Instagram
- Ve a https://www.instagram.com
- Inicia sesión con tu cuenta

### Paso 2: Abre las Herramientas de Desarrollador
- **Opción A**: Presiona `F12`
- **Opción B**: Click derecho → "Inspeccionar elemento"
- **Opción C**: `Ctrl + Shift + I` (Windows) o `Cmd + Option + I` (Mac)

### Paso 3: Ve a la pestaña "Storage"
```
En la barra superior verás:
Inspector | Console | Debugger | [Storage] ← Click aquí
```

### Paso 4: Navega a Cookies
```
En el menú lateral:
├── Storage
│   ├── 🍪 Cookies  ← Expande esto
│   │   └── https://www.instagram.com  ← Click aquí
```

### Paso 5: Busca "sessionid"
Verás una tabla con todas las cookies. Busca la que dice `sessionid` en la columna "Name"

### Paso 6: Copia el valor
1. Haz **click** en la fila de `sessionid`
2. El valor aparecerá abajo o al lado
3. **Selecciona todo el valor** y copia (Ctrl+C)

### Paso 7: Agrégalo al .env
Igual que en Chrome, edita tu archivo `.env`:
```env
INSTAGRAM_SESSION_ID=tu_valor_aqui
```

---

## 🔧 Método 3: Usando Extensión (Más Fácil)

### Paso 1: Instala la extensión
- **Chrome**: [EditThisCookie](https://chrome.google.com/webstore/detail/editthiscookie/)
- **Firefox**: [Cookie-Editor](https://addons.mozilla.org/firefox/addon/cookie-editor/)

### Paso 2: Ve a Instagram
- Abre https://www.instagram.com
- Inicia sesión

### Paso 3: Abre la extensión
- Haz click en el **ícono** de la extensión (arriba a la derecha)
- Verás una lista de todas las cookies

### Paso 4: Busca sessionid
- Busca en la lista la cookie llamada `sessionid`
- Haz click en ella

### Paso 5: Copia el valor
- Verás un campo con el valor
- Haz click en el **botón de copiar** 📋 o selecciona y copia (Ctrl+C)

### Paso 6: Pégalo en .env
```env
INSTAGRAM_SESSION_ID=el_valor_copiado
```

---

## ✅ Verificar que funciona

### Método 1: Reiniciar el servidor
```bash
# Detén el servidor (Ctrl+C)
# Inicia de nuevo:
npm run dev
```

### Método 2: Probar con un post real
1. Busca un post de Instagram con comentarios
2. Copia la URL (ejemplo: `https://www.instagram.com/p/ABC123xyz/`)
3. Pégala en el sistema de sorteos
4. Haz click en "Cargar Comentarios"

Si ves comentarios reales (no los de ejemplo), **¡funcionó!** 🎉

---

## 🚨 Problemas Comunes

### "No se pudieron obtener comentarios reales"
**Posibles causas:**
- El sessionid expiró (obtén uno nuevo)
- Copiaste el valor incompleto
- Hay espacios extra al inicio/final del valor
- Cambiaste tu contraseña de Instagram (el sessionid se invalida)

**Solución:**
1. Cierra sesión en Instagram
2. Vuelve a iniciar sesión
3. Obtén un **nuevo sessionid**
4. Actualiza el `.env`

### El servidor no lee el .env
**Solución:**
```bash
# Asegúrate de reiniciar el servidor después de editar .env
Ctrl+C  # Detener
npm run dev  # Iniciar de nuevo
```

### "Instagram bloqueó la petición"
Si haces **muchas peticiones seguidas**, Instagram puede bloquearte temporalmente.

**Solución:**
- Espera 15-30 minutos
- Intenta desde otra red WiFi
- Usa los datos móviles de tu teléfono como hotspot

---

## 🔒 Seguridad

### ✅ Buenas Prácticas
- ✅ Mantén tu sessionid **privado**
- ✅ No lo compartas con nadie
- ✅ No lo subas a GitHub (ya está en `.gitignore`)
- ✅ Usa una cuenta secundaria de Instagram para sorteos
- ✅ Cambia tu sessionid periódicamente

### ❌ Nunca Hagas Esto
- ❌ No compartas capturas con el sessionid visible
- ❌ No lo pegues en foros públicos
- ❌ No lo envíes por mensaje/email
- ❌ No uses el sessionid de tu cuenta personal principal

### 🛡️ ¿Qué pasa si alguien obtiene mi sessionid?
Si crees que alguien tiene acceso a tu sessionid:
1. **Cambia tu contraseña** de Instagram inmediatamente
2. Esto invalida todos los sessionid antiguos
3. Obtén un **nuevo sessionid** siguiendo esta guía

---

## 🎓 Conceptos Técnicos (Opcional)

### ¿Qué es una cookie Session ID?
Es un identificador único que Instagram genera cuando inicias sesión. Es como un "pase temporal" que prueba que eres tú.

### ¿Por qué lo necesitamos?
Instagram no tiene una API pública para obtener comentarios. Sin autenticación, bloquean las peticiones.

### ¿Se puede usar la API oficial?
Instagram tiene una API oficial (Instagram Graph API) pero:
- Solo para cuentas de negocios
- Requiere aprobación de Facebook
- Proceso largo y complejo
- Limitado en funciones

El método del sessionid es **más simple y directo** para usuarios individuales.

---

## 📞 Soporte

Si seguiste todos los pasos y aún tienes problemas:

1. **Verifica** que copiaste el valor completo (sin espacios)
2. **Revisa** que el archivo `.env` esté en la raíz del proyecto
3. **Confirma** que reiniciaste el servidor
4. **Intenta** cerrar sesión e iniciar de nuevo en Instagram
5. **Prueba** con un navegador diferente

Si nada funciona, el sistema seguirá funcionando con **datos de ejemplo** hasta que resuelvas el problema.

---

## 🎯 Resumen Rápido

Para los impacientes:

```bash
# 1. Ve a Instagram (logueado)
# 2. Presiona F12
# 3. Application > Cookies > instagram.com
# 4. Copia el valor de "sessionid"
# 5. Pégalo en .env:
INSTAGRAM_SESSION_ID=valor_copiado
# 6. Reinicia el servidor
npm run dev
```

¡Listo! 🚀
