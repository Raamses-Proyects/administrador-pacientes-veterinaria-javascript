// Variables
const formulario = document.querySelector('#formulario');
const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');
const buscador = document.querySelector('#buscador');
const datosCitasObj = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: ''
}
let citasArray = [];
let actualizar = false;



// Eventos
addEventListeners();
function addEventListeners() {
    
    // Sincronizando el array con localStorage
    document.addEventListener('DOMContentLoaded', () => {
        citasArray = JSON.parse(localStorage.getItem('pacientes')) || [];
        agregarCitasHTML(citasArray);
        buscador.addEventListener('input', buscadorPacientes);
        cambiarTitulo();
    });

    // Agregar paciente
    formulario.addEventListener('submit', validarCampos);

    // LLenando Objeto
    mascotaInput.addEventListener('change', llenarObjeto);
    propietarioInput.addEventListener('change', llenarObjeto);
    telefonoInput.addEventListener('change', llenarObjeto);
    fechaInput.addEventListener('change', llenarObjeto);
    horaInput.addEventListener('change', llenarObjeto);
    sintomasInput.addEventListener('change', llenarObjeto);
}


// Funciones
function llenarObjeto(e) {
    // Como se va a buscar por nombre se agrega en minusculas para facilitar la busqueda
    if(e.target.name === 'mascota') {
        datosCitasObj[e.target.name] = (e.target.value).toLowerCase();
    }
    else {
        datosCitasObj[e.target.name] = e.target.value;
    }
}
function validarCampos(e) {
    e.preventDefault();

    // Validando
    const { mascota, propietario, telefono, fecha, hora, sintomas } = datosCitasObj;
    if( [mascota, propietario, telefono, fecha, hora, sintomas].includes('') ) {
        alerta('Todos los campos son obligatorios', 'error');
        return;
    }
    
    // Insertando
    if(!actualizar) {
        datosCitasObj.id = Date.now();
        citasArray = [ ...citasArray, {...datosCitasObj} ];
        alerta('Cita agregada correctamente', 'correcto');
        cambiarTitulo();
    }
    else { // Actualizando 
        actualizarCita({...datosCitasObj});
        document.querySelector('.formulario__button').textContent = 'Crear Cita';
        actualizar = false;
        alerta('Actualizada correctamente', 'correcto');
    }

    // Agregando citas al HTML
    agregarCitasHTML(citasArray);

    // Reseteando formulario y objeto
    formulario.reset();
    resetearObjeto();
}
function agregarCitasHTML(array) {
    limpiarHTML();

    // Contenedor Principal
    const contenedor = document.querySelector('.contenedor-scroll');

    // Creado citas
    array.forEach((cita) => {
        const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

        // Contenedores Citas
        const citaContenedor = document.createElement('div');
        citaContenedor.classList.add('cita');
        citaContenedor.dataset.id = id;
        const datosCita = document.createElement('div');
        datosCita.classList.add('cita__contenido');

        // Nombre
        const parrafoNombre = document.createElement('p');
        parrafoNombre.classList.add('cita__nombre');
        parrafoNombre.textContent = mascota;
        
        // Propietario
        const parrafoPropietario = document.createElement('p');
        parrafoPropietario.classList.add('cita__texto');
        parrafoPropietario.textContent = 'Propietario: ';
        const spanPropietario = document.createElement('span');
        spanPropietario.classList.add('cita__span');
        spanPropietario.textContent = propietario;
        parrafoPropietario.appendChild(spanPropietario);

        // Telefono
        const parrafoTelefono = document.createElement('p');
        parrafoTelefono.classList.add('cita__texto');
        parrafoTelefono.textContent = 'Télefono: ';
        const spanTelefono = document.createElement('span');
        spanTelefono.classList.add('cita__span');
        spanTelefono.textContent = telefono;
        parrafoTelefono.appendChild(spanTelefono);

        // Fecha
        const parrafoFecha = document.createElement('p');
        parrafoFecha.classList.add('cita__texto');
        parrafoFecha.textContent = 'Fecha: ';
        const spanFecha = document.createElement('span');
        spanFecha.classList.add('cita__span');
        spanFecha.textContent = fecha;
        parrafoFecha.appendChild(spanFecha);

        // Hora
        const parrafoHora = document.createElement('p');
        parrafoHora.classList.add('cita__texto');
        parrafoHora.textContent = 'Hora: ';
        const spanHora = document.createElement('span');
        spanHora.classList.add('cita__span');
        spanHora.textContent = hora;
        parrafoHora.appendChild(spanHora);

        // Sintomas
        const parrafoSintomas = document.createElement('p');
        parrafoSintomas.classList.add('cita__texto');
        parrafoSintomas.textContent = 'Síntomas: ';
        const spanSintomas = document.createElement('span');
        spanSintomas.classList.add('cita__span');
        spanSintomas.textContent = sintomas;
        parrafoSintomas.appendChild(spanSintomas);

        // Botones
        const contenedorBotones = document.createElement('div');
        contenedorBotones.classList.add('cita__acciones');
        
        const buttonEliminar = document.createElement('button');
        buttonEliminar.classList.add('cita__button', 'cita__button--eliminar');
        buttonEliminar.type = 'button';
        buttonEliminar.textContent = 'Eliminar';
        buttonEliminar.onclick = () => {
            eliminarCita(id);
        }
        
        const buttonEditar = document.createElement('button');
        buttonEditar.classList.add('cita__button', 'cita__button--editar');
        buttonEditar.type = 'button';
        buttonEditar.textContent = 'Editar';
        buttonEditar.onclick = () => {
            cargarEdicion(cita);
        }
        // Agregando botones al contenedor
        contenedorBotones.appendChild(buttonEliminar);
        contenedorBotones.appendChild(buttonEditar);


        // Agregando a sus contenedores
        datosCita.appendChild(parrafoNombre);
        datosCita.appendChild(parrafoPropietario);
        datosCita.appendChild(parrafoTelefono);
        datosCita.appendChild(parrafoFecha);
        datosCita.appendChild(parrafoHora);
        datosCita.appendChild(parrafoSintomas);
        datosCita.appendChild(contenedorBotones);
        citaContenedor.appendChild(datosCita);


        // Agregando al HTML
        contenedor.appendChild(citaContenedor);
    });

    sincronizarStorage(array);
}
function eliminarCita(id) {
    citasArray = citasArray.filter( (cita) => cita.id !== id );
    agregarCitasHTML(citasArray);
    cambiarTitulo();
}
function cargarEdicion(cita) {
    const { mascota, propietario, telefono, fecha, hora, sintomas, id} = cita;
   
    // Llenando Inputs
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    // Llenando Objeto
    datosCitasObj.mascota = mascota;
    datosCitasObj.propietario = propietario;
    datosCitasObj.telefono = telefono;
    datosCitasObj.fecha = fecha;
    datosCitasObj.hora = hora;
    datosCitasObj.sintomas = sintomas;
    datosCitasObj.id = id;

    // Activando modo edicion
    actualizar = true;
    document.querySelector('.formulario__button').textContent = 'Actualizar Cita';
}
function actualizarCita(datosCitasObj) {
    citasArray = citasArray.map( (cita) => {
        if(cita.id === datosCitasObj.id) {
            return datosCitasObj;
        }
        else {
            return cita;
        }
    });
}


