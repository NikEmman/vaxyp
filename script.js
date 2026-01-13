import ektheseis from "./ektheseis.js";
import { dikografies, defaultAstynomikos } from "./defaultData.js";
import {
  generateWord,
  processDocument,
  base64ToArrayBuffer,
  getDocumentBySex,
  displayNotification,
  copyToClipboard,
} from "./wordGenerators.js";
import {
  roundDownMinutes,
  formatTime,
  getNextDay,
  capitalize,
  convertAnakritikosToEnikos,
  shortenFormattedPerson,
  formatVehicleInfo,
  formatIdInfo,
  formatFormData,
  extractPersonInfo,
  getOfficerSurname,
  shortenFormattedOfficer,
} from "./formatters.js";
import {
  getData,
  getState,
  getAnakritikoiSelection,
  saveData,
} from "./stateManager.js";

let today = new Date();

let data = getData();
let state = getState(data, today);

const anakritikosSelect = document.querySelector("#anakritikos");
const bAnakritikosSelect = document.querySelector("#anakritikos-b");

const paintSelectMenus = () => {
  anakritikosSelect.innerHTML = "";
  bAnakritikosSelect.innerHTML = "";
  const selectA = getAnakritikoiSelection().aAnakr;
  const selectB = getAnakritikoiSelection().bAnakr;

  state.anakritikoi.forEach((anakritikos, index) => {
    // Populate a anakr select
    const anakr = document.createElement("option");
    anakr.value = anakritikos;
    anakr.textContent = anakritikos.split(" ")[1];
    //set data value for sex
    const sex = state.anakrSex ? state.anakrSex[index] : "Άντρας";
    anakr.setAttribute("data-sex", sex);
    if (index === selectA) {
      anakr.setAttribute("selected", "");
    }
    anakritikosSelect.appendChild(anakr);

    // Populate b anakr select
    const bAnakr = document.createElement("option");
    bAnakr.value = anakritikos;
    bAnakr.textContent = anakritikos.split(" ")[1];
    bAnakr.setAttribute("data-sex", sex);

    if (index === selectB) {
      bAnakr.setAttribute("selected", "");
    }
    bAnakritikosSelect.appendChild(bAnakr);
  });
};
paintSelectMenus();

const initialText = document.getElementById("initial");

function constructInitialText() {
  const arthro = state.arthro ? capitalize(state.arthro) : "Στην";
  // Access the data-sex attribute of the currently SELECTED option
  const sexA = anakritikosSelect.selectedOptions[0].dataset.sex;
  const sexB = bAnakritikosSelect.selectedOptions[0].dataset.sex;

  const arthroAnakrA = sexA === "Γυναίκα" ? "της" : "του";
  const arthroAnakrB = sexB === "Γυναίκα" ? "της" : "του";

  return `${arthro} ${state.merosSyntaksisEkthesis} σήμερα την ${
    state.day
  }η του μήνα ${state.month} του έτους ${state.year} ημέρα ${
    state.dayName
  } και ώρα ${formatTime(
    today,
    state.timePassed
  )} ενώπιον εμού, ${arthroAnakrA} ${anakritikosSelect.value} του ${
    data.ypiresia
  }, παρισταμένου και ${arthroAnakrB} ${bAnakritikosSelect.value} `;
}

//  file uploader validation
document
  .querySelector('input[type="file"]')
  .addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file && file.type !== "application/json") {
      alert("Επιτρέπονται μόνο αρχεία JSON!");
      event.target.value = "";
    }
  });

//file uploader function
document
  .querySelector('input[type="file"]')
  .addEventListener("change", function (event) {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = function (e) {
        try {
          const result = JSON.parse(e.target.result);

          // 1. Strict Validation Check
          // We check: Is it an object? Does it have 'anakritikoi'? Is that an array?
          const hasOfficers =
            result.anakritikoi &&
            Array.isArray(result.anakritikoi) &&
            result.anakritikoi.length > 0;
          const hasService = !!result.ypiresia; // Ensures ypiresia is not empty or undefined

          if (!hasOfficers || !hasService) {
            // If validation fails, we stop IMMEDIATELY
            alert(
              "Σφάλμα: Το αρχείο JSON δεν περιέχει τα απαραίτητα δεδομένα (π.χ. Ανακριτικοί υπάλληλοι)."
            );
            return;
          }

          // 2. Only proceed if the code reaches this point
          localStorage.clear();
          localStorage.setItem("dataObject", JSON.stringify(result));

          // Update global variables
          data = result;
          state = getState(data, today);

          // Refresh UI
          paintSelectMenus();
          initial.textContent = constructInitialText();

          console.log("Success: Data loaded.");
        } catch (error) {
          console.error("Parsing Error:", error);
          alert("Το αρχείο δεν είναι έγκυρο JSON.");
        }
      };

      reader.readAsText(file);
    }
  });
