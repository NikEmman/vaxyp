const { driver } = window.driver.js;

function startSketcherTour() {
  const tourDriver = driver({
    showProgress: true,
    nextBtnText: "Επόμενο",
    prevBtnText: "Προηγούμενο",
    doneBtnText: "Τέλος",
    steps: [
      {
        element: "#palette",
        popover: {
          title: "1. Παλέτα στοιχείων",
          description:
            "Εδώ θα βρείτε όλα τα διαθέσιμα στοιχεία του σκαριφήματος, χωρισμένα σε κατηγορίες (δρόμοι, στροφές, νησίδες, διαγραμμίσεις, πινακίδες, οχήματα κ.ά.). Χρησιμοποιήστε την αναζήτηση ή το αναπτυσσόμενο μενού για να βρείτε γρήγορα αυτό που ψάχνετε, και σύρετέ το πάνω στον καμβά.",
          side: "right",
          align: "start",
        },
      },
      {
        element: "#toolbar-tools-group",
        popover: {
          title: "2. Εργαλεία",
          description:
            "Τα βασικά εργαλεία επεξεργασίας: Επιλογή (μετακίνηση/αλλαγή μεγέθους στοιχείων), Περιστροφή αριστερά/δεξιά, Διαγραφή επιλεγμένου στοιχείου, Μέτρηση απόστασης, Γόμα, Αναίρεση, και ο διακόπτης για εμφάνιση/απόκρυψη του κανάβου.",
          side: "bottom",
          align: "start",
        },
      },
      {
        element: "#segment-length-input",
        popover: {
          title: "3. Μήκος τμήματος",
          description:
            "Στοιχεία όπως ευθείες δρόμου, σιδηροδρομικές γραμμές, νησίδες ή ίχνη φρεναρίσματος μπορούν να προστεθούν με προσαρμοσμένο μήκος. Ρυθμίστε το μήκος από αυτό το slider πριν σύρετε το αντίστοιχο στοιχείο στον καμβά.",
          side: "bottom",
        },
      },
      {
        element: "#toolbar-export-group",
        popover: {
          title: "4. Εξαγωγή",
          description:
            "Όταν ολοκληρώσετε το σκαρίφημά σας, εξάγετέ το σε αρχείο εικόνας (PNG) ή εγγράφου (PDF).",
          side: "bottom",
        },
      },
      {
        element: "#toolbar-sketch-io-group",
        popover: {
          title: "5. Αποθήκευση & Φόρτωση",
          description:
            "Αποθηκεύστε το τρέχον σκαρίφημα με ένα όνομα ώστε να συνεχίσετε αργότερα, ή φορτώστε ένα σκαρίφημα που έχετε ήδη αποθηκεύσει. Τα σκαριφήματα αποθηκεύονται τοπικά στον browser σας.",
          side: "bottom",
          align: "end",
        },
      },
    ],
  });
  tourDriver.drive();
}

function initSketcherTourGuide() {
  document
    .getElementById("tour-help")
    .addEventListener("click", startSketcherTour);
}

initSketcherTourGuide();
