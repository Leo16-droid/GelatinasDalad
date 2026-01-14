// Efecto parallax
document.addEventListener("mousemove", (e) => {
    let mouseX = e.clientX;
    let mouseY = e.clientY;
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    
    document.querySelectorAll(".layer").forEach(layer => {
        let speed = layer.getAttribute("data-speed");
        if (speed) {
            let x = (windowWidth - mouseX * speed) / 200;
            let y = (windowHeight - mouseY * speed) / 200;
            
            layer.style.transition = "transform 0.1s ease-out";
            layer.style.transform = `translate(${x}px, ${y}px)`;
        }
    });
});

// Función para desplazamiento suave a secciones
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const sectionPosition = section.offsetTop - headerHeight;
        
        window.scrollTo({
            top: sectionPosition,
            behavior: 'smooth'
        });
    }
}

// About section video: toggle play/pause on click for accessibility
(function setupAboutVideo(){
    const aboutVideo = document.getElementById('aboutVideo');
    if (!aboutVideo) return;

    // Click para pausar/reproducir
    aboutVideo.addEventListener('click', () => {
        if (aboutVideo.paused) {
            aboutVideo.play();
            aboutVideo.classList.remove('paused');
        } else {
            aboutVideo.pause();
            aboutVideo.classList.add('paused');
        }
    });

    // Botón para activar / desactivar sonido
    const soundBtn = document.getElementById('videoSoundBtn');
    if (soundBtn) {
        const updateSoundButton = () => {
            if (aboutVideo.muted) {
                soundBtn.setAttribute('aria-pressed', 'false');
                soundBtn.setAttribute('title', 'Activar sonido');
                soundBtn.setAttribute('aria-label', 'Activar sonido');
                soundBtn.innerHTML = '<i class="fas fa-volume-xmark" aria-hidden="true"></i>';
                soundBtn.classList.remove('unmuted');
            } else {
                soundBtn.setAttribute('aria-pressed', 'true');
                soundBtn.setAttribute('title', 'Silenciar');
                soundBtn.setAttribute('aria-label', 'Silenciar');
                soundBtn.innerHTML = '<i class="fas fa-volume-high" aria-hidden="true"></i>';
                soundBtn.classList.add('unmuted');
            }
        };

        soundBtn.addEventListener('click', (e) => {
            // user gesture allows unmute
            aboutVideo.muted = !aboutVideo.muted;
            if (!aboutVideo.muted) {
                aboutVideo.play().catch(() => {});
            }
            updateSoundButton();
        });

        // Inicializar estado del botón
        updateSoundButton();
    }

    // Pausar cuando la pestaña no está visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            aboutVideo.pause();
            aboutVideo.classList.add('paused');
        } else {
            if (aboutVideo.hasAttribute('autoplay') && aboutVideo.muted) {
                aboutVideo.play();
                aboutVideo.classList.remove('paused');
            }
        }
    });
})();

// Contadores animados
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 1500;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                counter.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    counter.style.transform = 'scale(1)';
                }, 50);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
                // Efecto final
                counter.style.animation = 'bounce 0.5s ease';
            }
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(counter);
    });
}

// Detectar visibilidad de secciones
function setupSectionVisibility() {
    const sections = document.querySelectorAll('.products-header, .products-grid, .brands-header, .brands-slider, .mission-vision');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Crear partículas flotantes
function createParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const particleCount = 15;
    const colors = ['#FF6B8B', '#FFD166', '#4ECDC4', '#06D6A0'];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 6 + 2;
        const duration = Math.random() * 10 + 8;
        const delay = Math.random() * 3;
        
        particle.style.cssText = `
            position: absolute;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            pointer-events: none;
            z-index: 1;
            opacity: ${Math.random() * 0.3 + 0.1};
            animation: floatParticle ${duration}s linear infinite ${delay}s;
            box-shadow: 0 0 ${size}px ${color};
        `;
        
        hero.appendChild(particle);
    }
}

