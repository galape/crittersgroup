// Funcionalidad principal del sitio
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar carrito si no existe
    if (typeof carrito === 'undefined') {
        // Importar la funcionalidad del carrito
        const script = document.createElement('script');
        script.src = './js/carrito.js';
        document.head.appendChild(script);
        
        script.onload = function() {
            // Esperar a que el carrito se inicialice
            setTimeout(() => {
                if (typeof carrito !== 'undefined') {
                    carrito.actualizarContador();
                }
            }, 100);
        };
    }

    // Configurar botones de compra en las tarjetas de servicios
    configurarBotonesCompra();
    
    // Configurar menú móvil
    configurarMenuMovil();
    
    // Configurar scroll suave para enlaces internos
    configurarScrollSuave();
});

// Configurar botones de compra
function configurarBotonesCompra() {
    // Configurar botones "Agregar al Carrito" en las tarjetas de servicios
    const botonesAgregar = document.querySelectorAll('.service-cta-primary');
    
    botonesAgregar.forEach((boton) => {
        boton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Encontrar la tarjeta de servicio padre
            const serviceCard = boton.closest('.service-card');
            if (serviceCard) {
                // Determinar qué producto agregar basado en el nombre del servicio
                const serviceName = serviceCard.querySelector('.service-name').textContent.toLowerCase();
                let productoId = '';
                
                if (serviceName.includes('branding')) productoId = 'branding';
                else if (serviceName.includes('presentaciones')) productoId = 'presentaciones';
                else if (serviceName.includes('editorial')) productoId = 'editorial';
                else if (serviceName.includes('packaging')) productoId = 'packaging';
                
                if (productoId) {
                    agregarAlCarrito(productoId);
                }
            }
        });
    });
}

// Configurar menú móvil
function configurarMenuMovil() {
    const menuToggle = document.getElementById('menu-toggle');
    const menu = document.querySelector('.menu');
    
    if (menuToggle && menu) {
        // Cerrar menú al hacer clic en un enlace
        const enlacesMenu = menu.querySelectorAll('a');
        enlacesMenu.forEach(enlace => {
            enlace.addEventListener('click', () => {
                menuToggle.checked = false;
            });
        });
        
        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!menu.contains(e.target) && !menuToggle.contains(e.target)) {
                menuToggle.checked = false;
            }
        });
    }
}

// Configurar scroll suave para enlaces internos
function configurarScrollSuave() {
    const enlacesInternos = document.querySelectorAll('a[href^="#"]');
    
    enlacesInternos.forEach(enlace => {
        enlace.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 100; // Ajustar para el header fijo
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Función para agregar producto al carrito (llamada desde los botones)
function agregarAlCarrito(productoId) {
    // Productos disponibles
    const productos = {
        'branding': {
            id: 'branding',
            nombre: 'Branding',
            precio: 1500,
            imagen: './images/1x/idea-8.png',
            descripcion: 'Pack 40 hs mensuales - Identidad corporativa, comunicación interna, desarrollo de marca, material POP'
        },
        'presentaciones': {
            id: 'presentaciones',
            nombre: 'Presentaciones',
            precio: 2000,
            imagen: './images/1x/printscreen-8.png',
            descripcion: 'Pack 60 hs mensuales - Reportes, presentaciones, informes'
        },
        'editorial': {
            id: 'editorial',
            nombre: 'Diseño Editorial',
            precio: 1200,
            imagen: './images/1x/book-8.png',
            descripcion: 'Pack 20 hs mensuales - Catálogos impresos, digitales y enriquecidos, newsletters, libros'
        },
        'packaging': {
            id: 'packaging',
            nombre: 'Packaging',
            precio: 2500,
            imagen: './images/1x/corpo-8.png',
            descripcion: 'Pack 80 hs mensuales - Diseño de líneas de productos, preprensa para offset y flexografía, asesoramiento'
        }
    };

    const producto = productos[productoId];
    if (!producto) return;

    // Obtener carrito del localStorage
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    // Verificar si el producto ya existe en el carrito
    const productoExistente = carrito.find(p => p.id === producto.id);
    
    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        carrito.push({
            ...producto,
            cantidad: 1
        });
    }
    
    // Guardar en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));
    console.log('Producto agregado al carrito:', producto.nombre);
    
    // Actualizar contador en el header
    actualizarContadorCarrito();
    
    // Mostrar notificación
    mostrarNotificacion('Producto agregado al carrito');
}

// Actualizar contador del carrito en el header
function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const totalItems = carrito.reduce((total, producto) => total + producto.cantidad, 0);
    
    console.log('Carrito actual:', carrito);
    console.log('Total items:', totalItems);
    
    // Buscar el contador en el header
    const contador = document.getElementById('cart-count');
    console.log('Contador encontrado:', contador);
    
    if (contador) {
        contador.textContent = totalItems;
        console.log('Texto del contador:', contador.textContent);
        
        if (totalItems > 0) {
            contador.style.display = 'flex';
            contador.classList.add('show');
            console.log('Contador mostrado');
        } else {
            contador.style.display = 'none';
            contador.classList.remove('show');
            console.log('Contador oculto');
        }
    } else {
        console.log('No se encontró el contador');
    }
}

// Mostrar notificación
function mostrarNotificacion(mensaje) {
    // Crear notificación temporal
    const notificacion = document.createElement('div');
    notificacion.className = 'notificacion';
    notificacion.textContent = mensaje;
    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: var(--orange);
        color: white;
        padding: 1rem;
        border-radius: 0.5rem;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (document.body.contains(notificacion)) {
                document.body.removeChild(notificacion);
            }
        }, 300);
    }, 2000);
}

// Agregar estilos CSS para las animaciones si no existen
if (!document.querySelector('#animaciones-carrito')) {
    const style = document.createElement('style');
    style.id = 'animaciones-carrito';
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// Inicializar contador al cargar la página
window.addEventListener('load', function() {
    actualizarContadorCarrito();
});

// También inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        actualizarContadorCarrito();
    }, 100);
});
