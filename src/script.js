import ektheseis from "./ektheseis.js";
import { dikografies, defaultAstynomikos, defaultData } from "./defaultData.js";
import { applyAllGrammar } from "./grammar.js";
import {
  generateWord,
  processDocument,
  displayNotification,
  copyToClipboard,
} from "./wordGenerators.js";
import {
  formatTime,
  getNextDay,
  capitalize,
  getOfficerParts,
  shortenFormattedPerson,
  formatVehicleInfo,
  formatIdInfo,
  formatFormData,
  extractPersonInfo,
  cleanSpaces,
  joinRankName,
  joinOfficerText,
  splitOfficerText,
  getAstynomikosParts,
  getSuspectSurname,
} from "./formatters.js";
import {
  getData,
  getState,
  getAnakritikoiSelection,
  saveData,
  initTheme,
  initNavMenu,
} from "./stateManager.js";
import { initTourGuide } from "./tourGuide.js";

let today = new Date();

let data = getData();
let state = getState(data, today);

function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}

function isArrestDocument(fileName) {
  const normalized = fileName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // strip combining diacritics (e.g. tonos)
  return normalized.includes("συλληψ");
}

async function handleDocxUpload(event) {
  const files = event.target.files;
  if (!files.length) return;

  const sortedFiles = Array.from(files).sort((a, b) =>
    a.name.localeCompare(b.name, "el"),
  );

  const data = getData();
  const dataSource = document.getElementById("docx-replacement-source").value;
  const personData =
    dataSource === "victimData" ? state.victimData : state.ypoptosData;
  Object.assign(state, { ...personData });
  const missingPerson = !personData.surname;
  const surnameSuffix = missingPerson ? "" : `-${personData.surname}`;

  applyAllGrammar(state);

  for (const file of sortedFiles) {
    try {
      state.initial = constructInitialText();
      state.timeStart = formatTime(today, state.timePassed);
      state.timeEnd = formatTime(
        today,
        data.xronosPeratosis + state.timePassed,
      );
      if (isArrestDocument(file.name)) {
        state.arrestTime = formatTime(today, state.timePassed - 5);
      }

      const arrayBuffer = await readFileAsArrayBuffer(file);

      const modifiedDocx = await processDocument(arrayBuffer, state);
      const blob = new Blob([modifiedDocx], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const originalName = file.name.replace(".docx", "");
      a.download = `${originalName}${surnameSuffix}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      state.timePassed += data.xronosPeratosis * 2;

      const notificationText = `Κατέβηκε επιτυχώς το ${originalName}${surnameSuffix}.docx`;
      displayNotification(notificationText);
    } catch (error) {
      console.error("Error processing document:", error);
      displayNotification(`Σφάλμα στο ${file.name}: ${error.message}`, "error");
    }
  }

  if (missingPerson) {
    const docText =
      sortedFiles.length === 1 ? "Το έγγραφο κατέβηκε" : "Τα έγγραφα κατέβηκαν";
    const notificationText = `Προσοχή: ${docText} χωρίς στοιχεία ${dataSource === "victimData" ? "παθόντα" : "δράστη"}.`;
    displayNotification(notificationText, "warning");
  }

  event.target.value = "";
}

initTheme();
initNavMenu();

const anakritikosSelect = document.querySelector("#anakritikos");
const bAnakritikosSelect = document.querySelector("#anakritikos-b");

const paintSelectMenus = () => {
  anakritikosSelect.innerHTML = "";
  bAnakritikosSelect.innerHTML = "";
  const selectA = getAnakritikoiSelection().aAnakr;
  const selectB = getAnakritikoiSelection().bAnakr;

  state.anakritikoi.forEach((anakritikos, index) => {
    const optionText = getOfficerParts(state, index).nameNom;

    // Populate a anakr select
    const anakr = document.createElement("option");
    anakr.value = anakritikos;
    anakr.textContent = optionText;
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
    bAnakr.textContent = optionText;
    bAnakr.setAttribute("data-sex", sex);

    if (index === selectB) {
      bAnakr.setAttribute("selected", "");
    }
    bAnakritikosSelect.appendChild(bAnakr);
  });
};
paintSelectMenus();

// Nominative rank/name of the selected A officer, for the document templates
function applySelectedOfficer() {
  const { rankNom, nameNom } = getOfficerParts(
    state,
    anakritikosSelect.selectedIndex,
  );
  state.rank = rankNom;
  state.anakritikosName = nameNom;
  state.anakritikos = `${rankNom} ${nameNom}`.trim();
}

const initialText = document.getElementById("initial");

function constructInitialText() {
  const arthro = state.arthro ? capitalize(state.arthro) : "Στην";
  // Access the data-sex attribute of the currently SELECTED option
  const sexA = anakritikosSelect.selectedOptions[0].dataset.sex;
  const sexB = bAnakritikosSelect.selectedOptions[0].dataset.sex;

  const arthroAnakrA = sexA === "Γυναίκα" ? "της" : "του";
  const arthroAnakrB = sexB === "Γυναίκα" ? "της" : "του";
  const paristameniB = sexB === "Γυναίκα" ? "παρισταμένης" : "παρισταμένου";

  return `${arthro} ${state.merosSyntaksisEkthesis} σήμερα την ${
    state.day
  }η του μήνα ${state.month} του έτους ${state.year} ημέρα ${
    state.dayName
  } και ώρα ${formatTime(
    today,
    state.timePassed,
  )} ενώπιον εμού, ${arthroAnakrA} ${anakritikosSelect.value} του ${
    data.ypiresia
  }, ${paristameniB} και ${arthroAnakrB} ${bAnakritikosSelect.value} `;
}

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
  state.victimData = data;
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
  'input[name="apodexetai"]',
);

function updateVariables() {
  const selected = document.querySelector(
    'input[name="apodexetai"]:checked',
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
  applySelectedOfficer();
  let anakritikoiSelections = JSON.parse(localStorage.getItem("anakr")) || {};
  anakritikoiSelections.aAnakr = e.target.selectedIndex;
  state.aAnakrSex = e.target.selectedOptions[0].dataset.sex;

  localStorage.setItem("anakr", JSON.stringify(anakritikoiSelections));
});

bAnakritikosSelect.addEventListener("change", (e) => {
  initialText.textContent = constructInitialText();
  const anakritikoiSelections = JSON.parse(localStorage.getItem("anakr")) || {};
  anakritikoiSelections.bAnakr = e.target.selectedIndex;
  state.bAnakrSex = e.target.selectedOptions[0].dataset.sex;
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

// officer fields: rank + name inputs and a details textarea, joined into the
// single paragraph stored in astynomikoi and used by {astynomikos}
const astynomikosRank = document.getElementById("astynomikos-rank");
const astynomikosName = document.getElementById("astynomikos-name");
const clipboardAstynomikos = document.querySelector(
  ".clipboard-id-astynomikos",
);
const astynomikosSelect = document.getElementById("astynomikoi");
const defaultAstynomikosDetails = splitOfficerText(defaultAstynomikos).details;

function readAstynomikosFields() {
  return {
    rank: cleanSpaces(astynomikosRank.value),
    name: cleanSpaces(astynomikosName.value),
    details: cleanSpaces(clipboardAstynomikos.value),
  };
}

function fillAstynomikosFields({ rank, name, details }) {
  astynomikosRank.value = rank || "";
  astynomikosName.value = name || "";
  clipboardAstynomikos.value = details || "";
  state.astynomikos = joinOfficerText(readAstynomikosFields());
}

function resetAstynomikosFields() {
  fillAstynomikosFields({ details: defaultAstynomikosDetails });
}

// Short form for arrest/seizure documents, e.g. "Υ/Α ΠΑΠΑΣ Γεώργιος"
function astynomikosShort() {
  const { rank, name } = readAstynomikosFields();
  return joinRankName(rank, name);
}

// Parts for every saved officer, normalising legacy text-only entries so the
// two arrays stay aligned before they are modified
function allAstynomikoiParts() {
  return state.astynomikoi.map((_, i) => getAstynomikosParts(state, i));
}

resetAstynomikosFields();

[astynomikosRank, astynomikosName, clipboardAstynomikos].forEach((field) =>
  field.addEventListener("input", () => {
    state.astynomikos = joinOfficerText(readAstynomikosFields());
  }),
);

// Pasting a whole paragraph over the details, with rank and name still empty,
// splits it into the three fields
clipboardAstynomikos.addEventListener("paste", (e) => {
  const pasted = e.clipboardData.getData("text");
  const replacesAll =
    clipboardAstynomikos.selectionStart === 0 &&
    clipboardAstynomikos.selectionEnd === clipboardAstynomikos.value.length;
  if (
    astynomikosRank.value.trim() ||
    astynomikosName.value.trim() ||
    !replacesAll ||
    !pasted.includes(",")
  ) {
    return;
  }
  e.preventDefault();
  fillAstynomikosFields(splitOfficerText(pasted));
  displayNotification(
    "Το κείμενο χωρίστηκε σε βαθμό, ονοματεπώνυμο και στοιχεία. Ελέγξτε τα πεδία.",
  );
});

//save officer button
const storeOfficerBtn = document.querySelector(".save-astynomikos");
storeOfficerBtn.addEventListener("click", () => {
  const parts = readAstynomikosFields();
  if (!parts.rank || !parts.name) {
    displayNotification(
      "Συμπληρώστε βαθμό και ονοματεπώνυμο αστυνομικού.",
      "error",
    );
    return;
  }
  const localStorageData = getData();
  const selectedValue = astynomikosSelect.value;
  const astynomikoiParts = allAstynomikoiParts();
  const text = joinOfficerText(parts);
  state.astynomikos = text;

  if (selectedValue === "placeholder") {
    // Add a new officer to the end of the list
    state.astynomikoi.push(text);
    astynomikoiParts.push(parts);
  } else {
    // Replace the officer at the selected index
    const index = parseInt(selectedValue);
    state.astynomikoi[index] = text;
    astynomikoiParts[index] = parts;
  }
  state.astynomikoiParts = astynomikoiParts;

  saveData(localStorageData, {
    astynomikoi: state.astynomikoi,
    astynomikoiParts: astynomikoiParts,
  });

  // Re-draw the menu to reflect changes
  paintAstynomikosSelect();

  //Keep the selection (a new officer becomes the last entry)
  astynomikosSelect.value =
    selectedValue === "placeholder"
      ? String(state.astynomikoi.length - 1)
      : selectedValue;
});

astynomikosSelect.addEventListener("change", (e) => {
  if (e.target.value === "placeholder") {
    resetAstynomikosFields();
    return;
  }
  fillAstynomikosFields(getAstynomikosParts(state, parseInt(e.target.value)));
});
function paintAstynomikosSelect() {
  // Clear all options but the first:
  const firstOption = astynomikosSelect.firstElementChild;
  astynomikosSelect.innerHTML = "";
  astynomikosSelect.appendChild(firstOption);
  if (state.astynomikoi) {
    state.astynomikoi.forEach((_, index) => {
      const { rank, name } = getAstynomikosParts(state, index);
      const astynomikosOption = document.createElement("option");
      astynomikosOption.value = index;
      astynomikosOption.innerText = joinRankName(rank, name);
      astynomikosSelect.appendChild(astynomikosOption);
    });
  }
}
// call it to draw the select on page load
paintAstynomikosSelect();

const deleteBtn = document.querySelector("#astynomikos-delete");

deleteBtn.addEventListener("click", () => {
  const index = astynomikosSelect.value;

  if (index !== "placeholder") {
    // Remove from the local arrays
    const astynomikoiParts = allAstynomikoiParts();
    state.astynomikoi.splice(parseInt(index), 1);
    astynomikoiParts.splice(parseInt(index), 1);
    state.astynomikoiParts = astynomikoiParts;

    // Save the updated list back to localStorage
    const localStorageData = getData();
    saveData(localStorageData, {
      astynomikoi: state.astynomikoi,
      astynomikoiParts: astynomikoiParts,
    });

    // Re-draw the select menu so the name disappears
    paintAstynomikosSelect();
    resetAstynomikosFields();

    displayNotification("Ο αστυνομικός διαγράφηκε.");
  } else {
    displayNotification("Παρακαλώ επιλέξτε έναν αστυνομικό πρώτα.", "error");
  }
});

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
    true,
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

function paintSuspectSelect() {
  const suspectSelect = document.getElementById("suspects");
  // Clear all options but the first:
  const firstOption = suspectSelect.firstElementChild;
  suspectSelect.innerHTML = "";
  suspectSelect.appendChild(firstOption);
  if (state.suspects) {
    state.suspects.forEach((value, index) => {
      const suspectOption = document.createElement("option");
      suspectOption.value = index;
      suspectOption.innerText = getSuspectSurname(value.string);
      suspectSelect.appendChild(suspectOption);
    });
  }
}
const addSuspect = document.getElementById("add-suspect");
addSuspect.addEventListener("click", () => {
  // adds the current suspect to the list
  const suspect = { string: state.suspect, data: state.ypoptosData };
  state.suspects.push(suspect);
  // clears the input fields
  document.getElementById("person-ypoptos-clear").click();
  // re-paints the suspect menu
  paintSuspectSelect();
});

// suspect select menu functionality
const suspectSelectMenu = document.getElementById("suspects");
suspectSelectMenu.addEventListener("change", (e) => {
  const clipboardSuspect = document.querySelector(".clipboard-id-ypoptos");

  if (e.target.value === "placeholder") {
    // clear values

    document.getElementById("person-ypoptos-clear").click();
    return;
  }
  const index = parseInt(e.target.value);
  clipboardSuspect.value = state.suspects[index].string;
  state.suspect = state.suspects[index].string;
  state.ypoptosData = state.suspects[index].data;
});

// delete suspect btn
const suspectDelBtn = document.querySelector("#remove-suspect");

suspectDelBtn.addEventListener("click", () => {
  const select = document.getElementById("suspects");
  const index = select.value;

  if (index !== "placeholder") {
    // Remove from the local array
    state.suspects.splice(parseInt(index), 1);

    // Re-draw the select menu so the name disappears
    paintSuspectSelect();
    //clear values
    document.getElementById("person-ypoptos-clear").click();

    displayNotification("Ο δράστης διαγράφηκε.");
  } else {
    displayNotification("Παρακαλώ επιλέξτε έναν δράστη πρώτα.", "error");
  }
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

//astynomikos help / modal

const astynomikosDialog = document.getElementById("astynomikos-dialog");
const astynomikosHelp = document.getElementById("astynomikos-help");
const astynomikosClose = document.getElementById("astynomikos-close");

astynomikosHelp.addEventListener("click", () => {
  astynomikosDialog.showModal();
});
astynomikosClose.addEventListener("click", () => {
  astynomikosDialog.close();
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
// tour guide button / modal
initTourGuide();
//patch note button
const patchDialog = document.getElementById("patch-dialog");
const patchHelp = document.getElementById("patch-help");
const patchClose = document.getElementById("patch-close");

patchHelp.addEventListener("click", () => {
  patchDialog.showModal();
});
// docx import help button
const docxDialog = document.getElementById("docx-dialog");
const docxHelp = document.getElementById("docx-help");
const docxClose = document.getElementById("docx-close");

docxHelp.addEventListener("click", () => {
  docxDialog.showModal();
});
docxClose.addEventListener("click", () => {
  docxDialog.close();
});

const keywordsLink = document.getElementById("keywords-link");
const keywordsDialog = document.getElementById("keywords-dialog");
const keywordsClose = document.getElementById("keywords-close");

keywordsLink.addEventListener("click", (e) => {
  e.preventDefault();
  docxDialog.close();
  keywordsDialog.showModal();
});

keywordsClose.addEventListener("click", () => {
  keywordsDialog.close();
  docxDialog.showModal();
});

document
  .getElementById("download-martyra-sample")
  .addEventListener("click", () => {
    generateWord(ektheseis.martyraSample, {}, { surname: "ΔΕΙΓΜΑ" });
  });

document
  .getElementById("download-martyra-full")
  .addEventListener("click", () => {
    generateWord(ektheseis.martyra, {}, { surname: "ΔΕΙΓΜΑ" });
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
  state.victimData = {};
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
  applyAllGrammar(state);
  generateWord(ektheseis.martyra, state, state.victimData);
});
//martyra me dierminea button
const martyraDierm = document.getElementById("martyraDierm");
martyraDierm.addEventListener("click", () => {
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);
  applyAllGrammar(state);
  generateWord(ektheseis.martyraDierm, state, state.victimData);
});
//martyra astyn button
const martyraAstynomikos = document.getElementById("martyra-astynomikos");
martyraAstynomikos.addEventListener("click", () => {
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);
  applyAllGrammar(state);

  const officerName = readAstynomikosFields().name;
  if (!officerName) {
    displayNotification("Συμπληρώστε ονοματεπώνυμο αστυνομικού.", "error");
    return;
  }
  const astynomikosData = { surname: officerName.split(" ")[0] };
  generateWord(ektheseis.astynomikos, state, astynomikosData);
});

// martyraXorisOrko button
const martyraXoris = document.getElementById("martyraXoris");
martyraXoris.addEventListener("click", () => {
  state.timePassed += data.xronosPeratosis * 2;
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);
  applyAllGrammar(state);
  generateWord(ektheseis.martyraXoris, state, state.victimData);
});

//syllipsi button
const syllipsi = document.getElementById("syllipsi");
syllipsi.addEventListener("click", () => {
  state.timePassed += data.xronosPeratosis * 2;
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);
  state.arrestTime = formatTime(today, state.timePassed - 5);
  state.astynomShort = astynomikosShort();
  applyAllGrammar(state);

  generateWord(ektheseis.syllipsi, state, state.ypoptosData);
});
// anomoti button
const anomoti = document.getElementById("anomoti");
anomoti.addEventListener("click", () => {
  state.timePassed += data.xronosPeratosis * 2;
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);
  applyAllGrammar(state);
  generateWord(ektheseis.anomoti, state, state.ypoptosData);
});

// katigoroumenou button
const katigoroumenou = document.getElementById("katigoroumenou");
katigoroumenou.addEventListener("click", () => {
  state.timePassed += data.xronosPeratosis * 2;
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);
  applyAllGrammar(state);
  generateWord(ektheseis.katigoroumenou, state, state.ypoptosData);
});

// katigoroumenou me dierminea button
const katigoroumenouDierm = document.getElementById("katigoroumenouDierm");
katigoroumenouDierm.addEventListener("click", () => {
  state.timePassed += data.xronosPeratosis * 2;
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);
  state.ypiresia = state.ypiresia?.toUpperCase();
  applyAllGrammar(state);
  generateWord(ektheseis.katigoroumenouDierm, state, state.ypoptosData);
});

//apodosi button
const apodosi = document.getElementById("apodosi");
apodosi.addEventListener("click", () => {
  state.timePassed += data.xronosPeratosis * 2;
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);
  state.astynomShort = astynomikosShort();
  applyAllGrammar(state);

  generateWord(ektheseis.apodosi, state, state.victimData);
});
// katasxesi button
const katasxesi = document.getElementById("katasxesi");
katasxesi.addEventListener("click", () => {
  state.timePassed += data.xronosPeratosis * 2;
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);
  state.astynomShort = astynomikosShort();
  applyAllGrammar(state);

  generateWord(ektheseis.katasxesi, state, state.victimData);
});

// gnostopoiisi button
const gnostopoiisi = document.getElementById("gnostopoiisi");
gnostopoiisi.addEventListener("click", () => {
  state.timePassed += data.xronosPeratosis * 2;
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);
  applyAllGrammar(state);

  generateWord(ektheseis.gnostopoiisi, state, state.ypoptosData);
});

// egxeirisis button  printEgxeirisis(initial, person)
const egxeirisis = document.getElementById("egxeirisis");
egxeirisis.addEventListener("click", () => {
  state.timePassed += data.xronosPeratosis * 2;
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);
  applyAllGrammar(state);
  generateWord(ektheseis.egxeirisis, state, state.victimData);
});

// gnostopoiisiNarkwtikwn button
const gnostopoiisiNarkwtikwn = document.getElementById(
  "gnostopoiisiNarkwtikwn",
);
gnostopoiisiNarkwtikwn.addEventListener("click", () => {
  state.timePassed += data.xronosPeratosis * 2;
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);
  applyAllGrammar(state);

  generateWord(ektheseis.gnostopoiisiNarkwtikwn, state, state.ypoptosData);
});

// praktikoZygisis button
const praktikoZygisis = document.getElementById("praktikoZygisis");
praktikoZygisis.addEventListener("click", () => {
  state.timePassed += data.xronosPeratosis * 2;
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);
  applyAllGrammar(state);
  generateWord(ektheseis.praktikoZygisis, state, state.ypoptosData);
});
// ypiresiako button
const ypiresiako = document.getElementById("ypiresiako");
ypiresiako.addEventListener("click", () => {
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  applySelectedOfficer();
  state.ypiresia = state.ypiresia.toUpperCase();
  state.dAstynomias = state.dAstynomias.toUpperCase();
  state.geniki = state.geniki.toUpperCase();
  state.victim = shortenFormattedPerson(state.victim);
  generateWord(ektheseis.ypiresiako, state, state.victimData);
});
// ypefthini button
const ypefthini = document.getElementById("ypefthini");
ypefthini.addEventListener("click", () => {
  Object.assign(state, { ...state.victimData });
  applySelectedOfficer();
  generateWord(ektheseis.ypefthini, state, state.victimData);
});

// deltio drasti button
const ypoptoy = document.getElementById("ypoptoy");
ypoptoy.addEventListener("click", () => {
  applySelectedOfficer();
  Object.assign(state, { ...state.ypoptosData });
  generateWord(ektheseis.deltioYpoptou, state, state.ypoptosData);
});

//deltio feromenou button
const feromenou = document.getElementById("feromenou");
feromenou.addEventListener("click", () => {
  applySelectedOfficer();
  Object.assign(state, { ...state.ypoptosData });
  state.timeStart = formatTime(today, state.timePassed);
  state.man = " ";
  state.woman = " ";
  state.sex == "Γυναίκα" ? (state.woman = "X") : (state.man = "X");
  state.isuYear = state.issueDate.split("-")[2];
  state.issuingAuthority = state.issuingAuthority.toUpperCase();
  state.merosSyntaksisEkthesis = state.merosSyntaksisEkthesis.toUpperCase();
  state.ypiresia = state.ypiresia.toUpperCase();
  generateWord(ektheseis.feromenou, state, state.ypoptosData);
});

/// ENDOOIKOGENIAKI

//martyra astyn endo button
const martyraEndooik = document.getElementById("martyra-endooik");
martyraEndooik.addEventListener("click", () => {
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.endoTimeStart = state.timeStart;
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);
  applyAllGrammar(state);
  generateWord(ektheseis.astynomikosEndooik, state, state.victimData);
});
// thyma endooik button
const thymaEndooik = document.getElementById("thyma-endooik");
thymaEndooik.addEventListener("click", () => {
  state.timePassed += data.xronosPeratosis * 2;
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.autoforoTimeStart = state.timeStart;
  state.endoStartTime = state.timeStart;
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);
  applyAllGrammar(state);
  generateWord(ektheseis.martyraXorisEndooik, state, state.victimData);
});

// drastis -apologia -katigoroumenos endooik button
const drastisEndooik = document.getElementById("drastis-endooik");
drastisEndooik.addEventListener("click", () => {
  state.timePassed += data.xronosPeratosis * 2;
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);
  applyAllGrammar(state);
  generateWord(ektheseis.katigoroumenouEndooik, state, state.ypoptosData);
});
// iatrodikastiki button
const iatrodikastiki = document.getElementById("iatrodikastiki-endooik");
iatrodikastiki.addEventListener("click", () => {
  state.timePassed += data.xronosPeratosis * 2;
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);
  applySelectedOfficer();
  state.ypiresia = state.ypiresia.toUpperCase();
  applyAllGrammar(state);
  generateWord(ektheseis.iatrodikastiki, state, state.ypoptosData);
});
const panicYes = document.getElementById("panicYes");
panicYes.addEventListener("click", () => {
  state.timePassed += data.xronosPeratosis * 2;
  state.ypiresia = state.ypiresia.toUpperCase();
  state.panicButton = "";
  state.timeStart = formatTime(today, state.timePassed);
  applyAllGrammar(state);

  generateWord(ektheseis.panicButtonYes, state, state.victimData);
});
const panicNo = document.getElementById("panicNo");
panicNo.addEventListener("click", () => {
  state.timePassed += data.xronosPeratosis * 2;
  state.ypiresia = state.ypiresia.toUpperCase();
  state.timeStart = formatTime(today, state.timePassed);
  state.panicButton = "δεν";
  applyAllGrammar(state);

  generateWord(ektheseis.panicButtonNo, state, state.victimData);
});
//domi button
const domi = document.getElementById("domi");
domi.addEventListener("click", () => {
  applyAllGrammar(state);

  generateWord(ektheseis.domi, state, state.victimData);
});

//afairesi button
const afairesi = document.getElementById("afairesi");
afairesi.addEventListener("click", () => {
  state.timePassed += data.xronosPeratosis * 2;
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);

  applyAllGrammar(state);

  generateWord(ektheseis.afairesi, state, state.ypoptosData);
});
// katasxesiEndo button
const katasxesiEndo = document.getElementById("katasxesiEndo");
katasxesiEndo.addEventListener("click", () => {
  state.timePassed += data.xronosPeratosis * 2;
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);
  state.astynomShort = astynomikosShort();
  applyAllGrammar(state);

  generateWord(ektheseis.katasxesiEndo, state, state.victimData);
});

//syllipsi button
const syllipsiEndo = document.getElementById("syllipsiEndo");
syllipsiEndo.addEventListener("click", () => {
  state.timePassed += data.xronosPeratosis * 2;
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);
  state.arrestTime = formatTime(today, state.timePassed - 5);
  state.astynomShort = astynomikosShort();
  applyAllGrammar(state);

  generateWord(ektheseis.syllipsiEndo, state, state.ypoptosData);
});

// deltio drasti Endo button
const ypoptoyEndo = document.getElementById("ypoptoyEndo");
ypoptoyEndo.addEventListener("click", () => {
  applySelectedOfficer();
  Object.assign(state, { ...state.ypoptosData });
  generateWord(ektheseis.deltioYpoptouEndo, state, state.ypoptosData);
});
//ypovlitiki button
const ypovoliEndo = document.getElementById("ypovoliEndo");
ypovoliEndo.addEventListener("click", () => {
  Object.assign(state, { ...state.victimData });
  state.nextDay = getNextDay(state.formattedDate);

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
    'input[name="iatrodik"]:checked',
  ).value;
  state.oplo = document.querySelector('input[name="oplo"]:checked').value;
  state.ypotropos = document.querySelector(
    'input[name="ypotropos"]:checked',
  ).value;
  applySelectedOfficer();
  state.ypiresia = state.ypiresia?.toUpperCase();
  state.eisaggeleiaProtodikon = state.eisaggeleiaProtodikon.toUpperCase();
  applyAllGrammar(state);

  generateWord(ektheseis.ypovoliEndo, state, state.victimData);
});
//ypovlitiki button
const apostoliEndo = document.getElementById("apostoliEndo");
apostoliEndo.addEventListener("click", () => {
  Object.assign(state, { ...state.victimData });
  state.nextDay = getNextDay(state.formattedDate);

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
    'input[name="iatrodik"]:checked',
  ).value;
  state.oplo = document.querySelector('input[name="oplo"]:checked').value;
  state.ypotropos = document.querySelector(
    'input[name="ypotropos"]:checked',
  ).value;
  applySelectedOfficer();
  state.ypiresia = state.ypiresia?.toUpperCase();
  state.eisaggeleiaProtodikon = state.eisaggeleiaProtodikon.toUpperCase();
  applyAllGrammar(state);

  generateWord(ektheseis.apostoliEndo, state, state.victimData);
});

// Γ.Ε.Ε. button
const simansi = document.getElementById("simansi");
simansi.addEventListener("click", () => {
  applySelectedOfficer();
  Object.assign(state, { ...state.ypoptosData });
  applyAllGrammar(state);
  generateWord(ektheseis.simansi, state, state.ypoptosData);
});

// ΒΑΣ button
const vasEndo = document.getElementById("vasEndo");
vasEndo.addEventListener("click", () => {
  state.nextDay = getNextDay(state.formattedDate);

  state.dioksi = document.querySelector('input[name="dioksi"]:checked').value;
  state.iatrodik = document.querySelector(
    'input[name="iatrodik"]:checked',
  ).value;
  state.oplo = document.querySelector('input[name="oplo"]:checked').value;
  state.ypotropos = document.querySelector(
    'input[name="ypotropos"]:checked',
  ).value;
  applyAllGrammar(state);

  generateWord(ektheseis.vasEndo, state, state.ypoptosData);
});

// new IDs btn
const a130 = document.getElementById("a130");
a130.addEventListener("click", () => {
  Object.assign(state, { ...state.victimData });
  state.n = document.getElementById("n").value;
  state.newId = document.getElementById("newId").value;
  state.newIdAppDate = document.getElementById("newIdAppDate").value;
  applySelectedOfficer();
  state.ypiresia = state.ypiresia?.toUpperCase();
  state.issuingAuthority = state.issuingAuthority?.toUpperCase();
  generateWord(ektheseis.a130, state, state.victimData);
});

// ypefthiniDAT button
const ypefthiniDAT = document.getElementById("ypefthiniDAT");

ypefthiniDAT.addEventListener("click", () => {
  Object.assign(state, { ...state.victimData });
  state.idNumber1 = state.idNumber;
  generateWord(ektheseis.ypefthiniDAT, state, state.victimData);
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

document
  .getElementById("docx-file-input")
  .addEventListener("change", handleDocxUpload);

//PATCH NOTES EFFECT
// Check if latest patch note is within 2 weeks
const patchDateText = document.querySelector("#patch-dialog u").textContent;
const dateMatch = patchDateText.match(/Αλλαγές (\d{2})-(\d{2})-(\d{4})/);
if (dateMatch) {
  const patchDate = new Date(dateMatch[3], dateMatch[2] - 1, dateMatch[1]);
  const today = new Date();
  const diffDays = Math.floor((today - patchDate) / (1000 * 60 * 60 * 24));

  if (diffDays <= 14) {
    const whatsNewBtn = document.getElementById("patch-help");
    whatsNewBtn.classList.add("glow-new");

    // Remove animation after 15 seconds
    setTimeout(() => {
      whatsNewBtn.classList.remove("glow-new");
    }, 15000);
  }
}

// Sketcher badge: same glow treatment as patch notes ("BETA" instead of
// "ΝΕΟ"), but permanent — never removed, unlike the patch-notes glow.
const sketcherLink = document.getElementById("sketcher-link");
if (sketcherLink) {
  sketcherLink.classList.add("glow-new", "glow-beta");
}