// Efecto de carga inicial
function initializeSections() {
    // Animar contadores
    setTimeout(animateCounters, 1000);
    
    // Configurar visibilidad de secciones
    setupSectionVisibility();
    
    // Crear partículas
    createParticles();
}

// Efecto de retroalimentación para botones
function setupButtonEffects() {
    document.querySelectorAll('.btn-primary, .btn-secondary, .btn-cta, .btn-product, .language-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            // Efecto de onda
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.7);
                transform: scale(0);
                animation: ripple 0.6s linear;
                width: ${size}px;
                height: ${size}px;
                top: ${y}px;
                left: ${x}px;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Configurar navegación
function setupHeaderNavigation() {
    document.querySelectorAll('.nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                scrollToSection(href.substring(1));
            }
        });
    });
}

// ==================== MODAL SIMPLIFICADO ====================
let currentProductImages = [];

function openProduct(product) {
    const modal = document.getElementById("productModal");
    const modalBox = modal.querySelector(".modal-box");
    
    // Datos de productos simplificados
    const productData = {
        "producto1": {
            title: "Tarrina Pequeña",
            description: "Nuestra tarrina pequeña reúne gelatinas de maracuyá, fresa y chicle en un formato práctico y cómodo. Sus sabores intensos, colores vivos y textura suave hacen que cada bocado sea una experiencia alegre y refrescante. Perfecta para disfrutar de un dulce rápido, para niños o como detalle irresistible.",
            price: "$0.50",
            image: "imag/TarrinaP.png",
            details: [

                "Colores: Multicolor brillante", 
                "Duración del sabor: 5-7 minutos",
                "Contenido: 15 gelatinas"
            ]
        },
        "producto2": {
            title: "Tarrina Grande",
            description: "La tarrina grande es ideal para los amantes de las gelatinas. Incluye una generosa selección de sabores maracuyá, fresa y chicle, combinando notas tropicales, dulces y divertidas. Su tamaño es perfecto para compartir en reuniones, fiestas o simplemente para disfrutar durante más tiempo de su textura elástica y sabor intenso.",
            price: "$1.00",
            image: "imag/TarrinaG.png",
            details: [
                "Refrescante y vibrante",
                "Perfecto para compartir",
                "Contenido: 30 gelatinas"
            ]
        },
        "producto4": {
            title: "Tira de Gelatinas",
            description: "Nuestra tira de gelatinas ofrece una divertida combinación de maracuyá, fresa y chicle en un formato alargado y fácil de disfrutar. Su textura suave y elástica, junto a sus colores llamativos y sabores dulces, la convierten en un snack ideal para cualquier ocasión, aportando diversión y sabor en cada mordisco.",
            price: "$ 1.50",
            image: "imag/Tiras.png",
            details: [
                "Contiene: Sorpresas en el interior",
                "Textura: Suave y masticable",
                "Perfecto para fiestas",
                "Contenido: 8 tiras"
            ]
        }
    };
    
    // Datos de productos en inglés
    const productDataEN = {
        "producto1": {
            title: "Small Tub",
            description: "Our small cup features a colourful mix of passion fruit, strawberry and bubblegum gummies in a convenient, easy-to-enjoy format. With vibrant colours, a soft and chewy texture, and bold flavours, it’s the perfect option for a quick sweet snack, kids’ treats or a delightful little indulgence.",
            price: "$0.50",
            image: "imag/TarrinaP.png",
            details: [
                "Colors: Bright multicolor", 
                "Taste duration: 5-7 minutes",
                "Content: 15 jelly candies"
            ]
        },
        "producto2": {
            title: "Large Tub",
            description: "The large cup is made for true gummy lovers. It offers a generous assortment of passion fruit, strawberry and bubblegum flavours, blending tropical freshness with sweet and playful notes. Its bigger size makes it perfect for sharing at parties, gatherings or enjoying over time, with a chewy texture and irresistible taste in every bite.",
            price: "$1.00",
            image: "imag/TarrinaG.png",
            details: [
                "Refreshing and vibrant",
                "Perfect for sharing",
                "Content: 30 jelly candies"
            ]
        },
        "producto4": {
            title: "Strip of Gummies",
            description: "Our gummy strip combines passion fruit, strawberry and bubblegum flavours in a long, playful format that’s easy and fun to eat. Its soft, stretchy texture and bright colours make it a perfect snack for any occasion, delivering sweetness, flavour and enjoyment in every bite.",
            price: "$1.50",
            image: "imag/Tiras.png",
            details: [
                "Contains: Surprises inside",
                "Texture: Soft and chewy",
                "Perfect for parties",
                "Content: 8 strips"
            ]
        }
    };

    // Obtener datos del producto
    const lang = localStorage.getItem(LS_KEY) || getPreferredLang();
    const data = lang === 'en' ? productDataEN[product] : productData[product];
    
    // Actualizar contenido del modal
    updateModalContent(data, lang);
    
    // Mostrar modal con animación
    modal.style.display = "flex";
    setTimeout(() => {
        modalBox.classList.add("active");
    }, 50);
    
    currentOpenProduct = product;
    
    // Configurar zoom para la imagen
    setTimeout(() => setupImageZoom(), 100);
}

