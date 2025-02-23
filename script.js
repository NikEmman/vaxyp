import externalData from "./data.js";
import {
  formatTime,
  formatDate,
  formatVehicleInfo,
  formatIdInfo,
} from "./helpers.js";
import {
  printMartyra,
  printSyllipsi,
  printAnomoti,
  printKatigoroumenou,
  printApodosi,
  printKatasxesi,
  printGnostopoiisi,
} from "./ektheseis.js";

const today = new Date();
const months = [
  "Ιανουαρίου",
  "Φεβρουαρίου",
  "Μαρτίου",
  "Απριλίου",
  "Μαΐου",
  "Ιουνίου",
  "Ιουλίου",
  "Αυγούστου",
  "Σεπτεμβρίου",
  "Οκτωβρίου",
  "Νοεμβρίου",
  "Δεκεμβρίου",
];
let id = "";
let vehicle = "";
let stringYear = today.getFullYear();
let stringMonth = String(today.getMonth() + 1).padStart(2, "0");
let stringDay = String(today.getDate()).padStart(2, "0");
let formattedDate = `${stringYear}-${stringMonth}-${stringDay}`;
let specificDate = new Date(formattedDate);
let days = [
  "Κυριακή",
  "Δευτέρα",
  "Τρίτη",
  "Τετάρτη",
  "Πέμπτη",
  "Παρασκευή",
  "Σάββατο",
];
let dayName = days[specificDate.getDay()];
let formattedTime = formatTime(today, 0);
let year = today.getFullYear();
let month = months[today.getMonth()];
let day = today.getDate();

const dayElement = document.querySelector(".day");
const monthElement = document.querySelector(".month");
const yearElement = document.querySelector(".year");
const dayNameElement = document.querySelector(".day-name");
const timeElement = document.querySelector(".time");
const anakritikosElement = document.querySelector(".anakritikos");
const bAnakritikosElement = document.querySelector(".anakritikos-b");
const anakritikosSelect = document.querySelector("#anakritikos");
const bAnakritikosSelect = document.querySelector("#anakritikos-b");

dayElement.innerHTML = day;
monthElement.innerHTML = month;
yearElement.innerHTML = year;
dayNameElement.innerHTML = dayName;
timeElement.innerHTML = formattedTime;

externalData.anakritikoi.forEach((anakritikos, index) => {
  // populate a anakr select
  const anakr = document.createElement("option");
  anakr.value = anakritikos;
  anakr.textContent = anakritikos.split(" ")[1];
  index === 0 && anakr.setAttribute("selected", true);
  anakritikosSelect.appendChild(anakr);

  //populate b anakr select
  const bAnakr = document.createElement("option");
  bAnakr.value = anakritikos;
  bAnakr.textContent = anakritikos.split(" ")[1];
  index === 1 && bAnakr.setAttribute("selected", true);
  bAnakritikosSelect.appendChild(bAnakr);
});
const ypiresia = document.getElementById("ypiresia");
ypiresia.textContent = externalData.ypiresia;

const location = document.querySelector(".location");
location.textContent = externalData.merosSyntaksisEkthesis;
function updateAnakritikosElement() {
  anakritikosElement.innerHTML = anakritikosSelect.value;
}

updateAnakritikosElement();

anakritikosSelect.addEventListener("change", updateAnakritikosElement);
function updateBAnakritikosElement() {
  bAnakritikosElement.innerHTML = bAnakritikosSelect.value;
}

updateBAnakritikosElement();

bAnakritikosSelect.addEventListener("change", updateBAnakritikosElement);

// initial copy mech

const copyInitialBtn = document.getElementById("copy-initial");
copyInitialBtn.addEventListener("click", () => {
  const tempElement = document.createElement("div");
  tempElement.innerHTML = initial.innerHTML;
  document.body.appendChild(tempElement);

  const range = document.createRange();
  range.selectNodeContents(tempElement);

  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);

  try {
    document.execCommand("copy");
    console.log("Content copied to clipboard successfully!");
  } catch (err) {
    console.error("Could not copy content: ", err);
  }

  selection.removeAllRanges();
  document.body.removeChild(tempElement);
});

