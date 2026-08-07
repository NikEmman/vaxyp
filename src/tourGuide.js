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

const guides = {
  getStarted: {
    label: "Ξεκινώντας",
    steps: [
      {
        element: ".fileUploader a",
        popover: {
          title: "Καταχώρηση στοιχείων υπηρεσίας",
          description:
            "Πατήστε στο επισημασμένο «Φόρμα» για να καταχωρήσετε τα στοιχεία της υπηρεσίας σας.",
          showButtons: ["close"],
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
            "Επιλέξτε τον Α' και τον Β' ανακριτικό υπάλληλο. Αν δεν έχετε προσθέσει ακόμα ανακριτικούς, δείτε πρώτα τον οδηγό 'Ξεκινώντας'.",
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
    label: "Πώς να εισάγετε παλιά δεδομένα",
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
