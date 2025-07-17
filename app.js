// Variables globales
const albumsContainer = document.getElementById("albums-container");
const photoGrid = document.getElementById("photo-grid");
const albumSearch = document.getElementById("album-search");
const backToAlbumsBtn = document.getElementById("back-to-albums");
const header = document.getElementById("header");
const cartButton = document.getElementById("cart-button");
const cartCount = document.getElementById("cart-count");
const cartFooter = document.getElementById("cart-footer");
const footerCartCount = document.getElementById("footer-cart-count");
const footerCartTotal = document.getElementById("footer-cart-total");
const checkoutBtn = document.getElementById("checkout");
const clearCartBtn = document.getElementById("clear-cart");
const checkoutModal = document.getElementById("checkout-modal");
const whatsappLink = document.getElementById("whatsapp-link");
const selectedPhotosContainer = document.getElementById("selected-photos");
const checkoutSummary = document.getElementById("checkout-summary");

// Modal foto elementos
const photoModal = document.getElementById("photo-modal");
const modalImage = document.getElementById("modal-image");
const closeModalBtn = photoModal.querySelector(".close-modal");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const addToCartBtn = document.getElementById("add-to-cart");

let currentAlbum = null;
let currentPhotoIndex = 0;
let cart = [];

// Datos de álbumes con imágenes públicas
const albumsData = [
  {
    id: "viajes",
    name: "Viajes",
    cover: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    photos: [
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1468071174046-657d9d351a40?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80",
    ],
  },
  {
    id: "naturaleza",
    name: "Naturaleza",
    cover: "https://images.unsplash.com/photo-1470822584919-cfbe16fa5a5e?auto=format&fit=crop&w=600&q=80",
    photos: [
      "https://images.unsplash.com/photo-1501616460907-c97e5e3fa338?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1475687357230-b40843a1b67d?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1476314589304-c2bc16c6f3b4?auto=format&fit=crop&w=400&q=80",
    ],
  },
  // Añadir más álbums según sea necesario
];

// Función para renderizar los álbumes
const renderAlbums = () => {
  albumsContainer.innerHTML = '';
  albumsData.forEach(album => {
    const albumCard = document.createElement("div");
    albumCard.classList.add("album-card");
    albumCard.addEventListener("click", () => openAlbum(album));
    
    const albumImage = document.createElement("img");
    albumImage.src = album.cover;
    
    const albumName = document.createElement("h3");
    albumName.textContent = album.name;
    
    albumCard.appendChild(albumImage);
    albumCard.appendChild(albumName);
    albumsContainer.appendChild(albumCard);
  });
};

// Función para abrir un álbum
const openAlbum = (album) => {
  currentAlbum = album;
  photoGrid.classList.remove("hidden");
  albumsContainer.classList.add("hidden");
  header.classList.remove("hidden");
  backToAlbumsBtn.classList.remove("hidden");

  const filteredPhotos = album.photos.filter(photo => 
    photo.includes(albumSearch.value)
  );

  renderPhotoGrid(filteredPhotos);
};

// Función para renderizar las fotos
const renderPhotoGrid = (photos) => {
  photoGrid.innerHTML = '';
  photos.forEach((photo, index) => {
    const photoThumb = document.createElement("div");
    photoThumb.classList.add("photo-thumb");
    photoThumb.addEventListener("click", () => openPhoto(photo, index));
    
    const img = document.createElement("img");
    img.src = photo;
    
    photoThumb.appendChild(img);
    photoGrid.appendChild(photoThumb);
  });
};

// Función para abrir una foto en el modal
const openPhoto = (photo, index) => {
  currentPhotoIndex = index;
  modalImage.src = photo;
  photoModal.classList.remove("hidden");
};

// Cerrar el modal
closeModalBtn.addEventListener("click", () => {
  photoModal.classList.add("hidden");
});

// Cambiar foto anterior
prevBtn.addEventListener("click", () => {
  currentPhotoIndex = (currentPhotoIndex - 1 + currentAlbum.photos.length) % currentAlbum.photos.length;
  modalImage.src = currentAlbum.photos[currentPhotoIndex];
});

// Cambiar foto siguiente
nextBtn.addEventListener("click", () => {
  currentPhotoIndex = (currentPhotoIndex + 1) % currentAlbum.photos.length;
  modalImage.src = currentAlbum.photos[currentPhotoIndex];
});

// Agregar foto al carrito
addToCartBtn.addEventListener("click", () => {
  const photo = currentAlbum.photos[currentPhotoIndex];
  if (!cart.includes(photo)) {
    cart.push(photo);
    cartCount.textContent = cart.length;
    footerCartCount.textContent = cart.length;
    footerCartTotal.textContent = cart.length * 1500;
    selectedPhotosContainer.innerHTML = '';
    cart.forEach((photo, index) => {
      const img = document.createElement("img");
      img.src = photo;
      selectedPhotosContainer.appendChild(img);
    });
  }
});

// Vaciar el carrito
clearCartBtn.addEventListener("click", () => {
  cart = [];
  cartCount.textContent = 0;
  footerCartCount.textContent = 0;
  footerCartTotal.textContent = 0;
  selectedPhotosContainer.innerHTML = '';
});

// Realizar el pedido a través de WhatsApp
whatsappLink.addEventListener("click", () => {
  const message = `¡Hola! Quiero comprar las siguientes fotos:\n\n${cart.join("\n")}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, "_blank");
});

// Función para mostrar y ocultar el carrito
const showCartFooter = () => {
  if (cart.length > 0) {
    cartFooter.classList.remove("hidden");
  } else {
    cartFooter.classList.add("hidden");
  }
};

// Iniciar la app
document.addEventListener("DOMContentLoaded", () => {
  renderAlbums();
  showCartFooter();
  header.classList.add("hidden");
  backToAlbumsBtn.classList.add("hidden");
});
