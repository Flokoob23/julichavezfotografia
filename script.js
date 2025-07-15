const cloudName = 'dulazvlh6';
const tag = 'fotos_prueba';
const precioUnitario = 1500;

const eventos = {
  "FOTOS PRUEBA": []
};

let seleccionadas = [];
let eventoActual = "";

async function fetchFotos(tag) {
  const url = `https://res.cloudinary.com/${cloudName}/image/list/${tag}.json`;
  const res = await fetch(url);
  const data = await res.json();
  return data.resources.map(r => r.public_id.split('/').pop());
}

document.addEventListener("DOMContentLoaded", async () => {
  eventos["FOTOS PRUEBA"] = await fetchFotos(tag);

  setTimeout(() => {
    const titulo = document.getElementById('titulo');
    titulo.classList.remove("titulo-centrado");
    titulo.classList.add("titulo-arriba");
    document.getElementById('eventos').classList.remove("oculto");
  }, 2000);

  mostrarEventos();
});

function mostrarEventos() {
  const contenedor = document.getElementById('listaEventos');
  for (const nombre in eventos) {
    const btn = document.createElement('button');
    btn.innerText = nombre;
    btn.onclick = () => cargarGaleria(nombre);
    contenedor.appendChild(btn);
  }
}

function cargarGaleria(nombreEvento) {
  eventoActual = nombreEvento;
  seleccionadas = [];

  document.getElementById('eventos').classList.add("oculto");
  document.getElementById('galeriaFotos').classList.remove("oculto");
  document.getElementById('tituloEvento').innerText = `Evento: ${nombreEvento}`;

  const galeria = document.getElementById('galeria');
  galeria.innerHTML = "";

  eventos[nombreEvento].forEach(nombre => {
    const url = `https://res.cloudinary.com/${cloudName}/image/upload/FOTOS PRUEBA/${nombre}`;
    const div = document.createElement('div');
    div.classList.add('foto');
    div.onclick = () => toggleSeleccion(div, nombre);

    const img = document.createElement('img');
    img.src = url;
    img.alt = nombre;

    div.appendChild(img);
    galeria.appendChild(div);
  });

  actualizarContador();
}

function toggleSeleccion(div, nombre) {
  const i = seleccionadas.indexOf(nombre);
  if (i === -1) {
    seleccionadas.push(nombre);
    div.classList.add('seleccionada');
  } else {
    seleccionadas.splice(i, 1);
    div.classList.remove('seleccionada');
  }

  actualizarContador();
}

function actualizarContador() {
  const total = seleccionadas.length * precioUnitario;
  document.getElementById('contador').innerText = `🛒 ${seleccionadas.length} fotos seleccionadas – $${total}`;
}

function mostrarResumen() {
  const lista = document.getElementById('listaResumen');
  lista.innerHTML = "";
  seleccionadas.forEach(nombre => {
    const li = document.createElement('li');
    li.innerText = nombre;
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