// tabs and content
const tabContainer = document.querySelector(".tabs");
const tabs = Array.from(tabContainer.children);
const tabContents = Array.from(document.querySelector(".tabContent").children);

tabs.forEach((tab, index) => {
  tab.addEventListener("click", (event) => {
    event.preventDefault();
    // Remove 'clicked' class and add 'tab' class to all tabs
    tabs.forEach((t) => {
      t.classList.remove("clicked");
      if (!t.classList.contains("tab")) t.classList.add("tab");
    });

    // Add 'clicked' to the current tab and remove 'tab'
    tab.classList.add("clicked");
    tab.classList.remove("tab");

    // Hide all tab content sections
    tabContents.forEach((content) => content.classList.add("hidden"));

    // Show the corresponding content section
    tabContents[index].classList.remove("hidden");
  });
});

//  victim / suspect select menus
const victimSelect = document.getElementById("polVictim");
if (victimSelect.value == "no") {
  document.getElementById("taytotita").classList.add("hidden");
  document.getElementById("dataForm").classList.remove("hidden");
} else {
  document.getElementById("taytotita").classList.remove("hidden");
  document.getElementById("dataForm").classList.add("hidden");
}
victimSelect.addEventListener("change", () => {
  if (victimSelect.value == "no") {
    document.getElementById("taytotita").classList.add("hidden");
    document.getElementById("dataForm").classList.remove("hidden");
  } else {
    document.getElementById("taytotita").classList.remove("hidden");
    document.getElementById("dataForm").classList.add("hidden");
  }
});

const suspectSelect = document.getElementById("polSuspect");
if (suspectSelect.value == "no") {
  document.getElementById("taytotita-ypoptos").classList.add("hidden");
  document.getElementById("dataForm-ypoptos").classList.remove("hidden");
} else {
  document.getElementById("taytotita-ypoptos").classList.remove("hidden");
  document.getElementById("dataForm-ypoptos").classList.add("hidden");
}
suspectSelect.addEventListener("change", () => {
  if (suspectSelect.value == "no") {
    document.getElementById("taytotita-ypoptos").classList.add("hidden");
    document.getElementById("dataForm-ypoptos").classList.remove("hidden");
  } else {
    document.getElementById("taytotita-ypoptos").classList.remove("hidden");
    document.getElementById("dataForm-ypoptos").classList.add("hidden");
  }
});
// submit button event
document.getElementById("submitForm").addEventListener("click", (event) => {
  event.preventDefault();
  const data = extractPersonInfo("dataForm");
  state.ypefthiniData = data;
  const text = formatFormData(data);
  state.victim = text;
  document.querySelector(".clipboard-id").value = text;
});
// submit-ypoptos button event
document
  .getElementById("submitForm-ypoptos")
  .addEventListener("click", (event) => {
    event.preventDefault();
    const data = extractPersonInfo("dataForm-ypoptos");
    state.ypoptosData = data;
    const text = formatFormData(data);
    state.suspect = text;
    document.querySelector(".clipboard-id-ypoptos").value = text;
  });

//dilosi apoleias

const apolesthen = document.getElementById("apolesthen");
apolesthen.addEventListener("input", () => {
  state.apolesthen = apolesthen.value;
});

const protokolo = document.getElementById("protokolo");
protokolo.addEventListener("input", () => {
  state.protokolo = protokolo.value;
});
const protokoloEndo = document.getElementById("protokoloEndo");
protokoloEndo.addEventListener("input", () => {
  state.protokoloEndo = protokoloEndo.value;
});

// Apodexetai radio buttons for endooikogeniaki
const apodexetaiRadioButtons = document.querySelectorAll(
  'input[name="apodexetai"]'
);

function updateVariables() {
  const selected = document.querySelector(
    'input[name="apodexetai"]:checked'
  ).value;

  // Logic for "apodexetai" variable
  // If Yes or enMeri, it's empty. Otherwise (No), it's "ΔΕΝ"
  if (selected === "Yes" || selected === "enMeri") {
    state.apodexetai = "";
  } else {
    state.apodexetai = "ΔΕΝ";
  }

  // Logic for "enMeri" variable
  // If Yes or No, it's empty. Otherwise (enMeri), it's "ΕΝ ΜΕΡΗ"
  if (selected === "Yes" || selected === "No") {
    state.enMeri = "";
  } else {
    state.enMeri = "ΕΝ ΜΕΡΗ";
  }
}

// Attach an event listener to every apodexetai radio button
apodexetaiRadioButtons.forEach((radio) => {
  radio.addEventListener("change", updateVariables);
});

