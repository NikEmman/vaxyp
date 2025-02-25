const data = {
  anakritikoi: [
    "Αρχ/κα ΕΜΜΑΝΟΥΗΛΙΔΗ Νικόλαου",
    "Ανθ/μου ΚΟΛΤΣΙΔΑ Βαγγέλη",
    "Ανθ/μου ΚΟΥΛΕΛΗ Χρήστου",
    "Αρχ/κα ΓΚΑΓΚΑΤΣΑ Γεώργιου",
    "Υπ/κα ΠΑΡΑΣΚΕΥΑ Νερατζή",
    "Ανθ/μου ΓΙΑΝΝΑΚΙΔΗ Βασίλειου",
  ],
  ypiresia: "Τ.Δ.Ε.Ε. Κομοτηνής",
  doy: "Κομοτηνής",
  merosSyntaksisEkthesis: "Κομοτηνή",
  xronosPeratosis: 10,
  eisaggeleiaProtodikon: "Ροδόπης",
  dieuthynsiYpiresias: "Λ Δημοκρατίας αρ. 3",
  tilefono: "25314 40177",
  email: "ta.komotinis@astynomia.gr",
};

function printYpefthini(
  datas,
  axyp,
  person,
  protokolo,
  apolesthen,
  date,
  dateFormatter
) {
  return `<div
  style="
    font-family: Arial, sans-serif;
    width: 210mm;
    height: 297mm;
    margin: 20px auto;
    line-height: 1.5;
  "
>
  <div style="text-align: center; margin-bottom: 20px">
    <h3 style="margin-bottom: 10px">ΥΠΕΥΘΥΝΗ ΔΗΛΩΣΗ</h3>
    <h3 style="margin-top: 5px"><sup>(άρθρο 8 Ν.1599/1986)</sup></h3>
  </div>
  <div style="font-size: 0.8em; text-align: end">${axyp}</div>
  <div style="font-size: 0.8em; text-align: end">Χορηγήθηκε Υ.Σ.</div>
  <div style="font-size: 0.8em; text-align: end">3005/4/${protokolo}</div>

  <p style="margin-bottom: 20px; font-style: italic">
    Η ακρίβεια των στοιχείων που υποβάλλονται με αυτή τη δήλωση μπορεί να
    ελεγχθεί με βάση το αρχείο άλλων υπηρεσιών (άρθρο 8 παρ. 4 Ν. 1599/1986)
  </p>

  <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px">
    <tr>
      <td style="width: 20%; padding: 5px; border: 1px solid #000">ΠΡΟΣ:</td>
      <td style="width: 80%; padding: 5px; border: 1px solid #000" colspan="5">
        <strong>${datas.ypiresia}</strong>
      </td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #000">Ο – Η Όνομα:</td>
      <td style="padding: 5px; border: 1px solid #000" colspan="2">
        <strong>${person.firstName}</strong>
      </td>
      <td style="padding: 5px; border: 1px solid #000; width: 15%">ΕΠΩΝΥΜΟ:</td>
      <td style="padding: 5px; border: 1px solid #000" colspan="2">
        <strong>${person.surname}</strong>
      </td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #000">
        Όνομα και Επώνυμο Πατέρα:
      </td>
      <td style="padding: 5px; border: 1px solid #000" colspan="5">
        <strong>${person.fatherName} ${person.surname}</strong>
      </td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #000">
        Όνομα και Επώνυμο Μητέρας:
      </td>
      <td style="padding: 5px; border: 1px solid #000" colspan="5">
        <strong>${person.motherName} ${person.motherSurname}</strong>
      </td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #000">Ημερομηνία γέννησης:</td>
      <td style="padding: 5px; border: 1px solid #000" colspan="5">
        <strong>${person.birthDate}</strong>
      </td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #000">Τόπος Γέννησης:</td>
      <td style="padding: 5px; border: 1px solid #000" colspan="5">
        <strong>${person.birthPlace}</strong>
      </td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #000">
        Αριθμός Δελτίου Ταυτότητας:
      </td>
      <td style="padding: 5px; border: 1px solid #000" colspan="2">
        <strong>${person.idNumber}</strong>
      </td>
      <td style="padding: 5px; border: 1px solid #000">Τηλ:</td>
      <td style="padding: 5px; border: 1px solid #000" colspan="2">
        <strong>${person.phoneNumber}</strong>
      </td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #000">Τόπος Κατοικίας:</td>
      <td style="padding: 5px; border: 1px solid #000">
        <strong>${person.area}</strong>
      </td>
      <td style="padding: 5px; border: 1px solid #000; width: 10%">Οδός:</td>
      <td style="padding: 5px; border: 1px solid #000">${person.street}</td>
      <td style="padding: 5px; border: 1px solid #000; width: 10%">Αριθ:</td>
      <td style="padding: 5px; border: 1px solid #000">${
        person.streetNumber
      }</td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #000; width: 10%">ΤΚ:</td>
      <td style="padding: 5px; border: 1px solid #000"></td>
      <td style="padding: 5px; border: 1px solid #000" colspan="2">
        Δ/νση Ηλεκτρ. Ταχυδρομείου (Email):
      </td>
      <td style="padding: 5px; border: 1px solid #000" colspan="2"></td>
    </tr>
  </table>

  <div style="border: 1px solid #000; padding: 15px; margin-bottom: 30px">
    <p style="font-weight: bold">
      Με ατομική μου ευθύνη και γνωρίζοντας τις κυρώσεις, που προβλέπονται από
      τις διατάξεις της παρ. 6 του άρθρου 22 του Ν. 1599/1986, δηλώνω ότι:
    </p>
    <p style="margin-top: 20px">Σε άγνωστο τόπο και χρόνο απώλεσα ${apolesthen}</p>
  </div>

  <div style="text-align: right; margin-top: 30px; margin-right: 50px">
    <p><strong>${datas.merosSyntaksisEkthesis}, ${dateFormatter(
    date
  )}</strong></p>
    <p style="margin-top: 30px">Ο-Η Δηλών-ούσα</p>
    <p style="margin-top: 40px">.</p>
  </div>
</div>
`;
}

