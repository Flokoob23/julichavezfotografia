"use strict";

// CONSTANTES ADMIN
const ADMIN_USER = "tesai25";
const ADMIN_PASS = "julifotos25";

// Datos en localStorage keys
const LS_ALBUMS_KEY = "juli_albums";
const LS_PURCHASES_KEY = "juli_purchases";

// Estado app
let albums = [];
let purchases = [];
let cart = [];
let currentAlbumId = null;
let currentPhotoIndex = null;

// Elementos DOM
const albumsContainer = document.getElementById("albums-container");
const photosSection = document.getElementById("photos-section");
const albumsSection = document.getElementById("albums-section");
const albumTitle = document.getElementById("album-title");
const photosContainer = document.getElementById("photos-container");
const backToAlbumsBtn = document.getElementById("back-to-albums");

const photoModal = document.getElementById("photo-modal");
const photoModalTitle = document.getElementById("photo-modal-title");
const photoModalImg = document.getElementById("photo-modal-img");
const photoCloseBtn = document.getElementById("photo-close-btn");
const prevPhotoBtn = document.getElementById("prev-photo-btn");
const nextPhotoBtn = document.getElementById("next-photo-btn");
const toggleCartBtn = document.getElementById("toggle-cart-btn");

const cartIconBtn = document.getElementById("cart-icon-btn");
const cartCountSpan = document.getElementById("cart-count");
const cartModal = document.getElementById("cart-modal");
const cartItemsModal = document.getElementById("cart-items-modal");
const cartTotalModal = document.getElementById("cart-total-modal");
const cartCloseBtn = document.getElementById("cart-close-btn");
const checkoutBtnModal = document.getElementById("checkout-btn-modal");

const checkoutSection = document.getElementById("checkout-section");
const checkoutForm = document.getElementById("checkout-form");
const customerNameInput = document.getElementById("customer-name");
const deliveryMethodSelect = document.getElementById("delivery-method");
const deliveryContactLabel = document.getElementById("delivery-contact-label");
const deliveryContactInput = document.getElementById("delivery-contact");
const paymentAmountSpan = document.getElementById("payment-amount");
const paymentProofInput = document.getElementById("paymentProof");
const cancelCheckoutBtn = document.getElementById("cancel-checkout");

const adminOpenBtn = document.getElementById("admin-open-btn");
const adminLoginModal = document.getElementById("admin-login-modal");
const adminLoginCloseBtn = document.getElementById("admin-login-close-btn");
const adminLoginForm = document.getElementById("admin-login-form");
const adminLoginMsg = document.getElementById("admin-login-msg");

const adminPanelModal = document.getElementById("admin-panel-modal");
const adminPanelCloseBtn = document.getElementById("admin-panel-close-btn");

const newAlbumTitleInput = document.getElementById("new-album-title");
const addAlbumBtn = document.getElementById("add-album-btn");
const adminAlbumList = document.getElementById("admin-album-list");
const photoUploadInput = document.getElementById("photo-upload");
const addPhotosBtn = document.getElementById("add-photos-btn");
const adminPhotoUploadSection = document.getElementById("admin-photo-upload-section");
const selectedAlbumNameSpan = document.getElementById("selected-album-name");
const uploadStatusContainer = document.getElementById("upload-status-container");

const purchaseRecordsTableBody = document.querySelector("#purchase-records tbody");

// --- UTILIDADES ---
function saveToStorage() {
  localStorage.setItem(LS_ALBUMS_KEY, JSON.stringify(albums));
  localStorage.setItem(LS_PURCHASES_KEY, JSON.stringify(purchases));
}

function loadFromStorage() {
  const albumsData = localStorage.getItem(LS_ALBUMS_KEY);
  const purchasesData = localStorage.getItem(LS_PURCHASES_KEY);

  albums = albumsData ? JSON.parse(albumsData) : getInitialAlbums();
  purchases = purchasesData ? JSON.parse(purchasesData) : [];
}

function getInitialAlbums() {
  // Puedes precargar álbumes iniciales aquí si quieres, o devolver vacío []
  return [
    {
      id: generateId(),
      title: "Bodas",
      photos: [],
    },
    {
      id: generateId(),
      title: "Quinceaños",
      photos: [],
    },
  ];
}

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

