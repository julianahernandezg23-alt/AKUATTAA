/**
 * EL GRAN POZO AZUFRADO (AKUATTA) - MAIN CONTROLLER 2026
 * Renderizado reactivo desde db.js, catálogo gastronómico, estancia, visor lightbox y comentarios.
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Inicializar componentes visuales e interactivos
    initNavbar();
    initHeroSlider();
    initPublicData();
    initMenuFilters();
    initGallery();
    initComments();
    initScrollProgressBar();
    initBackToTop();
    initFaqAccordion();
    initScrollReveal();

    // 2. Reactividad en tiempo real: si el dueño cambia algo en el panel, se actualiza la web
    window.addEventListener('pozo_db_updated', () => {
        initPublicData();
    });

    // Sincronización entre pestañas en tiempo real
    window.addEventListener('storage', (e) => {
        if (!e.key || e.key === 'pozo_azufrado_db_v3') {
            initPublicData();
        }
    });
});

/* ========================================================
   NAVBAR EFFECT & MOBILE MENU
======================================================== */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 40) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('open');
            navLinks.classList.toggle('open');
        });

        // Cerrar al pulsar un enlace
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('open');
                navLinks.classList.remove('open');
            });
        });
    }

    // Active link on scroll
    const sections = document.querySelectorAll("section[id]");
    window.addEventListener("scroll", () => {
        let current = "";
        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            if (window.pageYOffset >= sectionTop - 180) {
                current = section.getAttribute("id");
            }
        });

        if (navLinks) {
            navLinks.querySelectorAll("a").forEach((a) => {
                a.classList.remove("active-link");
                if (a.getAttribute("href") === `#${current}`) {
                    a.classList.add("active-link");
                }
            });
        }
    });
}

/* ========================================================
   HERO SLIDESHOW DINÁMICO
======================================================== */
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length <= 1) return;

    let currentSlide = 0;
    setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 6000);
}

/* ========================================================
   RENDERIZADO DE DATOS PÚBLICOS (COMIDAS, BEBIDAS, ESTANCIA)
======================================================== */
function initPublicData() {
    if (!window.PozoDB) return;

    renderPublicEstancia();
    renderPublicComidas();
    renderPublicBebidas();
    renderPublicGaleria();
    renderPublicConfig();
    initScrollReveal();
}