// Run once on page load to set initial values based on the 'checked' attribute
updateVariables();

// Initial setup
initialText.textContent = constructInitialText();

// Update text when anakritikos selections change
anakritikosSelect.addEventListener("change", (e) => {
  initialText.textContent = constructInitialText();
  state.anakritikos = convertAnakritikosToEnikos(e.target.value, state);
  let anakritikoiSelections = JSON.parse(localStorage.getItem("anakr")) || {};
  anakritikoiSelections.aAnakr = e.target.selectedIndex;
  localStorage.setItem("anakr", JSON.stringify(anakritikoiSelections));
});

bAnakritikosSelect.addEventListener("change", (e) => {
  initialText.textContent = constructInitialText();
  let anakritikoiSelections = JSON.parse(localStorage.getItem("anakr")) || {};
  anakritikoiSelections.bAnakr = e.target.selectedIndex;
  localStorage.setItem("anakr", JSON.stringify(anakritikoiSelections));
});

// initial refresh copy buttons
const refreshInitialBtn = document.getElementById("refresh-initial");
refreshInitialBtn.addEventListener("click", () => {
  //get a new timestamp
  today = new Date();
  //reset time passed
  state.timePassed = 0;
  initialText.textContent = constructInitialText();
});

const copyInitialBtn = document.getElementById("copy-initial");
copyInitialBtn.addEventListener("click", () => {
  const text = constructInitialText().replace(/(\r\n|\n|\r|\s{2,})/gm, " ");
  copyToClipboard(text);
});

// person parser fields
const taytotita = document.getElementById("taytotita");
const clipboardId = document.querySelector(".clipboard-id");
const copyIdBtn = document.querySelector(".copy-id");
if (taytotita.value) {
  clipboardId.value = formatIdInfo(taytotita.value, data, state);
  state.victim = clipboardId.value;
} else {
  state.victim = "";
}

taytotita.addEventListener("input", () => {
  clipboardId.value = formatIdInfo(taytotita.value, data, state);
  state.victim = clipboardId.value;
});
clipboardId.addEventListener("input", () => {
  state.victim = clipboardId.value;
});
copyIdBtn.addEventListener("click", () => {
  copyToClipboard(state.victim);
});

// officer fields
const clipboardAstynomikos = document.querySelector(
  ".clipboard-id-astynomikos"
);
clipboardAstynomikos.value = state.astynomikos
  ? state.astynomikos
  : defaultAstynomikos;

clipboardAstynomikos.addEventListener("change", (e) => {
  state.astynomikos = e.target.value;
});
//save officer button
const storeOfficerBtn = document.querySelector(".save-astynomikos");
storeOfficerBtn.addEventListener("click", () => {
  console.log(state.astynomikos);
  if (state.astynomikos) {
    const localStorageData = getData();
    state.astynomikoi.push(state.astynomikos);
    const newItem = { astynomikoi: state.astynomikoi };
    saveData(localStorageData, newItem);
    paintAstynomikosSelect();
  }
});
function paintAstynomikosOption(astynomikosText) {
  const astynomikosSelect = document.getElementById("astynomikoi");
  const astynomikosOption = document.createElement("option");
  astynomikosOption.value = index;
  astynomikosOption.innerText = getOfficerSurname(astynomikosText);
  astynomikosSelect.appendChild(astynomikosOption);
}
const astynomikosSelect = document.getElementById("astynomikoi");
function paintAstynomikosSelect() {
  // Clear all options but the first:
  const firstOption = astynomikosSelect.firstElementChild;
  astynomikosSelect.innerHTML = "";
  astynomikosSelect.appendChild(firstOption);
  if (state.astynomikoi) {
    state.astynomikoi.forEach((value, index) => {
      const astynomikosOption = document.createElement("option");
      astynomikosOption.value = index;
      astynomikosOption.innerText = getOfficerSurname(value);
      astynomikosSelect.appendChild(astynomikosOption);
    });
  }
}
// call it to draw the select on page load
paintAstynomikosSelect();

// Suspect parser fields
const taytotitaYpoptos = document.getElementById("taytotita-ypoptos");
const clipboardIdYpoptos = document.querySelector(".clipboard-id-ypoptos");
const copyIdYpoptosBtn = document.querySelector(".copy-id-ypoptos");

if (taytotitaYpoptos.value) {
  clipboardIdYpoptos.value = formatIdInfo(taytotitaYpoptos.value, data, state);
  state.suspect = clipboardIdYpoptos.value;
} else {
  state.suspect = "";
}

taytotitaYpoptos.addEventListener("input", () => {
  clipboardIdYpoptos.value = formatIdInfo(
    taytotitaYpoptos.value,
    data,
    state,
    true
  );
  state.suspect = clipboardIdYpoptos.value;
});

