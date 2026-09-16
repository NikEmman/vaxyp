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

  applyAstynomikosShort();
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
  refreshInitialText();
  renderStatus();
}

initTheme();
initNavMenu();

// Help dropdown in the header (on narrow screens its items are listed inline)
const helpMenu = document.getElementById("help-menu");
const helpMenuToggle = document.getElementById("help-menu-toggle");

function setHelpMenuOpen(open) {
  helpMenu.classList.toggle("open", open);
  helpMenuToggle.setAttribute("aria-expanded", String(open));
}
helpMenuToggle.addEventListener("click", (e) => {
  e.stopPropagation();
  setHelpMenuOpen(!helpMenu.classList.contains("open"));
});
document.getElementById("help-menu-list").addEventListener("click", (e) => {
  if (e.target.closest("button")) setHelpMenuOpen(false);
});
document.addEventListener("click", (e) => {
  if (!helpMenu.contains(e.target)) setHelpMenuOpen(false);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") setHelpMenuOpen(false);
});

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
const timeOffset = document.getElementById("time-offset");

// The text is cut to one line to save space; clicking shows all of it
initialText.addEventListener("click", () => {
  initialText.classList.toggle("expanded");
});

// The top text shows the time of the latest report, so it has to follow every
// download, not only investigator changes
function refreshInitialText() {
  initialText.textContent = constructInitialText();
  timeOffset.textContent = state.timePassed > 0 ? `+${state.timePassed}′` : "";
}

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
    renderStatus();
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
  document.getElementById("victims").value = "placeholder";
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
    document.getElementById("suspects").value = "placeholder";
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
refreshInitialText();

// Update text when anakritikos selections change
anakritikosSelect.addEventListener("change", (e) => {
  refreshInitialText();
  applySelectedOfficer();
  let anakritikoiSelections = JSON.parse(localStorage.getItem("anakr")) || {};
  anakritikoiSelections.aAnakr = e.target.selectedIndex;
  state.aAnakrSex = e.target.selectedOptions[0].dataset.sex;

  localStorage.setItem("anakr", JSON.stringify(anakritikoiSelections));
});

bAnakritikosSelect.addEventListener("change", (e) => {
  refreshInitialText();
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
  refreshInitialText();
  document
    .querySelectorAll("[data-done]")
    .forEach((button) => delete button.dataset.done);
  renderStatus();
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
  // a new paste is a new person, not the one picked from the list
  document.getElementById("victims").value = "placeholder";
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
const astynomikosSex = document.getElementById("astynomikos-sex");
const astynomikosAit = document.getElementById("astynomikos-ait");
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
    sex: astynomikosSex.value,
    nameAit: cleanSpaces(astynomikosAit.value),
  };
}

function syncAstynomikosState() {
  state.astynomikos = joinOfficerText(readAstynomikosFields());
  state.astynomikosSex = astynomikosSex.value;
}

// sex defaults to male for officers saved before it existed
function fillAstynomikosFields({ rank, name, details, sex, nameAit }) {
  astynomikosRank.value = rank || "";
  astynomikosName.value = name || "";
  clipboardAstynomikos.value = details || "";
  astynomikosSex.value = sex || "Άντρας";
  astynomikosAit.value = nameAit || "";
  syncAstynomikosState();
}

function resetAstynomikosFields() {
  fillAstynomikosFields({ details: defaultAstynomikosDetails });
}

// Short form for arrest/seizure documents, e.g. "Υ/Α ΠΑΠΑΣ Γεώργιος"
function astynomikosShort() {
  const { rank, name } = readAstynomikosFields();
  return joinRankName(rank, name);
}

// Short forms used by the arrest/seizure templates and custom templates:
// {astynomShort} nominative, {astynomShortAit} accusative or nominative fallback
function applyAstynomikosShort() {
  state.astynomShort = astynomikosShort();
  state.astynomShortAit = readAstynomikosFields().nameAit || state.astynomShort;
}

