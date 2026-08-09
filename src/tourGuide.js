import { setPendingTour, clearPendingTour } from "./stateManager.js";

const { driver } = window.driver.js;

function activateTab(name) {
  const tab = document.querySelector(`[data-tour-tab="${name}"]`);
  if (tab && !tab.classList.contains("clicked")) {
    tab.click();
  }
}

function openPersonHelp() {
  const dialog = document.getElementById("person-dialog");
  // Use show() instead of the app's own showModal() click handler: a
  // modal dialog is promoted to the browser's top layer, which always
  // paints above driver.js's overlay/popover no matter their z-index.
  if (dialog && !dialog.open) dialog.show();
}

function closePersonHelp() {
  const dialog = document.getElementById("person-dialog");
  if (dialog && dialog.open) dialog.close();
}

function openDocxHelp() {
  const dialog = document.getElementById("docx-dialog");
  if (dialog && !dialog.open) dialog.show();
}

function closeDocxHelp() {
  const dialog = document.getElementById("docx-dialog");
  if (dialog && dialog.open) dialog.close();
}

function openKeywordsHelp() {
  const dialog = document.getElementById("keywords-dialog");
  if (dialog && !dialog.open) dialog.show();
}

function closeKeywordsHelp() {
  const dialog = document.getElementById("keywords-dialog");
  if (dialog && dialog.open) dialog.close();
}

function clickFormLink() {
  document.querySelector(".fileUploader a")?.click();
}

