let albumsData = [];
let currentAlbum = [];
let currentIndex = 0;
let cart = [];

fetch('albums.json')
  .then(res => res.json())
  .then(data => {
    albumsData = data;
    const container = document.getElementById("albums-container");
    data.forEach((album, index) => {
      const btn = document.createElement("button");
      btn.textContent = album.nombre;
      btn.onclick = () => openAlbum(index);
      container.appendChild(btn);
    });
  });

function openAlbum(index) {
  currentAlbum = albumsData[index].imagenes;
  currentIndex = 0;
  document.getElementById("gallery").classList.remove("hidden");
  updateLargePhoto();
  renderThumbnails();
}

function updateLargePhoto() {
  document.getElementById("photo-large").src = currentAlbum[currentIndex];
}

document.getElementById("next").onclick = () => {
  currentIndex = (currentIndex + 1) % currentAlbum.length;
  updateLargePhoto();
};

document.getElementById("prev").onclick = () => {
  currentIndex = (currentIndex - 1 + currentAlbum.length) % currentAlbum.length;
  updateLargePhoto();
};

document.getElementById("add-cart").onclick = () => {
  const photo = currentAlbum[currentIndex];
  if (!cart.includes(photo)) {
    cart.push(photo);
    updateCart();
  }
};

function renderThumbnails() {
  const thumbs = document.getElementById("thumbnails");
  thumbs.innerHTML = "";
  currentAlbum.forEach((src, i) => {
    const img = document.createElement("img");
    img.src = src;
    img.onclick = () => {
      currentIndex = i;
      updateLargePhoto();
    };
    thumbs.appendChild(img);
  });
}

function updateCart() {
  document.getElementById("cart-count").textContent = cart.length;
  document.getElementById("cart-total").textContent = cart.length * 1500;
}

document.getElementById("checkout").onclick = () => {
  const modal = document.getElementById("checkout-modal");
  const container = document.getElementById("selected-photos");
  container.innerHTML = "";
  cart.forEach(photo => {
    const img = document.createElement("img");
    img.src = photo;
    container.appendChild(img);
  });
  const msg = `HOLA QUIERO COMPRAR LAS SIGUIENTES FOTOS:\n${cart.join('\n')}`;
  const wspURL = `https://wa.me/543584328924?text=${encodeURIComponent(msg)}`;
  document.getElementById("whatsapp-link").href = wspURL;
  modal.classList.remove("hidden");
};

// Animación del logo
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("header").classList.add("small");
  }, 2500);
});
