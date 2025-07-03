// Versión corregida del simulador
const NOMBRE_SIMULADOR = "Simulador de Diagnóstico de Motos DOM v2.0";
const MAX_INTENTOS_DIAGNOSTICO = 3;
const PRECIO_BASE_REVISION = 50000;

let contadorDiagnosticos = 0;
let historialDiagnosticos = JSON.parse(localStorage.getItem("historialDiagnosticos")) || [];

const tiposDeMotos = ["Deportiva", "Cruiser", "Naked", "Enduro", "Scooter", "Touring"];

const problemasComunes = [
    {
        id: 1,
        problema: "Motor no enciende",
        causas: ["Batería descargada", "Bujía defectuosa", "Falta de combustible"],
        solucion: "Revisar batería, cambiar bujía y verificar combustible",
        costo: 25000
    },
    {
        id: 2,
        problema: "Motor se apaga constantemente",
        causas: ["Filtro de aire sucio", "Carburador desajustado", "Problema en el sistema eléctrico"],
        solucion: "Limpiar filtro de aire y ajustar carburador",
        costo: 35000
    },
    {
        id: 3,
        problema: "Ruidos extraños en el motor",
        causas: ["Aceite insuficiente", "Cadena desajustada", "Válvulas desajustadas"],
        solucion: "Cambiar aceite y ajustar cadena de distribución",
        costo: 45000
    },
    {
        id: 4,
        problema: "Frenos deficientes",
        causas: ["Pastillas gastadas", "Líquido de frenos bajo", "Discos desgastados"],
        solucion: "Cambiar pastillas y verificar sistema de frenos",
        costo: 60000
    },
    {
        id: 5,
        problema: "Problemas eléctricos",
        causas: ["Alternador defectuoso", "Cables sueltos", "Regulador de voltaje dañado"],
        solucion: "Revisar sistema eléctrico completo",
        costo: 40000
    },
    {
        id: 6,
        problema: "Problemas de transmisión",
        causas: ["Aceite de transmisión bajo", "Cadena o correa desgastada", "Embrague defectuoso"],
        solucion: "Revisar y cambiar aceite de transmisión, ajustar cadena o correa",
        costo: 55000
    },
    {
        id: 7,
        problema: "Sobrecalentamiento del motor",
        causas: ["Fugas en el sistema de refrigeración", "Termostato defectuoso", "Radiador obstruido"],
        solucion: "Revisar sistema de refrigeración y cambiar termostato si es necesario",
        costo: 70000
    },
    {
        id: 8,
        problema: "Problemas de suspensión",
        causas: ["Amortiguadores desgastados", "Horquilla dañada", "Alineación incorrecta"],
        solucion: "Revisar y cambiar amortiguadores, ajustar alineación",
        costo: 80000
    }
];

const preguntasDiagnostico = [
    "¿La moto enciende normalmente?",
    "¿Escucha ruidos extraños?",
    "¿Los frenos funcionan correctamente?",
    "¿Las luces funcionan bien?",
    "¿El motor se mantiene estable en ralentí?",
    "¿Nota dificultad al cambiar de marcha?",
    "¿El motor alcanza temperaturas muy altas?",
    "¿Siente que la moto rebota demasiado en los baches?"
];

function crearFormularioDiagnostico() {
    const card = document.querySelector(".card-body");
    card.innerHTML = `<h2 class="mb-4">Formulario de Diagnóstico</h2>
        <form id="formDiagnostico" class="text-start">
            <div class="mb-3">
                <label for="nombre" class="form-label">Nombre del Usuario</label>
                <input type="text" class="form-control" id="nombre" required>
            </div>
            <div class="mb-3">
                <label for="tipoMoto" class="form-label">Tipo de Moto</label>
                <select class="form-select" id="tipoMoto">
                    ${tiposDeMotos.map(tipo => `<option value="${tipo}">${tipo}</option>`).join('')}
                </select>
            </div>
            ${preguntasDiagnostico.map((pregunta, i) => `
                <div class="mb-3">
                    <label class="form-label">${pregunta}</label><br>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="pregunta${i}" value="si" required>
                        <label class="form-check-label">Sí</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="pregunta${i}" value="no">
                        <label class="form-check-label">No</label>
                    </div>
                </div>
            `).join('')}
            <button type="submit" class="btn btn-primary">Procesar Diagnóstico</button>
        </form>`;

    document.getElementById("formDiagnostico").addEventListener("submit", manejarFormulario);
}

