import externalData from "./data.js";
import {
  formatTime,
  formatDate,
  formatVehicleInfo,
  formatIdInfo,
  copyToClipboard,
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
  // Populate a anakr select
  const anakr = document.createElement("option");
  anakr.value = anakritikos;
  anakr.textContent = anakritikos.split(" ")[1];
  if (index === 0) {
    anakr.setAttribute("selected", ""); // or anakr.selected = true
  }
  anakritikosSelect.appendChild(anakr);

  // Populate b anakr select
  const bAnakr = document.createElement("option");
  bAnakr.value = anakritikos;
  bAnakr.textContent = anakritikos.split(" ")[1];
  if (index === 1) {
    bAnakr.setAttribute("selected", ""); // or bAnakr.selected = true
  }
  bAnakritikosSelect.appendChild(bAnakr);
});
const ypiresia = document.getElementById("ypiresia");
ypiresia.textContent = externalData.ypiresia;

const location = document.querySelector(".location");
location.textContent = externalData.merosSyntaksisEkthesis;
function updateAnakritikosElement() {
  anakritikosElement.innerHTML = anakritikosSelect.value;
}

anakritikosSelect.addEventListener("change", updateAnakritikosElement);
function updateBAnakritikosElement() {
  bAnakritikosElement.innerHTML = bAnakritikosSelect.value;
}

bAnakritikosSelect.addEventListener("change", updateBAnakritikosElement);

// initial copy mech

const copyInitialBtn = document.getElementById("copy-initial");
copyInitialBtn.addEventListener("click", () => {
  const text = initial.textContent.replace(/(\r\n|\n|\r|\s{2,})/gm, " ");
  copyToClipboard(text);
});

// person parser fields
const taytotita = document.getElementById("taytotita");
const clipboardId = document.querySelector(".clipboard-id");
const copyIdBtn = document.querySelector(".copy-id");
taytotita.addEventListener("input", () => {
  id = taytotita.value;
  clipboardId.value = formatIdInfo(id, externalData);
});

// personFormatBtn.addEventListener("click", () => {
//   clipboardId.value = formatIdInfo(id, externalData);
// });

copyIdBtn.addEventListener("click", () => {
  copyToClipboard(clipboardId.value);
});

//vehicle parser fields

const oxima = document.getElementById("oxima");
const clipboardOxima = document.querySelector(".clipboard-oxima");
const copyOximaBtn = document.querySelector(".copy-oxima");

oxima.addEventListener("input", () => {
  vehicle = oxima.value;
  clipboardOxima.value = formatVehicleInfo(vehicle);
});

copyOximaBtn.addEventListener("click", () => {
  copyToClipboard(clipboardOxima.value);
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
// general info button
const genikesDialog = document.getElementById("genikes-dialog");
const genikesHelp = document.getElementById("genikes-help");
const genikesClose = document.getElementById("genikes-close");

genikesHelp.addEventListener("click", () => {
  genikesDialog.showModal();
});
genikesClose.addEventListener("click", () => {
  genikesDialog.close();
});
//patch note button
const patchDialog = document.getElementById("patch-dialog");
const patchHelp = document.getElementById("patch-help");
const patchClose = document.getElementById("patch-close");

patchHelp.addEventListener("click", () => {
  patchDialog.showModal();
});
patchClose.addEventListener("click", () => {
  patchDialog.close();
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

// ektheseis
const initial = document.getElementById("initial");
// martyras button
const martyra = document.getElementById("martyra");
martyra.addEventListener("click", () => {
  const text = printMartyra(
    initial.textContent,
    clipboardId.value,
    externalData,
    today,
    formatTime
  );
  copyToClipboard(text);
});

//syllipsi button
const syllipsi = document.getElementById("syllipsi");
syllipsi.addEventListener("click", () => {
  const text = printSyllipsi(
    initial.textContent,
    clipboardId.value,
    externalData,
    today,
    formatTime,
    formatDate
  );
  copyToClipboard(text);
});
// anomoti button
const anomoti = document.getElementById("anomoti");
anomoti.addEventListener("click", () => {
  const text = printAnomoti(
    initial.textContent,
    clipboardId.value,
    externalData,
    today,
    formatTime
  );
  copyToClipboard(text);
});
// katigoroumenou button
const katigoroumenou = document.getElementById("katigoroumenou");
katigoroumenou.addEventListener("click", () => {
  const text = printKatigoroumenou(
    initial.textContent,
    clipboardId.value,
    externalData,
    today,
    formatTime
  );
  copyToClipboard(text);
});
const apodosi = document.getElementById("apodosi");
apodosi.addEventListener("click", () => {
  const text = printApodosi(
    initial.textContent,
    clipboardId.value,
    externalData,
    today,
    formatTime,
    formatDate
  );
  copyToClipboard(text);
});
// katasxesi button
const katasxesi = document.getElementById("katasxesi");
katasxesi.addEventListener("click", () => {
  const text = printKatasxesi(
    initial.textContent,
    clipboardId.value,
    externalData,
    today,
    formatTime,
    formatDate
  );
  copyToClipboard(text);
});

// gnostopoiisi button
const gnostopoiisi = document.getElementById("gnostopoiisi");
gnostopoiisi.addEventListener("click", () => {
  const text = printGnostopoisi(
    initial.textContent,
    clipboardId.value,
    externalData,
    today,
    formatTime
  );
  copyToClipboard(text);
});
