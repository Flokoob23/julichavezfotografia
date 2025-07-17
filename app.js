const albumsData = [
  {
    name: "Vacaciones 2022",
    cover: "album1.jpg",
    photos: ["photo1.jpg", "photo2.jpg", "photo3.jpg"],
  },
  {
    name: "Boda de Juan y Ana",
    cover: "album2.jpg",
    photos: ["photo4.jpg", "photo5.jpg", "photo6.jpg"],
  },
  // Agregar más álbumes aquí
];

let currentAlbum = null;
let currentPhotoIndex = 0;
let cart = [];

// Elementos del DOM
const albumsContainer = document.getElementById("albums-container");
const photoGrid = document.getElementById("photo-grid");
const backToAlbumsBtn = document.getElementById("back-to-albums");
const photoModal = document.getElementById("photo-modal");
const modalImage = document.getElementById("modal-image");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const addToCartBtn = document.getElementById("add-to-cart");
const cartCount = document.getElementById("cart-count");
const checkoutBtn = document.getElementById("checkout");
const checkoutModal = document.getElementById("checkout-modal");
const selectedPhotosContainer = document.getElementById("selected-photos");
const clearCartBtn = document.getElementById("clear-cart");
const whatsappLink = document.getElementById("whatsapp-link");
const albumSearch = document.getElementById("album-search");

const renderAlbums = () => {
  albumsContainer.innerHTML = '';
  albumsData.forEach((album, index) => {
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
  albumsContainer.classList.add("hidden");
  photoGrid.classList.remove("hidden");
  backToAlbumsBtn.classList.remove("hidden");

  photoGrid.innerHTML = '';
  album.photos.forEach((photo, index) => {
    const photoThumb = document.createElement("div");
    photoThumb.classList.add("photo-thumb");
    const photoImage = document.createElement("img");
    photoImage.src = photo;
    photoThumb.appendChild(photoImage);
    photoThumb.addEventListener("click", () => openPhotoModal(index));
    photoGrid.appendChild(photoThumb);
  });
};

const openPhotoModal = (index) => {
  currentPhotoIndex = index;
  modalImage.src = currentAlbum.photos[currentPhotoIndex];
  photoModal.classList.remove("hidden");
};

const closePhotoModal = () => {
  photoModal.classList.add("hidden");
};

const updateCart = () => {
  cartCount.textContent = cart.length;
  document.getElementById("footer-cart-count").textContent = cart.length;
  document.getElementById("footer-cart-total").textContent = cart.length * 1500;
};

const addToCart = () => {
  const photo = currentAlbum.photos[currentPhotoIndex];
  cart.push(photo);
  updateCart();
  closePhotoModal();
};

const checkout = () => {
  const selectedPhotos = cart.map(photo => `<li>${photo}</li>`).join('');
  selectedPhotosContainer.innerHTML = selectedPhotos;
  checkoutModal.classList.remove("hidden");
};

const clearCart = () => {
  cart = [];
  updateCart();
  checkoutModal.classList.add("hidden");
};

const sendToWhatsapp = () => {
  const total = cart.length * 1500;
  const message = encodeURIComponent(`Hola! Quiero comprar las siguientes fotos por un total de $${total}:\n\n${cart.join('\n')}`);
  whatsappLink.href = `https://wa.me/54123456789?text=${message}`;
};

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  renderAlbums();
});

backToAlbumsBtn.addEventListener("click", () => {
  photoGrid.classList.add("hidden");
  albumsContainer.classList.remove("hidden");
  backToAlbumsBtn.classList.add("hidden");
});

prevBtn.addEventListener("click", () => {
  currentPhotoIndex = (currentPhotoIndex - 1 + currentAlbum.photos.length) % currentAlbum.photos.length;
  modalImage.src = currentAlbum.photos[currentPhotoIndex];
});

nextBtn.addEventListener("click", () => {
  currentPhotoIndex = (currentPhotoIndex + 1) % currentAlbum.photos.length;
  modalImage.src = currentAlbum.photos[currentPhotoIndex];
});

addToCartBtn.addEventListener("click", addToCart);
checkoutBtn.addEventListener("click", checkout);
clearCartBtn.addEventListener("click", clearCart);
whatsappLink.addEventListener("click", sendToWhatsapp);
albumSearch.addEventListener("input", () => {
  const query = albumSearch.value.toLowerCase();
  const filteredAlbums = albumsData.filter(album => album.name.toLowerCase().includes(query));
  renderAlbums(filteredAlbums);
});



