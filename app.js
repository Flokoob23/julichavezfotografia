// Variables globales
let albums = [
  // Ejemplo:
  // { id: 1, name: 'Naturaleza' },
  // { id: 2, name: 'Retratos' },
];
let photos = {
  // albumId: [ { id, title, src }, ... ]
  // Ejemplo:
  // 1: [{ id: 1, title: 'Árbol', src: 'path/to/tree.jpg' }]
};

let cart = [];
let orders = [];

let currentAlbum = null;
let currentPhotoIndex = 0;

// Mostrar lista de álbumes (versión usuario)
function loadAlbums() {
  const albumsSection = document.getElementById('albumsSection');
  albumsSection.innerHTML = '';
  albums.forEach(album => {
    const div = document.createElement('div');
    div.className = 'cursor-pointer p-4 border rounded hover:bg-gray-100';
    div.textContent = album.name;
    div.onclick = () => {
      currentAlbum = album.id;
      showPhotos(album.id);
    };
    albumsSection.appendChild(div);
  });
}

// Mostrar fotos de un álbum (usuario)
function showPhotos(albumId) {
  currentAlbum = albumId;
  document.getElementById('albumsSection').classList.add('hidden');
  const photosSection = document.getElementById('photosSection');
  photosSection.classList.remove('hidden');
  photosSection.innerHTML = '';

  const albumPhotos = photos[albumId] || [];
  albumPhotos.forEach((photo, index) => {
    const photoDiv = document.createElement('div');
    photoDiv.className = 'inline-block m-2 cursor-pointer rounded overflow-hidden border hover:shadow-lg';
    photoDiv.style.width = '150px';
    photoDiv.innerHTML = `<img src="${photo.src}" alt="${photo.title}" class="w-full h-auto" />`;
    photoDiv.onclick = () => openPhotoModal(index);
    photosSection.appendChild(photoDiv);
  });

  // Botón para volver a álbumes
  const backBtn = document.createElement('button');
  backBtn.textContent = '← Volver a álbumes';
  backBtn.className = 'mt-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400';
  backBtn.onclick = () => {
    document.getElementById('photosSection').classList.add('hidden');
    document.getElementById('albumsSection').classList.remove('hidden');
    currentAlbum = null;
  };
  photosSection.appendChild(backBtn);
}

// Abrir modal foto
function openPhotoModal(index) {
  currentPhotoIndex = index;
  const albumPhotos = photos[currentAlbum] || [];
  const photo = albumPhotos[index];
  if (!photo) return;

  const modalImage = document.getElementById('modalImage');
  const modalPhotoTitle = document.getElementById('modalPhotoTitle');
  const addToCartBtn = document.getElementById('addToCartBtn');

  modalImage.src = photo.src;
  modalPhotoTitle.textContent = photo.title;

  const isInCart = cart.some(item => item.id === photo.id);
  if (isInCart) {
    addToCartBtn.textContent = 'Ya en el carrito';
    addToCartBtn.disabled = true;
    addToCartBtn.classList.add('bg-gray-400');
    addToCartBtn.classList.remove('bg-black', 'hover:bg-gray-800');
  } else {
    addToCartBtn.textContent = 'Agregar al carrito';
    addToCartBtn.disabled = false;
    addToCartBtn.classList.remove('bg-gray-400');
    addToCartBtn.classList.add('bg-black', 'hover:bg-gray-800');
  }

  document.getElementById('photoModal').classList.remove('hidden');
}

// Cerrar modal foto
function closePhotoModal() {
  document.getElementById('photoModal').classList.add('hidden');
}

// Mostrar siguiente foto
function showNextPhoto() {
  const albumPhotos = photos[currentAlbum] || [];
  currentPhotoIndex = (currentPhotoIndex + 1) % albumPhotos.length;
  openPhotoModal(currentPhotoIndex);
}

// Mostrar foto anterior
function showPreviousPhoto() {
  const albumPhotos = photos[currentAlbum] || [];
  currentPhotoIndex = (currentPhotoIndex - 1 + albumPhotos.length) % albumPhotos.length;
  openPhotoModal(currentPhotoIndex);
}

