// Genitive forms are stored accented and in sentence case, the way the reports
// print them ("του Δημητρίου"); the keys are the plain uppercase, unaccented
// names that come off an ID card.
const MALE_NAMES_MAP = {
  ΑΓΓΕΛΟΣ: "Αγγέλου",
  ΑΘΑΝΑΣΙΟΣ: "Αθανασίου",
  ΑΛΕΞΑΝΔΡΟΣ: "Αλεξάνδρου",
  ΑΝΤΩΝΙΟΣ: "Αντωνίου",
  ΑΝΔΡΕΑΣ: "Ανδρέα",
  ΑΡΙΣΤΕΙΔΗΣ: "Αριστείδη",
  ΒΑΣΙΛΕΙΟΣ: "Βασιλείου",
  ΓΕΩΡΓΙΟΣ: "Γεωργίου",
  ΓΡΗΓΟΡΙΟΣ: "Γρηγορίου",
  ΔΗΜΗΤΡΙΟΣ: "Δημητρίου",
  ΕΛΕΥΘΕΡΙΟΣ: "Ελευθερίου",
  ΕΥΑΓΓΕΛΟΣ: "Ευαγγέλου",
  ΕΥΘΥΜΙΟΣ: "Ευθυμίου",
  ΗΛΙΑΣ: "Ηλία",
  ΘΕΟΔΩΡΟΣ: "Θεοδώρου",
  ΙΩΑΝΝΗΣ: "Ιωάννη",
  ΚΩΝΣΤΑΝΤΙΝΟΣ: "Κωνσταντίνου",
  ΛΑΖΑΡΟΣ: "Λαζάρου",
  ΛΕΩΝΙΔΑΣ: "Λεωνίδα",
  ΜΑΡΚΟΣ: "Μάρκου",
  ΝΙΚΟΛΑΟΣ: "Νικολάου",
  ΠΑΝΑΓΙΩΤΗΣ: "Παναγιώτη",
  ΠΑΥΛΟΣ: "Παύλου",
  ΠΕΤΡΟΣ: "Πέτρου",
  ΣΑΒΒΑΣ: "Σάββα",
  ΣΠΥΡΙΔΩΝ: "Σπυρίδωνα",
  ΣΤΥΛΙΑΝΟΣ: "Στυλιανού",
  ΣΤΑΥΡΟΣ: "Σταύρου",
  ΑΝΑΣΤΑΣΙΟΣ: "Αναστασίου",
  ΧΑΡΑΛΑΜΠΟΣ: "Χαραλάμπου",
  ΧΡΗΣΤΟΣ: "Χρήστου",
};

const FEMALE_NAMES_MAP = {
  ΑΓΓΕΛΙΚΗ: "Αγγελικής",
  ΑΓΑΠΗ: "Αγάπης",
  ΑΝΑΣΤΑΣΙΑ: "Αναστασίας",
  ΑΙΚΑΤΕΡΙΝΗ: "Αικατερίνης",
  ΑΝΝΑ: "Άννας",
  ΑΡΕΤΗ: "Αρετής",
  ΑΡΙΑΔΝΗ: "Αριάδνης",
  ΒΑΣΙΛΙΚΗ: "Βασιλικής",
  ΔΑΝΑΗ: "Δανάης",
  ΔΑΦΝΗ: "Δάφνης",
  ΔΕΣΠΟΙΝΑ: "Δέσποινας",
  ΔΗΜΗΤΡΑ: "Δήμητρας",
  ΕΙΡΗΝΗ: "Ειρήνης",
  ΕΛΕΝΗ: "Ελένης",
  ΕΛΕΟΝΩΡΑ: "Ελεονώρας",
  ΕΛΕΥΘΕΡΙΑ: "Ελευθερίας",
  ΕΥΑΓΓΕΛΙΑ: "Ευαγγελίας",
  ΕΥΡΙΔΙΚΗ: "Ευριδίκης",
  ΓΕΩΡΓΙΑ: "Γεωργίας",
  ΘΕΟΔΩΡΑ: "Θεοδώρας",
  ΙΩΑΝΝΑ: "Ιωάννας",
  ΙΣΜΗΝΗ: "Ισμήνης",
  ΚΩΣΤΑΝΤΙΝΑ: "Κωνσταντίνας",
  ΚΑΛΛΙΟΠΗ: "Καλλιόπης",
  ΜΑΡΓΑΡΙΤΑ: "Μαργαρίτας",
  ΜΑΡΙΑ: "Μαρίας",
  ΝΙΚΟΛΕΤΑ: "Νικολέτας",
  ΝΑΤΑΛΙΑ: "Ναταλίας",
  ΠΑΡΑΣΚΕΥΗ: "Παρασκευής",
  ΠΑΝΑΓΙΩΤΑ: "Παναγιώτας",
  ΣΟΦΙΑ: "Σοφίας",
  ΣΤΑΥΡΟΥΛΑ: "Σταυρούλας",
  ΣΤΑΜΑΤΙΑ: "Σταματίας",
  ΧΑΡΙΚΛΕΙΑ: "Χαρίκλειας",
  ΧΑΡΟΥΛΑ: "Χαρούλας",
  ΧΡΙΣΤΙΝΑ: "Χριστίνας",
  ΧΡΥΣΑ: "Χρύσας",
  ΦΩΤΕΙΝΗ: "Φωτεινής",
};