// Parts for every saved officer, normalising legacy text-only entries so the
// two arrays stay aligned before they are modified
function allAstynomikoiParts() {
  return state.astynomikoi.map((_, i) => getAstynomikosParts(state, i));
}

resetAstynomikosFields();

// The officer fields are rarely edited, so they stay collapsed until needed
const astynomikosBody = document.getElementById("astynomikos-body");
const astynomikosToggle = document.getElementById("astynomikos-toggle");

function setAstynomikosExpanded(open) {
  astynomikosBody.classList.toggle("hidden", !open);
  astynomikosToggle.setAttribute("aria-expanded", String(open));
}
astynomikosToggle.addEventListener("click", () => {
  setAstynomikosExpanded(astynomikosBody.classList.contains("hidden"));
});

[astynomikosRank, astynomikosName, clipboardAstynomikos, astynomikosAit].forEach(
  (field) => field.addEventListener("input", syncAstynomikosState),
);
astynomikosSex.addEventListener("change", syncAstynomikosState);

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
  const { sex, nameAit } = readAstynomikosFields();
  fillAstynomikosFields({ ...splitOfficerText(pasted), sex, nameAit });
  displayNotification(
    "Το κείμενο χωρίστηκε σε βαθμό, ονοματεπώνυμο και στοιχεία. Ελέγξτε τα πεδία.",
  );
});

//save officer button
const storeOfficerBtn = document.querySelector(".save-astynomikos");

// Saving a selected officer overwrites it, so the button says so
function updateOfficerSaveLabel() {
  storeOfficerBtn.textContent =
    astynomikosSelect.value === "placeholder" ? "Αποθήκευση" : "Ενημέρωση";
}
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
  updateOfficerSaveLabel();
});

