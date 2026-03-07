import { getTheme, saveTheme } from "../stateManager.js";

document.addEventListener("DOMContentLoaded", () => {
  const applyTheme = (theme) => {
    if (theme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  };

  const initTheme = () => {
    const theme = getTheme();
    applyTheme(theme);

    const toggleBtn = document.getElementById("theme-toggle");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        const currentTheme = document.body.classList.contains("dark")
          ? "dark"
          : "light";
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        saveTheme(newTheme);
        applyTheme(newTheme);
      });
    }

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        if (!localStorage.getItem("vaxyp-theme")) {
          applyTheme(e.matches ? "dark" : "light");
        }
      });
  };

  initTheme();

  // Check if localStorage dataObject exists and populate form fields
  const savedData = localStorage.getItem("dataObject");
  if (savedData) {
    const data = JSON.parse(savedData);

    // Populate inputs with stored data
    data.anakritikoi.forEach((value, index) => {
      const sexValue =
        data.anakrSex && data.anakrSex[index] ? data.anakrSex[index] : "Άντρας";

      if (index === 0) {
        document.querySelector("input[name='anakritikoi[]']").value =
          data.anakritikoi[0] || "";
        document.querySelector("input[name='anakritikoiEnikos[]']").value =
          data.anakritikoiEnikos[0] || "";
        document.querySelector("select[name='anakrSex[]']").value = sexValue;
      } else {
        addAnakritikoi(value, data.anakritikoiEnikos[index], sexValue);
      }
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
      data.xronosPeratosis || "";
    document.getElementById("eisaggeleiaProtodikon").value =
      data.eisaggeleiaProtodikon || "";
    document.getElementById("dieuthynsiYpiresias").value =
      data.dieuthynsiYpiresias || "";
    document.getElementById("tilefono").value = data.tilefono || "";
    document.getElementById("email").value = data.email || "";
    document.getElementById("amy").value = data.amy || "";
  }

  function updateRowLabels() {
    const rows = document.querySelectorAll(".anakritikoi-row");
    rows.forEach((row, index) => {
      row.querySelector(".row-label").textContent = `Ανακριτικός #${index + 1}`;
    });
  }

  function addAnakritikoi(value = "", valueEnikos = "", sexValue = "Άντρας") {
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

    const input = document.createElement("input");
    input.type = "text";
    input.name = "anakritikoi[]";
    input.placeholder = "Αρχ/κα ΠΑΠΠΑ Ανέστη";
    input.value = value;

    const inputEnikos = document.createElement("input");
    inputEnikos.type = "text";
    inputEnikos.name = "anakritikoiEnikos[]";
    inputEnikos.placeholder = "Αρχ/κας ΠΑΠΠΑΣ Ανέστης";
    inputEnikos.value = valueEnikos;

    fieldsDiv.appendChild(select);
    fieldsDiv.appendChild(input);
    fieldsDiv.appendChild(inputEnikos);

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
    const anakritikoi = formData.getAll("anakritikoi[]");
    const anakritikoiEnikos = formData.getAll("anakritikoiEnikos[]");
    const anakrSex = formData.getAll("anakrSex[]");
    const data = {
      anakritikoi: anakritikoi,
      astynomikoi: astynomikoi,
      anakritikoiEnikos: anakritikoiEnikos,
      anakrSex: anakrSex,
      ypiresia: formData.get("ypiresia").toUpperCase(),
      dAstynomias: formData.get("dAstynomias").toUpperCase(),
      geniki: formData.get("geniki").toUpperCase(),
      iatro: formData.get("iatro").toUpperCase(),
      doy: formData.get("doy"),
      arthro: formData.get("arthro"),
      merosSyntaksisEkthesis: formData.get("merosSyntaksisEkthesis"),
      xronosPeratosis: Number(formData.get("xronosPeratosis")),
      eisaggeleiaProtodikon: formData.get("eisaggeleiaProtodikon"),
      dieuthynsiYpiresias: formData.get("dieuthynsiYpiresias"),
      tilefono: formData.get("tilefono"),
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