// A name may arrive accented (typed by hand) or not (read from an ID), so both
// reach the maps through the same accent-free uppercase key.
const genitiveKey = (name) =>
  (name || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .normalize("NFC")
    .toUpperCase();

export function toGenitiveMale(name) {
  return MALE_NAMES_MAP[genitiveKey(name)] ?? name;
}

export function toGenitiveFemale(name) {
  return FEMALE_NAMES_MAP[genitiveKey(name)] ?? name;
}
const genderMap = {
  Γυναίκα: {
    o: "η",
    oo: "α",
    tou: "της",
    os: "η",
    ou: "ης",
    as: "ας",
    ouu: "ής",
    ton: "την",
    on: "ούσα",
    hs: "ιδα",
    wn: "ούσα",
    wnn: "ουσα",
    wnnY: "ΟΥΣΑ",
    onn: "ήν",
    ellinas: "Ελληνίδα",
    osa: "α",
    ontas: "ούσα",
    onta: "ούσας",
    eis: "είσα",
    enta: "είσα",
    oY: "Η",
    sa: "σα",
  },
  Άνδρας: {
    o: "ο",
    oo: "ο",
    tou: "του",
    os: "ος",
    as: "ου",
    ou: "ου",
    ouu: "ού",
    ton: "τον",
    on: "όντας",
    hs: "ης",
    wn: "ών",
    wnn: "ων",
    wnnY: "ΩΝ",
    onn: "όν",
    ellinas: "Έλληνας",
    osa: "ος",
    ontas: "όντας",
    onta: "όντα",
    eis: "είς",
    enta: "έντα",
    oY: "Ο",
    sa: "ς",
  },
};
export function applyAllGrammar(state) {
  // Define everything in one place: The source of the gender and the suffix to use
  const config = [
    { gender: state.ypoptosData?.sex, suffix: "S" }, // Suspect
    { gender: state.victimData?.sex, suffix: "V" }, // Victim
    { gender: state.aAnakrSex, suffix: "A1" }, // Officer 1
    { gender: state.bAnakrSex, suffix: "A2" }, // Officer 2
    { gender: state.astynomikosSex || "Άνδρας", suffix: "AS" }, // Police officer, male if unset
    { gender: state.dioikitisSex || "Άνδρας", suffix: "D" }, // Commander, male if unset
  ];

  const keys = ["o", "tou", "os", "ou", "ton", "on"];

  config.forEach(({ gender, suffix }) => {
    if (!gender) {
      // Clear variables if sex is not defined
      keys.forEach((key) => (state[`${key}${suffix}`] = ""));
    } else {
      // Get the Greek rules (Defaulting to "Άνδρας" if mapping fails)
      const rules = genderMap[gender] || genderMap["Άνδρας"];

      // Map each grammar rule to the state with the suffix (e.g., state.oS = "η")
      Object.keys(rules).forEach((key) => {
        state[`${key}${suffix}`] = rules[key];
      });
    }
  });
}
