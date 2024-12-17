import { recibirData } from "/static/JS/shared_modules/apiFeedbackHandler.js";
//Popular select
export function fillSelect(endpoint, elementId, key) {
  recibirData(
    endpoint,
    "GET",
    `Error al cargar SELECT - ${endpoint}(s)`,
    `${endpoint}(s) cargadas en SELECT`
  ).then((data) => {
    let select = document.getElementById(elementId);
    for (let i of data) {
      let option = document.createElement("option");
      option.value = i.codigo;
      option.text = i[key];
      select.appendChild(option);
    }
  });
}

export function fillSelectArray(array, domElementID, selectValue) {
  let select = document.getElementById(domElementID);
  //console.log(array)
  for (let i of array) {
    let objetId = Object.values(i)[1];
    //console.log(objetId)
    let option = document.createElement("option");
    option.value = objetId;
    option.text = i[selectValue];
    select.appendChild(option);
  }
}

export function fillArray(endpoint) {
  let elementosDisponibles = [];
  return recibirData(
    endpoint,
    "GET",
    "Error al obtener " + endpoint + "(s)",
    "Correctamente obtenido " + endpoint + "(s)"
  )
    .then((data) => {
      for (let elemento of data) {
        elementosDisponibles.push(elemento);
      }
      console.log("Enviando: ", elementosDisponibles);
      return elementosDisponibles;
    })
    .catch((error) => {
      console.error("Error al cargar los " + endpoint + "s :", error);
      return elementosDisponibles;
    });
}

export function findElement(elementosDisponibles, elementoId) {
  console.log(`Elemento con el id: ${elementoId}`);
  for (let elemento of elementosDisponibles) {
    console.log("Buscando...", elemento.codigo);
    if (elemento.codigo == elementoId) {
      console.log("Encontrado.");
      return elemento;
    }
  }
}

export function fillSalasSelect(salas, isSelectMessage = 0) {
  let selectSala = document.getElementById("sala");
  selectSala.options.length = isSelectMessage;
  for (let sala = 1; sala <= salas; sala++) {
    console.log("sala n° ", sala);
    let option = document.createElement("option");
    option.value = sala;
    option.text = sala;
    selectSala.appendChild(option);
  }
}
