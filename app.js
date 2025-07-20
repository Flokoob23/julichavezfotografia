// Datos persistentes en localStorage:
// albums: [{ id, title, photos: [{ id, name, base64 }] }]
// purchases: [{ name, comprobanteBase64, date, photosBought: [photoName] }]

// Constantes
const ADMIN_USER = "tesai25";
const ADMIN_PASS = "julifotos25";
const PHOTO_PRICE = 1500;

// Variables estado
let albums = [];
let purchases = [];
let currentAlbumId = null;
let currentPhotoIndex = 0;
let cart = [];

// Elementos DOM
const albumsContainer = document.getElementById("albums-container");
const photosSection = document.getElementById("photos-section");
const photosContainer = document.getElementById("photos-container");
const backToAlbumsBtn = document.getElementById("back-to-albums");
const albumTitle = document.getElementById("album-title");

const photoModal = document.getElementById("photo-modal");
const photoModalTitle = document.getElementById("photo-modal-title");
const photoModalImg = document.getElementById("photo-modal-img");
const photoCloseBtn = document.getElementById("photo-close-btn");
const prevPhotoBtn = document.getElementById("prev-photo-btn");
const nextPhotoBtn = document.getElementById("next-photo-btn");
const toggleCartBtn = document.getElementById("toggle-cart-btn");

const cartIconBtn = document.getElementById("cart-icon-btn");
const cartCount = document.getElementById("cart-count");
const cartModal = document.getElementById("cart-modal");
const cartCloseBtn = document.getElementById("cart-close-btn");
const cartItemsModal = document.getElementById("cart-items-modal");
const cartTotalModal = document.getElementById("cart-total-modal");
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

const adminToggleBtn = document.getElementById("admin-toggle");
const adminPanel = document.getElementById("admin-panel");
const adminLoginSection = document.getElementById("admin-login-section");
const adminUsernameInput = document.getElementById("admin-username");
const adminPasswordInput = document.getElementById("admin-password");
const adminLoginBtn = document.getElementById("admin-login-btn");
const adminLoginMsg = document.getElementById("admin-login-msg");
const adminControls = document.getElementById("admin-controls");
const adminLogoutBtn = document.getElementById("admin-logout-btn");
const newAlbumTitleInput = document.getElementById("new-album-title");
const addAlbumBtn = document.getElementById("add-album-btn");
const adminAlbumList = document.getElementById("admin-album-list");
const photoUploadInput = document.getElementById("photo-upload");
const addPhotosBtn = document.getElementById("add-photos-btn");
const purchaseRecordsTableBody = document.querySelector("#purchase-records tbody");

// --- Funciones de almacenamiento local ---
function saveToStorage() {
  localStorage.setItem("photoAlbums", JSON.stringify(albums));
  localStorage.setItem("photoPurchases", JSON.stringify(purchases));
}
function loadFromStorage() {
  const storedAlbums = localStorage.getItem("photoAlbums");
  const storedPurchases = localStorage.getItem("photoPurchases");
  albums = storedAlbums ? JSON.parse(storedAlbums) : [];
  purchases = storedPurchases ? JSON.parse(storedPurchases) : [];
}

// --- Funciones para generar IDs ---
function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

// --- Render álbumes ---
function renderAlbums() {
  albumsContainer.innerHTML = "";
  if (albums.length === 0) {
    albumsContainer.innerHTML = "<p>No hay álbumes aún.</p>";
    return;
  }
  albums.forEach((album) => {
    const div = document.createElement("div");
    div.className = "album-card";
    div.tabIndex = 0;
    div.setAttribute("role", "button");
    div.setAttribute("aria-pressed", "false");
    div.textContent = album.title;
    div.addEventListener("click", () => openAlbum(album.id));
    div.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        openAlbum(album.id);
      }
    });
    albumsContainer.appendChild(div);
  });
}

// --- Abrir álbum ---
function openAlbum(id) {
  currentAlbumId = id;
  const album = albums.find((a) => a.id === id);
  if (!album) return;
  albumTitle.textContent = album.title;
  photosContainer.innerHTML = "";
  album.photos.forEach((photo, index) => {
    const div = document.createElement("div");
    div.className = "photo-card";
    div.tabIndex = 0;
    div.setAttribute("role", "button");
    div.setAttribute("aria-pressed", "false");
    const img = document.createElement("img");
    img.src = photo.base64;
    img.alt = photo.name || "Foto";
    div.appendChild(img);
    div.addEventListener("click", () => openPhotoModal(index));
    div.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        openPhotoModal(index);
      }
    });
    photosContainer.appendChild(div);
  });
  photosSection.classList.remove("hidden");
  albumsContainer.parentElement.classList.add("hidden");
  checkoutSection.classList.add("hidden");
  photoModal.classList.add("hidden");
  cartModal.classList.add("hidden");
}

