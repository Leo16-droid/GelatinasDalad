// map.js — Mapa interactivo para las tiendas DALAD
let map;
let markers = [];
let allStoreLocations = [];

document.addEventListener('DOMContentLoaded', () => {
    const mapEl = document.getElementById('brandsMap');
    if (!mapEl) return;

    // Centro de Riobamba, Ecuador
    const center = [-1.6717, -78.6569];
    map = L.map('brandsMap').setView(center, 13);

    // Capa de mapa
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);

    // Hacer el mapa global
    window.map = map;

    // Ubicaciones de las tiendas con coordenadas exactas
    allStoreLocations = [
        {
            name: "Supermercado La Iberica",
            color: "#FF6B8B",
            lat: -1.6751025890367996,
            lon: -78.65265327342753,
            address: "88FW+VW6, Riobamba"
        },
        {
            name: "Confitería Marianita",
            color: "#06D6A0",
            lat: -1.6680388520766811,
            lon: -78.64523750859273,
            address: "Nueva York, Riobamba"
        },
        {
            name: "Bode Market",
            color: "#9D4EDD",
            lat: -1.689564,
            lon: -78.625252,
            address: "Riobamba"
        },
        {
            name: "Si o Si",
            color: "#4ECDC4",
            lat: -1.689202,
            lon: -78.625618,
            address: "Riobamba"
        },
        {
            name: "Camari",
            color: "#FF9F43",
            lat: -1.6754831333949813,
            lon: -78.65008499880213,
            address: "Riobamba"
        },
        {
            name: "Comercial Paco",
            color: "#FFD166",
            lat: -1.730729,
            lon: -78.597229,
            address: "Chambo"
        },
        {
            name: "Minimarket Chambo",
            color: "#FFB86B",
            lat: -1.733063,
            lon: -78.595825,
            address: "Chambo"
        }
    ];

    // Crear iconos personalizados
    function createStoreIcon(color, isActive = false) {
        const size = isActive ? 45 : 35;
        const iconHtml = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="${size}" height="${size}">
                <path fill="${color}" d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/>
                ${isActive ? '<circle cx="192" cy="192" r="20" fill="white"/>' : ''}
            </svg>`;

        return L.divIcon({
            html: iconHtml,
            iconSize: [size, size],
            iconAnchor: [size/2, size],
            popupAnchor: [0, -size],
            className: 'store-marker' + (isActive ? ' active' : '')
        });
    }

    // Crear marcadores
    function createMarkers(showAll = true, activeIndex = -1) {
        // Limpiar marcadores existentes
        markers.forEach(marker => {
            map.removeLayer(marker);
        });
        markers = [];

        if (showAll) {
            // Mostrar todos los marcadores
            allStoreLocations.forEach((store, index) => {
                const isActive = (index === activeIndex);
                const icon = createStoreIcon(store.color, isActive);
                
                const marker = L.marker([store.lat, store.lon], { icon })
                    .addTo(map)
                    .bindPopup(`
                        <div class="store-popup">
                            <h3 style="color: ${store.color}; margin: 0 0 10px 0;">${store.name}</h3>
                            <p style="margin: 0 0 5px 0;"><strong>Dirección:</strong> ${store.address}</p>
                            <a href="https://www.google.com/maps/search/?api=1&query=${store.lat},${store.lon}" 
                               target="_blank" 
                               style="display: inline-block; background: ${store.color}; color: white; padding: 8px 15px; 
                                      border-radius: 20px; text-decoration: none; font-weight: bold;">
                                <i class="fas fa-directions"></i> Cómo llegar
                            </a>
                        </div>
                    `);
                
                markers.push(marker);
            });

            // Ajustar vista para mostrar todos
            if (markers.length > 0) {
                const bounds = L.latLngBounds(markers.map(m => m.getLatLng()));
                map.fitBounds(bounds.pad(0.3));
            }
        } else if (activeIndex >= 0 && activeIndex < allStoreLocations.length) {
            // Mostrar solo el marcador activo
            const store = allStoreLocations[activeIndex];
            const icon = createStoreIcon(store.color, true);
            
            const marker = L.marker([store.lat, store.lon], { icon })
                .addTo(map)
                .bindPopup(`
                    <div class="store-popup">
                        <h3 style="color: ${store.color}; margin: 0 0 10px 0;">${store.name}</h3>
                        <p style="margin: 0 0 5px 0;"><strong>Dirección:</strong> ${store.address}</p>
                        <a href="https://www.google.com/maps/search/?api=1&query=${store.lat},${store.lon}" 
                           target="_blank" 
                           style="display: inline-block; background: ${store.color}; color: white; padding: 8px 15px; 
                                  border-radius: 20px; text-decoration: none; font-weight: bold;">
                            <i class="fas fa-directions"></i> Cómo llegar
                        </a>
                    </div>
                `)
                .openPopup();
            
            markers.push(marker);
            
            // Centrar y hacer zoom en este marcador
            map.setView([store.lat, store.lon], 17);
        }

        // Hacer los marcadores globalmente accesibles
        window.brandsMarkers = markers;
    }

    // Crear marcadores iniciales (todos)
    createMarkers(true);

    // Función para mostrar solo una tienda
    window.showOnlyStoreOnMap = function(storeIndex) {
        createMarkers(false, storeIndex);
        
        // Expandir mapa si es necesario
        const mapEl = document.getElementById('brandsMap');
        if (mapEl && !mapEl.classList.contains('expanded')) {
            document.getElementById('mapToggleSize')?.click();
        }
        
        // Actualizar texto del botón
        const showAllBtn = document.getElementById('showAllBtn');
        if (showAllBtn) {
            showAllBtn.innerHTML = '<i class="fas fa-layer-group"></i> Ver todas';
            showAllBtn.title = 'Ver todas las tiendas';
        }
    };

    // Función para mostrar todas las tiendas
    window.showAllStoresOnMap = function() {
        createMarkers(true);
        
        // Actualizar texto del botón
        const showAllBtn = document.getElementById('showAllBtn');
        if (showAllBtn) {
            showAllBtn.innerHTML = '<i class="fas fa-check"></i> Mostrando todas';
            showAllBtn.title = 'Mostrando todas las tiendas';
            
            // Resetear después de 3 segundos
            setTimeout(() => {
                if (showAllBtn) {
                    showAllBtn.innerHTML = '<i class="fas fa-layer-group"></i> Ver todas';
                    showAllBtn.title = 'Ver todas las tiendas';
                }
            }, 3000);
        }
    };

    // Botón para mostrar todas las tiendas
    const showAllBtn = document.getElementById('showAllBtn');
    if (showAllBtn) {
        showAllBtn.addEventListener('click', () => {
            showAllStoresOnMap();
            
            // Quitar resaltado de todas las tiendas
            document.querySelectorAll('.slider-item').forEach(item => {
                item.classList.remove('active');
            });
        });
    }

    // Toggle tamaño del mapa
    const toggleBtn = document.getElementById('mapToggleSize');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const expanded = mapEl.classList.toggle('expanded');
            toggleBtn.setAttribute('aria-pressed', expanded);
            toggleBtn.title = expanded ? 'Cerrar mapa' : 'Expandir mapa';
            toggleBtn.textContent = expanded ? '✖' : '⤢';
            
            setTimeout(() => {
                map.invalidateSize();
                
                // Reajustar vista según lo que esté mostrando
                if (markers.length === 1) {
                    // Si solo hay un marcador (tienda individual)
                    map.setView(markers[0].getLatLng(), 17);
                } else if (markers.length > 1) {
                    // Si hay múltiples marcadores
                    const bounds = L.latLngBounds(markers.map(m => m.getLatLng()));
                    map.fitBounds(bounds.pad(0.3));
                }
            }, 350);
        });

        // Soporte teclado
        toggleBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleBtn.click();
            }
        });
    }
    
    // Inicializar eventos de clic en tiendas
    setTimeout(() => {
        setupStoreClickEvents();
    }, 500);
});

// Configurar eventos de clic en tiendas
function setupStoreClickEvents() {
    const storeItems = document.querySelectorAll('.slider-item');
    
    storeItems.forEach((item, index) => {
        // Hacer toda la tarjeta clickeable
        item.style.cursor = 'pointer';
        item.addEventListener('click', (e) => {
            // Remover clase active de todos
            storeItems.forEach(i => i.classList.remove('active'));
            
            // Agregar clase active al seleccionado
            item.classList.add('active');
            
            // Mostrar solo esta tienda en el mapa
            showOnlyStoreOnMap(index);
        });
        
        // Asignar índice
        item.setAttribute('data-store-index', index);
    });
}