import ektheseis from "./ektheseis.js";
import { defaultData, months, days } from "./defaultData.js";

let today = new Date();

const getData = () => {
  const localStorageData = JSON.parse(localStorage.getItem("dataObject"));
  return localStorageData ? localStorageData : defaultData;
};
const getState = (localData, todayDate) => {
  let stringYear = todayDate.getFullYear();
  let stringMonth = String(todayDate.getMonth() + 1).padStart(2, "0");
  let stringDay = String(todayDate.getDate()).padStart(2, "0");
  let formattedDate = `${stringYear}-${stringMonth}-${stringDay}`;
  let specificDate = new Date(formattedDate);

  let dataObject = {
    victim: "",
    suspect: "",
    vehicle: "",
    formattedDate: `${stringDay}-${stringMonth}-${stringYear}`,
    dayName: days[specificDate.getDay()],
    year: todayDate.getFullYear(),
    month: months[todayDate.getMonth()],
    day: todayDate.getDate(),
    ypefthiniData: {},
    ypoptosData: {},
    timePassed: 0,
    apolesthen: "",
    protokolo: "",
    protokoloEndo: "",
    apodexetai: "",
    enMeri: "",
  };
  //combine data and state so the new Ektheseis replacement argument works

  Object.assign(dataObject, { ...localData });
  return dataObject;
};
let data = getData();
let state = getState(data, today);

const anakritikosSelect = document.querySelector("#anakritikos");
const bAnakritikosSelect = document.querySelector("#anakritikos-b");

function getAnakritikoiSelection() {
  const localStorageData = JSON.parse(localStorage.getItem("anakr"));
  return localStorageData ? localStorageData : { aAnakr: 0, bAnakr: 1 };
}

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

    if (index === selectA) {
      anakr.setAttribute("selected", "");
    }
    anakritikosSelect.appendChild(anakr);

    // Populate b anakr select
    const bAnakr = document.createElement("option");
    bAnakr.value = anakritikos;
    bAnakr.textContent = anakritikos.split(" ")[1];

    if (index === selectB) {
      bAnakr.setAttribute("selected", "");
    }
    bAnakritikosSelect.appendChild(bAnakr);
  });
};
paintSelectMenus();
const initialText = document.getElementById("initial");

function constructInitialText() {
  return `Στην ${state.merosSyntaksisEkthesis} σήμερα την ${
    state.day
  }η του μήνα ${state.month} του έτους ${state.year} ημέρα ${
    state.dayName
  } και ώρα ${formatTime(today, state.timePassed)} ενώπιον εμού, του ${
    anakritikosSelect.value
  } του ${data.ypiresia}, παρισταμένου και του ${bAnakritikosSelect.value} `;
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
  state.anakritikos = convertAnakritikosToEnikos(e.target.value);
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
  clipboardId.value = formatIdInfo(taytotita.value, data);
  state.victim = clipboardId.value;
} else {
  state.victim = "";
}

taytotita.addEventListener("input", () => {
  clipboardId.value = formatIdInfo(taytotita.value, data);
  state.victim = clipboardId.value;
});
clipboardId.addEventListener("input", () => {
  state.victim = clipboardId.value;
});
copyIdBtn.addEventListener("click", () => {
  copyToClipboard(state.victim);
});

// Suspect parser fields
const taytotitaYpoptos = document.getElementById("taytotita-ypoptos");
const clipboardIdYpoptos = document.querySelector(".clipboard-id-ypoptos");
const copyIdYpoptosBtn = document.querySelector(".copy-id-ypoptos");

if (taytotitaYpoptos.value) {
  clipboardIdYpoptos.value = formatIdInfo(taytotitaYpoptos.value, data);
  state.suspect = clipboardIdYpoptos.value;
} else {
  state.suspect = "";
}

