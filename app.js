document.addEventListener("DOMContentLoaded", () => {
  const whatsappNumber = "3584328924";
  const pricePerPhoto = 1500;

  const albumsData = [
    {
      nombre: "🌿 Paisajes Naturales",
      imagenes: [
        "https://i.imgur.com/2jMCqQ2.jpg",
        "https://i.imgur.com/QFDRuAh.jpg",
        "https://i.imgur.com/8yIIokW.jpg"
      ]
    },
    {
      nombre: "🌇 Atardeceres",
      imagenes: [
        "https://i.imgur.com/pwpWaWu.jpg",
        "https://i.imgur.com/KIPtISY.jpg",
        "https://i.imgur.com/2jMCqQ2.jpg"
      ]
    },
    {
      nombre: "⛰️ Montañas y Lagos",
      imagenes: [
        "https://images.pexels.com/photos/3348748/pexels-photo-3348748.jpeg",
        "https://images.pexels.com/photos/3812944/pexels-photo-3812944.jpeg",
        "https://images.pexels.com/photos/2100063/pexels-photo-2100063.jpeg"
      ]
    },
    {
      nombre: "🏙️ Cámaras Urbanas",
      imagenes: [
        "https://images.pexels.com/photos/4725133/pexels-photo-4725133.jpeg",
        "https://images.pexels.com/photos/1385472/pexels-photo-1385472.jpeg",
        "https://images.pexels.com/photos/3228213/pexels-photo-3228213.jpeg"
      ]
    }
  ];

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let currentAlbum = [];
  let currentIndex = 0;

  // DOM Elements
  const intro = document.getElementById("intro");
  const header = document.getElementById("header");
  const albumsContainer = document.getElementById("albums-container");
  const photoGrid = document.getElementById("photo-grid");
  const photoModal = document.getElementById("photo-modal");
  const modalImage = document.getElementById("modal-image");
  const cartFooter = document.getElementById("cart-footer");
  const selectedPhotosContainer = document.getElementById("selected-photos");
  const whatsappLink = document.getElementById("whatsapp-link");

  // Ocultar intro y mostrar álbumes
  setTimeout(() => {
    intro.classList.add("hidden");
    albumsContainer.classList.remove("hidden");
    albumsContainer.classList.add("visible");
    cartFooter.classList.remove("hidden");
    updateCart();
  }, 3000);

  // Cargar álbumes
  albumsData.forEach((album) => {
    const btn = document.createElement("button");
    btn.textContent = album.nombre;
    btn.addEventListener("click", () => openAlbum(album.imagenes));
    albumsContainer.appendChild(btn);
  });

  function openAlbum(imagenes) {
    currentAlbum = imagenes;
    currentIndex = 0;
    albumsContainer.classList.add("hidden");
    photoGrid.innerHTML = "";
    photoGrid.classList.remove("hidden");

    imagenes.forEach((src, i) => {
      const img = document.createElement("img");
      img.src = src;
      img.alt = `Foto ${i + 1}`;
      img.addEventListener("click", () => openPhotoModal(i));
      photoGrid.appendChild(img);
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openPhotoModal(index) {
    currentIndex = index;
    modalImage.src = currentAlbum[currentIndex];
    photoModal.classList.remove("hidden");
  }

  document.querySelectorAll(".close-modal").forEach((btn) =>
    btn.addEventListener("click", () => {
      document.querySelectorAll(".modal").forEach((modal) =>
        modal.classList.add("hidden")
      );
      if (!albumsContainer.classList.contains("hidden")) {
        photoGrid.classList.add("hidden");
      } else {
        photoGrid.classList.remove("hidden");
      }
    })
  );

  document.getElementById("next").addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % currentAlbum.length;
    modalImage.src = currentAlbum[currentIndex];
  });

  document.getElementById("prev").addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + currentAlbum.length) % currentAlbum.length;
    modalImage.src = currentAlbum[currentIndex];
  });

  document.getElementById("add-cart").addEventListener("click", () => {
    const photo = currentAlbum[currentIndex];
    if (!cart.includes(photo)) {
      cart.push(photo);
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCart();
    }
  });

  function updateCart() {
    document.getElementById("cart-count").textContent = cart.length;
    document.getElementById("cart-total").textContent = cart.length * pricePerPhoto;
  }

  document.getElementById("checkout").addEventListener("click", () => {
    if (cart.length === 0) return alert("No hay fotos en el carrito.");

    selectedPhotosContainer.innerHTML = "";

    cart.forEach((photo, i) => {
      const img = document.createElement("img");
      img.src = photo;
      img.alt = `Foto ${i + 1}`;
      selectedPhotosContainer.appendChild(img);
    });

    // Inputs dinámicos
    if (!document.getElementById("nombre")) {
      const nombreInput = document.createElement("input");
      nombreInput.type = "text";
      nombreInput.placeholder = "Tu nombre";
      nombreInput.id = "nombre";
      selectedPhotosContainer.after(nombreInput);
    }

    if (!document.getElementById("correo")) {
      const correoInput = document.createElement("input");
      correoInput.type = "email";
      correoInput.placeholder = "Tu correo (opcional)";
      correoInput.id = "correo";
      document.getElementById("nombre").after(correoInput);
    }

    // Crear mensaje para WhatsApp
    const nombre = document.getElementById("nombre").value || "Cliente";
    const correo = document.getElementById("correo").value || "";

    const listaFotos = cart.map((url, i) => `${i + 1}. ${url}`).join("\n");
    const total = cart.length * pricePerPhoto;
    const mensaje = `Hola, soy ${nombre}, quiero comprar estas fotos:\n\n${listaFotos}\n\nTotal: $${total}\n${correo ? "Correo: " + correo : ""}`;

    whatsappLink.href = `https://wa.me/54${whatsappNumber}?text=${encodeURIComponent(mensaje)}`;
    document.getElementById("checkout-modal").classList.remove("hidden");
  });

  document.getElementById("clear-cart").addEventListener("click", () => {
    if (confirm("¿Vaciar el carrito? Esta acción no se puede deshacer.")) {
      cart = [];
      updateCart();
      selectedPhotosContainer.innerHTML = "";
      localStorage.removeItem("cart");
    }
  });
});