// Agregar foto actual al carrito
function addCurrentPhotoToCart() {
  const albumPhotos = photos[currentAlbum] || [];
  const photo = albumPhotos[currentPhotoIndex];
  if (!photo) return;

  if (!cart.some(item => item.id === photo.id)) {
    cart.push({
      id: photo.id,
      title: photo.title,
      src: photo.src,
      price: 1500
    });
    updateCartCount();

    const addToCartBtn = document.getElementById('addToCartBtn');
    addToCartBtn.textContent = 'Ya en el carrito';
    addToCartBtn.disabled = true;
    addToCartBtn.classList.add('bg-gray-400');
    addToCartBtn.classList.remove('bg-black', 'hover:bg-gray-800');

    showSuccessModal('¡Agregado al carrito!', 'La foto ha sido agregada a tu carrito de compras.');
  }
}

// Actualizar contador carrito
function updateCartCount() {
  document.getElementById('cartCount').textContent = cart.length;
}

// Mostrar carrito
function showCart() {
  if (cart.length === 0) {
    showSuccessModal('Carrito vacío', 'No hay fotos en tu carrito de compras.');
    return;
  }

  const cartItems = document.getElementById('cartItems');
  cartItems.innerHTML = '';

  let total = 0;

  cart.forEach(item => {
    const itemElement = document.createElement('div');
    itemElement.className = 'flex items-center justify-between py-4 border-b border-gray-200';

    itemElement.innerHTML = `
      <div class="flex items-center">
        <img src="${item.src}" alt="${item.title}" class="w-16 h-16 object-cover rounded-md mr-4" />
        <div>
          <h5 class="font-bold">${item.title}</h5>
          <p class="text-gray-600">$${item.price}</p>
        </div>
      </div>
      <button class="text-red-500 hover:text-red-700" data-item-id="${item.id}" aria-label="Eliminar del carrito">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    `;

    cartItems.appendChild(itemElement);

    // Evento eliminar
    itemElement.querySelector('button').addEventListener('click', function () {
      const itemId = parseInt(this.getAttribute('data-item-id'));
      removeFromCart(itemId);
    });

    total += item.price;
  });

  document.getElementById('cartTotal').textContent = `$${total}`;
  document.getElementById('cartModal').classList.remove('hidden');
}

// Cerrar modal carrito
function closeCartModal() {
  document.getElementById('cartModal').classList.add('hidden');
}

// Eliminar item del carrito
function removeFromCart(itemId) {
  cart = cart.filter(item => item.id !== itemId);
  updateCartCount();
  showCart();
}

// Mostrar checkout
function showCheckout() {
  if (cart.length === 0) {
    showSuccessModal('Carrito vacío', 'No hay fotos en tu carrito de compras.');
    return;
  }

  closeCartModal();

  const checkoutPhotos = document.getElementById('checkoutPhotos');
  checkoutPhotos.innerHTML = '';

  let total = 0;

  cart.forEach(item => {
    const photoElement = document.createElement('div');
    photoElement.className = 'aspect-square bg-gray-100 rounded-md overflow-hidden';

    photoElement.innerHTML = `<img src="${item.src}" alt="${item.title}" class="w-full h-full object-cover" />`;

    checkoutPhotos.appendChild(photoElement);
    total += item.price;
  });

  document.getElementById('checkoutTotal').textContent = `$${total}`;
  document.getElementById('checkoutModal').classList.remove('hidden');

  // Reset form fields
  document.getElementById('deliveryMethod').value = 'email';
  toggleDeliveryFields();
}

// Cerrar modal checkout
function closeCheckoutModal() {
  document.getElementById('checkoutModal').classList.add('hidden');
}

// Alternar campos delivery según método
function toggleDeliveryFields() {
  const method = document.getElementById('deliveryMethod').value;
  const emailField = document.getElementById('emailField');
  const whatsappField = document.getElementById('whatsappField');

  if (method === 'email') {
    emailField.classList.remove('hidden');
    whatsappField.classList.add('hidden');
    emailField.querySelector('input').required = true;
    whatsappField.querySelector('input').required = false;
  } else {
    emailField.classList.add('hidden');
    whatsappField.classList.remove('hidden');
    emailField.querySelector('input').required = false;
    whatsappField.querySelector('input').required = true;
  }
}

