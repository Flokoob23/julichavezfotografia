// Datos iniciales de ejemplo
const initialAlbums = [
    {
        id: 'album1',
        title: 'Bodas',
        photos: [
            { id: 'b1', title: 'Novios felices', url: 'https://picsum.photos/id/1011/400/300' },
            { id: 'b2', title: 'Anillo', url: 'https://picsum.photos/id/1012/400/300' },
            { id: 'b3', title: 'Baile', url: 'https://picsum.photos/id/1013/400/300' },
        ],
    },
    {
        id: 'album2',
        title: 'Retratos',
        photos: [
            { id: 'r1', title: 'Sonrisa', url: 'https://picsum.photos/id/1027/400/300' },
            { id: 'r2', title: 'Mirada', url: 'https://picsum.photos/id/1028/400/300' },
            { id: 'r3', title: 'Elegancia', url: 'https://picsum.photos/id/1031/400/300' },
        ],
    },
    {
        id: 'album3',
        title: 'Paisajes',
        photos: [
            { id: 'p1', title: 'Montañas', url: 'https://picsum.photos/id/1043/400/300' },
            { id: 'p2', title: 'Atardecer', url: 'https://picsum.photos/id/1044/400/300' },
            { id: 'p3', title: 'Río', url: 'https://picsum.photos/id/1045/400/300' },
        ],
    },
];

// Variables estado
let albums = [];
let currentAlbumId = null;
let cart = [];
let adminLoggedIn = false;
let purchases = []; // Registros de compra

// DOM references
const albumsContainer = document.getElementById('albums-container');
const photosSection = document.getElementById('photos-section');
const albumsSection = document.getElementById('albums-section');
const photosContainer = document.getElementById('photos-container');
const albumTitle = document.getElementById('album-title');
const backToAlbumsBtn = document.getElementById('back-to-albums');

const cartItemsContainer = document.getElementById('cart-items');
const cartTotalSpan = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');

const checkoutSection = document.getElementById('checkout-section');
const checkoutForm = document.getElementById('checkout-form');
const deliveryMethodSelect = document.getElementById('delivery-method');
const deliveryContactInput = document.getElementById('delivery-contact');
const deliveryContactLabel = document.getElementById('delivery-contact-label');
const paymentAmountSpan = document.getElementById('payment-amount');
const cancelCheckoutBtn = document.getElementById('cancel-checkout');

const adminToggleBtn = document.getElementById('admin-toggle');
const adminPanel = document.getElementById('admin-panel');
const adminLoginSection = document.getElementById('admin-login-section');
const adminControls = document.getElementById('admin-controls');
const adminUsernameInput = document.getElementById('admin-username');
const adminPasswordInput = document.getElementById('admin-password');
const adminLoginBtn = document.getElementById('admin-login-btn');
const adminLogoutBtn = document.getElementById('admin-logout-btn');
const adminLoginMsg = document.getElementById('admin-login-msg');
const newAlbumTitleInput = document.getElementById('new-album-title');
const addAlbumBtn = document.getElementById('add-album-btn');
const adminAlbumList = document.getElementById('admin-album-list');
const purchaseRecordsBody = document.querySelector('#purchase-records tbody');

const PRICE_PER_PHOTO = 1500;

// --- Funciones ---

// Guardar y cargar estado (opcional para persistencia simple localStorage)
function saveState() {
    localStorage.setItem('albums', JSON.stringify(albums));
    localStorage.setItem('purchases', JSON.stringify(purchases));
}
function loadState() {
    const storedAlbums = localStorage.getItem('albums');
    const storedPurchases = localStorage.getItem('purchases');
    if (storedAlbums) albums = JSON.parse(storedAlbums);
    else albums = JSON.parse(JSON.stringify(initialAlbums)); // deep copy
    if (storedPurchases) purchases = JSON.parse(storedPurchases);
    else purchases = [];
}
loadState();

// Mostrar álbumes
function renderAlbums() {
    albumsContainer.innerHTML = '';
    albums.forEach(album => {
        const card = document.createElement('div');
        card.className = 'album-card';
        card.tabIndex = 0;
        card.setAttribute('role', 'button');
        card.setAttribute('aria-pressed', 'false');
        card.innerHTML = `<h4>${album.title}</h4>`;
        card.addEventListener('click', () => openAlbum(album.id));
        card.addEventListener('keypress', e => {
            if(e.key === 'Enter' || e.key === ' ') openAlbum(album.id);
        });
        albumsContainer.appendChild(card);
    });
}

