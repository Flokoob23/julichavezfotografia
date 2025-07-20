// Datos iniciales - Álbumes y fotos ejemplo (se podrán modificar por admin luego)
const albums = [
    {
        id: 'album1',
        title: 'Bodas',
        photos: [
            { id: 'photo1', title: 'Novios en el altar', url: 'https://picsum.photos/id/1011/600/400' },
            { id: 'photo2', title: 'Anillo de compromiso', url: 'https://picsum.photos/id/1015/600/400' },
            { id: 'photo3', title: 'Primer baile', url: 'https://picsum.photos/id/1016/600/400' },
        ],
    },
    {
        id: 'album2',
        title: 'Eventos Corporativos',
        photos: [
            { id: 'photo4', title: 'Conferencia principal', url: 'https://picsum.photos/id/1020/600/400' },
            { id: 'photo5', title: 'Networking', url: 'https://picsum.photos/id/1021/600/400' },
            { id: 'photo6', title: 'Cena de gala', url: 'https://picsum.photos/id/1022/600/400' },
        ],
    },
    {
        id: 'album3',
        title: 'Familia',
        photos: [
            { id: 'photo7', title: 'Cumpleaños infantil', url: 'https://picsum.photos/id/1025/600/400' },
            { id: 'photo8', title: 'Reunión familiar', url: 'https://picsum.photos/id/1026/600/400' },
            { id: 'photo9', title: 'Vacaciones', url: 'https://picsum.photos/id/1027/600/400' },
        ],
    },
];

// Precio fijo por foto
const PRICE_PER_PHOTO = 1500;

// Variables globales
let currentAlbumId = null;
let cart = [];
let purchaseRecords = []; // Aquí se guardan las compras hechas (podés guardarlo en localStorage o backend si querés)

const albumsSection = document.getElementById('albums-section');
const albumsContainer = document.getElementById('albums-container');

const photosSection = document.getElementById('photos-section');
const albumTitle = document.getElementById('album-title');
const photosContainer = document.getElementById('photos-container');
const backToAlbumsBtn = document.getElementById('back-to-albums');

const cartIconBtn = document.getElementById('cart-icon-btn');
const cartCountSpan = document.getElementById('cart-count');
const cartModal = document.getElementById('cart-modal');
const cartCloseBtn = document.getElementById('cart-close-btn');
const cartItemsModal = document.getElementById('cart-items-modal');
const cartTotalModal = document.getElementById('cart-total-modal');
const checkoutBtnModal = document.getElementById('checkout-btn-modal');

const photoModal = document.getElementById('photo-modal');
const photoCloseBtn = document.getElementById('photo-close-btn');
const photoModalTitle = document.getElementById('photo-modal-title');
const photoModalImg = document.getElementById('photo-modal-img');
const prevPhotoBtn = document.getElementById('prev-photo-btn');
const nextPhotoBtn = document.getElementById('next-photo-btn');
const toggleCartBtn = document.getElementById('toggle-cart-btn');

const checkoutSection = document.getElementById('checkout-section');
const checkoutForm = document.getElementById('checkout-form');
const customerNameInput = document.getElementById('customer-name');
const deliveryMethodSelect = document.getElementById('delivery-method');
const deliveryContactInput = document.getElementById('delivery-contact');
const deliveryContactLabel = document.getElementById('delivery-contact-label');
const paymentAmountSpan = document.getElementById('payment-amount');
const cancelCheckoutBtn = document.getElementById('cancel-checkout');

// Admin
const adminToggleBtn = document.getElementById('admin-toggle');
const adminPanel = document.getElementById('admin-panel');
const adminLoginSection = document.getElementById('admin-login-section');
const adminControlsSection = document.getElementById('admin-controls');
const adminUsernameInput = document.getElementById('admin-username');
const adminPasswordInput = document.getElementById('admin-password');
const adminLoginBtn = document.getElementById('admin-login-btn');
const adminLoginMsg = document.getElementById('admin-login-msg');
const newAlbumTitleInput = document.getElementById('new-album-title');
const addAlbumBtn = document.getElementById('add-album-btn');
const adminAlbumList = document.getElementById('admin-album-list');
const purchaseRecordsTableBody = document.querySelector('#purchase-records tbody');
const adminLogoutBtn = document.getElementById('admin-logout-btn');

