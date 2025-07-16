document.addEventListener("DOMContentLoaded", () => {
  const whatsappNumber = "543584328924";
  const albumsData = [
    {
      nombre: "🌿 Paisajes Naturales",
      imagenes: ["https://i.imgur.com/2jMCqQ2.jpg", "https://i.imgur.com/QFDRuAh.jpg", "https://i.imgur.com/8yIIokW.jpg"]
    },
    {
      nombre: "🌇 Atardeceres",
      imagenes: ["https://i.imgur.com/pwpWaWu.jpg", "https://i.imgur.com/KIPtISY.jpg", "https://i.imgur.com/2jMCqQ2.jpg"]
    },
    {
      nombre: "⛰️ Montañas y Lagos",
      imagenes: ["https://images.pexels.com/photos/3348748/pexels-photo-3348748.jpeg", "https://images.pexels.com/photos/3812944/pexels-photo-3812944.jpeg", "https://images.pexels.com/photos/2100063/pexels-photo-2100063.jpeg"]
    },
    {
      nombre: "🏙️ Cámaras Urbanas",
      imagenes: ["https://images.pexels.com/photos/4725133/pexels-photo-4725133.jpeg", "https://images.pexels.com/photos/1385472/pexels-photo-1385472.jpeg", "https://images.pexels.com/photos/3228213/pexels-photo-3228213.jpeg"]
    }
  ];

  let cart = [];
  let currentAlbum = [];
  let currentIndex = 0;

  const header = document.getElementById("header");
  const albumsContainer = document.getElementById("albums-container");
  const photoModal = document.getElementById("photo-modal");
  const modalImage = document.getElementById("modal-image");
  const cartFooter = document.getElementById("cart-footer");

  // Animación inicial y mostrar álbumes
  setTimeout(() => {
    header.classList.add("small");
    albumsContainer.classList.remove("hidden");
    albumsContainer.classList.add("visible");
    cartFooter.classList.remove("hidden");
  }, 2500);

  // Generar botones de álbum
  albumsData.forEach((album, idx) => {
    const btn = document.createElement("button");
    btn.textContent = album.nombre;
    btn.onclick = () => openAlbum(album.imagenes);
    albumsContainer.appendChild(btn);
  });

  // Abrir álbum
  function openAlbum(imagenes) {
    currentAlbum = imagenes;
    currentIndex = 0;
    openPhotoModal(currentAlbum[currentIndex]);
  }

  // Mostrar modal con imagen
  function openPhotoModal(src) {
    modalImage.src = src;
    photoModal.classList.remove("hidden");
  }

  // Cerrar todos los modales
  document.querySelectorAll(".close-modal").forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll(".modal").forEach(m => m.classList.add("hidden"));
    };
  });

  // Navegación
  document.getElementById("next").onclick = () => {
    currentIndex = (currentIndex + 1) % currentAlbum.length;
    modalImage.src = currentAlbum[currentIndex];
  };

  document.getElementById("prev").onclick = () => {
    currentIndex = (currentIndex - 1 + currentAlbum.length) % currentAlbum.length;
    modalImage.src = currentAlbum[currentIndex];
  };

  // Agregar al carrito
  document.getElementById("add-cart").onclick = () => {
    const photo = currentAlbum[currentIndex];
    if (!cart.includes(photo)) {
      cart.push(photo);
      updateCart();
    }
  };

  function updateCart() {
    document.getElementById("cart-count").textContent = cart.length;
    document.getElementById("cart-total").textContent = cart.length * 1500;
  }

  // Checkout
  document.getElementById("checkout").onclick = () => {
    const selContainer = document.getElementById("selected-photos");
    selContainer.innerHTML = "";
    cart.forEach((photo) => {
      const img = document.createElement("img");
      img.src = photo;
      selContainer.appendChild(img);
    });

    const msg = `Hola, quiero comprar las siguientes fotos:\n\n${cart.join("\n")}`;
    document.getElementById("whatsapp-link").href = `https://wa.me/543584328924?text=` + encodeURIComponent(msg);
    document.getElementById("checkout-modal").classList.remove("hidden");
  };

  // Vaciar carrito
  document.getElementById("clear-cart").onclick = () => {
    cart = [];
    updateCart();
    document.getElementById("selected-photos").innerHTML = "";
  };
});