const guides = {
  getStarted: {
    label: "Αρχική καταχώρηση στοιχείων",
    steps: [
      {
        element: ".fileUploader a",
        popover: {
          title: "Καταχώρηση στοιχείων υπηρεσίας",
          description:
            "Πατήστε «Επόμενο» για να μεταβείτε στη Φόρμα και να καταχωρήσετε τα στοιχεία της υπηρεσίας σας.",
          showButtons: ["next", "close"],
          onNextClick: clickFormLink,
        },
      },
      {
        page: "form",
        element: "#anakritikoiSection",
        popover: {
          title: "Ανακριτικοί Υπάλληλοι",
          description:
            "Προσθέστε εδώ τα στοιχεία των ανακριτικών σας υπαλλήλων, στη γενική και στην ονομαστική, όπως φαίνεται στα υποδείγματα των πεδίων. Προσθέστε ή αφαιρέστε ανακριτικούς με τα αντίστοιχα κουμπιά.",
          side: "right",
          align: "start",
        },
      },
      {
        page: "form",
        element: ".fields",
        popover: {
          title: "Στοιχεία Υπηρεσίας",
          description:
            "Συμπληρώστε τα στοιχεία της υπηρεσίας σας. Όταν ολοκληρώσετε, πατήστε «Αποθήκευση» για να αποθηκευτούν τα δεδομένα σας τοπικά. Θα κατέβει επίσης ένα αρχείο «data.json», φυλάξτε το ως αντίγραφο ασφαλείας.",
        },
      },
      {
        page: "form",
        element: "header a",
        popover: {
          title: "Ολοκληρώθηκε!",
          description:
            "Έτοιμοι! Επιστρέψτε στην αρχική σελίδα για να δημιουργήσετε την πρώτη σας Έκθεση.",
        },
      },
    ],
  },
  firstReport: {
    label: "Φτιάξτε την πρώτη σας έκθεση",
    steps: [
      {
        element: ".top",
        popover: {
          title: "1. Ανακριτικοί Υπάλληλοι",
          description:
            "Επιλέξτε τον Α' και τον Β' ανακριτικό υπάλληλο. Αν δεν έχετε προσθέσει ακόμα ανακριτικούς, δείτε πρώτα τον οδηγό 'Αρχική καταχώρηση στοιχείων'.",
        },
      },
      {
        element: '[data-tour-tab="persons"]',
        popover: {
          title: "2. Μετατροπέας ατόμων",
          description:
            "Έπειτα μεταβείτε στην καρτέλα 'Μετατροπέας ατόμων' για να μορφοποιήσετε τα στοιχεία του παθόντα ή του δράστη.",
        },
        onHighlightStarted: () => activateTab("persons"),
      },
      {
        element: "#person-dialog img",
        popover: {
          title: "3. Αντιγραφή στοιχείων από POL",
          description:
            "Aντιγράψτε τα στοιχεία του ατόμου από την εφαρμογή Ταυτότητες του POL, όπως δείχνει η εικόνα.",
        },
        onHighlightStarted: () => openPersonHelp(),
      },
      {
        element: "#taytotita",
        popover: {
          title: "4. Επικόλληση στοιχείων",
          description:
            "Eπικολλήστε (Ctrl+V) τα στοιχεία που αντιγράψατε σε αυτό το πεδίο για παθόντα, ή πιο στο πιο κάτω αντιστοιχο πεδίο για δράστη/κατηγορούμενο.",
        },
        onHighlightStarted: () => closePersonHelp(),
      },
      {
        element: ".clipboard-id.output",
        popover: {
          title: "5. Μορφοποιημένο αποτέλεσμα",
          description:
            "Τα στοιχεία του ατόμου θα μορφοποιηθούν αυτόματα σε μορφή κατάλληλη για τις Εκθέσεις.",
        },
      },
      {
        element: ".clipboard-id.output",
        popover: {
          title: "6. Επεξεργάσιμο κείμενο",
          description:
            "Μπορείτε να επεξεργαστείτε ελεύθερα το κείμενο εξόδου. Η τελική, επεξεργασμένη έκδοση είναι αυτή που θα περάσει στις αντίστοιχες Εκθέσεις.",
        },
      },
      {
        element: ".personsTab .anakritikoi",
        popover: {
          title: "7. Άτομο εκτός POL",
          description:
            "Αν το άτομο δεν βρίσκεται στο POL (π.χ. αλλοδαπός υπήκοος), αλλάξτε την επιλογή σε 'Όχι' για να καταχωρήσετε τα στοιχεία του χειροκίνητα.",
        },
      },
      {
        element: '[data-tour-tab="reports"]',
        popover: {
          title: "8. Καρτέλα Εκθέσεις",
          description:
            "Στη συνέχεια μεταβείτε στην καρτέλα 'Εκθέσεις' για να δημιουργήσετε τα έγγραφα της υπόθεσής σας.",
        },
      },
      {
        element: ".ektheseisTab .buttons p.helpBtn:first-child",
        popover: {
          title: "9. Λήψη Έκθεσης",
          description:
            "Πατήστε σε ένα κουμπί για να κατεβάσετε την αντίστοιχη Έκθεση. Η ώρα έναρξης και λήξης της επόμενης Έκθεσης θα προχωράει αυτόματα μετά από κάθε λήψη.",
        },
        onHighlightStarted: () => activateTab("reports"),
      },
    ],
  },
  importOldData: {
    label: "Πώς να εισάγετε παλιά στοιχεία",
    steps: [
      {
        element: ".fileUploader",
        popover: {
          title: "Ανέβασμα παλιών δεδομένων",
          description:
            "Αν έχετε ξαναχρησιμοποιήσει την εφαρμογή και έχετε αποθηκευμένο το αρχείο data.json, ανεβάστε το εδώ για να φορτωθούν αυτόματα τα στοιχεία σας.",
        },
      },
      {
        element: "#localData",
        popover: {
          title: "Επιλογή αρχείου",
          description:
            "Πατήστε εδώ και επιλέξτε το αρχείο data.json από τον υπολογιστή σας.",
        },
      },
      {
        element: ".fileUploader a",
        popover: {
          title: "Δεν έχετε το αρχείο;",
          description:
            "Αν δεν έχετε πλέον το data.json, πατήστε 'Φόρμα' για να καταχωρήσετε τα στοιχεία σας ξανά και να δημιουργηθεί νέο.",
        },
      },
    ],
  },
  addOfficer: {
    label: "Πώς να προσθέσετε αστυνομικό",
    steps: [
      {
        element: '[data-tour-tab="persons"]',
        popover: {
          title: "1. Μετατροπέας ατόμων",
          description:
            "Μεταβείτε στην καρτέλα 'Μετατροπέας ατόμων', εκεί θα βρείτε την ενότητα 'Αστυνομικός'.",
        },
        onHighlightStarted: () => activateTab("persons"),
      },
      {
        element: "#astynomikoi",
        popover: {
          title: "2. Νέος Αστυνομικός",
          description:
            "Από το μενού επιλέξτε 'Νέος Αστυνομικός' για να καταχωρίσετε έναν καινούργιο.",
        },
      },
      {
        element: ".clipboard-id-astynomikos",
        popover: {
          title: "3. Στοιχεία αστυνομικού",
          description:
            "Επεξεργαστείτε το κείμενο ή κάντε επικόλληση το δικό σας.",
        },
      },
      {
        element: ".clipboard-id-astynomikos",
        popover: {
          title: "4. Προσοχή στη σειρά",
          description:
            "<strong>ΠΡΟΣΟΧΗ:</strong> Η πρώτη λέξη πρέπει να είναι ο βαθμός, η δεύτερη το επίθετο, η τρίτη το όνομα, και μετά ό,τι άλλο θέλετε.",
        },
      },
      {
        element: ".clipboard-id-astynomikos",
        popover: {
          title: "5. Πού χρησιμοποιείται",
          description:
            "Το κείμενο αυτό θα περάσει, με λίγες τροποποιήσεις ανάλογα το έγγραφο, στις μαρτυρικές αστυνομικών, στις εκθέσεις σύλληψης, και παράδοσης/κατάσχεσης.",
        },
      },
      {
        element: ".save-astynomikos",
        popover: {
          title: "6. Αποθήκευση",
          description:
            "Πατήστε 'Προσθήκη' αν θέλετε να κρατήσετε τα στοιχεία των αστυνομικών στο browser για μελλοντική χρήση.",
        },
      },
      {
        element: ".fileUploader a",
        popover: {
          title: "7. Backup",
          description:
            "Για να κρατήσετε τους αστυνομικούς σας στο backup αρχείο data.json πλοηγηθήτε στη Φόρμα και πατήστε 'Αποθήκευση'.",
        },
      },
      {
        element: "#astynomikoi",
        popover: {
          title: "8. Αποθηκευμένοι αστυνομικοί",
          description:
            "Από το μενού μπορείτε να επιλέξετε έναν από τους ήδη αποθηκευμένους αστυνομικούς.",
        },
      },
      {
        element: "#astynomikos-delete",
        popover: {
          title: "9. Διαγραφή",
          description:
            "Εάν θέλετε να διαγράψετε κάποιον, επιλέξτε τον από το μενού και πατήστε 'Διαγραφή'.",
        },
      },
    ],
  },
  customTemplates: {
    label: "Θέλω να χρησιμοποιήσω τις δικές μου Εκθέσεις",
    steps: [
      {
        popover: {
          title: "Μπορώ να χρησιμοποιήσω δικά μου εγγράφα;",
          description:
            "Και βέβαια! Αυτός ο οδηγός θα σας βοηθήσει να μορφοποιήσετε τα δικά σας αρχεία .docx, ώστε στη συνέχεια να τα εισάγετε στην εφαρμογή για να επεξεργαστούν και να συμπληρωθούν με τα σωστά στοιχεία.",
        },
      },
      {
        element: '[data-tour-tab="reports"]',
        popover: {
          title: "2. Καρτέλα Εκθέσεις",
          description: "Βρείτε την καρτέλα 'Εκθέσεις'.",
        },
        onHighlightStarted: () => activateTab("reports"),
      },
      {
        element: ".customDocs",
        popover: {
          title: "3. Επεξεργαστείτε μια Έκθεση",
          description:
            "Ανοίξτε την Έκθεση από την οποία θέλετε να φτιάξετε πρότυπο (τύπου .docx) και αντικαταστήστε τα σχετικά σημεία με μεταβλητές μέσα σε αγκύλες { }, π.χ. {victim}. Η εφαρμογή θα αναζητήσει αυτές τις μεταβλητές στο έγγραφό σας και θα τις αντικαταστήσει με τα κατάλληλα στοιχεία.",
        },
      },
      {
        element: "#keywords-dialog table",
        popover: {
          title: "4. Λίστα μεταβλητών",
          description:
            "Στο αρχείο .docx αντικαταστήστε τα απαραίτητα σημεία με τις διαθέσιμες μεταβλητές που αναζητά το πρόγραμμα. <strong>ΠΡΟΣΟΧΗ:</strong> οι αγκύλες και τα γράμματα της μεταβλητής πρέπει να είναι γραμμένα στα Αγγλικά, αλλιώς η αντικατάσταση θα αποτύχει. Ανοίξτε ξανά αυτή τη λίστα όποτε χρειαστεί από το εικονίδιο (?) δίπλα στα αρχεία .docx.",
        },
        onHighlightStarted: () => openKeywordsHelp(),
      },
      {
        element: ".docx-samples",
        popover: {
          title: "5. Παραδείγματα",
          description:
            "Πατήστε αυτά τα κουμπιά για να κατεβάσετε και να δείτε δύο τέτοιες Εκθέσεις μορφοποιημένες ως πρότυπα (templates). Τα δικά σας θα μοιάζουν με αυτά στην τελική τους μορφή.",
        },
        onHighlightStarted: () => {
          closeKeywordsHelp();
          openDocxHelp();
        },
      },
      {
        element: "#docx-replacement-source",
        popover: {
          title: "6. Παθών ή Δράστης",
          description:
            "Τα αρχεία που θα κατεβούν θα έχουν κατάληξη στο όνομά τους ανάλογα με την επιλογή σας. Η επιλογή αυτή παίζει ρόλο και για μεταβλητές όπως {surname}, {firstName} κ.ά., σε πρότυπα όπως Υπεύθυνες Δηλώσεις ή Δελτία Υπόπτου.",
        },
        onHighlightStarted: () => closeDocxHelp(),
      },
      {
        element: "#docx-file-input",
        popover: {
          title: "7. Ανεβάστε τα πρότυπά σας",
          description:
            "Ανεβάστε όσα αρχεία .docx χρειάζεστε, θα επεξεργαστούν με τη σειρά. Προσθέστε έναν αριθμό στο όνομα κάθε αρχείου για να ορίσετε τη σειρά επεξεργασίας, π.χ. 1. Μαρτυρική, 2. Σύλληψη, 3. Κατάσχεση κ.ο.κ.",
        },
      },
      {
        element: "#docx-file-input",
        popover: {
          title: "8. Επεξεργασία",
          description:
            "Η εφαρμογή θα υπολογίσει την ώρα έναρξης και λήξης κάθε αρχείου, προσθέτοντας κάθε φορά το διπλάσιο του «Χρόνου Περάτωσης» που έχετε αποθηκεύσει (προεπιλογή 10 λεπτά). Έτσι η πρώτη Έκθεση θα ξεκινά στις 10:00 και θα λήγει στις 10:10, η δεύτερη θα ξεκινά στις 10:20 και θα λήγει στις 10:30 κ.ο.κ. Αν το όνομα ενός αρχείου περιέχει τη λέξη «Σύλληψη», θα υπολογιστεί αυτόματα και η ώρα σύλληψης βάσει των χρόνων του αρχείου αυτού.",
        },
      },
    ],
  },
  extraFeatures: {
    label: "Τι άλλο προσφέρει ο Βοηθός Αξ.Υπ.;",
    steps: [
      {
        element: '.navButtons a[href="tools/"]',
        popover: {
          title: "1. Εργαλεία PDF",
          description:
            "Για να σας βοηθήσει στη δουλειά σας, ο Βοηθός Αξ.Υπ. προσφέρει εργαλεία επεξεργασίας PDF, καθώς και εργαλείο μετατροπής εικόνας σε κείμενο (OCR).",
        },
      },
      {
        element: '.navButtons a[href="tools/"]',
        popover: {
          title: "2. Ασφάλεια",
          description:
            "Όλα τα αρχεία που ανεβάζετε επεξεργάζονται τοπικά, στον υπολογιστή και στο browser σας. Τα δεδομένα σας είναι 100% ασφαλή.",
        },
      },
      {
        element: "footer",
        popover: {
          title: "3. Νομοθεσία για αστυνομικούς",
          description:
            "Η ομάδα ΑστυNομικά έχει συγκεντρώσει, και συνεχίζει να ενημερώνει, μια πλούσια συλλογή νομοθεσίας χρήσιμη για αστυνομικούς, διαθέσιμη σε δημόσιο google drive.",
        },
      },
      {
        element: "footer",
        popover: {
          title: "4. Ευρετήριο αναζήτησης",
          description:
            "Βασισμένο στη δουλειά τους, δημιούργησα ένα ευρετήριο για να ψάχνετε λέξεις κλειδιά στη νομοθεσία, με σύνδεσμο στο αντίστοιχο έγγραφο στο google drive.",
        },
      },
      {
        element: "#donate-open",
        popover: {
          title: "Κάνει και καφέ;",
          description:
            "Όχι, αλλά αν βρίσκετε τη δουλειά μου έστω και λίγο χρήσιμη, θα εκτιμούσα πολύ μια μικρή δωρεά, που θα με βοηθήσει να συνεχίσω να δουλεύω και να βελτιώνω αυτό το εργαλείο.",
        },
      },
    ],
  },
};