let currentPhotoIndex = 0; // Para navegación modal foto

// ---------- Funciones ----------

// Render albums en la página principal
function renderAlbums() {
    albumsContainer.innerHTML = '';
    albums.forEach(album => {
        const div = document.createElement('div');
        div.className = 'album-card';
        div.tabIndex = 0;
        div.textContent = album.title;
        div.addEventListener('click', () => openAlbum(album.id));
        div.addEventListener('keypress', e => {
            if (e.key === 'Enter' || e.key === ' ') openAlbum(album.id);
        });
        albumsContainer.appendChild(div);
    });
}

// Abrir álbum y mostrar sus fotos
function openAlbum(albumId) {
    currentAlbumId = albumId;
    const album = albums.find(a => a.id === albumId);
    if (!album) return;

    albumTitle.textContent = album.title;
    photosContainer.innerHTML = '';

    album.photos.forEach((photo, index) => {
        const photoDiv = document.createElement('div');
        photoDiv.className = 'photo-card';
        photoDiv.tabIndex = 0;
        photoDiv.title = photo.title;
        photoDiv.innerHTML = `<img src="${photo.url}" alt="${photo.title}" />`;
        photoDiv.addEventListener('click', () => openPhotoModal(index));
        photoDiv.addEventListener('keypress', e => {
            if(e.key === 'Enter' || e.key === ' ') openPhotoModal(index);
        });
        photosContainer.appendChild(photoDiv);
    });

    albumsSection.classList.add('hidden');
    photosSection.classList.remove('hidden');
}

// Volver a sección álbumes
backToAlbumsBtn.addEventListener('click', () => {
    photosSection.classList.add('hidden');
    albumsSection.classList.remove('hidden');
    currentAlbumId = null;
});

// Modal foto ampliada
function openPhotoModal(index) {
    const album = albums.find(a => a.id === currentAlbumId);
    if (!album || !album.photos[index]) return;

    currentPhotoIndex = index;
    const photo = album.photos[index];
    photoModalTitle.textContent = photo.title;
    photoModalImg.src = photo.url;
    photoModalImg.alt = photo.title;

    updateToggleCartButton(photo.id);

    photoModal.classList.remove('hidden');
}

photoCloseBtn.addEventListener('click', () => photoModal.classList.add('hidden'));

// Cambiar foto en modal (prev/next)
function changePhoto(step) {
    const album = albums.find(a => a.id === currentAlbumId);
    if (!album) return;

    let newIndex = currentPhotoIndex + step;
    if (newIndex < 0) newIndex = album.photos.length - 1;
    if (newIndex >= album.photos.length) newIndex = 0;

    openPhotoModal(newIndex);
}
prevPhotoBtn.addEventListener('click', () => changePhoto(-1));
nextPhotoBtn.addEventListener('click', () => changePhoto(1));

// Manejar agregar o quitar foto del carrito desde modal foto
toggleCartBtn.addEventListener('click', () => {
    const album = albums.find(a => a.id === currentAlbumId);
    if (!album) return;

    const photo = album.photos[currentPhotoIndex];
    if (!photo) return;

    const idx = cart.findIndex(p => p.id === photo.id);
    if (idx > -1) {
        cart.splice(idx, 1);
    } else {
        cart.push(photo);
    }

    updateToggleCartButton(photo.id);
    renderCartCount();
});

// Actualizar botón toggle carrito en modal foto
function updateToggleCartButton(photoId) {
    const inCart = cart.some(p => p.id === photoId);
    toggleCartBtn.textContent = inCart ? 'Quitar del carrito' : 'Agregar al carrito';
}

// Render contador carrito arriba
function renderCartCount() {
    cartCountSpan.textContent = cart.length;
    checkoutBtnModal.disabled = cart.length === 0;
}

// Carrito ícono arriba - abrir modal carrito
cartIconBtn.addEventListener('click', () => {
    renderCartModalItems();
    cartModal.classList.remove('hidden');
});

