let today = new Date();
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
let formattedHour = String(today.getHours()).padStart(2, "0");
let formattedMinutes = String(today.getMinutes()).padStart(2, "0");
let formattedTime = `${formattedHour}:${formattedMinutes}`;
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
function copyInitial() {
  const initial = document.getElementById("initial");

  const textToCopy = initial.textContent;

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
const copyInitialBtn = document.getElementById("copy-initial");
copyInitialBtn.addEventListener("click", copyInitial());

// formatters
function convertCarInfo(input) {
  // Initialize values
  let licensePlate = "------";
  let frameNumber = "------";
  let engineNumber = "------";
  let brand = "------";
  let color = "------";
  let ownerLastName = "------";
  let ownerFirstName = "------";
  let ownerFatherName = "------";
  let type = "--";

  // Parse input string
  const lines = input.split("\n");
  lines.forEach((line) => {
    const parts = line.split("\t");
    switch (parts[0].trim()) {
      case "Αρ.Κυκλοφ":
        licensePlate = parts[1].trim();
        break;
      case "Πλαίσιο":
        frameNumber = parts[1].trim();
        break;
      case "Αρ. Κινητήρα":
        engineNumber = parts[1].trim();
        break;
      case "Μάρκα":
        brand = parts[1].trim();
        break;
      case "Χρώμα":
        color = parts[1].trim();
        break;
      case "Επώνυμο":
        ownerLastName = parts[1].trim();
        break;
      case "Όνομα":
        ownerFirstName = parts[1].trim();
        break;
      case "Πατρώνυμο":
        ownerFatherName = parts[1].trim();
        break;
      case "Είδος":
        type = Array.from(parts[1].trim())[0];
        break;
    }
  });

  // Construct output string
  return `${licensePlate} Ι.Χ.${type}. μάρκας ${brand} χρώματος ${color}, με αριθμό πλαισίου ${frameNumber} και αριθμό κινητήρα ${engineNumber} ιδιοκτησίας ${ownerLastName} ${ownerFirstName} του ${ownerFatherName}`;
}

function convertId(input) {
  // Initialize values
  let lastName = "------";
  let firstName = "------";
  let fatherName = "------";
  let motherName = "------";
  let birthDate = "------";
  let birthPlace = "------";
  let country = "------";
  let address = "------";
  let number = "------";
  let issueDate = "------";
  let expirationDate = "------";
  let issueAuthority = "------";
  let phone = "------";
  let afm = "------";
  let profession = "------";
  let adt = "------";

  // Parse input string
  const lines = input.split("\n");
  lines.forEach((line) => {
    const parts = line.split("\t");
    switch (parts[0].trim()) {
      case "Επώνυμο":
        lastName = parts[1].trim();
        break;
      case "Α.Δ.Τ":
        adt = parts[1].trim();
        break;
      case "Όνομα":
        firstName = parts[1].trim();
        break;
      case "Όνομα Πατρός":
        fatherName = parts[1].trim();
        break;
      case "Όνομα Μητρός":
        motherName = parts[1].trim();
        break;
      case "Ημ/νία Γέννησης":
        birthDate = parts[1].trim();
        break;
      case "Τόπος Γέννησης":
        birthPlace = parts[1].trim();
        break;
      case "Χώρα Γέννησης":
        country = parts[1].trim();
        break;
      case "Οδός":
        address = parts[1].trim();
        break;
      case "Αριθμός":
        number = parts[1].trim();
        break;
      case "Ημ/νια Έκδοσης":
        issueDate = parts[1].trim();
        break;
      case "Ημερομηνία Λήξης":
        expirationDate = parts[1].trim();
        break;
      case "Αρχή Έκδοσης":
        issueAuthority = parts[1].trim();
        break;
      case "Τηλέφωνο":
        phone = parts[1].trim();
        break;
    }
  });

  return `${lastName} ${firstName} του ${fatherName} της ${motherName}, γεν ${birthDate} στο ${birthPlace} ${country}, κάτοικος Κομοτηνής, οδός ${address} αρ. ${number}, κάτοχος του υπ’αριθ ${adt} Δ.Α.Τ εκδοθέν ${issueDate} από ${issueAuthority}, με Α.Φ.Μ ${afm} / Δ.Ο.Υ. Κομοτηνής, τηλ ${phone}, email (στερείται), επάγγελμα ${profession}, ημ. λήξης ${expirationDate}`;
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
  console.log(convertId(id));
  clipboardId.value = convertId(id);
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
  clipboardOxima.value = convertCarInfo(vehicle);
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