astynomikosSelect.addEventListener("change", (e) => {
  updateOfficerSaveLabel();
  if (e.target.value === "placeholder") {
    resetAstynomikosFields();
    setAstynomikosExpanded(true);
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
    updateOfficerSaveLabel();

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
  document.getElementById("suspects").value = "placeholder";
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
  if (!state.suspect) {
    displayNotification("Δεν υπάρχει δράστης για προσθήκη.", "error");
    return;
  }
  const suspect = { string: state.suspect, data: state.ypoptosData };
  state.suspects.push(suspect);
  paintSuspectSelect();
  // the added suspect stays active, selected in the menu
  document.getElementById("suspects").value = String(state.suspects.length - 1);
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

function paintVictimSelect() {
  const victimsSelectEl = document.getElementById("victims");
  // Clear all options but the first:
  const firstOption = victimsSelectEl.firstElementChild;
  victimsSelectEl.innerHTML = "";
  victimsSelectEl.appendChild(firstOption);
  if (state.victims) {
    state.victims.forEach((value, index) => {
      const victimOption = document.createElement("option");
      victimOption.value = index;
      victimOption.innerText = getSuspectSurname(value.string);
      victimsSelectEl.appendChild(victimOption);
    });
  }
}
const addVictim = document.getElementById("add-victim");
addVictim.addEventListener("click", () => {
  if (!state.victim) {
    displayNotification("Δεν υπάρχει παθών για προσθήκη.", "error");
    return;
  }
  const victim = { string: state.victim, data: state.victimData };
  state.victims.push(victim);
  paintVictimSelect();
  // the added victim stays active, selected in the menu
  document.getElementById("victims").value = String(state.victims.length - 1);
});

// victim select menu functionality
const victimSelectMenu = document.getElementById("victims");
victimSelectMenu.addEventListener("change", (e) => {
  if (e.target.value === "placeholder") {
    // clear values
    document.getElementById("person-clear").click();
    return;
  }
  const index = parseInt(e.target.value);
  clipboardId.value = state.victims[index].string;
  state.victim = state.victims[index].string;
  state.victimData = state.victims[index].data;
});

// delete victim btn
const victimDelBtn = document.querySelector("#remove-victim");

victimDelBtn.addEventListener("click", () => {
  const select = document.getElementById("victims");
  const index = select.value;

  if (index !== "placeholder") {
    // Remove from the local array
    state.victims.splice(parseInt(index), 1);

    // Re-draw the select menu so the name disappears
    paintVictimSelect();
    //clear values
    document.getElementById("person-clear").click();

    displayNotification("Ο παθών διαγράφηκε.");
  } else {
    displayNotification("Παρακαλώ επιλέξτε έναν παθόντα πρώτα.", "error");
  }
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

const personLabel = (person) =>
  person?.surname ? `${person.surname} ${person.firstName || ""}`.trim() : "";

// Status line on the reports and ID tabs: who the documents will be filled
// with, and the time the next ones continue from. Buttons whose required
// person is missing are muted, but still clickable to show the error.
function renderStatus() {
  const { rank, name } = readAstynomikosFields();
  const values = {
    victim: personLabel(state.victimData),
    suspect: personLabel(state.ypoptosData),
    officer: name ? joinRankName(rank, name) : "",
    time: formatTime(today, state.timePassed),
  };
  document.querySelectorAll("[data-status]").forEach((el) => {
    const value = values[el.dataset.status];
    el.textContent = value || "—";
    el.classList.toggle("missing", !value);
  });
  document.querySelectorAll("[data-person]").forEach((button) => {
    button.classList.toggle("needs-person", !values[button.dataset.person]);
  });
}
renderStatus();

// Shared by the report buttons: after the download, the top text and status
// follow the new time, and the button gets a "✓ time" mark until ⟳
async function download(
  button,
  ekthesi,
  person,
  { timed = false, replacements = state } = {},
) {
  const time = state.timeStart;
  const ok = await generateWord(ekthesi, replacements, person);
  refreshInitialText();
  renderStatus();
  if (ok) button.dataset.done = timed ? `✓ ${time}` : "✓";
}
// martyras button
const martyra = document.getElementById("martyra");

martyra.addEventListener("click", (e) => {
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);
  applyAllGrammar(state);
  download(e.currentTarget, ektheseis.martyra, state.victimData, {
    timed: true,
  });
});
//martyra me dierminea button
const martyraDierm = document.getElementById("martyraDierm");
martyraDierm.addEventListener("click", (e) => {
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);
  applyAllGrammar(state);
  download(e.currentTarget, ektheseis.martyraDierm, state.victimData, {
    timed: true,
  });
});
//martyra astyn button
const martyraAstynomikos = document.getElementById("martyra-astynomikos");
martyraAstynomikos.addEventListener("click", (e) => {
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
  download(e.currentTarget, ektheseis.astynomikos, astynomikosData, {
    timed: true,
  });
});

// martyraXorisOrko button
const martyraXoris = document.getElementById("martyraXoris");
martyraXoris.addEventListener("click", (e) => {
  state.timePassed += data.xronosPeratosis * 2;
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);
  applyAllGrammar(state);
  download(e.currentTarget, ektheseis.martyraXoris, state.victimData, {
    timed: true,
  });
});

//syllipsi button
const syllipsi = document.getElementById("syllipsi");
syllipsi.addEventListener("click", (e) => {
  state.timePassed += data.xronosPeratosis * 2;
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);
  state.arrestTime = formatTime(today, state.timePassed - 5);
  applyAstynomikosShort();
  applyAllGrammar(state);

  download(e.currentTarget, ektheseis.syllipsi, state.ypoptosData, {
    timed: true,
  });
});
// anomoti button
const anomoti = document.getElementById("anomoti");
anomoti.addEventListener("click", (e) => {
  state.timePassed += data.xronosPeratosis * 2;
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);
  applyAllGrammar(state);
  download(e.currentTarget, ektheseis.anomoti, state.ypoptosData, {
    timed: true,
  });
});

