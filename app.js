// Datos de ejemplo (Álbumes y fotos)
// Puedes cambiar las URLs o agregar más álbumes y fotos aquí
const albumsData = [
  {
    id: "viajes",
    name: "Viajes",
    cover: "https://i.imgur.com/8zYLrBa.jpg",
    photos: [
      "https://i.imgur.com/4QJX9FM.jpg",
      "https://i.imgur.com/g9GqRrD.jpg",
      "https://i.imgur.com/yXEKkTp.jpg",
      "https://i.imgur.com/3PfVpHP.jpg",
      "https://i.imgur.com/qgoOTGH.jpg",
    ],
  },
  {
    id: "bodas",
    name: "Bodas",
    cover: "https://i.imgur.com/TWxMDqs.jpg",
    photos: [
      "https://i.imgur.com/xOvO3j0.jpg",
      "https://i.imgur.com/dFlI0S3.jpg",
      "https://i.imgur.com/G5bMfKU.jpg",
      "https://i.imgur.com/cPS8ylk.jpg",
    ],
  },
  {
    id: "familia",
    name: "Familia",
    cover: "https://i.imgur.com/8SakYIo.jpg",
    photos: [
      "https://i.imgur.com/NVvIjhp.jpg",
      "https://i.imgur.com/Lz2osS4.jpg",
      "https://i.imgur.com/MHlptNz.jpg",
    ],
  },
];

const pricePerPhoto = 1500;

const albumsContainer = document.getElementById("albums-container");
const photoGrid = document.getElementById("photo-grid");
const backToAlbumsBtn = document.getElementById("back-to-albums");
const header = document.getElementById("header");
const intro = document.getElementById("intro");
const albumSearch = document.getElementById("album-search");
const cartButton = document.getElementById("cart-button");
const cartCountSpan = document.getElementById("cart-count");
const cartFooter = document.getElementById("cart-footer");
const footerCartCount = document.getElementById("footer-cart-count");
const footerCartTotal = document.getElementById("footer-cart-total");
const checkoutBtn = document.getElementById("checkout");
const clearCartBtn = document.getElementById("clear-cart");

const photoModal = document.getElementById("photo-modal");
const modalImage = document.getElementById("modal-image");
const closeModalBtn = photoModal.querySelector(".close-modal");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const addToCartBtn = document.getElementById("add-to-cart");

const checkoutModal = document.getElementById("checkout-modal");
const closeCheckoutBtn = checkoutModal.querySelector(".close-modal");
const selectedPhotosContainer = document.getElementById("selected-photos");
const checkoutSummary = document.getElementById("checkout-summary");
const whatsappLink = document.getElementById("whatsapp-link");

let currentAlbum = null;
let currentPhotoIndex = 0;

let cart = JSON.parse(localStorage.getItem("photoCart")) || {};

// Mostrar el header y álbumes tras anim intro
intro.addEventListener("animationend", () => {
  intro.classList.add("hidden");
  header.classList.remove("hidden");
  albumsContainer.classList.remove("hidden");
  renderAlbums(albumsData);
  updateCartUI();
});

// Renderiza los álbumes
function renderAlbums(albums) {
  albumsContainer.innerHTML = "";
  if (albums.length === 0) {
    albumsContainer.innerHTML = `<p>No se encontraron álbumes.</p>`;
    return;
  }
  albums.forEach((album) => {
    const card = document.createElement("article");
    card.className = "album-card";
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.setAttribute("aria-pressed", "false");
    card.setAttribute("aria-label", `Abrir álbum ${album.name}`);
    card.innerHTML = `
      <img src="${album.cover}" alt="Portada álbum ${album.name}" loading="lazy" />
      <span>${album.name}</span>
    `;
    card.addEventListener("click", () => openAlbum(album));
    card.addEventListener("keypress", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openAlbum(album);
      }
    });
    albumsContainer.appendChild(card);
  });
  albumsContainer.style.opacity = "1";
}