taytotitaYpoptos.addEventListener("input", () => {
  clipboardIdYpoptos.value = formatIdInfo(taytotitaYpoptos.value, data, true);
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
  generateWord(ekthesi, state);
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
  generateWord(ekthesi, state);
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
  generateWord(ekthesi, state);
});
// katasxesi button
const katasxesi = document.getElementById("katasxesi");
katasxesi.addEventListener("click", () => {
  state.timePassed += state.xronosPeratosis * 2;
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);

  generateWord(ektheseis.katasxesi, state);
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
  generateWord(ekthesi, state);
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
  state.anakritikos = convertAnakritikosToEnikos(anakritikosSelect.value);
  state.ypiresia = state.ypiresia.toUpperCase();
  state.dAstynomias = state.dAstynomias.toUpperCase();
  state.geniki = state.geniki.toUpperCase();
  state.victim = shortenFormattedPerson(state.victim);
  state.anakritikosName =
    state.anakritikos.split(" ")[1] + " " + state.anakritikos.split(" ")[2];
  state.rank = state.anakritikos.split(" ")[0];
  generateWord(ektheseis.ypiresiako, state);
});
// ypefthini button
const ypefthini = document.getElementById("ypefthini");
ypefthini.addEventListener("click", () => {
  Object.assign(state, { ...state.ypefthiniData });
  state.anakritikos = convertAnakritikosToEnikos(anakritikosSelect.value);
  generateWord(ektheseis.ypefthini, state);
});

// deltio drasti button
const ypoptoy = document.getElementById("ypoptoy");
ypoptoy.addEventListener("click", () => {
  state.anakritikos = convertAnakritikosToEnikos(anakritikosSelect.value);
  Object.assign(state, { ...state.ypoptosData });
  state.anakritikosName =
    state.anakritikos.split(" ")[1] + " " + state.anakritikos.split(" ")[2];
  state.rank = state.anakritikos.split(" ")[0];
  generateWord(ektheseis.deltioYpoptou, state, state.ypoptosData);
});

//deltio feromenou button
const feromenou = document.getElementById("feromenou");
feromenou.addEventListener("click", () => {
  state.anakritikos = convertAnakritikosToEnikos(anakritikosSelect.value);
  Object.assign(state, { ...state.ypoptosData });
  state.timeStart = formatTime(today, state.timePassed);
  state.anakritikosName =
    state.anakritikos.split(" ")[1] + " " + state.anakritikos.split(" ")[2];
  state.rank = state.anakritikos.split(" ")[0];
  console.log(state.ypoptosData);
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
  generateWord(ekthesi, state);
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
  generateWord(ekthesi, state);
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
  state.anakritikos = convertAnakritikosToEnikos(anakritikosSelect.value);
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
  generateWord(ekthesi, state);
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
  generateWord(ekthesi, state);
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
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);

  generateWord(ektheseis.katasxesiEndo, state);
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
  state.anakritikos = convertAnakritikosToEnikos(anakritikosSelect.value);
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
  state.anakritikos = convertAnakritikosToEnikos(anakritikosSelect.value);
  state.ypiresia = state.ypiresia?.toUpperCase();
  state.eisaggeleiaProtodikon = state.eisaggeleiaProtodikon.toUpperCase();
  console.log("ProtokoloEndo", state.protokoloEndo);

  generateWord(ektheseis.ypovoliEndo, state);
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
  state.anakritikos = convertAnakritikosToEnikos(anakritikosSelect.value);
  state.ypiresia = state.ypiresia?.toUpperCase();
  state.eisaggeleiaProtodikon = state.eisaggeleiaProtodikon.toUpperCase();
  console.log("ProtokoloEndo", state.protokoloEndo);

  generateWord(ektheseis.apostoliEndo, state);
});

// Γ.Ε.Ε. button
const simansi = document.getElementById("simansi");
simansi.addEventListener("click", () => {
  state.anakritikos = convertAnakritikosToEnikos(anakritikosSelect.value);
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
  generateWord(ektheseis.vasEndo, state, state.ypoptosData);
});

// new IDs btn
const a130 = document.getElementById("a130");
a130.addEventListener("click", () => {
  Object.assign(state, { ...state.ypefthiniData });
  state.n = document.getElementById("n").value;
  state.newId = document.getElementById("newId").value;
  state.newIdAppDate = document.getElementById("newIdAppDate").value;
  state.anakritikos = convertAnakritikosToEnikos(anakritikosSelect.value);
  state.ypiresia = state.ypiresia?.toUpperCase();
  state.issuingAuthority = state.issuingAuthority?.toUpperCase();
  state.anakritikosName =
    state.anakritikos.split(" ")[1] + " " + state.anakritikos.split(" ")[2];
  state.rank = state.anakritikos.split(" ")[0];
  generateWord(ektheseis.a130, state);
});