// katigoroumenou button
const katigoroumenou = document.getElementById("katigoroumenou");
katigoroumenou.addEventListener("click", (e) => {
  state.timePassed += data.xronosPeratosis * 2;
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);
  applyAllGrammar(state);
  download(e.currentTarget, ektheseis.katigoroumenou, state.ypoptosData, {
    timed: true,
  });
});

// katigoroumenou me dierminea button
const katigoroumenouDierm = document.getElementById("katigoroumenouDierm");
katigoroumenouDierm.addEventListener("click", (e) => {
  state.timePassed += data.xronosPeratosis * 2;
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);
  state.ypiresia = state.ypiresia?.toUpperCase();
  applyAllGrammar(state);
  download(e.currentTarget, ektheseis.katigoroumenouDierm, state.ypoptosData, {
    timed: true,
  });
});

//apodosi button
const apodosi = document.getElementById("apodosi");
apodosi.addEventListener("click", (e) => {
  state.timePassed += data.xronosPeratosis * 2;
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);
  applyAstynomikosShort();
  applyAllGrammar(state);

  download(e.currentTarget, ektheseis.apodosi, state.victimData, {
    timed: true,
  });
});
// katasxesi button
const katasxesi = document.getElementById("katasxesi");
katasxesi.addEventListener("click", (e) => {
  state.timePassed += data.xronosPeratosis * 2;
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);
  applyAstynomikosShort();
  applyAllGrammar(state);

  download(e.currentTarget, ektheseis.katasxesi, state.victimData, {
    timed: true,
  });
});

// gnostopoiisi button
const gnostopoiisi = document.getElementById("gnostopoiisi");
gnostopoiisi.addEventListener("click", (e) => {
  state.timePassed += data.xronosPeratosis * 2;
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);
  applyAllGrammar(state);

  download(e.currentTarget, ektheseis.gnostopoiisi, state.ypoptosData, {
    timed: true,
  });
});

// egxeirisis button  printEgxeirisis(initial, person)
const egxeirisis = document.getElementById("egxeirisis");
egxeirisis.addEventListener("click", (e) => {
  state.timePassed += data.xronosPeratosis * 2;
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);
  applyAllGrammar(state);
  download(e.currentTarget, ektheseis.egxeirisis, state.victimData, {
    timed: true,
  });
});

// gnostopoiisiNarkwtikwn button
const gnostopoiisiNarkwtikwn = document.getElementById(
  "gnostopoiisiNarkwtikwn",
);
gnostopoiisiNarkwtikwn.addEventListener("click", (e) => {
  state.timePassed += data.xronosPeratosis * 2;
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);
  applyAllGrammar(state);

  download(
    e.currentTarget,
    ektheseis.gnostopoiisiNarkwtikwn,
    state.ypoptosData,
    { timed: true },
  );
});

// praktikoZygisis button
const praktikoZygisis = document.getElementById("praktikoZygisis");
praktikoZygisis.addEventListener("click", (e) => {
  state.timePassed += data.xronosPeratosis * 2;
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);
  applyAllGrammar(state);
  download(e.currentTarget, ektheseis.praktikoZygisis, state.ypoptosData, {
    timed: true,
  });
});
// ypiresiako button
const ypiresiako = document.getElementById("ypiresiako");
ypiresiako.addEventListener("click", (e) => {
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  applySelectedOfficer();
  state.ypiresia = state.ypiresia.toUpperCase();
  state.dAstynomias = state.dAstynomias.toUpperCase();
  state.geniki = state.geniki.toUpperCase();
  state.victim = shortenFormattedPerson(state.victim);
  download(e.currentTarget, ektheseis.ypiresiako, state.victimData, {
    timed: true,
  });
});
// ypefthini button
const ypefthini = document.getElementById("ypefthini");
ypefthini.addEventListener("click", (e) => {
  Object.assign(state, { ...state.victimData });
  applySelectedOfficer();
  download(e.currentTarget, ektheseis.ypefthini, state.victimData);
});