// Abrir álbum y mostrar fotos
function openAlbum(album) {
  currentAlbum = album;
  albumsContainer.classList.add("hidden");
  photoGrid.classList.remove("hidden");
  photoGrid.style.opacity = "0";
  backToAlbumsBtn.focus();
  renderPhotos(album.photos);
  header.querySelector("nav").style.display = "none";
  fadeIn(photoGrid);
}

// Volver a álbumes
backToAlbumsBtn.addEventListener("click", () => {
  photoGrid.classList.add("hidden");
  albumsContainer.classList.remove("hidden");
  header.querySelector("nav").style.display = "block";
  albumSearch.value = "";
  renderAlbums(albumsData);
  fadeIn(albumsContainer);
  currentAlbum = null;
  currentPhotoIndex = 0;
});

// Renderiza fotos en el grid
function renderPhotos(photos) {
  // Limpio y agrego fotos
  photoGrid.querySelectorAll(".photo-thumb").forEach((el) => el.remove());
  photos.forEach((url, i) => {
    const div = document.createElement("div");
    div.className = "photo-thumb";
    div.setAttribute("tabindex", "0");
    div.setAttribute("role", "button");
    div.setAttribute("aria-label", `Abrir foto ${i + 1} de ${currentAlbum.name}`);
    div.innerHTML = `<img src="${url}" alt="Foto ${i + 1} del álbum ${currentAlbum.name}" loading="lazy" />`;
    
    // Mostrar icono si está en carrito
    if (cart[url]) {
      const icon = document.createElement("div");
      icon.className = "in-cart-icon";
      icon.textContent = "✓";
      div.appendChild(icon);
    }

    div.addEventListener("click", () => openPhotoModal(i));
    div.addEventListener("keypress", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openPhotoModal(i);
      }
    });
    photoGrid.appendChild(div);
  });
  photoGrid.style.opacity = "1";
}

// Abrir modal con foto seleccionada
function openPhotoModal(index) {
  currentPhotoIndex = index;
  updateModalImage();
  photoModal.classList.remove("hidden");
  photoModal.focus();
  addToCartBtn.disabled = cart[currentAlbum.photos[currentPhotoIndex]] ? true : false;
  updateAddToCartBtn();
}

// Actualizar imagen del modal
function updateModalImage() {
  const url = currentAlbum.photos[currentPhotoIndex];
  modalImage.src = url;
  modalImage.alt = `Foto ${currentPhotoIndex + 1} del álbum ${currentAlbum.name}`;
}

// Navegación modal
prevBtn.addEventListener("click", () => {
  currentPhotoIndex = (currentPhotoIndex - 1 + currentAlbum.photos.length) % currentAlbum.photos.length;
  updateModalImage();
  updateAddToCartBtn();
});
nextBtn.addEventListener("click", () => {
  currentPhotoIndex = (currentPhotoIndex + 1) % currentAlbum.photos.length;
  updateModalImage();
  updateAddToCartBtn();
});

// Cerrar modal foto
closeModalBtn.addEventListener("click", closePhotoModal);

function closePhotoModal() {
  photoModal.classList.add("hidden");
  // Devolver foco a la foto en el grid
  const photos = photoGrid.querySelectorAll(".photo-thumb");
  if (photos[currentPhotoIndex]) photos[currentPhotoIndex].focus();
}

// Agregar al carrito
addToCartBtn.addEventListener("click", () => {
  const url = currentAlbum.photos[currentPhotoIndex];
  if (!cart[url]) {
    cart[url] = { album: currentAlbum.name, url };
    saveCart();
    updateCartUI();
    addToCartBtn.disabled = true;
    updateAddToCartBtn();
    markPhotoInCart(url, true);
  }
});

// Marca foto en grid como en carrito (o no)
function markPhotoInCart(url, isInCart) {
  const photos = photoGrid.querySelectorAll(".photo-thumb");
  photos.forEach((div) => {
    const img = div.querySelector("img");
    if (img && img.src === url) {
      if (isInCart) {
        if (!div.querySelector(".in-cart-icon")) {
          const icon = document.createElement("div");
          icon.className = "in-cart-icon";
          icon.textContent = "✓";
          div.appendChild(icon);
        }
      } else {
        const icon = div.querySelector(".in-cart-icon");
        if (icon) icon.remove();
      }
    }
  });
}