// Abrir álbum y mostrar fotos
function openAlbum(albumId) {
    currentAlbumId = albumId;
    const album = albums.find(a => a.id === albumId);
    if (!album) return;
    albumTitle.textContent = album.title;
    photosContainer.innerHTML = '';
    album.photos.forEach(photo => {
        const photoDiv = document.createElement('div');
        photoDiv.className = 'photo-card';
        photoDiv.tabIndex = 0;
        photoDiv.setAttribute('role', 'button');
        photoDiv.setAttribute('aria-pressed', 'false');
        photoDiv.title = photo.title;
        photoDiv.innerHTML = `<img src="${photo.url}" alt="${photo.title}" />`;
        photoDiv.addEventListener('click', () => togglePhotoInCart(photo));
        photoDiv.addEventListener('keypress', e => {
            if(e.key === 'Enter' || e.key === ' ') togglePhotoInCart(photo);
        });
        photosContainer.appendChild(photoDiv);
    });
    albumsSection.classList.add('hidden');
    photosSection.classList.remove('hidden');
}

// Volver a albums
backToAlbumsBtn.addEventListener('click', () => {
    photosSection.classList.add('hidden');
    albumsSection.classList.remove('hidden');
    currentAlbumId = null;
});

// Añadir foto al carrito o quitar si ya está
function togglePhotoInCart(photo) {
    const index = cart.findIndex(p => p.id === photo.id);
    if (index > -1) {
        cart.splice(index, 1);
    } else {
        cart.push(photo);
    }
    renderCart();
}

// Mostrar carrito
function renderCart() {
    cartItemsContainer.innerHTML = '';
    if(cart.length === 0){
        cartItemsContainer.innerHTML = '<p>Carrito vacío</p>';
        checkoutBtn.disabled = true;
        cartTotalSpan.textContent = '$0';
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
            renderCart();
        });
        itemDiv.appendChild(removeBtn);
        cartItemsContainer.appendChild(itemDiv);
    });

    const total = cart.length * PRICE_PER_PHOTO;
    cartTotalSpan.textContent = `$${total.toLocaleString('es-AR')}`;
    checkoutBtn.disabled = false;
}

// Checkout - mostrar form
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) return;
    checkoutSection.classList.remove('hidden');
    document.getElementById('main-content').classList.add('hidden');
    paymentAmountSpan.textContent = `$${(cart.length * PRICE_PER_PHOTO).toLocaleString('es-AR')}`;
    deliveryContactInput.value = '';
    deliveryContactInput.classList.add('hidden');
    deliveryContactLabel.classList.add('hidden');
    deliveryMethodSelect.value = '';
});

// Manejar cambio método entrega
deliveryMethodSelect.addEventListener('change', () => {
    const val = deliveryMethodSelect.value;
    if(val === 'correo' || val === 'whatsapp'){
        deliveryContactInput.classList.remove('hidden');
        deliveryContactLabel.classList.remove('hidden');
        deliveryContactLabel.textContent = val === 'correo' ? 'Ingrese correo electrónico:' : 'Ingrese número de WhatsApp:';
        deliveryContactInput.placeholder = val === 'correo' ? 'correo@ejemplo.com' : '+54 9 11 1234 5678';
    } else {
        deliveryContactInput.classList.add('hidden');
        deliveryContactLabel.classList.add('hidden');
    }
});

// Cancelar checkout
cancelCheckoutBtn.addEventListener('click', () => {
    checkoutSection.classList.add('hidden');
});

// Manejar envío de compra
checkoutForm.addEventListener('submit', e => {
    e.preventDefault();

    const name = checkoutForm.customerName.value.trim();
    const method = checkoutForm.deliveryMethod.value;
    const contact = checkoutForm.deliveryContact.value.trim();
    const fileInput = checkoutForm.paymentProof;

    if (!name || !method || !contact || fileInput.files.length === 0) {
        alert('Por favor complete todos los campos y cargue el comprobante.');
        return;
    }

    // Leer archivo imagen comprobante (simplificado)
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = function(event) {
        const purchase = {
            id: Date.now(),
            customerName: name,
            deliveryMethod: method,
            deliveryContact: contact,
            paymentProof: event.target.result, // base64 image
            date: new Date().toLocaleString('es-AR'),
            photos: cart.map(p => p.title),
            total: cart.length * PRICE_PER_PHOTO
        };
        purchases.push(purchase);
        saveState();
        alert('Compra registrada correctamente. ¡Gracias!');
        cart = [];
        renderCart();
        checkoutSection.classList.add('hidden');
        albumsSection.classList.remove('hidden');
        photosSection.classList.add('hidden');
        renderPurchaseRecords();
    }
    reader.readAsDataURL(file);
});