// --- RENDERIZADO ALBUMES ---
function renderAlbums() {
  albumsContainer.innerHTML = "";
  albums.forEach((album) => {
    const div = document.createElement("div");
    div.className = "album-card";
    div.tabIndex = 0;
    div.setAttribute("role", "button");
    div.setAttribute("aria-label", `Abrir álbum ${album.title}`);
    div.textContent = album.title;

    div.addEventListener("click", () => {
      openAlbum(album.id);
    });
    div.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        openAlbum(album.id);
      }
    });

    albumsContainer.appendChild(div);
  });
}

// --- ABRIR ÁLBUM ---
function openAlbum(albumId) {
  currentAlbumId = albumId;
  const album = albums.find((a) => a.id === albumId);
  if (!album) return;

  albumTitle.textContent = album.title;
  photosContainer.innerHTML = "";
  album.photos.forEach((photo, idx) => {
    const div = document.createElement("div");
    div.className = "photo-card";
    div.tabIndex = 0;
    div.setAttribute("role", "button");
    div.setAttribute("aria-label", `Abrir foto ${photo.name || "sin nombre"}`);
    const img = document.createElement("img");
    img.src = photo.base64 || photo.url || "";
    img.alt = photo.name || "Foto";

    div.appendChild(img);
    div.addEventListener("click", () => openPhotoModal(idx));
    div.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") openPhotoModal(idx);
    });
    photosContainer.appendChild(div);
  });

  albumsSection.classList.add("hidden");
  photosSection.classList.remove("hidden");
}

// --- VOLVER A ALBUMES ---
backToAlbumsBtn.addEventListener("click", () => {
  photosSection.classList.add("hidden");
  albumsSection.classList.remove("hidden");
  currentAlbumId = null;
  currentPhotoIndex = null;
  closePhotoModal();
});

// --- MODAL FOTO ---
function openPhotoModal(photoIndex) {
  currentPhotoIndex = photoIndex;
  const album = albums.find((a) => a.id === currentAlbumId);
  if (!album) return;

  const photo = album.photos[photoIndex];
  if (!photo) return;

  photoModalTitle.textContent = photo.name || "Foto";
  photoModalImg.src = photo.base64 || photo.url || "";
  updateToggleCartBtn();

  photoModal.classList.remove("hidden");
  photoModal.focus();
}

function closePhotoModal() {
  photoModal.classList.add("hidden");
  currentPhotoIndex = null;
}

photoCloseBtn.addEventListener("click", closePhotoModal);
photoModal.addEventListener("click", (e) => {
  if (e.target === photoModal) closePhotoModal();
});

// Navegar fotos modal
prevPhotoBtn.addEventListener("click", () => {
  if (currentPhotoIndex === null) return;
  const album = albums.find((a) => a.id === currentAlbumId);
  if (!album) return;
  const newIndex = (currentPhotoIndex - 1 + album.photos.length) % album.photos.length;
  openPhotoModal(newIndex);
});
nextPhotoBtn.addEventListener("click", () => {
  if (currentPhotoIndex === null) return;
  const album = albums.find((a) => a.id === currentAlbumId);
  if (!album) return;
  const newIndex = (currentPhotoIndex + 1) % album.photos.length;
  openPhotoModal(newIndex);
});

// --- CARRITO ---

// Añadir/quitar foto del carrito desde modal
toggleCartBtn.addEventListener("click", () => {
  if (currentPhotoIndex === null || currentAlbumId === null) return;
  const album = albums.find((a) => a.id === currentAlbumId);
  if (!album) return;
  const photo = album.photos[currentPhotoIndex];
  if (!photo) return;

  const cartIndex = cart.findIndex(
    (item) => item.albumId === currentAlbumId && item.photoId === photo.id
  );
  if (cartIndex === -1) {
    cart.push({
      albumId: currentAlbumId,
      photoId: photo.id,
      photoName: photo.name || "Foto",
      price: 1500,
    });
  } else {
    cart.splice(cartIndex, 1);
  }
  updateCartCount();
  updateToggleCartBtn();
});