// Actualizar estado botón agregar carrito en modal
function updateAddToCartBtn() {
  const url = currentAlbum.photos[currentPhotoIndex];
  addToCartBtn.disabled = !!cart[url];
  addToCartBtn.textContent = addToCartBtn.disabled ? "Ya en carrito" : "Agregar al carrito";
}

// Guardar carrito en localStorage
function saveCart() {
  localStorage.setItem("photoCart", JSON.stringify(cart));
}

// Actualizar interfaz carrito
function updateCartUI() {
  const count = Object.keys(cart).length;
  cartCountSpan.textContent = count;
  footerCartCount.textContent = count;
  footerCartTotal.textContent = count * pricePerPhoto;

  if (count > 0) {
    cartFooter.classList.remove("hidden");
  } else {
    cartFooter.classList.add("hidden");
  }
}

// Vaciar carrito
clearCartBtn.addEventListener("click", () => {
  if (confirm("¿Querés vaciar el carrito?")) {
    cart = {};
    saveCart();
    updateCartUI();
    // Actualizo iconos en fotos
    if (currentAlbum) {
      currentAlbum.photos.forEach((url) => markPhotoInCart(url, false));
    }
  }
});

// Abrir modal checkout
checkoutBtn.addEventListener("click", () => {
  if (Object.keys(cart).length === 0) {
    alert("No hay fotos en el carrito para comprar.");
    return;
  }
  renderCheckout();
  checkoutModal.classList.remove("hidden");
  checkoutModal.focus();
});

// Cerrar modal checkout
closeCheckoutBtn.addEventListener("click", () => {
  checkoutModal.classList.add("hidden");
});

// Renderiza checkout con fotos seleccionadas y mensaje WhatsApp
function renderCheckout() {
  selectedPhotosContainer.innerHTML = "";
  const cartPhotos = Object.values(cart);
  cartPhotos.forEach(({ url, album }) => {
    const img = document.createElement("img");
    img.src = url;
    img.alt = `Foto del álbum ${album}`;
    selectedPhotosContainer.appendChild(img);
  });
  const totalPrice = cartPhotos.length * pricePerPhoto;
  checkoutSummary.textContent = `Total: $${totalPrice} ARS - Precio por foto: $${pricePerPhoto} ARS`;

  // Generar mensaje WhatsApp
  const phoneNumber = "5491161234567"; // Cambiar por el número real
  let message =
    `¡Hola Juli! Quisiera comprar las siguientes fotos de tus álbumes:%0A%0A` +
    cartPhotos
      .map((p, i) => `${i + 1}. Álbum: ${p.album} - Foto: ${p.url}`)
      .join("%0A") +
    `%0A%0ATotal a pagar: $${totalPrice} ARS.%0AGracias.`;
  whatsappLink.href = `https://wa.me/${phoneNumber}?text=${message}`;
}

// Filtrar álbumes por búsqueda
albumSearch.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase().trim();
  const filtered = albumsData.filter((album) =>
    album.name.toLowerCase().includes(query)
  );
  renderAlbums(filtered);
});

// Función auxiliar para animar fadeIn
function fadeIn(element) {
  element.style.opacity = 0;
  element.classList.remove("hidden");
  let op = 0;
  const interval = setInterval(() => {
    if (op >= 1) {
      clearInterval(interval);
    }
    element.style.opacity = op;
    op += 0.05;
  }, 20);
}

// Accesibilidad: cerrar modales con ESC y navegar con teclado
document.addEventListener("keydown", (e) => {
  if (!photoModal.classList.contains("hidden")) {
    if (e.key === "Escape") closePhotoModal();
    else if (e.key === "ArrowLeft") prevBtn.click();
    else if (e.key === "ArrowRight") nextBtn.click();
  }
  if (!checkoutModal.classList.contains("hidden")) {
    if (e.key === "Escape") checkoutModal.classList.add("hidden");
  }
});

// Inicialización (mostrar intro)
intro.classList.remove("hidden");
header.classList.add("hidden");
albumsContainer.classList.add("hidden");
photoGrid.classList.add("hidden");
cartFooter.classList.add("hidden");
