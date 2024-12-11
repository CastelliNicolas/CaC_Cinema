import { recibirData } from "/static/JS/shared_modules/apiFeedbackHandler.js";
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

export function fillSelectArray(array, domElementID, selectValue){
    let select = document.getElementById(domElementID);
    //console.log(array)


    for(let i of array){
        let objetId = Object.values(i)[1];
        //console.log(objetId)
        let option = document.createElement("option");
        option.value = objetId;
        option.text = i[selectValue];
        select.appendChild(option);
    }
}