clipboardIdYpoptos.addEventListener("input", () => {
  state.suspect = clipboardIdYpoptos.value;
});

copyIdYpoptosBtn.addEventListener("click", () => {
  copyToClipboard(state.suspect);
});

const clearYpoptosBtn = document.getElementById("person-ypoptos-clear");
clearYpoptosBtn.addEventListener("click", () => {
  taytotitaYpoptos.value = "";
  clipboardIdYpoptos.value = "";
  state.suspect = "";
  state.ypoptosData = {};
  document.getElementById("dataForm-ypoptos").reset();
});

//vehicle parser fields

const oxima = document.getElementById("oxima");
const clipboardOxima = document.querySelector(".clipboard-oxima");
const copyOximaBtn = document.querySelector(".copy-oxima");

oxima.addEventListener("input", () => {
  state.vehicle = oxima.value;
  clipboardOxima.value = formatVehicleInfo(state.vehicle);
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
  state.victim = "";
  state.ypefthiniData = {};
  document.getElementById("dataForm").reset();
});

const vehicleClear = document.getElementById("vehicle-clear");
vehicleClear.addEventListener("click", () => {
  oxima.value = "";
  clipboardOxima.value = "";
  state.vehicle = "";
});
// a130 select menu
const a130SelectMenu = document.getElementById("n");
a130SelectMenu.addEventListener("change", () => {
  const changeDate = document.querySelector(".changeDate");
  if (a130SelectMenu.value > 3) {
    changeDate.classList.add("hidden");
  } else {
    changeDate.classList.remove("hidden");
  }
});

// ektheseis
const initial = document.getElementById("initial");
// martyras button
const martyra = document.getElementById("martyra");

martyra.addEventListener("click", () => {
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);
  const ekthesi = getDocumentBySex(
    state.ypefthiniData.sex,
    "martyra",
    ektheseis
  );
  generateWord(ekthesi, state, state.ypefthiniData);
});

// martyraXorisOrko button
const martyraXoris = document.getElementById("martyraXoris");
martyraXoris.addEventListener("click", () => {
  state.timePassed += state.xronosPeratosis * 2;
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);
  const ekthesi = getDocumentBySex(
    state.ypefthiniData.sex,
    "martyraXoris",
    ektheseis
  );
  generateWord(ekthesi, state, state.ypefthiniData);
});

//syllipsi button
const syllipsi = document.getElementById("syllipsi");
syllipsi.addEventListener("click", () => {
  state.timePassed += state.xronosPeratosis * 2;
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);
  state.arrestTime = formatTime(today, state.timePassed - 5);
  const ekthesi = getDocumentBySex(
    state.ypoptosData.sex,
    "syllipsi",
    ektheseis
  );

  generateWord(ekthesi, state, state.ypoptosData);
});
// anomoti button
const anomoti = document.getElementById("anomoti");
anomoti.addEventListener("click", () => {
  state.timePassed += state.xronosPeratosis * 2;
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);
  const ekthesi = getDocumentBySex(state.ypoptosData.sex, "anomoti", ektheseis);

  generateWord(ekthesi, state, state.ypoptosData);
});

// katigoroumenou button
const katigoroumenou = document.getElementById("katigoroumenou");
katigoroumenou.addEventListener("click", () => {
  state.timePassed += state.xronosPeratosis * 2;
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);
  const ekthesi = getDocumentBySex(
    state.ypoptosData.sex,
    "katigoroumenou",
    ektheseis
  );

  generateWord(ekthesi, state, state.ypoptosData);
});

//apodosi button
const apodosi = document.getElementById("apodosi");
apodosi.addEventListener("click", () => {
  state.timePassed += state.xronosPeratosis * 2;
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);
  const ekthesi = getDocumentBySex(
    state.ypefthiniData.sex,
    "apodosi",
    ektheseis
  );
  generateWord(ekthesi, state, state.ypefthiniData);
});
// katasxesi button
const katasxesi = document.getElementById("katasxesi");
katasxesi.addEventListener("click", () => {
  state.timePassed += state.xronosPeratosis * 2;
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);

  generateWord(ektheseis.katasxesi, state, state.ypefthiniData);
});

// gnostopoiisi button
const gnostopoiisi = document.getElementById("gnostopoiisi");
gnostopoiisi.addEventListener("click", () => {
  state.timePassed += state.xronosPeratosis * 2;
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);
  const ekthesi = getDocumentBySex(
    state.ypoptosData.sex,
    "gnostopoiisi",
    ektheseis
  );

  generateWord(ekthesi, state, state.ypoptosData);
});

