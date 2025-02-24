import externalData from "./data.js";
import { formatTime, capitalize, formatDate } from "./helpers.js";
import { printMartyra, printSyllipsi } from "./ektheseis.js";

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

// formatters
function formatVehicleInfo(input) {
  // Parse input text into an array of key-value pairs
  const lines = input
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line);

  const data = {};

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
        data[line] = nextLine;
      }
    }
  }

  // Extract needed values with proper error handling
  const getValue = (key) => data[key] || "";

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
function formatIdInfo(input) {
  // Parse input text into an array of lines
  const lines = input
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line);

  // Create a more reliable parsing mechanism
  const data = {};
  for (let i = 0; i < lines.length; i++) {
    const currentLine = lines[i];
    const nextLine = lines[i + 1];

    // Skip lines containing Latin translations
    if (currentLine.includes("(Λατιν.)")) continue;

    // Store the current line as a key if it has a corresponding value in the next line
    if (nextLine && !currentLine.includes("(Λατιν.)")) {
      data[currentLine] = nextLine;
    }
  }

  // Helper functions
  const getValue = (key) => data[key] || "";
  const formatDate = (dateStr) => (dateStr ? dateStr.split("/").join("-") : "");
  const formatIssuingAuthority = (string) => {
    const authorityText = string.split("-")[1].trim();
    const [prefix, location] = authorityText.split(" ");
    return `${prefix} ${capitalize(location)}`;
  };

  // Extract all required fields
  const fields = {
    surname: getValue("Επώνυμο"),
    firstName: getValue("Όνομα"),
    fatherName: getValue("Όνομα Πατρός"),
    motherName: getValue("Όνομα Μητρός"),
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
    fields.streetNumber = "---";
  }
  if (fields.street === "Αριθμός") {
    fields.street = "----------";
  }
  if (fields.phoneNumber === "Άλλα στοιχεία επικοινωνίας") {
    fields.phoneNumber = "(στερείται)";
  }

  // Format the output string
  const formattedString = `${fields.surname} ${capitalize(
    fields.firstName
  )} του ${capitalize(fields.fatherName)} και της ${capitalize(
    fields.motherName
  )}, γεν. ${fields.birthDate} στην ${capitalize(
    fields.birthPlace
  )}, κάτοικος ${capitalize(fields.area)} ${capitalize(
    fields.region
  )}, οδός ${capitalize(fields.street)} αρ. ${
    fields.streetNumber
  }, επάγγελμα -------, κάτοχος του υπ'αριθ ${
    fields.idNumber
  } Δ.Α.Τ. εκδοθέντος ${fields.issueDate} από ${
    fields.issuingAuthority
  }, με Α.Φ.Μ ------- / Δ.Ο.Υ. ${externalData.doy}, με τηλέφωνο ${
    fields.phoneNumber
  }, με email (στερείται)`;
  console.log(externalData);
  return formattedString;
}

// person parser fields
const taytotita = document.getElementById("taytotita");
const personFormatBtn = document.getElementById("personFormat");
const clipboardId = document.querySelector(".clipboard-id");
const copyIdBtn = document.querySelector(".copy-id");
taytotita.addEventListener("input", () => {
  id = taytotita.value;
});

personFormatBtn.addEventListener("click", () => {
  clipboardId.value = formatIdInfo(id);
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

function downloadAsWord() {
  const content = document.getElementById("content").innerHTML;
  const header =
    "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
    "xmlns:w='urn:schemas-microsoft-com:office:word' " +
    "xmlns='http://www.w3.org/TR/REC-html40'>" +
    "<head><meta charset='utf-8'><title>HTML to Word</title></head><body>";
  const footer = "</body></html>";
  const sourceHTML = header + content + footer;

  const blob = new Blob(["\ufeff", sourceHTML], {
    type: "application/msword",
  });

  const url =
    "data:application/vnd.ms-word;charset=utf-8," +
    encodeURIComponent(sourceHTML);
  const downloadLink = document.createElement("a");
  document.body.appendChild(downloadLink);

  downloadLink.href = url;
  const title = document.querySelector("u").textContent;
  downloadLink.download = `${title}.doc`;
  downloadLink.click();

  document.body.removeChild(downloadLink);
}
const button = document.getElementById("word");
button.addEventListener("click", downloadAsWord);
