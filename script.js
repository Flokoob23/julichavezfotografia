const urlJson = 'https://script.google.com/macros/s/AKfycbxI-Ouh6zDkoVtCBMUAECthVMhqS2Ona0mhNNWwzSl6KQW_EMxmkkOekiMocRB5m6U4/exec';
const precio = 1500;

let eventos = {};
let seleccionadas = [];

window.onload = () => {
  cargarDatos();

  document.getElementById('finalizar-compra').onclick = mostrarResumen;
  document.getElementById('confirmar-compra').onclick = enviarWhatsApp;
  document.getElementById('cerrar-compra').onclick = () => {
    document.getElementById('modal-compra').classList.add('oculto');
  };
};

function cargarDatos() {
  fetch(urlJson)
    .then(res => res.json())
    .then(data => {
      eventos = data;
      mostrarEventos();
    })
    .catch(() => alert('Error al cargar los álbumes'));
}

function mostrarEventos() {
  const contenedor = document.getElementById('botones-eventos');
  contenedor.innerHTML = '';
  Object.keys(eventos).forEach(evento => {
    const btn = document.createElement('button');
    btn.textContent = evento;
    btn.onclick = () => mostrarFotos(evento);
    contenedor.appendChild(btn);
  });
}

function mostrarFotos(evento) {
  seleccionadas = [];
  actualizarResumen();

  const contenedor = document.getElementById('contenedor-fotos');
  contenedor.innerHTML = '';

  eventos[evento].forEach(foto => {
    const div = document.createElement('div');
    div.classList.add('foto');
    div.onclick = () => toggleSeleccion(foto, div);

    const img = document.createElement('img');
    img.src = foto.url;
    img.alt = foto.name;

    div.appendChild(img);
    contenedor.appendChild(div);
  });

  document.getElementById('fotos').classList.remove('oculto');
  document.getElementById('carrito').classList.remove('oculto');
  document.getElementById('eventos').classList.add('oculto');
}

function toggleSeleccion(foto, div) {
  const index = seleccionadas.findIndex(f => f.name === foto.name);
  if(index >= 0){
    seleccionadas.splice(index,1);
    div.classList.remove('seleccionada');
  } else {
    seleccionadas.push(foto);
    div.classList.add('seleccionada');
  }
  actualizarResumen();
}

function actualizarResumen(){
  const resumen = document.getElementById('resumen-carrito');
  resumen.textContent = `🛒 ${seleccionadas.length} fotos seleccionadas – $${seleccionadas.length * precio}`;
}

function mostrarResumen(){
  if(seleccionadas.length === 0){
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

function enviarWhatsApp(){
  const total = seleccionadas.length * precio;
  const nombresFotos = seleccionadas.map(f => f.name).join('\n');
  const mensaje = `Hola! Quiero encargar estas fotos:\n\n${nombresFotos}\n\nTotal: $${total}`;
  const url = `https://wa.me/543584328924?text=${encodeURIComponent(mensaje)}`;
  window.open(url,'_blank');
}


