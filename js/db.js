/**
 * EL GRAN POZO AZUFRADO - MOTOR DE DATOS & PERSISTENCIA (db.js)
 * Sistema de almacenamiento persistente autónomo para la página pública y el panel del dueño.
 */

const DB_KEY = 'pozo_azufrado_db_v3';
const AUTH_KEY = 'pozo_azufrado_auth_session';

// Datos iniciales semilla con la información 100% real del proyecto
const DEFAULT_DATABASE = {
    config: {
        nombre: "El Gran Pozo Azufrado Akuatta",
        lema: "Bienestar natural, aguas termales y tradición ancestral en Tocaima",
        descripcion: "Santuario ecoterapéutico de descanso reconocido por las propiedades medicinales de sus aguas azufradas protermales y lodo ancestral.",
        direccion: "Km 3,5 vía Tocaima - Jerusalén, vereda Acuatá, Tocaima, Cundinamarca",
        horario: "Lunes a Domingo: 8:30 AM - 5:00 PM",
        telefono: "+57 314 285 6899",
        whatsapp: "573142856899",
        email: "info@elgranpozoazufrado.com",
        parqueadero: "Gratuito y vigilado",
        redes: {
            facebook: "https://www.facebook.com/share/1GxsBGtL6g/",
            instagram: "https://www.instagram.com/akuattatoc?igsh=dDNrbjV1NmwxdjBr",
            whatsapp: "https://wa.me/573142856899"
        }
    },
    estancia: [
        {
            id: "est-1",
            titulo: "Estadía Campestre de Bienestar",
            precio: 35000,
            periodo: "por persona / día",
            descripcion: "Disfruta de una jornada completa de desconexión, salud y relajación en un entorno 100% natural.",
            incluye: [
                "Acceso libre a las albercas de aguas azufradas terapéuticas",
                "Aplicación de lodo medicinal ancestral en zona de barro",
                "Uso de zonas de descanso, quioscos y hamacas campestres",
                "Parqueadero privado y vigilado gratuito",
                "Senderos verdes y avistamiento de fauna y flora local"
            ],
            imagen: "../FOTOS/EWR.jpeg",
            destacado: true,
            activo: true
        }
    ],
    comidas: [
        {
            id: "com-1",
            nombre: "Gallina de Mesa Familiar",
            categoria: "comidas",
            precio: 85000,
            descripcion: "Preparada al horno de leña artesanal, servida sobre hoja de plátano con papa, yuca dorada, ají y hogao criollo tradicional.",
            imagen: "../assets/images/fotos de comida/gallina de mesa familiar.jpeg",
            destacado: true,
            activo: true
        },
        {
            id: "com-2",
            nombre: "Media Gallina Autóctona",
            categoria: "comidas",
            precio: 45000,
            descripcion: "Preparación tradicional guisada o al horno con hierbas del huerto y cocinada a fuego lento con salsa criolla de la casa.",
            imagen: "../assets/images/fotos de comida/WhatsApp Image 2026-09-07 at 4.15.35 PM.jpeg",
            destacado: false,
            activo: true
        },
        {
            id: "com-3",
            nombre: "Lomo Gallina Tradicional",
            categoria: "comidas",
            precio: 38000,
            descripcion: "Corte especial salteado con pimentón, cebolla y tomates frescos, acompañado de papas crocantes y arroz blanco.",
            imagen: "../assets/images/fotos de comida/WhatsApp Image 2026-09-07 at 4.15.35 PM (1).jpeg",
            destacado: false,
            activo: true
        },
        {
            id: "com-4",
            nombre: "Sobrebarriga Criolla al Horno",
            categoria: "comidas",
            precio: 42000,
            descripcion: "Cocción lenta en horno artesanal para lograr la máxima textura tierna y jugosa, sazonada con finas hierbas.",
            imagen: "../assets/images/fotos de comida/WhatsApp Image 2026-09-07 at 5.06.19 PM.jpeg",
            destacado: true,
            activo: true
        },
        {
            id: "com-5",
            nombre: "Costillas al Fuego Lento",
            categoria: "comidas",
            precio: 48000,
            descripcion: "Carne suave asada con bañado especial de la casa, servida en tabla con papas criollas doradas.",
            imagen: "../assets/images/fotos de comida/WhatsApp Image 2026-09-07 at 4.30.12 PM (1).jpeg",
            destacado: true,
            activo: true
        },
        {
            id: "com-6",
            nombre: "Lomo de Cerdo",
            categoria: "comidas",
            precio: 39000,
            descripcion: "Asado al punto óptimo a la plancha, servido con plátano maduro asado, guacamole, arroz y ensalada fresca.",
            imagen: "../assets/images/fotos de comida/WhatsApp Image 2026-09-07 at 4.30.12 PM.jpeg",
            destacado: false,
            activo: true
        },
        {
            id: "com-7",
            nombre: "Pernil de la Casa",
            categoria: "comidas",
            precio: 37000,
            descripcion: "Especialidad tradicional dorada al horno y aromatizada con romero campesino y condimentos autóctonos.",
            imagen: "../assets/images/fotos de comida/WhatsApp Image 2026-09-07 at 4.33.55 PM.jpeg",
            destacado: false,
            activo: true
        },
        {
            id: "com-8",
            nombre: "Pechuga a la Plancha",
            categoria: "comidas",
            precio: 32000,
            descripcion: "Jugosa pechuga a las finas hierbas servida con abundantes papas a la francesa, rodajas de aguacate y ensalada.",
            imagen: "../assets/images/fotos de comida/WhatsApp Image 2026-09-07 at 4.32.43 PM.jpeg",
            destacado: false,
            activo: true
        }
    ],
    bebidas: [
        // GASEOSAS
        {
            id: "beb-1",
            nombre: "Coca-Cola Original 600ml",
            categoria: "gaseosas",
            precio: 4000,
            descripcion: "Refrescante sabor original bien fría.",
            imagen: "../assets/images/fotos de bebidas/gaseosas/WhatsApp Image 2026-09-03 at 8.17.26 PM.jpeg",
            activo: true
        },
        {
            id: "beb-2",
            nombre: "Pepsi 600ml",
            categoria: "gaseosas",
            precio: 4000,
            descripcion: "Gaseosa refrescante helada.",
            imagen: "../assets/images/fotos de bebidas/gaseosas/WhatsApp Image 2026-09-03 at 8.18.40 PM.jpeg",
            activo: true
        },
        {
            id: "beb-3",
            nombre: "Colombiana La Nuestra 600ml",
            categoria: "gaseosas",
            precio: 4000,
            descripcion: "El sabor tradicional de Colombia.",
            imagen: "../assets/images/fotos de bebidas/gaseosas/WhatsApp Image 2026-09-03 at 8.19.44 PM.jpeg",
            activo: true
        },
        {
            id: "beb-4",
            nombre: "Sprite 600ml",
            categoria: "gaseosas",
            precio: 4000,
            descripcion: "Gaseosa lima-limón helada.",
            imagen: "../assets/images/fotos de bebidas/gaseosas/WhatsApp Image 2026-09-03 at 8.20.18 PM.jpeg",
            activo: true
        },
        // AGUAS E HIDRATACIÓN
        {
            id: "beb-5",
            nombre: "Agua Brisa Natural 600ml",
            categoria: "aguas",
            precio: 3000,
            descripcion: "Agua pura tratada sin gas.",
            imagen: "../assets/images/fotos de bebidas/aguas/WhatsApp Image 2026-09-03 at 8.33.03 PM.jpeg",
            activo: true
        },
        {
            id: "beb-6",
            nombre: "Agua Brisa con Gas 600ml",
            categoria: "aguas",
            precio: 3500,
            descripcion: "Agua con burbujas y gas refrescante.",
            imagen: "../assets/images/fotos de bebidas/aguas/WhatsApp Image 2026-09-03 at 8.33.52 PM.jpeg",
            activo: true
        },
        {
            id: "beb-7",
            nombre: "Té Blanco Hatsu Mangostino",
            categoria: "aguas",
            precio: 5500,
            descripcion: "Té blanco premium frío y aromático.",
            imagen: "../assets/images/fotos de bebidas/aguas/WhatsApp Image 2026-09-07 at 4.04.53 PM.jpeg",
            activo: true
        },
        {
            id: "beb-8",
            nombre: "Suero Electrolit Coco 625ml",
            categoria: "aguas",
            precio: 8000,
            descripcion: "Solución de electrolitos orales rehidratante.",
            imagen: "../assets/images/fotos de bebidas/aguas/WhatsApp Image 2026-09-07 at 4.09.09 PM.jpeg",
            activo: true
        },
        // JUGOS NATURALES
        {
            id: "beb-9",
            nombre: "Jugo Natural de Mango Fruto",
            categoria: "jugos",
            precio: 7000,
            descripcion: "Jugo con pulpa de mango 100% natural en agua o leche.",
            imagen: "../assets/images/fotos de bebidas/jugos naturales/WhatsApp Image 2026-09-07 at 4.11.50 PM.jpeg",
            activo: true
        },
        {
            id: "beb-10",
            nombre: "Jugo de Lulo del Campo",
            categoria: "jugos",
            precio: 7000,
            descripcion: "El ácido perfecto y refrescante del lulo tradicional.",
            imagen: "../assets/images/fotos de bebidas/jugos naturales/WhatsApp Image 2026-09-07 at 4.13.01 PM.jpeg",
            activo: true
        },
        {
            id: "beb-11",
            nombre: "Jugo de Maracuyá Silvestre",
            categoria: "jugos",
            precio: 7000,
            descripcion: "Maracuyá fresca cosechada en la región del Alto Magdalena.",
            imagen: "../assets/images/fotos de bebidas/jugos naturales/WhatsApp Image 2026-09-07 at 4.15.25 PM.jpeg",
            activo: true
        },
        {
            id: "beb-12",
            nombre: "Jugo de Fresa Natural",
            categoria: "jugos",
            precio: 8000,
            descripcion: "Fresas seleccionadas preparadas al instante bien frías.",
            imagen: "../assets/images/fotos de bebidas/jugos naturales/WhatsApp Image 2026-09-07 at 4.19.20 PM.jpeg",
            activo: true
        },
        // CERVEZAS FRÍAS
        {
            id: "beb-13",
            nombre: "Cerveza Águila Original",
            categoria: "cervezas",
            precio: 6000,
            descripcion: "Cerveza rubia clásica bien fría.",
            imagen: "../assets/images/fotos de bebidas/cervezas/WhatsApp Image 2026-09-07 at 4.21.15 PM.jpeg",
            activo: true
        },
        {
            id: "beb-14",
            nombre: "Cerveza Poker Helada",
            categoria: "cervezas",
            precio: 6000,
            descripcion: "El amigo de todos los encuentros bajo el sol.",
            imagen: "../assets/images/fotos de bebidas/cervezas/WhatsApp Image 2026-09-07 at 4.22.14 PM.jpeg",
            activo: true
        },
        {
            id: "beb-15",
            nombre: "Cerveza Club Colombia Dorada",
            categoria: "cervezas",
            precio: 8000,
            descripcion: "Cerveza tipo lager premium de gran cuerpo.",
            imagen: "../assets/images/fotos de bebidas/cervezas/WhatsApp Image 2026-09-07 at 4.22.45 PM.jpeg",
            activo: true
        },
        {
            id: "beb-16",
            nombre: "Cerveza Corona Extra",
            categoria: "cervezas",
            precio: 10000,
            descripcion: "Importada servida helada con rodaja de limón.",
            imagen: "../assets/images/fotos de bebidas/cervezas/WhatsApp Image 2026-09-07 at 4.23.33 PM.jpeg",
            activo: true
        }
    ],
    galeria: [
        // ==========================================
        // 🎭 CULTURA & PATRIMONIO (PRIORIDAD MÁXIMA)
        // ==========================================
        { id: "cul-1", titulo: "Árbol del Amor y Tradición de Barro", categoria: "cultura", imagen: "../assets/images/cultura/WhatsApp Image 2026-09-07 at 7.15.21 PM (1).jpeg", descripcion: "Visitantes en el emblemático Árbol del Amor con lodo medicinal.", activo: true },
        { id: "cul-2", titulo: "Escultura Ancestral Acatá", categoria: "cultura", imagen: "../assets/images/cultura/WhatsApp Image 2026-09-07 at 7.15.22 PM.jpeg", descripcion: "Monumento a la deidad Acatá con vasijas ceremoniales de arcilla.", activo: true },
        { id: "cul-3", titulo: "Árbol Centenario y Lodoterapia", categoria: "cultura", imagen: "../assets/images/cultura/WhatsApp Image 2026-09-07 at 7.15.20 PM (1).jpeg", descripcion: "Tradición y conexión espiritual en los árboles sagrados de la reserva.", activo: true },
        { id: "cul-4", titulo: "Sendero del Árbol Centenario", categoria: "cultura", imagen: "../assets/images/cultura/WhatsApp Image 2026-09-07 at 7.15.20 PM.jpeg", descripcion: "Entorno natural y árboles patrimoniales de Tocaima.", activo: true },
        { id: "cul-5", titulo: "Monumento El Árbol del Amor", categoria: "cultura", imagen: "../assets/images/cultura/WhatsApp Image 2026-09-07 at 7.15.21 PM.jpeg", descripcion: "Símbolo de unión y cariño de los visitantes en Los Pozos Azufrados.", activo: true },
        { id: "cul-6", titulo: "Fósil Amonite Arqueológico", categoria: "cultura", imagen: "../assets/images/cultura/img10.jpeg", descripcion: "Vestigio geológico prehistórico hallado en la cuenca de Tocaima.", activo: true },
        { id: "cul-7", titulo: "Petroglifo con Simbología Precolombina", categoria: "cultura", imagen: "../assets/images/cultura/img2.jpeg", descripcion: "Mural y mosaico con iconografía indígena ancestral.", activo: true },
        { id: "cul-8", titulo: "Vasijas y Alfarería Autóctona", categoria: "cultura", imagen: "../assets/images/cultura/img4.jpeg", descripcion: "Cerámica tradicional de barro cocido elaborada por artesanos.", activo: true },
        { id: "cul-9", titulo: "Portal Árbol del Amor", categoria: "cultura", imagen: "../assets/images/cultura/WhatsApp Image 2026-05-28 at 3.01.15 AM.jpeg", descripcion: "Bancos y corazón representativo para fotos conmemorativas.", activo: true },
        { id: "cul-10", titulo: "Escultura y Patrimonio Cultural", categoria: "cultura", imagen: "../assets/images/cultura/WhatsApp Image 2026-05-28 at 3.01.15 AM (1).jpeg", descripcion: "Arte y figuras escultóricas representativas de la región.", activo: true },
        { id: "cul-11", titulo: "Elemento Tradicional Indígena", categoria: "cultura", imagen: "../assets/images/cultura/WhatsApp Image 2026-05-28 at 3.01.15 AM (2).jpeg", descripcion: "Representaciones del legado aborigen Guacaná.", activo: true },
        { id: "cul-12", titulo: "Esculturas en Piedra Natural", categoria: "cultura", imagen: "../assets/images/cultura/WhatsApp Image 2026-05-28 at 3.01.16 AM.jpeg", descripcion: "Arte en roca integrado armónicamente en el paisaje.", activo: true },
        { id: "cul-13", titulo: "Petroglifos Ancestrales", categoria: "cultura", imagen: "../assets/images/cultura/WhatsApp Image 2026-05-28 at 3.01.16 AM (2).jpeg", descripcion: "Grabados rupestres y memoria histórica de la zona.", activo: true },
        { id: "cul-14", titulo: "Monumento Histórico de la Reserva", categoria: "cultura", imagen: "../assets/images/cultura/WhatsApp Image 2026-05-28 at 3.01.16 AM (3).jpeg", descripcion: "Puntos de memoria y tributo a los fundadores y ancestros.", activo: true },
        { id: "cul-15", titulo: "Mural y Escultura de Piedra", categoria: "cultura", imagen: "../assets/images/cultura/WhatsApp Image 2026-05-28 at 3.01.17 AM.jpeg", descripcion: "Diseños tallados a mano que decoran los senderos.", activo: true },
        { id: "cul-16", titulo: "Fuente y Monumento Artesanal", categoria: "cultura", imagen: "../assets/images/cultura/WhatsApp Image 2026-05-28 at 3.01.17 AM (1).jpeg", descripcion: "Fuente de piedra conmemorativa del manantial azufrado.", activo: true },
        { id: "cul-17", titulo: "Arte Rupestre y Grabados", categoria: "cultura", imagen: "../assets/images/cultura/WhatsApp Image 2026-05-28 at 3.01.17 AM (2).jpeg", descripcion: "Grabados tallados en lajas de roca nativa.", activo: true },
        { id: "cul-18", titulo: "Escultura de Deidad Aborigen", categoria: "cultura", imagen: "../assets/images/cultura/WhatsApp Image 2026-05-28 at 3.01.18 AM.jpeg", descripcion: "Tributo escultórico a las divinidades del agua y la tierra.", activo: true },
        { id: "cul-19", titulo: "Petroglifo Detallado", categoria: "cultura", imagen: "../assets/images/cultura/WhatsApp Image 2026-05-28 at 3.01.18 AM (1).jpeg", descripcion: "Detalles finos de incisiones precolombinas.", activo: true },
        { id: "cul-20", titulo: "Vasija de Barro Arqueológica", categoria: "cultura", imagen: "../assets/images/cultura/WhatsApp Image 2026-05-28 at 3.01.18 AM (2).jpeg", descripcion: "Recipiente ceremonial empleado en la tradición del barro.", activo: true },
        { id: "cul-21", titulo: "Petroglifos en Roca Sagrada", categoria: "cultura", imagen: "../assets/images/cultura/WhatsApp Image 2026-05-28 at 3.01.18 AM (3).jpeg", descripcion: "Grabados en piedra conservados en los senderos.", activo: true },
        { id: "cul-22", titulo: "Estela con Historia Aborigen", categoria: "cultura", imagen: "../assets/images/cultura/WhatsApp Image 2026-05-28 at 3.01.18 AM (4).jpeg", descripcion: "Monumento con grabados y simbología indígena.", activo: true },
        { id: "cul-23", titulo: "Tótem Precolombino Tallado", categoria: "cultura", imagen: "../assets/images/cultura/WhatsApp Image 2026-05-28 at 3.01.19 AM.jpeg", descripcion: "Pilar tallado que custodia el paso a las albercas.", activo: true },
        { id: "cul-24", titulo: "Pilar Conmemorativo Guacaná", categoria: "cultura", imagen: "../assets/images/cultura/WhatsApp Image 2026-05-28 at 3.01.19 AM (1).jpeg", descripcion: "Monumento en honor a las tradiciones milenarias.", activo: true },
        { id: "cul-25", titulo: "Cerámica Tradicional Campesina", categoria: "cultura", imagen: "../assets/images/cultura/WhatsApp Image 2026-05-28 at 3.01.21 AM (1).jpeg", descripcion: "Olla de barro tradicional para cocciones y agua medicinal.", activo: true },
        { id: "cul-26", titulo: "Figuras Zoomorfas Precolombinas", categoria: "cultura", imagen: "../assets/images/cultura/WhatsApp Image 2026-05-28 at 3.01.21 AM (2).jpeg", descripcion: "Representaciones de animales sagrados de la fauna local.", activo: true },
        { id: "cul-27", titulo: "Petroglifo Solar de Tocaima", categoria: "cultura", imagen: "../assets/images/cultura/WhatsApp Image 2026-05-28 at 3.01.21 AM (3).jpeg", descripcion: "Símbolos del sol y los manantiales de agua mineral.", activo: true },
        { id: "cul-28", titulo: "Sendero Cultural Interpretativo", categoria: "cultura", imagen: "../assets/images/cultura/WhatsApp Image 2026-05-28 at 3.01.22 AM (1).jpeg", descripcion: "Caminos con esculturas e información histórica del lugar.", activo: true },
        { id: "cul-29", titulo: "Mosaicos de Piedra Ancestral", categoria: "cultura", imagen: "../assets/images/cultura/WhatsApp Image 2026-05-28 at 3.01.23 AM (1).jpeg", descripcion: "Murales artísticos de piedras de río y cuarzo.", activo: true },
        { id: "cul-30", titulo: "Escultura Mística en Piedra", categoria: "cultura", imagen: "../assets/images/cultura/WhatsApp Image 2026-05-28 at 3.01.23 AM (3).jpeg", descripcion: "Talla ornamental que resalta la identidad de la reserva.", activo: true },
        { id: "cul-31", titulo: "Portal de Simbología Ancestral", categoria: "cultura", imagen: "../assets/images/cultura/WhatsApp Image 2026-05-28 at 3.01.24 AM (1).jpeg", descripcion: "Acceso ornamentado con elementos autóctonos de Cundinamarca.", activo: true },

        // ==========================================
        // 🎯 RECREACIÓN (PRIORIDAD MÁXIMA)
        // ==========================================
        { id: "rec-1", titulo: "Baño y Recreación Familiar en Piscina", categoria: "recreacion", imagen: "../assets/images/recreacion/WhatsApp Image 2026-09-07 at 7.15.24 PM.jpeg", descripcion: "Visitantes disfrutando del agua cristalina y la cascada.", activo: true },
        { id: "rec-2", titulo: "Piscina Recreativa y Cascada de Piedra", categoria: "recreacion", imagen: "../assets/images/recreacion/WhatsApp Image 2026-09-07 at 7.15.23 PM (1).jpeg", descripcion: "Diseño elegante con muro de piedra y palmeras.", activo: true },
        { id: "rec-3", titulo: "Piscina Iluminada al Atardecer", categoria: "recreacion", imagen: "../assets/images/recreacion/WhatsApp Image 2026-09-07 at 7.15.24 PM (1).jpeg", descripcion: "Tranquilidad y reflejos al caer la tarde.", activo: true },
        { id: "rec-4", titulo: "Solárium y Muro de Roca Natural", categoria: "recreacion", imagen: "../assets/images/recreacion/WhatsApp Image 2026-09-07 at 7.15.23 PM.jpeg", descripcion: "Zona amplia para tomar el sol y relajarse.", activo: true },
        { id: "rec-5", titulo: "Pozo Azufrado para Relajación", categoria: "recreacion", imagen: "../assets/images/recreacion/img1.jpeg", descripcion: "Alberca mineralizada perfecta para inmersión relajante.", activo: true },
        { id: "rec-6", titulo: "Piscina Recreativa Familiar y Tobogán", categoria: "recreacion", imagen: "../assets/images/recreacion/img3.jpeg", descripcion: "Diversión para niños y adultos en un ambiente seguro.", activo: true },
        { id: "rec-7", titulo: "Poza Natural de Inmersión", categoria: "recreacion", imagen: "../assets/images/recreacion/img6.jpeg", descripcion: "Agua fresca de vertiente rodeada de vegetación nativa.", activo: true },
        { id: "rec-8", titulo: "Sendero Recreativo y Paseo Ecológico", categoria: "recreacion", imagen: "../assets/images/recreacion/img8.jpg", descripcion: "Caminatas al aire libre entre senderos campestres.", activo: true },
        { id: "rec-9", titulo: "Actividades al Aire Libre", categoria: "recreacion", imagen: "../assets/images/recreacion/img9.jpg", descripcion: "Espacios de esparcimiento en contacto con la naturaleza.", activo: true },
        { id: "rec-10", titulo: "Esparcimiento de Visitantes", categoria: "recreacion", imagen: "../assets/images/recreacion/WhatsApp Image 2026-05-28 at 3.01.16 AM (1).jpeg", descripcion: "Grupos y familias disfrutando de las albercas al aire libre.", activo: true },
        { id: "rec-11", titulo: "Pozo de Flotación Mineral", categoria: "recreacion", imagen: "../assets/images/recreacion/WhatsApp Image 2026-05-28 at 3.01.20 AM (2).jpeg", descripcion: "Aguas con alta densidad mineral para flotar sin esfuerzo.", activo: true },
        { id: "rec-12", titulo: "Poza Esmeralda y Palmeras", categoria: "recreacion", imagen: "../assets/images/recreacion/WhatsApp Image 2026-05-28 at 3.01.21 AM.jpeg", descripcion: "Reflejo de palmeras en agua termal esmeralda.", activo: true },
        { id: "rec-13", titulo: "Mirador y Quioscos Campestres", categoria: "recreacion", imagen: "../assets/images/recreacion/WhatsApp Image 2026-05-28 at 3.01.22 AM.jpeg", descripcion: "Zonas de sombra con techos de paja para descansar.", activo: true },
        { id: "rec-14", titulo: "Pozo de Hidromasaje Natural", categoria: "recreacion", imagen: "../assets/images/recreacion/WhatsApp Image 2026-05-28 at 3.01.23 AM.jpeg", descripcion: "Corrientes suaves de agua medicinal reconfortante.", activo: true },
        { id: "rec-15", titulo: "Puente de Madera y Recorrido", categoria: "recreacion", imagen: "../assets/images/recreacion/WhatsApp Image 2026-05-28 at 3.01.24 AM.jpeg", descripcion: "Pasarelas rústicas que conectan los pozos.", activo: true },
        { id: "rec-16", titulo: "Entorno de Pozos y Zonas Verdes", categoria: "recreacion", imagen: "../assets/images/recreacion/WhatsApp Image 2026-05-28 at 3.01.24 AM (2).jpeg", descripcion: "Áreas amplias para caminar y desconectar del ruido.", activo: true },
        { id: "rec-17", titulo: "Pozas de Agua Mineralizada", categoria: "recreacion", imagen: "../assets/images/recreacion/WhatsApp Image 2026-05-28 at 3.01.25 AM.jpeg", descripcion: "Espacios de bienestar y salud al aire libre.", activo: true },
        { id: "rec-18", titulo: "Zona de Recreación Campestre", categoria: "recreacion", imagen: "../assets/images/recreacion/WhatsApp Image 2026-05-28 at 3.01.25 AM (1).jpeg", descripcion: "Patios y explanadas para compartir en familia.", activo: true },
        { id: "rec-19", titulo: "Descanso Bajo Sombras Naturales", categoria: "recreacion", imagen: "../assets/images/recreacion/WhatsApp Image 2026-05-28 at 3.01.25 AM (2).jpeg", descripcion: "Quioscos sombreados para pasar la tarde.", activo: true },

        // ==========================================
        // 💆 EXPERIENCIAS & LODOTERAPIA
        // ==========================================
        { id: "exp-1", titulo: "Lodoterapia Facial y Mascarilla Mineral", categoria: "experiencia", imagen: "../FOTOS/DVD.jpeg", descripcion: "Mascarilla de barro volcánico azufrado para el cuidado facial.", activo: true },
        { id: "exp-2", titulo: "Baño de Lodo Medicinal en Poza", categoria: "experiencia", imagen: "../FOTOS/EF.jpeg", descripcion: "Inmersión en lodo terapéutico para regenerar la piel.", activo: true },
        { id: "exp-3", titulo: "Terapia de Barro en Grupo", categoria: "experiencia", imagen: "../FOTOS/FEE.jpeg", descripcion: "Diversión y salud compartida entre amigos y familias.", activo: true },
        { id: "exp-4", titulo: "Extracción de Lodo Medicinal", categoria: "experiencia", imagen: "../FOTOS/WSD.jpeg", descripcion: "Barro virgen extraído del lecho natural de la fuente Acuatá.", activo: true },
        { id: "exp-5", titulo: "Recepción Turística Pet-Friendly", categoria: "experiencia", imagen: "../FOTOS/GTRR.jpeg", descripcion: "Nuestras mascotas siempre son bienvenidas con cariño.", activo: true },
        { id: "exp-6", titulo: "Amigos Peludos en Plena Naturaleza", categoria: "experiencia", imagen: "../FOTOS/WW.jpeg", descripcion: "Perros disfrutando de los senderos abiertos y seguros.", activo: true },
        { id: "exp-7", titulo: "Bienvenida y Experiencia Pet-Friendly", categoria: "experiencia", imagen: "../FOTOS/WhatsApp Image 2026-09-04 at 1.09.40 AM.jpeg", descripcion: "Un destino pensado para toda la familia, incluyendo a los consentidos de 4 patas.", activo: true },

        // ==========================================
        // 🏊 ALBERCAS & ESTANCIA
        // ==========================================
        { id: "inst-1", titulo: "Atardecer en Alberca Termal", categoria: "instalaciones", imagen: "../FOTOS/EWR.jpeg", descripcion: "Cielo dorado reflejado sobre las aguas azufradas.", activo: true },
        { id: "inst-2", titulo: "Albercas Soleadas y Asoleadoras", categoria: "instalaciones", imagen: "../FOTOS/DWD.jpeg", descripcion: "Espacios acondicionados para pasar un día de sol inolvidable.", activo: true },
        { id: "inst-3", titulo: "Jacuzzi Campestre & Desintoxicación", categoria: "instalaciones", imagen: "../FOTOS/FEF.jpeg", descripcion: "Hidromasaje relajante con burbujas y vista natural.", activo: true },
        { id: "inst-4", titulo: "Senderos de Cabañas y Hospedaje", categoria: "instalaciones", imagen: "../FOTOS/GRG.jpeg", descripcion: "Caminos hacia las zonas de estancia campestre.", activo: true },

        // ==========================================
        // 🌿 NATURALEZA & PAISAJES
        // ==========================================
        { id: "nat-1", titulo: "El Gran Pozo Azufrado y Palmeras", categoria: "naturaleza", imagen: "../assets/images/imagen principal/WhatsApp Image 2026-05-28 at 3.01.24 AM.jpeg", descripcion: "El legendario manantial de agua esmeralda enmarcado por palmeras.", activo: true },
        { id: "nat-2", titulo: "Vista Panorámica de los Pozos y Montañas", categoria: "naturaleza", imagen: "../FOTO DE FONDO/INICIO.jpeg", descripcion: "Perspectiva paisajística del valle y las colinas de Tocaima.", activo: true },
        { id: "nat-3", titulo: "Biodiversidad e Iguana Autóctona", categoria: "naturaleza", imagen: "../FOTOS/FT.jpeg", descripcion: "Fauna silvestre protegida que habita en nuestro ecosistema.", activo: true },
        { id: "nat-4", titulo: "Pozo de Agua Cristalina", categoria: "naturaleza", imagen: "../assets/images/imagen principal/img5.jpeg", descripcion: "Manantial de pureza cristalina y entorno vegetal virgen.", activo: true },
        { id: "nat-5", titulo: "Ecosistema de Palmeras Nativas", categoria: "naturaleza", imagen: "../assets/images/recreacion/WhatsApp Image 2026-05-28 at 3.01.20 AM (2).jpeg", descripcion: "Flora tropical protegida en el corazón de la reserva.", activo: true }
    ],
    // Usuario administrador por defecto
    // Usuario: admin | Correo: admin@pozoazufrado.com
    // Hash SHA-256 auténtico de "admin123": 240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9
    usuarios: [
        {
            usuario: "admin",
            email: "admin@pozoazufrado.com",
            nombre: "Administrador General",
            passwordHash: "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9"
        }
    ]
};

