// Variables globales y constantes
const albums = [
  {
    name: "Desconocido 1",
    photos: [
      "https://i.imgur.com/Vhm8SI7.jpg",
      "https://i.imgur.com/GZOBVbP.jpg",
      "https://i.imgur.com/0AxAf0m.jpg",
      "https://i.imgur.com/tYHqf0n.jpg",
      "https://i.imgur.com/V2F7KmN.jpg",
      "https://i.imgur.com/jtTxrfz.jpg",
    ],
  },
  {
    name: "Desconocido 2",
    photos: [
      "https://i.imgur.com/QFDRuAh.jpg",
      "https://i.imgur.com/cCN6fVX.jpg",
      "https://i.imgur.com/pnPe0Ne.jpg",
      "https://i.imgur.com/xHQMFCN.jpg",
      "https://i.imgur.com/1P3qEr7.jpg",
      "https://i.imgur.com/dR8cg0Z.jpg",
    ],
  },
  {
    name: "Desconocido 3",
    photos: [
      "https://i.imgur.com/6uQXxRl.jpg",
      "https://i.imgur.com/BYntSaX.jpg",
      "https://i.imgur.com/mffke8I.jpg",
      "https://i.imgur.com/3bC6v1p.jpg",
      "https://i.imgur.com/nAc2xmy.jpg",
      "https://i.imgur.com/cqVPcvI.jpg",
    ],
  },
];

const pricePerPhoto = 1500;

// DOM Elements
const intro = document.getElementById("intro");
const header = document.getElementById("header");
const albumsContainer = document.getElementById("albums-container");
const photoGrid = document.getElementById("photo-grid");
const photoModal = document.getElementById("photo-modal");
const modalImage = document.getElementById("modal-image");
const addToCartBtn = document.getElementById("add-to-cart");
const cartButton = document.getElementById("cart-button");
const cartCountSpan = document.getElementById("cart-count");
const cartFooter = document.getElementById("cart-footer");
const footerCartCount = document.getElementById("footer-cart-count");
const footerCartTotal = document.getElementById("footer-cart-total");
const checkoutBtn = document.getElementById("checkout");
const clearCartBtn = document.getElementById("clear-cart");
const photoSearchInput = document.getElementById("album-search");
const checkoutModal = document.getElementById("checkout-modal");
const checkoutCloseBtn = checkoutModal.querySelector(".close-modal");
const selectedPhotosContainer = document.getElementById("selected-photos");
const checkoutSummary = document.getElementById("checkout-summary");
const whatsappLink = document.getElementById("whatsapp-link");
const modalCloseBtn = photoModal.querySelector(".close-modal");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

// Estado
let currentAlbumIndex = null;
let currentPhotoIndex = null;
let cart = []; // { albumIndex, photoIndex }

// --- Funciones --- //

// Mostrar álbumes en pantalla
function renderAlbums(filter = "") {
  albumsContainer.innerHTML = "";
  const filteredAlbums = albums.filter(album =>
    album.name.toLowerCase().includes(filter.toLowerCase())
  );
  if (filteredAlbums.length === 0) {
    albumsContainer.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color:#999;">No se encontraron álbumes.</p>`;
    return;
  }

  filteredAlbums.forEach((album, index) => {
    const albumCard = document.createElement("div");
    albumCard.className = "album-card";
    albumCard.setAttribute("tabindex", "0");
    albumCard.setAttribute("role", "button");
    albumCard.setAttribute("aria-label", `Abrir álbum ${album.name}`);
    albumCard.dataset.index = albums.indexOf(album);

    albumCard.innerHTML = `
      <img src="${album.photos[0]}" alt="Portada álbum ${album.name}" loading="lazy" />
      <span>${album.name}</span>
    `;

    albumCard.addEventListener("click", () => openAlbum(albums.indexOf(album)));
    albumCard.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openAlbum(albums.indexOf(album));
      }
    });

    albumsContainer.appendChild(albumCard);
  });
}

// Abrir álbum y mostrar fotos
function openAlbum(index) {
  currentAlbumIndex = index;
  renderPhotos();
  albumsContainer.classList.add("hidden");
  photoGrid.classList.remove("hidden");
  photoGrid.focus?.();
}

// Mostrar fotos del álbum actual
function renderPhotos() {
  photoGrid.innerHTML = "";
  const album = albums[currentAlbumIndex];
  album.photos.forEach((photoUrl, index) => {
    const photoDiv = document.createElement("div");
    photoDiv.className = "photo-thumb";
    photoDiv.setAttribute("tabindex", "0");
    photoDiv.setAttribute("role", "button");
    photoDiv.setAttribute("aria-label", `Ver foto ${index + 1} del álbum ${album.name}`);
    photoDiv.dataset.index = index;
    photoDiv.innerHTML = `<img src="${photoUrl}" alt="Foto ${index + 1} del álbum ${album.name}" loading="lazy" />`;

    photoDiv.addEventListener("click", () => openModal(index));
    photoDiv.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal(index);
      }
    });

    photoGrid.appendChild(photoDiv);
  });
}

