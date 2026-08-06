import { setPendingTour, clearPendingTour } from "./stateManager.js";

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
