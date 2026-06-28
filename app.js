/**
 * TechZone – Tienda Electrónica
 * app.js
 *
 * CUBRE EL RUBRIC COMPLETO:
 * 1. JS Básico: valores, tipos, operadores, estructuras de control
 * 2. Funciones: arrow functions, argumentos, recursividad, funciones crecientes
 * 3. Estructuras de datos: objetos, arrays, clases, mapas, prototipos, encapsulamiento, polimorfismo
 * 4. Eventos DOM: teclado, desplazamiento, foco, carga, temporizadores
 */

"use strict";

/* ═══════════════════════════════════════════════════════════
   1. VALORES, TIPOS Y OPERADORES – CATÁLOGO DE PRODUCTOS
   ═══════════════════════════════════════════════════════════ */

// Tipos primitivos: string, number, boolean
const SITE_NAME  = "TechZone";          // string
const IGV_RATE   = 0.18;               // number
const FREE_SHIP  = 299;                // number (umbral envío gratis)
const DEBUG_MODE = false;              // boolean

// Operadores aritméticos, comparación, lógicos
const calcIGV     = (sub) => +(sub * IGV_RATE).toFixed(2);                  // *
const calcTotal   = (sub) => +(sub + calcIGV(sub)).toFixed(2);              // +
const hasDiscount = (p)   => p.oldPrice !== null && p.oldPrice > p.price;   // !== &&
const pctOff      = (p)   => Math.round((1 - p.price / p.oldPrice) * 100); // -, /


/* ═══════════════════════════════════════════════════════════
   2. ESTRUCTURAS DE DATOS – CLASES, PROTOTIPOS, MAPAS
   ═══════════════════════════════════════════════════════════ */

// ── Clase base: Producto (prototipo + encapsulamiento)
class Producto {
  #id;
  #stock;

  constructor({ id, nombre, categoria, descripcion, precio, precioAnterior = null, emoji, badge = null, rating = 5, stock = 10, imagen = null }) {
    this.#id       = id;
    this.nombre    = nombre;
    this.categoria = categoria;
    this.descripcion = descripcion;
    this.precio    = precio;
    this.oldPrice  = precioAnterior;
    this.emoji     = emoji;
    this.badge     = badge;
    this.rating    = rating;
    this.#stock    = stock;
    this.imagen    = imagen;
  }

