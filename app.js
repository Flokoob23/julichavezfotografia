// Datos demo de albums y fotos (pueden venir de localStorage o backend)
let albums = [
  { id: 1, title: "Naturaleza", photos: [
    { id: 1, name: "Bosque", base64: "https://picsum.photos/id/1018/400/300" },
    { id: 2, name: "Montaña", base64: "https://picsum.photos/id/1015/400/300" }
  ]},
  { id: 2, title: "Ciudad", photos: [
    { id: 3, name: "Edificio", base64: "https://picsum.photos/id/1011/400/300" },
    { id: 4, name: "Calle", base64: "https://picsum.photos/id/1012/400/300" }
  ]},
];

// Carrito de compras
let cart = [];

// Variables estado
let currentAlbumId = null;
let currentPhotoIndex = null;

// Elementos DOM relevantes
const albumsContainer = document.getElementById("albums-container");
const photosSection = document.getElementById("photos-section");
const albumsSection = document.getElementById("albums-section");
const photosContainer = document.getElementById("photos-container");
const backToAlbumsBtn = document.getElementById("back-to-albums");
const albumTitle = document.getElementById("album-title");

const photoModal = document.getElementById("photo-modal");
const photoModalImg = document.getElementById("photo-modal-img");
const photoModalTitle = document.getElementById("photo-modal-title");
const photoCloseBtn = document.getElementById("photo-close-btn");
const prevPhotoBtn = document.getElementById("prev-photo-btn");
const nextPhotoBtn = document.getElementById("next-photo-btn");
const toggleCartBtn = document.getElementById("toggle-cart-btn");

const cartModal = document.getElementById("cart-modal");
const cartCloseBtn = document.getElementById("cart-close-btn");
const cartItemsModal = document.getElementById("cart-items-modal");
const cartTotalModal = document.getElementById("cart-total-modal");
const checkoutBtnModal = document.getElementById("checkout-btn-modal");

const cartIconBtn = document.getElementById("cart-icon-btn");
const cartCount = document.getElementById("cart-count");

const checkoutSection = document.getElementById("checkout-section");
const checkoutForm = document.getElementById("checkout-form");
const paymentAmountSpan = document.getElementById("payment-amount");
const cancelCheckoutBtn = document.getElementById("cancel-checkout");

const deliveryMethodSelect = document.getElementById("delivery-method");
const deliveryContactInput = document.getElementById("delivery-contact");
const deliveryContactLabel = document.getElementById("delivery-contact-label");

// Admin modal elements
const adminToggleBtn = document.getElementById("admin-toggle");
const adminLoginModal = document.getElementById("admin-login-modal");
const adminLoginCloseBtn = document.getElementById("admin-login-close");
const adminLoginForm = document.getElementById("admin-login-form");
const adminLoginMsg = document.getElementById("admin-login-msg");
const adminPanelModal = document.getElementById("admin-panel-modal");
const adminPanelCloseBtn = document.getElementById("admin-panel-close");

const newAlbumTitleInput = document.getElementById("new-album-title");
const addAlbumBtn = document.getElementById("add-album-btn");
const adminAlbumList = document.getElementById("admin-album-list");

const photoUploadInput = document.getElementById("photo-upload");
const addPhotosBtn = document.getElementById("add-photos-btn");

const purchaseRecordsTbody = document.querySelector("#purchase-records tbody");
const adminLogoutBtn = document.getElementById("admin-logout-btn");

// Admin credentials demo (¡cambiar a algo seguro en producción!)
const ADMIN_USER = "tesai25";
const ADMIN_PASS = "julifotos25";

// --- FUNCIONES PRINCIPALES ---

// Render álbumes en la UI
function renderAlbums() {
  albumsContainer.innerHTML = "";
  albums.forEach(album => {
    const div = document.createElement("div");
    div.className = "album-card";
    div.tabIndex = 0;
    div.setAttribute("role", "button");
    div.setAttribute("aria-label", `Abrir álbum ${album.title}`);
    div.textContent = album.title;
    div.onclick = () => openAlbum(album.id);
    div.onkeydown = e => { if(e.key === "Enter") openAlbum(album.id); };
    albumsContainer.appendChild(div);
  });
}

// Abrir álbum para mostrar fotos
function openAlbum(albumId) {
  currentAlbumId = albumId;
  const album = albums.find(a => a.id === albumId);
  if (!album) return;
  albumTitle.textContent = album.title;
  photosContainer.innerHTML = "";
  album.photos.forEach((photo, i) => {
    const div = document.createElement("div");
    div.className = "photo-card";
    div.tabIndex = 0;
    div.setAttribute("role", "button");
    div.setAttribute("aria-label", `Abrir foto ${photo.name}`);
    const img = document.createElement("img");
    img.src = photo.base64;
    img.alt = photo.name;
    div.appendChild(img);
    div.onclick = () => openPhoto(i);
    div.onkeydown = e => { if(e.key === "Enter") openPhoto(i); };
    photosContainer.appendChild(div);
  });
  albumsSection.classList.add("hidden");
  photosSection.classList.remove("hidden");
}