// 1. ESTANCIA
function renderPublicEstancia() {
    const estancias = PozoDB.getEstancia(true); // solo activas
    const container = document.getElementById('estancia-public-container');
    if (!container || estancias.length === 0) return;

    // Actualizar precios sincronizados en Hero, Ubicación y Footer
    const mainPrice = '$' + estancias[0].precio.toLocaleString('es-CO');
    const heroPriceEl = document.getElementById('hero-estancia-price');
    if (heroPriceEl) heroPriceEl.textContent = mainPrice;

    const locPriceEl = document.getElementById('ubicacion-estancia-price');
    if (locPriceEl) locPriceEl.textContent = `${mainPrice} COP`;

    const footerPriceEl = document.getElementById('footer-estancia-price');
    if (footerPriceEl) footerPriceEl.textContent = mainPrice;

    const waPhone = (PozoDB.getConfig().whatsapp || "573142856899").replace(/\D/g, '');

    container.innerHTML = '';
    estancias.forEach((est, index) => {
        const waText = encodeURIComponent(`Hola, quisiera reservar mi estadía (${est.titulo}) en El Gran Pozo Azufrado por $${est.precio.toLocaleString('es-CO')} COP por persona.`);
        const card = document.createElement('div');
        card.className = `estancia-card ${index === 0 ? 'featured' : ''}`;
        card.innerHTML = `
            <div class="estancia-img-box">
                <img src="${est.imagen || '../FOTOS/EWR.jpeg'}" alt="${est.titulo}" onerror="this.src='../FOTOS/EWR.jpeg'">
                <span class="estancia-badge">${index === 0 ? 'Plan Todo Incluido de Día' : 'Plan Especial'}</span>
            </div>
            <div class="estancia-details">
                <div class="estancia-header-price">
                    <div>
                        <h3>${est.titulo}</h3>
                        <p class="estancia-location">Km 3,5 vía Tocaima - Jerusalén, Cundinamarca</p>
                    </div>
                    <div class="price-box">
                        <span class="price-val">$${est.precio.toLocaleString('es-CO')}</span>
                        <span class="price-unit">${est.periodo || 'por persona'}</span>
                    </div>
                </div>

                <p class="estancia-desc-text">
                    ${est.descripcion}
                </p>

                <div class="estancia-features">
                    <h4>Tu estadía incluye:</h4>
                    <ul class="features-list">
                        ${(est.incluye || []).map(inc => `<li>✨ ${inc}</li>`).join('')}
                    </ul>
                </div>

                <div class="estancia-actions">
                    <a href="https://wa.me/${waPhone}?text=${waText}" target="_blank" rel="noopener noreferrer" class="btn-estancia-book">
                        <span>📲 Reservar Estadía por WhatsApp</span>
                    </a>
                    <a href="#gastronomia" class="btn-estancia-secondary">
                        Ver Menú de Comidas y Bebidas ↓
                    </a>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// 2. COMIDAS
function renderPublicComidas() {
    const grid = document.getElementById('comidas-grid');
    if (!grid) return;
    const comidas = PozoDB.getComidas(true); // solo activas
    const waPhone = (PozoDB.getConfig().whatsapp || "573142856899").replace(/\D/g, '');

    grid.innerHTML = '';
    comidas.forEach(c => {
        const waText = encodeURIComponent(`Hola, me gustaría encargar el plato "${c.nombre}" ($${c.precio.toLocaleString('es-CO')}) para mi visita a El Gran Pozo Azufrado.`);
        const card = document.createElement('div');
        card.className = 'food-card';
        card.innerHTML = `
            <div class="food-card-img-box">
                <img src="${c.imagen}" alt="${c.nombre}" loading="lazy" onerror="this.src='../assets/images/fotos de comida/gallina de mesa familiar.jpeg'">
                ${c.destacado ? '<span class="food-badge-chef">Especialidad</span>' : ''}
            </div>
            <div class="food-card-body">
                <div>
                    <h4 class="food-card-title">${c.nombre}</h4>
                    <p class="food-card-desc">${c.descripcion}</p>
                </div>
                <div class="food-card-footer">
                    <span class="food-price">$${c.precio.toLocaleString('es-CO')}</span>
                    <a href="https://wa.me/${waPhone}?text=${waText}" target="_blank" rel="noopener noreferrer" class="btn-order-dish">
                        Pedir 📲
                    </a>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// 3. BEBIDAS
function renderPublicBebidas(categoriaFiltro = 'all') {
    const grid = document.getElementById('bebidas-grid');
    if (!grid) return;
    let bebidas = PozoDB.getBebidas(true); // solo activas
    const waPhone = (PozoDB.getConfig().whatsapp || "573142856899").replace(/\D/g, '');

    if (categoriaFiltro !== 'all') {
        bebidas = bebidas.filter(b => b.categoria === categoriaFiltro);
    }

    grid.innerHTML = '';
    bebidas.forEach(b => {
        const waText = encodeURIComponent(`Hola, me gustaría pedir la bebida "${b.nombre}" ($${b.precio.toLocaleString('es-CO')}) en El Gran Pozo Azufrado.`);
        const card = document.createElement('div');
        card.className = 'drink-card';
        card.dataset.category = b.categoria;
        card.innerHTML = `
            <div class="drink-thumb-wrap">
                <img src="${b.imagen}" alt="${b.nombre}" loading="lazy" onerror="this.src='../LOGO/LOGO AKUATTA.jpeg'">
            </div>
            <h4 class="drink-title">${b.nombre}</h4>
            <p class="drink-desc">${b.descripcion || ''}</p>
            <span class="drink-price">$${b.precio.toLocaleString('es-CO')}</span>
            <a href="https://wa.me/${waPhone}?text=${waText}" target="_blank" rel="noopener noreferrer" class="btn-order-dish" style="width: 100%; text-align: center;">
                Pedir Helada 🥤
            </a>
        `;
        grid.appendChild(card);
    });
}

// 4. CONFIGURACIÓN TURÍSTICA & CONTACTO
function renderPublicConfig() {
    const cfg = PozoDB.getConfig();
    if (!cfg) return;

    const set = (id, val) => {
        const el = document.getElementById(id);
        if (el && val) el.textContent = val;
    };

    set('loc-display-nombre', cfg.nombre);
    set('loc-display-direccion', cfg.direccion);
    set('loc-display-horario', cfg.horario);
    set('loc-display-telefono', cfg.telefono);
}

/* ========================================================
   FILTRADO INTERACTIVO DEL MENÚ (TABS & SUBFILTROS)
======================================================== */
function initMenuFilters() {
    const mainTabs = document.querySelectorAll('.menu-tab-btn');
    const comidasWrap = document.getElementById('comidas-section-wrap');
    const bebidasWrap = document.getElementById('bebidas-section-wrap');
    const drinksSubfilters = document.getElementById('drinks-subfilters');

    mainTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            mainTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const selected = tab.dataset.tab;
            if (selected === 'all') {
                if (comidasWrap) comidasWrap.style.display = 'block';
                if (bebidasWrap) bebidasWrap.style.display = 'block';
                if (drinksSubfilters) drinksSubfilters.style.display = 'flex';
            } else if (selected === 'comidas') {
                if (comidasWrap) comidasWrap.style.display = 'block';
                if (bebidasWrap) bebidasWrap.style.display = 'none';
                if (drinksSubfilters) drinksSubfilters.style.display = 'none';
            } else if (selected === 'bebidas') {
                if (comidasWrap) comidasWrap.style.display = 'none';
                if (bebidasWrap) bebidasWrap.style.display = 'block';
                if (drinksSubfilters) drinksSubfilters.style.display = 'flex';
            }
        });
    });

    // Subfiltros de Bebidas
    const subPills = document.querySelectorAll('.subfilter-pill');
    subPills.forEach(pill => {
        pill.addEventListener('click', () => {
            subPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            renderPublicBebidas(pill.dataset.cat);
        });
    });
}