// --- Admin panel ---

// Toggle admin panel
adminToggleBtn.addEventListener('click', () => {
    adminPanel.classList.toggle('hidden');
});

// Login admin
adminLoginBtn.addEventListener('click', () => {
    const user = adminUsernameInput.value.trim();
    const pass = adminPasswordInput.value.trim();

    if(user === 'tesai25' && pass === 'julifotos25'){
        adminLoggedIn = true;
        adminLoginMsg.textContent = '';
        adminLoginSection.classList.add('hidden');
        adminControls.classList.remove('hidden');
        adminLogoutBtn.classList.remove('hidden');
        adminUsernameInput.value = '';
        adminPasswordInput.value = '';
        renderAdminAlbums();
        renderPurchaseRecords();
    } else {
        adminLoginMsg.textContent = 'Usuario o contraseña incorrectos.';
    }
});

// Logout admin
adminLogoutBtn.addEventListener('click', () => {
    adminLoggedIn = false;
    adminLoginSection.classList.remove('hidden');
    adminControls.classList.add('hidden');
    adminLogoutBtn.classList.add('hidden');
    adminLoginMsg.textContent = '';
});

// Render admin album list
function renderAdminAlbums() {
    adminAlbumList.innerHTML = '';
    albums.forEach(album => {
        const li = document.createElement('li');
        li.textContent = album.title;
        const delBtn = document.createElement('button');
        delBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        delBtn.title = 'Eliminar álbum';
        delBtn.addEventListener('click', () => {
            if(confirm(`Eliminar álbum "${album.title}"? Esta acción no se puede deshacer.`)){
                albums = albums.filter(a => a.id !== album.id);
                saveState();
                renderAlbums();
                renderAdminAlbums();
                if(currentAlbumId === album.id){
                    photosSection.classList.add('hidden');
                    albumsSection.classList.remove('hidden');
                    currentAlbumId = null;
                }
            }
        });
        li.appendChild(delBtn);
        adminAlbumList.appendChild(li);
    });
}

// Agregar álbum nuevo
addAlbumBtn.addEventListener('click', () => {
    const title = newAlbumTitleInput.value.trim();
    if(!title){
        alert('Ingrese un título para el álbum.');
        return;
    }
    // Crear id único simple
    const newId = 'album_' + Date.now();
    albums.push({ id: newId, title: title, photos: [] });
    newAlbumTitleInput.value = '';
    saveState();
    renderAlbums();
    renderAdminAlbums();
});

// Render registros de compra
function renderPurchaseRecords() {
    purchaseRecordsBody.innerHTML = '';
    if(purchases.length === 0){
        purchaseRecordsBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No hay compras registradas.</td></tr>';
        return;
    }
    purchases.forEach(purchase => {
        const tr = document.createElement('tr');

        // Nombre
        const tdName = document.createElement('td');
        tdName.textContent = purchase.customerName;
        tr.appendChild(tdName);

        // Comprobante (mostrar imagen en miniatura, clic para abrir grande)
        const tdProof = document.createElement('td');
        const imgProof = document.createElement('img');
        imgProof.src = purchase.paymentProof;
        imgProof.alt = 'Comprobante';
        imgProof.style.width = '60px';
        imgProof.style.cursor = 'pointer';
        imgProof.title = 'Ver comprobante';
        imgProof.addEventListener('click', () => {
            window.open(purchase.paymentProof, '_blank');
        });
        tdProof.appendChild(imgProof);
        tr.appendChild(tdProof);

        // Fecha
        const tdDate = document.createElement('td');
        tdDate.textContent = purchase.date;
        tr.appendChild(tdDate);

        // Fotos
        const tdPhotos = document.createElement('td');
        tdPhotos.textContent = purchase.photos.join(', ');
        tr.appendChild(tdPhotos);

        purchaseRecordsBody.appendChild(tr);
    });
}

// Inicializar app
function init() {
    renderAlbums();
    renderCart();
}

init();
