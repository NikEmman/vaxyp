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
// helper function to convert anakritikos to enikos
export function convertAnakritikosToEnikos(value, state) {
  return state.anakritikoiEnikos[state.anakritikoi.indexOf(value)];
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
    fields.ownerFatherName
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

//person formatter for manual info entry
export function extractPersonInfo(formId) {
  const formData = new FormData(document.getElementById(formId));

  return {
    nationality: formData.get("nationality"),
    surname: formData.get("surname"),
    firstName: formData.get("firstName"),
    fatherName: formData.get("fatherName"),
    motherName: formData.get("motherName"),
    birthDate: formData.get("birthDate"),
    birthPlace: formData.get("birthPlace"),
    docuType: formData.get("docuType"),
    idNumber: formData.get("idNumber"),
    issuingAuthority: formData.get("issuingAuthority"),
    issueDate: formData.get("issueDate"),
    phoneNumber: formData.get("phoneNumber"),
    email: formData.get("email"),
    street: formData.get("street"),
    streetNumber: formData.get("streetNumber"),
    area: formData.get("area"),
    sex: formData.get("sex"),
  };
}
export function formatFormData(data) {
  return `(Επ)${data.surname} (Ον)${capitalize(
    data.firstName
  )} του ${capitalize(toGenitiveMale(data.fatherName))} και της ${capitalize(
    toGenitiveFemale(data.motherName)
  )}, γεν. ${data.birthDate} στην ${capitalize(
    data.birthPlace
  )}, κάτοικος ${capitalize(data.area)}, οδός ${capitalize(data.street)} αρ. ${
    data.streetNumber
  }, κάτοχος του υπ'αριθ ${data.idNumber} ${data.docuType} εκδ. ${
    data.issueDate
  } από ${data.issuingAuthority} χρήστης της υπ'αριθ. ${
    data.phoneNumber
  } τηλεφωνικής σύνδεσης, email: ${data.email}`;
}

export function shortenFormattedOfficer(officerString) {
  const splitString = officerString.split(" ");
  // gets the first 3 elements of the array, rank, surname, name
  return `${splitString[0]} ${splitString[1]} ${splitString[2]}`;
}
export function removeRank(officerString) {
  const splitString = officerString.split(" ");
  //remove the first element and join with gap
  return splitString.shift().join(" ");
}
export function getOfficerSurname(officerString) {
  return officerString.split(" ")[1];
}