// --- Volver a álbumes ---
backToAlbumsBtn.addEventListener("click", () => {
  photosSection.classList.add("hidden");
  albumsContainer.parentElement.classList.remove("hidden");
  checkoutSection.classList.add("hidden");
  photoModal.classList.add("hidden");
  cartModal.classList.add("hidden");
  currentAlbumId = null;
  currentPhotoIndex = 0;
});

// --- Modal foto ---
function openPhotoModal(photoIndex) {
  currentPhotoIndex = photoIndex;
  const album = albums.find((a) => a.id === currentAlbumId);
  if (!album) return;
  const photo = album.photos[photoIndex];
  if (!photo) return;
  photoModalTitle.textContent = photo.name || "Foto";
  photoModalImg.src = photo.base64;
  photoModalImg.alt = photo.name || "Foto";
  updateToggleCartBtn();
  photoModal.classList.remove("hidden");
}

photoCloseBtn.addEventListener("click", () => {
  photoModal.classList.add("hidden");
});

prevPhotoBtn.addEventListener("click", () => {
  const album = albums.find((a) => a.id === currentAlbumId);
  if (!album) return;
  currentPhotoIndex = (currentPhotoIndex - 1 + album.photos.length) % album.photos.length;
  openPhotoModal(currentPhotoIndex);
});
nextPhotoBtn.addEventListener("click", () => {
  const album = albums.find((a) => a.id === currentAlbumId);
  if (!album) return;
  currentPhotoIndex = (currentPhotoIndex + 1) % album.photos.length;
  openPhotoModal(currentPhotoIndex);
});

// --- Carrito ---
function updateCartCount() {
  cartCount.textContent = cart.length;
  cartIconBtn.disabled = cart.length === 0;
}

function isPhotoInCart(photoId) {
  return cart.some((item) => item.id === photoId);
}

function updateToggleCartBtn() {
  const album = albums.find((a) => a.id === currentAlbumId);
  if (!album) return;
  const photo = album.photos[currentPhotoIndex];
  if (!photo) return;
  toggleCartBtn.textContent = isPhotoInCart(photo.id) ? "Quitar del carrito" : "Agregar al carrito";
}

toggleCartBtn.addEventListener("click", () => {
  const album = albums.find((a) => a.id === currentAlbumId);
  if (!album) return;
  const photo = album.photos[currentPhotoIndex];
  if (!photo) return;
  const index = cart.findIndex((item) => item.id === photo.id);
  if (index === -1) {
    cart.push({ ...photo, albumId: currentAlbumId });
  } else {
    cart.splice(index, 1);
  }
  updateToggleCartBtn();
  updateCartCount();
});

// --- Abrir modal carrito ---
cartIconBtn.addEventListener("click", () => {
  renderCartModal();
  cartModal.classList.remove("hidden");
  checkoutSection.classList.add("hidden");
  photoModal.classList.add("hidden");
  photosSection.classList.add("hidden");
  albumsContainer.parentElement.classList.add("hidden");
});

// --- Cerrar modal carrito ---
cartCloseBtn.addEventListener("click", () => {
  cartModal.classList.add("hidden");
  if (currentAlbumId) {
    photosSection.classList.remove("hidden");
  } else {
    albumsContainer.parentElement.classList.remove("hidden");
  }
});

// --- Render carrito modal ---
function renderCartModal() {
  cartItemsModal.innerHTML = "";
  if (cart.length === 0) {
    cartItemsModal.innerHTML = "<p>El carrito está vacío.</p>";
    checkoutBtnModal.disabled = true;
    cartTotalModal.textContent = "$0";
    return;
  }
  cart.forEach((item, idx) => {
    const div = document.createElement("div");
    div.className = "cart-item";
    div.textContent = item.name || "Foto";
    const btnRemove = document.createElement("button");
    btnRemove.textContent = "✖";
    btnRemove.title = "Quitar del carrito";
    btnRemove.addEventListener("click", () => {
      cart.splice(idx, 1);
      renderCartModal();
      updateCartCount();
    });
    div.appendChild(btnRemove);
    cartItemsModal.appendChild(div);
  });
  const total = cart.length * PHOTO_PRICE;
  cartTotalModal.textContent = `$${total.toLocaleString("es-AR")}`;
  checkoutBtnModal.disabled = false;
}