function manejarFormulario(e) {
    e.preventDefault();
    const nombre = document.getElementById("nombre").value.trim();
    const tipoMoto = document.getElementById("tipoMoto").value;
    const respuestas = preguntasDiagnostico.map((_, i) => document.querySelector(`input[name='pregunta${i}']:checked`).value);

    const datosUsuario = { nombre, tipoMoto };
    const diagnostico = procesarDiagnostico(datosUsuario, respuestas);
    historialDiagnosticos.push(diagnostico);
    localStorage.setItem("historialDiagnosticos", JSON.stringify(historialDiagnosticos));

    mostrarResultadosDiagnostico(diagnostico);
}

function procesarDiagnostico(datosUsuario, respuestas) {
    let puntuacion = new Array(problemasComunes.length).fill(0);

    if (respuestas[0] === "no") { puntuacion[0] += 3; puntuacion[4] += 2; }
    if (respuestas[1] === "si") { puntuacion[2] += 3; puntuacion[1] += 1; }
    if (respuestas[2] === "no") { puntuacion[3] += 3; }
    if (respuestas[3] === "no") { puntuacion[4] += 3; }
    if (respuestas[4] === "no") { puntuacion[1] += 3; puntuacion[0] += 1; }
    if (respuestas[5] === "si") { puntuacion[5] += 3; }
    if (respuestas[6] === "si") { puntuacion[6] += 3; }
    if (respuestas[7] === "si") { puntuacion[7] += 3; }

    let indice = puntuacion.indexOf(Math.max(...puntuacion));
    let problema = problemasComunes[indice];

    return {
        usuario: datosUsuario.nombre,
        tipoMoto: datosUsuario.tipoMoto,
        respuestas,
        problema,
        fecha: new Date().toLocaleDateString(),
        numero: ++contadorDiagnosticos
    };
}

function mostrarResultadosDiagnostico(d) {
    const card = document.querySelector(".card-body");
    card.innerHTML = `
        <h2>Diagnóstico Completado</h2>
        <p><strong>Usuario:</strong> ${d.usuario}</p>
        <p><strong>Tipo de Moto:</strong> ${d.tipoMoto}</p>
        <p><strong>Fecha:</strong> ${d.fecha}</p>
        <p><strong>Problema Detectado:</strong> ${d.problema.problema}</p>
        <ul>${d.problema.causas.map(c => `<li>${c}</li>`).join('')}</ul>
        <p><strong>Solución Recomendada:</strong> ${d.problema.solucion}</p>
        <p><strong>Costo Estimado:</strong> $${d.problema.costo.toLocaleString()} ARS</p>
        <button id="reiniciar" class="btn btn-secondary mt-3">Nuevo Diagnóstico</button>
        <button id="verHistorial" class="btn btn-outline-primary mt-3 ms-2">Ver Historial</button>
    `;

    document.getElementById("reiniciar").addEventListener("click", crearFormularioDiagnostico);
    document.getElementById("verHistorial").addEventListener("click", mostrarHistorial);
}

function mostrarHistorial() {
    const card = document.querySelector(".card-body");
    if (historialDiagnosticos.length === 0) {
        card.innerHTML = `<p>No hay diagnósticos en el historial.</p><button class="btn btn-primary" onclick="crearFormularioDiagnostico()">Volver</button>`;
        return;
    }

    card.innerHTML = `<h2>Historial de Diagnósticos</h2>
        ${historialDiagnosticos.map(d => `
            <div class="border rounded p-3 mb-3">
                <p><strong>${d.fecha}</strong> - ${d.usuario} (${d.tipoMoto})</p>
                <p>Problema: ${d.problema.problema}</p>
            </div>
        `).join('')}
        <button class="btn btn-primary mt-3" onclick="crearFormularioDiagnostico()">Volver</button>`;
}

document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("iniciarDiagnostico");
    btn.addEventListener("click", crearFormularioDiagnostico);
});
