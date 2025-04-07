import ektheseis from "./ektheseis.js";
import { defaultData, months, days } from "./defaultData.js";

const today = new Date();

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
    protokolo: 0,
  };
  //combine data and state so the new Ektheseis replacement argument works

  Object.assign(dataObject, { ...localData });
  return dataObject;
};
let data = getData();
let state = getState(data, today);

const anakritikosSelect = document.querySelector("#anakritikos");
const bAnakritikosSelect = document.querySelector("#anakritikos-b");

const paintSelectMenus = () => {
  anakritikosSelect.innerHTML = "";
  bAnakritikosSelect.innerHTML = "";
  state.anakritikoi.forEach((anakritikos, index) => {
    // Populate a anakr select
    const anakr = document.createElement("option");
    anakr.value = anakritikos;
    anakr.textContent = anakritikos.split(" ")[1];
    if (index === 0) {
      anakr.setAttribute("selected", "");
    }
    anakritikosSelect.appendChild(anakr);

    // Populate b anakr select
    const bAnakr = document.createElement("option");
    bAnakr.value = anakritikos;
    bAnakr.textContent = anakritikos.split(" ")[1];
    if (index === 1) {
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
          localStorage.clear();
          localStorage.setItem("dataObject", e.target.result);

          data = getData();
          state = getState(data, today);
          paintSelectMenus();
          initial.textContent = constructInitialText();
        } catch (error) {
          console.error("Invalid JSON file:", error);
          alert("Το αρχείο δεν έχει σωστή μορφή JSON.");
        }
      };

      reader.readAsText(file);
    }
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

// Initial setup
initialText.textContent = constructInitialText();

// Update text when anakritikos selections change
anakritikosSelect.addEventListener("change", () => {
  initialText.textContent = constructInitialText();
  state.anakritikos = convertAnakritikosToEnikos(anakritikosSelect.value);
});

bAnakritikosSelect.addEventListener("change", () => {
  initialText.textContent = constructInitialText();
});
// initial copy mech

const copyInitialBtn = document.getElementById("copy-initial");
copyInitialBtn.addEventListener("click", () => {
  const text = constructInitialText().replace(/(\r\n|\n|\r|\s{2,})/gm, " ");
  copyToClipboard(text);
});

// person parser fields
const taytotita = document.getElementById("taytotita");
const clipboardId = document.querySelector(".clipboard-id");
const copyIdBtn = document.querySelector(".copy-id");
taytotita.addEventListener("input", () => {
  // id = taytotita.value;
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

// ektheseis
const initial = document.getElementById("initial");
// martyras button
const martyra = document.getElementById("martyra");

martyra.addEventListener("click", () => {
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);
  generateWord(ektheseis.martyra, state);
});
const martyraGyn = document.getElementById("martyraGyn");

martyraGyn.addEventListener("click", () => {
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);
  generateWord(ektheseis.martyraGyn, state);
});

// martyraXorisOrko button
const martyraXoris = document.getElementById("martyraXoris");
martyraXoris.addEventListener("click", () => {
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);

  generateWord(ektheseis.martyraXoris, state);
});

//syllipsi button
const syllipsi = document.getElementById("syllipsi");
syllipsi.addEventListener("click", () => {
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);
  state.arrestTime = formatTime(today, state.timePassed - 10);

  generateWord(ektheseis.syllipsi, state);
});
// anomoti button
const anomoti = document.getElementById("anomoti");
anomoti.addEventListener("click", () => {
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);

  generateWord(ektheseis.anomoti, state);
});
// anomoti gyn
const anomotiGyn = document.getElementById("anomotiGyn");
anomotiGyn.addEventListener("click", () => {
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);

  generateWord(ektheseis.anomotiGyn, state);
});
// katigoroumenou button
const katigoroumenou = document.getElementById("katigoroumenou");
katigoroumenou.addEventListener("click", () => {
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);

  generateWord(ektheseis.katigoroumenou, state);
});

//apodosi button
const apodosi = document.getElementById("apodosi");
apodosi.addEventListener("click", () => {
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);

  generateWord(ektheseis.apodosi, state);
});
// katasxesi button
const katasxesi = document.getElementById("katasxesi");
katasxesi.addEventListener("click", () => {
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);
  generateWord(ektheseis.katasxesi, state);
});

// gnostopoiisi button
const gnostopoiisi = document.getElementById("gnostopoiisi");
gnostopoiisi.addEventListener("click", () => {
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);

  generateWord(ektheseis.gnostopoiisi, state);
});

// egxeirisis button  printEgxeirisis(initial, person)
const egxeirisis = document.getElementById("egxeirisis");
egxeirisis.addEventListener("click", () => {
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);
  generateWord(ektheseis.egxeirisis, state);
});
const egxeirisisGyn = document.getElementById("egxeirisisGyn");
egxeirisisGyn.addEventListener("click", () => {
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);
  generateWord(ektheseis.egxeirisisGyn, state);
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
  generateWord(ektheseis.deltioYpoptou, state);
});