// --- Finalizar compra (abrir formulario) ---
checkoutBtnModal.addEventListener("click", () => {
  cartModal.classList.add("hidden");
  checkoutSection.classList.remove("hidden");
  customerNameInput.value = "";
  deliveryMethodSelect.value = "";
  deliveryContactInput.value = "";
  deliveryContactInput.classList.add("hidden");
  deliveryContactLabel.classList.add("hidden");
  paymentAmountSpan.textContent = `$${(cart.length * PHOTO_PRICE).toLocaleString("es-AR")}`;
});

// --- Mostrar input según medio ---
deliveryMethodSelect.addEventListener("change", () => {
  if (deliveryMethodSelect.value === "correo" || deliveryMethodSelect.value === "whatsapp") {
    deliveryContactInput.classList.remove("hidden");
    deliveryContactLabel.classList.remove("hidden");
    deliveryContactLabel.textContent = deliveryMethodSelect.value === "correo" ? "Correo electrónico:" : "Número de WhatsApp:";
    deliveryContactInput.type = deliveryMethodSelect.value === "correo" ? "email" : "tel";
    deliveryContactInput.required = true;
  } else {
    deliveryContactInput.classList.add("hidden");
    deliveryContactLabel.classList.add("hidden");
    deliveryContactInput.required = false;
  }
});

// --- Cancelar checkout ---
cancelCheckoutBtn.addEventListener("click", () => {
  checkoutSection.classList.add("hidden");
  if (currentAlbumId) {
    photosSection.classList.remove("hidden");
  } else {
    albumsContainer.parentElement.classList.remove("hidden");
  }
});

// --- Enviar compra ---
checkoutForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (cart.length === 0) {
    alert("El carrito está vacío.");
    return;
  }
  const name = customerNameInput.value.trim();
  const deliveryMethod = deliveryMethodSelect.value;
  const contact = deliveryContactInput.value.trim();
  const paymentProofFile = paymentProofInput.files[0];

  if (!name || !deliveryMethod || !contact || !paymentProofFile) {
    alert("Complete todos los campos y cargue el comprobante.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function () {
    const comprobanteBase64 = reader.result;

    // Guardar compra
    purchases.push({
      name,
      comprobanteBase64,
      date: new Date().toLocaleString(),
      photosBought: cart.map((item) => item.name || "Foto"),
    });
    saveToStorage();

    alert("Compra registrada. ¡Gracias!");

    // Limpiar carrito y formulario
    cart = [];
    updateCartCount();
    checkoutSection.classList.add("hidden");
    albumsContainer.parentElement.classList.remove("hidden");
    checkoutForm.reset();
  };
  reader.readAsDataURL(paymentProofFile);
});

// -------- ADMIN --------

let adminLoggedIn = false;
let selectedAdminAlbumId = null;

// Abrir/cerrar panel admin
adminToggleBtn.addEventListener("click", () => {
  adminPanel.classList.toggle("hidden");
  if (adminPanel.classList.contains("hidden")) {
    logoutAdmin();
  }
});

// Login admin
adminLoginBtn.addEventListener("click", () => {
  const user = adminUsernameInput.value.trim();
  const pass = adminPasswordInput.value.trim();

  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    adminLoggedIn = true;
    adminLoginMsg.textContent = "";
    adminLoginSection.classList.add("hidden");
    adminControls.classList.remove("hidden");
    renderAdminAlbums();
    renderPurchaseRecords();
  } else {
    adminLoginMsg.textContent = "Usuario o contraseña incorrectos";
  }
});

adminLogoutBtn.addEventListener("click", () => {
  logoutAdmin();
});

function logoutAdmin() {
  adminLoggedIn = false;
  adminUsernameInput.value = "";
  adminPasswordInput.value = "";
  adminLoginSection.classList.remove("hidden");
  adminControls.classList.add("hidden");
  adminPanel.classList.add("hidden");
  selectedAdminAlbumId = null;
  newAlbumTitleInput.value = "";
  photoUploadInput.value = "";
  addPhotosBtn.disabled = true;
}

// Agregar álbum
addAlbumBtn.addEventListener("click", () => {
  const title = newAlbumTitleInput.value.trim();
  if (!title) {
    alert("El título del álbum no puede estar vacío");
    return;
  }
  const newAlbum = {
    id: generateId(),
    title,
    photos: [],
  };
  albums.push(newAlbum);
  saveToStorage();
  newAlbumTitleInput.value = "";
  renderAdminAlbums();
  renderAlbums();
});