// Cerrar modal carrito
cartCloseBtn.addEventListener('click', () => {
    cartModal.classList.add('hidden');
});

// Render items dentro del modal carrito
function renderCartModalItems() {
    cartItemsModal.innerHTML = '';

    if(cart.length === 0){
        cartItemsModal.innerHTML = '<p>Carrito vacío</p>';
        cartTotalModal.textContent = '$0';
        checkoutBtnModal.disabled = true;
        return;
    }

    cart.forEach(photo => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.textContent = photo.title;

        const removeBtn = document.createElement('button');
        removeBtn.title = 'Quitar del carrito';
        removeBtn.innerHTML = '&times;';
        removeBtn.addEventListener('click', () => {
            cart = cart.filter(p => p.id !== photo.id);
            renderCartModalItems();
            renderCartCount();
        });

        itemDiv.appendChild(removeBtn);
        cartItemsModal.appendChild(itemDiv);
    });

    const total = cart.length * PRICE_PER_PHOTO;
    cartTotalModal.textContent = `$${total.toLocaleString('es-AR')}`;
    checkoutBtnModal.disabled = false;
}

// Al presionar finalizar compra en modal carrito, abrir sección checkout
checkoutBtnModal.addEventListener('click', () => {
    cartModal.classList.add('hidden');
    checkoutSection.classList.remove('hidden');
    albumsSection.classList.add('hidden');
    photosSection.classList.add('hidden');

    paymentAmountSpan.textContent = `$${(cart.length * PRICE_PER_PHOTO).toLocaleString('es-AR')}`;
    deliveryContactInput.value = '';
    deliveryContactInput.classList.add('hidden');
    deliveryContactLabel.classList.add('hidden');
    deliveryMethodSelect.value = '';
});

// Mostrar campo contacto según medio de entrega
deliveryMethodSelect.addEventListener('change', () => {
    if(deliveryMethodSelect.value === 'correo'){
        deliveryContactLabel.textContent = 'Correo electrónico:';
        deliveryContactInput.placeholder = 'ejemplo@mail.com';
        deliveryContactInput.type = 'email';
        deliveryContactInput.required = true;
        deliveryContactInput.classList.remove('hidden');
        deliveryContactLabel.classList.remove('hidden');
    } else if(deliveryMethodSelect.value === 'whatsapp'){
        deliveryContactLabel.textContent = 'Número de WhatsApp:';
        deliveryContactInput.placeholder = '+54 9 11 1234 5678';
        deliveryContactInput.type = 'tel';
        deliveryContactInput.required = true;
        deliveryContactInput.classList.remove('hidden');
        deliveryContactLabel.classList.remove('hidden');
    } else {
        deliveryContactInput.classList.add('hidden');
        deliveryContactLabel.classList.add('hidden');
        deliveryContactInput.required = false;
    }
});

// Cancelar checkout - volver a álbumes
cancelCheckoutBtn.addEventListener('click', () => {
    checkoutSection.classList.add('hidden');
    albumsSection.classList.remove('hidden');
    photosSection.classList.add('hidden');
    cart = [];
    renderCartCount();
});

// Enviar formulario checkout (simulamos guardado y limpieza)
checkoutForm.addEventListener('submit', e => {
    e.preventDefault();

    // Validaciones básicas
    if (!customerNameInput.value.trim()) {
        alert('Ingrese su nombre completo');
        return;
    }
    if (!deliveryMethodSelect.value) {
        alert('Seleccione un medio para recibir las fotos');
        return;
    }
    if (!deliveryContactInput.value.trim()) {
        alert('Ingrese su contacto para la entrega');
        return;
    }
    if (!checkoutForm['paymentProof'].files.length) {
        alert('Debe cargar el comprobante de pago');
        return;
    }

    // Guardar registro compra (aquí podés enviar a backend o almacenar donde prefieras)
    const newPurchase = {
        name: customerNameInput.value.trim(),
        contactMethod: deliveryMethodSelect.value,
        contact: deliveryContactInput.value.trim(),
        paymentProof: URL.createObjectURL(checkoutForm['paymentProof'].files[0]),
        date: new Date().toLocaleString(),
        photos: cart.map(p => p.title),
        total: cart.length * PRICE_PER_PHOTO,
    };

    purchaseRecords.push(newPurchase);
    alert('¡Compra registrada con éxito! Muchas gracias.');

    // Limpiar y volver a inicio
    checkoutForm.reset();
    checkoutSection.classList.add('hidden');
    albumsSection.classList.remove('hidden');
    photosSection.classList.add('hidden');
    cart = [];
    renderCartCount();

    // Si admin está logueado, actualizar tabla de compras
    if(adminControlsSection.classList.contains('hidden') === false){
        renderPurchaseRecords();
    }
});