// Volver a lista de álbumes
backToAlbumsBtn.addEventListener("click", () => {
  photosSection.classList.add("hidden");
  albumsSection.classList.remove("hidden");
  currentAlbumId = null;
});

// Abrir modal foto grande
function openPhoto(index) {
  currentPhotoIndex = index;
  const album = albums.find(a => a.id === currentAlbumId);
  if (!album) return;
  const photo = album.photos[index];
  if (!photo) return;
  photoModalImg.src = photo.base64;
  photoModalImg.alt = photo.name;
  photoModalTitle.textContent = photo.name;
  photoModal.classList.remove("hidden");
  toggleCartBtn.textContent = cart.some(p => p.id === photo.id) ? "Quitar del carrito" : "Agregar al carrito";
  toggleCartBtn.focus();
}

// Cerrar modal foto
photoCloseBtn.addEventListener("click", () => {
  photoModal.classList.add("hidden");
  currentPhotoIndex = null;
});

// Navegar fotos en modal
prevPhotoBtn.addEventListener("click", () => {
  if (currentPhotoIndex === null) return;
  const album = albums.find(a => a.id === currentAlbumId);
  if (!album) return;
  currentPhotoIndex = (currentPhotoIndex - 1 + album.photos.length) % album.photos.length;
  openPhoto(currentPhotoIndex);
});
nextPhotoBtn.addEventListener("click", () => {
  if (currentPhotoIndex === null) return;
  const album = albums.find(a => a.id === currentAlbumId);
  if (!album) return;
  currentPhotoIndex = (currentPhotoIndex + 1) % album.photos.length;
  openPhoto(currentPhotoIndex);
});

// Agregar o quitar foto del carrito
toggleCartBtn.addEventListener("click", () => {
  const album = albums.find(a => a.id === currentAlbumId);
  if (!album || currentPhotoIndex === null) return;
  const photo = album.photos[currentPhotoIndex];
  const indexInCart = cart.findIndex(p => p.id === photo.id);
  if (indexInCart >= 0) {
    cart.splice(indexInCart, 1);
    toggleCartBtn.textContent = "Agregar al carrito";
  } else {
    cart.push(photo);
    toggleCartBtn.textContent = "Quitar del carrito";
  }
  updateCartCount();
});

// Mostrar cantidad en carrito
function updateCartCount() {
  cartCount.textContent = cart.length;
}

// Abrir modal carrito
cartIconBtn.addEventListener("click", () => {
  renderCart();
  cartModal.classList.remove("hidden");
});

// Cerrar modal carrito
cartCloseBtn.addEventListener("click", () => {
  cartModal.classList.add("hidden");
});

// Render carrito en modal
function renderCart() {
  cartItemsModal.innerHTML = "";
  if (cart.length === 0) {
    cartItemsModal.textContent = "No hay fotos en el carrito.";
    checkoutBtnModal.disabled = true;
    cartTotalModal.textContent = "$0";
    return;
  }
  cart.forEach(photo => {
    const div = document.createElement("div");
    div.textContent = photo.name;
    cartItemsModal.appendChild(div);
  });
  checkoutBtnModal.disabled = false;
  // Precio fijo por foto (ejemplo $1500)
  cartTotalModal.textContent = `$${cart.length * 1500}`;
  paymentAmountSpan.textContent = `$${cart.length * 1500}`;
}

// Botón finalizar compra en modal carrito abre sección checkout
checkoutBtnModal.addEventListener("click", () => {
  cartModal.classList.add("hidden");
  checkoutSection.classList.remove("hidden");
});

// Cancelar checkout
cancelCheckoutBtn.addEventListener("click", () => {
  checkoutSection.classList.add("hidden");
});

// Mostrar input contacto según delivery method
deliveryMethodSelect.addEventListener("change", () => {
  const val = deliveryMethodSelect.value;
  if (val === "correo" || val === "whatsapp") {
    deliveryContactLabel.classList.remove("hidden");
    deliveryContactInput.classList.remove("hidden");
    deliveryContactInput.required = true;
  } else {
    deliveryContactLabel.classList.add("hidden");
    deliveryContactInput.classList.add("hidden");
    deliveryContactInput.required = false;
  }
});

// --- ADMIN LOGIN Y PANEL ---