// egxeirisis button  printEgxeirisis(initial, person)
const egxeirisis = document.getElementById("egxeirisis");
egxeirisis.addEventListener("click", () => {
  state.timePassed += state.xronosPeratosis * 2;
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);
  const ekthesi = getDocumentBySex(
    state.ypefthiniData.sex,
    "egxeirisis",
    ektheseis
  );
  generateWord(ekthesi, state, state.ypefthiniData);
});

// gnostopoiisiNarkwtikwn button
const gnostopoiisiNarkwtikwn = document.getElementById(
  "gnostopoiisiNarkwtikwn"
);
gnostopoiisiNarkwtikwn.addEventListener("click", () => {
  state.timePassed += state.xronosPeratosis * 2;
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);
  const ekthesi = getDocumentBySex(
    state.ypoptosData.sex,
    "gnostopoiisiNarkwtikwn",
    ektheseis
  );

  generateWord(ekthesi, state, state.ypoptosData);
});

// praktikoZygisis button
const praktikoZygisis = document.getElementById("praktikoZygisis");
praktikoZygisis.addEventListener("click", () => {
  state.timePassed += state.xronosPeratosis * 2;
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);
  const ekthesi = getDocumentBySex(
    state.ypoptosData.sex,
    "praktikoZygisis",
    ektheseis
  );

  generateWord(ekthesi, state, state.ypoptosData);
});
// ypiresiako button
const ypiresiako = document.getElementById("ypiresiako");
ypiresiako.addEventListener("click", () => {
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.anakritikos = convertAnakritikosToEnikos(
    anakritikosSelect.value,
    state
  );
  state.ypiresia = state.ypiresia.toUpperCase();
  state.dAstynomias = state.dAstynomias.toUpperCase();
  state.geniki = state.geniki.toUpperCase();
  state.victim = shortenFormattedPerson(state.victim);
  state.anakritikosName =
    state.anakritikos.split(" ")[1] + " " + state.anakritikos.split(" ")[2];
  state.rank = state.anakritikos.split(" ")[0];
  generateWord(ektheseis.ypiresiako, state, state.ypefthiniData);
});
// ypefthini button
const ypefthini = document.getElementById("ypefthini");
ypefthini.addEventListener("click", () => {
  Object.assign(state, { ...state.ypefthiniData });
  state.anakritikos = convertAnakritikosToEnikos(
    anakritikosSelect.value,
    state
  );
  generateWord(ektheseis.ypefthini, state, state.ypefthiniData);
});

// deltio drasti button
const ypoptoy = document.getElementById("ypoptoy");
ypoptoy.addEventListener("click", () => {
  state.anakritikos = convertAnakritikosToEnikos(
    anakritikosSelect.value,
    state
  );
  Object.assign(state, { ...state.ypoptosData });
  state.anakritikosName =
    state.anakritikos.split(" ")[1] + " " + state.anakritikos.split(" ")[2];
  state.rank = state.anakritikos.split(" ")[0];
  generateWord(ektheseis.deltioYpoptou, state, state.ypoptosData);
});

//deltio feromenou button
const feromenou = document.getElementById("feromenou");
feromenou.addEventListener("click", () => {
  state.anakritikos = convertAnakritikosToEnikos(
    anakritikosSelect.value,
    state
  );
  Object.assign(state, { ...state.ypoptosData });
  state.timeStart = formatTime(today, state.timePassed);
  state.anakritikosName =
    state.anakritikos.split(" ")[1] + " " + state.anakritikos.split(" ")[2];
  state.rank = state.anakritikos.split(" ")[0];
  state.man = " ";
  state.woman = " ";
  state.sex == "Γυναίκα" ? (state.woman = "X") : (state.man = "X");
  state.anakritikosName =
    state.anakritikos.split(" ")[1] + " " + state.anakritikos.split(" ")[2];
  state.rank = state.anakritikos.split(" ")[0];
  state.isuYear = state.issueDate.split("-")[2];
  state.issuingAuthority = state.issuingAuthority.toUpperCase();
  state.merosSyntaksisEkthesis = state.merosSyntaksisEkthesis.toUpperCase();
  state.ypiresia = state.ypiresia.toUpperCase();
  generateWord(ektheseis.feromenou, state, state.ypoptosData);
});

/// ENDOOIKOGENIAKI