// ypefthiniDAT button
const ypefthiniDAT = document.getElementById("ypefthiniDAT");

ypefthiniDAT.addEventListener("click", () => {
  Object.assign(state, { ...state.ypefthiniData });
  state.idNumber1 = state.idNumber;
  generateWord(ektheseis.ypefthiniDAT, state);
});

//form validations
const newidData = document.getElementById("newId");
newidData.addEventListener("input", () => {
  newidData.classList.remove("error");
  if (newidData.value === "") {
    newidData.classList.add("error");
  }
});

//time formatter
function roundDownMinutes(minutes) {
  return minutes - (minutes % 5); // rounds down minutes to miltiplicatives of 5, ie 39 becomes 35
}
function formatTime(date, extraTime = 0) {
  let totalMinutes =
    date.getHours() * 60 + roundDownMinutes(date.getMinutes()) + extraTime;
  // Ensure totalMinutes wraps correctly for negative cases
  totalMinutes = (totalMinutes + 1440) % 1440;

  let hour = Math.floor(totalMinutes / 60);
  let minutes = totalMinutes % 60;

  let formattedHour = String(hour).padStart(2, "0");
  let formattedMinutes = String(minutes).padStart(2, "0");

  return `${formattedHour}:${formattedMinutes}`;
}

// helper function to get the next date
function getNextDay(dateString) {
  // 1. Split the dd-mm-yyyy string
  const [day, month, year] = dateString.split("-").map(Number);

  // 2. Create a Date object
  // Note: Month is 0-indexed in JS (January is 0, February is 1, etc.)
  const date = new Date(year, month - 1, day);

  // 3. Add one day
  date.setDate(date.getDate() + 1);

  // 4. Extract the new day, month, and year
  const nextDay = String(date.getDate()).padStart(2, "0");
  const nextMonth = String(date.getMonth() + 1).padStart(2, "0");
  const nextYear = date.getFullYear();

  // 5. Return in the same format
  return `${nextDay}-${nextMonth}-${nextYear}`;
}

//helper functions to turn the name from onomastiki to geniki
function toGenitiveMale(name) {
  switch (name) {
    case "ΑΓΓΕΛΟΣ":
      return "ΑΓΓΕΛΟΥ";
    case "ΑΘΑΝΑΣΙΟΣ":
      return "ΑΘΑΝΑΣΙΟΥ";
    case "ΑΛΕΞΑΝΔΡΟΣ":
      return "ΑΛΕΞΑΝΔΡΟΥ";
    case "ΑΝΤΩΝΙΟΣ":
      return "ΑΝΤΩΝΙΟΥ";
    case "ΑΝΔΡΕΑΣ":
      return "ΑΝΔΡΕΑ";
    case "ΑΡΙΣΤΕΙΔΗΣ":
      return "ΑΡΙΣΤΕΙΔΗ";
    case "ΒΑΣΙΛΕΙΟΣ":
      return "ΒΑΣΙΛΕΙΟΥ";
    case "ΓΕΩΡΓΙΟΣ":
      return "ΓΕΩΡΓΙΟΥ";
    case "ΓΡΗΓΟΡΙΟΣ":
      return "ΓΡΗΓΟΡΙΟΥ";
    case "ΔΗΜΗΤΡΙΟΣ":
      return "ΔΗΜΗΤΡΙΟΥ";
    case "ΕΛΕΥΘΕΡΙΟΣ":
      return "ΕΛΕΥΘΕΡΙΟΥ";
    case "ΕΥΑΓΓΕΛΟΣ":
      return "ΕΥΑΓΓΕΛΟΥ";
    case "ΕΥΘΥΜΙΟΣ":
      return "ΕΥΘΥΜΙΟΥ";
    case "ΗΛΙΑΣ":
      return "ΗΛΙΑ";
    case "ΘΕΟΔΩΡΟΣ":
      return "ΘΕΟΔΩΡΟΥ";
    case "ΙΩΑΝΝΗΣ":
      return "ΙΩΑΝΝΗ";
    case "ΚΩΝΣΤΑΝΤΙΝΟΣ":
      return "ΚΩΝΣΤΑΝΤΙΝΟΥ";
    case "ΛΑΖΑΡΟΣ":
      return "ΛΑΖΑΡΟΥ";
    case "ΛΕΩΝΙΔΑΣ":
      return "ΛΕΩΝΙΔΑ";
    case "ΜΑΡΚΟΣ":
      return "ΜΑΡΚΟΥ";
    case "ΝΙΚΟΛΑΟΣ":
      return "ΝΙΚΟΛΑΟΥ";
    case "ΠΑΝΑΓΙΩΤΗΣ":
      return "ΠΑΝΑΓΙΩΤΗ";
    case "ΠΑΥΛΟΣ":
      return "ΠΑΥΛΟΥ";
    case "ΠΕΤΡΟΣ":
      return "ΠΕΤΡΟΥ";
    case "ΣΑΒΒΑΣ":
      return "ΣΑΒΒΑ";
    case "ΣΠΥΡΙΔΩΝ":
      return "ΣΠΥΡΙΔΩΝΑ";
    case "ΣΤΥΛΙΑΝΟΣ":
      return "ΣΤΥΛΙΑΝΟΥ";
    case "ΣΤΑΥΡΟΣ":
      return "ΣΤΑΥΡΟΥ";
    case "ΑΝΑΣΤΑΣΙΟΣ":
      return "ΑΝΑΣΤΑΣΙΟΥ";
    case "ΧΑΡΑΛΑΜΠΟΣ":
      return "ΧΑΡΑΛΑΜΠΟΥ";
    case "ΧΡΗΣΤΟΣ":
      return "ΧΡΗΣΤΟΥ";
    default:
      return name;
  }
}

