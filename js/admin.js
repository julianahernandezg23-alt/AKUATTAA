/**
 * EL GRAN POZO AZUFRADO - LÓGICA DEL PANEL ADMINISTRATIVO (admin.js)
 * Gestión integral de comidas, bebidas, estancia, fotos, horarios y seguridad.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Validar autenticación
    if (!PozoAuth.requireAuth('login.html')) {
        return;
    }

    // Inicializar aplicación administrativa
    AdminApp.init();
});

const AdminApp = {
    init: function() {
        this.setupUser();
        this.setupNavigation();
        this.setupForms();
        this.renderAll();

        // Cerrar sesión
        const logoutBtn = document.getElementById('btn-logout');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
                    PozoAuth.logout('login.html');
                }
            });
        }

        // Toggle menú móvil
        const menuToggleBtn = document.getElementById('sidebar-toggle-btn');
        const sidebar = document.getElementById('admin-sidebar');
        if (menuToggleBtn && sidebar) {
            menuToggleBtn.addEventListener('click', () => {
                sidebar.classList.toggle('open-mobile');
            });
        }
    },

    setupUser: function() {
        const user = PozoAuth.getCurrentUser();
        const displayElem = document.getElementById('user-display-name');
        if (user && displayElem) {
            displayElem.textContent = user.nombre || user.usuario;
        }
    },

    setupNavigation: function() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionId = item.dataset.section;
                this.switchTab(sectionId);

                // Cerrar menú móvil al navegar
                const sidebar = document.getElementById('admin-sidebar');
                if (sidebar) sidebar.classList.remove('open-mobile');
            });
        });
    },

    switchTab: function(sectionId) {
        // Actualizar items de menú
        document.querySelectorAll('.nav-item').forEach(el => {
            el.classList.toggle('active', el.dataset.section === sectionId);
        });

        // Actualizar secciones visibles
        document.querySelectorAll('.admin-section').forEach(sec => {
            sec.classList.toggle('active-section', sec.id === sectionId);
        });

        // Actualizar título
        const titles = {
            'section-resumen': 'Resumen General',
            'section-comidas': 'Gestión de Comidas',
            'section-bebidas': 'Gestión de Bebidas',
            'section-estancia': 'Tarifas y Estancia',
            'section-galeria': 'Galería Fotográfica',
            'section-info': 'Información Turística & Redes',
            'section-config': 'Seguridad y Respaldo'
        };
        const titleElem = document.getElementById('admin-page-title');
        if (titleElem && titles[sectionId]) {
            titleElem.textContent = titles[sectionId];
        }
    },

    renderAll: function() {
        this.renderStats();
        this.renderComidas();
        this.renderBebidas();
        this.renderEstancia();
        this.renderGaleria();
        this.loadInfoTuristica();
    },

    // RENDERIZAR MÉTRICAS DEL RESUMEN
    renderStats: function() {
        const comidas = PozoDB.getComidas();
        const bebidas = PozoDB.getBebidas();
        const galeria = PozoDB.getGaleria();
        const estancia = PozoDB.getEstancia();

        const statComidas = document.getElementById('stat-comidas');
        const statBebidas = document.getElementById('stat-bebidas');
        const statGaleria = document.getElementById('stat-galeria');
        const statEstancia = document.getElementById('stat-estancia');

        if (statComidas) statComidas.textContent = comidas.length;
        if (statBebidas) statBebidas.textContent = bebidas.length;
        if (statGaleria) statGaleria.textContent = galeria.length;
        if (statEstancia) {
            statEstancia.textContent = (estancia && estancia[0]) ? '$' + estancia[0].precio.toLocaleString('es-CO') : '$0';
        }
    },

    // ==========================================
    // SECCIÓN COMIDAS
    // ==========================================
    renderComidas: function() {
        const tbody = document.getElementById('comidas-table-body');
        if (!tbody) return;
        const comidas = PozoDB.getComidas();

        tbody.innerHTML = '';
        if (comidas.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #94a3b8; padding: 24px;">No hay platos registrados. Agrega uno con el botón superior.</td></tr>`;
            return;
        }

        comidas.forEach(c => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <div class="product-cell">
                        <img src="${c.imagen || '../LOGO/LOGO AKUATTA.jpeg'}" alt="${c.nombre}" class="table-thumb" onerror="this.src='../LOGO/LOGO AKUATTA.jpeg'">
                        <div>
                            <strong class="product-title">${c.nombre}</strong>
                            <span class="product-desc-snippet">${c.descripcion}</span>
                        </div>
                    </div>
                </td>
                <td>
                    <strong style="color: var(--admin-primary); font-size: 1rem;">$${c.precio.toLocaleString('es-CO')}</strong>
                </td>
                <td>
                    <span class="badge-status ${c.activo !== false ? 'badge-active' : 'badge-inactive'}">
                        ${c.activo !== false ? 'Activo' : 'Inactivo'}
                    </span>
                </td>
                <td>
                    <div class="actions-cell">
                        <button class="btn-action btn-edit" onclick="AdminApp.editComida('${c.id}')" title="Editar plato">✏️ Editar</button>
                        <button class="btn-action" onclick="AdminApp.toggleComidaStatus('${c.id}')" title="Activar o desactivar">
                            ${c.activo !== false ? 'Desactivar' : 'Activar'}
                        </button>
                        <button class="btn-action btn-delete" onclick="AdminApp.deleteComida('${c.id}')" title="Eliminar">🗑️</button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    },

    openComidaModal: function() {
        document.getElementById('form-comida').reset();
        document.getElementById('comida-id').value = '';
        document.getElementById('modal-comida-title').textContent = 'Agregar Nuevo Plato';
        document.getElementById('comida-img-url').value = '';
        document.getElementById('comida-preview').innerHTML = '<span>Vista previa de la fotografía</span>';
        document.getElementById('comida-activo').checked = true;
        this.openModal('modal-comida');
    },

    editComida: function(id) {
        const comidas = PozoDB.getComidas();
        const comida = comidas.find(c => c.id === id);
        if (!comida) return;

        document.getElementById('comida-id').value = comida.id;
        document.getElementById('comida-nombre').value = comida.nombre;
        document.getElementById('comida-precio').value = comida.precio;
        document.getElementById('comida-desc').value = comida.descripcion;
        document.getElementById('comida-img-url').value = comida.imagen || '';
        document.getElementById('comida-activo').checked = comida.activo !== false;

        const preview = document.getElementById('comida-preview');
        if (comida.imagen) {
            preview.innerHTML = `<img src="${comida.imagen}" alt="Preview">`;
        } else {
            preview.innerHTML = '<span>Sin fotografía seleccionada</span>';
        }

        document.getElementById('modal-comida-title').textContent = 'Editar: ' + comida.nombre;
        this.openModal('modal-comida');
    },

    toggleComidaStatus: function(id) {
        const comidas = PozoDB.getComidas();
        const comida = comidas.find(c => c.id === id);
        if (comida) {
            comida.activo = !comida.activo;
            PozoDB.saveComida(comida);
            this.renderComidas();
            this.renderStats();
        }
    },

    deleteComida: function(id) {
        if (confirm("¿Seguro que deseas eliminar este plato del menú?")) {
            PozoDB.deleteComida(id);
            this.renderComidas();
            this.renderStats();
        }
    },

    // ==========================================
    // SECCIÓN BEBIDAS
    // ==========================================
    renderBebidas: function() {
        const tbody = document.getElementById('bebidas-table-body');
        if (!tbody) return;
        const bebidas = PozoDB.getBebidas();

        tbody.innerHTML = '';
        if (bebidas.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #94a3b8; padding: 24px;">No hay bebidas registradas. Agrega una con el botón superior.</td></tr>`;
            return;
        }

        const catNombres = {
            gaseosas: '🥤 Gaseosas',
            aguas: '💧 Aguas',
            jugos: '🥭 Jugos',
            cervezas: '🍺 Cervezas'
        };

        bebidas.forEach(b => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <div class="product-cell">
                        <img src="${b.imagen || '../LOGO/LOGO AKUATTA.jpeg'}" alt="${b.nombre}" class="table-thumb" onerror="this.src='../LOGO/LOGO AKUATTA.jpeg'">
                        <div>
                            <strong class="product-title">${b.nombre}</strong>
                            <span class="product-desc-snippet">${b.descripcion || ''}</span>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="badge-tag">${catNombres[b.categoria] || b.categoria}</span>
                </td>
                <td>
                    <strong style="color: var(--admin-primary); font-size: 1rem;">$${b.precio.toLocaleString('es-CO')}</strong>
                </td>
                <td>
                    <span class="badge-status ${b.activo !== false ? 'badge-active' : 'badge-inactive'}">
                        ${b.activo !== false ? 'Activa' : 'Inactiva'}
                    </span>
                </td>
                <td>
                    <div class="actions-cell">
                        <button class="btn-action btn-edit" onclick="AdminApp.editBebida('${b.id}')" title="Editar precio o datos">✏️ Editar</button>
                        <button class="btn-action" onclick="AdminApp.toggleBebidaStatus('${b.id}')">
                            ${b.activo !== false ? 'Desactivar' : 'Activar'}
                        </button>
                        <button class="btn-action btn-delete" onclick="AdminApp.deleteBebida('${b.id}')">🗑️</button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    },

    openBebidaModal: function() {
        document.getElementById('form-bebida').reset();
        document.getElementById('bebida-id').value = '';
        document.getElementById('modal-bebida-title').textContent = 'Agregar Nueva Bebida';
        document.getElementById('bebida-img-url').value = '';
        document.getElementById('bebida-preview').innerHTML = '<span>Vista previa de la fotografía</span>';
        document.getElementById('bebida-activo').checked = true;
        this.openModal('modal-bebida');
    },

    editBebida: function(id) {
        const bebidas = PozoDB.getBebidas();
        const bebida = bebidas.find(b => b.id === id);
        if (!bebida) return;

        document.getElementById('bebida-id').value = bebida.id;
        document.getElementById('bebida-nombre').value = bebida.nombre;
        document.getElementById('bebida-categoria').value = bebida.categoria;
        document.getElementById('bebida-precio').value = bebida.precio;
        document.getElementById('bebida-desc').value = bebida.descripcion || '';
        document.getElementById('bebida-img-url').value = bebida.imagen || '';
        document.getElementById('bebida-activo').checked = bebida.activo !== false;

        const preview = document.getElementById('bebida-preview');
        if (bebida.imagen) {
            preview.innerHTML = `<img src="${bebida.imagen}" alt="Preview">`;
        } else {
            preview.innerHTML = '<span>Sin fotografía seleccionada</span>';
        }

        document.getElementById('modal-bebida-title').textContent = 'Editar: ' + bebida.nombre;
        this.openModal('modal-bebida');
    },

    toggleBebidaStatus: function(id) {
        const bebidas = PozoDB.getBebidas();
        const bebida = bebidas.find(b => b.id === id);
        if (bebida) {
            bebida.activo = !bebida.activo;
            PozoDB.saveBebida(bebida);
            this.renderBebidas();
            this.renderStats();
        }
    },

    deleteBebida: function(id) {
        if (confirm("¿Seguro que deseas eliminar esta bebida de la carta?")) {
            PozoDB.deleteBebida(id);
            this.renderBebidas();
            this.renderStats();
        }
    },

    // ==========================================
    // SECCIÓN ESTANCIA
    // ==========================================
    renderEstancia: function() {
        const container = document.getElementById('estancia-cards-container');
        if (!container) return;
        const estancias = PozoDB.getEstancia();

        container.innerHTML = '';
        if (estancias.length === 0) {
            container.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 30px; color: #94a3b8; background: #fff; border-radius: 12px; border: 1px dashed #cbd5e1;">No hay opciones de estadía registradas. Agrega una con el botón superior.</div>`;
            return;
        }

        estancias.forEach(e => {
            const card = document.createElement('div');
            card.className = 'section-box';
            card.style.margin = '0';
            card.innerHTML = `
                <div style="height: 180px; border-radius: 12px; overflow: hidden; margin-bottom: 16px; position: relative;">
                    <img src="${e.imagen || '../FOTOS/EWR.jpeg'}" alt="${e.titulo}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='../FOTOS/EWR.jpeg'">
                    <span class="badge-status ${e.activo !== false ? 'badge-active' : 'badge-inactive'}" style="position: absolute; top: 12px; right: 12px;">
                        ${e.activo !== false ? 'Activo' : 'Inactivo'}
                    </span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; gap: 10px;">
                    <h4 style="font-size: 1.2rem; color: var(--admin-primary); font-family: 'Playfair Display', serif;">${e.titulo}</h4>
                    <strong style="font-size: 1.3rem; color: var(--admin-accent); white-space: nowrap;">$${e.precio.toLocaleString('es-CO')}</strong>
                </div>
                <p style="font-size: 0.88rem; color: #475569; margin-bottom: 14px;">${e.descripcion}</p>
                <div style="background: #f8fafc; padding: 12px; border-radius: 8px; margin-bottom: 16px;">
                    <strong style="font-size: 0.8rem; text-transform: uppercase; color: #64748b;">Incluye:</strong>
                    <ul style="font-size: 0.85rem; color: #334155; margin-left: 18px; margin-top: 6px;">
                        ${(e.incluye || []).map(inc => `<li>${inc}</li>`).join('')}
                    </ul>
                </div>
                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                    <button class="btn-admin-primary" style="flex: 1; justify-content: center;" onclick="AdminApp.editEstancia('${e.id}')">
                        ✏️ Editar
                    </button>
                    <button class="btn-action" onclick="AdminApp.toggleEstanciaStatus('${e.id}')">
                        ${e.activo !== false ? 'Desactivar' : 'Activar'}
                    </button>
                    <button class="btn-action btn-delete" onclick="AdminApp.deleteEstancia('${e.id}')" title="Eliminar opción">
                        🗑️
                    </button>
                </div>
            `;
            container.appendChild(card);
        });
    },

    openEstanciaModal: function() {
        document.getElementById('form-estancia').reset();
        document.getElementById('estancia-id').value = '';
        const titleElem = document.getElementById('modal-estancia-title');
        if (titleElem) titleElem.textContent = 'Agregar Nueva Opción de Estadía';
        document.getElementById('estancia-img-url').value = '';
        document.getElementById('estancia-preview').innerHTML = '<span>Vista previa</span>';
        document.getElementById('estancia-activo').checked = true;
        this.openModal('modal-estancia');
    },

    editEstancia: function(id) {
        const estancias = PozoDB.getEstancia();
        const est = estancias.find(e => e.id === id) || estancias[0];
        if (!est) return;

        document.getElementById('estancia-id').value = est.id;
        document.getElementById('estancia-titulo').value = est.titulo;
        document.getElementById('estancia-precio').value = est.precio;
        document.getElementById('estancia-desc').value = est.descripcion;
        document.getElementById('estancia-incluye').value = (est.incluye || []).join('\n');
        document.getElementById('estancia-img-url').value = est.imagen || '';
        document.getElementById('estancia-activo').checked = est.activo !== false;

        const preview = document.getElementById('estancia-preview');
        if (est.imagen) {
            preview.innerHTML = `<img src="${est.imagen}" alt="Preview">`;
        } else {
            preview.innerHTML = '<span>Sin fotografía</span>';
        }

        const titleElem = document.getElementById('modal-estancia-title');
        if (titleElem) titleElem.textContent = 'Editar: ' + est.titulo;

        this.openModal('modal-estancia');
    },

    toggleEstanciaStatus: function(id) {
        const estancias = PozoDB.getEstancia();
        const est = estancias.find(e => e.id === id);
        if (est) {
            est.activo = !est.activo;
            PozoDB.saveEstancia(est);
            this.renderEstancia();
            this.renderStats();
        }
    },

    deleteEstancia: function(id) {
        if (confirm("¿Seguro que deseas eliminar esta opción de estadía?")) {
            PozoDB.deleteEstancia(id);
            this.renderEstancia();
            this.renderStats();
        }
    },

    // ==========================================
    // SECCIÓN GALERÍA
    // ==========================================
    renderGaleria: function() {
        const grid = document.getElementById('galeria-admin-grid');
        if (!grid) return;
        const fotos = PozoDB.getGaleria();

        grid.innerHTML = '';
        fotos.forEach(f => {
            const card = document.createElement('div');
            card.style.cssText = 'border-radius: 12px; overflow: hidden; background: #fff; box-shadow: var(--admin-shadow); border: 1px solid #e2e8f0; display: flex; flex-direction: column;';
            card.innerHTML = `
                <div style="height: 140px; overflow: hidden; position: relative;">
                    <img src="${f.imagen}" alt="${f.titulo}" style="width: 100%; height: 100%; object-fit: cover;">
                    <span style="position: absolute; top: 8px; right: 8px; background: rgba(6, 59, 54, 0.85); color: #fff; font-size: 0.72rem; padding: 2px 8px; border-radius: 10px; font-weight: 600;">
                        ${f.categoria}
                    </span>
                </div>
                <div style="padding: 12px; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
                    <div>
                        <strong style="font-size: 0.88rem; color: var(--admin-primary); display: block; margin-bottom: 4px;">${f.titulo}</strong>
                        <p style="font-size: 0.76rem; color: #64748b; line-height: 1.3;">${f.descripcion || ''}</p>
                    </div>
                    <div style="margin-top: 10px; display: flex; justify-content: flex-end;">
                        <button class="btn-action btn-delete" onclick="AdminApp.deleteGaleria('${f.id}')" title="Eliminar foto">🗑️ Eliminar</button>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
    },

    openGaleriaModal: function() {
        document.getElementById('form-galeria').reset();
        document.getElementById('galeria-img-url').value = '';
        document.getElementById('galeria-preview').innerHTML = '<span>Selecciona una foto</span>';
        this.openModal('modal-galeria');
    },

    deleteGaleria: function(id) {
        if (confirm("¿Deseas eliminar esta fotografía de la galería?")) {
            PozoDB.deleteGaleria(id);
            this.renderGaleria();
            this.renderStats();
        }
    },

    // ==========================================
    // SECCIÓN INFORMACIÓN TURÍSTICA
    // ==========================================
    loadInfoTuristica: function() {
        const config = PozoDB.getConfig();
        if (!config) return;

        const get = id => document.getElementById(id);
        if (get('info-nombre')) get('info-nombre').value = config.nombre || '';
        if (get('info-lema')) get('info-lema').value = config.lema || '';
        if (get('info-horario')) get('info-horario').value = config.horario || '';
        if (get('info-telefono')) get('info-telefono').value = config.telefono || '';
        if (get('info-whatsapp')) get('info-whatsapp').value = config.whatsapp || '';
        if (get('info-direccion')) get('info-direccion').value = config.direccion || '';
        if (get('info-instagram')) get('info-instagram').value = (config.redes && config.redes.instagram) || '';
        if (get('info-facebook')) get('info-facebook').value = (config.redes && config.redes.facebook) || '';
    },

    // ==========================================
    // FORMULARIOS & SUBIDA DE IMÁGENES
    // ==========================================
    setupForms: function() {
        // Lector de imagen para Comida
        this.bindImageInput('comida-file', 'comida-img-url', 'comida-preview');
        // Lector de imagen para Bebida
        this.bindImageInput('bebida-file', 'bebida-img-url', 'bebida-preview');
        // Lector de imagen para Estancia
        this.bindImageInput('estancia-file', 'estancia-img-url', 'estancia-preview');
        // Lector de imagen para Galería
        this.bindImageInput('galeria-file', 'galeria-img-url', 'galeria-preview');

        // Formulario Comida
        const formComida = document.getElementById('form-comida');
        if (formComida) {
            formComida.addEventListener('submit', (e) => {
                e.preventDefault();
                const comida = {
                    id: document.getElementById('comida-id').value || undefined,
                    nombre: document.getElementById('comida-nombre').value.trim(),
                    categoria: 'comidas',
                    precio: parseInt(document.getElementById('comida-precio').value, 10),
                    descripcion: document.getElementById('comida-desc').value.trim(),
                    imagen: document.getElementById('comida-img-url').value || '../assets/images/fotos de comida/gallina de mesa familiar.jpeg',
                    activo: document.getElementById('comida-activo').checked
                };
                PozoDB.saveComida(comida);
                this.closeModal('modal-comida');
                this.renderComidas();
                this.renderStats();
                alert("Plato guardado correctamente. Los cambios ya son visibles en el sitio web.");
            });
        }

        // Formulario Bebida
        const formBebida = document.getElementById('form-bebida');
        if (formBebida) {
            formBebida.addEventListener('submit', (e) => {
                e.preventDefault();
                const bebida = {
                    id: document.getElementById('bebida-id').value || undefined,
                    nombre: document.getElementById('bebida-nombre').value.trim(),
                    categoria: document.getElementById('bebida-categoria').value,
                    precio: parseInt(document.getElementById('bebida-precio').value, 10),
                    descripcion: document.getElementById('bebida-desc').value.trim(),
                    imagen: document.getElementById('bebida-img-url').value || '../LOGO/LOGO AKUATTA.jpeg',
                    activo: document.getElementById('bebida-activo').checked
                };
                PozoDB.saveBebida(bebida);
                this.closeModal('modal-bebida');
                this.renderBebidas();
                this.renderStats();
                alert("Bebida guardada correctamente. Ya aparece actualizada en la carta pública.");
            });
        }

        // Formulario Estancia
        const formEstancia = document.getElementById('form-estancia');
        if (formEstancia) {
            formEstancia.addEventListener('submit', (e) => {
                e.preventDefault();
                const incluyeLines = document.getElementById('estancia-incluye').value
                    .split('\n')
                    .map(l => l.trim())
                    .filter(l => l.length > 0);

                const estancia = {
                    id: document.getElementById('estancia-id').value || undefined,
                    titulo: document.getElementById('estancia-titulo').value.trim(),
                    precio: parseInt(document.getElementById('estancia-precio').value, 10),
                    periodo: 'por persona / día',
                    descripcion: document.getElementById('estancia-desc').value.trim(),
                    incluye: incluyeLines,
                    imagen: document.getElementById('estancia-img-url').value || '../FOTOS/EWR.jpeg',
                    activo: document.getElementById('estancia-activo').checked
                };
                PozoDB.saveEstancia(estancia);
                this.closeModal('modal-estancia');
                this.renderEstancia();
                this.renderStats();
                alert("Opción de estadía guardada correctamente. Los cambios ya son visibles en el sitio web.");
            });
        }

        // Formulario Galería
        const formGaleria = document.getElementById('form-galeria');
        if (formGaleria) {
            formGaleria.addEventListener('submit', (e) => {
                e.preventDefault();
                const foto = {
                    titulo: document.getElementById('galeria-titulo').value.trim(),
                    categoria: document.getElementById('galeria-categoria').value,
                    descripcion: document.getElementById('galeria-desc').value.trim(),
                    imagen: document.getElementById('galeria-img-url').value || '../FOTOS/EWR.jpeg',
                    activo: true
                };
                PozoDB.saveGaleria(foto);
                this.closeModal('modal-galeria');
                this.renderGaleria();
                this.renderStats();
                alert("Fotografía subida e incorporada a la galería pública.");
            });
        }

        // Formulario Información Turística
        const formInfo = document.getElementById('info-turistica-form');
        if (formInfo) {
            formInfo.addEventListener('submit', (e) => {
                e.preventDefault();
                const config = {
                    nombre: document.getElementById('info-nombre').value.trim(),
                    lema: document.getElementById('info-lema').value.trim(),
                    horario: document.getElementById('info-horario').value.trim(),
                    telefono: document.getElementById('info-telefono').value.trim(),
                    whatsapp: document.getElementById('info-whatsapp').value.trim(),
                    direccion: document.getElementById('info-direccion').value.trim(),
                    redes: {
                        instagram: document.getElementById('info-instagram').value.trim(),
                        facebook: document.getElementById('info-facebook').value.trim(),
                        whatsapp: 'https://wa.me/' + document.getElementById('info-whatsapp').value.trim()
                    }
                };
                PozoDB.saveConfig(config);
                alert("Información turística actualizada correctamente en la web.");
            });
        }

        // Formulario Cambio de Contraseña
        const formPwd = document.getElementById('change-password-form');
        if (formPwd) {
            formPwd.addEventListener('submit', async (e) => {
                e.preventDefault();
                const oldP = document.getElementById('old-password').value;
                const newP = document.getElementById('new-password').value;

                const res = await PozoAuth.changePassword(oldP, newP);
                alert(res.message);
                if (res.success) {
                    formPwd.reset();
                }
            });
        }
    },

    // Compresión y redimensionamiento inteligente por Canvas (Evita saturar la cuota de localStorage)
    compressImage: function(file, maxWidth = 1200, maxHeight = 1200, quality = 0.82) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (readerEvent) => {
                const img = new Image();
                img.onload = () => {
                    let width = img.width;
                    let height = img.height;

                    if (width > maxWidth || height > maxHeight) {
                        if (width > height) {
                            height = Math.round((height * maxWidth) / width);
                            width = maxWidth;
                        } else {
                            width = Math.round((width * maxHeight) / height);
                            height = maxHeight;
                        }
                    }

                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    const dataUrl = canvas.toDataURL('image/jpeg', quality);
                    resolve(dataUrl);
                };
                img.onerror = (err) => reject(err);
                img.src = readerEvent.target.result;
            };
            reader.onerror = (err) => reject(err);
            reader.readAsDataURL(file);
        });
    },

    // Manejar lectura de archivos locales para convertirlos en DataURL persistente y optimizado
    bindImageInput: function(fileInputId, hiddenUrlId, previewWrapId) {
        const fileInput = document.getElementById(fileInputId);
        const hiddenInput = document.getElementById(hiddenUrlId);
        const previewWrap = document.getElementById(previewWrapId);

        if (!fileInput || !hiddenInput || !previewWrap) return;

        fileInput.addEventListener('change', async () => {
            const file = fileInput.files[0];
            if (!file) return;

            // Validación de seguridad de tipo de archivo (Solo imágenes)
            if (!file.type.startsWith('image/')) {
                alert("El archivo seleccionado no es una imagen válida. Por favor selecciona formato JPG, JPEG o PNG.");
                fileInput.value = '';
                return;
            }

            previewWrap.innerHTML = '<span style="color: var(--admin-primary); font-weight: 600;">Procesando y optimizando imagen... ⏳</span>';

            try {
                const optimizedDataUrl = await this.compressImage(file);
                hiddenInput.value = optimizedDataUrl;
                previewWrap.innerHTML = `<img src="${optimizedDataUrl}" alt="Preview" style="width: 100%; height: 100%; object-fit: cover;">`;
            } catch (err) {
                console.error("Error optimizando imagen:", err);
                alert("Hubo un error al procesar la fotografía. Intenta con otra imagen.");
                previewWrap.innerHTML = '<span>Error al cargar fotografía</span>';
            }
        });
    },

    // Modal Helpers
    openModal: function(modalId) {
        const m = document.getElementById(modalId);
        if (m) m.classList.add('show-modal');
    },

    closeModal: function(modalId) {
        const m = document.getElementById(modalId);
        if (m) m.classList.remove('show-modal');
    },

    // Exportar e Importar Backup
    exportData: function() {
        PozoDB.exportBackup();
    },

    importData: function(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const success = PozoDB.importBackup(e.target.result);
            if (success) {
                this.renderAll();
                alert("Copia de seguridad restaurada exitosamente.");
            } else {
                alert("El archivo de respaldo no es válido.");
            }
        };
        reader.readAsText(file);
    },

    resetFactory: function() {
        if (confirm("¿Estás seguro de restablecer todos los productos y fotos a su estado inicial de fábrica?")) {
            PozoDB.resetDB();
            this.renderAll();
            alert("Sistema restablecido correctamente.");
        }
    }
};

window.AdminApp = AdminApp;