//martyra astyn button
const martyraEndooik = document.getElementById("martyra-endooik");
martyraEndooik.addEventListener("click", () => {
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.endoTimeStart = state.timeStart;
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);
  if (state.ypoptosData.sex == "Γυναίκα") {
    state.o = "η";
    state.tou = "της";
    state.ton = "την";
  } else {
    state.o = "ο";
    state.tou = "του";
    state.ton = "τον";
  }
  const ekthesi = getDocumentBySex(
    state.ypefthiniData.sex,
    "astynomikosEndooik",
    ektheseis
  );
  generateWord(ekthesi, state, state.ypefthiniData);
});
// thyma endooik button
const thymaEndooik = document.getElementById("thyma-endooik");
thymaEndooik.addEventListener("click", () => {
  state.timePassed += state.xronosPeratosis * 2;
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.endoStartTime = state.timeStart;
  if (state.ypoptosData.sex == "Γυναίκα") {
    state.o = "η";
    state.tou = "της";
    state.ton = "την";
  } else {
    state.o = "ο";
    state.tou = "του";
    state.ton = "τον";
  }

  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);
  const ekthesi = getDocumentBySex(
    state.ypefthiniData.sex,
    "martyraXorisEndooik",
    ektheseis
  );
  generateWord(ekthesi, state, state.ypefthiniData);
});

// drastis -apologia -katigoroumenos endooik button
const drastisEndooik = document.getElementById("drastis-endooik");
drastisEndooik.addEventListener("click", () => {
  state.timePassed += state.xronosPeratosis * 2;
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);
  if (state.ypefthiniData.sex == "Γυναίκα") {
    state.o = "η";
    state.tou = "της";
    state.ton = "την";
  } else {
    state.o = "ο";
    state.tou = "του";
    state.ton = "τον";
  }
  const ekthesi = getDocumentBySex(
    state.ypoptosData.sex,
    "katigoroumenouEndooik",
    ektheseis
  );

  generateWord(ekthesi, state, state.ypoptosData);
});
// iatrodikastiki button
const iatrodikastiki = document.getElementById("iatrodikastiki-endooik");
iatrodikastiki.addEventListener("click", () => {
  state.timePassed += state.xronosPeratosis * 2;
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);
  state.anakritikos = convertAnakritikosToEnikos(
    anakritikosSelect.value,
    state
  );
  state.ypiresia = state.ypiresia.toUpperCase();
  state.anakritikosName =
    state.anakritikos.split(" ")[1] + " " + state.anakritikos.split(" ")[2];
  state.rank = state.anakritikos.split(" ")[0];
  if (state.ypoptosData.sex == "Γυναίκα") {
    state.o = "η";
    state.tou = "της";
    state.ton = "την";
  } else {
    state.o = "ο";
    state.tou = "του";
    state.ton = "τον";
  }
  const ekthesi = getDocumentBySex(
    state.ypefthiniData.sex,
    "iatrodikastiki",
    ektheseis
  );

  generateWord(ekthesi, state, state.ypoptosData);
});
const panicYes = document.getElementById("panicYes");
panicYes.addEventListener("click", () => {
  state.timePassed += state.xronosPeratosis * 2;
  state.ypiresia = state.ypiresia.toUpperCase();
  state.timeStart = formatTime(today, state.timePassed);
  const ekthesi = getDocumentBySex(
    state.ypefthiniData.sex,
    "panicButtonYes",
    ektheseis
  );
  generateWord(ekthesi, state, state.ypefthiniData);
});
const panicNo = document.getElementById("panicNo");
panicNo.addEventListener("click", () => {
  state.timePassed += state.xronosPeratosis * 2;
  state.ypiresia = state.ypiresia.toUpperCase();
  state.timeStart = formatTime(today, state.timePassed);
  const ekthesi = getDocumentBySex(
    state.ypefthiniData.sex,
    "panicButtonNo",
    ektheseis
  );
  generateWord(ekthesi, state, state.ypefthiniData);
});

//afairesi button
const afairesi = document.getElementById("afairesi");
afairesi.addEventListener("click", () => {
  state.timePassed += state.xronosPeratosis * 2;
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);
  const ekthesi = getDocumentBySex(
    state.ypoptosData.sex,
    "afairesi",
    ektheseis
  );

  generateWord(ekthesi, state, state.ypoptosData);
});
// katasxesiEndo button
const katasxesiEndo = document.getElementById("katasxesiEndo");
katasxesiEndo.addEventListener("click", () => {
  state.timePassed += state.xronosPeratosis * 2;
  state.initial = constructInitialText();
  if (state.ypoptosData.sex == "Γυναίκα") {
    state.o = "η";
    state.tou = "της";
    state.ton = "την";
  } else {
    state.o = "ο";
    state.tou = "του";
    state.ton = "τον";
  }
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);

  generateWord(ektheseis.katasxesiEndo, state, state.ypefthiniData);
});

