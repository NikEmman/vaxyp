import { startGuide } from "./tourGuide.js";
import {
  getPendingTour,
  clearPendingTour,
  initTheme,
} from "./stateManager.js";
import { defaultData } from "./defaultData.js";
import {
  cleanSpaces,
  joinRankName,
  getOfficerParts,
} from "./formatters.js";

document.addEventListener("DOMContentLoaded", () => {
  initTheme();

  const pendingTour = getPendingTour();
  if (pendingTour) {
    clearPendingTour();
    startGuide(pendingTour, "form");
  }

  // Populate form fields from a data object, replacing any existing rows
  function populateForm(data) {
    document.getElementById("anakritikoiList").innerHTML = "";
    data.anakritikoi.forEach((value, index) => {
      const sexValue =
        data.anakrSex && data.anakrSex[index] ? data.anakrSex[index] : "Άντρας";
      addAnakritikoi(getOfficerParts(data, index), sexValue);
    });

    document.getElementById("ypiresia").value = data.ypiresia || "";
    document.getElementById("dAstynomias").value = data.dAstynomias || "";
    document.getElementById("geniki").value = data.geniki || "";
    document.getElementById("iatro").value = data.iatro || "";
    document.getElementById("doy").value = data.doy || "";
    document.getElementById("arthro").value = data.arthro || "";
    document.getElementById("merosSyntaksisEkthesis").value =
      data.merosSyntaksisEkthesis || "";
    document.getElementById("xronosPeratosis").value =
      Number(data.xronosPeratosis) || defaultData.xronosPeratosis;
    document.getElementById("eisaggeleiaProtodikon").value =
      data.eisaggeleiaProtodikon || "";
    document.getElementById("dieuthynsiYpiresias").value =
      data.dieuthynsiYpiresias || "";
    document.getElementById("tilefono").value = data.tilefono || "";
    document.getElementById("email").value = data.email || "";
    document.getElementById("amy").value = data.amy || "";
  }

  // Check if localStorage dataObject exists and populate form fields
  const savedData = localStorage.getItem("dataObject");
  if (savedData) {
    populateForm(JSON.parse(savedData));
  } else {
    addAnakritikoi();
  }

  // Upload an existing data.json backup to populate the form
  document.getElementById("localData").addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== "application/json") {
      alert("Επιτρέπονται μόνο αρχεία JSON!");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = JSON.parse(e.target.result);

        const hasOfficers =
          result.anakritikoi &&
          Array.isArray(result.anakritikoi) &&
          result.anakritikoi.length > 0;
        const hasService = !!result.ypiresia;

        if (!hasOfficers || !hasService) {
          alert(
            "Σφάλμα: Το αρχείο JSON δεν περιέχει τα απαραίτητα δεδομένα (π.χ. Ανακριτικοί υπάλληλοι).",
          );
          return;
        }

        localStorage.removeItem("anakr");
        localStorage.setItem("dataObject", JSON.stringify(result));
        populateForm(result);
      } catch (error) {
        console.error("Parsing Error:", error);
        alert("Το αρχείο δεν είναι έγκυρο JSON.");
      }
    };
    reader.readAsText(file);
  });

  function updateRowLabels() {
    const rows = document.querySelectorAll(".anakritikoi-row");
    rows.forEach((row, index) => {
      row.querySelector(".row-label").textContent = `Ανακριτικός #${index + 1}`;
    });
  }

  function textInput(name, placeholder, value, className) {
    const input = document.createElement("input");
    input.type = "text";
    input.name = name;
    input.placeholder = placeholder;
    input.value = value || "";
    input.className = className;
    return input;
  }

  // One case (genitive or nominative): rank input + name input side by side
  function caseGroup(rankInput, nameInput) {
    const group = document.createElement("div");
    group.className = "case-group";
    group.appendChild(rankInput);
    group.appendChild(nameInput);
    return group;
  }

  function addAnakritikoi(parts = {}, sexValue = "Άντρας") {
    const container = document.getElementById("anakritikoiList");
    const rowCount = container.querySelectorAll(".anakritikoi-row").length;

    const row = document.createElement("div");
    row.className = "anakritikoi-row";
    row.dataset.index = rowCount;

    const label = document.createElement("span");
    label.className = "row-label";
    label.textContent = `Ανακριτικός #${rowCount + 1}`;

    const fieldsDiv = document.createElement("div");
    fieldsDiv.className = "row-fields";

    const select = document.createElement("select");
    select.name = "anakrSex[]";
    const man = document.createElement("option");
    man.value = "Άντρας";
    man.textContent = "Άντρας";
    const woman = document.createElement("option");
    woman.value = "Γυναίκα";
    woman.textContent = "Γυναίκα";
    select.appendChild(man);
    select.appendChild(woman);
    select.value = sexValue;

    fieldsDiv.appendChild(select);
    fieldsDiv.appendChild(
      caseGroup(
        textInput("rankGen[]", "π.χ. Αρχ/κα", parts.rankGen, "rank-input"),
        textInput(
          "nameGen[]",
          "π.χ. ΠΑΠΑΔΟΠΟΥΛΟΥ Νικολάου",
          parts.nameGen,
          "name-input",
        ),
      ),
    );
    fieldsDiv.appendChild(
      caseGroup(
        textInput("rankNom[]", "π.χ. Αρχ/κας", parts.rankNom, "rank-input"),
        textInput(
          "nameNom[]",
          "π.χ. ΠΑΠΑΔΟΠΟΥΛΟΣ Νικόλαος",
          parts.nameNom,
          "name-input",
        ),
      ),
    );

    row.appendChild(label);
    row.appendChild(fieldsDiv);
    container.appendChild(row);
  }

  document
    .getElementById("addAnakritikoi")
    .addEventListener("click", function () {
      addAnakritikoi();
    });

  document.getElementById("removeAnakritikoi").addEventListener("click", () => {
    const container = document.getElementById("anakritikoiList");
    const rows = container.querySelectorAll(".anakritikoi-row");

    if (rows.length > 1) {
      container.removeChild(rows[rows.length - 1]);
      updateRowLabels();
    }
  });

  document.getElementById("submitForm").addEventListener("click", function () {
    const astynomikoi =
      JSON.parse(localStorage.getItem("dataObject"))?.astynomikoi || [];
    const formData = new FormData(document.getElementById("dataForm"));
    const rankGen = formData.getAll("rankGen[]");
    const nameGen = formData.getAll("nameGen[]");
    const rankNom = formData.getAll("rankNom[]");
    const nameNom = formData.getAll("nameNom[]");
    const anakritikoiParts = rankGen.map((_, i) => ({
      rankGen: cleanSpaces(rankGen[i]),
      nameGen: cleanSpaces(nameGen[i]),
      rankNom: cleanSpaces(rankNom[i]),
      nameNom: cleanSpaces(nameNom[i]),
    }));
    const anakrSex = formData.getAll("anakrSex[]");
    const data = {
      // Joined strings kept for the initial text and older app versions
      anakritikoi: anakritikoiParts.map((p) => joinRankName(p.rankGen, p.nameGen)),
      astynomikoi: astynomikoi,
      anakritikoiEnikos: anakritikoiParts.map((p) =>
        joinRankName(p.rankNom, p.nameNom),
      ),
      anakritikoiParts: anakritikoiParts,
      anakrSex: anakrSex,
      ypiresia: formData.get("ypiresia").toUpperCase(),
      dAstynomias: formData.get("dAstynomias").toUpperCase(),
      geniki: formData.get("geniki").toUpperCase(),
      iatro: formData.get("iatro").toUpperCase(),
      doy: formData.get("doy"),
      arthro: formData.get("arthro"),
      merosSyntaksisEkthesis: formData.get("merosSyntaksisEkthesis"),
      xronosPeratosis:
        Number(formData.get("xronosPeratosis")) || defaultData.xronosPeratosis,
      eisaggeleiaProtodikon: formData.get("eisaggeleiaProtodikon"),
      dieuthynsiYpiresias: formData.get("dieuthynsiYpiresias"),
      tilefono: formData.get("tilefono").replace(/\s/g, ""),
      email: formData.get("email"),
      amy: formData.get("amy"),
    };
    // Save to local storage
    localStorage.setItem("dataObject", JSON.stringify(data));

    // Create a downloadable JSON file
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
});