/* ========================================================
   GALERÍA & VISOR LIGHTBOX MEJORADO
======================================================== */
function renderPublicGaleria(filter = 'all') {
    const masonry = document.getElementById('gallery-grid-dynamic');
    if (!masonry) return;
    let fotos = PozoDB.getGaleria(true); // solo activas

    if (filter !== 'all') {
        fotos = fotos.filter(f => f.categoria === filter);
    }

    masonry.innerHTML = '';
    fotos.forEach((f, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-card-item';
        item.dataset.category = f.categoria;
        item.dataset.index = index;
        item.innerHTML = `
            <img src="${f.imagen}" alt="${f.titulo}" loading="lazy" onerror="this.src='../FOTOS/EWR.jpeg'">
            <div class="gallery-overlay-hover">
                <strong class="gallery-hover-title">${f.titulo}</strong>
                <p class="gallery-hover-desc">${f.descripcion || ''}</p>
            </div>
        `;

        item.addEventListener('click', () => {
            openLightbox(fotos, index);
        });

        masonry.appendChild(item);
    });
}

function initGallery() {
    const chips = document.querySelectorAll('.gallery-chip');
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            renderPublicGaleria(chip.dataset.filter);
        });
    });
}

// LIGHTBOX MODAL CON SOPORTE TÁCTIL Y FLECHAS
function openLightbox(fotoList, startIndex) {
    if (!fotoList || fotoList.length === 0) return;
    let currentIndex = startIndex;

    const existing = document.getElementById('lightbox');
    if (existing) existing.remove();

    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <button class="lightbox-btn lightbox-close" aria-label="Cerrar">&times;</button>
            <button class="lightbox-btn lightbox-prev" aria-label="Anterior">&#10094;</button>
            <img id="lightbox-img" src="${fotoList[currentIndex].imagen}" alt="${fotoList[currentIndex].titulo}">
            <button class="lightbox-btn lightbox-next" aria-label="Siguiente">&#10095;</button>
            <div class="lightbox-counter">${currentIndex + 1} / ${fotoList.length} - ${fotoList[currentIndex].titulo}</div>
        </div>
    `;

    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';

    const imgElem = lightbox.querySelector('#lightbox-img');
    const counterElem = lightbox.querySelector('.lightbox-counter');

    function update() {
        imgElem.style.opacity = '0.3';
        setTimeout(() => {
            imgElem.src = fotoList[currentIndex].imagen;
            counterElem.textContent = `${currentIndex + 1} / ${fotoList.length} - ${fotoList[currentIndex].titulo}`;
            imgElem.style.opacity = '1';
        }, 150);
    }

    lightbox.querySelector('.lightbox-prev').addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex - 1 + fotoList.length) % fotoList.length;
        update();
    });

    lightbox.querySelector('.lightbox-next').addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex + 1) % fotoList.length;
        update();
    });

    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
            closeLightbox();
        }
    });

    // Teclas Escape y flechas
    function handleKey(e) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') {
            currentIndex = (currentIndex - 1 + fotoList.length) % fotoList.length;
            update();
        }
        if (e.key === 'ArrowRight') {
            currentIndex = (currentIndex + 1) % fotoList.length;
            update();
        }
    }
    document.addEventListener('keydown', handleKey);

    // Swipe en móviles
    let touchX = 0;
    imgElem.addEventListener('touchstart', (e) => {
        touchX = e.changedTouches[0].screenX;
    }, { passive: true });

    imgElem.addEventListener('touchend', (e) => {
        const diff = touchX - e.changedTouches[0].screenX;
        if (diff > 45) { // Deslizar izquierda
            currentIndex = (currentIndex + 1) % fotoList.length;
            update();
        } else if (diff < -45) { // Deslizar derecha
            currentIndex = (currentIndex - 1 + fotoList.length) % fotoList.length;
            update();
        }
    }, { passive: true });

    function closeLightbox() {
        lightbox.remove();
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleKey);
    }
}

/* ========================================================
   SISTEMA DE COMENTARIOS (CONSERVADO & MEJORADO)
======================================================== */
function initComments() {
    const commentsForm = document.getElementById('comments-form');
    const commentsList = document.getElementById('comments-list');

    const seedComments = [
        {
            id: 1,
            name: "María Camila Restrepo",
            message: "¡Un lugar increíble! Las albercas de agua azufrada son sumamente relajantes y sales con una energía totalmente renovada. El lodo medicinal es excelente para la piel. ¡Súper recomendado!",
            date: "24 de mayo de 2026, 14:30"
        },
        {
            id: 2,
            name: "Carlos Mario Buendía",
            message: "Excelente ambiente ecológico y de descanso. Muy recomendado para ir en familia a desconectarse el fin de semana. La comida de leña es espectacular, especialmente la gallina.",
            date: "26 de mayo de 2026, 11:15"
        }
    ];

    let comments = JSON.parse(localStorage.getItem("pozo_comments"));
    if (!comments) {
        comments = seedComments;
        localStorage.setItem("pozo_comments", JSON.stringify(comments));
    }

    function renderComments() {
        if (!commentsList) return;
        commentsList.innerHTML = "";

        comments.forEach(c => {
            const div = document.createElement("div");
            div.className = "comment-item";
            div.innerHTML = `
                <div class="comment-header">
                    <span class="comment-author">👤 ${c.name}</span>
                    <span class="comment-date">📅 ${c.date}</span>
                </div>
                <p class="comment-text">${c.message}</p>
            `;
            commentsList.appendChild(div);
        });
    }

    renderComments();

    if (commentsForm) {
        commentsForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const nameInput = document.getElementById("comment-name");
            const emailInput = document.getElementById("comment-email");
            const messageInput = document.getElementById("comment-message");
            const submitBtn = commentsForm.querySelector(".btn-submit-comment");

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const message = messageInput.value.trim();

            if (!name || !email || !message) return;

            const now = new Date();
            const dateStr = now.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) + `, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

            const newComment = { id: Date.now(), name, message, date: dateStr };

            submitBtn.disabled = true;
            submitBtn.innerHTML = "Enviando... ⏳";

            // Guardar localmente
            comments.unshift(newComment);
            localStorage.setItem("pozo_comments", JSON.stringify(comments));
            renderComments();
            commentsForm.reset();

            // Enviar notificación FormSubmit en segundo plano
            fetch("https://formsubmit.co/ajax/julianahernandezg23@gmail.com", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify({ Nombre: name, Email: email, Mensaje: message, Fecha: dateStr })
            })
            .catch(() => {})
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = "<span>Publicar Comentario ✨</span>";
                showToast("¡Gracias por tu comentario! Se ha publicado exitosamente.");
            });
        });
    }
}

