// CLAES / SCRUM MASTER'S KODE. NIKS PILLE UDEN TILLADELSE:::


// Her laver vi en reciever / Modtager som basically bare er en ting i vores app her
// der har nogle data.
// Det er data såsom id, type, navn, kategori osv.



// Laver klassen kaldet Receiver, der er en slags skabelon for at lave modtagere i vores app.
class Receiver {   

    // LAver en constructor, som bliver kaldt når deres laves en ny modtager.
    //Den kan se således ud: "const r = new Receiver(1, "Indtægt", "Løn", "job");"

    constructor(id, type, name, category) {

        this.id = id;               //for eksempel: 1
        this.type = type;           //for eksempel: "Indtægt" eller "Udgift"
        this.name = name;           //for eksempel: "Løn" eller "Mad"
        this.category = category;   //for eksempel: "job" eller "fødevarer"
        
    }


}

// vi eksporterer klassen, så vi kan bruge den i andre filer i vores app.
// Det gør det muligt at skrive "import Receiver from './Model/Receiver.js'" i andre filer.
export default Receiver;



// Eksempel på brug af dette:
// Der bliver skrevet i en anden fil:
// const r = new Receiver(1, "Udgift", "Rema1000", "Mad");
// 
// så bliver et objekt lavet med de data der, som ser således ud:
// { 
//  id: 1, 
//  type: "Udgift", 
//  name: "Rema1000", 
//  category: "Mad" 
// }