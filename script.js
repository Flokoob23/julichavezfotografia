const cloudName = 'tu_cloud_name'; // ⚠️ Reemplazá con tu Cloud Name de Cloudinary
const eventos = {
  "boda-luisa": ["foto1.jpg", "foto2.jpg", "foto3.jpg"],
  "cumple-pedro": ["img1.jpg", "img2.jpg"]
};

let seleccionadas = [];
let eventoActual = "";

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    document.getElementById('inicio').classList.add("oculto");
    document.getElementById('eventos').classList.remove("oculto");
    mostrarEventos();
  }, 2000);
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
    const url = `https://res.cloudinary.com/${cloudName}/image/upload/${nombreEvento}/${nombre}`;
    const div = document.createElement('div');
    div.classList.add('foto');
    div.onclick = () => toggleSeleccion(div, nombre);

    const img = document.createElement('img');
    img.src = url;
    img.alt = nombre;

    div.appendChild(img);
    galeria.appendChild(div);
  });

  document.getElementById('resumen').classList.add('oculto');
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

  document.getElementById('resumen').classList.toggle('oculto', seleccionadas.length === 0);
}

function enviarPedido() {
  const mensaje = `Hola! Quiero encargar estas fotos del evento *${eventoActual}*:\n\n${seleccionadas.join("\n")}`;
  const url = `https://wa.me/543584328924?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank');
}
