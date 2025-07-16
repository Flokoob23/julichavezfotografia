document.addEventListener("DOMContentLoaded", () => {
  const whatsappNumber = "543584328924";
  const albumsData = [
    { nombre: "Paisajes Naturales", imagenes: ["https://i.imgur.com/2jMCqQ2.jpg", "https://i.imgur.com/QFDRuAh.jpg", "https://i.imgur.com/8yIIokW.jpg"] },
    { nombre: "Atardeceres", imagenes: ["https://i.imgur.com/pwpWaWu.jpg", "https://i.imgur.com/KIPtISY.jpg", "https://i.imgur.com/2jMCqQ2.jpg"] },
    { nombre: "Montañas y Lagos", imagenes: ["https://images.pexels.com/photos/3348748/pexels-photo-3348748.jpeg", "https://images.pexels.com/photos/3812944/pexels-photo-3812944.jpeg", "https://images.pexels.com/photos/2100063/pexels-photo-2100063.jpeg"] },
    { nombre: "Cámaras Urbanas", imagenes: ["https://images.pexels.com/photos/4725133/pexels-photo-4725133.jpeg", "https://images.pexels.com/photos/1385472/pexels-photo-1385472.jpeg", "https://images.pexels.com/photos/3228213/pexels-photo-3228213.jpeg"] }
  ];

  let currentAlbum = [];
  let currentIndex = 0;
  let cart = [];

  const albumsContainer = document.getElementById("albums-container");
  const gallery = document.getElementById("gallery");
  const modal = document.getElementById("checkout-modal");

  albumsData.forEach((album, idx) => {
    const btn = document.createElement("button");
    btn.textContent = album.nombre;
    btn.onclick = () => openAlbum(idx);
    albumsContainer.appendChild(btn);
  });

  function openAlbum(idx) {
    currentAlbum = albumsData[idx].imagenes;
    currentIndex = 0;
    gallery.classList.remove("hidden");
    updateLargePhoto();
    renderThumbnails();
  }

  function updateLargePhoto() {
    const img = document.getElementById("photo-large");
    img.src = currentAlbum[currentIndex];
    img.alt = `Foto ${currentIndex + 1} del álbum`;
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
      alert(`Agregaste: ${photo.split("/").pop()}`);
      updateCart();
    } else alert("Esa foto ya está en el carrito.");
  };

  function renderThumbnails() {
    const thumbs = document.getElementById("thumbnails");
    thumbs.innerHTML = "";
    currentAlbum.forEach((src, i) => {
      const img = document.createElement("img");
      img.src = src;
      img.alt = `Miniatura ${i + 1}`;
      img.onclick = () => { currentIndex = i; updateLargePhoto(); };
      thumbs.appendChild(img);
    });
  }

  function updateCart() {
    document.getElementById("cart-count").textContent = cart.length;
    document.getElementById("cart-total").textContent = cart.length * 1500;
  }

  document.getElementById("checkout").onclick = () => {
    const selContainer = document.getElementById("selected-photos");
    selContainer.innerHTML = "";
    cart.forEach((photo, idx) => {
      const wrapper = document.createElement("div");
      wrapper.classList.add("thumb-container");
      const img = document.createElement("img");
      img.src = photo;
      img.alt = `Selección ${idx + 1}`;
      const remove = document.createElement("button");
      remove.textContent = "×";
      remove.classList.add("remove");
      remove.onclick = () => {
        cart = cart.filter(p => p !== photo);
        wrapper.remove();
        updateCart();
      };
      wrapper.appendChild(img);
      wrapper.appendChild(remove);
      selContainer.appendChild(wrapper);
    });
    const msg = `HOLA QUIERO COMPRAR LAS SIGUIENTES FOTOS:\n${cart.join("\n")}`;
    document.getElementById("whatsapp-link").href =
      `https://wa.me/54${whatsappNumber}?text=` + encodeURIComponent(msg);
    modal.classList.remove("hidden");
    modal.scrollIntoView({ behavior: "smooth" });
  };

  document.getElementById("clear-cart").onclick = () => {
    cart = [];
    updateCart();
    document.getElementById("selected-photos").innerHTML = "";
  };

  window.addEventListener("load", () => {
    setTimeout(() => {
      document.getElementById("header").classList.add("small");
    }, 2500);
  });
});
