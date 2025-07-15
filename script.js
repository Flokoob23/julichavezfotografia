const cloudName = 'dulazvlh6';
const carpeta = 'FOTOS%20PRUEBA';
const precioUnitario = 1500;

const eventos = {
  "FOTOS PRUEBA": [
    "img001.jpg",
    "img002.jpg",
    "img003.jpg"
    // Agregá más si es necesario
  ]
};

let seleccionadas = [];
let eventoActual = "";

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById('modal').classList.add("oculto");

  const titulo = document.getElementById('titulo-principal');

  setTimeout(() => {
    titulo.classList.add('titulo-arriba');
  }, 2000);

  setTimeout(() => {
    document.getElementById('eventos').classList.remove('oculto');
    document.getElementById('eventos').classList.add('visible');
  }, 3700);

  mostrarEventos();

  document.getElementById('btnFinalizar').addEventListener('click', mostrarResumen);
  document.getElementById('btnConfirmar').addEventListener('click', confirmarCompra);
});

function mostrarEventos() {
  const contenedor = document.getElementById('listaEventos');
  contenedor.innerHTML = "";

  for (const nombre in eventos) {
    const btn = document.createElement('button');
    btn.innerText = nombre;
    btn.addEventListener('click', () => cargarGaleria(nombre));
    contenedor.appendChild(btn);
  }
}

function cargarGaleria(nombreEvento) {
  eventoActual = nombreEvento;
  seleccionadas = [];

  document.getElementById('eventos').classList.add('oculto');
  document.getElementById('galeriaFotos').classList.remove('oculto');
  document.getElementById('tituloEvento').innerText = `Evento: ${nombreEvento}`;

  const galeria = document.getElementById('galeria');
  galeria.innerHTML = "";

  eventos[nombreEvento].forEach(nombre => {
    const url = `https://res.cloudinary.com/${cloudName}/image/upload/${carpeta}/${nombre}`;

    const div = document.createElement('div');
    div.classList.add('foto');
    div.addEventListener('click', () => toggleSeleccion(div, nombre));

    const img = document.createElement('img');
    img.src = url;
    img.alt = nombre;

    const nombreDiv = document.createElement('div');
    nombreDiv.className = 'nombre-foto';
    nombreDiv.innerText = nombre;

    div.appendChild(img);
    div.appendChild(nombreDiv);
    galeria.appendChild(div);
  });

  actualizarContador();
}

function toggleSeleccion(div, nombre) {
  const index = seleccionadas.indexOf(nombre);
  if (index === -1) {
    seleccionadas.push(nombre);
    div.classList.add('seleccionada');
  } else {
    seleccionadas.splice(index, 1);
    div.classList.remove('seleccionada');
  }
  actualizarContador();
}

function actualizarContador() {
  const total = seleccionadas.length * precioUnitario;
  document.getElementById('contador').innerText = `🛒 ${seleccionadas.length} fotos seleccionadas – $${total}`;
}

function mostrarResumen() {
  if (seleccionadas.length === 0) {
    alert("Debes seleccionar al menos una foto para finalizar la compra.");
    return;
  }

  const lista = document.getElementById('listaResumen');
  lista.innerHTML = "";

  seleccionadas.forEach(nombre => {
    const li = document.createElement('li');
    li.textContent = nombre;
    lista.appendChild(li);
  });

  document.getElementById('total').innerText = seleccionadas.length * precioUnitario;
  document.getElementById('modal').classList.remove('oculto');
}

function confirmarCompra() {
  const total = seleccionadas.length * precioUnitario;
  const mensaje = `Hola! Quiero encargar estas fotos del evento *${eventoActual}*:\n\n${seleccionadas.join("\n")}\n\nTotal a abonar: $${total}`;
  const url = `https://wa.me/543584328924?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank');
}