function updateModalContent(data, lang) {
    const modal = document.getElementById("productModal");
    const t = translations[lang] || translations.es;
    
    // Plantilla HTML mejorada con clases responsive
    modal.querySelector(".modal-box").innerHTML = `
        <span class="close-modal" onclick="closeProduct()" data-i18n="modal.close">×</span>
        
        <div class="modal-simple-content">
            <div class="modal-image-container">
                <div class="image-zoom-wrapper" id="zoomContainer">
                    <img src="${data.image}" alt="${data.title}" 
                         class="main-product-image zoomable-image" 
                         id="mainProductImage"
                         loading="lazy"
                         onerror="this.src='imag/default-product.png'">
                    <div class="zoom-hint">
                        <i class="fas fa-search-plus"></i> 
                        <span data-i18n="modal.zoomHint">Haz clic para zoom</span>
                    </div>
                </div>
            </div>
            
            <div class="modal-info-simple">
                <div class="modal-header-responsive">
                    <h3 id="modalTitle">${data.title}</h3>
                    <div class="product-price-simple">
                        <span data-i18n="modal.price">Precio:</span>
                        <strong>${data.price}</strong>
                    </div>
                </div>
                
                <div class="modal-description-container">
                    <p id="modalDescription">${data.description}</p>
                </div>
                
                <div class="product-details-simple">
                    <h4 data-i18n="modal.features">Características:</h4>
                    <ul class="details-list">
                        ${data.details.map(detail => `<li>${detail}</li>`).join('')}
                    </ul>
                </div>
                
                <!-- Botón de acción para móviles -->
                <button class="modal-action-btn" onclick="closeProduct()" data-i18n="modal.closeBtn">
                    <i class="fas fa-check"></i> Entendido
                </button>
            </div>
        </div>
        
        <!-- Modal para zoom fullscreen -->
        <div class="zoom-fullscreen-modal" id="zoomFullscreenModal">
            <div class="zoom-fullscreen-content">
                <button class="close-fullscreen" onclick="closeFullscreenZoom()" aria-label="Cerrar zoom">
                    <i class="fas fa-times"></i>
                </button>
                <img src="${data.image}" alt="${data.title}" class="fullscreen-image" loading="lazy">
                <div class="zoom-fullscreen-controls">
                    <button class="zoom-btn" onclick="zoomFullscreenImage(1.2)" aria-label="Aumentar zoom">
                        <i class="fas fa-search-plus"></i>
                    </button>
                    <button class="zoom-btn" onclick="zoomFullscreenImage(0.8)" aria-label="Disminuir zoom">
                        <i class="fas fa-search-minus"></i>
                    </button>
                    <button class="zoom-btn" onclick="resetFullscreenZoom()" aria-label="Restablecer zoom">
                        <i class="fas fa-sync-alt"></i>
                    </button>
                </div>
            </div>
        </div>
    `;

    // Mejorar experiencia táctil en móviles
function setupMobileTouchSupport() {
    const modal = document.getElementById('productModal');
    
    if (!modal) return;
    
    // Prevenir desplazamiento del fondo cuando el modal está abierto
    modal.addEventListener('touchmove', function(e) {
        e.preventDefault();
    }, { passive: false });
    
    // Cerrar modal al tocar fuera en móviles
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeProduct();
        }
    });
}
    
    // Aplicar traducciones
    if (translations[lang]) {
        const elements = modal.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang][key]) {
                el.textContent = translations[lang][key];
            }
        });
    }
}

