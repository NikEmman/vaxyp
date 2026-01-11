document.addEventListener("DOMContentLoaded", () => {
  // Check if localStorage dataObject exists and populate form fields
  const savedData = localStorage.getItem("dataObject");
  if (savedData) {
    const data = JSON.parse(savedData);

    // Populate inputs with stored data
    data.anakritikoi.forEach((value, index) => {
      if (index === 0) {
        document.querySelector("input[name='anakritikoi[]']").value =
          data.anakritikoi[0] || "";
        document.querySelector("input[name='anakritikoiEnikos[]']").value =
          data.anakritikoiEnikos[0] || "";
      } else {
        addAnakritikoi(value, data.anakritikoiEnikos[index]);
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

  function addAnakritikoi(value, valueEnikos) {
    const container = document.getElementById("anakritikoiContainer");
    const input = document.createElement("input");
    input.type = "text";
    input.name = "anakritikoi[]";
    input.placeholder = "Αρχ/κα ΠΑΠΠΑ Ανέστη";
    input.value = value || "";
    container.appendChild(input);

    const containerEnikos = document.getElementById(
      "anakritikoiEnikosContainer"
    );
    const inputEnikos = document.createElement("input");
    inputEnikos.type = "text";
    inputEnikos.name = "anakritikoiEnikos[]";
    inputEnikos.placeholder = "Αρχ/κας ΠΑΠΠΑΣ Ανέστης";
    inputEnikos.value = valueEnikos || "";
    containerEnikos.appendChild(inputEnikos);
  }

  document
    .getElementById("addAnakritikoi")
    .addEventListener("click", function () {
      addAnakritikoi();
    });

  document.getElementById("removeAnakritikoi").addEventListener("click", () => {
    const anakritikoiContainer = document.getElementById(
      "anakritikoiContainer"
    );
    const anakritikoiEnikosContainer = document.getElementById(
      "anakritikoiEnikosContainer"
    );
    const anakritikoi = document.querySelectorAll(
      "input[name='anakritikoi[]']"
    );
    const anakritikoiEnikos = document.querySelectorAll(
      "input[name='anakritikoiEnikos[]']"
    );
    if (anakritikoi.length > 1) {
      anakritikoiContainer.removeChild(anakritikoi[anakritikoi.length - 1]);
      anakritikoiEnikosContainer.removeChild(
        anakritikoiEnikos[anakritikoiEnikos.length - 1]
      );
    }
  });

  document.getElementById("submitForm").addEventListener("click", function () {
    const formData = new FormData(document.getElementById("dataForm"));
    const anakritikoi = formData.getAll("anakritikoi[]");
    const anakritikoiEnikos = formData.getAll("anakritikoiEnikos[]");
    const data = {
      anakritikoi: anakritikoi,
      anakritikoiEnikos: anakritikoiEnikos,
      ypiresia: formData.get("ypiresia"),
      dAstynomias: formData.get("dAstynomias"),
      geniki: formData.get("geniki"),
      iatro: formData.get("iatro"),
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
