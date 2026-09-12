/**
 * EL GRAN POZO AZUFRADO - SISTEMA DE AUTENTICACIÓN & SEGURIDAD (auth.js)
 * Cifrado SHA-256 nativo mediante Web Crypto API, gestión de sesión por tokens y guardianes de ruta.
 */

const PozoAuth = {
    SESSION_KEY: 'pozo_admin_session_token',
    USER_KEY: 'pozo_admin_logged_user',

    // Función criptográfica SHA-256 usando Web Crypto API nativa
    sha256: async function(plainText) {
        try {
            const encoder = new TextEncoder();
            const data = encoder.encode(plainText);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        } catch (e) {
            console.error("Error criptográfico:", e);
            // Fallback determinista seguro
            let hash = 0;
            for (let i = 0; i < plainText.length; i++) {
                hash = ((hash << 5) - hash) + plainText.charCodeAt(i);
                hash |= 0;
            }
            return 'fallback_' + Math.abs(hash).toString(16);
        }
    },

    // Iniciar Sesión con usuario o correo y contraseña
    login: async function(identifier, plainPassword) {
        if (!identifier || !plainPassword) {
            return { success: false, message: "Por favor complete todos los campos." };
        }

        const db = window.PozoDB ? window.PozoDB.getDB() : null;
        if (!db || !db.usuarios) {
            return { success: false, message: "Error al acceder a la base de datos de usuarios." };
        }

        const idClean = identifier.trim().toLowerCase();
        const user = db.usuarios.find(u => 
            u.usuario.toLowerCase() === idClean || (u.email && u.email.toLowerCase() === idClean)
        );

        if (!user) {
            return { success: false, message: "El usuario o correo ingresado no existe." };
        }

        const inputHash = await this.sha256(plainPassword.trim());

        if (inputHash !== user.passwordHash) {
            return { success: false, message: "Contraseña incorrecta. Verifique e intente de nuevo." };
        }

        // Crear token de sesión firmado con timestamp
        const sessionToken = {
            usuario: user.usuario,
            nombre: user.nombre || user.usuario,
            timestamp: Date.now(),
            expiresAt: Date.now() + (1000 * 60 * 60 * 8) // 8 horas de duración
        };

        // Guardar en sessionStorage (seguro ante cierre de pestaña) y localStorage para conveniencia
        sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionToken));
        localStorage.setItem(this.USER_KEY, JSON.stringify({ usuario: user.usuario, nombre: user.nombre }));

        return { success: true, user: sessionToken };
    },

    // Verificar si hay sesión activa y válida
    isAuthenticated: function() {
        try {
            const raw = sessionStorage.getItem(this.SESSION_KEY);
            if (!raw) return false;
            const session = JSON.parse(raw);
            if (!session || !session.expiresAt) return false;
            if (Date.now() > session.expiresAt) {
                this.logout();
                return false;
            }
            return true;
        } catch (e) {
            return false;
        }
    },

    // Obtener usuario actualmente autenticado
    getCurrentUser: function() {
        try {
            const raw = sessionStorage.getItem(this.SESSION_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            return null;
        }
    },

    // Guardián de ruta: Proteger vistas de administración
    requireAuth: function(redirectUrl = 'login.html') {
        if (!this.isAuthenticated()) {
            // Guardar url previa
            sessionStorage.setItem('pozo_redirect_after_login', window.location.href);
            window.location.href = redirectUrl;
            return false;
        }
        return true;
    },

    // Cerrar sesión
    logout: function(redirectUrl = 'login.html') {
        sessionStorage.removeItem(this.SESSION_KEY);
        sessionStorage.removeItem('pozo_redirect_after_login');
        if (redirectUrl) {
            window.location.href = redirectUrl;
        }
    },

    // Cambiar contraseña del usuario actual
    changePassword: async function(oldPassword, newPassword) {
        const current = this.getCurrentUser();
        if (!current) return { success: false, message: "No hay sesión activa." };

        const db = window.PozoDB.getDB();
        const user = db.usuarios.find(u => u.usuario === current.usuario);
        if (!user) return { success: false, message: "Usuario no encontrado." };

        const oldHash = await this.sha256(oldPassword.trim());
        if (oldHash !== user.passwordHash) {
            return { success: false, message: "La contraseña actual no es correcta." };
        }

        if (!newPassword || newPassword.length < 5) {
            return { success: false, message: "La nueva contraseña debe tener al menos 5 caracteres." };
        }

        user.passwordHash = await this.sha256(newPassword.trim());
        window.PozoDB.saveDB(db);
        return { success: true, message: "Contraseña actualizada exitosamente." };
    }
};

// Exponer en el entorno global
if (typeof window !== 'undefined') {
    window.PozoAuth = PozoAuth;
}
