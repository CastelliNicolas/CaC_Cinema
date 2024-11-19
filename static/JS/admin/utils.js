import { recibirData } from "./api.js";
//Popular select
export function fillSelect(endpoint, elementId, key){
    recibirData(endpoint, "GET", "Error al llenar Select - " + endpoint, "Exito al llenar Select - " + endpoint)
    .then((data) => {
        let select = document.getElementById(elementId);
        for(let i of data){
            let option = document.createElement("option");
            option.value = i.codigo;
            option.text = i[key];
            select.appendChild(option);
        }
    })
}