/* ========================================================
   SISTEMA DE TOAST NOTIFICATIONS
======================================================== */
function showToast(message, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${type === 'success' ? '✨' : '⚠️'}</span>
        <span class="toast-message">${message}</span>
    `;

    container.appendChild(toast);
    toast.offsetHeight;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

/* ========================================================
   BARRA DE PROGRESO DE LECTURA (SCROLL PROGRESS BAR)
======================================================== */
function initScrollProgressBar() {
    const bar = document.getElementById('scroll-progress-bar');
    if (!bar) return;

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        bar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }, { passive: true });
}

/* ========================================================
   BOTÓN VOLVER ARRIBA (BACK TO TOP)
======================================================== */
function initBackToTop() {
    const btn = document.getElementById('btn-back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 350) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ========================================================
   ACORDEÓN INTERACTIVO DE PREGUNTAS FRECUENTES (FAQ)
======================================================== */
function initFaqAccordion() {
    const accordion = document.getElementById('faq-accordion');
    if (!accordion) return;

    const items = accordion.querySelectorAll('.faq-item');
    items.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        if (!questionBtn) return;

        questionBtn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Cierra los demás items para efecto acordeón limpio
            items.forEach(otherItem => {
                otherItem.classList.remove('active');
                const otherBtn = otherItem.querySelector('.faq-question');
                if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
            });

            // Si no estaba activo, lo abre
            if (!isActive) {
                item.classList.add('active');
                questionBtn.setAttribute('aria-expanded', 'true');
            }
        });
    });
}

/* ========================================================
   SCROLL REVEAL SUAVE (INTERSECTION OBSERVER)
======================================================== */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal:not(.reveal-visible)');
    if (reveals.length === 0) return;

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            rootMargin: '0px 0px -30px 0px',
            threshold: 0.08
        });

        reveals.forEach(el => observer.observe(el));
    } else {
        // Fallback inmediato para navegadores antiguos
        reveals.forEach(el => el.classList.add('reveal-visible'));
    }
}