const urlJson = 'https://script.google.com/macros/s/AKfycbxI-Ouh6zDkoVtCBMUAECthVMhqS2Ona0mhNNWwzSl6KQW_EMxmkkOekiMocRB5m6U4/exec';
const precio = 1500;

let eventos = {};
let seleccionadas = [];
let eventoActual = "";
let fotoActualIndex = 0;

window.onload = () => {
  const titulo = document.getElementById('titulo-principal');

  // Al iniciar, el título está centrado y visible
  // Después de 2.5s, mover el título arriba y achicarlo con animación
  setTimeout(() => {
    titulo.classList.add('mover-arriba');
  }, 100);

  // Después de la animación (2s), ocultar título y mostrar eventos
  setTimeout(() => {
    titulo.style.display = 'none'; // ocultar título al final
    document.getElementById('selector-eventos').classList.remove('oculto');
    cargarDatos();
  }, 2100);

  document.getElementById('finalizar-compra').onclick = mostrarResumen;
  document.getElementById('confirmar-compra').onclick = enviarWhatsApp;
  document.getElementById('cerrar-compra').onclick = () => {
    document.getElementById('modal-compra').classList.add('oculto');
  };

  // Modal visor botones
  document.getElementById('cerrar-visor').onclick = cerrarVisor;
  document.getElementById('prev-foto').onclick = () => cambiarFoto(-1);
  document.getElementById('next-foto').onclick = () => cambiarFoto(1);
  document.getElementById('toggle-carrito').onclick = toggleFotoEnVisor;
};

function cargarDatos() {
  fetch(urlJson)
    .then(res => res.json())
    .then(data => {
      eventos = data;
      cargarEventos();
    })
    .catch(() => alert("Error cargando datos de álbumes"));
}

function cargarEventos() {
  const contenedor = document.getElementById('botones-eventos');
  contenedor.innerHTML = '';
  Object.keys(eventos).forEach(nombre => {
    const btn = document.createElement('button');
    btn.textContent = nombre;
    btn.onclick = () => mostrarFotos(nombre);
    contenedor.appendChild(btn);
  });
}

function mostrarFotos(evento) {
  eventoActual = evento;
  seleccionadas = [];
  actualizarResumen();

  document.getElementById('galeria').classList.remove('oculto');
  const contenedor = document.getElementById('contenedor-fotos');
  contenedor.innerHTML = '';

  eventos[evento].forEach((foto, index) => {
    const url = foto.url;
    const div = document.createElement('div');
    div.classList.add('foto');
    div.onclick = () => abrirVisor(index);

    const img = document.createElement('img');
    img.src = url;
    img.alt = foto.name;

    div.appendChild(img);
    contenedor.appendChild(div);
  });

  // Scroll arriba para que se vea la galería al abrir
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function abrirVisor(index) {
  fotoActualIndex = index;
  actualizarVisor();
  document.getElementById('modal-visor').classList.remove('oculto');
}

function actualizarVisor() {
  const foto = eventos[eventoActual][fotoActualIndex];
  const url = foto.url;
  const nombre = foto.name;
  const imgVisor = document.getElementById('img-visor');
  imgVisor.src = url;
  imgVisor.alt = nombre;

  const btnToggle = document.getElementById('toggle-carrito');
  if (seleccionadas.some(f => f.name === nombre)) {
    btnToggle.textContent = 'Quitar del carrito';
    btnToggle.style.backgroundColor = '#e91e63';
  } else {
    btnToggle.textContent = 'Agregar al carrito';
    btnToggle.style.backgroundColor = '#ff69b4';
  }
}

function cerrarVisor() {
  document.getElementById('modal-visor').classList.add('oculto');
}

function cambiarFoto(delta) {
  const total = eventos[eventoActual].length;
  fotoActualIndex = (fotoActualIndex + delta + total) % total;
  actualizarVisor();
}

function toggleFotoEnVisor() {
  const foto = eventos[eventoActual][fotoActualIndex];
  const indexEnCarrito = seleccionadas.findIndex(f => f.name === foto.name);
  if (indexEnCarrito >= 0) {
    seleccionadas.splice(indexEnCarrito, 1);
  } else {
    seleccionadas.push(foto);
  }
  actualizarResumen();
  actualizarVisor();
}

function actualizarResumen() {
  const resumen = document.getElementById('resumen-carrito');
  resumen.textContent = `🛒 ${seleccionadas.length} fotos seleccionadas – $${seleccionadas.length * precio}`;
}

function mostrarResumen() {
  if (seleccionadas.length === 0) {
    alert("Selecciona al menos una foto");
    return;
  }
  const lista = document.getElementById('lista-fotos');
  lista.innerHTML = '';
  seleccionadas.forEach(foto => {
    const li = document.createElement('li');
    li.textContent = foto.name;
    lista.appendChild(li);
  });
  document.getElementById('total').textContent = seleccionadas.length * precio;
  document.getElementById('modal-compra').classList.remove('oculto');
}

function enviarWhatsApp() {
  const total = seleccionadas.length * precio;
  const nombresFotos = seleccionadas.map(f => f.name).join('\n');
  const mensaje = `Hola! Quiero encargar estas fotos del evento *${eventoActual}*:\n\n${nombresFotos}\n\nTotal: $${total}`;
  const url = `https://wa.me/543584328924?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank');
}