// Actualizar botón toggle en modal foto
function updateToggleCartBtn() {
  if (currentPhotoIndex === null || currentAlbumId === null) return;
  const album = albums.find((a) => a.id === currentAlbumId);
  if (!album) return;
  const photo = album.photos[currentPhotoIndex];
  if (!photo) return;

  const inCart = cart.some(
    (item) => item.albumId === currentAlbumId && item.photoId === photo.id
  );
  toggleCartBtn.textContent = inCart ? "❌ Quitar del carrito" : "➕ Agregar al carrito";
}

// Actualizar contador carrito
function updateCartCount() {
  cartCountSpan.textContent = cart.length;
}

// Mostrar modal carrito
cartIconBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("El carrito está vacío.");
    return;
  }
  renderCartModal();
  cartModal.classList.remove("hidden");
  cartModal.focus();
});

cartCloseBtn.addEventListener("click", () => {
  cartModal.classList.add("hidden");
});

// Renderizar carrito en modal
function renderCartModal() {
  cartItemsModal.innerHTML = "";
  cart.forEach((item, idx) => {
    const div = document.createElement("div");
    div.className = "cart-item";
    div.textContent = `${item.photoName} - $${item.price.toLocaleString("es-AR")}`;

    // Botón eliminar
    const btnDel = document.createElement("button");
    btnDel.textContent = "✖";
    btnDel.title = "Quitar del carrito";
    btnDel.addEventListener("click", () => {
      cart.splice(idx, 1);
      updateCartCount();
      renderCartModal();
    });

    div.appendChild(btnDel);
    cartItemsModal.appendChild(div);
  });

  const total = cart.reduce((acc, item) => acc + item.price, 0);
  cartTotalModal.textContent = `Total: $${total.toLocaleString("es-AR")}`;
}

// --- CHECKOUT ---

checkoutBtnModal.addEventListener("click", () => {
  cartModal.classList.add("hidden");
  checkoutSection.classList.remove("hidden");

  // Mostrar total
  const total = cart.reduce((acc, item) => acc + item.price, 0);
  paymentAmountSpan.textContent = `$${total.toLocaleString("es-AR")}`;
});

// Mostrar input según método entrega
deliveryMethodSelect.addEventListener("change", () => {
  if (deliveryMethodSelect.value === "correo") {
    deliveryContactLabel.textContent = "Correo electrónico:";
    deliveryContactLabel.classList.remove("hidden");
    deliveryContactInput.classList.remove("hidden");
    deliveryContactInput.type = "email";
    deliveryContactInput.value = "";
    deliveryContactInput.placeholder = "ejemplo@correo.com";
  } else if (deliveryMethodSelect.value === "whatsapp") {
    deliveryContactLabel.textContent = "Número de WhatsApp:";
    deliveryContactLabel.classList.remove("hidden");
    deliveryContactInput.classList.remove("hidden");
    deliveryContactInput.type = "tel";
    deliveryContactInput.value = "";
    deliveryContactInput.placeholder = "+54 9 11 1234 5678";
  } else {
    deliveryContactLabel.classList.add("hidden");
    deliveryContactInput.classList.add("hidden");
  }
});

// Cancelar checkout
cancelCheckoutBtn.addEventListener("click", () => {
  checkoutSection.classList.add("hidden");
});

//
Procesar compra
checkoutForm.addEventListener("submit", (e) => {
e.preventDefault();
const name = customerNameInput.value.trim();
const method = deliveryMethodSelect.value;
const contact = deliveryContactInput.value.trim();
const proof = paymentProofInput.files[0];

if (!name || !method || !contact || !proof) {
alert("Por favor, completa todos los campos y sube el comprobante.");
return;
}

purchases.push({
id: generateId(),
name,
method,
contact,
total: cart.reduce((acc, item) => acc + item.price, 0),
photoCount: cart.length,
timestamp: new Date().toISOString(),
});

saveToStorage();
cart = [];
updateCartCount();
checkoutSection.classList.add("hidden");
alert("¡Compra registrada correctamente!");
});

