const MALE_NAMES_MAP = {
  ΑΓΓΕΛΟΣ: "ΑΓΓΕΛΟΥ",
  ΑΘΑΝΑΣΙΟΣ: "ΑΘΑΝΑΣΙΟΥ",
  ΑΛΕΞΑΝΔΡΟΣ: "ΑΛΕΞΑΝΔΡΟΥ",
  ΑΝΤΩΝΙΟΣ: "ΑΝΤΩΝΙΟΥ",
  ΑΝΔΡΕΑΣ: "ΑΝΔΡΕΑ",
  ΑΡΙΣΤΕΙΔΗΣ: "ΑΡΙΣΤΕΙΔΗ",
  ΒΑΣΙΛΕΙΟΣ: "ΒΑΣΙΛΕΙΟΥ",
  ΓΕΩΡΓΙΟΣ: "ΓΕΩΡΓΙΟΥ",
  ΓΡΗΓΟΡΙΟΣ: "ΓΡΗΓΟΡΙΟΥ",
  ΔΗΜΗΤΡΙΟΣ: "ΔΗΜΗΤΡΙΟΥ",
  ΕΛΕΥΘΕΡΙΟΣ: "ΕΛΕΥΘΕΡΙΟΥ",
  ΕΥΑΓΓΕΛΟΣ: "ΕΥΑΓΓΕΛΟΥ",
  ΕΥΘΥΜΙΟΣ: "ΕΥΘΥΜΙΟΥ",
  ΗΛΙΑΣ: "ΗΛΙΑ",
  ΘΕΟΔΩΡΟΣ: "ΘΕΟΔΩΡΟΥ",
  ΙΩΑΝΝΗΣ: "ΙΩΑΝΝΗ",
  ΚΩΝΣΤΑΝΤΙΝΟΣ: "ΚΩΝΣΤΑΝΤΙΝΟΥ",
  ΛΑΖΑΡΟΣ: "ΛΑΖΑΡΟΥ",
  ΛΕΩΝΙΔΑΣ: "ΛΕΩΝΙΔΑ",
  ΜΑΡΚΟΣ: "ΜΑΡΚΟΥ",
  ΝΙΚΟΛΑΟΣ: "ΝΙΚΟΛΑΟΥ",
  ΠΑΝΑΓΙΩΤΗΣ: "ΠΑΝΑΓΙΩΤΗ",
  ΠΑΥΛΟΣ: "ΠΑΥΛΟΥ",
  ΠΕΤΡΟΣ: "ΠΕΤΡΟΥ",
  ΣΑΒΒΑΣ: "ΣΑΒΒΑ",
  ΣΠΥΡΙΔΩΝ: "ΣΠΥΡΙΔΩΝΑ",
  ΣΤΥΛΙΑΝΟΣ: "ΣΤΥΛΙΑΝΟΥ",
  ΣΤΑΥΡΟΣ: "ΣΤΑΥΡΟΥ",
  ΑΝΑΣΤΑΣΙΟΣ: "ΑΝΑΣΤΑΣΙΟΥ",
  ΧΑΡΑΛΑΜΠΟΣ: "ΧΑΡΑΛΑΜΠΟΥ",
  ΧΡΗΣΤΟΣ: "ΧΡΗΣΤΟΥ",
};