// API del Motor de Base de Datos
const PozoDB = {
    // Inicializar o cargar base de datos
    getDB: function() {
        try {
            const raw = localStorage.getItem(DB_KEY);
            if (!raw) {
                // Si existe version previa (v2), migrar usuarios y config previos para no perder contraseñas
                const v2Raw = localStorage.getItem('pozo_azufrado_db_v2');
                let initialData = JSON.parse(JSON.stringify(DEFAULT_DATABASE));
                if (v2Raw) {
                    try {
                        const v2 = JSON.parse(v2Raw);
                        if (v2.usuarios && v2.usuarios.length > 0) initialData.usuarios = v2.usuarios;
                        if (v2.config) initialData.config = Object.assign({}, initialData.config, v2.config);
                    } catch (e) {
                        console.warn("Error migrando datos v2:", e);
                    }
                }
                this.saveDB(initialData);
                return initialData;
            }
            const data = JSON.parse(raw);
            // Si falta alguna clave de estructura, fusionar con DEFAULT_DATABASE
            let changed = false;
            ['config', 'estancia', 'comidas', 'bebidas', 'galeria', 'usuarios'].forEach(k => {
                if (!data[k]) {
                    data[k] = DEFAULT_DATABASE[k];
                    changed = true;
                }
            });

            // Si el usuario admin tiene el hash con error tipográfico previo, corregirlo automáticamente
            if (data.usuarios && data.usuarios.length > 0) {
                const oldAdmin = data.usuarios.find(u => u.usuario === 'admin' && u.passwordHash === '240be518fabd2724ddb6f04eeb1615d192f17f8d794aaa56b6cb82ab794b53f1');
                if (oldAdmin) {
                    oldAdmin.passwordHash = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9';
                    changed = true;
                }
            }

            if (changed) this.saveDB(data);
            return data;
        } catch (e) {
            console.error("Error al leer la base de datos:", e);
            return DEFAULT_DATABASE;
        }
    },

    saveDB: function(data) {
        try {
            localStorage.setItem(DB_KEY, JSON.stringify(data));
            // Notificar a otras pestañas/ventanas
            window.dispatchEvent(new CustomEvent('pozo_db_updated', { detail: data }));
            return true;
        } catch (e) {
            console.error("Error al guardar en base de datos:", e);
            return false;
        }
    },

    // Resetear a valores de fábrica
    resetDB: function() {
        this.saveDB(DEFAULT_DATABASE);
        return DEFAULT_DATABASE;
    },

    // MÉTODOS DE COMIDAS
    getComidas: function(soloActivas = false) {
        const db = this.getDB();
        const list = db.comidas || [];
        return soloActivas ? list.filter(c => c.activo !== false) : list;
    },

    saveComida: function(comida) {
        const db = this.getDB();
        if (!comida.id) {
            comida.id = 'com-' + Date.now();
            db.comidas.push(comida);
        } else {
            const idx = db.comidas.findIndex(c => c.id === comida.id);
            if (idx !== -1) {
                db.comidas[idx] = Object.assign({}, db.comidas[idx], comida);
            } else {
                db.comidas.push(comida);
            }
        }
        this.saveDB(db);
        return comida;
    },

    deleteComida: function(id) {
        const db = this.getDB();
        db.comidas = db.comidas.filter(c => c.id !== id);
        this.saveDB(db);
        return true;
    },

    // MÉTODOS DE BEBIDAS
    getBebidas: function(soloActivas = false) {
        const db = this.getDB();
        const list = db.bebidas || [];
        return soloActivas ? list.filter(b => b.activo !== false) : list;
    },

    saveBebida: function(bebida) {
        const db = this.getDB();
        if (!bebida.id) {
            bebida.id = 'beb-' + Date.now();
            db.bebidas.push(bebida);
        } else {
            const idx = db.bebidas.findIndex(b => b.id === bebida.id);
            if (idx !== -1) {
                db.bebidas[idx] = Object.assign({}, db.bebidas[idx], bebida);
            } else {
                db.bebidas.push(bebida);
            }
        }
        this.saveDB(db);
        return bebida;
    },

    deleteBebida: function(id) {
        const db = this.getDB();
        db.bebidas = db.bebidas.filter(b => b.id !== id);
        this.saveDB(db);
        return true;
    },

    // MÉTODOS DE ESTANCIA
    getEstancia: function(soloActivas = false) {
        const db = this.getDB();
        const list = db.estancia || [];
        return soloActivas ? list.filter(e => e.activo !== false) : list;
    },

    saveEstancia: function(estancia) {
        const db = this.getDB();
        if (!estancia.id) {
            estancia.id = 'est-' + Date.now();
            db.estancia.push(estancia);
        } else {
            const idx = db.estancia.findIndex(e => e.id === estancia.id);
            if (idx !== -1) {
                db.estancia[idx] = Object.assign({}, db.estancia[idx], estancia);
            } else {
                db.estancia.push(estancia);
            }
        }
        this.saveDB(db);
        return estancia;
    },

    deleteEstancia: function(id) {
        const db = this.getDB();
        db.estancia = (db.estancia || []).filter(e => e.id !== id);
        this.saveDB(db);
        return true;
    },

    // MÉTODOS DE GALERÍA
    getGaleria: function(soloActivas = false) {
        const db = this.getDB();
        const list = db.galeria || [];
        return soloActivas ? list.filter(g => g.activo !== false) : list;
    },

    saveGaleria: function(foto) {
        const db = this.getDB();
        if (!foto.id) {
            foto.id = 'gal-' + Date.now();
            db.galeria.push(foto);
        } else {
            const idx = db.galeria.findIndex(g => g.id === foto.id);
            if (idx !== -1) {
                db.galeria[idx] = Object.assign({}, db.galeria[idx], foto);
            } else {
                db.galeria.push(foto);
            }
        }
        this.saveDB(db);
        return foto;
    },

    deleteGaleria: function(id) {
        const db = this.getDB();
        db.galeria = db.galeria.filter(g => g.id !== id);
        this.saveDB(db);
        return true;
    },

    // CONFIGURACIÓN TURÍSTICA
    getConfig: function() {
        const db = this.getDB();
        return db.config || DEFAULT_DATABASE.config;
    },

    saveConfig: function(config) {
        const db = this.getDB();
        db.config = Object.assign({}, db.config, config);
        this.saveDB(db);
        return db.config;
    },

    // COPIA DE SEGURIDAD / EXPORTAR / IMPORTAR
    exportBackup: function() {
        const db = this.getDB();
        const blob = new Blob([JSON.stringify(db, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `respaldo_pozo_azufrado_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    importBackup: function(jsonString) {
        try {
            const parsed = JSON.parse(jsonString);
            if (parsed && parsed.comidas && parsed.bebidas) {
                this.saveDB(parsed);
                return true;
            }
            return false;
        } catch (e) {
            console.error("Error al importar respaldo:", e);
            return false;
        }
    }
};

// Exponer en el entorno global
if (typeof window !== 'undefined') {
    window.PozoDB = PozoDB;
}
