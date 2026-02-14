# 🔄 Cómo Renovar tu Instagram Session ID

## ⚠️ ¿Por qué necesito renovarlo?

El Session ID de Instagram **expira cada cierto tiempo** (generalmente después de unas semanas). Cuando esto ocurre, verás errores como:
- "Maximum number of redirects exceeded"
- "Session ID inválido o expirado"
- "Instagram está bloqueando el acceso"

## 📋 Pasos para obtener un nuevo Session ID

### 1. Abre Instagram en tu navegador
- Ve a: https://www.instagram.com
- **IMPORTANTE**: Debes estar logueado en tu cuenta

### 2. Abre las DevTools
- **Windows/Linux**: Presiona `F12` o `Ctrl+Shift+I`
- **Mac**: Presiona `Cmd+Option+I`

### 3. Ve a la pestaña "Application" (Aplicación)
- Si no ves "Application", busca "Storage" o "Almacenamiento"

### 4. Expande "Cookies" en el menú lateral
- Haz clic en `https://www.instagram.com`

### 5. Busca la cookie "sessionid"
- Debería estar en la lista de cookies
- Haz doble clic en el **valor** para seleccionarlo

### 6. Copia el valor completo
- Debería verse algo como: `674220886%3AUpfknTf6rNHtT6%3A13%3AAYj...`
- **IMPORTANTE**: Copia TODO el valor, incluidos los caracteres `%3A`

### 7. Pégalo en el archivo .env
Abre el archivo `.env` en la raíz del proyecto y reemplaza el valor actual:

```env
INSTAGRAM_SESSION_ID=TU_NUEVO_SESSION_ID_AQUI
```

### 8. Reinicia el servidor
```bash
# Detén el servidor si está corriendo (Ctrl+C)
# Luego ejecuta de nuevo:
npm run dev
```

## ✅ Verificación

Después de actualizar el Session ID, deberías ver en la consola del servidor:

```
✅ Instagram Session ID configurado - SOLO DATOS REALES
✅ Sistema anti-bloqueo activado (delays 3-6s, retry automático)
```

## 🔒 Consejos de Seguridad

1. **NO compartas tu Session ID** - Es como tu contraseña
2. **NO lo subas a GitHub** - El archivo `.env` está en `.gitignore`
3. **Renuévalo periódicamente** - Cada 1-2 semanas es recomendable
4. **Cierra sesión en Instagram cuando termines** - Para invalidar el Session ID

## 🚨 Problemas Comunes

### "Maximum redirects" sigue apareciendo
- El Session ID aún está expirado o mal copiado
- Asegúrate de copiar TODO el valor, sin espacios al inicio/final
- Cierra sesión en Instagram y vuelve a iniciar sesión

### "Instagram está limitando las peticiones"
- Espera 10-15 minutos antes de reintentar
- Instagram tiene límites de peticiones por hora
- No hagas sorteos muy seguidos

### El Session ID no aparece en las cookies
- Asegúrate de estar logueado en Instagram
- Prueba cerrando sesión y volviendo a iniciar
- Usa Chrome o Firefox (funciona mejor que otros navegadores)

## 📞 ¿Necesitas ayuda?

Si sigues teniendo problemas, verifica:
1. ✅ Estás logueado en Instagram en el navegador
2. ✅ Copiaste el valor completo del sessionid (sin espacios)
3. ✅ Lo pegaste correctamente en `.env`
4. ✅ Reiniciaste el servidor después de actualizar

---

**Última actualización**: Febrero 2026