//Μην πειράξετε από εδώ και κάτω

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
let ypefthiniData = {};

const anakritikosSelect = document.querySelector("#anakritikos");
const bAnakritikosSelect = document.querySelector("#anakritikos-b");

data.anakritikoi.forEach((anakritikos, index) => {
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
const initialText = document.getElementById("initial");

function constructInitialText() {
  return `Στην ${data.merosSyntaksisEkthesis} σήμερα την ${day}η του μήνα ${month} του έτους ${year} ημέρα ${dayName} και ώρα ${formattedTime} ενώπιον εμού, του ${anakritikosSelect.value} του ${data.ypiresia}, παρισταμένου και του ${bAnakritikosSelect.value} `;
}

//dilosi apoleias
let apolesthenItem = "";
let protokoloNumber = 0;
const apolesthen = document.getElementById("apolesthen");
apolesthen.addEventListener("input", () => {
  apolesthenItem = apolesthen.value;
});

const protokolo = document.getElementById("protokolo");
protokolo.addEventListener("input", () => {
  protokoloNumber = protokolo.value;
});

// Initial setup
initialText.textContent = constructInitialText();

// Update text when anakritikos selections change
anakritikosSelect.addEventListener("change", () => {
  initialText.textContent = constructInitialText();
});

bAnakritikosSelect.addEventListener("change", () => {
  initialText.textContent = constructInitialText();
});
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
  clipboardId.value = formatIdInfo(id, data);
});

copyIdBtn.addEventListener("click", () => {
  copyToClipboard(clipboardId.value);
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
// ypefthini button
const ypefthini = document.getElementById("ypefthini");
ypefthini.addEventListener("click", () => {
  downloadAsWord(
    printYpefthini(
      ypefthiniData,
      anakritikosSelect.value,
      clipboardId.value,
      protokoloNumber,
      apolesthenItem,
      today,
      formatDate
    ),
    "ypefthini"
  );
});
function downloadAsWord(func, id) {
  const content = document.getElementById(`${id}-content`);
  content.innerHTML = func;

  const download = document.getElementById(`${id}-download`);

  const header =
    "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
    "xmlns:w='urn:schemas-microsoft-com:office:word' " +
    "xmlns='http://www.w3.org/TR/REC-html40'>" +
    "<head><meta charset='utf-8'><title>HTML to Word</title></head><body>";
  const footer = "</body></html>";
  const sourceHTML = header + download.innerHTML + footer;

  const blob = new Blob(["\ufeff", sourceHTML], {
    type: "application/msword",
  });

  const url =
    "data:application/vnd.ms-word;charset=utf-8," +
    encodeURIComponent(sourceHTML);
  const downloadLink = document.createElement("a");
  document.body.appendChild(downloadLink);

  downloadLink.href = url;
  const title = document.getElementById(`${id}-title`).textContent;
  downloadLink.download = `${title}.doc`;
  downloadLink.click();

  document.body.removeChild(downloadLink);
}
//time formatter
function formatTime(date, extraTime = 0) {
  let hour = date.getHours();
  let minutes = date.getMinutes() + extraTime;
  if (minutes >= 60) {
    hour += 1;
    minutes = minutes % 60;
  }
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
// date formatter
function formatDate(date) {
  let day = String(date.getDate()).padStart(2, "0");
  let month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  let year = date.getFullYear();

  return `${day}/${month}/${year}`;
}
function formatIdInfo(input, data) {
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
  if (fields.region === "Περιοχή") {
    fields.region = "--- ";
  }
  // extract the data for ypefthini dilosi usage
  ypefthiniData = fields;

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
  }, με Α.Φ.Μ ------- / Δ.Ο.Υ. ${data.doy}, χρήστη της υπ'αριθ. ${
    fields.phoneNumber
  } τηλεφωνικής σύνδεσης, με διεύθυνση ηλεκτρονικού ταχυδρομείου (στερείται)`;
  return formattedString;
}