// deltio drasti button
const ypoptoy = document.getElementById("ypoptoy");
ypoptoy.addEventListener("click", (e) => {
  applySelectedOfficer();
  Object.assign(state, { ...state.ypoptosData });
  download(e.currentTarget, ektheseis.deltioYpoptou, state.ypoptosData);
});

//deltio feromenou button
const feromenou = document.getElementById("feromenou");
feromenou.addEventListener("click", (e) => {
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
  download(e.currentTarget, ektheseis.feromenou, state.ypoptosData, {
    timed: true,
  });
});

/// ENDOOIKOGENIAKI

//martyra astyn endo button
const martyraEndooik = document.getElementById("martyra-endooik");
martyraEndooik.addEventListener("click", (e) => {
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.endoTimeStart = state.timeStart;
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);
  applyAllGrammar(state);
  download(e.currentTarget, ektheseis.astynomikosEndooik, state.victimData, {
    timed: true,
  });
});
// thyma endooik button
const thymaEndooik = document.getElementById("thyma-endooik");
thymaEndooik.addEventListener("click", (e) => {
  state.timePassed += data.xronosPeratosis * 2;
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.autoforoTimeStart = state.timeStart;
  state.endoStartTime = state.timeStart;
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);
  applyAllGrammar(state);
  download(e.currentTarget, ektheseis.martyraXorisEndooik, state.victimData, {
    timed: true,
  });
});

// drastis -apologia -katigoroumenos endooik button
const drastisEndooik = document.getElementById("drastis-endooik");
drastisEndooik.addEventListener("click", (e) => {
  state.timePassed += data.xronosPeratosis * 2;
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);
  applyAllGrammar(state);
  download(
    e.currentTarget,
    ektheseis.katigoroumenouEndooik,
    state.ypoptosData,
    { timed: true },
  );
});
// iatrodikastiki button
const iatrodikastiki = document.getElementById("iatrodikastiki-endooik");
iatrodikastiki.addEventListener("click", (e) => {
  state.timePassed += data.xronosPeratosis * 2;
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);
  applySelectedOfficer();
  state.ypiresia = state.ypiresia.toUpperCase();
  applyAllGrammar(state);
  download(e.currentTarget, ektheseis.iatrodikastiki, state.ypoptosData, {
    timed: true,
  });
});
// Panic Button choice: picks its document, and ΒΑΣ reports it too
function readPanicChoice() {
  state.panicButton = document.querySelector(
    'input[name="panic"]:checked',
  ).value;
}
document
  .querySelectorAll('input[name="panic"]')
  .forEach((radio) => radio.addEventListener("change", readPanicChoice));
readPanicChoice();

const panicBtn = document.getElementById("panicBtn");
panicBtn.addEventListener("click", (e) => {
  state.timePassed += data.xronosPeratosis * 2;
  state.ypiresia = state.ypiresia.toUpperCase();
  state.timeStart = formatTime(today, state.timePassed);
  readPanicChoice();
  applyAllGrammar(state);

  const ekthesi = state.panicButton
    ? ektheseis.panicButtonNo
    : ektheseis.panicButtonYes;
  download(e.currentTarget, ekthesi, state.victimData, { timed: true });
});
//domi button
const domi = document.getElementById("domi");
domi.addEventListener("click", (e) => {
  applyAllGrammar(state);

  download(e.currentTarget, ektheseis.domi, state.victimData);
});

