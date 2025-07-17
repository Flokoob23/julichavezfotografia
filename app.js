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
const photoModal = document.getElementById("photo-modal");
const modalImage = document.getElementById("modal-image");
const closeModalBtn = photoModal.querySelector(".close-modal");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const addToCartBtn = document.getElementById("add-to-cart");

let currentAlbum = null;
let currentPhotoIndex = 0;
let cart = [];

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
    ]
  },
  {
    id: "naturaleza",
    name: "Naturaleza",
    cover: "https://images.unsplash.com/photo-1470822584919-cfbe16fa5a5e?auto=format&fit=crop&w=600&q=80",
    photos: [
      "https://images.unsplash.com/photo-1501616460907-c97e5e3fa338?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1475687357230-b40843a1b67d?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1476314589304-c2bc16c6f3b4?auto=format&fit=crop&w=400&q=80",
    ]
  }
];

const renderAlbums = () => {
  albumsContainer.innerHTML = '';
  albumsData.forEach(album => {
    const albumCard = document.createElement("div");
    albumCard.classList.add("album-card");
    albumCard.addEventListener("click", () => openAlbum(album));
    
    const albumImage = document.createElement("img");
    albumImage.src = album.cover;
    
    const albumName = document.createElement("span");
    albumName.textContent = album.name;
    
    albumCard.appendChild(albumImage);
    albumCard.appendChild(albumName);
    albumsContainer.appendChild(albumCard);
  });
};

const openAlbum = (album) => {
  currentAlbum = album;
  photoGrid.classList.remove("hidden");
  albumsContainer.classList.add("hidden");
  header.classList.remove("hidden");
  backToAlbumsBtn.classList.remove("hidden");

  renderPhotoGrid(album.photos);
};

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

const openPhoto = (photo, index) => {
  currentPhotoIndex = index;
  modalImage.src = photo;
  photoModal.classList.remove("hidden");
};

closeModalBtn.addEventListener("click", () => {
  photoModal.classList.add("hidden");
});

prevBtn.addEventListener("click", () => {
  currentPhotoIndex = (currentPhotoIndex - 1 + currentAlbum.photos.length) % currentAlbum.photos.length;
  modalImage.src = currentAlbum.photos[currentPhotoIndex];
});

nextBtn.addEventListener("click", () => {
  currentPhotoIndex = (currentPhotoIndex + 1) % currentAlbum.photos.length;
  modalImage.src = currentAlbum.photos[currentPhotoIndex];
});

addToCartBtn.addEventListener("click", () => {
  const photo = currentAlbum.photos[currentPhotoIndex];
  cart.push(photo);
  updateCart();
  photoModal.classList.add("hidden");
});

const updateCart = () => {
  cartCount.textContent = cart.length;
  footerCartCount.textContent = cart.length;
  footerCartTotal.textContent = cart.length * 1500;
};

checkoutBtn.addEventListener("click", () => {
  const selectedPhotos = cart.map(photo => `<li>${photo}</li>`).join('');
  selectedPhotosContainer.innerHTML = selectedPhotos;
  checkoutModal.classList.remove("hidden");
});

clearCartBtn.addEventListener("click", () => {
  cart = [];
  updateCart();
});

whatsappLink.addEventListener("click", () => {
  const total = cart.length * 1500;
  const message = encodeURIComponent(`Hola! Quiero comprar las siguientes fotos por un total de $${total}:\n\n${cart.join('\n')}`);
  whatsappLink.href = `https://wa.me/54123456789?text=${message}`;
});

backToAlbumsBtn.addEventListener("click", () => {
  photoGrid.classList.add("hidden");
  albumsContainer.classList.remove("hidden");
  backToAlbumsBtn.classList.add("hidden");
});

albumSearch.addEventListener("input", () => {
  const query = albumSearch.value.toLowerCase();
  const filteredAlbums = albumsData.filter(album => album.name.toLowerCase().includes(query));
  renderFilteredAlbums(filteredAlbums);
});

const renderFilteredAlbums = (albums) => {
  albumsContainer.innerHTML = '';
  albums.forEach(album => {
    const albumCard = document.createElement("div");
    albumCard.classList.add("album-card");
    albumCard.addEventListener("click", () => openAlbum(album));

    const albumImage = document.createElement("img");
    albumImage.src = album.cover;

    const albumName = document.createElement("span");
    albumName.textContent = album.name;

    albumCard.appendChild(albumImage);
    albumCard.appendChild(albumName);
    albumsContainer.appendChild(albumCard);
  });
};

// Inicializar la vista de los álbumes
document.addEventListener("DOMContentLoaded", () => {
  renderAlbums();
});

