document.addEventListener('DOMContentLoaded', () => {
  const wsNum = '543584328924'; // +54 358 4328924
  const price = 1500;
  const albums = [
    { name:'🌿 Paisajes Naturales', imgs:['https://i.imgur.com/2jMCqQ2.jpg','https://i.imgur.com/QFDRuAh.jpg','https://i.imgur.com/8yIIokW.jpg'] },
    { name:'🌇 Atardeceres', imgs:['https://i.imgur.com/pwpWaWu.jpg','https://i.imgur.com/KIPtISY.jpg','https://i.imgur.com/2jMCqQ2.jpg'] },
    { name:'⛰️ Montañas y Lagos', imgs:['https://images.pexels.com/photos/3348748/pexels-photo-3348748.jpeg','https://images.pexels.com/photos/3812944/pexels-photo-3812944.jpeg','https://images.pexels.com/photos/2100063/pexels-photo-2100063.jpeg'] },
    { name:'🏙️ Cámaras Urbanas', imgs:['https://images.pexels.com/photos/4725133/pexels-photo-4725133.jpeg','https://images.pexels.com/photos/1385472/pexels-photo-1385472.jpeg','https://images.pexels.com/photos/3228213/pexels-photo-3228213.jpeg'] },
  ];

  const el = id => document.getElementById(id);
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  const init = () => {
    renderAlbums(albums);
    updateCartIndicator();
    el('toggle-theme').onclick = toggleTheme;
    el('cart-btn').onclick = () => showModal('cart-modal');
    el('clear-btn').onclick = clearCart;
    el('checkout-btn').onclick = checkout;
    el('search-album').oninput = () => renderAlbums(albums.filter(a=>a.name.toLowerCase().includes(el('search-album').value.toLowerCase())));
  };

  const renderAlbums = list => {
    const c = el('albums-container'); c.innerHTML = '';
    list.forEach(a=> {
      const div = document.createElement('div');
      div.className='album-card';
      div.innerHTML = `<img src="${a.imgs[0]}" alt="${a.name}"><span>${a.name}</span>`;
      div.onclick = () => openAlbum(a);
      c.append(div);
    });
  };

  const openAlbum = album => {
    el('photo-grid').innerHTML = '';
    albums.forEach(() => {}); // noop
    album.imgs.forEach((src,i)=>{
      const img = document.createElement('img');
      img.src = src;
      img.alt = `${album.name} #${i+1}`;
      img.onclick = ()=>openPhoto(src,album.imgs);
      el('photo-grid').classList.remove('hidden');
      el('photo-grid').append(img);
    });
  };

  let curImgs, curIndex;
  const openPhoto = (src, imgs) => {
    curImgs = imgs; curIndex = imgs.indexOf(src);
    el('modal-img').src = src;
    showModal('photo-modal');
  };

  el('next').onclick = () => changePhoto(1);
  el('prev').onclick = () => changePhoto(-1);
  el('add-cart').onclick = () => {
    const url = el('modal-img').src;
    if(!cart.includes(url)){
      cart.push(url); localStorage.setItem('cart', JSON.stringify(cart));
      updateCartIndicator();
      alert('Foto agregada al carrito');
    }
  };

  const changePhoto = dir => {
    curIndex = (curIndex + dir + curImgs.length)%curImgs.length;
    el('modal-img').src = curImgs[curIndex];
  };

  const updateCartIndicator = () => el('cart-indicator').textContent = `🛒 ${cart.length}`;

  const showModal = id => el(id).classList.remove('hidden');
  document.querySelectorAll('.modal-close').forEach(b=>b.onclick = ()=>closeModals());
  const closeModals = () => document.querySelectorAll('.modal').forEach(m=>m.classList.add('hidden'));

  const clearCart = () => {
    if(confirm('¿Vaciar carrito?')) {
      cart=[]; localStorage.removeItem('cart');
      updateCartIndicator();
      el('cart-items').innerHTML='';
    }
  };

  const checkout = () => {
    if(cart.length===0) return alert('Carrito vacío');
    const name = el('input-name').value.trim();
    if(!name) return alert('Por favor ingresa tu nombre');
    const email = el('input-email').value.trim();
    el('cart-items').innerHTML = '';
    cart.forEach((u,i)=>{
      const div = document.createElement('div'); div.className='cart-item';
      div.innerHTML = `<img src="${u}" alt="Foto ${i+1}"><span>${i+1}</span>`;
      el('cart-items').append(div);
    });
    const total = cart.length*price;
    el('total-items').textContent = `${cart.length} fotos`;
    el('total-price').textContent = `$${total}`;

    const list = cart.map((u,i)=>`${i+1}. ${u}`).join('\n');
    const msg = `Hola, soy ${name}.\nQuiero comprar estas fotos:\n${list}\nTotal: $${total}${email?'\nCorreo: '+email:''}`;
    const waUrl = `https://wa.me/${wsNum}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
  };

  const toggleTheme = () => document.body.classList.toggle('dark');

  init();
});