//afairesi button
const afairesi = document.getElementById("afairesi");
afairesi.addEventListener("click", (e) => {
  state.timePassed += data.xronosPeratosis * 2;
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);

  applyAllGrammar(state);

  download(e.currentTarget, ektheseis.afairesi, state.ypoptosData, {
    timed: true,
  });
});
// katasxesiEndo button
const katasxesiEndo = document.getElementById("katasxesiEndo");
katasxesiEndo.addEventListener("click", (e) => {
  state.timePassed += data.xronosPeratosis * 2;
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);
  applyAstynomikosShort();
  applyAllGrammar(state);

  download(e.currentTarget, ektheseis.katasxesiEndo, state.victimData, {
    timed: true,
  });
});

//syllipsi button
const syllipsiEndo = document.getElementById("syllipsiEndo");
syllipsiEndo.addEventListener("click", (e) => {
  state.timePassed += data.xronosPeratosis * 2;
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);
  state.arrestTime = formatTime(today, state.timePassed - 5);
  applyAstynomikosShort();
  applyAllGrammar(state);

  download(e.currentTarget, ektheseis.syllipsiEndo, state.ypoptosData, {
    timed: true,
  });
});

// deltio drasti Endo button
const ypoptoyEndo = document.getElementById("ypoptoyEndo");
ypoptoyEndo.addEventListener("click", (e) => {
  applySelectedOfficer();
  Object.assign(state, { ...state.ypoptosData });
  download(e.currentTarget, ektheseis.deltioYpoptouEndo, state.ypoptosData);
});
//ypovlitiki button
const ypovoliEndo = document.getElementById("ypovoliEndo");
ypovoliEndo.addEventListener("click", (e) => {
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

  download(e.currentTarget, ektheseis.ypovoliEndo, state.victimData);
});
//ypovlitiki button
const apostoliEndo = document.getElementById("apostoliEndo");
apostoliEndo.addEventListener("click", (e) => {
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

  download(e.currentTarget, ektheseis.apostoliEndo, state.victimData);
});

// Γ.Ε.Ε. button
const simansi = document.getElementById("simansi");
simansi.addEventListener("click", (e) => {
  applySelectedOfficer();
  Object.assign(state, { ...state.ypoptosData });
  applyAllGrammar(state);
  download(e.currentTarget, ektheseis.simansi, state.ypoptosData);
});

// ΒΑΣ button
const vasEndo = document.getElementById("vasEndo");
vasEndo.addEventListener("click", (e) => {
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

  download(e.currentTarget, ektheseis.vasEndo, state.ypoptosData);
});

// new IDs btn
const a130 = document.getElementById("a130");
a130.addEventListener("click", (e) => {
  Object.assign(state, { ...state.victimData });
  state.n = document.getElementById("n").value;
  state.newId = document.getElementById("newId").value;
  state.newIdAppDate = document.getElementById("newIdAppDate").value;
  applySelectedOfficer();
  state.ypiresia = state.ypiresia?.toUpperCase();
  state.issuingAuthority = state.issuingAuthority?.toUpperCase();
  download(e.currentTarget, ektheseis.a130, state.victimData);
});

// ypefthiniDAT button
const ypefthiniDAT = document.getElementById("ypefthiniDAT");

ypefthiniDAT.addEventListener("click", (e) => {
  Object.assign(state, { ...state.victimData });
  state.idNumber1 = state.idNumber;
  download(e.currentTarget, ektheseis.ypefthiniDAT, state.victimData);
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
    // the help toggle is what's visible on wide screens, the item on narrow
    const whatsNewBtns = [helpMenuToggle, document.getElementById("patch-help")];
    whatsNewBtns.forEach((btn) => btn.classList.add("glow-new"));

    // Remove animation after 15 seconds
    setTimeout(() => {
      whatsNewBtns.forEach((btn) => btn.classList.remove("glow-new"));
    }, 15000);
  }
}

// Sketcher badge: same glow treatment as patch notes ("BETA" instead of
// "ΝΕΟ"), but permanent — never removed, unlike the patch-notes glow.
const sketcherLink = document.getElementById("sketcher-link");
if (sketcherLink) {
  sketcherLink.classList.add("glow-new", "glow-beta");
}
