import { toGenitiveFemale, toGenitiveMale } from "./grammar.js";
//time formatter
export function roundDownMinutes(minutes) {
  return minutes - (minutes % 5); // rounds down minutes to miltiplicatives of 5, ie 39 becomes 35
}
export function formatTime(date, extraTime = 0) {
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
export function getNextDay(dateString) {
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
// Helper function to capitalize first letter of each word
export function capitalize(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
// Officer names: rank and name are stored separately in anakritikoiParts, and
// also joined into the anakritikoi / anakritikoiEnikos strings, which older
// app versions and the initial text read.
export function cleanSpaces(str) {
  return (str || "").trim().replace(/\s+/g, " ");
}

export function joinRankName(rank, name) {
  return cleanSpaces(`${rank || ""} ${name || ""}`);
}

// Best-effort split for data saved before rank had its own field:
// first word is the rank, everything after it is the name.
export function splitRankName(full) {
  const cleaned = cleanSpaces(full);
  const gap = cleaned.indexOf(" ");
  if (gap === -1) return { rank: "", name: cleaned };
  return { rank: cleaned.slice(0, gap), name: cleaned.slice(gap + 1) };
}

export function getOfficerParts(data, index) {
  const genitive = data.anakritikoi?.[index] || "";
  const nominative = data.anakritikoiEnikos?.[index] || genitive;
  const stored = data.anakritikoiParts?.[index];
  // Trust stored parts only if they still match the joined strings, in case
  // the strings were edited without them (hand-edited or old-version JSON).
  if (
    stored &&
    joinRankName(stored.rankGen, stored.nameGen) === cleanSpaces(genitive) &&
    joinRankName(stored.rankNom, stored.nameNom) === cleanSpaces(nominative)
  ) {
    return stored;
  }
  const gen = splitRankName(genitive);
  const nom = splitRankName(nominative);
  return {
    rankGen: gen.rank,
    nameGen: gen.name,
    rankNom: nom.rank,
    nameNom: nom.name,
  };
}

// helper function to shorten victim's formatted text
export function shortenFormattedPerson(formattedString) {
  return formattedString.split(", με Α.Φ.Μ")[0];
}
// formatters
export function formatVehicleInfo(input) {
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
    fields.ownerFatherName,
  )}`;
}
export function formatIdInfo(input, data, state, suspect = false) {
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
      fatherSurname: getValue("Επώνυμο Πατρός"),
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
    fields.fatherNameGen = toGenitiveMale(fields.fatherName);
    // holders of an Α.Δ.Τ. (Greek national ID card) are Greek citizens by law
    fields.nationality = "ΕΛΛΗΝΙΚΗ";

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
    suspect ? (state.ypoptosData = fields) : (state.victimData = fields);

    // Format the output string
    const formattedString = `${fields.surname} ${capitalize(
      fields.firstName,
    )} του ${capitalize(
      toGenitiveMale(fields.fatherName),
    )} και της ${capitalize(toGenitiveFemale(fields.motherName))}, γεν. ${
      fields.birthDate
    } στην ${capitalize(
      fields.birthPlace,
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
      fatherSurname: getValue("Επώνυμο"),
      motherSurname: getValue("Γένος (Μητέρας)"),
      birthDate: formatDate(getValue("Ημερομηνία Γέννησης")),
      sex: getValue("Φύλο"),
      birthPlace: getValue("Χώρα Γέννησης"),
      nationality: getValue("Υπηκοότητα(ες)"),
    };
    fields.fatherNameGen = toGenitiveMale(fields.fatherName);

    // extract the data for ypefthini dilosi usage
    suspect ? (state.ypoptosData = fields) : (state.victimData = fields);

    // Format the output string
    const formattedString = `${fields.surname} ${fields.firstName} του ${fields.fatherName} και της ${fields.motherName}, υπηκοότητα ${fields.nationality}, γεν. ${fields.birthDate} στ ${fields.birthPlace}, κάτοικος ****, οδός **** αρ. ****`;
    return formattedString;
  }
}
// age in full years on referenceDate, from a DD-MM-YYYY birth date
export function calculateAge(birthDateStr, referenceDate) {
  const [day, month, year] = (birthDateStr || "").split("-").map(Number);
  if (!day || !month || !year) return "";
  let age = referenceDate.getFullYear() - year;
  const hadBirthdayThisYear =
    referenceDate.getMonth() + 1 > month ||
    (referenceDate.getMonth() + 1 === month && referenceDate.getDate() >= day);
  if (!hadBirthdayThisYear) age--;
  return String(age);
}

// The keyword swap drops its value straight into document.xml, so {suspectsList}
// carries its own runs: bold keys, plain values and breaks between the entries.
const xmlEscape = (text) =>
  String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const KATAGRAFI_FONT =
  '<w:rFonts w:cs="Arial" w:ascii="Arial" w:hAnsi="Arial"/><w:sz w:val="24"/><w:szCs w:val="24"/>';

const katagrafiRun = (text, bold) =>
  `<w:r><w:rPr>${KATAGRAFI_FONT}${bold ? "<w:b/>" : '<w:b w:val="false"/>'}` +
  `</w:rPr><w:t xml:space="preserve">${xmlEscape(text)}</w:t></w:r>`;

const KATAGRAFI_LINE_BREAK = "<w:r><w:br/></w:r>";

// numbered entries ("N. Επώνυμο: ... ΤΟΠΟΣ ΕΛΕΓΧΟΥ: -") for every stored suspect;
// fields the app doesn't collect (driving licence, AFM, alcohol readings, stop
// location) are left as "-" for the officer to fill in by hand
export function formatSuspectsForKatagrafi(suspects) {
  if (!suspects.length) return "";

  const entries = suspects.map(({ data }, index) => {
    const d = data || {};
    const field = (value) => value || "-";
    const address =
      cleanSpaces(`${d.street || ""} ${d.streetNumber || ""}`) || "-";
    const pairs = [
      [`${index + 1}. Επώνυμο: `, `${field(d.surname)} `],
      ["Όνομα: ", `${field(d.firstName)} `],
      ["Πατρώνυμο: ", `${field(d.fatherName)} `],
      ["Μητρώνυμο: ", `${field(d.motherName)} `],
      ["Ημ.γεν. ", `${field(d.birthDate)} `],
      ["Τόπος γέννησης: ", `${field(d.birthPlace)}, `],
      ["κάτοικος: ", `${field(d.area)}, `],
      ["οδός: ", `${address}, `],
      ["Υπηκοότητα: ", `${field(d.nationality)} `],
      ["με Α.Δ.Τ.: ", `${field(d.idNumber)} `],
      ["Α.Φ.Μ: ", "-, "],
      ["Αριθμός άδειας οδηγήσεως: ", "-, "],
      ["Κατηγορία: ", "-, "],
      ["Ποσοστό Αιθυλικής Αλκοόλης: ", "α) - mg/lt β) - mg/lt."],
    ];
    return (
      pairs
        .map(([key, value]) => katagrafiRun(key, true) + katagrafiRun(value, false))
        .join("") +
      KATAGRAFI_LINE_BREAK +
      katagrafiRun("ΤΟΠΟΣ ΕΛΕΓΧΟΥ: ", true) +
      katagrafiRun("-", false)
    );
  });

  // close the run holding the keyword, then reopen one for the template to close
  return (
    "</w:t></w:r>" +
    entries.join(KATAGRAFI_LINE_BREAK + KATAGRAFI_LINE_BREAK) +
    `<w:r><w:rPr>${KATAGRAFI_FONT}<w:b w:val="false"/></w:rPr><w:t xml:space="preserve">`
  );
}

// <input type="date"> hands back YYYY-MM-DD, while the scanned documents and
// everything that reads a date back - the age on the Δελτίο Διερεύνησης, the
// issue year on the Δελτίο Φερόμενου, the dates printed in the reports - work
// in DD-MM-YYYY. The two sources are brought to the same shape here.
const fromDateInput = (value) => {
  const [year, month, day] = (value || "").split("-");
  return day ? `${day}-${month}-${year}` : value || "";
};

//person formatter for manual info entry
export function extractPersonInfo(formId) {
  const formData = new FormData(document.getElementById(formId));

  const fields = {
    nationality: formData.get("nationality"),
    surname: formData.get("surname"),
    firstName: formData.get("firstName"),
    fatherName: formData.get("fatherName"),
    fatherSurname: formData.get("surname"),
    motherName: formData.get("motherName"),
    motherSurname: "",
    birthDate: fromDateInput(formData.get("birthDate")),
    birthPlace: formData.get("birthPlace"),
    docuType: formData.get("docuType"),
    idNumber: formData.get("idNumber"),
    issuingAuthority: formData.get("issuingAuthority"),
    issueDate: fromDateInput(formData.get("issueDate")),
    phoneNumber: formData.get("phoneNumber"),
    email: formData.get("email"),
    street: formData.get("street"),
    streetNumber: formData.get("streetNumber"),
    area: formData.get("area"),
    sex: formData.get("sex"),
  };
  // the scanned paths carry the patronymic in the genitive as well, and the
  // person objects are copied over the state wholesale: without it here, a
  // manually entered suspect would keep the previous one's showing through
  fields.fatherNameGen = toGenitiveMale(fields.fatherName);
  return fields;
}
export function formatFormData(data) {
  return `${data.surname.toUpperCase()} ${capitalize(
    data.firstName,
  )} του ${capitalize(toGenitiveMale(data.fatherName))} και της ${capitalize(
    toGenitiveFemale(data.motherName),
  )}, γεν. ${data.birthDate} στην ${capitalize(
    data.birthPlace,
  )}, κάτοικος ${capitalize(data.area)}, οδός ${capitalize(data.street)} αρ. ${
    data.streetNumber
  }, κάτοχος του υπ'αριθ ${data.idNumber} ${data.docuType} εκδ. ${
    data.issueDate
  } από ${data.issuingAuthority} χρήστης της υπ'αριθ. ${
    data.phoneNumber
  } τηλεφωνικής σύνδεσης, email: ${data.email}`;
}

// Police officers (astynomikoi): stored as one paragraph "rank name, details",
// which older app versions and the {astynomikos} placeholder read, with the
// separate fields in astynomikoiParts.
export function joinOfficerText({ rank, name, details }) {
  const head = joinRankName(rank, name);
  const rest = cleanSpaces(details).replace(/^,\s*/, "");
  if (!head) return rest;
  return rest ? `${head}, ${rest}` : head;
}

// Best-effort split for officers saved as a single paragraph: rank and name
// end at the first comma; without one, fall back to the old three-word rule.
export function splitOfficerText(text) {
  const cleaned = cleanSpaces(text);
  const comma = cleaned.indexOf(",");
  let head;
  let details;
  if (comma === -1) {
    const words = cleaned.split(" ");
    head = words.slice(0, 3).join(" ");
    details = words.slice(3).join(" ");
  } else {
    head = cleaned.slice(0, comma);
    details = cleaned.slice(comma + 1).trim();
  }
  const { rank, name } = splitRankName(head);
  return { rank, name, details };
}

export function getAstynomikosParts(data, index) {
  const text = data.astynomikoi?.[index] || "";
  const stored = data.astynomikoiParts?.[index];
  // Trust stored parts only if they still join to the saved paragraph, e.g.
  // not after an older app version added or removed officers.
  if (stored && joinOfficerText(stored) === cleanSpaces(text)) return stored;
  return splitOfficerText(text);
}
export function getSuspectSurname(suspectString) {
  return suspectString.split(" ")[0];
}
