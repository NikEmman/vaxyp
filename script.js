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
let formattedHour = `${today.getHours()}:${today.getMinutes()}`;
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
timeElement.innerHTML = formattedHour;

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
    }
  });

  // Construct output string
  return `${licensePlate} Ι.Χ.Ε. μάρκας ${brand} χρώματος ${color}, με
 αριθμό πλαισίου ${frameNumber} και αριθμό κινητήρα ${engineNumber}
 ιδιοκτησίας ${ownerLastName} ${ownerFirstName} του ${ownerFatherName}`;
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

  // Parse input string
  const lines = input.split("\n");
  lines.forEach((line) => {
    const parts = line.split("\t");
    switch (parts[0].trim()) {
      case "Επώνυμο":
        lastName = parts[1].trim();
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

  // Construct output string
  return `${lastName} ${firstName} του ${fatherName} της ${motherName},
 γεν ${birthDate} στο ${birthPlace} ${country}, κάτοικος Κομοτηνής, οδός
 ${address} αρ. ${number}, κάτοχος του υπ’αριθ Α00544988 Δ.Α.Τ εκδοθέν
 ${issueDate} από ${issueAuthority}, με Α.Φ.Μ ${afm} / Δ.Ο.Υ. Κομοτηνής,
 τηλ ${phone}, email example@mail.com, επάγγελμα ${profession}, ημ. λήξης
 ${expirationDate}`;
}

const taytotita = document.getElementById("taytotita");
const personFormatBtn = document.getElementById("personFormat");
const clipboardId = document.querySelector(".clipboard-id");
const copyIdBtn = document.querySelector(".copy-id");

personFormatBtn.addEventListener("click", () => {
  let formattedID = convertId(taytotita.textContent);
  clipboardId.textContent = formattedID;
});