// ----------- Admin panel -----------

adminToggleBtn.addEventListener('click', () => {
    adminPanel.classList.toggle('hidden');
});

// Login admin
adminLoginBtn.addEventListener('click', () => {
    const user = adminUsernameInput.value.trim();
    const pass = adminPasswordInput.value.trim();
    if(user === 'tesai25' && pass === 'julifotos25'){
        adminLoginMsg.textContent = '';
        adminLoginSection.classList.add('hidden');
        adminControlsSection.classList.remove('hidden');
        renderAdminAlbums();
        renderPurchaseRecords();
    } else {
        adminLoginMsg.textContent = 'Usuario o contraseña incorrectos';
    }
});

// Logout admin
adminLogoutBtn.addEventListener('click', () => {
    adminUsernameInput.value = '';
    adminPasswordInput.value = '';
    adminLoginSection.classList.remove('hidden');
    adminControlsSection.classList.add('hidden');
});

// Render lista álbumes admin
function renderAdminAlbums() {
    adminAlbumList.innerHTML = '';
    albums.forEach((album, index) => {
        const li = document.createElement('li');
        li.textContent = album.title;
        const delBtn = document.createElement('button');
        delBtn.title = `Eliminar álbum "${album.title}"`;
        delBtn.innerHTML = '&times;';
        delBtn.addEventListener('click', () => {
            if(confirm(`Eliminar álbum "${album.title}"? Se perderán todas sus fotos.`)){
                albums.splice(index,1);
                renderAlbums();
                renderAdminAlbums();
            }
        });
        li.appendChild(delBtn);
        adminAlbumList.appendChild(li);
    });
}

// Agregar álbum admin
addAlbumBtn.addEventListener('click', () => {
    const newTitle = newAlbumTitleInput.value.trim();
    if(!newTitle) return alert('Ingrese un título válido');
    // Verificar duplicado
    if(albums.some(a => a.title.toLowerCase() === newTitle.toLowerCase())){
        return alert('Ya existe un álbum con ese título');
    }
    albums.push({id: `album${Date.now()}`, title: newTitle, photos: []});
    newAlbumTitleInput.value = '';
    renderAlbums();
    renderAdminAlbums();
});

// Render tabla registros compras admin
function renderPurchaseRecords() {
    purchaseRecordsTableBody.innerHTML = '';
    if(purchaseRecords.length === 0){
        purchaseRecordsTableBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No hay registros aún</td></tr>';
        return;
    }
    purchaseRecords.forEach(record => {
        const tr = document.createElement('tr');

        const tdName = document.createElement('td');
        tdName.textContent = record.name;
        tr.appendChild(tdName);

        const tdProof = document.createElement('td');
        const img = document.createElement('img');
        img.src = record.paymentProof;
        img.alt = `Comprobante de ${record.name}`;
        img.title = 'Ver comprobante';
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => window.open(record.paymentProof, '_blank'));
        tdProof.appendChild(img);
        tr.appendChild(tdProof);

        const tdDate = document.createElement('td');
        tdDate.textContent = record.date;
        tr.appendChild(tdDate);

        const tdPhotos = document.createElement('td');
        tdPhotos.textContent = record.photos.join(', ');
        tr.appendChild(tdPhotos);

        purchaseRecordsTableBody.appendChild(tr);
    });
}

// Inicializar página
renderAlbums();
renderCartCount();