// --- ADMINISTRACIÓN ---

// Abrir login admin
adminOpenBtn.addEventListener("click", () => {
adminLoginModal.classList.remove("hidden");
adminLoginMsg.textContent = "";
});
adminLoginCloseBtn.addEventListener("click", () => {
adminLoginModal.classList.add("hidden");
});

// Login form
adminLoginForm.addEventListener("submit", (e) => {
e.preventDefault();
const user = adminLoginForm.username.value;
const pass = adminLoginForm.password.value;
if (user === ADMIN_USER && pass === ADMIN_PASS) {
adminLoginModal.classList.add("hidden");
openAdminPanel();
} else {
adminLoginMsg.textContent = "Usuario o contraseña incorrectos.";
}
});

function openAdminPanel() {
adminPanelModal.classList.remove("hidden");
renderAdminAlbumList();
renderPurchaseRecords();
}
adminPanelCloseBtn.addEventListener("click", () => {
adminPanelModal.classList.add("hidden");
});

// Agregar nuevo álbum
addAlbumBtn.addEventListener("click", () => {
const title = newAlbumTitleInput.value.trim();
if (!title) return;

const newAlbum = {
id: generateId(),
title,
photos: [],
};
albums.push(newAlbum);
saveToStorage();
newAlbumTitleInput.value = "";
renderAdminAlbumList();
renderAlbums();
});

// Mostrar lista álbumes en admin
function renderAdminAlbumList() {
adminAlbumList.innerHTML = "";
albums.forEach((album) => {
const li = document.createElement("li");
li.textContent = album.title;
li.tabIndex = 0;
li.addEventListener("click", () => {
adminPhotoUploadSection.classList.remove("hidden");
selectedAlbumNameSpan.textContent = album.title;
selectedAlbumNameSpan.dataset.albumId = album.id;
});
adminAlbumList.appendChild(li);
});
}

// Agregar fotos al álbum seleccionado
addPhotosBtn.addEventListener("click", () => {
const files = photoUploadInput.files;
const albumId = selectedAlbumNameSpan.dataset.albumId;
const album = albums.find((a) => a.id === albumId);
if (!album || files.length === 0) return;

uploadStatusContainer.innerHTML = "";

Array.from(files).forEach((file) => {
const reader = new FileReader();
const statusWrapper = document.createElement("div");
const label = document.createElement("div");
const barContainer = document.createElement("div");
const bar = document.createElement("div");
statusWrapper.className = "upload-status";
label.className = "progress-bar-label";
label.textContent = file.name;

barContainer.className = "progress-bar-container";
bar.className = "progress-bar";

barContainer.appendChild(bar);
statusWrapper.appendChild(label);
statusWrapper.appendChild(barContainer);
uploadStatusContainer.appendChild(statusWrapper);

reader.onprogress = (e) => {
  if (e.lengthComputable) {
    const percent = Math.round((e.loaded / e.total) * 100);
    bar.style.width = percent + "%";
  }
};

reader.onload = () => {
  album.photos.push({
    id: generateId(),
    name: file.name,
    base64: reader.result,
  });
  bar.style.width = "100%";
  bar.classList.add("complete");
  const check = document.createElement("span");
  check.textContent = "✔";
  check.className = "progress-checkmark";
  label.appendChild(check);
  saveToStorage();
  renderAlbums();
};

reader.readAsDataURL(file);
});

photoUploadInput.value = "";
});

// Mostrar registros de compra
function renderPurchaseRecords() {
purchaseRecordsTableBody.innerHTML = "";
purchases.forEach((purchase) => {
const row = document.createElement("tr");
row.innerHTML = <td>${purchase.name}</td> <td>${purchase.method}</td> <td>${purchase.contact}</td> <td>${purchase.photoCount}</td> <td>$${purchase.total.toLocaleString("es-AR")}</td> <td>${new Date(purchase.timestamp).toLocaleString("es-AR")}</td> ;
purchaseRecordsTableBody.appendChild(row);
});
}

// Cargar al inicio
loadFromStorage();
renderAlbums();
updateCartCount();