// Render lista de álbumes admin
function renderAdminAlbums() {
  adminAlbumList.innerHTML = "";
  albums.forEach((album) => {
    const li = document.createElement("li");
    li.textContent = album.title;

    // Seleccionar álbum para agregar fotos
    li.tabIndex = 0;
    li.style.cursor = "pointer";
    li.setAttribute("role", "button");
    li.addEventListener("click", () => {
      selectAdminAlbum(album.id, li);
    });
    li.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        selectAdminAlbum(album.id, li);
      }
    });

    // Botón eliminar álbum
    const btnDel = document.createElement("button");
    btnDel.textContent = "🗑️";
    btnDel.title = "Eliminar álbum";
    btnDel.addEventListener("click", (e) => {
      e.stopPropagation();
      if (confirm(`¿Eliminar álbum "${album.title}"?`)) {
        albums = albums.filter((a) => a.id !== album.id);
        if (selectedAdminAlbumId === album.id) {
          selectedAdminAlbumId = null;
          addPhotosBtn.disabled = true;
          photoUploadInput.value = "";
        }
        saveToStorage();
        renderAdminAlbums();
        renderAlbums();
      }
    });
    li.appendChild(btnDel);

    if (album.id === selectedAdminAlbumId) {
      li.style.backgroundColor = "#b0003a";
      li.style.color = "white";
      li.style.fontWeight = "900";
    }

    adminAlbumList.appendChild(li);
  });
}

function selectAdminAlbum(albumId, element) {
  selectedAdminAlbumId = albumId;
  renderAdminAlbums();
  addPhotosBtn.disabled = false;
  photoUploadInput.value = "";
}

// Subir fotos
photoUploadInput.addEventListener("change", () => {
  addPhotosBtn.disabled = photoUploadInput.files.length === 0 || !selectedAdminAlbumId;
});

addPhotosBtn.addEventListener("click", () => {
  if (!selectedAdminAlbumId) {
    alert("Seleccione un álbum para agregar fotos");
    return;
  }
  const files = photoUploadInput.files;
  if (!files.length) {
    alert("Seleccione una o más fotos para subir");
    return;
  }

  const album = albums.find((a) => a.id === selectedAdminAlbumId);
  if (!album) return;

  const fileReaders = [];
  const newPhotos = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    fileReaders.push(
      new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = e.target.result;
          newPhotos.push({
            id: generateId(),
            name: file.name,
            base64,
          });
          resolve();
        };
        reader.readAsDataURL(file);
      })
    );
  }

  Promise.all(fileReaders).then(() => {
    album.photos.push(...newPhotos);
    saveToStorage();
    photoUploadInput.value = "";
    addPhotosBtn.disabled = true;
    alert(`Se agregaron ${newPhotos.length} fotos al álbum "${album.title}"`);
    renderAlbums();
    if (currentAlbumId === album.id) {
      openAlbum(album.id);
    }
  });
});

// Render registros de compras
function renderPurchaseRecords() {
  purchaseRecordsTableBody.innerHTML = "";
  if (purchases.length === 0) {
    purchaseRecordsTableBody.innerHTML = `<tr><td colspan="4" style="color:#f88;">No hay registros de compras aún.</td></tr>`;
    return;
  }
  purchases.forEach((purchase) => {
    const tr = document.createElement("tr");

    // Nombre
    const tdName = document.createElement("td");
    tdName.textContent = purchase.name;
    tr.appendChild(tdName);

    // Comprobante - mostrar miniatura (clic para ver grande)
    const tdComprobante = document.createElement("td");
    const img = document.createElement("img");
    img.src = purchase.comprobanteBase64;
    img.alt = "Comprobante de pago";
    img.style.width = "60px";
    img.style.height = "auto";
    img.style.cursor = "pointer";
    img.title = "Ver comprobante";
    img.addEventListener("click", () => {
      window.open(purchase.comprobanteBase64, "_blank");
    });
    tdComprobante.appendChild(img);
    tr.appendChild(tdComprobante);

    // Fecha
    const tdDate = document.createElement("td");
    tdDate.textContent = purchase.date;
    tr.appendChild(tdDate);

    // Fotos compradas
    const tdPhotos = document.createElement("td");
    tdPhotos.textContent = purchase.photosBought.join(", ");
    tr.appendChild(tdPhotos);

    purchaseRecordsTableBody.appendChild(tr);
  });
}

// --- Inicialización ---
function init() {
  loadFromStorage();
  renderAlbums();
  updateCartCount();
}

init();

