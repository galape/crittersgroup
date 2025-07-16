// Carrito de compras - Funcionalidad completa
class Carrito {
    constructor() {
        this.productos = JSON.parse(localStorage.getItem('carrito')) || [];
        this.init();
    }

    init() {
        this.renderizarCarrito();
        this.actualizarContador();
        this.bindEvents();
    }

    // Agregar producto al carrito
    agregarProducto(producto) {
        const productoExistente = this.productos.find(p => p.id === producto.id);
        
        if (productoExistente) {
            productoExistente.cantidad += 1;
        } else {
            this.productos.push({
                ...producto,
                cantidad: 1
            });
        }
        
        this.guardarCarrito();
        this.renderizarCarrito();
        this.actualizarContador();
        this.mostrarNotificacion('Producto agregado al carrito');
    }

    // Remover producto del carrito
    removerProducto(id) {
        this.productos = this.productos.filter(p => p.id !== id);
        this.guardarCarrito();
        this.renderizarCarrito();
        this.actualizarContador();
        this.mostrarNotificacion('Producto removido del carrito');
    }

    // Actualizar cantidad de un producto
    actualizarCantidad(id, nuevaCantidad) {
        if (nuevaCantidad <= 0) {
            this.removerProducto(id);
            return;
        }
        
        const producto = this.productos.find(p => p.id === id);
        if (producto) {
            producto.cantidad = nuevaCantidad;
            this.guardarCarrito();
            this.renderizarCarrito();
            this.actualizarContador();
        }
    }

    // Vaciar carrito
    vaciarCarrito() {
        this.productos = [];
        this.guardarCarrito();
        this.renderizarCarrito();
        this.actualizarContador();
        this.mostrarNotificacion('Carrito vaciado');
    }

    // Calcular total
    calcularTotal() {
        return this.productos.reduce((total, producto) => {
            return total + (producto.precio * producto.cantidad);
        }, 0);
    }

    // Guardar carrito en localStorage
    guardarCarrito() {
        localStorage.setItem('carrito', JSON.stringify(this.productos));
    }

    // Renderizar carrito en la página
    renderizarCarrito() {
        const contenedorCarrito = document.querySelector('.contenedor-carrito');
        const carritoVacio = document.querySelector('.carrito-vacio');
        const carritoProductos = document.querySelector('.carrito-productos');
        const totalElement = document.getElementById('total');

        if (!contenedorCarrito) return;

        if (this.productos.length === 0) {
            carritoVacio.style.display = 'block';
            carritoProductos.style.display = 'none';
            if (totalElement) totalElement.textContent = '$0';
        } else {
            carritoVacio.style.display = 'none';
            carritoProductos.style.display = 'flex';
            
            carritoProductos.innerHTML = this.productos.map(producto => `
                <div class="carrito-producto" data-id="${producto.id}">
                    <img class="carrito-imagen" src="${producto.imagen}" alt="${producto.nombre}">
                    <div class="carrito-producto-titulo">
                        <small>Título</small>
                        <h3 class="h3carrito">${producto.nombre}</h3>
                    </div>
                    <div class="carrito-producto-cantidad">
                        <small>Cantidad</small>
                        <div class="cantidad-controls">
                            <button class="btn-cantidad" onclick="carrito.actualizarCantidad('${producto.id}', ${producto.cantidad - 1})">-</button>
                            <span class="cantidad-valor">${producto.cantidad}</span>
                            <button class="btn-cantidad" onclick="carrito.actualizarCantidad('${producto.id}', ${producto.cantidad + 1})">+</button>
                        </div>
                    </div>
                    <div class="carrito-producto-precio">
                        <small>Precio</small>
                        <h3 class="h3carrito">$${producto.precio}</h3>
                    </div>
                    <div class="carrito-producto-subtotal">
                        <small>Subtotal</small>
                        <h3 class="h3carrito">$${producto.precio * producto.cantidad}</h3>
                    </div>
                    <button class="carrito-producto-eliminar" onclick="carrito.removerProducto('${producto.id}')">
                        <i class="bi bi-trash-fill"></i> Eliminar
                    </button>
                </div>
            `).join('');

            if (totalElement) {
                totalElement.textContent = `$${this.calcularTotal()}`;
            }
        }
    }

    // Actualizar contador en el header
    actualizarContador() {
        const contador = document.getElementById('cart-count');
        if (contador) {
            const totalItems = this.productos.reduce((total, producto) => total + producto.cantidad, 0);
            contador.textContent = totalItems;
            
            if (totalItems > 0) {
                contador.classList.add('show');
            } else {
                contador.classList.remove('show');
            }
        }
    }

    // Mostrar notificación
    mostrarNotificacion(mensaje) {
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
        `;
        
        document.body.appendChild(notificacion);
        
        setTimeout(() => {
            notificacion.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                document.body.removeChild(notificacion);
            }, 300);
        }, 2000);
    }

    // Vincular eventos
    bindEvents() {
        // Botón vaciar carrito
        const btnVaciar = document.querySelector('.carrito-acciones-vaciar');
        if (btnVaciar) {
            btnVaciar.addEventListener('click', () => this.vaciarCarrito());
        }

        // Botón comprar
        const btnComprar = document.getElementById('carrito-acciones-comprar');
        if (btnComprar) {
            btnComprar.addEventListener('click', () => this.comprar());
        }
    }

    // Proceso de compra
    comprar() {
        if (this.productos.length === 0) {
            this.mostrarNotificacion('El carrito está vacío');
            return;
        }

        // Mostrar mensaje de compra exitosa
        const mensajeCompra = document.getElementById('carrito-comprado');
        if (mensajeCompra) {
            mensajeCompra.style.display = 'block';
            mensajeCompra.classList.remove('disabled');
        }

        // Limpiar carrito después de la compra
        setTimeout(() => {
            this.vaciarCarrito();
            if (mensajeCompra) {
                mensajeCompra.style.display = 'none';
                mensajeCompra.classList.add('disabled');
            }
        }, 3000);
    }
}

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

// Inicializar carrito
let carrito;

// Función para agregar producto al carrito (llamada desde los botones)
function agregarAlCarrito(productoId) {
    if (!carrito) {
        carrito = new Carrito();
    }
    
    const producto = productos[productoId];
    if (producto) {
        carrito.agregarProducto(producto);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    carrito = new Carrito();
    
    // Agregar estilos CSS para las animaciones
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        .cantidad-controls {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .btn-cantidad {
            background-color: var(--orange);
            color: white;
            border: none;
            border-radius: 50%;
            width: 25px;
            height: 25px;
            cursor: pointer;
            font-weight: bold;
        }
        
        .btn-cantidad:hover {
            background-color: var(--brown);
        }
        
        .cantidad-valor {
            font-weight: bold;
            min-width: 20px;
            text-align: center;
        }
    `;
    document.head.appendChild(style);
});