// Abrir modal foto
function openModal(photoIndex) {
  currentPhotoIndex = photoIndex;
  updateModalImage();
  photoModal.classList.remove("hidden");
  photoModal.focus();
}

// Actualizar imagen en modal
function updateModalImage() {
  const album = albums[currentAlbumIndex];
  const photoUrl = album.photos[currentPhotoIndex];
  modalImage.src = photoUrl;
  modalImage.alt = `Foto ${currentPhotoIndex + 1} del álbum ${album.name}`;
}

// Navegación modal
function prevPhoto() {
  const album = albums[currentAlbumIndex];
  currentPhotoIndex = (currentPhotoIndex - 1 + album.photos.length) % album.photos.length;
  updateModalImage();
}

function nextPhoto() {
  const album = albums[currentAlbumIndex];
  currentPhotoIndex = (currentPhotoIndex + 1) % album.photos.length;
  updateModalImage();
}

// Agregar foto al carrito
function addToCart() {
  const exists = cart.some(
    item => item.albumIndex === currentAlbumIndex && item.photoIndex === currentPhotoIndex
  );
  if (!exists) {
    cart.push({ albumIndex: currentAlbumIndex, photoIndex: currentPhotoIndex });
    updateCartUI();
    alert("Foto agregada al carrito");
  } else {
    alert("Esta foto ya está en el carrito");
  }
}

// Actualizar UI carrito
function updateCartUI() {
  const count = cart.length;
  cartCountSpan.textContent = count;
  footerCartCount.textContent = count;
  footerCartTotal.textContent = count * pricePerPhoto;
  if (count > 0) {
    cartFooter.classList.remove("hidden");
  } else {
    cartFooter.classList.add("hidden");
  }
}

// Abrir carrito (scroll footer)
cartButton.addEventListener("click", () => {
  if (cartFooter.classList.contains("hidden")) {
    cartFooter.classList.remove("hidden");
    cartFooter.scrollIntoView({ behavior: "smooth" });
  } else {
    cartFooter.classList.add("hidden");
  }
});

// Checkout
function checkout() {
  if (cart.length === 0) {
    alert("No hay fotos en el carrito.");
    return;
  }
  // Mostrar modal checkout con fotos y resumen
  selectedPhotosContainer.innerHTML = "";
  cart.forEach(({ albumIndex, photoIndex }) => {
    const img = document.createElement("img");
    img.src = albums[albumIndex].photos[photoIndex];
    img.alt = `Foto ${photoIndex + 1} del álbum ${albums[albumIndex].name}`;
    selectedPhotosContainer.appendChild(img);
  });
  const total = cart.length * pricePerPhoto;
  checkoutSummary.textContent = `Total a pagar: $${total}`;
  checkoutModal.classList.remove("hidden");
  checkoutModal.focus();
}

// Enviar pedido por WhatsApp
function sendWhatsApp() {
  const baseUrl = "https://wa.me/5491125832571?text=";
  const messageIntro = "Hola Juli, me gustaría comprar las siguientes fotos:\n";
  const items = cart.map(({ albumIndex, photoIndex }, i) => {
    const albumName = albums[albumIndex].name;
    return `${i + 1}. Álbum: ${albumName} - Foto #${photoIndex + 1}`;
  }).join("\n");
  const total = cart.length * pricePerPhoto;
  const messageTotal = `\nTotal: $${total}`;
  const fullMessage = encodeURIComponent(messageIntro + items + messageTotal);
  whatsappLink.href = baseUrl + fullMessage;
  // Abrirá en nueva pestaña (rel noopener)
}

// Vaciar carrito
function clearCart() {
  if (confirm("¿Querés vaciar el carrito?")) {
    cart = [];
    updateCartUI();
  }
}

// Filtrar álbumes
photoSearchInput.addEventListener("input", e => {
  renderAlbums(e.target.value);
});

// Cerrar modales
function closeModal(modal) {
  modal.classList.add("hidden");
}

// Eventos modales y botones
modalCloseBtn.addEventListener("click", () => closeModal(photoModal));
checkoutCloseBtn.addEventListener("click", () => closeModal(checkoutModal));
prevBtn.addEventListener("click", prevPhoto);
nextBtn.addEventListener("click", nextPhoto);
addToCartBtn.addEventListener("click", addToCart);
checkoutBtn.addEventListener("click", checkout);
clearCartBtn.addEventListener("click", clearCart);
whatsappLink.addEventListener("click", sendWhatsApp);

// Cerrar modal con ESC y navegación teclado
window.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    if (!photoModal.classList.contains("hidden")) {
      closeModal(photoModal);
    }
    if (!checkoutModal.classList.contains("hidden")) {
      closeModal(checkoutModal);
    }
  }
});

// Mostrar álbumes e interfaz tras intro animación
setTimeout(() => {
  intro.style.display = "none";
  header.classList.remove("hidden");
  albumsContainer.classList.remove("hidden");
  renderAlbums();
}, 3500);

updateCartUI();
