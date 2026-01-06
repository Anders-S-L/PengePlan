// testReceiver.js

import Receiver from "./Model/Receiver.js";

// Vi laver en ny Receiver med test-data
const r = new Receiver(1, "indtægt", "Løn", "Job");

// Vi skriver den ud i konsollen, så vi kan se den
console.log(r);
