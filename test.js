function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";
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
  const capitalize = (str) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
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
  }, με Α.Φ.Μ ------- / Δ.Ο.Υ. Κομοτηνής, με τηλέφωνο ${
    fields.phoneNumber
  }, με email (στερείται)`;

  return formattedString;
}
// Test the function
const testInput = `Α.Δ.Τ
  Α00544988
  Α.Δ.Τ. Αντικατάστασης
  Αιτία Αντικατάστασης
  Φύλο
  Άντρας
  Επώνυμο
  ΙΣΜΑΗΛ ΟΓΛΟΥ
  Επώνυμο (Λατιν.)
  ISMAIL OGLOU
  Όνομα
  ΖΕΚΗ
  Όνομα (Λατιν.)
  ZEKI
  Όνομα Πατρός
  ΣΟΥΛΕΪΜΑΝ
  Όνομα Πατέρα (Λατιν.)
  SOULEIMAN
  Επώνυμο Πατρός
  ΙΣΜΑΗΛ ΟΓΛΟΥ
  Όνομα Μητρός
  ΦΑΤΜΕ
  FATME
  Επώνυμο Μητρός
  ΧΟΥΣΝΗ
  Ημ/νία Γέννησης
  29/08/2010
  Τόπος Γέννησης
  ΑΛΕΞΑΝΔΡΟΥΠΟΛΗ ΕΒΡΟΥ
  ALEXANDROUPOLI EVROU
  Χώρα Γέννησης
  ΕΛΛΑΔΑ
  Αρχή Έκδοσης
  13301 - Υ.Α. ΑΛΕΞΑΝΔΡΟΥΠΟΛΗΣ
  Ημ/νια Έκδοσης
  23/05/2024
  Ημερομηνία Λήξης
  22/05/2034
  Ομάδα Αίματος
  ΑΓΝΩΣΤΟ
  Ύψος
  Δημότης
  Αλεξανδρούπολης
  Αριθμός Δημοτολογίου
  49161/3
  Στοιχεία Επικοινωνίας
  Νομός
  ΕΒΡΟΥ
  Περιοχή
  ΑΛΕΞΑΝΔΡΟΥΠΟΛΗ
  Οδός
  ΑΒΑΝΤΟΣ
  Αριθμός
  Ταχ.Κώδικας
  Τηλέφωνο
  6943708013
  Άλλα στοιχεία επικοινωνίας`;

console.log(formatIdInfo(testInput));
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
testveh = `Αρ.Κυκλοφ
ΚΟΝ8872
Πλαίσιο
TSMLYDD1S00B09428
Αρ. Κινητήρα
K14D
Ισχύ
0100
Μάρκα
SUZUKI
Μοντέλο
VITARA
Είδος
ΕΠΙΒΑΤΗΓΟ
Χρώμα
ΕΡΥΘΡΟ
Χρήση
Ι.Χ
Τύπος
ΑΓΝΩΣΤΟ
Καύσιμο
ΑΜΟΛ.ΥΒΡΙΔΙΚΟ
Ωφέλιμο Φορτίο
00000
Νέος/Παλιός Αρ. Κυκλοφ.
Στοιχεία Ιδιοκτήτη
Επώνυμο
ΕΜΜΑΝΟΥΗΛΙΔΗΣ
Όνομα
ΝΙΚΟΛΑΟΣ
Πατρώνυμο
ΣΤΕΦΑΝΟΣ
Διεύθυνση
Α ΡΩΣΣΙΔΗ 6
Πόλη
ΚΟΜΟΤΗΝΗ
Νομός
ΡΟΔΟΠΗΣ
Ταχ. Κωδικός
69132`;
testMot = `Αρ.Κυκλοφ
ΚΟΤ0996
Πλαίσιο
XG8DY100A1G000268
Αρ. Κινητήρα
150FM01094722
Ισχύ
0010
Μάρκα
GORGOLIS S.A.
Μοντέλο
DY 100A
Είδος
ΔΙΚΥΚΛΟ
Χρώμα
ΛΕΥΚΟ
Χρήση
Ι.Χ
Τύπος
ΑΓΝΩΣΤΟ
Καύσιμο
ΒΕΝΖΙΝΗ
Ωφέλιμο Φορτίο
00000
Νέος/Παλιός Αρ. Κυκλοφ.
Στοιχεία Ιδιοκτήτη
Επώνυμο
ΜΕΧΜΕΤ
Όνομα
ΧΑΛΗΛ
Πατρώνυμο
ΜΕΧΜΕΤ
Διεύθυνση
ΤΗΡΕΩΣ 2
Πόλη
ΚΟΜΟΤΗΝΗΣ
Νομός
ΡΟΔΟΠΗΣ
Ταχ. Κωδικός
69100`;
// console.log(formatVehicleInfo(testveh));
// console.log(formatVehicleInfo(testMot));