/// ENDOOIKOGENIAKI

//martyra astyn button
const martyraEndooik = document.getElementById("martyra-endooik");
martyraEndooik.addEventListener("click", () => {
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);

  generateWord(ektheseis.astynomikosEndooik, state);
});
// thyma endooik button
const thymaEndooik = document.getElementById("thyma-endooik");
thymaEndooik.addEventListener("click", () => {
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);

  generateWord(ektheseis.martyraXorisEndooik, state);
});

// drastis -apologia -katigoroumenos endooik button
const drastisEndooik = document.getElementById("drastis-endooik");
drastisEndooik.addEventListener("click", () => {
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);

  generateWord(ektheseis.katigoroumenouEndooik, state);
});
// iatrodikastiki button
const iatrodikastiki = document.getElementById("iatrodikastiki-endooik");
iatrodikastiki.addEventListener("click", () => {
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);
  state.anakritikos = convertAnakritikosToEnikos(anakritikosSelect.value);
  state.ypiresia = state.ypiresia.toUpperCase();
  state.anakritikosName =
    state.anakritikos.split(" ")[1] + " " + state.anakritikos.split(" ")[2];
  state.rank = state.anakritikos.split(" ")[0];
  generateWord(ektheseis.iatrodikastiki, state);
});
const panicYes = document.getElementById("panicYes");
panicYes.addEventListener("click", () => {
  state.ypiresia = state.ypiresia.toUpperCase();
  state.timeStart = formatTime(today, state.timePassed);
  generateWord(ektheseis.panicButtonYes, state);
});
const panicNo = document.getElementById("panicNo");
panicNo.addEventListener("click", () => {
  state.ypiresia = state.ypiresia.toUpperCase();
  state.timeStart = formatTime(today, state.timePassed);
  generateWord(ektheseis.panicButtonNo, state);
});

//time formatter
function formatTime(date, extraTime = 0) {
  let totalMinutes = date.getHours() * 60 + date.getMinutes() + extraTime;
  // Ensure totalMinutes wraps correctly for negative cases
  totalMinutes = (totalMinutes + 1440) % 1440;

  let hour = Math.floor(totalMinutes / 60);
  let minutes = totalMinutes % 60;

  let formattedHour = String(hour).padStart(2, "0");
  let formattedMinutes = String(minutes).padStart(2, "0");

  return `${formattedHour}:${formattedMinutes}`;
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
    };

    // Handle special cases
    if (fields.streetNumber === "Ταχ.Κώδικας") {
      fields.streetNumber = "--- ";
    }
    if (fields.street === "Αριθμός") {
      fields.street = "---------- ";
    }
    if (fields.phoneNumber === "Άλλα στοιχεία επικοινωνίας") {
      fields.phoneNumber = "(στερείται) ";
    }
    if (fields.area === "Οδός") {
      fields.area = "--- ";
    }
    if (fields.area === fields.birthPlace) {
      fields.area = "ομοίως";
    }
    if (fields.region === "Περιοχή") {
      fields.region = "--- ";
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
    )} του ${capitalize(fields.fatherName)} και της ${capitalize(
      fields.motherName
    )}, γεν. ${fields.birthDate} στην ${capitalize(
      fields.birthPlace
    )}, κάτοικος ${residence}, οδός ${capitalize(fields.street)} αρ. ${
      fields.streetNumber
    }, επάγγελμα ------- , κάτοχος του υπ'αριθ ${
      fields.idNumber
    } Δ.Α.Τ. εκδοθέντος ${fields.issueDate} από ${
      fields.issuingAuthority
    }, με Α.Φ.Μ ------- / Δ.Ο.Υ. ${data.doy}, χρήστη της υπ'αριθ. ${
      fields.phoneNumber
    } τηλεφωνικής σύνδεσης, με διεύθυνση ηλεκτρονικού ταχυδρομείου (στερείται)`;
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

    //   // extract the data for ypefthini dilosi usage
    suspect ? (state.ypoptosData = fields) : (state.ypefthiniData = fields);

    // Format the output string
    const formattedString = `(Επ)${fields.surname} (Ον.)${fields.firstName} του ${fields.fatherName} και της ${fields.motherName}, υπηκοότητα ${fields.nationality}, γεν. ${fields.birthDate} στ ${fields.birthPlace}, κάτοικος ****, οδός **** αρ. ****`;
    return formattedString;
  }
}

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
async function generateWord(ekthesi, replacements) {
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
    a.download = `${ekthesi.title}.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    console.log("Document generated successfully");
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