export function startGuide(key, page = "index") {
  const guide = guides[key];
  if (!guide) return;

  const pages = [...new Set(guide.steps.map((s) => s.page || "index"))];
  const isMultiPage = pages.length > 1;
  const isLastPage = pages[pages.length - 1] === page;

  const pageSteps = guide.steps.filter((s) => (s.page || "index") === page);
  if (!pageSteps.length) return;

  const steps = isMultiPage
    ? pageSteps.map((step) => ({
        ...step,
        popover: {
          ...step.popover,
          progressText: `${guide.steps.indexOf(step) + 1} από ${guide.steps.length}`,
        },
      }))
    : pageSteps;

  if (isMultiPage) {
    if (!isLastPage) setPendingTour(key);
    else clearPendingTour();
  }

  const tourDriver = driver({
    showProgress: true,
    nextBtnText: "Επόμενο",
    prevBtnText: "Προηγούμενο",
    doneBtnText: "Τέλος",
    steps,
    onDestroyStarted: () => {
      if (isMultiPage && !isLastPage) clearPendingTour();
      tourDriver.destroy();
    },
  });
  tourDriver.drive();
}

function startMasterMenu() {
  const menuDriver = driver({
    allowClose: true,
    overlayClickBehavior: "close",
    showButtons: ["close"],
    steps: [
      {
        popover: {
          title: "Περιήγηση",
          description: "Επιλέξτε μια περιήγηση για να ξεκινήσετε:",
          popoverClass: "tour-menu-popover",
          showButtons: ["close"],
          onPopoverRender: (popoverRefs) => {
            const list = document.createElement("ul");
            list.className = "tour-list";

            Object.entries(guides).forEach(([key, { label }]) => {
              const item = document.createElement("li");
              item.className = "tour-item";

              const span = document.createElement("span");
              span.textContent = label;

              const btn = document.createElement("button");
              btn.className = "tour-play";
              btn.type = "button";
              btn.textContent = "▶ Έναρξη";
              btn.addEventListener("click", () => {
                menuDriver.destroy();
                startGuide(key);
              });

              item.append(span, btn);
              list.appendChild(item);
            });

            popoverRefs.description.appendChild(list);
          },
        },
      },
    ],
  });

  menuDriver.drive();
}

export function initTourGuide() {
  document
    .getElementById("tour-help")
    .addEventListener("click", startMasterMenu);
}