// Procesar pedido
function processOrder(e) {
  e.preventDefault();

  const form = e.target;
  const customerName = form.customerName.value.trim();
  const deliveryMethod = document.getElementById('deliveryMethod').value;
  const contact = deliveryMethod === 'email' ?
    document.querySelector('#emailField input').value.trim() :
    document.querySelector('#whatsappField input').value.trim();

  if (!customerName || !contact) {
    showSuccessModal('Error', 'Por favor completa todos los campos.');
    return;
  }

  // Crear nuevo pedido
  const newOrder = {
    id: orders.length + 1,
    customerName,
    deliveryMethod,
    contact,
    photos: cart.map(item => item.id),
    total: cart.reduce((sum, item) => sum + item.price, 0),
    date: new Date().toISOString().split('T')[0]
  };

  orders.push(newOrder);

  // Vaciar carrito
  cart = [];
  updateCartCount();

  closeCheckoutModal();
  showSuccessModal('¡Compra realizada!', 'Tu pedido ha sido procesado correctamente. Recibirás tus fotos pronto.');

  // Opcional: reset form
  form.reset();
  toggleDeliveryFields();
}

// Mostrar modal login admin
function showAdminLogin() {
  document.getElementById('adminLoginModal').classList.remove('hidden');
  document.getElementById('adminUsername').value = '';
  document.getElementById('adminPassword').value = '';
  document.getElementById('loginError').classList.add('hidden');
}

// Cerrar modal login admin
function closeAdminLoginModal() {
  document.getElementById('adminLoginModal').classList.add('hidden');
}

// Manejar login admin
function handleAdminLogin(e) {
  e.preventDefault();

  const username = document.getElementById('adminUsername').value.trim();
  const password = document.getElementById('adminPassword').value.trim();

  if (username === 'tesai25' && password === 'julifotos25') {
    closeAdminLoginModal();
    showAdminPanel();
  } else {
    document.getElementById('loginError').classList.remove('hidden');
  }
}

// Mostrar panel admin
function showAdminPanel() {
  loadAdminAlbums();
  loadAdminOrders();
  switchAdminTab('albums');
  document.getElementById('adminPanelModal').classList.remove('hidden');
}

// Cerrar panel admin
function closeAdminPanelModal() {
  document.getElementById('adminPanelModal').classList.add('hidden');
}

// Cambiar tab admin
function switchAdminTab(tabId) {
  document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    if (btn.getAttribute('data-tab') === tabId) {
      btn.classList.add('border-black');
      btn.classList.remove('border-transparent');
    } else {
      btn.classList.remove('border-black');
      btn.classList.add('border-transparent');
    }
  });

  if (tabId === 'albums') {
    document.getElementById('adminAlbumsTab').classList.remove('hidden');
    document.getElementById('adminOrdersTab').classList.add('hidden');
  } else {
    document.getElementById('adminAlbumsTab').classList.add('hidden');
    document.getElementById('adminOrdersTab').classList.remove('hidden');
  }
}

// Cargar álbumes admin
function loadAdminAlbums() {
  const albumsList = document.getElementById('albumsList');
  albumsList.innerHTML = '';

  albums.forEach(album => {
    const albumElement = document.createElement('div');
    albumElement.className = 'flex items-center justify-between p-4 bg-gray-100 rounded-md';

    albumElement.innerHTML = `
      <div>
        <h5 class="font-bold">${album.name}</h5>
        <p class="text-gray-600">${(photos[album.id] || []).length} fotos</p>
      </div>
      <div class="flex space-x-2">
        <button class="bg-black text-white px-3 py-1 rounded-md hover:bg-gray-800 transition" data-album-id="${album.id}">
          Editar
        </button>
        <button class="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition" data-album-id="${album.id}">
          Eliminar
        </button>
      </div>
    `;

    albumsList.appendChild(albumElement);

    const buttons = albumElement.querySelectorAll('button');
    buttons[0].addEventListener('click', () => editAlbum(album.id));
    buttons[1].addEventListener('click', () => deleteAlbum(album.id));
  });
}