// Variables para el zoom
let currentZoom = 1;
let isFullscreen = false;

function setupImageZoom() {
    const image = document.getElementById('mainProductImage');
    const zoomContainer = document.getElementById('zoomContainer');
    
    if (!image || !zoomContainer) return;
    
    // Click para zoom fullscreen
    image.addEventListener('click', function() {
        openFullscreenZoom(this.src, this.alt);
    });
    
    // Hover effect
    image.addEventListener('mouseenter', function() {
        this.style.cursor = 'zoom-in';
    });
    
    // Wheel zoom en el contenedor
    zoomContainer.addEventListener('wheel', function(e) {
        if (!isFullscreen) return;
        e.preventDefault();
        
        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
        zoomFullscreenImage(zoomFactor);
    });
}

function openFullscreenZoom(imageSrc, imageAlt) {
    const fullscreenModal = document.getElementById('zoomFullscreenModal');
    const fullscreenImage = fullscreenModal.querySelector('.fullscreen-image');
    
    fullscreenImage.src = imageSrc;
    fullscreenImage.alt = imageAlt;
    fullscreenModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    isFullscreen = true;
    
    // Resetear zoom al abrir
    currentZoom = 1;
    fullscreenImage.style.transform = 'scale(1)';
}

function closeFullscreenZoom() {
    const fullscreenModal = document.getElementById('zoomFullscreenModal');
    fullscreenModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    isFullscreen = false;
}

function zoomFullscreenImage(factor) {
    const fullscreenImage = document.querySelector('.fullscreen-image');
    if (!fullscreenImage) return;
    
    currentZoom *= factor;
    
    // Limitar zoom
    if (currentZoom < 0.5) currentZoom = 0.5;
    if (currentZoom > 5) currentZoom = 5;
    
    fullscreenImage.style.transform = `scale(${currentZoom})`;
    
    // Mostrar nivel de zoom
    showZoomLevel(currentZoom);
}

function resetFullscreenZoom() {
    currentZoom = 1;
    const fullscreenImage = document.querySelector('.fullscreen-image');
    if (fullscreenImage) {
        fullscreenImage.style.transform = 'scale(1)';
    }
    showZoomLevel(1);
}

