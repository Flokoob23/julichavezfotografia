const cloudName = 'dulazvlh6';
const carpeta = 'FOTOS%20PRUEBA';
const precio = 1500;

const eventos = {
  "FOTOS PRUEBA": ["img001.jpg", "img002.jpg", "img003.jpg"]
};

let seleccionadas = [];
let eventoActual = "";

window.onload = () => {
  const titulo = document.getElementById('titulo-principal');
  setTimeout(() => {
    titulo.classList.add('mover-arriba');
    document.getElementById('selector-eventos').classList.remove('oculto');
    cargarEventos();
  }, 2500);

  document.getElementById('finalizar-compra').onclick = mostrarResumen;
  document.getElementById('confirmar-compra').onclick = enviarWhatsApp;
};

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

  eventos[evento].forEach(nombre => {
    const url = `https://res.cloudinary.com/${cloudName}/image/upload/${carpeta}/${nombre}`;
    const div = document.createElement('div');
    div.classList.add('foto');
    div.onclick = () => toggleFoto(nombre, div);

    const img = document.createElement('img');
    img.src = url;
    img.alt = '';

    div.appendChild(img);
    contenedor.appendChild(div);
  });
}

function toggleFoto(nombre, div) {
  if (seleccionadas.includes(nombre)) {
    seleccionadas = seleccionadas.filter(f => f !== nombre);
    div.classList.remove('seleccionada');
  } else {
    seleccionadas.push(nombre);
    div.classList.add('seleccionada');
  }
  actualizarResumen();
}

function actualizarResumen() {
  const resumen = document.getElementById('resumen-carrito');
  resumen.textContent = `🛒 ${seleccionadas.length} fotos seleccionadas – $${seleccionadas.length * precio}`;
}

function mostrarResumen() {
  if (seleccionadas.length === 0) return alert("Selecciona al menos una foto");
  const lista = document.getElementById('lista-fotos');
  lista.innerHTML = '';
  seleccionadas.forEach(nombre => {
    const li = document.createElement('li');
    li.textContent = nombre;
    lista.appendChild(li);
  });
  document.getElementById('total').textContent = seleccionadas.length * precio;
  document.getElementById('modal').classList.remove('oculto');
}

function enviarWhatsApp() {
  const total = seleccionadas.length * precio;
  const mensaje = `Hola! Quiero encargar estas fotos del evento *${eventoActual}*:\n\n${seleccionadas.join('\n')}\n\nTotal: $${total}`;
  const url = `https://wa.me/543584328924?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank');
}
