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
  // Parse input text into an object
  const lines = input.split("\n");
  const data = {};

  lines.forEach((line) => {
    const parts = line.trim().split("\n");
    parts.forEach((part) => {
      const [key, value] = part.split(/\s{2,}/);
      if (key && value) {
        data[key.trim()] = value.trim();
      }
    });
  });

  // Extract needed values
  const licensePlate = data["Αρ.Κυκλοφ"] || "";
  const color = data["Χρώμα"]?.toLowerCase() || "";
  const make = data["Μάρκα"] || "";
  const chassisNumber = data["Πλαίσιο"] || "";
  const engineNumber = data["Αρ. Κινητήρα"] || "";
  const usage = data["Χρήση"] || "";
  const type = data["Είδος"] || "";
  const ownerSurname = data["Επώνυμο"] || "";
  const ownerFirstName = data["Όνομα"] || "";
  const ownerFatherName = data["Πατρώνυμο"] || "";

  // Format the usage and type
  let formattedUsage = usage;
  if (type === "ΔΙΚΥΚΛΟ") {
    formattedUsage = "δίκυκλο";
  } else if (usage === "Ι.Χ" || usage === "Δ.Χ") {
    const typeFirstLetter = type.charAt(0);
    formattedUsage = `${usage}.${typeFirstLetter}`;
  }

  // Format the owner's father name to end with genitive case
  const fatherNameGenitive = ownerFatherName.replace("Η", "λ");

  // Format the output string
  const formattedString = `${licensePlate} ${formattedUsage} χρώματος ${color}, μάρκας ${make}, με αριθμό πλαισίου ${chassisNumber} και αριθμό κινητήρα ${engineNumber} ιδιοκτησίας του ${ownerSurname} ${capitalize(
    ownerFirstName
  )} του ${capitalize(fatherNameGenitive)}`;

  return formattedString;
}

// function convertId(input) {
//   // Initialize values
//   let lastName = "------";
//   let firstName = "------";
//   let fatherName = "------";
//   let motherName = "------";
//   let birthDate = "------";
//   let birthPlace = "------";
//   let country = "------";
//   let address = "------";
//   let number = "------";
//   let issueDate = "------";
//   let expirationDate = "------";
//   let issueAuthority = "------";
//   let phone = "------";
//   let afm = "------";
//   let profession = "------";
//   let adt = "------";

//   // Parse input string
//   const lines = input.split("\n");
//   lines.forEach((line) => {
//     const parts = line.split("\t");
//     switch (parts[0].trim()) {
//       case "Επώνυμο":
//         lastName = parts[1].trim();
//         break;
//       case "Α.Δ.Τ":
//         adt = parts[1].trim();
//         break;
//       case "Όνομα":
//         firstName = parts[1].trim();
//         break;
//       case "Όνομα Πατρός":
//         fatherName = parts[1].trim();
//         break;
//       case "Όνομα Μητρός":
//         motherName = parts[1].trim();
//         break;
//       case "Ημ/νία Γέννησης":
//         birthDate = parts[1].trim();
//         break;
//       case "Τόπος Γέννησης":
//         birthPlace = parts[1].trim();
//         break;
//       case "Χώρα Γέννησης":
//         country = parts[1].trim();
//         break;
//       case "Οδός":
//         address = parts[1].trim();
//         break;
//       case "Αριθμός":
//         number = parts[1].trim();
//         break;
//       case "Ημ/νια Έκδοσης":
//         issueDate = parts[1].trim();
//         break;
//       case "Ημερομηνία Λήξης":
//         expirationDate = parts[1].trim();
//         break;
//       case "Αρχή Έκδοσης":
//         issueAuthority = parts[1].trim();
//         break;
//       case "Τηλέφωνο":
//         phone = parts[1].trim();
//         break;
//     }
//   });

//   return `${lastName} ${firstName} του ${fatherName} της ${motherName}, γεν ${birthDate} στο ${birthPlace} ${country}, κάτοικος Κομοτηνής, οδός ${address} αρ. ${number}, κάτοχος του υπ’αριθ ${adt} Δ.Α.Τ εκδοθέν ${issueDate} από ${issueAuthority}, με Α.Φ.Μ ${afm} / Δ.Ο.Υ. Κομοτηνής, τηλ ${phone}, email (στερείται), επάγγελμα ${profession}, ημ. λήξης ${expirationDate}`;
// }
function formatGreekIdInfo(input) {
  // Parse input text into an object
  const lines = input.split("\n");
  const data = {};

  lines.forEach((line) => {
    const parts = line.trim().split("\n");
    parts.forEach((part) => {
      const [key, value] = part.split(/\s{2,}/);
      if (key && value) {
        data[key.trim()] = value.trim();
      }
    });
  });

  // Extract needed values
  const surname = data["Επώνυμο"] || "";
  const firstName = data["Όνομα"] || "";
  const fatherName = data["Όνομα Πατρός"] || "";
  const motherName = data["Όνομα Μητρός"] || "";
  const birthDate = data["Ημ/νία Γέννησης"]
    ? data["Ημ/νία Γέννησης"].replace("/", "-")
    : "";
  const birthPlace = data["Τόπος Γέννησης"]
    ? data["Τόπος Γέννησης"].split(" ")[0]
    : "";
  const area = data["Περιοχή"] || "";
  const region = data["Νομός"] || "";
  const idNumber = data["Α.Δ.Τ"] || "";
  const issueDate = data["Ημ/νια Έκδοσης"]
    ? data["Ημ/νια Έκδοσης"].replace("/", "-")
    : "";
  const issuingAuthority = data["Αρχή Έκδοσης"]
    ? data["Αρχή Έκδοσης"].split(" - ")[1]
    : "";

  // Format the output string
  const formattedString = `${surname} ${capitalize(firstName)} του ${capitalize(
    fatherName
  )} και της ${capitalize(
    motherName
  )}, γεν. ${birthDate} στην ${birthPlace}, κάτοικος ${area} ${region}, επάγγελμα -------, κάτοχος του υπ'αριθ ${idNumber} Δ.Α.Τ. εκδοθέντος ${issueDate} από ${issuingAuthority}, με Α.Φ.Μ -------/ Δ.Ο.Υ. Κομοτηνής, με email (στερούμενος)`;

  return formattedString;
}

// Helper function to capitalize first letter of each word
function capitalize(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
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
  clipboardId.value = formatGreekIdInfo(id);
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