function toGenitiveFemale(name) {
  switch (name) {
    case "ΑΓΓΕΛΙΚΗ":
      return "ΑΓΓΕΛΙΚΗΣ";
    case "ΑΓΑΠΗ":
      return "ΑΓΑΠΗΣ";
    case "ΑΝΑΣΤΑΣΙΑ":
      return "ΑΝΑΣΤΑΣΙΑΣ";
    case "ΑΙΚΑΤΕΡΙΝΗ":
      return "ΑΙΚΑΤΕΡΙΝΗΣ";
    case "ΑΝΝΑ":
      return "ΑΝΝΑΣ";
    case "ΑΡΕΤΗ":
      return "ΑΡΕΤΗΣ";
    case "ΑΡΙΑΔΝΗ":
      return "ΑΡΙΑΔΝΗΣ";
    case "ΒΑΣΙΛΙΚΗ":
      return "ΒΑΣΙΛΙΚΗΣ";
    case "ΔΑΝΑΗ":
      return "ΔΑΝΑΗΣ";
    case "ΔΑΦΝΗ":
      return "ΔΑΦΝΗΣ";
    case "ΔΕΣΠΟΙΝΑ":
      return "ΔΕΣΠΟΙΝΑΣ";
    case "ΔΗΜΗΤΡΑ":
      return "ΔΗΜΗΤΡΑΣ";
    case "ΕΙΡΗΝΗ":
      return "ΕΙΡΗΝΗΣ";
    case "ΕΛΕΝΗ":
      return "ΕΛΕΝΗΣ";
    case "ΕΛΕΟΝΩΡΑ":
      return "ΕΛΕΟΝΩΡΑΣ";
    case "ΕΛΕΥΘΕΡΙΑ":
      return "ΕΛΕΥΘΕΡΙΑΣ";
    case "ΕΥΑΓΓΕΛΙΑ":
      return "ΕΥΑΓΓΕΛΙΑΣ";
    case "ΕΥΡΙΔΙΚΗ":
      return "ΕΥΡΙΔΙΚΗΣ";
    case "ΓΕΩΡΓΙΑ":
      return "ΓΕΩΡΓΙΑΣ";
    case "ΘΕΟΔΩΡΑ":
      return "ΘΕΟΔΩΡΑΣ";
    case "ΙΩΑΝΝΑ":
      return "ΙΩΑΝΝΑΣ";
    case "ΙΣΜΗΝΗ":
      return "ΙΣΜΗΝΗΣ";
    case "ΚΩΣΤΑΝΤΙΝΑ":
      return "ΚΩΝΣΤΑΝΤΙΝΑΣ";
    case "ΚΑΛΛΙΟΠΗ":
      return "ΚΑΛΛΙΟΠΗΣ";
    case "ΜΑΡΓΑΡΙΤΑ":
      return "ΜΑΡΓΑΡΙΤΑΣ";
    case "ΜΑΡΙΑ":
      return "ΜΑΡΙΑΣ";
    case "ΝΙΚΟΛΕΤΑ":
      return "ΝΙΚΟΛΕΤΑΣ";
    case "ΝΑΤΑΛΙΑ":
      return "ΝΑΤΑΛΙΑΣ";
    case "ΠΑΡΑΣΚΕΥΗ":
      return "ΠΑΡΑΣΚΕΥΗΣ";
    case "ΠΑΝΑΓΙΩΤΑ":
      return "ΠΑΝΑΓΙΩΤΑΣ";
    case "ΣΟΦΙΑ":
      return "ΣΟΦΙΑΣ";
    case "ΣΤΑΥΡΟΥΛΑ":
      return "ΣΤΑΥΡΟΥΛΑΣ";
    case "ΣΤΑΜΑΤΙΑ":
      return "ΣΤΑΜΑΤΙΑΣ";
    case "ΧΑΡΙΚΛΕΙΑ":
      return "ΧΑΡΙΚΛΕΙΑΣ";
    case "ΧΑΡΟΥΛΑ":
      return "ΧΑΡΟΥΛΑΣ";
    case "ΧΡΙΣΤΙΝΑ":
      return "ΧΡΙΣΤΙΝΑΣ";
    case "ΧΡΥΣΑ":
      return "ΧΡΥΣΑΣ";
    case "ΦΩΤΕΙΝΗ":
      return "ΦΩΤΕΙΝΗΣ";
    default:
      return name;
  }
}