// Cargar pedidos admin
function loadAdminOrders() {
  const ordersList = document.getElementById('ordersList');
  ordersList.innerHTML = '';

  if (orders.length === 0) {
    ordersList.innerHTML = '<p class="text-gray-600">No hay pedidos registrados.</p>';
    return;
  }

  orders.forEach(order => {
    const orderElement = document.createElement('div');
    orderElement.className = 'p-4 bg-gray-100 rounded-md';

    const photosList = order.photos.map(photoId => {
      for (const albumId in photos) {
        const photo = photos[albumId].find(p => p.id === photoId);
        if (photo) return photo.title;
      }
      return `Foto #${photoId}`;
    }).join(', ');

    orderElement.innerHTML = `
      <div class="flex justify-between items-start">
        <div>
          <h5 class="font-bold">${order.customerName}</h5>
          <p class="text-gray-600">Fecha: ${order.date}</p>
          <p class="text-gray-600">Método de entrega: ${order.deliveryMethod === 'email' ? 'Correo electrónico' : 'WhatsApp'}</p>
          <p class="text-gray-600">Contacto: ${order.contact}</p>
          <p class="text-gray-600">Fotos: ${photosList}</p>
        </div>
        <div class="text-xl font-bold">$${order.total}</div>
      </div>
    `;

    ordersList.appendChild(orderElement);
  });
}

// Mostrar formulario agregar álbum
function showAddAlbumForm() {
  document.getElementById('addAlbumForm').classList.remove('hidden');
  document.getElementById('newAlbumName').value = '';
}

// Ocultar formulario agregar álbum
function hideAddAlbumForm() {
  document.getElementById('addAlbumForm').classList.add('hidden');
}

// Agregar álbum
function handleAddAlbum(e) {
  e.preventDefault();
  const albumName = document.getElementById('newAlbumName').value.trim();
  if (albumName === '') return;

  const newAlbumId = albums.length > 0 ? Math.max(...albums.map(a => a.id)) + 1 : 1;

  albums.push({
    id: newAlbumId,
    name: albumName
  });

  photos[newAlbumId] = [];

  hideAddAlbumForm();
  loadAdminAlbums();
  loadAlbums();

  showSuccessModal('Álbum creado', `El álbum "${albumName}" ha sido creado correctamente.`);
}

// Editar álbum
function editAlbum(albumId) {
  const album = albums.find(a => a.id === albumId);
  if (!album) return;

  const newName = prompt('Editar nombre del álbum:', album.name);
  if (newName && newName.trim() !== '') {
    album.name = newName.trim();
    loadAdminAlbums();
    loadAlbums();

    showSuccessModal('Álbum actualizado', `El álbum ha sido actualizado correctamente.`);
  }
}

// Eliminar álbum
function deleteAlbum(albumId) {
  if (!confirm('¿Estás seguro de que deseas eliminar este álbum? Esta acción no se puede deshacer.')) {
    return;
  }

  albums = albums.filter(a => a.id !== albumId);
  delete photos[albumId];

  loadAdminAlbums();
  loadAlbums();

  showSuccessModal('Álbum eliminado', `El álbum ha sido eliminado correctamente.`);
}

// Mostrar modal éxito
function showSuccessModal(title, message) {
  document.getElementById('successTitle').textContent = title;
  document.getElementById('successMessage').textContent = message;
  document.getElementById('successModal').classList.remove('hidden');
}

// Cerrar modal éxito
function closeSuccessModal() {
  document.getElementById('successModal').classList.add('hidden');
}

// Al cargar página: mostrar álbumes
document.addEventListener('DOMContentLoaded', () => {
  loadAlbums();

  // Eventos para cambiar pestañas admin
  document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      switchAdminTab(btn.getAttribute('data-tab'));
    });
  });
});