// Helpers
function alerta(mensaje, tipo) {

    const existe = document.querySelectorAll('.alerta');
    if(existe.length === 0) {
        const contenedorAlerta = document.createElement('div');
        contenedorAlerta.classList.add('alerta');
        const texto = document.createElement('p');
        texto.classList.add('alerta__texto');
        texto.textContent = mensaje;
        contenedorAlerta.appendChild(texto);
        if( tipo === 'error' ) {
            contenedorAlerta.classList.add('error');
        }
        else {
            contenedorAlerta.classList.add('correcto')
        }
    
        // Agregando al HTML
        document.querySelector('.formulario__contenido:first-of-type').appendChild(contenedorAlerta);
        
        // Eliminando
        setTimeout(() => {
            contenedorAlerta.remove();
        }, 3000);
    }
}
function resetearObjeto() {
    datosCitasObj.mascota = '';
    datosCitasObj.propietario = '';
    datosCitasObj.telefono = '';
    datosCitasObj.fecha = '';
    datosCitasObj.hora = '';
    datosCitasObj.sintomas = '';
    datosCitasObj.id = '';
}
function limpiarHTML() {
    const contenedor = document.querySelector('.contenedor-scroll');
    while(contenedor.firstChild) {
        contenedor.removeChild(contenedor.firstChild);
    }
}
function buscadorPacientes(e) {
    limpiarHTML();
    let arrayFiltrado = citasArray.filter( (paciente) => paciente.mascota.includes((e.target.value).toLowerCase()) );
    sincronizarStorage(arrayFiltrado);
    agregarCitasHTML(arrayFiltrado);
}
function cambiarTitulo() {
    const tituloDatosUsuario = document.querySelector('.datos__heading');
    const buscador = document.querySelector('.buscador__input');
    if(citasArray.length === 0) {
        tituloDatosUsuario.textContent = 'Agrega pacientes para comenzar'
        buscador.disabled = true;
        buscador.style.cursor = 'not-allowed';
    }
    else {
        tituloDatosUsuario.textContent = 'Administra tus Citas';
        buscador.disabled = false;
        buscador.style.cursor = 'default';
        
    }
}
function sincronizarStorage(array) {
    localStorage.setItem( 'pacientes', JSON.stringify(array) );
}