// Helper function to capitalize first letter of each word
function capitalize(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
// helper function to convert anakritikos to enikos
function convertAnakritikosToEnikos(value) {
  return state.anakritikoiEnikos[state.anakritikoi.indexOf(value)];
}

// helper function to shorten victim's formatted text
function shortenFormattedPerson(formattedString) {
  return formattedString.split(", με Α.Φ.Μ")[0];
}
// formatters
function formatVehicleInfo(input) {
  // Parse input text into an array of key-value pairs
  const lines = input
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line);

  const datas = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check if the current line is a key (doesn't have a value after it)
    if (!line.includes(":") && !line.includes("-") && lines[i + 1]) {
      const nextLine = lines[i + 1];
      // If the next line isn't a section header and doesn't contain special characters
      if (
        !nextLine.includes(":") &&
        !nextLine.includes("-") &&
        !nextLine.includes("Στοιχεία")
      ) {
        datas[line] = nextLine;
      }
    }
  }

  // Extract needed values with proper error handling
  const getValue = (key) => datas[key] || "";

  // Extract all required fields
  const fields = {
    licensePlate: getValue("Αρ.Κυκλοφ"),
    color: getValue("Χρώμα")?.toLowerCase() || "",
    make: getValue("Μάρκα") || "",
    model: getValue("Μοντέλο") || "",
    chassisNumber: getValue("Πλαίσιο") || "",
    engineNumber: getValue("Αρ. Κινητήρα") || "",
    usage: getValue("Χρήση") || "",
    type: getValue("Είδος") || "",
    ownerSurname: getValue("Επώνυμο") || "",
    ownerFirstName: getValue("Όνομα") || "",
    ownerFatherName: getValue("Πατρώνυμο") || "",
  };

  // Format the usage and type
  const formattedUsage =
    fields.type === "ΔΙΚΥΚΛΟ"
      ? "δίκυκλο"
      : fields.usage.match(/Ι.Χ|Δ.Χ/)
      ? `${fields.usage}.${Array.from(fields.type)[0]}`
      : fields.usage;

  // Format the output string
  return `${fields.licensePlate} ${formattedUsage} χρώματος ${
    fields.color
  }, μάρκας ${fields.make} ${fields.model}, με αριθμό πλαισίου ${
    fields.chassisNumber
  } και αριθμό κινητήρα ${fields.engineNumber} ιδιοκτησίας του ${
    fields.ownerSurname
  } ${capitalize(fields.ownerFirstName)} του ${capitalize(
    fields.ownerFatherName
  )}`;
}
function formatIdInfo(input, data, suspect = false) {
  // Parse input text into an array of lines
  if (input.trim() === "") return "";
  const lines = input
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line);

  // Create a more reliable parsing mechanism
  const datas = {};
  for (let i = 0; i < lines.length; i++) {
    const currentLine = lines[i];
    const nextLine = lines[i + 1];

    // Skip lines containing Latin translations
    if (currentLine.includes("(Λατιν.)")) continue;

    // Store the current line as a key if it has a corresponding value in the next line
    if (nextLine && !currentLine.includes("(Λατιν.)")) {
      datas[currentLine] = nextLine;
    }
  }

  // Helper functions
  const getValue = (key) => datas[key] || "";
  const formatDate = (dateStr) => (dateStr ? dateStr.split("/").join("-") : "");
  const formatIssuingAuthority = (string) => {
    const authorityText = string.split("-")[1].trim();
    const [prefix, location] = authorityText.split(" ");
    return `${prefix} ${capitalize(location)}`;
  };

  if (datas.hasOwnProperty("Α.Δ.Τ")) {
    // Extract all required fields
    const fields = {
      surname: getValue("Επώνυμο"),
      firstName: getValue("Όνομα"),
      fatherName: getValue("Όνομα Πατρός"),
      motherName: getValue("Όνομα Μητρός"),
      motherSurname: getValue("Επώνυμο Μητρός"),
      birthDate: formatDate(getValue("Ημ/νία Γέννησης")),
      birthPlace: getValue("Τόπος Γέννησης").split(" ")[0],
      area: getValue("Περιοχή"),
      region: getValue("Νομός"),
      idNumber: getValue("Α.Δ.Τ"),
      issueDate: formatDate(getValue("Ημ/νια Έκδοσης")),
      issuingAuthority: formatIssuingAuthority(getValue("Αρχή Έκδοσης")),
      phoneNumber: getValue("Τηλέφωνο"),
      street: getValue("Οδός"),
      streetNumber: getValue("Αριθμός"),
      sex: getValue("Φύλο"),
    };

    // Handle special cases
    if (fields.streetNumber === "Ταχ.Κώδικας") {
      fields.streetNumber = "--- ";
    }
    if (fields.street === "Αριθμός") {
      fields.street = " ******** ";
    }
    if (fields.phoneNumber === "Άλλα στοιχεία επικοινωνίας") {
      fields.phoneNumber = " ******** ";
    }
    if (fields.area === "Οδός") {
      fields.area = " ******** ";
    }
    if (fields.area === fields.birthPlace) {
      fields.area = "ομοίως";
    }
    if (fields.region === "Περιοχή") {
      fields.region = " ******** ";
    }
    const residence =
      fields.area === "ομοίως"
        ? fields.area
        : `${capitalize(fields.area)} ${capitalize(fields.region)}`;
    // extract the data for ypefthini dilosi usage
    suspect ? (state.ypoptosData = fields) : (state.ypefthiniData = fields);

    // Format the output string
    const formattedString = `${fields.surname} ${capitalize(
      fields.firstName
    )} του ${capitalize(
      toGenitiveMale(fields.fatherName)
    )} και της ${capitalize(toGenitiveFemale(fields.motherName))}, γεν. ${
      fields.birthDate
    } στην ${capitalize(
      fields.birthPlace
    )}, κάτοικος ${residence}, οδός ${capitalize(fields.street)} αρ. ${
      fields.streetNumber
    }, επάγγελμα ***** , κάτοχος του υπ'αριθ ${
      fields.idNumber
    } Δ.Α.Τ. εκδοθέντος ${fields.issueDate} από ${
      fields.issuingAuthority
    }, με Α.Φ.Μ ******** / Δ.Ο.Υ. ${data.doy}, χρήστης της υπ'αριθ. ${
      fields.phoneNumber
    } τηλεφωνικής σύνδεσης, email: ********`;
    return formattedString;
  } else {
    // Extract all required fields
    const fields = {
      surname: getValue("Επώνυμο"),
      firstName: getValue("Όνομα"),
      fatherName: getValue("Πατρώνυμο"),
      motherName: getValue("Μητρώνυμο"),
      motherSurname: getValue("Γένος (Μητέρας)"),
      birthDate: formatDate(getValue("Ημερομηνία Γέννησης")),
      sex: getValue("Φύλο"),
      birthPlace: getValue("Χώρα Γέννησης"),
      nationality: getValue("Υπηκοότητα(ες)"),
    };

    // extract the data for ypefthini dilosi usage
    suspect ? (state.ypoptosData = fields) : (state.ypefthiniData = fields);

    // Format the output string
    const formattedString = `(Επ)${fields.surname} (Ον.)${fields.firstName} του ${fields.fatherName} και της ${fields.motherName}, υπηκοότητα ${fields.nationality}, γεν. ${fields.birthDate} στ ${fields.birthPlace}, κάτοικος ****, οδός **** αρ. ****`;
    return formattedString;
  }
}

