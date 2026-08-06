const { driver } = window.driver.js;

function activateTab(name) {
  const tab = document.querySelector(`[data-tour-tab="${name}"]`);
  if (tab && !tab.classList.contains("clicked")) {
    tab.click();
  }
}

const guides = {
  getStarted: {
    label: "Ξεκινήστε εδώ",
    steps: [
      {
        element: ".fileUploader",
        popover: {
          title: "Στοιχεία χρήστη",
          description:
            "Αν έχετε ήδη δημιουργήσει το αρχείο data.json παλαιότερα, ανεβάστε το εδώ. Αλλιώς πατήστε στο 'Φόρμα' για να καταχωρήσετε τα στοιχεία σας για πρώτη φορά.",
        },
      },
      {
        element: ".top .anakritikoi",
        popover: {
          title: "Ανακριτικοί υπάλληλοι",
          description:
            "Επιλέξτε τον Α' και Β' Ανακριτικό Υπάλληλο που θα εμφανίζονται στις Εκθέσεις σας.",
        },
      },
      {
        element: ".tabs",
        popover: {
          title: "Καρτέλες",
          description:
            "Από εδώ πλοηγηθείτε στις καρτέλες: Μετατροπέας ατόμων, Μετατροπέας οχημάτων, Εκθέσεις και Ταυτότητες / Απώλειες.",
        },
      },
      {
        element: "#taytotita",
        popover: {
          title: "Επικόλληση στοιχείων",
          description:
            "Αντιγράψτε το κείμενο του Δελτίου Ταυτότητας από την εφαρμογή POL και επικολλήστε το εδώ.",
        },
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
  firstReport: {
    label: "Φτιάξτε την πρώτη σας έκθεση",
    steps: [
      {
        element: '[data-tour-tab="persons"]',
        popover: {
          title: "1. Μορφοποιήστε τα στοιχεία",
          description:
            "Πρώτα μεταβείτε στην καρτέλα 'Μετατροπέας ατόμων' και μορφοποιήστε τα στοιχεία του παθόντα ή του δράστη.",
        },
        onHighlightStarted: () => activateTab("persons"),
      },
      {
        element: '[data-tour-tab="reports"]',
        popover: {
          title: "2. Καρτέλα Εκθέσεις",
          description: "Έπειτα πηγαίνετε στην καρτέλα 'Εκθέσεις'.",
        },
        onHighlightStarted: () => activateTab("reports"),
      },
      {
        element: "#dikografies",
        popover: {
          title: "3. Επιλέξτε δικογραφία",
          description:
            "Επιλέξτε τον τύπο δικογραφίας που αφορά την υπόθεσή σας.",
        },
        onHighlightStarted: () => activateTab("reports"),
      },
      {
        element: ".ektheseisTab .buttons",
        popover: {
          title: "4. Κατεβάστε την Έκθεση",
          description:
            "Ανάλογα με την επιλογή σας, θα εμφανιστούν κουμπιά για λήψη των αντίστοιχων Εκθέσεων / Εγγράφων, προ-συμπληρωμένων με τα στοιχεία σας.",
        },
        onHighlightStarted: () => activateTab("reports"),
      },
    ],
  },
};

function startGuide(key) {
  const guide = guides[key];
  if (!guide) return;

  driver({
    showProgress: true,
    nextBtnText: "Επόμενο",
    prevBtnText: "Προηγούμενο",
    doneBtnText: "Τέλος",
    steps: guide.steps,
  }).drive();
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
