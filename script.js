let albumsData = [
  {
    nombre: "Paisajes Naturales",
    imagenes: [
      "https://i.imgur.com/2jMCqQ2.jpg",
      "https://i.imgur.com/QFDRuAh.jpg",
      "https://i.imgur.com/8yIIokW.jpg"
    ]
  },
  {
    nombre: "Atardeceres",
    imagenes: [
      "https://i.imgur.com/pwpWaWu.jpg",
      "https://i.imgur.com/KIPtISY.jpg",
      "https://i.imgur.com/2jMCqQ2.jpg"
    ]
  },
  {
    nombre: "Montañas y Lagos",
    imagenes: [
      "https://images.pexels.com/photos/3348748/pexels-photo-3348748.jpeg",
      "https://images.pexels.com/photos/3812944/pexels-photo-3812944.jpeg",
      "https://images.pexels.com/photos/2100063/pexels-photo-2100063.jpeg"
    ]
  },
  {
    nombre: "Cámaras Urbanas",
    imagenes: [
      "https://images.pexels.com/photos/4725133/pexels-photo-4725133.jpeg",
      "https://images.pexels.com/photos/1385472/pexels-photo-1385472.jpeg",
      "https://images.pexels.com/photos/3228213/pexels-photo-3228213.jpeg"
    ]
  }
];

let currentAlbum = [];
let currentIndex = 0;
let cart = [];

const container = document.getElementById("albums-container");
albumsData.forEach((album, index) => {
  const btn = document.createElement("button");
  btn.textContent = album.nombre;
  btn.onclick = () => openAlbum(index);
  container.appendChild(btn);
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
  const wspURL = `https://wa.me/549XXXXXXXXXX?text=${encodeURIComponent(msg)}`;
  document.getElementById("whatsapp-link").href = wspURL;
  modal.classList.remove("hidden");
};

window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("header").classList.add("small");
  }, 2500);
});