// Abrir modal login admin
adminToggleBtn.addEventListener("click", () => {
  adminLoginMsg.textContent = "";
  adminLoginForm.reset();
  adminLoginModal.classList.remove("hidden");
  adminLoginModal.querySelector("input").focus();
});

// Cerrar modal login admin
adminLoginCloseBtn.addEventListener("click", () => {
  adminLoginModal.classList.add("hidden");
});

// Manejar login admin
adminLoginForm.addEventListener("submit", e => {
  e.preventDefault();
  const username = adminLoginForm["admin-username"].value.trim();
  const password = adminLoginForm["admin-password"].value.trim();
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    adminLoginMsg.textContent = "";
    adminLoginModal.classList.add("hidden");
    openAdminPanel();
  } else {
    adminLoginMsg.textContent = "Usuario o contraseña incorrectos";
  }
});

// Abrir modal panel admin
function openAdminPanel() {
  renderAdminAlbumList();
  photoUploadInput.value = "";
  addPhotosBtn.disabled = true;
  newAlbumTitleInput.value = "";
  addAlbumBtn.disabled = true;
  adminPanelModal.classList.remove("hidden");
}

// Cerrar modal panel admin
adminPanelCloseBtn.addEventListener("click", () => {
  adminPanelModal.classList.add("hidden");
});

// Render lista álbumes en admin panel
function renderAdminAlbumList() {
  adminAlbumList.innerHTML = "";
  albums.forEach(album => {
    const li = document.createElement("li");
    li.textContent = album.title;
    // Botón eliminar álbum
    const delBtn = document.createElement("button");
    delBtn.setAttribute("aria-label", `Eliminar álbum ${album.title}`);
    delBtn.textContent = "✖";
    delBtn.onclick = () => {
      if (confirm(`¿Eliminar álbum "${album.title}"? Esta acción es irreversible.`)) {
        albums = albums.filter(a => a.id !== album.id);
        renderAdminAlbumList();
        renderAlbums();
      }
    };
    li.appendChild(delBtn);
    adminAlbumList.appendChild(li);
  });
}

// Validar input para agregar álbum
newAlbumTitleInput.addEventListener("input", () => {
  addAlbumBtn.disabled = newAlbumTitleInput.value.trim() === "";
});

// Agregar álbum
addAlbumBtn.addEventListener("click", () => {
  const title = newAlbumTitleInput.value.trim();
  if (title === "") return;
  const newId = albums.length ? Math.max(...albums.map(a => a.id)) + 1 : 1;
  albums.push({ id: newId, title, photos: [] });
  newAlbumTitleInput.value = "";
  addAlbumBtn.disabled = true;
  renderAdminAlbumList();
  renderAlbums();
});

// Habilitar botón agregar fotos solo si hay archivos seleccionados y álbum seleccionado
photoUploadInput.addEventListener("change", () => {
  addPhotosBtn.disabled = photoUploadInput.files.length === 0;
});

// Agregar fotos al álbum seleccionado (último álbum en la lista para simplicidad)
addPhotosBtn.addEventListener("click", () => {
  if (albums.length === 0) {
    alert("Primero debe agregar un álbum.");
    return;
  }
  const album = albums[albums.length - 1]; // simplificado: agregar siempre al último álbum
  const files = photoUploadInput.files;
  const validFiles = [];
  for (const file of files) {
    if (!file.type.startsWith("image/")) continue;
    validFiles.push(file);
  }
  if (validFiles.length === 0) return;

  // Leer archivos y convertir a base64
  let loadedCount = 0;
  validFiles.forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      album.photos.push({
        id: Date.now() + Math.random(),
        name: file.name,
        base64: e.target.result
      });
      loadedCount++;
      if (loadedCount === validFiles.length) {
        renderAlbums();
        photoUploadInput.value = "";
        addPhotosBtn.disabled = true;
        alert("Fotos agregadas correctamente al álbum: " + album.title);
      }
    };
    reader.readAsDataURL(file);
  });
});

// Registro de compras (demo vacía)
function renderPurchaseRecords() {
  purchaseRecordsTbody.innerHTML = "";
  // Si tienes registros reales, iterar acá
  const demoRecords = [
    {
      name: "Juan Perez",
      comprobante: "imagen_comprobante.png",
      date: "2025-07-20",
      photosBought: ["Bosque", "Calle"]
    }
  ];
  demoRecords.forEach(r => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${r.name}</td>
      <td>${r.comprobante}</td>
      <td>${r.date}</td>
      <td>${r.photosBought.join(", ")}</td>
    `;
    purchaseRecordsTbody.appendChild(tr);
  });
}

// Inicializar
renderAlbums();
renderPurchaseRecords();
updateCartCount();