// person parser fields
const taytotita = document.getElementById("taytotita");
const personFormatBtn = document.getElementById("personFormat");
const clipboardId = document.querySelector(".clipboard-id");
const copyIdBtn = document.querySelector(".copy-id");
taytotita.addEventListener("input", () => {
  id = taytotita.value;
});

personFormatBtn.addEventListener("click", () => {
  clipboardId.value = formatIdInfo(id, externalData);
});

copyIdBtn.addEventListener("click", () => {
  const textToCopy = clipboardId.value;

  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        console.log("Text copied to clipboard successfully!");
      })
      .catch((err) => {
        console.error("Could not copy text to clipboard: ", err);
      });
  } else {
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = textToCopy;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
      console.log("Text copied to clipboard using fallback method!");
    } catch (err) {
      console.error("Could not copy text using fallback method: ", err);
    }
    document.body.removeChild(textArea);
  }
});

//vehicle parser fields

const oxima = document.getElementById("oxima");
const carFormatBtn = document.getElementById("carFormat");
const clipboardOxima = document.querySelector(".clipboard-oxima");
const copyOximaBtn = document.querySelector(".copy-oxima");

oxima.addEventListener("input", () => {
  vehicle = oxima.value;
});
carFormatBtn.addEventListener("click", () => {
  clipboardOxima.value = formatVehicleInfo(vehicle);
});

copyOximaBtn.addEventListener("click", () => {
  const textToCopy = clipboardOxima.value;

  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        console.log("Text copied to clipboard successfully!");
      })
      .catch((err) => {
        console.error("Could not copy text to clipboard: ", err);
      });
  } else {
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = textToCopy;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
      console.log("Text copied to clipboard using fallback method!");
    } catch (err) {
      console.error("Could not copy text using fallback method: ", err);
    }
    document.body.removeChild(textArea);
  }
});

// dialog help functionality
const personDialog = document.getElementById("person-dialog");
const personHelp = document.getElementById("person-help");
const personClose = document.getElementById("person-close");

personHelp.addEventListener("click", () => {
  personDialog.showModal();
});
personClose.addEventListener("click", () => {
  personDialog.close();
});

const vehicleDialog = document.getElementById("vehicle-dialog");
const vehicleHelp = document.getElementById("vehicle-help");
const vehicleClose = document.getElementById("vehicle-close");

vehicleHelp.addEventListener("click", () => {
  vehicleDialog.showModal();
});
vehicleClose.addEventListener("click", () => {
  vehicleDialog.close();
});

const genikesDialog = document.getElementById("genikes-dialog");
const genikesHelp = document.getElementById("genikes-help");
const genikesClose = document.getElementById("genikes-close");

genikesHelp.addEventListener("click", () => {
  genikesDialog.showModal();
});
genikesClose.addEventListener("click", () => {
  genikesDialog.close();
});

// field clear buttons
const personClear = document.getElementById("person-clear");
personClear.addEventListener("click", () => {
  taytotita.value = "";
  clipboardId.value = "";
});

const vehicleClear = document.getElementById("vehicle-clear");
vehicleClear.addEventListener("click", () => {
  oxima.value = "";
  clipboardOxima.value = "";
});

// ekthesi martyra
const initial = document.getElementById("initial");

console.log(
  printMartyra(
    initial.textContent,
    clipboardId.value,
    externalData,
    today,
    formatTime
  )
);
console.log(
  printSyllipsi(
    initial.textContent,
    clipboardId.value,
    externalData,
    today,
    formatTime,
    formatDate
  )
);

console.log(
  printAnomoti(
    initial.textContent,
    clipboardId.value,
    externalData,
    today,
    formatTime
  )
);
console.log(
  printKatigoroumenou(
    initial.textContent,
    clipboardId.value,
    externalData,
    today,
    formatTime
  )
);
console.log(
  printApodosi(
    initial.textContent,
    clipboardId.value,
    externalData,
    today,
    formatTime,
    formatDate
  )
);
console.log(
  printKatasxesi(
    initial.textContent,
    clipboardId.value,
    externalData,
    today,
    formatTime
  )
);
console.log(
  printGnostopoiisi(
    initial.textContent,
    clipboardId.value,
    externalData,
    today,
    formatTime
  )
);