//syllipsi button
const syllipsiEndo = document.getElementById("syllipsiEndo");
syllipsiEndo.addEventListener("click", () => {
  state.timePassed += state.xronosPeratosis * 2;
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);
  state.arrestTime = formatTime(today, state.timePassed - 5);
  const ekthesi = getDocumentBySex(
    state.ypoptosData.sex,
    "syllipsiEndo",
    ektheseis
  );

  generateWord(ekthesi, state, state.ypoptosData);
});

// deltio drasti Endo button
const ypoptoyEndo = document.getElementById("ypoptoyEndo");
ypoptoyEndo.addEventListener("click", () => {
  state.anakritikos = convertAnakritikosToEnikos(
    anakritikosSelect.value,
    state
  );
  Object.assign(state, { ...state.ypoptosData });
  state.anakritikosName =
    state.anakritikos.split(" ")[1] + " " + state.anakritikos.split(" ")[2];
  state.rank = state.anakritikos.split(" ")[0];
  generateWord(ektheseis.deltioYpoptouEndo, state, state.ypoptosData);
});
//ypovlitiki button
const ypovoliEndo = document.getElementById("ypovoliEndo");
ypovoliEndo.addEventListener("click", () => {
  Object.assign(state, { ...state.ypefthiniData });
  state.nextDay = getNextDay(state.formattedDate);
  if (state.ypoptosData.sex == "Γυναίκα") {
    state.o = "η";
    state.tou = "της";
    state.os = "η";
    state.ou = "ης";
  } else {
    state.o = "ο";
    state.tou = "του";
    state.os = "ος";
    state.ou = "ου";
  }
  if (state.ypefthiniData.sex == "Γυναίκα") {
    state.o2 = "η";
    state.tou2 = "της";
    state.ton2 = "την";
    state.ou2 = "ης";
    state.ontas2 = "ούσα";
  } else {
    state.o2 = "ο";
    state.tou2 = "του";
    state.ton2 = "τον";
    state.ou2 = "ου";
    state.ontas2 = "όντας";
  }
  if (
    document.querySelector('input[name="autoforo"]:checked').value == "true"
  ) {
    state.autoforo = `Γίνεται μνεία ότι δράστης αναζητήθηκε στα όρια του αυτοφώρου μέχρι και την 23.59 ώρα της ${state.nextDay} με αρνητικό αποτέλεσμα.`;
  } else {
    state.autoforo =
      "Δράστης δεν αναζητήθηκε στα όρια του αυτοφώρου διότι έχει παρέλθει η προθεσμία αυτού.";
  }
  state.dioksi = document.querySelector('input[name="dioksi"]:checked').value;
  state.iatrodik = document.querySelector(
    'input[name="iatrodik"]:checked'
  ).value;
  state.oplo = document.querySelector('input[name="oplo"]:checked').value;
  state.ypotropos = document.querySelector(
    'input[name="ypotropos"]:checked'
  ).value;
  state.anakritikos = convertAnakritikosToEnikos(
    anakritikosSelect.value,
    state
  );
  state.ypiresia = state.ypiresia?.toUpperCase();
  state.eisaggeleiaProtodikon = state.eisaggeleiaProtodikon.toUpperCase();

  generateWord(ektheseis.ypovoliEndo, state, state.ypefthiniData);
});
//ypovlitiki button
const apostoliEndo = document.getElementById("apostoliEndo");
apostoliEndo.addEventListener("click", () => {
  Object.assign(state, { ...state.ypefthiniData });
  state.nextDay = getNextDay(state.formattedDate);
  if (state.ypoptosData.sex == "Γυναίκα") {
    state.o = "η";
    state.tou = "της";
    state.os = "η";
    state.ou = "ης";
    state.ton = "την";
  } else {
    state.o = "ο";
    state.tou = "του";
    state.os = "ος";
    state.ou = "ου";
    state.ton = "τον";
  }
  if (state.ypefthiniData.sex == "Γυναίκα") {
    state.o2 = "η";
    state.tou2 = "της";
    state.ton2 = "την";
    state.ou2 = "ης";
    state.ontas2 = "ούσα";
  } else {
    state.o2 = "ο";
    state.tou2 = "του";
    state.ton2 = "τον";
    state.ou2 = "ου";
    state.ontas2 = "όντας";
  }
  if (
    document.querySelector('input[name="autoforo"]:checked').value == "true"
  ) {
    state.autoforo = `Γίνεται μνεία ότι δράστης αναζητήθηκε στα όρια του αυτοφώρου μέχρι και την 23.59 ώρα της ${state.nextDay} με αρνητικό αποτέλεσμα.`;
  } else {
    state.autoforo =
      "Δράστης δεν αναζητήθηκε στα όρια του αυτοφώρου διότι έχει παρέλθει η προθεσμία αυτού.";
  }
  state.dioksi = document.querySelector('input[name="dioksi"]:checked').value;
  state.iatrodik = document.querySelector(
    'input[name="iatrodik"]:checked'
  ).value;
  state.oplo = document.querySelector('input[name="oplo"]:checked').value;
  state.ypotropos = document.querySelector(
    'input[name="ypotropos"]:checked'
  ).value;
  state.anakritikos = convertAnakritikosToEnikos(
    anakritikosSelect.value,
    state
  );
  state.ypiresia = state.ypiresia?.toUpperCase();
  state.eisaggeleiaProtodikon = state.eisaggeleiaProtodikon.toUpperCase();

  generateWord(ektheseis.apostoliEndo, state, state.ypefthiniData);
});