  get id()    { return this.#id; }
  get stock() { return this.#stock; }

  decrementarStock(qty = 1) {
    if (this.#stock >= qty) { this.#stock -= qty; return true; }
    return false;
  }

  // Método polimórfico: cada subclase puede sobrescribirlo
  descripcionCorta() {
    return `${this.nombre} – S/ ${this.precio.toFixed(2)}`;
  }

  estrellas() {
    return "★".repeat(this.rating) + "☆".repeat(5 - this.rating);
  }
}

// ── Subclase: Laptop (polimorfismo)
class Laptop extends Producto {
  constructor(data) {
    super({ ...data, categoria: "laptop" });
    this.ram  = data.ram;
    this.cpu  = data.cpu;
  }
  descripcionCorta() {
    return `${this.nombre} | ${this.ram} RAM – S/ ${this.precio.toFixed(2)}`;
  }
}

// ── Subclase: Componente (polimorfismo)
class Componente extends Producto {
  constructor(data) {
    super({ ...data, categoria: "componente" });
    this.garantia = data.garantia || "1 año";
  }
  descripcionCorta() {
    return `${this.nombre} | Garantía ${this.garantia} – S/ ${this.precio.toFixed(2)}`;
  }
}

// ── Catálogo (Array de instancias)
const catalogo = [
  new Laptop({ id: 1, nombre: "ASUS VivoBook 15", descripcion: "Intel Core i5 12va gen, SSD 512 GB, pantalla FHD IPS", precio: 2299, precioAnterior: 2799, emoji: "💻", badge: "sale", rating: 4, ram: "16 GB", cpu: "i5-1235U", stock: 8,
    imagen: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=280&fit=crop&auto=format" }),
  new Laptop({ id: 2, nombre: "Lenovo IdeaPad 3", descripcion: "AMD Ryzen 5 5500U, SSD 256 GB, batería 10 h", precio: 1899, emoji: "💻", badge: "new", rating: 4, ram: "8 GB", cpu: "Ryzen 5", stock: 12,
    imagen: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=280&fit=crop&auto=format" }),
  new Laptop({ id: 3, nombre: "HP Pavilion Gaming", descripcion: "Intel i7, RTX 3050, 144 Hz – ideal para gaming", precio: 3499, precioAnterior: 3999, emoji: "🎮", badge: "hot", rating: 5, ram: "16 GB", cpu: "i7-12700H", stock: 5,
    imagen: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=280&fit=crop&auto=format" }),
  new Componente({ id: 4, nombre: "RAM Kingston 16 GB", descripcion: "DDR4 3200 MHz – compatible con la mayoría de laptops", precio: 189, precioAnterior: 229, emoji: "🧠", badge: "sale", rating: 5, garantia: "2 años", stock: 20,
    imagen: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&h=280&fit=crop&auto=format" }),
  new Componente({ id: 5, nombre: "SSD WD Blue 1 TB", descripcion: "SATA III 2.5\", 560 MB/s lectura", precio: 279, emoji: "💾", badge: null, rating: 4, garantia: "3 años", stock: 15,
    imagen: "https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?w=400&h=280&fit=crop&auto=format" }),
  new Producto({ id: 6, nombre: "Samsung Galaxy A55", descripcion: "Pantalla AMOLED 6.6\" 120Hz, cámara 50MP, 5G, 256 GB", precio: 1299, precioAnterior: 1549, emoji: "📱", badge: "sale", categoria: "gadget", rating: 5, stock: 7,
    imagen: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=280&fit=crop&auto=format" }),
  new Producto({ id: 7, nombre: "iPhone 15 128 GB", descripcion: "Chip A16 Bionic, cámara 48MP, Dynamic Island, USB-C", precio: 3799, emoji: "📱", badge: "hot", categoria: "gadget", rating: 5, stock: 4,
    imagen: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=280&fit=crop&auto=format" }),
  new Producto({ id: 8, nombre: "Mouse Gamer Redragon", descripcion: "16000 DPI, 7 botones programables, RGB", precio: 89, emoji: "🖱️", badge: null, categoria: "periferico", rating: 4, stock: 30,
    imagen: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=280&fit=crop&auto=format" }),
  new Producto({ id: 9, nombre: "Audífonos Sony WH-1000", descripcion: "Cancelación activa de ruido, 30 h batería", precio: 599, precioAnterior: 749, emoji: "🎧", badge: "sale", categoria: "gadget", rating: 5, stock: 6,
    imagen: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=280&fit=crop&auto=format" }),
  new Producto({ id: 10, nombre: "Smartwatch Amazfit GTR", descripcion: "GPS, SpO2, 14 días batería, resistente al agua", precio: 329, emoji: "⌚", badge: "new", categoria: "gadget", rating: 4, stock: 10,
    imagen: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=280&fit=crop&auto=format" }),
  new Producto({ id: 11, nombre: "Webcam Logitech C920", descripcion: "Full HD 1080p, micrófono estéreo, compatible Zoom", precio: 239, emoji: "📷", badge: null, categoria: "periferico", rating: 5, stock: 18,
    imagen: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=280&fit=crop&auto=format" }),
  new Producto({ id: 12, nombre: "Hub USB-C 7 en 1", descripcion: "HDMI 4K, 3× USB-A, SD, PD 100W", precio: 119, precioAnterior: 149, emoji: "🔌", badge: "sale", categoria: "gadget", rating: 4, stock: 22,
    imagen: "https://images.unsplash.com/photo-1625895197185-efcec01cffe0?w=400&h=280&fit=crop&auto=format" }),
];

// ── Mapa de favoritos (Map – estructura de datos)
const favoritosMap = new Map();   // id → boolean


/* ═══════════════════════════════════════════════════════════
   3. CLASE CARRITO – ENCAPSULAMIENTO + MÉTODOS
   ═══════════════════════════════════════════════════════════ */

class Carrito {
  #items = [];  // array privado

  agregar(producto, cantidad = 1) {
    const existente = this.#items.find(i => i.producto.id === producto.id);
    if (existente) {
      existente.cantidad += cantidad;
    } else {
      this.#items.push({ producto, cantidad });
    }
  }

  quitar(productoId) {
    this.#items = this.#items.filter(i => i.producto.id !== productoId);
  }

  cambiarCantidad(productoId, delta) {
    const item = this.#items.find(i => i.producto.id === productoId);
    if (!item) return;
    item.cantidad += delta;
    if (item.cantidad <= 0) this.quitar(productoId);
  }

  vaciar() { this.#items = []; }

  get items()    { return [...this.#items]; }
  get totalItems() { return this.#items.reduce((s, i) => s + i.cantidad, 0); }

  get subtotal() {
    return +this.#items.reduce((s, i) => s + i.producto.precio * i.cantidad, 0).toFixed(2);
  }

  get igv()   { return calcIGV(this.subtotal); }
  get total() { return calcTotal(this.subtotal); }

  estaVacio() { return this.#items.length === 0; }
}

const carrito = new Carrito();


/* ═══════════════════════════════════════════════════════════
   4. FUNCIONES UTILITARIAS (FLECHA, RECURSIVA, CRECIENTE)
   ═══════════════════════════════════════════════════════════ */

// Función de flecha con argumento por defecto
const formatPrecio = (n, simbolo = "S/") => `${simbolo} ${n.toFixed(2)}`;

// Función recursiva: calcular descuento acumulado en carrito
const calcDescuentoRec = (items, acum = 0) => {
  if (items.length === 0) return +acum.toFixed(2);
  const [head, ...tail] = items;
  const ahorro = head.producto.oldPrice
    ? (head.producto.oldPrice - head.producto.precio) * head.cantidad
    : 0;
  return calcDescuentoRec(tail, acum + ahorro);
};

// Función creciente (generador de IDs de pedido ascendente)
const generadorPedido = (() => {
  let n = 1000;
  return () => `TZ-${++n}`;
})();

// Función de orden superior: filtrar catálogo por categoría
const filtrarCatalogo = (cat, lista = catalogo) =>
  cat === "todos" ? lista : lista.filter(p => p.categoria === cat);

// Función de validación con múltiples argumentos
const validarCampo = (valor, tipo = "texto", minLen = 2) => {
  if (tipo === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
  if (tipo === "tel")   return /^9\d{8}$/.test(valor);
  return valor.trim().length >= minLen;
};

// Función con rest params – construir resumen de pedido
const construirResumen = (...lineas) => lineas.join("\n");

/* ═══════════════════════════════════════════════════════════
   5. FUNCIONES DE RENDERIZADO DOM
   ═══════════════════════════════════════════════════════════ */

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// Crear tarjeta de producto
const crearTarjeta = (producto) => {
  const card = document.createElement("article");
  card.className = "product-card";
  card.dataset.id  = producto.id;
  card.dataset.cat = producto.categoria;

  const pct   = hasDiscount(producto) ? pctOff(producto) : 0;
  const esFav = favoritosMap.get(producto.id) || false;
  const stockPct = Math.min(100, Math.round((producto.stock / 30) * 100));

  card.innerHTML = `
    <div class="product-img">
      ${producto.imagen
        ? `<img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" /><span class="product-img-fallback" style="display:none">${producto.emoji}</span>`
        : `<span>${producto.emoji}</span>`
      }
      ${producto.badge ? `<span class="badge badge-${producto.badge}">${producto.badge === "sale" ? `-${pct}%` : producto.badge}</span>` : ""}
    </div>
    <div class="product-body">
      <p class="product-cat">${producto.categoria}</p>
      <p class="product-name">${producto.nombre}</p>
      <p class="product-desc">${producto.descripcionCorta()}</p>
      <p class="product-rating">${producto.estrellas()} (${producto.rating}/5)</p>
      <div class="product-price-row">
        <span class="price">${formatPrecio(producto.precio)}</span>
        ${producto.oldPrice ? `<span class="price-old">${formatPrecio(producto.oldPrice)}</span>` : ""}
      </div>
      <div class="stock-bar">
        <div class="stock-fill" style="width:${stockPct}%"></div>
      </div>
    </div>
    <div class="product-actions">
      <button class="btn-add" data-id="${producto.id}" aria-label="Agregar ${producto.nombre} al carrito">Agregar al carrito</button>
      <button class="btn-fav ${esFav ? "active" : ""}" data-id="${producto.id}" aria-label="Favorito">❤️</button>
    </div>
  `;
  return card;
};

// Renderizar grid de productos
const renderGrid = (lista = catalogo) => {
  const grid = $("#products-grid");
  grid.innerHTML = "";
  if (lista.length === 0) {
    grid.innerHTML = `<p style="color:var(--text-muted);padding:32px;grid-column:1/-1">No se encontraron productos.</p>`;
    return;
  }
  lista.forEach(p => grid.appendChild(crearTarjeta(p)));
};

// Renderizar items del carrito
const renderCarrito = () => {
  const cont = $("#cart-items");
  cont.innerHTML = "";

  if (carrito.estaVacio()) {
    cont.innerHTML = `<p class="cart-empty">Tu carrito está vacío.</p>`;
  } else {
    carrito.items.forEach(({ producto, cantidad }) => {
      const div = document.createElement("div");
      div.className = "cart-item";
      div.innerHTML = `
        <div class="cart-item-img">${producto.emoji}</div>
        <div class="cart-item-info">
          <p class="cart-item-name">${producto.nombre}</p>
          <p class="cart-item-price">${formatPrecio(producto.precio)} c/u</p>
          <button class="cart-item-remove" data-id="${producto.id}">Eliminar</button>
        </div>
        <div class="cart-item-controls">
          <button class="qty-btn" data-id="${producto.id}" data-delta="-1">−</button>
          <span class="cart-item-qty">${cantidad}</span>
          <button class="qty-btn" data-id="${producto.id}" data-delta="1">+</button>
        </div>
      `;
      cont.appendChild(div);
    });
  }

  // Actualizar totales
  $("#cart-subtotal").textContent = formatPrecio(carrito.subtotal);
  $("#cart-igv").textContent      = formatPrecio(carrito.igv);
  $("#cart-total").textContent    = formatPrecio(carrito.total);
  $("#cart-count").textContent    = carrito.totalItems;
};

// Toast notification
let toastTimer;
const mostrarToast = (msg) => {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 3000);
};

// Abrir / cerrar carrito
const abrirCarrito = () => {
  $("#cart-sidebar").classList.add("open");
  $("#cart-overlay").classList.add("visible");
};
const cerrarCarrito = () => {
  $("#cart-sidebar").classList.remove("open");
  $("#cart-overlay").classList.remove("visible");
};


/* ═══════════════════════════════════════════════════════════
   6. EVENTO: CARGA – DOMContentLoaded
   ═══════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {

  // Render inicial
  renderGrid();
  renderCarrito();

  // Mostrar atajo de teclado al cargar (temporizador)
  setTimeout(() => {
    const hint = $("#shortcut-hint");
    hint.classList.add("show");
    setTimeout(() => hint.classList.remove("show"), 5000);
  }, 2500);

  iniciarContadorOferta();
});


/* ═══════════════════════════════════════════════════════════
   7. EVENTOS DE TECLADO
   ═══════════════════════════════════════════════════════════ */
document.addEventListener("keydown", (e) => {
  const tag = document.activeElement.tagName;
  const enInput = ["INPUT", "TEXTAREA", "SELECT"].includes(tag);

  // C → abrir/cerrar carrito
  if (e.key.toLowerCase() === "c" && !enInput) {
    $("#cart-sidebar").classList.contains("open") ? cerrarCarrito() : abrirCarrito();
  }
  // Escape → cerrar modales
  if (e.key === "Escape") {
    cerrarCarrito();
    cerrarModal();
    $("#success-overlay").classList.remove("open");
  }
});


/* ═══════════════════════════════════════════════════════════
   8. EVENTO DE DESPLAZAMIENTO (SCROLL)
   ═══════════════════════════════════════════════════════════ */
window.addEventListener("scroll", () => {
  // Barra de progreso
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  $("#scroll-indicator").style.width = pct + "%";

  // Clase "scrolled" en header
  const header = $("#site-header");
  if (window.scrollY > 60) header.classList.add("scrolled");
  else header.classList.remove("scrolled");
}, { passive: true });


/* ═══════════════════════════════════════════════════════════
   9. EVENTOS DE FOCO – SEARCH INPUT
   ═══════════════════════════════════════════════════════════ */
const searchInput = $("#search-input");

searchInput.addEventListener("focus", () => {
  searchInput.parentElement.style.boxShadow = "0 0 0 3px rgba(0,212,255,.25)";
  searchInput.parentElement.style.borderRadius = "20px";
});
searchInput.addEventListener("blur", () => {
  searchInput.parentElement.style.boxShadow = "none";
  if (searchInput.value.trim() === "") renderGrid();
});

// Búsqueda en tiempo real con estructuras de control
searchInput.addEventListener("input", (e) => {
  const query = e.target.value.trim().toLowerCase();

  if (query.length === 0) {
    renderGrid();
    return;
  }

  // Estructuras de control: for...of + condicional
  const resultados = [];
  for (const p of catalogo) {
    if (
      p.nombre.toLowerCase().includes(query) ||
      p.descripcion.toLowerCase().includes(query) ||
      p.categoria.toLowerCase().includes(query)
    ) {
      resultados.push(p);
    }
  }

  renderGrid(resultados);
  if (resultados.length === 0) mostrarToast("Sin resultados para: " + query);
});


/* ═══════════════════════════════════════════════════════════
   10. DELEGACIÓN DE EVENTOS – GRID DE PRODUCTOS
   ═══════════════════════════════════════════════════════════ */
$("#products-grid").addEventListener("click", (e) => {
  // Agregar al carrito
  const btnAdd = e.target.closest(".btn-add");
  if (btnAdd) {
    const id   = Number(btnAdd.dataset.id);
    const prod = catalogo.find(p => p.id === id);
    if (!prod) return;

    if (prod.stock <= 0) {
      mostrarToast("⚠️ Sin stock disponible.");
      return;
    }

    carrito.agregar(prod, 1);
    renderCarrito();
    mostrarToast(`✅ "${prod.nombre}" agregado al carrito.`);

    // Animación del botón
    btnAdd.textContent = "✓ Agregado";
    btnAdd.style.background = "var(--success)";
    setTimeout(() => {
      btnAdd.textContent = "Agregar al carrito";
      btnAdd.style.background = "";
    }, 1500);
    return;
  }

  // Toggle favorito
  const btnFav = e.target.closest(".btn-fav");
  if (btnFav) {
    const id   = Number(btnFav.dataset.id);
    const esFav = !favoritosMap.get(id);
    favoritosMap.set(id, esFav);
    btnFav.classList.toggle("active", esFav);
    mostrarToast(esFav ? "❤️ Añadido a favoritos" : "💔 Eliminado de favoritos");
  }
});


/* ═══════════════════════════════════════════════════════════
   11. DELEGACIÓN DE EVENTOS – CARRITO
   ═══════════════════════════════════════════════════════════ */
$("#cart-items").addEventListener("click", (e) => {
  // Cambiar cantidad
  const qtyBtn = e.target.closest(".qty-btn");
  if (qtyBtn) {
    const id    = Number(qtyBtn.dataset.id);
    const delta = Number(qtyBtn.dataset.delta);
    carrito.cambiarCantidad(id, delta);
    renderCarrito();
    return;
  }
  // Eliminar item
  const removeBtn = e.target.closest(".cart-item-remove");
  if (removeBtn) {
    const id = Number(removeBtn.dataset.id);
    carrito.quitar(id);
    renderCarrito();
    mostrarToast("🗑️ Producto eliminado del carrito.");
  }
});

// Abrir / cerrar carrito
$("#cart-toggle").addEventListener("click", abrirCarrito);
$("#close-cart").addEventListener("click", cerrarCarrito);
$("#cart-overlay").addEventListener("click", cerrarCarrito);

// Vaciar carrito
$("#btn-clear").addEventListener("click", () => {
  if (carrito.estaVacio()) return;
  carrito.vaciar();
  renderCarrito();
  mostrarToast("🗑️ Carrito vaciado.");
});


/* ═══════════════════════════════════════════════════════════
   12. FILTROS DE CATEGORÍA
   ═══════════════════════════════════════════════════════════ */
$$(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    $$(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const cat = btn.dataset.filter;
    renderGrid(filtrarCatalogo(cat));
    searchInput.value = "";
    // Scroll suave a productos
    $("#products-grid").scrollIntoView({ behavior: "smooth", block: "start" });
  });
});


/* ═══════════════════════════════════════════════════════════
   13. MODAL DE CHECKOUT
   ═══════════════════════════════════════════════════════════ */
const abrirModal = () => {
  if (carrito.estaVacio()) { mostrarToast("⚠️ El carrito está vacío."); return; }
  cerrarCarrito();

  // Generar resumen con función rest params
  const lineas = carrito.items.map(i => `• ${i.producto.nombre} ×${i.cantidad} → ${formatPrecio(i.producto.precio * i.cantidad)}`);
  const ahorro = calcDescuentoRec(carrito.items);
  const resumen = construirResumen(
    ...lineas,
    "─────────────────────",
    `Subtotal: ${formatPrecio(carrito.subtotal)}`,
    `IGV (18%): ${formatPrecio(carrito.igv)}`,
    `Total: ${formatPrecio(carrito.total)}`,
    ahorro > 0 ? `Ahorro total: S/ ${ahorro.toFixed(2)}` : ""
  );
  $("#modal-summary").textContent = resumen;

  limpiarErrores();
  $("#modal-overlay").classList.add("open");
};

const cerrarModal = () => {
  $("#modal-overlay").classList.remove("open");
};

$("#btn-checkout").addEventListener("click", abrirModal);
$("#modal-close").addEventListener("click", cerrarModal);
$("#modal-overlay").addEventListener("click", (e) => { if (e.target === $("#modal-overlay")) cerrarModal(); });

// Validación y confirmación de pedido
const limpiarErrores = () => {
  ["name","email","phone","address","payment"].forEach(f => {
    const el = $(`#err-${f}`);
    if (el) el.textContent = "";
  });
};

$("#btn-confirm").addEventListener("click", () => {
  limpiarErrores();
  let ok = true;

  // Estructura de control: switch para tipos de validación
  const campos = [
    { id: "f-name",    err: "err-name",    tipo: "texto",  msg: "Ingresa tu nombre completo." },
    { id: "f-email",   err: "err-email",   tipo: "email",  msg: "Ingresa un correo válido." },
    { id: "f-phone",   err: "err-phone",   tipo: "tel",    msg: "Ingresa un teléfono peruano válido (9XXXXXXXX)." },
    { id: "f-address", err: "err-address", tipo: "texto",  msg: "Ingresa tu dirección." },
  ];

  campos.forEach(({ id, err, tipo, msg }) => {
    const val = $(("#" + id)).value;
    if (!validarCampo(val, tipo)) {
      $(("#" + err)).textContent = msg;
      ok = false;
    }
  });

  const metodo = $("#f-payment").value;
  if (!metodo) {
    $("#err-payment").textContent = "Selecciona un método de pago.";
    ok = false;
  }

  if (!ok) return;

  // Pedido confirmado
  const numeroPedido = generadorPedido();
  const nombre = $("#f-name").value.trim();
  cerrarModal();
  carrito.vaciar();
  renderCarrito();

  const descuento = calcDescuentoRec(carrito.items);
  $("#success-msg").textContent = `Hola ${nombre}, tu pedido ${numeroPedido} fue registrado. 
  Te enviaremos una confirmación pronto. ¡Gracias por elegir ${SITE_NAME}! 🚀`;
  $("#success-overlay").classList.add("open");
});

$("#btn-success-close").addEventListener("click", () => {
  $("#success-overlay").classList.remove("open");
  renderGrid();
});


/* ═══════════════════════════════════════════════════════════
   14. TEMPORIZADOR – CUENTA REGRESIVA OFERTA DEL DÍA
   ═══════════════════════════════════════════════════════════ */
const iniciarContadorOferta = () => {
  // Fija el fin al final del día actual
  const ahora     = new Date();
  const finDia    = new Date(ahora);
  finDia.setHours(23, 59, 59, 0);
  let restante = finDia - ahora;

  const pad = (n) => String(n).padStart(2, "0");

  const tick = () => {
    if (restante <= 0) {
      // Estructura de control: reiniciar al día siguiente
      restante = 24 * 60 * 60 * 1000;
    }

    const h = Math.floor(restante / 3_600_000);
    const m = Math.floor((restante % 3_600_000) / 60_000);
    const s = Math.floor((restante % 60_000) / 1_000);

    $("#cd-h").textContent = pad(h);
    $("#cd-m").textContent = pad(m);
    $("#cd-s").textContent = pad(s);

    restante -= 1000;
  };

  tick();
  setInterval(tick, 1000);  // EVENTO: temporizador con setInterval
};


/* ═══════════════════════════════════════════════════════════
   15. FORMULARIO DE CONTACTO
   ═══════════════════════════════════════════════════════════ */
$("#btn-contact").addEventListener("click", () => {
  const nombre  = $("#c-name").value.trim();
  const email   = $("#c-email").value.trim();
  const mensaje = $("#c-msg").value.trim();

  // Estructura de control: if / else if / else
  if (!nombre || nombre.length < 2) {
    mostrarToast("⚠️ Ingresa tu nombre (mín. 2 caracteres).");
  } else if (!validarCampo(email, "email")) {
    mostrarToast("⚠️ Ingresa un correo electrónico válido.");
  } else if (mensaje.length < 10) {
    mostrarToast("⚠️ El mensaje debe tener al menos 10 caracteres.");
  } else {
    mostrarToast(`✅ Mensaje enviado, ${nombre}. ¡Te respondemos pronto!`);
    $("#c-name").value  = "";
    $("#c-email").value = "";
    $("#c-msg").value   = "";
  }
});

// EVENTO: Contador de caracteres en textarea de contacto (foco + input)
const msgTextarea = $("#c-msg");
msgTextarea.addEventListener("focus", () => {
  if (!$("#char-count")) {
    const counter = document.createElement("small");
    counter.id = "char-count";
    counter.style.cssText = "color:var(--text-muted);font-size:12px;";
    counter.textContent = "0 / 500";
    msgTextarea.parentElement.appendChild(counter);
  }
});
msgTextarea.addEventListener("input", () => {
  const el = $("#char-count");
  if (el) el.textContent = `${msgTextarea.value.length} / 500`;
});


/* ═══════════════════════════════════════════════════════════
   16. SMOOTH SCROLL EN NAV LINKS
   ═══════════════════════════════════════════════════════════ */
$$(".nav-link").forEach(link => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");
    if (href.startsWith("#")) {
      e.preventDefault();
      const target = $(href);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});


/* ═══════════════════════════════════════════════════════════
   17. MODO DEBUG (operador typeof, operador ternario)
   ═══════════════════════════════════════════════════════════ */
if (DEBUG_MODE) {
  console.log(`[${SITE_NAME}] DEBUG activo`);
  console.log("Catálogo cargado:", catalogo.length, "productos");
  console.log("IGV_RATE es de tipo:", typeof IGV_RATE);
  console.log("FREE_SHIP activo:", FREE_SHIP > 0 ? "sí" : "no");
}