const FEMALE_NAMES_MAP = {
  ΑΓΓΕΛΙΚΗ: "ΑΓΓΕΛΙΚΗΣ",
  ΑΓΑΠΗ: "ΑΓΑΠΗΣ",
  ΑΝΑΣΤΑΣΙΑ: "ΑΝΑΣΤΑΣΙΑΣ",
  ΑΙΚΑΤΕΡΙΝΗ: "ΑΙΚΑΤΕΡΙΝΗΣ",
  ΑΝΝΑ: "ΑΝΝΑΣ",
  ΑΡΕΤΗ: "ΑΡΕΤΗΣ",
  ΑΡΙΑΔΝΗ: "ΑΡΙΑΔΝΗΣ",
  ΒΑΣΙΛΙΚΗ: "ΒΑΣΙΛΙΚΗΣ",
  ΔΑΝΑΗ: "ΔΑΝΑΗΣ",
  ΔΑΦΝΗ: "ΔΑΦΝΗΣ",
  ΔΕΣΠΟΙΝΑ: "ΔΕΣΠΟΙΝΑΣ",
  ΔΗΜΗΤΡΑ: "ΔΗΜΗΤΡΑΣ",
  ΕΙΡΗΝΗ: "ΕΙΡΗΝΗΣ",
  ΕΛΕΝΗ: "ΕΛΕΝΗΣ",
  ΕΛΕΟΝΩΡΑ: "ΕΛΕΟΝΩΡΑΣ",
  ΕΛΕΥΘΕΡΙΑ: "ΕΛΕΥΘΕΡΙΑΣ",
  ΕΥΑΓΓΕΛΙΑ: "ΕΥΑΓΓΕΛΙΑΣ",
  ΕΥΡΙΔΙΚΗ: "ΕΥΡΙΔΙΚΗΣ",
  ΓΕΩΡΓΙΑ: "ΓΕΩΡΓΙΑΣ",
  ΘΕΟΔΩΡΑ: "ΘΕΟΔΩΡΑΣ",
  ΙΩΑΝΝΑ: "ΙΩΑΝΝΑΣ",
  ΙΣΜΗΝΗ: "ΙΣΜΗΝΗΣ",
  ΚΩΣΤΑΝΤΙΝΑ: "ΚΩΝΣΤΑΝΤΙΝΑΣ",
  ΚΑΛΛΙΟΠΗ: "ΚΑΛΛΙΟΠΗΣ",
  ΜΑΡΓΑΡΙΤΑ: "ΜΑΡΓΑΡΙΤΑΣ",
  ΜΑΡΙΑ: "ΜΑΡΙΑΣ",
  ΝΙΚΟΛΕΤΑ: "ΝΙΚΟΛΕΤΑΣ",
  ΝΑΤΑΛΙΑ: "ΝΑΤΑΛΙΑΣ",
  ΠΑΡΑΣΚΕΥΗ: "ΠΑΡΑΣΚΕΥΗΣ",
  ΠΑΝΑΓΙΩΤΑ: "ΠΑΝΑΓΙΩΤΑΣ",
  ΣΟΦΙΑ: "ΣΟΦΙΑΣ",
  ΣΤΑΥΡΟΥΛΑ: "ΣΤΑΥΡΟΥΛΑΣ",
  ΣΤΑΜΑΤΙΑ: "ΣΤΑΜΑΤΙΑΣ",
  ΧΑΡΙΚΛΕΙΑ: "ΧΑΡΙΚΛΕΙΑΣ",
  ΧΑΡΟΥΛΑ: "ΧΑΡΟΥΛΑΣ",
  ΧΡΙΣΤΙΝΑ: "ΧΡΙΣΤΙΝΑΣ",
  ΧΡΥΣΑ: "ΧΡΥΣΑΣ",
  ΦΩΤΕΙΝΗ: "ΦΩΤΕΙΝΗΣ",
};

export function toGenitiveMale(name) {
  return MALE_NAMES_MAP[name] ?? name;
}

export function toGenitiveFemale(name) {
  return FEMALE_NAMES_MAP[name] ?? name;
}
const genderMap = {
  Γυναίκα: {
    o: "η",
    tou: "της",
    os: "η",
    ou: "ης",
    ton: "την",
    on: "ούσα",
    ellinas: "Ελληνίδα",
    osa: "α",
    ontas: "ούσα",
    eis: "είσα",
    oY: "Η",
  },
  Άνδρας: {
    o: "ο",
    tou: "του",
    os: "ος",
    ou: "ου",
    ton: "τον",
    on: "όντας",
    ellinas: "Έλληνας",
    osa: "ος",
    ontas: "όντας",
    eis: "είς",
    oY: "Ο",
  },
};
export function applyAllGrammar(state) {
  // Define everything in one place: The source of the gender and the suffix to use
  const config = [
    { gender: state.ypoptosData?.sex, suffix: "S" }, // Suspect
    { gender: state.victimData?.sex, suffix: "V" }, // Victim
    { gender: state.aAnakrSex, suffix: "A1" }, // Officer 1
    { gender: state.bAnakrSex, suffix: "A2" }, // Officer 2
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