// Γ.Ε.Ε. button
const simansi = document.getElementById("simansi");
simansi.addEventListener("click", () => {
  state.anakritikos = convertAnakritikosToEnikos(
    anakritikosSelect.value,
    state
  );
  Object.assign(state, { ...state.ypoptosData });
  state.anakritikosName =
    state.anakritikos.split(" ")[1] + " " + state.anakritikos.split(" ")[2];
  state.rank = state.anakritikos.split(" ")[0];
  const ekthesi = getDocumentBySex(state.ypoptosData.sex, "simansi", ektheseis);
  generateWord(ekthesi, state, state.ypoptosData);
});

// ΒΑΣ button
const vasEndo = document.getElementById("vasEndo");
vasEndo.addEventListener("click", () => {
  state.nextDay = getNextDay(state.formattedDate);

  if (state.ypoptosData.sex == "Γυναίκα") {
    state.o = "η";
    state.tou = "της";
    state.os = "η";
    state.ou = "ης";
    state.ton = "την";
  } else {
    state.o = "ο";
    state.tou = "του";
    state.os = "ος";
    state.ou = "ου";
    state.ton = "τον";
  }
  if (state.ypefthiniData.sex == "Γυναίκα") {
    state.o2 = "η";
    state.tou2 = "της";
    state.ton2 = "την";
    state.ou2 = "ης";
    state.on2 = "ούσα";
  } else {
    state.o2 = "ο";
    state.tou2 = "του";
    state.ton2 = "τον";
    state.ou2 = "ου";
    state.on2 = "όντας";
  }
  state.dioksi = document.querySelector('input[name="dioksi"]:checked').value;
  state.iatrodik = document.querySelector(
    'input[name="iatrodik"]:checked'
  ).value;
  state.oplo = document.querySelector('input[name="oplo"]:checked').value;
  state.ypotropos = document.querySelector(
    'input[name="ypotropos"]:checked'
  ).value;
  generateWord(ektheseis.vasEndo, state, state.ypoptosData);
});

// new IDs btn
const a130 = document.getElementById("a130");
a130.addEventListener("click", () => {
  Object.assign(state, { ...state.ypefthiniData });
  state.n = document.getElementById("n").value;
  state.newId = document.getElementById("newId").value;
  state.newIdAppDate = document.getElementById("newIdAppDate").value;
  state.anakritikos = convertAnakritikosToEnikos(
    anakritikosSelect.value,
    state
  );
  state.ypiresia = state.ypiresia?.toUpperCase();
  state.issuingAuthority = state.issuingAuthority?.toUpperCase();
  state.anakritikosName =
    state.anakritikos.split(" ")[1] + " " + state.anakritikos.split(" ")[2];
  state.rank = state.anakritikos.split(" ")[0];
  generateWord(ektheseis.a130, state, state.ypefthiniData);
});

// ypefthiniDAT button
const ypefthiniDAT = document.getElementById("ypefthiniDAT");

ypefthiniDAT.addEventListener("click", () => {
  Object.assign(state, { ...state.ypefthiniData });
  state.idNumber1 = state.idNumber;
  generateWord(ektheseis.ypefthiniDAT, state, state.ypefthiniData);
});

//form validations
const newidData = document.getElementById("newId");
newidData.addEventListener("input", () => {
  newidData.classList.remove("error");
  if (newidData.value === "") {
    newidData.classList.add("error");
  }
});

const dikografiesSelect = document.getElementById("dikografies");

dikografiesSelect.addEventListener("change", () => {
  const value = dikografiesSelect.value;
  const allButtons = document.querySelectorAll(".dikografiesHiddable");

  // If nothing is selected, show everything and exit
  if (!value) {
    allButtons.forEach((btn) => btn.classList.remove("hidden"));
    return;
  }

  const allowed = dikografies[value] || [];

  allButtons.forEach((btn) => {
    // Check if the current button's ID is in the "allowed" array
    if (allowed.includes(btn.id)) {
      btn.classList.remove("hidden");
    } else {
      btn.classList.add("hidden");
    }
  });
});