//notifications display
function displayNotification(text, alert = false) {
  const notifications = document.getElementById("notifications");
  const newNotification = document.createElement("div");
  newNotification.classList.add("notification");
  if (alert) {
    newNotification.classList.add("alert");
  }

  newNotification.innerHTML = text;

  newNotification.innerHTML = text;

  notifications.innerHTML = "";
  notifications.appendChild(newNotification);
  notficationPhaseOut(newNotification);
}
//notification fade away timer
const notficationPhaseOut = (notificationElement) => {
  setTimeout(() => {
    notificationElement.remove();
  }, 5000);
};

//copy to clipboard
function copyToClipboard(textToCopy) {
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
}
async function generateWord(
  ekthesi,
  replacements,
  person = state.ypefthiniData
) {
  if (!person.surname) {
    const notificationText = `Σφαλμα της ${ekthesi.title}, ελέγξτε το πεδίο παθόντα / δράστη. &cross;`;
    displayNotification(notificationText, true);
    return;
  }

  let decodedArrayBuffer = base64ToArrayBuffer(ekthesi.string);

  try {
    const modifiedDocx = await processDocument(
      decodedArrayBuffer,
      replacements
    );

    // Create a blob and download it
    const blob = new Blob([modifiedDocx], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;

    const docTitle = `${ekthesi.title}-${person.surname}`;
    const notificationText = `Κατέβηκε επιτυχώς η ${docTitle} &check;`;
    a.download = `${docTitle}.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    displayNotification(notificationText);
  } catch (error) {
    console.error("Error generating Word document:", error);
    alert("Error generating Word document: " + error.message);
  }
}
async function processDocument(arrayBuffer, replacements) {
  try {
    console.log("Processing document...");

    // Load the document using JSZip
    const zip = await JSZip.loadAsync(arrayBuffer);
    console.log("ZIP loaded successfully");

    // Find the main document content
    const documentXml = zip.file("word/document.xml");

    if (!documentXml) {
      throw new Error("Could not find document.xml in the Word file");
    }

    // Get the content
    const content = await documentXml.async("string");

    // Replace placeholders with values
    let modifiedContent = content;
    for (const [placeholder, value] of Object.entries(replacements)) {
      const regex = new RegExp(`\\{${placeholder}\\}`, "g");
      modifiedContent = modifiedContent.replace(regex, value);
    }

    // Update the document.xml file in the ZIP
    zip.file("word/document.xml", modifiedContent);
    console.log("Updated document.xml in ZIP");

    // Generate the modified ZIP file as ArrayBuffer
    const modifiedZip = await zip.generateAsync({ type: "arraybuffer" });
    console.log("Generated modified ZIP");

    return modifiedZip;
  } catch (error) {
    console.error("Error in processDocument:", error);
    throw error;
  }
}
function base64ToArrayBuffer(base64) {
  let binary = atob(base64);
  let length = binary.length;
  let buffer = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    buffer[i] = binary.charCodeAt(i);
  }
  return buffer.buffer;
}
function getDocumentBySex(sex, docKey, documents) {
  // For female, try to fetch the "Fem" variant
  if (sex === "Γυναίκα") {
    const femKey = `${docKey}Gyn`;
    if (documents[femKey]) {
      return documents[femKey];
    }
  }
  // Default: return the base key (male or fallback)
  return documents[docKey] || null;
}