function showZoomLevel(zoom) {
    // Crear o actualizar indicador de zoom
    let zoomIndicator = document.querySelector('.zoom-level-indicator');
    
    if (!zoomIndicator) {
        zoomIndicator = document.createElement('div');
        zoomIndicator.className = 'zoom-level-indicator';
        zoomIndicator.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: bold;
            z-index: 4000;
            opacity: 0;
            transition: opacity 0.3s;
            pointer-events: none;
        `;
        document.body.appendChild(zoomIndicator);
    }
    
    const lang = localStorage.getItem(LS_KEY) || getPreferredLang();
    const t = translations[lang] || translations.es;
    
    zoomIndicator.textContent = `${lang === 'en' ? 'Zoom:' : 'Zoom:'} ${Math.round(zoom * 100)}%`;
    zoomIndicator.style.opacity = '1';
    
    setTimeout(() => {
        zoomIndicator.style.opacity = '0';
    }, 1500);
}

function closeProduct() {
    const modal = document.getElementById("productModal");
    const modalBox = modal.querySelector(".modal-box");
    
    // Cerrar también el zoom fullscreen si está abierto
    closeFullscreenZoom();
    
    // Animación de cierre
    modalBox.classList.remove("active");
    modalBox.style.transform = "translateY(20px)";
    modalBox.style.opacity = "0";
    
    setTimeout(() => {
        modal.style.display = "none";
        modalBox.style.transform = "";
        modalBox.style.opacity = "";
    }, 200);
    
    currentOpenProduct = null;
}

// Cerrar modales al hacer clic fuera
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const fullscreenModal = document.getElementById('zoomFullscreenModal');
        const modal = document.getElementById('productModal');
        
        if (fullscreenModal && fullscreenModal.style.display === 'flex') {
            closeFullscreenZoom();
        } else if (modal && modal.style.display === 'flex') {
            closeProduct();
        }
    }
});

// Cerrar con tecla ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const fullscreenModal = document.getElementById('zoomFullscreenModal');
        const modal = document.getElementById('productModal');
        
        if (fullscreenModal.style.display === 'flex') {
            closeFullscreenZoom();
        } else if (modal.style.display === 'flex') {
            closeProduct();
        }
    }
});


// ==================== TRADUCCIONES ====================
const translations = {
    es: {
        siteTitle: "DALAD - Mundo de Dulces Mágicos",
        "nav.home": "Inicio",
        "nav.products": "Productos",
        "nav.brands": "Tiendas",
        "nav.contact": "Conócenos",
        "nav.order": "Diseño Personalizado",
        "hero.brand": "DALAD",
        "hero.subtitle": "¡Un Mundo de Dulces Mágicos! 🍭",
        "hero.description": "Descubre sabores increíbles, colores brillantes y aventuras dulces en cada bocado",
        "hero.ctaView": "Ver Dulces",
        "hero.ctaVideo": "Ver Video",
        "hero.scroll": "",
        "about.title": "Los Reyes de la <span class=\"highlight\">Gelatinería</span> 🐉",
        "about.description": "En <strong>DALAD</strong> no solo hacemos gelatinas, creamos momentos mágicos. Todo comenzó hace más de 15 años, cuando las manos de mamá preparaban gelatinas especiales para compartir en familia. Aunque el tiempo pasó, ese sueño nunca se perdió… se guardó con cariño, se retomó y se transformó en algo aún más especial. Hoy, cada sabor lleva una historia, cada color representa ilusión y cada dinosaurio refleja la alegría de volver a creer en los sueños familiares. DALAD es amor, tradición y sonrisas que se comparten.",
        "stats.yearsLabel": "Años de Diversión",
        "stats.productsLabel": "Dulces Diferentes",
        "stats.countriesLabel": "Tiendas Disponibles",
        "stats.smilesLabel": "Sonrisas Diarias",
        "products.title": "🍬 Nuestros Productos",
        "products.subtitle": "Actualmente contamos con una selección especial de dulces.",
        "product.prod1.title": "Tarrina Pequeña",
        "product.prod1.desc": "Tarrina pequeña de gelatinas de maracuyá, fresa y chicle, ideal para un capricho dulce y divertido en cualquier momento.",
        "product.prod2.title": "Tarrina Grande",
        "product.prod2.desc": "Tarrina grande de gelatinas surtidas de maracuyá, fresa y chicle, pensada para compartir y disfrutar más.",
        "product.prod4.title": "Tira de Gelatinas",
        "product.prod4.desc": "Tira de gelatinas de maracuyá, fresa y chicle, colorida, flexible y llena de sabor.",
        "product.view": "Ver detalles",
        "modal.close": "×",
        "modal.title": "Título producto",
        "modal.description": "Descripción del producto",
        "modal.features": "Características:",
        "modal.price": "Precio:",
        "modal.zoomHint": "Haz clic para zoom",
        "modal.flavor": "Sabor:",
        "modal.colors": "Colores:",
        "modal.duration": "Duración del sabor:",
        "modal.content": "Contenido:",
        "modal.contains": "Contiene:",
        "modal.texture": "Textura:",
        "modal.perfectFor": "Perfecto para:",
        "brands.title": "Encuéntranos en <span>nuestras tiendas</span> ✨",
        "brands.subtitle": "¡Haz clic en cualquier tienda para ver su ubicación en el mapa!",
        "contact.visionTitle": "Visión",
        "contact.visionText": "Ser una empresa ecuatoriana reconocida por su compromiso social y humano, brindando oportunidades de trabajo digno a personas de nuestra comunidad que atraviesan situaciones económicas difíciles. Aspiramos a crecer de manera sostenible como una fábrica artesanal, fortaleciendo el desarrollo local y demostrando que el esfuerzo, la solidaridad y la fe pueden transformar vidas y construir un futuro mejor para todos.",
        "contact.missionTitle": "Misión",
        "contact.missionText": "Ofrecer productos artesanales de alta calidad, elaborados con dedicación y tradición, llevando el sabor único de nuestra fábrica a cada rincón del Ecuador. Nos comprometemos a trabajar con responsabilidad, pasión y valores, generando empleo, impulsando el talento local y contribuyendo al bienestar de nuestras comunidades.",
        "footer.line1": "¡Creando sonrisas dulces desde 1995! 🎉",
        "footer.slogan": "<i class=\"fas fa-heart\"></i> Hecho con amor y un toque de magia",
        "footer.quick": "<i class=\"fas fa-link\"></i> Enlaces Rápidos",
        "footer.follow": "<i class=\"fas fa-share-alt\"></i> Síguenos",
        "footer.copy": "© 2024 DALAD Confitería Mágica. ¡Todos los derechos reservados para hacerte feliz! 🍬"
    },
    en: {
        siteTitle: "DALAD - Magical Sweets World",
        "nav.home": "Home",
        "nav.products": "Products",
        "nav.brands": "Stores",
        "nav.contact": "About Us", 
        "nav.order": "Custom Design",
        "hero.brand": "DALAD",
        "hero.subtitle": "A World of Magical Sweets! 🍭",
        "hero.description": "Discover amazing flavors, bright colors and sweet adventures in every bite",
        "hero.ctaView": "See Sweets",
        "hero.ctaVideo": "Watch Video",
        "hero.scroll": "",
        "about.title": "The Kings of <span class=\"highlight\">Gelatine</span> 🐉",
        "about.description": "At <strong>DALAD</strong> we don't just make gelatin, we create magical moments. It all began over 15 years ago, when mom's hands prepared special gelatin to share with the family. Although time passed, that dream was never lost... it was lovingly kept, rediscovered, and transformed into something even more special. Today, every flavor carries a story, every color represents hope, and every dinosaur reflects the joy of believing in family dreams again. DALAD is love, tradition, and shared smiles.",
        "stats.yearsLabel": "Years of Fun",
        "stats.productsLabel": "Different Candies",
        "stats.countriesLabel": "Available Stores",
        "stats.smilesLabel": "Daily Smiles",
        "products.title": "🍬 Our Products",
        "products.subtitle": "We currently offer a special selection of sweets.",
        "product.prod1.title": "Small Tub",
        "product.prod1.desc": "Small cup of passion fruit, strawberry and bubblegum gummies, perfect for a sweet and fun treat anytime.",
        "product.prod2.title": "Large Tub",
        "product.prod2.desc": "Large cup of assorted passion fruit, strawberry and bubblegum gummies, ideal for sharing and enjoying more.",
        "product.prod4.title": "Strip of Gummies",
        "product.prod4.desc": "Gummy strip with passion fruit, strawberry and bubblegum flavours, colourful, flexible and full of fun.",
        "product.view": "View details",
        "modal.close": "×",
        "modal.title": "Product title",
        "modal.description": "Product description",
        "modal.features": "Features:",
        "modal.price": "Price:",
        "modal.zoomHint": "Click to zoom",
        "modal.flavor": "Flavor:",
        "modal.colors": "Colors:",
        "modal.duration": "Taste duration:",
        "modal.content": "Content:",
        "modal.contains": "Contains:",
        "modal.texture": "Texture:",
        "modal.perfectFor": "Perfect for:",
        "brands.title": "Find us at <span>our stores</span> ✨",
        "brands.subtitle": "Click on any store to see its location on the map!",
        "contact.visionTitle": "Vision",
        "contact.visionText": "To be an Ecuadorian company recognized for its social and human commitment, providing dignified work opportunities to community members facing difficult economic situations. We aspire to grow sustainably as an artisanal factory, strengthening local development and demonstrating that effort, solidarity and faith can transform lives and build a better future for all.",
        "contact.missionTitle": "Mission",
        "contact.missionText": "To offer high-quality artisanal products, made with dedication and tradition, bringing the unique flavor of our factory to every corner of Ecuador. We are committed to working responsibly, passionately and with values, generating employment, promoting local talent and contributing to the well-being of our communities.",
        "footer.line1": "Creating sweet smiles since 1995! 🎉",
        "footer.slogan": "<i class=\"fas fa-heart\"></i> Made with love and a touch of magic",
        "footer.quick": "<i class=\"fas fa-link\"></i> Quick Links",
        "footer.follow": "<i class=\"fas fa-share-alt\"></i> Follow Us",
        "footer.copy": "© 2024 DALAD Magical Confectionery. All rights reserved to make you happy! 🍬"
    }
};

const LS_KEY = 'siteLang';
let currentOpenProduct = null;

function getPreferredLang() {
    const stored = localStorage.getItem(LS_KEY);
    if (stored) return stored;
    const nav = navigator.language || navigator.userLanguage || 'es';
    return nav.startsWith('en') ? 'en' : 'es';
}

function applyTranslations(lang) {
    if (!translations[lang]) lang = 'es';
    document.documentElement.lang = lang;
    document.title = translations[lang].siteTitle || document.title;

    // innerHTML/text updates
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const value = translations[lang][key];
        if (typeof value !== 'undefined') {
            el.innerHTML = value;
        }
    });

    // update lang button label
    const label = document.getElementById('langLabel');
    if (label) label.textContent = lang.toUpperCase();
    const btn = document.getElementById('langBtn');
    if (btn) btn.setAttribute('aria-label', lang === 'es' ? 'Cambiar idioma, actualmente Español' : 'Change language, currently English');

    localStorage.setItem(LS_KEY, lang);
}

function toggleLanguage() {
    const current = localStorage.getItem(LS_KEY) || getPreferredLang();
    const next = current === 'es' ? 'en' : 'es';
    const btn = document.getElementById('langBtn');
    if (btn) btn.classList.add('language-changing');
    applyTranslations(next);
    // Si un modal de producto está abierto, reabrirlo para actualizar los textos al nuevo idioma
    if (currentOpenProduct) {
        openProduct(currentOpenProduct);
    }
    setTimeout(() => { if (btn) btn.classList.remove('language-changing'); }, 300);
}

// ==================== INICIALIZACIÓN ====================
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar todas las funcionalidades
    initializeSections();
    setupButtonEffects();
    setupHeaderNavigation();
    
    // Configurar scroll indicator
    document.querySelector('.scroll-indicator')?.addEventListener('click', () => {
        scrollToSection('nosotros');
    });
    
    // Configurar idioma
    const langBtn = document.getElementById('langBtn');
    if (langBtn) langBtn.addEventListener('click', toggleLanguage);
    applyTranslations(localStorage.getItem(LS_KEY) || getPreferredLang());
    
    // Efecto de carga inicial
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // Reaplicar traducciones por si algún cambio dinámico sobreescribe los títulos
    setTimeout(() => applyTranslations(localStorage.getItem(LS_KEY) || getPreferredLang()), 80);
});