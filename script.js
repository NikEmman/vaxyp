const data = {
  anakritikoi: [
    "Αρχ/κα ΕΜΜΑΝΟΥΗΛΙΔΗ Νικόλαου",
    "Ανθ/μου ΚΟΛΤΣΙΔΑ Βαγγέλη",
    "Ανθ/μου ΚΟΥΛΕΛΗ Χρήστου",
    "Αρχ/κα ΓΚΑΓΚΑΤΣΑ Γεώργιου",
    "Υπ/κα ΠΑΡΑΣΚΕΥΑ Νερατζή",
    "Ανθ/μου ΓΙΑΝΝΑΚΙΔΗ Βασίλειου",
    "Ανθ/μου ΤΟΠΑΛΙΔΗ Νικόλαου",
  ],
  ypiresia: "Τ.Δ.Ε.Ε. Κομοτηνής",
  doy: "Κομοτηνής",
  merosSyntaksisEkthesis: "Κομοτηνή",
  xronosPeratosis: 10,
  eisaggeleiaProtodikon: "Ροδόπης",
  dieuthynsiYpiresias: "Λ Δημοκρατίας αρ. 3",
  tilefono: "25314 40177",
  email: "ta.komotinis@astynomia.gr",
};
function printYpefthini(
  datas,
  axyp,
  person,
  protokolo,
  apolesthen,
  date,
  dateFormatter
) {
  return `<div
  style="
    font-family: Arial, sans-serif;
    width: 210mm;
    height: 297mm;
    margin: 20px auto;
    line-height: 1;
  "
>
  <div style="text-align: center; margin-bottom: 15px">
    <h3 style="margin-bottom: 5px">ΥΠΕΥΘΥΝΗ ΔΗΛΩΣΗ</h3>
    <h3 style="margin-top: 5px"><sup>(άρθρο 8 Ν.1599/1986)</sup></h3>
  </div>
  <div
    style="
      width: 210mm;
      line-height: normal;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    "
  >
    <div style="font-size: 0.8em; text-align: end">${axyp}</div>
    <div style="font-size: 0.8em; text-align: end">Χορηγήθηκε Υ.Σ.</div>
    <div style="font-size: 0.8em; text-align: end">3005/4/${protokolo}</div>
  </div>
  <p style="margin-bottom: 10px; font-style: italic">
    Η ακρίβεια των στοιχείων που υποβάλλονται με αυτή τη δήλωση μπορεί να
    ελεγχθεί με βάση το αρχείο άλλων υπηρεσιών (άρθρο 8 παρ. 4 Ν. 1599/1986)
  </p>

  <table style="width: 100%; border-collapse: collapse">
    <tr>
      <td style="width: 20%; padding: 2px; border: 1px solid #000">ΠΡΟΣ:</td>
      <td style="width: 80%; padding: 2px; border: 1px solid #000" colspan="5">
        <strong>${datas.ypiresia}</strong>
      </td>
    </tr>
    <tr>
      <td style="padding: 2px; border: 1px solid #000">Ο – Η Όνομα:</td>
      <td style="padding: 2px; border: 1px solid #000" colspan="2">
        <strong>${person.firstName}</strong>
      </td>
      <td style="padding: 2px; border: 1px solid #000; width: 15%">ΕΠΩΝΥΜΟ:</td>
      <td style="padding: 2px; border: 1px solid #000" colspan="2">
        <strong>${person.surname}</strong>
      </td>
    </tr>
    <tr>
      <td style="padding: 2px; border: 1px solid #000">
        Όνομα και Επώνυμο Πατέρα:
      </td>
      <td style="padding: 2px; border: 1px solid #000" colspan="5">
        <strong>${person.fatherName} ${person.surname}</strong>
      </td>
    </tr>
    <tr>
      <td style="padding: 2px; border: 1px solid #000">
        Όνομα και Επώνυμο Μητέρας:
      </td>
      <td style="padding: 2px; border: 1px solid #000" colspan="5">
        <strong>${person.motherName} ${person.motherSurname}</strong>
      </td>
    </tr>
    <tr>
      <td style="padding: 2px; border: 1px solid #000">Ημερομηνία γέννησης:</td>
      <td style="padding: 2px; border: 1px solid #000" colspan="5">
        <strong>${person.birthDate}</strong>
      </td>
    </tr>
    <tr>
      <td style="padding: 2px; border: 1px solid #000">Τόπος Γέννησης:</td>
      <td style="padding: 2px; border: 1px solid #000" colspan="5">
        <strong>${person.birthPlace}</strong>
      </td>
    </tr>
    <tr>
      <td style="padding: 2px; border: 1px solid #000">
        Αριθμός Δελτίου Ταυτότητας:
      </td>
      <td style="padding: 2px; border: 1px solid #000" colspan="2">
        <strong>${person.idNumber}</strong>
      </td>
      <td style="padding: 2px; border: 1px solid #000">Τηλ:</td>
      <td style="padding: 2px; border: 1px solid #000" colspan="2">
        <strong>${person.phoneNumber}</strong>
      </td>
    </tr>
    <tr>
      <td style="padding: 2px; border: 1px solid #000">Τόπος Κατοικίας:</td>
      <td style="padding: 2px; border: 1px solid #000">
        <strong>${person.area}</strong>
      </td>
      <td style="padding: 2px; border: 1px solid #000; width: 10%">Οδός:</td>
      <td style="padding: 2px; border: 1px solid #000">${person.street}</td>
      <td style="padding: 2px; border: 1px solid #000; width: 10%">Αριθ:</td>
      <td style="padding: 2px; border: 1px solid #000">
        ${person.streetNumber}
      </td>
    </tr>
    <tr>
      <td style="padding: 2px; border: 1px solid #000; width: 10%">ΤΚ:</td>
      <td style="padding: 2px; border: 1px solid #000"></td>
      <td style="padding: 2px; border: 1px solid #000" colspan="2">
        Δ/νση Ηλεκτρ. Ταχυδρομείου (Email):
      </td>
      <td style="padding: 2px; border: 1px solid #000" colspan="2"></td>
    </tr>
  </table>

  <div style="border: 1px solid #000; padding: 12px; margin-bottom: 20px">
    <p style="font-weight: bold">
      Με ατομική μου ευθύνη και γνωρίζοντας τις κυρώσεις, που προβλέπονται από
      τις διατάξεις της παρ. 6 του άρθρου 22 του Ν. 1599/1986, δηλώνω ότι:
    </p>
    <p>Σε άγνωστο τόπο και χρόνο απώλεσα ${apolesthen}</p>
  </div>

  <div style="text-align: right; margin-top: 20px; margin-right: 50px">
    <p>
      <strong>${datas.merosSyntaksisEkthesis}, ${dateFormatter(date)}</strong>
    </p>
    <p style="margin-top: 20px">Ο-Η Δηλών-ούσα</p>
  </div>
</div>
`;
}

function printYpoptoy(person) {
  return `<div
    style="
      font-family: 'Bookman Old Style', serif;
      width: 210mm;
      margin: 0 auto;
    "
  >
    <!-- Header Table -->
    <table style="border-collapse: collapse; width: 100%; margin-bottom: 20px">
      <tr>
        <td
          style="
            border: 1px solid #000000;
            padding: 8px;
            font-size: 10pt;
            text-align: center;
            width: 25%;
          "
        >
          Χορηγείται από το Τυπογραφείο
        </td>
        <td
          style="
            border: 1px solid #000000;
            padding: 8px;
            font-size: 10pt;
            text-align: center;
            width: 50%;
          "
        >
          Συντάσσεται από τον αρμόδιο Ανακριτικό Υπάλληλο
        </td>
        <td
          style="
            border: 1px solid #000000;
            padding: 8px;
            font-size: 10pt;
            text-align: center;
            width: 25%;
          "
        >
          ΥΠΟΔΕΙΓΜΑ.: Δ-9γ
        </td>
      </tr>
      <tr>
        <td
          colspan="3"
          style="border: 1px solid #000000; padding: 8px; font-size: 10pt"
        >
          Υπόδειγμα: «Δελτίο στοιχείων ταυτότητος κατηγορουμένου».
        </td>
      </tr>
    </table>

    <!-- Title -->
    <div
      style="
        text-align: center;
        font-size: 14pt;
        font-weight: bold;
        text-decoration: underline;
        margin-top: 20px;
        margin-bottom: 5px;
      "
    >
      ΔΕΛΤΙΟ ΣΤΟΙΧΕΙΩΝ ΤΑΥΤΟΤΗΤΑΣ ΥΠΟΠΤΟΥ
    </div>
    <div
      style="
        text-align: center;
        font-family: Arial, sans-serif;
        margin-bottom: 20px;
      "
    >
      (Επισυνάπτεται στη δικογραφία)
    </div>

    <!-- Information Table -->
    <table style="width: 100%; margin-bottom: 20px; border-collapse: collapse">
      <tr>
        <td style="padding: 5px 0; width: 35%; font-weight: normal">
          ΕΠΩΝΥΜΟ.:
        </td>
        <td style="padding: 5px 0; font-weight: bold">${person.surname}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0; font-weight: normal">ΟΝΟΜΑ.:</td>
        <td style="padding: 5px 0; font-weight: bold">${person.firstName}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0; font-weight: normal">ΟΝΟΜΑ ΠΑΤΕΡΑ.:</td>
        <td style="padding: 5px 0; font-weight: bold">${person.fatherName}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0; font-weight: normal">ΟΝΟΜΑ ΜΗΤΕΡΑΣ.:</td>
        <td style="padding: 5px 0; font-weight: bold">${person.motherName}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0; font-weight: normal">
          ΠΑΤΡΙΚΟ ΕΠΩΝΥΜΟ (για έγγαμες):
        </td>
        <td style="padding: 5px 0"></td>
      </tr>
      <tr>
        <td style="padding: 5px 0; font-weight: normal">ΟΝΟΜ/ΜΟ ΣΥΖΥΓΟΥ.:</td>
        <td style="padding: 5px 0"></td>
      </tr>
      <tr>
        <td style="padding: 5px 0; font-weight: normal">ΗΜΕΡ. ΓΕΝΝΗΣΗΣ.:</td>
        <td style="padding: 5px 0; font-weight: bold">${person.birthDate}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0; font-weight: normal">ΤΟΠΟΣ ΓΕΝΝΗΣΗΣ.:</td>
        <td style="padding: 5px 0; font-weight: bold">${person.birthPlace}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0; font-weight: normal">ΤΟΠΟΣ ΚΑΤΟΙΚΙΑΣ.:</td>
        <td style="padding: 5px 0; font-weight: bold">${person.area}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0; font-weight: normal">Οδός:</td>
        <td style="padding: 5px 0">${person.street} ${person.streetNumber}</td>
      </tr>
      <tr>
        <td colspan="2">
          <table style="width: 100%; border-collapse: collapse">
            <tr>
              <td style="padding: 5px 0; width: 70%; font-weight: normal">
                Ταχ. Κωδ.
              </td>
              <td style="padding: 5px 0; width: 30%"></td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 5px 0; font-weight: normal">
          ΑΡΙΘ. ΤΑΥΤΟΤΗΤΑΣ ή ΔΙΑΒΑΤΗΡΙΟΥ:
        </td>
        <td style="padding: 5px 0; font-weight: bold">${person.idNumber}</td>
      </tr>
      <tr>
        <td colspan="2">
          <table style="width: 100%; border-collapse: collapse">
            <tr>
              <td style="padding: 5px 0; width: 25%; font-weight: normal">
                Ημερ. Έκδοσης
              </td>
              <td style="padding: 5px 0; width: 25%; font-weight: bold">
              ${person.issueDate}
              </td>
              <td style="padding: 5px 0; width: 25%; font-weight: normal">
                Αρχή Έκδοσης
              </td>
              <td style="padding: 5px 0; width: 25%; font-weight: bold">
              ${person.issuingAuthority}
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <table style="width: 100%; border-collapse: collapse">
            <tr>
              <td style="padding: 5px 0; width: 15%; font-weight: normal">
                Α.Φ.Μ:
              </td>
              <td style="padding: 5px 0; width: 35%; font-weight: bold">
                -----
              </td>
              <td style="padding: 5px 0; width: 15%; font-weight: normal">
                Δ.Ο.Υ.:
              </td>
              <td style="padding: 5px 0; width: 35%; font-weight: bold">
              ${data.doy}
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <table style="width: 100%; border-collapse: collapse">
            <tr>
              <td style="padding: 5px 0; width: 15%; font-weight: normal">
                ΤΗΛ:
              </td>
              <td style="padding: 5px 0; width: 35%; font-weight: bold">
                ${person.phoneNumber}
              </td>
              <td style="padding: 5px 0; width: 15%; font-weight: normal">
                ΗΛ. ΤΑΧ:
              </td>
              <td style="padding: 5px 0; width: 35%; font-weight: bold">
                ΑΝΕΥ
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 5px 0; font-weight: normal">ΕΠΑΓ/ΜΑ:</td>
        <td style="padding: 5px 0; font-weight: bold">------</td>
      </tr>
    </table>

    <!-- Signature Section -->
    <div
      style="float: right; width: 235px; text-align: center; margin-top: 30px"
    >
      <p style="margin: 5px 0">${data.merosSyntaksisEkthesis},</p>
      <p style="margin: 5px 0">${formatDate(today)}</p>
      <p style="margin: 5px 0">- Ο -</p>
      <p style="margin: 5px 0">ΑΝΑΚΡΙΤΙΚΟΣ ΥΠΑΛΛΗΛΟΣ</p>
      <p style="margin: 40px 0 5px 0"><b>${anakritikosSelect.value}</b></p>
      
    </div>
  </div>`;
}
function printMartyraEndooik(
  initial,
  datas,
  victim,
  suspect,
  date,
  dateFormatter,
  timeFormatter
) {
  return `<div
  lang="el-GR"
  link="#0000ff"
  vlink="#800000"
  dir="ltr"
  style="
    background: transparent;
    font-family: 'Arial', sans-serif;
    font-size: 11pt;
    line-height: 0.26in;
    text-align: justify;
    orphans: 2;
    widows: 2;
    margin-bottom: 0in;
  "
>
  <p style="line-height: 100%; text-align: left"><br /></p>
  <p
    style="
      line-height: 100%;
      text-align: center;
      font-size: 13pt;
      font-family: 'Bookman Old Style', serif;
    "
  >
    <u><b>ΕΚΘΕΣΗ ΕΝΟΡΚΗΣ ΕΞΕΤΑΣΗΣ ΜΑΡΤΥΡΑ</b></u>
  </p>
  <p
    style="
      line-height: 100%;
      text-align: center;
      font-size: 13pt;
      font-family: 'Bookman Old Style', serif;
    "
  >
    <u><b>(Κ.Π.Δ.)</b></u>
  </p>
  <p style="line-height: 100%; text-align: left"><br /></p>
  <p
    style="
      line-height: 100%;
      text-align: left;
      font-size: 13pt;
      font-family: 'Bookman Old Style', serif;
    "
  >
  ${initial().replace(/(\r\n|\n|\r|\s{2,})/gm, " ")} της ιδίας
    Υπηρεσίας, προσληφθέντος ως Β’ Ανακριτικού Υπαλλήλου, εμφανίσθηκε ενώπιων
    μας, η κατωτέρω σημειούμενη μάρτυρας, η οποία αφού ρωτήθηκε για την
    ταυτότητά της κλπ, απάντησε ότι ονομάζεται: <b>ΑΣΤΥΝΟΜΙΚΟΣ</b>.
  </p>
  
  <p
    style="
      line-height: 100%;
      text-align: justify;
      text-indent: 0.49in;
      font-size: 13pt;
      font-family: 'Bookman Old Style', serif;
    "
  >
    Έπειτα ο μάρτυρας, αφού έδωσε τον ακόλουθο όρκο: «Δηλώνω, επικαλούμενος την
    τιμή και τη συνείδησή μου, ότι θα πω όλη την αλήθεια και μόνο την αλήθεια,
    χωρίς να προσθέσω ούτε να αποκρύψω τίποτε», σύμφωνα με τα άρθρα 219 και 220
    Κ.Π.Δ. στη συνέχεια εξετάζεται ως ακολούθως:
  </p>
  <p
    style="
      line-height: 100%;
      text-align: justify;
      font-size: 13pt;
      font-family: 'Bookman Old Style', serif;
    "
  >
    <b>ΕΡΩΤΗΣΗ:</b> Τι προσήλθες να καταθέσεις στην Υπηρεσία μας.
  </p>
  <p
    style="
      line-height: 100%;
      text-align: justify;
      font-size: 13pt;
      font-family: 'Bookman Old Style', serif;
    "
  >
    <b>ΑΠΟΚΡΙΣΗ:</b> Είμαι Αστυνομικός και υπηρετώ στην ΥΠΗΡΕΣΙΑ ΠΟΥ ΥΠΗΡΕΤΕΙ. Σήμερα ${dateFormatter(
      date
    )} ήμουν διατεθειμένος σε διατεταγμένη Υπηρεσία
    εποχούμενης περιπολίας κατά το ωράριο ΩΡΑΡΙΟ ΤΟΥ στην ***8* με κωδικό κλήσης **. Περί την ώρα της λάβαμε σήμα από το Κέντρο Άμεσης Δράσης για ενδοοικογενειακό επεισόδιο επί της οδού στην Αθήνα.
    Μεταβήκαμε στο ανωτέρω σημείο περί την ώρα της ιδίας όπου μας ανέμενε η Α) ${victim} η οποία μας ανέφερε ότι προ της αφίξεως μας, ο Β) ${suspect} ***. Κατόπιν αυτού, μεταφέραμε τους ανωτέρω στο Α.Τ. …… και
    εν συνεχεία μεταφέραμε την ανωτέρω (Α) στην Υπηρεσία σας για τα περαιτέρω.
  </p>
  <p
    style="
      line-height: 100%;
      text-align: justify;
      font-size: 13pt;
      font-family: 'Bookman Old Style', serif;
    "
  >
    <b>ΕΡΩΤΗΣΗ:</b> Έχετε κάτι άλλο να προσθέσετε;
  </p>
  <p
    style="
      line-height: 100%;
      text-align: justify;
      font-size: 13pt;
      font-family: 'Bookman Old Style', serif;
    "
  >
    <b>ΑΠΟΚΡΙΣΗ:</b> Τίποτα άλλο δεν έχω να προσθέσω και υπογράφω.
  </p>
  <p
    style="
      line-height: 100%;
      text-align: justify;
      text-indent: 0.49in;
      font-size: 13pt;
      font-family: 'Bookman Old Style', serif;
    "
  >
    Η παρούσα έκθεση άρχισε να συντάσσεται την ${timeFormatter(
      date,
      timePassed
    )}' ώρα της ${dateFormatter(today)} και
    περατώθηκε την ${timeFormatter(
      date,
      datas.xronosPeratosis + timePassed
    )}' ώρα της ιδίας.
  </p>
  <p
    style="
      line-height: 100%;
      text-align: justify;
      text-indent: 0.49in;
      font-size: 13pt;
      font-family: 'Bookman Old Style', serif;
    "
  >
    Για πιστοποίηση συντάχθηκε η παρούσα έκθεση η οποία αφού αναγνώστηκε και
    βεβαιώθηκε υπογράφεται ως ακολούθως:
  </p>
  <p
    style="
      line-height: 100%;
      text-align: center;
      margin-left: -0.39in;
      margin-right: -0.56in;
    "
  >
    <br />
  </p>
  
</div>
`;
}

// χωρίς όρκο θύμα
function printThymaEndooik(
  initial,
  datas,
  victim,
  suspect,
  date,
  dateFormatter,
  timeFormatter
) {
  state.timePassed += datas.xronosPeratosis;
  return `<div
  style="
    size: 21cm 29.7cm;
    
    font-family: Arial, sans-serif;
    font-size: 12pt;
    line-height: 1.5;
  "
>
  <p style="text-align: center; line-height: 100%">
    <span style="font-size: 13pt; text-decoration: underline; font-weight: bold"
      >ΕΚΘΕΣΗ ΕΞΕΤΑΣΗΣ ΜΑΡΤΥΡΑ ΧΩΡΙΣ ΟΡΚΟ (Κ.Π.Δ.)</span
    >
  </p>

  <p style="text-align: left; text-indent: 0.2in; line-height: 100%">
    ${initial().replace(/(\r\n|\n|\r|\s{2,})/gm, " ")}
      της ιδίας Υπηρεσίας, προσληφθέντος ως Β' Ανακριτικού Υπαλλήλου,
      εμφανίσθηκε ενώπιων μας, η κατωτέρω σημειούμενη μάρτυρας, η οποία αφού
      ρωτήθηκε για την ταυτότητά της κλπ, απάντησε ότι ονομάζεται:
    ${victim}
  </p>

  <p style="text-align: justify; line-height: 100%">
    <span style="font-size: 11pt"
      >Στην συνέχεια εξετάζεται χωρίς όρκο, κατά τα οριζόμενα του άρθρου 19 του
      Ν. 3500/2006:</span
    >
  </p>

  <p style="text-align: justify; line-height: 100%">
    <span style="font-size: 11pt; font-weight: bold">ΕΡΩΤΗΣΗ</span>
    <span style="font-size: 11pt">: Ρωτήθηκε σχετικά.</span>
  </p>

  <p style="text-align: left; line-height: 100%">
    <span style="font-size: 11pt; font-weight: bold">ΑΠΟΚΡΙΣΗ</span>
    <span style="font-size: 11pt">: Είμαστε ***** με τον A) </span>
    <span style="font-size: 11pt; font-weight: bold">${
      suspect.split(" ")[0] + " " + suspect.split(" ")[1]
    }</span>
  </p>

  <p style="text-align: justify; line-height: 100%">
    <span style="font-size: 11pt; font-weight: bold">ΕΡΩΤΗΣΗ:</span>
    <span style="font-size: 11pt">
      Έχουν συμβεί παρόμοια περιστατικά στο παρελθόν;
    </span>
  </p>

  <p style="text-align: justify; line-height: 0.26in">
    <span style="font-size: 11pt; font-weight: bold">ΑΠΟΚΡΙΣΗ: </span>
    <span style="font-size: 11pt">*******</span>
  </p>

  <p style="text-align: justify; line-height: 100%">
    <span style="font-size: 11pt; font-weight: bold">ΕΡΩΤΗΣΗ</span>
    <span style="font-size: 11pt"
      >: Επιθυμείτε να εξεταστείτε από Ιατροδικαστή;</span
    >
  </p>

  <p style="text-align: justify; line-height: 100%">
    <span style="font-size: 11pt; font-weight: bold">ΑΠΟΚΡΙΣΗ</span>
    <span style="font-size: 11pt">: Ναι το επιθυμώ.</span>
  </p>

  <p style="text-align: justify; line-height: 100%">
    <span style="font-size: 11pt; font-weight: bold">ΕΡΩΤΗΣΗ:</span>
    <span style="font-size: 11pt">
      Επιθυμείτε να μεταφερθείτε σε κάποια δομή;</span
    >
  </p>

  <p style="text-align: justify; line-height: 100%">
    <span style="font-size: 11pt; font-weight: bold">ΑΠΟΚΡΙΣΗ:</span>
    <span style="font-size: 11pt"> ********</span>
  </p>

  <p style="text-align: left; line-height: 100%">
    <span style="font-size: 11pt; font-weight: bold">ΕΡΩΤΗΣΗ</span>
    <span style="font-size: 11pt"
      >: Επιθυμείτε να μεταφερθείτε στην Ιατροδικαστική Υπηρεσία;</span
    >
  </p>

  <p style="text-align: left; line-height: 100%">
    <span style="font-size: 11pt; font-weight: bold">ΑΠΟΚΡΙΣΗ</span>
    <span style="font-size: 11pt">: όχι</span>
  </p>

  <p style="text-align: justify; line-height: 100%">
    <span style="font-size: 11pt; font-weight: bold">ΕΡΩΤΗΣΗ</span>
    : Έχει ο (A) στην κατοχή του κάποιο όπλο;
  </p>

  <p style="text-align: justify; line-height: 100%">
    <span style="font-size: 11pt; font-weight: bold">ΑΠΟΚΡΙΣΗ</span>
    <span style="font-size: 11pt">: Όχι.</span>
  </p>

  <p style="text-align: justify; line-height: 100%">
    <span style="font-size: 11pt; font-weight: bold">ΕΡΩΤΗΣΗ</span>
    : Είναι ο (Α) εξαρτημένος από το αλκοόλ ή από τις Ναρκωτικές ουσίες;
  </p>

  <p style="text-align: justify; line-height: 100%">
    <span style="font-size: 11pt; font-weight: bold">ΑΠΟΚΡΙΣΗ</span>
    : Ναι κάνει μαριχουάνα και πίνει αλκοόλ.
  </p>

  <p style="text-align: justify; line-height: 100%">
    <span style="font-size: 11pt; font-weight: bold">ΕΡΩΤΗΣΗ</span>
    : Φοβάστε για την ζωή σας;
  </p>

  <p style="text-align: justify; line-height: 100%">
    <span style="font-size: 11pt; font-weight: bold">ΑΠΟΚΡΙΣΗ</span>
    : Ναι φοβάμαι για την ζωή μου πολύ.
  </p>

  <p style="text-align: justify; line-height: 100%">
    <span style="font-size: 11pt; font-weight: bold">ΕΡΩΤΗΣΗ</span>

    : Γνωρίζεται τυχόν ύπαρξη ψυχικής ασθένειας ή διαταραχής του (Α);
  </p>

  <p style="text-align: justify; line-height: 100%">
    <span style="font-size: 11pt; font-weight: bold">ΑΠΟΚΡΙΣΗ</span>
    <span style="font-size: 11pt">: Δε γνωρίζω.</span>
  </p>

  <p style="text-align: justify; line-height: 100%">
    <span style="font-size: 11pt; font-weight: bold">ΕΡΩΤΗΣΗ</span>
    : Επιθυμείτε την ποινική δίωξη του (Α) για τις ως άνω πράξεις;
  </p>

  <p style="text-align: justify; line-height: 100%">
    <span style="font-size: 11pt; font-weight: bold">ΑΠΟΚΡΙΣΗ</span>
    <span style="font-size: 11pt">: Ναι επιθυμώ</span>
  </p>

  <p style="text-align: justify; line-height: 100%">
    <span style="font-size: 11pt; font-weight: bold">ΕΡΩΤΗΣΗ</span>
    <span style="font-size: 11pt">: Επιθυμείτε </span>
    <span style="font-size: 11pt">panic button;</span>
  </p>

  <p style="text-align: justify; line-height: 100%">
    <span style="font-size: 11pt; font-weight: bold">ΑΠΟΚΡΙΣΗ</span>
    <span style="font-size: 11pt">: **** </span>
  </p>

  <p style="text-align: justify; line-height: 100%">
    <span style="font-size: 11pt; font-weight: bold">ΕΡΩΤΗΣΗ:</span>
    <span style="font-size: 11pt"> Έχετε κάτι άλλο να προσθέσετε;</span>
  </p>

  <p style="text-align: justify; line-height: 100%">
    <span style="font-size: 11pt; font-weight: bold">ΑΠΟΚΡΙΣΗ:</span>
    <span style="font-size: 11pt">
      Τίποτα άλλο δεν έχω να προσθέσω και γράμματα γνωρίζω.</span
    >
  </p>

  <p style="text-align: justify; line-height: 100%">
    <span style="font-size: 11pt"
      >Η παρούσα έκθεση άρχισε να συντάσσεται την ${timeFormatter(
        date,
        timePassed
      )}' ώρα της ${dateFormatter(date)} και
      περατώθηκε την ${timeFormatter(
        date,
        datas.xronosPeratosis + timePassed
      )}' ώρα της ιδίας.</span
    >
  </p>

  <p style="text-align: justify; line-height: 100%">
    <span style="font-size: 11pt"
      >Για πίστωση συντάχθηκε η παρούσα έκθεση, η οποία αφού αναγνώσθηκε και
      βεβαιώθηκε, υπογράφεται ως ακολούθως</span
    >
  </p>
</div>
`;
}

// katigoroumenos endooik
function printDrastisEndooik(
  initial,
  datas,
  victim,
  suspect,
  date,
  dateFormatter,
  timeFormatter
) {
  state.timePassed += datas.xronosPeratosis;
  return `<div
  style="
    font-size: 11pt;
    line-height: 1.2;
    
    text-align: justify;
  "
>
  <p style="text-align: center; margin-bottom: 1em">
    <span style="font-size: 16pt; font-weight: bold; text-decoration: underline"
      >ΕΚΘΕΣΗ ΕΞΕΤΑΣΗΣ ΚΑΤΗΓΟΡΟΥΜΕΝΟΥ (Κ.Π.Δ.)</span
    >
  </p>

  <p
    style="
      text-indent: 0.49in;
      margin-bottom: 1em;

      font-size: 12pt;
    "
  >
    ${initial().replace(/(\r\n|\n|\r|\s{2,})/gm, " ")} της ιδίας Υπηρεσίας,
    προσληφθέντος ως Β' Ανακριτικός Υπάλληλος, εξετάζεται η κατωτέρω σημειούμενη
    κατηγορούμενη ως ακολούθως,
  </p>

  <p
    style="
      margin-bottom: 1em;

      font-size: 12pt;
    "
  >
    <span style="font-weight: bold; text-decoration: underline">ΕΡΩΤΗΣΗ:</span>
    Πώς ονομάζεσαι κ.λ.π. (πλήρη στοιχεία ταυτότητας);
  </p>

  <p
    style="
      margin-bottom: 1em;

      font-size: 12pt;
    "
  >
    <span style="font-weight: bold; text-decoration: underline">ΑΠΟΚΡΙΣΗ:</span>
    Ονομάζομαι ${suspect}.
  </p>

  <p
    style="
      margin-bottom: 1em;

      font-size: 12pt;
    "
  >
    Ενημερώθηκε ότι μπορεί να λαμβάνει εγκαίρως γνώση των εγγράφων της δίκης, τα
    οποία του επιδίδονται και με ηλεκτρονικά μέσα σύμφωνα με τις παρ. 1 και 4
    του άρθρου 155 Κ.Π.Δ..
  </p>

  <p
    style="
      text-indent: 0.49in;
      margin-bottom: 1em;

      font-size: 12pt;
    "
  >
    Ενταύθα, ανακοινώσαμε στην κατηγορούμενη, σύμφωνα με το άρθρο 100 του Κώδικα
    Ποινικής Δικονομίας, το περιεχόμενο του κατηγορητηρίου,
    <u>ήτοι</u> παράβαση άρθρου * του Ν. 3500/06 διότι την ώρα της επί της οδού
    Ζωναρά 19 στην Αθήνα, εξύβρισες τον (σχεση με θυμα) <strong>Α)</strong>
    ${
      victim.split(" ")[0] +
      " " +
      victim.split(" ")[1] +
      " " +
      victim.split(" ")[2] +
      " " +
      victim.split(" ")[3]
    }
  </p>

  <p
    style="
      text-indent: 0.49in;
      margin-bottom: 1em;

      font-size: 12pt;
    "
  >
    Στη συνέχεια, αφού ανακοινώσαμε στον κατηγορούμενο το περιεχόμενο των
    εγγράφων της ανάκρισης, εξηγήσαμε σ' αυτόν, σύμφωνα με το άρθρο 105 του
    Κώδικα Ποινικής Δικονομίας, με σαφήνεια όλα τα δικαιώματά του, που
    αναφέρονται στα άρθρα 95, 96, 97, 98, 100, 101, 104, 273 και 274 του Κώδικα
    Ποινικής Δικονομίας και ειδικότερα: το δικαίωμα παράστασης με συνήγορο, το
    δικαίωμα και τις προϋποθέσεις παροχής δωρεάν νομικών συμβουλών, το δικαίωμα
    ενημέρωσης σχετικά με την κατηγορία, το δικαίωμα διερμηνείας και μετάφρασης,
    το δικαίωμα σιωπής και μη αυτοενοχοποίησης, το δικαίωμα πρόσβασης στο υλικό
    της δικογραφίας, το δικαίωμα ενημέρωσης των προξενικών αρχών και επιπλέον
    προσώπων της επιλογής του, το δικαίωμα σε επείγουσα ιατρική περίθαλψη, τον
    ανώτατο αριθμό ωρών ή ημερών κατά τις οποίες ο κατηγορούμενος δύναται να
    στερηθεί της ελευθερίας του προτού προσαχθεί ενώπιον δικαστικής αρχής, το
    δικαίωμα άρνησης εν όλω ή εν μέρει της παροχής εξηγήσεων, το δικαίωμα
    πρότασης μαρτύρων προς εξέταση και πληροφορίες σχετικά με τις δυνατότητες
    προσβολής του νόμιμου χαρακτήρα της σύλληψης ή της κράτησης.
  </p>

  <p
    style="
      margin-bottom: 1em;

      font-size: 12pt;
    "
  >
    <span style="font-weight: bold; text-decoration: underline">ΕΡΩΤΗΣΗ:</span>
    Επιθυμείται να κάνετε χρήση των δικαιωμάτων που σας γνωστοποιήθηκαν;
  </p>

  <p
    style="
      margin-bottom: 1em;

      font-size: 12pt;
    "
  >
    <span style="font-weight: bold; text-decoration: underline">ΑΠΟΚΡΙΣΗ:</span>
    Παραιτούμαι όλων των ανωτέρων δικαιωμάτων και ζητώ να απολογηθώ αμέσως.
  </p>

  <p
    style="
      text-indent: 0.49in;
      margin-bottom: 1em;

      font-size: 12pt;
    "
  >
    Για πιστοποίηση συντάχθηκε η παρούσα έκθεση η οποία αφού αναγνώσθηκε και
    βεβαιώθηκε υπογράφεται ως ακολούθως:
  </p>

  <table width="100%">
    <tr>
      <td width="33%" style="text-align: center">-Ο-</td>
      <td width="33%" style="text-align: center">-Ο-</td>
      <td width="33%" style="text-align: center">-Ο-</td>
    </tr>
    <tr>
      <td width="33%" style="text-align: center">Εξετασθείς</td>
      <td width="33%" style="text-align: center">Β'Ανακριτικός</td>
      <td width="33%" style="text-align: center">Ά Ανακριτικός</td>
    </tr>
  </table>

  <p
    style="
      text-indent: 0.49in;
      margin-top: 1in;
      margin-bottom: 1em;

      font-size: 12pt;
    "
  >
    Έπειτα, του απαγγείλαμε της ως άνω κατηγορία και προβήκαμε στην εξέταση του
    κατηγορουμένου ως ακολούθως:
  </p>

  <p
    style="
      margin-bottom: 1em;

      font-size: 12pt;
    "
  >
    <span style="font-weight: bold; text-decoration: underline">ΕΡΩΤΗΣΗ:</span>
    Έχετε κατηγορηθεί άλλη φορά και αν ναι, για ποια αιτία;
  </p>

  <p
    style="
      margin-bottom: 1em;

      font-size: 12pt;
    "
  >
    <span style="font-weight: bold; text-decoration: underline">ΑΠΟΚΡΙΣΗ:</span>
    Όχι, δεν έχω κατηγορηθεί.
  </p>

  <p
    style="
      margin-bottom: 1em;

      font-size: 12pt;
    "
  >
    <span style="font-weight: bold; text-decoration: underline">ΕΡΩΤΗΣΗ:</span>
    Κατηγορείσαι ήδη για τις πράξεις που σου γνωστοποιήθηκαν ανωτέρω. Τι
    απολογείσαι;
  </p>

  <p
    style="
      margin-bottom: 1em;

      font-size: 12pt;
    "
  >
    <span style="font-weight: bold; text-decoration: underline">ΑΠΟΚΡΙΣΗ:</span>
    Δεν αποδέχομαι τις σε βάρος μου κατηγορίες. Ότι επιπλέον έχω να πω θα το πω
    στο δικαστήριο. Τίποτα άλλο δεν έχω να προσθέσω και υπογράφω.
  </p>

  <p
    style="
      text-indent: 0.49in;
      margin-bottom: 1em;

      font-size: 12pt;
      font-weight: normal;
      text-decoration: none;
    "
  >
    Στον κατηγορούμενο γνωστοποιήσαμε ότι σύμφωνα με το αρ. 273 παρ. 1 του
    Κώδικα Ποινικής Δικονομίας υποχρεούται να δηλώσει κάθε μεταβολή της
    κατοικίας η διαμονής του μαζί με την ακριβή διεύθυνση, ή της διεύθυνσης
    ηλεκτρονικού ταχυδρομείου ή αριθμού κινητής τηλεφωνίας, σύμφωνα με την παρ.
    2 του άρθρου 156 Κ.Π.Δ., καθώς και τις συνέπειες σε περίπτωση παράλειψης,
    εγγράφως στον Εισαγγελέα του δικαστηρίου, στο οποίο εκκρεμεί κατά το χρόνο
    της δήλωσής της η δικογραφία.
  </p>

  <p
    style="
      text-indent: 0.49in;
      margin-bottom: 1em;

      font-size: 12pt;
      font-weight: normal;
      text-decoration: none;
    "
  >
    Η παρούσα έκθεση άρχισε να συντάσσεται την ${timeFormatter(
      date,
      timePassed
    )}' ώρα της ${dateFormatter(date)} και
    περατώθηκε την ${timeFormatter(
      date,
      datas.xronosPeratosis + timePassed
    )}' ώρα της ιδίας.
  </p>

  <p
    style="
      text-indent: 0.49in;
      margin-bottom: 1em;

      font-size: 12pt;
    "
  >
    Για πιστοποίηση συντάχθηκε η παρούσα έκθεση η οποία αφού αναγνώσθηκε και
    βεβαιώθηκε υπογράφεται ως ακολούθως:
  </p>
</div>
`;
}
//Μην πειράξετε από εδώ και κάτω

const today = new Date();
const months = [
  "Ιανουαρίου",
  "Φεβρουαρίου",
  "Μαρτίου",
  "Απριλίου",
  "Μαΐου",
  "Ιουνίου",
  "Ιουλίου",
  "Αυγούστου",
  "Σεπτεμβρίου",
  "Οκτωβρίου",
  "Νοεμβρίου",
  "Δεκεμβρίου",
];
let victim = "";
let suspect = "";
let vehicle = "";
let stringYear = today.getFullYear();
let stringMonth = String(today.getMonth() + 1).padStart(2, "0");
let stringDay = String(today.getDate()).padStart(2, "0");
let formattedDate = `${stringYear}-${stringMonth}-${stringDay}`;
let specificDate = new Date(formattedDate);
const days = [
  "Κυριακή",
  "Δευτέρα",
  "Τρίτη",
  "Τετάρτη",
  "Πέμπτη",
  "Παρασκευή",
  "Σάββατο",
];
let dayName = days[specificDate.getDay()];
let year = today.getFullYear();
let month = months[today.getMonth()];
let day = today.getDate();
let ypefthiniData = {};
let ypoptosData = {};
let timePassed = 0;

let state = {
  victim: "",
  suspect: "",
  vehicle: "",
  formattedDate: `${stringDay}-${stringMonth}-${stringYear}`,
  dayName: days[specificDate.getDay()],
  year: today.getFullYear(),
  month: months[today.getMonth()],
  day: today.getDate(),
  ypefthiniData: {},
  ypoptosData: {},
  timePassed: 0,
  apolesthen: "",
  protokolo: 0,
};

//combine data and state so the new Ektheseis replacement argument works
Object.assign(state, { ...data });

const anakritikosSelect = document.querySelector("#anakritikos");
const bAnakritikosSelect = document.querySelector("#anakritikos-b");

data.anakritikoi.forEach((anakritikos, index) => {
  // Populate a anakr select
  const anakr = document.createElement("option");
  anakr.value = anakritikos;
  anakr.textContent = anakritikos.split(" ")[1];
  if (index === 0) {
    anakr.setAttribute("selected", "");
  }
  anakritikosSelect.appendChild(anakr);

  // Populate b anakr select
  const bAnakr = document.createElement("option");
  bAnakr.value = anakritikos;
  bAnakr.textContent = anakritikos.split(" ")[1];
  if (index === 1) {
    bAnakr.setAttribute("selected", "");
  }
  bAnakritikosSelect.appendChild(bAnakr);
});
const initialText = document.getElementById("initial");

function constructInitialText() {
  return `Στην ${data.merosSyntaksisEkthesis} σήμερα την ${
    state.day
  }η του μήνα ${state.month} του έτους ${state.year} ημέρα ${
    state.dayName
  } και ώρα ${formatTime(today, state.timePassed)} ενώπιον εμού, του ${
    anakritikosSelect.value
  } του ${data.ypiresia}, παρισταμένου και του ${bAnakritikosSelect.value} `;
}

//dilosi apoleias

const apolesthen = document.getElementById("apolesthen");
apolesthen.addEventListener("input", () => {
  state.apolesthen = apolesthen.value;
});

const protokolo = document.getElementById("protokolo");
protokolo.addEventListener("input", () => {
  state.protokolo = protokolo.value;
});

// Initial setup
initialText.textContent = constructInitialText();

// Update text when anakritikos selections change
anakritikosSelect.addEventListener("change", () => {
  initialText.textContent = constructInitialText();
});

bAnakritikosSelect.addEventListener("change", () => {
  initialText.textContent = constructInitialText();
});
// initial copy mech

const copyInitialBtn = document.getElementById("copy-initial");
copyInitialBtn.addEventListener("click", () => {
  const text = constructInitialText().replace(/(\r\n|\n|\r|\s{2,})/gm, " ");
  copyToClipboard(text);
});

// person parser fields
const taytotita = document.getElementById("taytotita");
const clipboardId = document.querySelector(".clipboard-id");
const copyIdBtn = document.querySelector(".copy-id");
taytotita.addEventListener("input", () => {
  // id = taytotita.value;
  clipboardId.value = formatIdInfo(taytotita.value, data);
  state.victim = clipboardId.value;
});
clipboardId.addEventListener("input", () => {
  state.victim = clipboardId.value;
});
copyIdBtn.addEventListener("click", () => {
  copyToClipboard(state.victim);
});

// Suspect parser fields
const taytotitaYpoptos = document.getElementById("taytotita-ypoptos");
const clipboardIdYpoptos = document.querySelector(".clipboard-id-ypoptos");
const copyIdYpoptosBtn = document.querySelector(".copy-id-ypoptos");

taytotitaYpoptos.addEventListener("input", () => {
  clipboardIdYpoptos.value = formatIdInfo(taytotitaYpoptos.value, data, true);
  state.suspect = clipboardIdYpoptos.value;
});

clipboardIdYpoptos.addEventListener("input", () => {
  state.suspect = clipboardIdYpoptos.value;
});

copyIdYpoptosBtn.addEventListener("click", () => {
  copyToClipboard(state.suspect);
});

const clearYpoptosBtn = document.getElementById("person-ypoptos-clear");
clearYpoptosBtn.addEventListener("click", () => {
  taytotitaYpoptos.value = "";
  clipboardIdYpoptos.value = "";
  state.suspect = "";
});

//vehicle parser fields

const oxima = document.getElementById("oxima");
const clipboardOxima = document.querySelector(".clipboard-oxima");
const copyOximaBtn = document.querySelector(".copy-oxima");

oxima.addEventListener("input", () => {
  state.vehicle = oxima.value;
  clipboardOxima.value = formatVehicleInfo(state.vehicle);
});

copyOximaBtn.addEventListener("click", () => {
  copyToClipboard(clipboardOxima.value);
});

// dialog help functionality
const personDialog = document.getElementById("person-dialog");
const personHelp = document.getElementById("person-help");
const personClose = document.getElementById("person-close");

personHelp.addEventListener("click", () => {
  personDialog.showModal();
});
personClose.addEventListener("click", () => {
  personDialog.close();
});

const vehicleDialog = document.getElementById("vehicle-dialog");
const vehicleHelp = document.getElementById("vehicle-help");
const vehicleClose = document.getElementById("vehicle-close");

vehicleHelp.addEventListener("click", () => {
  vehicleDialog.showModal();
});
vehicleClose.addEventListener("click", () => {
  vehicleDialog.close();
});
// general info button
const genikesDialog = document.getElementById("genikes-dialog");
const genikesHelp = document.getElementById("genikes-help");
const genikesClose = document.getElementById("genikes-close");

genikesHelp.addEventListener("click", () => {
  genikesDialog.showModal();
});
genikesClose.addEventListener("click", () => {
  genikesDialog.close();
});
//patch note button
const patchDialog = document.getElementById("patch-dialog");
const patchHelp = document.getElementById("patch-help");
const patchClose = document.getElementById("patch-close");

patchHelp.addEventListener("click", () => {
  patchDialog.showModal();
});
patchClose.addEventListener("click", () => {
  patchDialog.close();
});

// field clear buttons
const personClear = document.getElementById("person-clear");
personClear.addEventListener("click", () => {
  taytotita.value = "";
  clipboardId.value = "";
  state.victim = "";
});

const vehicleClear = document.getElementById("vehicle-clear");
vehicleClear.addEventListener("click", () => {
  oxima.value = "";
  clipboardOxima.value = "";
  state.vehicle = "";
});

// ektheseis
const initial = document.getElementById("initial");
// martyras button
const martyra = document.getElementById("martyra");

martyra.addEventListener("click", () => {
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);
  generateWord(ektheseis.martyra, state);
});

// martyraXorisOrko button
const martyraXoris = document.getElementById("martyraXoris");
martyraXoris.addEventListener("click", () => {
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);

  generateWord(ektheseis.martyraXoris, state);
});

//syllipsi button
const syllipsi = document.getElementById("syllipsi");
syllipsi.addEventListener("click", () => {
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);
  state.arrestTime = formatTime(today, state.timePassed - 10);

  generateWord(ektheseis.syllipsi, state);
});
// anomoti button
const anomoti = document.getElementById("anomoti");
anomoti.addEventListener("click", () => {
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);

  generateWord(ektheseis.anomoti, state);
});
// katigoroumenou button
const katigoroumenou = document.getElementById("katigoroumenou");
katigoroumenou.addEventListener("click", () => {
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);

  generateWord(ektheseis.katigoroumenou, state);
});

//apodosi button
const apodosi = document.getElementById("apodosi");
apodosi.addEventListener("click", () => {
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);

  generateWord(ektheseis.apodosi, state);
});
// katasxesi button
const katasxesi = document.getElementById("katasxesi");
katasxesi.addEventListener("click", () => {
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);
  generateWord(ektheseis.katasxesi, state);
});

// gnostopoiisi button
const gnostopoiisi = document.getElementById("gnostopoiisi");
gnostopoiisi.addEventListener("click", () => {
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);

  generateWord(ektheseis.gnostopoiisi, state);
});

// egxeirisis button  printEgxeirisis(initial, person)
const egxeirisis = document.getElementById("egxeirisis");
egxeirisis.addEventListener("click", () => {
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.timeEnd = formatTime(today, data.xronosPeratosis + state.timePassed);
  generateWord(ektheseis.egxeirisis, state);
});

// ypiresiako button
const ypiresiako = document.getElementById("ypiresiako");
ypiresiako.addEventListener("click", () => {
  state.initial = constructInitialText();
  state.timeStart = formatTime(today, state.timePassed);
  state.anakritikos = anakritikosSelect.value;
  state.ypiresia = state.ypiresia.toUpperCase();
  state.anakritikosName =
    state.anakritikos.split(" ")[1] + " " + state.anakritikos.split(" ")[2];
  state.rank = state.anakritikos.split(" ")[0];
  generateWord(ektheseis.ypiresiako, state);
});
// ypefthini button
const ypefthini = document.getElementById("ypefthini");
ypefthini.addEventListener("click", () => {
  downloadAsWord(
    printYpefthini(
      data,
      anakritikosSelect.value,
      ypefthiniData,
      protokoloNumber,
      apolesthenItem,
      today,
      formatDate
    ),
    "ypefthini"
  );
});

// deltio drasti button
const ypoptoy = document.getElementById("ypoptoy");
ypoptoy.addEventListener("click", () => {
  downloadAsWord(printYpoptoy(ypoptosData), "ypoptoy");
});

/// ENDOOIKOGENIAKI

//martyra astyn button
const martyraEndooik = document.getElementById("martyra-endooik");
martyraEndooik.addEventListener("click", () => {
  downloadAsWord(
    printMartyraEndooik(
      constructInitialText,
      data,
      state.victim,
      state.suspect,
      today,
      formatDate,
      formatTime
    ),
    "martyra-endooik"
  );
});
// thyma endooik button
const thymaEndooik = document.getElementById("thyma-endooik");
thymaEndooik.addEventListener("click", () => {
  downloadAsWord(
    printThymaEndooik(
      constructInitialText,
      data,
      state.victim,
      state.suspect,
      today,
      formatDate,
      formatTime
    ),
    "thyma-endooik"
  );
});

// drastis endooik button
const drastisEndooik = document.getElementById("drastis-endooik");
drastisEndooik.addEventListener("click", () => {
  downloadAsWord(
    printDrastisEndooik(
      constructInitialText,
      data,
      state.victim,
      state.suspect,
      today,
      formatDate,
      formatTime
    ),
    "drastis-endooik"
  );
});

// word downloader
function downloadAsWord(func, id) {
  const content = document.getElementById(`${id}-content`);
  content.innerHTML = func;

  const download = document.getElementById(`${id}-download`);

  const header =
    "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
    "xmlns:w='urn:schemas-microsoft-com:office:word' " +
    "xmlns='http://www.w3.org/TR/REC-html40'>" +
    "<head><meta charset='utf-8'><title>HTML to Word</title></head><body>";
  const footer = "</body></html>";
  const sourceHTML = header + download.innerHTML + footer;

  const blob = new Blob(["\ufeff", sourceHTML], {
    type: "application/msword",
  });

  const url =
    "data:application/vnd.ms-word;charset=utf-8," +
    encodeURIComponent(sourceHTML);
  const downloadLink = document.createElement("a");
  document.body.appendChild(downloadLink);

  downloadLink.href = url;
  const title = document.getElementById(`${id}-title`).textContent;
  downloadLink.download = `${title}.doc`;
  downloadLink.click();

  document.body.removeChild(downloadLink);
}
//time formatter
function formatTime(date, extraTime = 0) {
  let totalMinutes = date.getHours() * 60 + date.getMinutes() + extraTime;
  // Ensure totalMinutes wraps correctly for negative cases
  totalMinutes = (totalMinutes + 1440) % 1440;

  let hour = Math.floor(totalMinutes / 60);
  let minutes = totalMinutes % 60;

  let formattedHour = String(hour).padStart(2, "0");
  let formattedMinutes = String(minutes).padStart(2, "0");

  return `${formattedHour}:${formattedMinutes}`;
}

// Helper function to capitalize first letter of each word
function capitalize(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
// date formatter
function formatDate(date) {
  let day = String(date.getDate()).padStart(2, "0");
  let month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  let year = date.getFullYear();

  return `${day}-${month}-${year}`;
}
// formatters
function formatVehicleInfo(input) {
  // Parse input text into an array of key-value pairs
  const lines = input
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line);

  const datas = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check if the current line is a key (doesn't have a value after it)
    if (!line.includes(":") && !line.includes("-") && lines[i + 1]) {
      const nextLine = lines[i + 1];
      // If the next line isn't a section header and doesn't contain special characters
      if (
        !nextLine.includes(":") &&
        !nextLine.includes("-") &&
        !nextLine.includes("Στοιχεία")
      ) {
        datas[line] = nextLine;
      }
    }
  }

  // Extract needed values with proper error handling
  const getValue = (key) => datas[key] || "";

  // Extract all required fields
  const fields = {
    licensePlate: getValue("Αρ.Κυκλοφ"),
    color: getValue("Χρώμα")?.toLowerCase() || "",
    make: getValue("Μάρκα") || "",
    model: getValue("Μοντέλο") || "",
    chassisNumber: getValue("Πλαίσιο") || "",
    engineNumber: getValue("Αρ. Κινητήρα") || "",
    usage: getValue("Χρήση") || "",
    type: getValue("Είδος") || "",
    ownerSurname: getValue("Επώνυμο") || "",
    ownerFirstName: getValue("Όνομα") || "",
    ownerFatherName: getValue("Πατρώνυμο") || "",
  };

  // Format the usage and type
  const formattedUsage =
    fields.type === "ΔΙΚΥΚΛΟ"
      ? "δίκυκλο"
      : fields.usage.match(/Ι.Χ|Δ.Χ/)
      ? `${fields.usage}.${Array.from(fields.type)[0]}`
      : fields.usage;

  // Format the output string
  return `${fields.licensePlate} ${formattedUsage} χρώματος ${
    fields.color
  }, μάρκας ${fields.make} ${fields.model}, με αριθμό πλαισίου ${
    fields.chassisNumber
  } και αριθμό κινητήρα ${fields.engineNumber} ιδιοκτησίας του ${
    fields.ownerSurname
  } ${capitalize(fields.ownerFirstName)} του ${capitalize(
    fields.ownerFatherName
  )}`;
}
function formatIdInfo(input, data, suspect = false) {
  // Parse input text into an array of lines
  const lines = input
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line);

  // Create a more reliable parsing mechanism
  const datas = {};
  for (let i = 0; i < lines.length; i++) {
    const currentLine = lines[i];
    const nextLine = lines[i + 1];

    // Skip lines containing Latin translations
    if (currentLine.includes("(Λατιν.)")) continue;

    // Store the current line as a key if it has a corresponding value in the next line
    if (nextLine && !currentLine.includes("(Λατιν.)")) {
      datas[currentLine] = nextLine;
    }
  }

  // Helper functions
  const getValue = (key) => datas[key] || "";
  const formatDate = (dateStr) => (dateStr ? dateStr.split("/").join("-") : "");
  const formatIssuingAuthority = (string) => {
    const authorityText = string.split("-")[1].trim();
    const [prefix, location] = authorityText.split(" ");
    return `${prefix} ${capitalize(location)}`;
  };

  if (datas.hasOwnProperty("Α.Δ.Τ")) {
    // Extract all required fields
    const fields = {
      surname: getValue("Επώνυμο"),
      firstName: getValue("Όνομα"),
      fatherName: getValue("Όνομα Πατρός"),
      motherName: getValue("Όνομα Μητρός"),
      motherSurname: getValue("Επώνυμο Μητρός"),
      birthDate: formatDate(getValue("Ημ/νία Γέννησης")),
      birthPlace: getValue("Τόπος Γέννησης").split(" ")[0],
      area: getValue("Περιοχή"),
      region: getValue("Νομός"),
      idNumber: getValue("Α.Δ.Τ"),
      issueDate: formatDate(getValue("Ημ/νια Έκδοσης")),
      issuingAuthority: formatIssuingAuthority(getValue("Αρχή Έκδοσης")),
      phoneNumber: getValue("Τηλέφωνο"),
      street: getValue("Οδός"),
      streetNumber: getValue("Αριθμός"),
    };

    // Handle special cases
    if (fields.streetNumber === "Ταχ.Κώδικας") {
      fields.streetNumber = "--- ";
    }
    if (fields.street === "Αριθμός") {
      fields.street = "---------- ";
    }
    if (fields.phoneNumber === "Άλλα στοιχεία επικοινωνίας") {
      fields.phoneNumber = "(στερείται) ";
    }
    if (fields.area === "Οδός") {
      fields.area = "--- ";
    }
    if (fields.area === fields.birthPlace) {
      fields.area = "ομοίως";
    }
    if (fields.region === "Περιοχή") {
      fields.region = "--- ";
    }
    // extract the data for ypefthini dilosi usage
    suspect ? (state.ypoptosData = fields) : (state.ypefthiniData = fields);

    // Format the output string
    const formattedString = `${fields.surname} ${capitalize(
      fields.firstName
    )} του ${capitalize(fields.fatherName)} και της ${capitalize(
      fields.motherName
    )}, γεν. ${fields.birthDate} στην ${capitalize(
      fields.birthPlace
    )}, κάτοικος ${capitalize(fields.area)} ${capitalize(
      fields.region
    )}, οδός ${capitalize(fields.street)} αρ. ${
      fields.streetNumber
    }, επάγγελμα ------- , κάτοχος του υπ'αριθ ${
      fields.idNumber
    } Δ.Α.Τ. εκδοθέντος ${fields.issueDate} από ${
      fields.issuingAuthority
    }, με Α.Φ.Μ ------- / Δ.Ο.Υ. ${data.doy}, χρήστη της υπ'αριθ. ${
      fields.phoneNumber
    } τηλεφωνικής σύνδεσης, με διεύθυνση ηλεκτρονικού ταχυδρομείου (στερείται)`;
    return formattedString;
  } else {
    // Extract all required fields
    const fields = {
      surname: getValue("Επώνυμο"),
      firstName: getValue("Όνομα"),
      fatherName: getValue("Πατρώνυμο"),
      motherName: getValue("Μητρώνυμο"),
      motherSurname: getValue("Γένος (Μητέρας)"),
      birthDate: formatDate(getValue("Ημερομηνία Γέννησης")),
      sex: getValue("Φύλο"),
      birthPlace: getValue("Χώρα Γέννησης"),
      nationality: getValue("Υπηκοότητα(ες)"),
    };

    //   // extract the data for ypefthini dilosi usage
    suspect ? (ypoptosData = fields) : (ypefthiniData = fields);

    // Format the output string
    const formattedString = `(Επ)${fields.surname} (Ον.)${fields.firstName} του ${fields.fatherName} και της ${fields.motherName}, υπηκοότητα ${fields.nationality}, γεν. ${fields.birthDate} στ ${fields.birthPlace}, κάτοικος ****, οδός **** αρ. ****`;
    return formattedString;
  }
}

//copy to clipboard
function copyToClipboard(textToCopy) {
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        console.log("Text copied to clipboard successfully!");
      })
      .catch((err) => {
        console.error("Could not copy text to clipboard: ", err);
      });
  } else {
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = textToCopy;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
      console.log("Text copied to clipboard using fallback method!");
    } catch (err) {
      console.error("Could not copy text using fallback method: ", err);
    }
    document.body.removeChild(textArea);
  }
}
async function generateWord(ekthesi, replacements) {
  let decodedArrayBuffer = base64ToArrayBuffer(ekthesi.string);

  try {
    const modifiedDocx = await processDocument(
      decodedArrayBuffer,
      replacements
    );

    // Create a blob and download it
    const blob = new Blob([modifiedDocx], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${ekthesi.title}.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    console.log("Document generated successfully");
  } catch (error) {
    console.error("Error generating Word document:", error);
    alert("Error generating Word document: " + error.message);
  }
}
async function processDocument(arrayBuffer, replacements) {
  try {
    console.log("Processing document...");

    // Load the document using JSZip
    const zip = await JSZip.loadAsync(arrayBuffer);
    console.log("ZIP loaded successfully");

    // Find the main document content
    const documentXml = zip.file("word/document.xml");

    if (!documentXml) {
      throw new Error("Could not find document.xml in the Word file");
    }

    // Get the content
    const content = await documentXml.async("string");

    // Replace placeholders with values
    let modifiedContent = content;
    for (const [placeholder, value] of Object.entries(replacements)) {
      const regex = new RegExp(`\\{${placeholder}\\}`, "g");
      modifiedContent = modifiedContent.replace(regex, value);
    }

    // Update the document.xml file in the ZIP
    zip.file("word/document.xml", modifiedContent);
    console.log("Updated document.xml in ZIP");

    // Generate the modified ZIP file as ArrayBuffer
    const modifiedZip = await zip.generateAsync({ type: "arraybuffer" });
    console.log("Generated modified ZIP");

    return modifiedZip;
  } catch (error) {
    console.error("Error in processDocument:", error);
    throw error;
  }
}
function base64ToArrayBuffer(base64) {
  let binary = atob(base64);
  let length = binary.length;
  let buffer = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    buffer[i] = binary.charCodeAt(i);
  }
  return buffer.buffer;
}
const ektheseis = {
  martyra: {
    string:
      "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",
    title: "ΕΚΘΕΣΗ ΕΝΟΡΚΗΣ ΕΞΕΤΑΣΗΣ ΜΑΡΤΥΡΑ",
  },

  ypefthyni: {
    string:
      "0M8R4KGxGuEAAAAAAAAAAAAAAAAAAAAAOwADAP7/CQAGAAAAAAAAAAAAAAABAAAANQAAAAAAAAAAEAAAAgAAAAEAAAD+////AAAAAAAAAAD////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9//////////7///80AAAABQAAAAYAAAAHAAAACAAAAAkAAAAKAAAACwAAAAwAAAANAAAADgAAAA8AAAD+////EQAAABIAAAATAAAAFAAAABUAAAAWAAAAFwAAABgAAAD+////GgAAABsAAAAcAAAAHQAAAB4AAAAfAAAAIAAAACEAAAAiAAAAIwAAACQAAAAlAAAAJgAAACcAAAAoAAAAKQAAACoAAAArAAAALAAAAC0AAAAuAAAALwAAADAAAAAxAAAAMgAAADMAAAD+/////v///zYAAAA3AAAA/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////1IAbwBvAHQAIABFAG4AdAByAHkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWAAUA////////////////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/v///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///////////////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD+////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///////////////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP7///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////////////////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/v///wAAAAAAAAAAAQAAAP7////+////BAAAAAUAAAAGAAAA/v///wgAAAD+//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8BAP7/AwoAAP////8GCQIAAAAAAMAAAAAAAABGGAAAAE1pY3Jvc29mdCBXb3JkLURva3VtZW50AAoAAABNU1dvcmREb2MAEAAAAFdvcmQuRG9jdW1lbnQuOAD0ObJxAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD+/wAAAQACAAAAAAAAAAAAAAAAAAAAAAABAAAA4IWf8vlPaBCrkQgAKyez2TAAAAC8AAAACQAAAAEAAABQAAAAAgAAAFgAAAAEAAAAZAAAAAcAAABwAAAACQAAAIAAAAAKAAAAjAAAAAsAAACYAAAADAAAAKQAAAANAAAAsAAAAAIAAADp/QAAHgAAAAIAAAAgAAAAHgAAAAQAAABzYXMAHgAAAAgAAABOb3JtYWwAAB4AAAADAAAAMzgAAEAAAAAAwiZkCAAAAEAAAAAApt/rkS7bAUAAAAAA8F/wmt7aAUAAAABvORSlJpjbAQAAAAAAAAAAAAAAAAAAAAAAAAAA/v8AAAEAAgAAAAAAAAAAAAAAAAAAAAAAAgAAAALVzdWcLhsQk5cIACss+a5EAAAABdXN1ZwuGxCTlwgAKyz5rhIAMAAKAAEAWwAPAAAAAAAAAAAAWgAAEPH/AgBaAAAABgBOAG8AcgBtAGEAbAAAAAsAAAAxJAFBJAAqJAEALwBCKgBPSgUAUUoFAENKGABtSAgEc0gIBFBKBQBeSgUAYUoYAF9IAQRuSAQIdEgECABEAAEQAQACAEQAAAAJAGgAZQBhAGQAaQBuAGcA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//0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAA//8SAAAAAAAAAAEAIAAAAAAAAAADAHMAYQBzAAQAVQBzAGUAcgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADUCFiQBFyQBSWYBAAAACNa0AAiU/zUGwRCRE2gcOB8WIzIlICgAAAAABAEBAAQBAQAEAQEABAEBAAAAAAAEAQEABAEBAAQBAQAEAQEAAAAAAAQBAQAEAQEABAEBAAQBAQAAAAAABAEBAAQBAQAEAQEABAEBAAAAAAAEAQEABAEBAAQBAQAEAQEAAAAAAAQBAQAEAQEABAEBAAQBAQAAAAAABAEBAAQBAQAEAQEABAEBAAAAAAAEAQEABAEBAAQBAQAEAQEAB5SHBAnWEAAAAAAAAAAAAAAAAAAAAAAS1lAAAAD/AAAA/wAAAAAA/wAAAP8AAAAAAP8AAAD/AAAAAAD/AAAA/wAAAAAA/wAAAP8AAAAAAP8AAAD/AAAAAAD/AAAA/wAAAAAA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AAAAAAAAAAAAAAAAAAAYCwAAJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPAsAAFAAAACMCwAAHAAAAKgLAABsAAAAAAAAAAAAAACSDwAAEAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABvDwAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKITAABiAgAABBYAADoAAAB9DwAAFQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHENAAAiAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAwAAF0BAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJMNAAAeAAAATw8AABgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGcPAAAIAAAAAAAAAAAAAABxDwAADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACANkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAANACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAClA6ADlQOlA5gDpQOdA5cDIACUA5cDmwOpA6MDlwMgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAHsAYQB4AHkAcAB9AA0AIAAoAKwDwQO4A8EDvwMgADgAIACdAy4AMQA1ADkAOQAvADEAOQA4ADYAKQANAA0AlwMgALEDugPBA68DsgO1A7kDsQMgAMQDyQO9AyAAwwPEA78DuQPHA7UDrwPJA70DIADAA78DxQMgAMUDwAO/A7IDrAO7A7sDvwO9A8QDsQO5AyAAvAO1AyAAsQPFA8QDrgMgAMQDtwMgALQDrgO7A8kDwwO3AyAAvAPAA78DwQO1A68DIAC9A7EDIAC1A7sDtQOzA8cDuAO1A68DIAC8A7UDIACyA6wDwwO3AyAAxAO/AyAAsQPBA8cDtQOvA78DIACsA7sDuwPJA70DIADFA8ADtwPBA7UDwwO5A84DvQMgACgArAPBA7gDwQO/AyAAOAAgAMADsQPBAy4AIAA0ACAAnQMuACAAMQA1ADkAOQAvADEAOQA4ADYAKQANAA0ADQCgA6EDnwOjAygAMQApADoABwB7AHkAcABpAHIAZQBzAGkAYQB9AAcABwCfAyAAEyAgAJcDIACMA70DvwO8A7EDOgAHAHsAZgBpAHIAcwB0AE4AYQBtAGUAfQAHAJUDwAPOA70DxQO8A78DOgAHAHsAcwB1AHIAbgBhAG0AZQB9AAcABwCMA70DvwO8A7EDIAC6A7EDuQMgAJUDwAPOA70DxQO8A78DIACgA7EDxAOtA8EDsQM6ACAABwB7AGYAYQB0AGgAZQByAE4AYQBtAGUAfQAgACAAewBzAHUAcgBuAGEAbQBlAH0ABwAHAIwDvQO/A7wDsQMgALoDsQO5AyAAlQPAA84DvQPFA7wDvwMgAJwDtwPEA60DwQOxA8IDOgAHAHsAbQBvAHQAaABlAHIATgBhAG0AZQB9ACAAewBtAG8AdABoAGUAcgBTAHUAcgBuAG0AZQB9AAcABwCXA7wDtQPBA78DvAO3A70DrwOxAyAAswOtA70DvQO3A8MDtwPCAygAMgApADoAIAAHAHsAYgBpAHIAdABoAEQAYQB0AGUAfQAHAAcApAPMA8ADvwPCAyAAkwOtA70DvQO3A8MDtwPCAzoABwB7AGIAaQByAHQAaABQAGwAYQBjAGUAfQAHAAcAkQPBA7kDuAO8A8wDwgMgAJQDtQO7A8QDrwO/A8UDIACkA7EDxQPEA8wDxAO3A8QDsQPCAzoABwB7AGkAZABOAHUAbQBiAGUAcgB9AAcApAO3A7sDOgAHAHsAcABoAG8AbgBlAE4AdQBtAGIAZQByAH0ABwAHAKQDzAPAA78DwgMgAJoDsQPEA78DuQO6A68DsQPCAzoABwB7AGEAcgBlAGEAfQAHAJ8DtAPMA8IDOgAHAHsAcwB0AHIAZQBlAHQAfQAHAJEDwQO5A7gDOgAHAHsAcwB0AHIAZQBlAHQATgB1AG0AYgBlAHIAfQAHAKQDmgM6AAcABwAHAJEDwQMuACAApAO3A7sDtQO/A7wDvwO5A78DxAPNA8ADvwPFAyAAKABGAGEAeAApADoABwAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAAcAlAMvAL0DwwO3AyAAlwO7A7UDugPEA8EDLgAgAKQDsQPHA8UDtAPBA78DvAO1A68DvwPFAw0AKACVA20AYQBpAGwAKQA6AAcABwAHAA0ADQAMAA0AnAO1AyAAsQPEA78DvAO5A7oDrgMgALwDvwPFAyAAtQPFA7gDzQO9A7cDIAC6A7EDuQMgALMDvQPJA8EDrwO2A78DvQPEA7EDwgMgAMQDuQPCAyAAugPFA8EDzgPDA7UDuQPCAyAAKAAzACkALAAgAMADvwPFAyAAwAPBA78DsgO7A60DwAO/A70DxAOxA7kDIACxA8ADzAMgAMQDuQPCAyAAtAO5A7EDxAOsA74DtQO5A8IDIADEA7cDwgMgAMADsQPBAy4AIAA2ACAAxAO/A8UDIACsA8EDuAPBA78DxQMgADIAMgAgAMQDvwPFAyAAnQMuACAAMQA1ADkAOQAvADEAOQA4ADYALAAgALQDtwO7A84DvQPJAyAAzAPEA7kDOgAHAAcAowO1AyAArAOzA70DyQPDA8QDvwMgAMQDzAPAA78DIAC6A7EDuQMgACAAxwPBA8wDvQO/AyAAIACxA8ADzgO7A7UDwwOxAyAAewBhAHAAbwBsAGUAcwB0AGgAZQBuAH0ABwAHAAcABwAHAAcABwAHAAcABwAHAAcAIAAoADQAKQAHAAcADQAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAewBtAGUAcgBvAHMAUwB5AG4AdABhAGsAcwBpAHMARQBrAHQAaABlAHMAaQBzAH0ALAAgACAAewBmAG8AcgBtAGEAdABlAGQARABhAHQAZQB9ACAAIAAgACAAIAAgACAAIAAgACAADQANAJ8DLQCXAyAAlAO3A7sDzgO9Ay0AvwPNA8MDsQMNAA0ADQANAA0ADQAJAAkAAQAJACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIACRAy8AoAM6ACAAMwAwADAANQAvADQALwB7AHAAcgBvAHQAbwBrAG8AbABvAH0ABwAHACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAA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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFwAAAAYAAAAAQAAAAEAAAAQAAAAAgAAAOn9AAAYAAAAAQAAAAEAAAAQAAAAAgAAAOn9AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUgBvAG8AdAAgAEUAbgB0AHIAeQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABYABQD//////////wEAAAAGCQIAAAAAAMAAAAAAAABGAAAAAAAAAAAAAAAAAAAAAAAAAAADAAAAQAIAAAAAAAABAEMAbwBtAHAATwBiAGoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEgACAAIAAAAFAAAA/////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABqAAAAAAAAAAEATwBsAGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKAAIA/////wMAAAD/////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAABQAAAAAAAAAMQBUAGEAYgBsAGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAgAEAAAA//////////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAPhYAAAAAAABEAGEAdABhAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACgACAP///////////////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAACqEQAAAAAAAAUAUwB1AG0AbQBhAHIAeQBJAG4AZgBvAHIAbQBhAHQAaQBvAG4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAoAAIABgAAAAgAAAD/////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwAAAOwAAAAAAAAAVwBvAHIAZABEAG8AYwB1AG0AZQBuAHQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABoAAgAHAAAA//////////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZAAAAhTQAAAAAAABPAGIAagBlAGMAdABQAG8AbwBsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFgABAP///////////////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP7///8AAAAAAAAAAAUARABvAGMAdQBtAGUAbgB0AFMAdQBtAG0AYQByAHkASQBuAGYAbwByAG0AYQB0AGkAbwBuAAAAAAAAAAAAAAA4AAIA////////////////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAAAHQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///////////////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD+////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///////////////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP7///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////////////////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/v///wAAAAAAAAAA",
    title: "ΥΠΕΥΘΥΝΗ ΔΗΛΩΣΗ",
  },
  syllipsi: {
    string:
      "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",
    title: "ΕΚΘΕΣΗ ΣΥΛΛΗΨΗΣ",
  },
  gnostopoiisi: {
    string:
      "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",
    title: "ΓΝΩΣΤΟΠΟΙΗΣΗ",
  },
  ypiresiako: {
    string:
      "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",
    title: "ΥΠΗΡΕΣΙΑΚΟ ΣΗΜΕΙΩΜΑ",
  },
  katigoroumenou: {
    string:
      "UEsDBBQACAgIACiMdFoAAAAAAAAAAAAAAAALAAAAX3JlbHMvLnJlbHOt0sFKAzEQBuB7n2KZe3e2VURks72I0JtIfYCQzO4Gm0xIplrf3lAKulBWwR4z+efnI6TdHP2+eqeUHQcFq7qBioJh68Kg4HX3tLyHTbdoX2ivpUTy6GKuyk7ICkaR+ICYzUhe55ojhXLTc/JayjENGLV50wPhumnuMP3sgG7SWW2tgrS1K6h2n5H+142eRFstGg0nWsZUtpM4yqVcp4FEgWXzXMb5lKhLM+Bl0PrvIO57Z+iRzcFTkEsuOgoFS3aepGOcE91cU2QOWdj/8kSnzBzp9pqkaeLb88HJoj2Pz5pFi5Of2X0BUEsHCOVy9kToAAAA0AIAAFBLAwQUAAgICAAojHRaAAAAAAAAAAAAAAAAEQAAAGRvY1Byb3BzL2NvcmUueG1sfZNBb9MwFMfvfIoo9zR2wzqI2kwDVAmpg4llgnEzzltnSJzIdtf1tmmgXXbcN0DckFA1KjRpU7+B85WwkzasU0dO/r/398/vPTvdrZMsdY5BSJbznotbyHWA0zxhfNhz9+O+98x1pCI8IWnOoedOQLpb0ZMuLUKaC9gVeQFCMZCOAXEZ0qLnHilVhL4v6RFkRLaMg5vkYS4yoowUQ78g9AsZgt9GqONnoEhCFPEt0CsaortAJrRBFiORVoCE+pBCBlxJH7ew/8+rQGRy7YYqc8+ZMTUpYK11mWzcJ5I1xvF43BoHldXUj/0PO4O9qlWPcTsqCm7UXRQSUgFEQeIYQFgft8y8D16+ivtu1EbtwMPYQxsx3gzx0xChj13/wX4LrNe5iOJ3r7ffxNv9g8Hg7YG1NhnrSkBSwQplLjSqkisBo1PChyMz/Qi4t79XWZqQvdeUSLVjXsAhg+TFxDDWxBahXcG4rc700PbQpoc6McJhENQ9PDA1M8kWoP8PZcNDgddGMX5ugbhzbyhLQFWHgGNmX2+EcXVko22vcvTpM1BVD6IRZq2YSiHSV3qm75zyQs/LM/1HXxv5q/yqp/rG0dPytLx0Hvn09/KbvjPWn+V5ea5nq5uMmhuuUWf6trzUv/WNnj+Gqnk/7EZjnBnrtb7V07Cqua6zamz1f4v+AlBLBwj8tfxx/wEAALsDAABQSwMEFAAICAgAKIx0WgAAAAAAAAAAAAAAABAAAABkb2NQcm9wcy9hcHAueG1snZHBbsIwDIbve4qq4jSJpnQtKigEbUw7oQ1pHeyGstS0mdokSgKCt58LW9XzcrJ///6cOHR5bpvgBNZJrRbhJIrDAJTQpVTVIvwoXsZ5GDjPVckbrWARXsCFS3ZHN1YbsF6CC5Cg3CKsvTdzQpyooeUuwrLCykHblntMbUX04SAFPGtxbEF5ksTxlMDZgyqhHJseGN6I85P/L7TUoruf2xYXgzxGC2hNwz2w166zoaQXaKE9bwrZAsti1PuMPhrTSME9Loat5ZeFt+skkqRRHmVRMlpLdTzvP/PpfpoGA8cen/INwpM0j0dPR9mU44SSIa5jb287Z5MsivFcDX8a3fAKHMOuW0B32paOpVlKyS2kq5pbLjw2sCSboXMgDIo76et3wwVCHtJkNrQNSjjP8spyUyMt76b2KV3p1nB1YffY+xuiof8s9gNQSwcI957Lq0kBAABCAgAAUEsDBBQACAgIACiMdFoAAAAAAAAAAAAAAAATAAAAZG9jUHJvcHMvY3VzdG9tLnhtbJ3OsQrCMBSF4d2nCNnbVAeR0rSLODtU95DetgFzb8hNi317I4LujocfPk7TPf1DrBDZEWq5LyspAC0NDictb/2lOEnByeBgHoSg5QYsu3bXXCMFiMkBiywgazmnFGql2M7gDZc5Yy4jRW9SnnFSNI7Owpns4gGTOlTVUdmFE/kifDn58eo1/UsOZN/v+N5vIXtto35n2xdQSwcI4dYAgJcAAADxAAAAUEsDBBQACAgIACiMdFoAAAAAAAAAAAAAAAAcAAAAd29yZC9fcmVscy9kb2N1bWVudC54bWwucmVsc7WUzWrDMBCE73kKo3st22nTECznUgq5Fhd6VeW1LWr9IG1K8/YVdRs7EEQPznFG0nyDWKncf6kh+QTnpdGM5GlGEtDCNFJ3jLzWz3dbsq9W5QsMHMMW30vrk3BGe0Z6RLuj1IseFPepsaDDSmuc4hik66jl4oN3QIss21A3zyDVRWZyaBhxhyYnSX2y8J9s07ZSwJMRRwUaryCox9MAPiRy1wEyMuo05BB6HV8sie+BN+Am/KjzGH99e34R49/fnr+O8R+W5LdGY83fB5gqnK1Yic2iMwiI4S3Np/DXiVV4XLIChrOzO/iRoxmdxe2SHcTRo1FvgXbukaaTSyWC+muzKunFd1N9A1BLBwgW3GKqCAEAAKUEAABQSwMEFAAICAgAKIx0WgAAAAAAAAAAAAAAABEAAAB3b3JkL2RvY3VtZW50LnhtbO1de08bVxb/fz/FyH+s2gj8AEKBFqo23T6ktopCuv17sAeYrT1jzYxDaFWJZ0m0BKnbRN1Eu9tWaVSt1gE54IIB11I/wPV36CfZc869dx5+xTYGJskksj2PO/eee+7vntc9l3nr7du5rHJLs2zdNKZjqXgypmhG2szoxsJ07LOb7w9PxBTbUY2MmjUNbTq2rNmxt2f+9NbSVMZMF3Ka4ShQg2FPmdOxgmVM2elFLafawzk9bZm2Oe8Mp83clDk/r6c18RMTT1jTsUXHyU8lEuKhuJnXDLg3b1o51YFTayHBH3lPtJUYSSbHE5aWVR2g117U87as7Van9m/lsrLcUjetLplWJm+Zac22gRG5LG83p+qGW00q2UWHsR73iXw3LWcsdcnXZJCQ9/hNWWNeT/dRJTzlFCzNI8tuqsTtSxz6IoaASIEaUskGomYX1byvtoWz1faBZRbysrZcV/3LqdYXhTyyPQ+wmNOzurNMXfWISo2djaoGxi/1V58PhKmrvVUw4laQS099tGCYljqXhekIlCjYPQVqjM3ArJwzM8v468xlxc91Sxx8riwh+ifHx0dicOgs56GCzG01lsACf0vDtVtqdjqW1eYdfg0e+sjI8MdSyYkWT0GJj9Vls+C4t+b121rGvXlNy2Y/UTkFZp7XlGxRD7bZqZ0503HMXPvnLX1hsUMFiSZigG7T/EJ2OQn/8CHD/PBdkHWiDcP8q+9sXrds55qZLeQMcSWr2s4Nc8l3FrhND4j7Lg3uaHxg6Rk8XIBfeIzTPjqSGuEdaricnGx5eSzl1SwrdHgLFraUkAfwm+bf8uxzX4stxjX9LuAN1II3csQonAxZDR+wv5yOjdFBXk1rostpM2tanJ3JZGBk+3zaHfc+n5e46OvxRIAPCY97efoSx7POclaTTXyKcikr2uYFrPdNw7GhgGqndX06dk3N6nOWji0uvmPYwStp2zulSuwvZdUjI/LKNTt4LSHaSrhEWa3a99fdDTk9tw8MmmG/sFp9lR2yfVZme/UNVmIVhZXqK/VtBc5qCvu5vllfYTW2D8VK9W+wGKvFib28Kt4RwfCO0IVZEUE3gu6goPu4vsmqANJifb2+zsrN4GVVPFtlp/VtdsAqiOZvWRVKHcPFCpSowNG2wp4AwIvsBP4fwqfWF7ZBtEfYDi225/j3NTsUSO+fGsL9E/Yj+4HdZw/YQ/Yd+xf7VplS2H1lWJlsj9yEZ2h45gaQrxrObB4scNmcYxU0OWidLZE2dilaPLN51ZAVjkYzYVAzAeuGFuHWnAYOFTQzTu2o845m0UmDZ5AGF1yzXmUV8QR1Acj+Moj6fXbKSjBVfv8fu8OO2RFojHV2qMC939hTVB54Wl9T4F4JTtEkQtOoBlrmlD0FvQFHymvsUZz9GGf346//ftLBChLzLeF6dt0NsTd2BLTzGboxfqXQAOOLG7uuCHA52v/08M+O1MhFTA8fGMcvRos0t9mRsTQrHrBH7J/w/Zh9ryjw+x/4/AymEZyzx3DlERz/DMffgZr5CT5PQMk8YP/GI0V5TXGngPJ6iwnQ+3BldUO7UcDwiFpwzJi4AqqjWaKB+F4810kRYOdYD0PY7yRo3yBwFsNPUqXkLc3WrFtabEbBfwHOXyRNM1/phu7oavZrtLFJYFZAwu6B0FzjpvQhSE2UrXSpGzoHJE86kz2kgC5Acb6Odj44skco1NFNALrrd5H4f7CNlh6C7JjPR6ivDXHNgW5Hkf3quR81oUCgyg3QK6v1uwoqFtAhqIRq9Xt0VKVmm1SN7+YQJ0pBYsCVOaG7R3htKpp1AxGcveEHJOBP7L8kF0FOToUF1+1EBPuRY7qGaAJUcYyuE0YBd3F2Eq+vxJU3IyxdBpa+JRfuESDq4QuBpnOjr4UT3J0Ssgt2Xks7X4eFczNDYeNRm7EESbAPUuBU6LAiyIcyODaorEDRVOt3WTU0PG3lYL1I0ql36XAxntd5Gp2XRyJI1QZLSQGoA6LBtNoj1QfGlUJfeAYm4C6CH6yyElyQAWNp1JXYr/VtaY6hHj2B02OyHcFS44sjYBOW0VCE7y1fYWkXB607YSEfkwoGo3IDrcVgEd8SzD4na4UC2EX2jIcnzlEQDxAqZFRvgmwB0o94CCUEdOOSL8kDuqYZw5/NdtedK1euhB35AlTr9U0AzjHgiPwXEbcqXS71z+f7DHD4RRf1kZC/IKg/JnlZ5WCvgoe9xUX4ELrKINNB+KPPXBV+cwUUwI4r/J8n5jtLdbSN8Ml9Wgwv1r+hC1LaY5tFETigSLKIEKBw3/VR8MfKQ6R0E+rbhseRJnD7eWUwV3kpWnp35aeSSl51paqMvg21U2XboKRKWBwqw2VPEg71HQx/Y7BCVoT9xF8eFgENcwLMxJX+atNKasmjpaRMpoaUyavwGYfPG/CZGAL6kviVwq9RqeNSybEhZeSNUeXPai7/JhyNeX2Azh7EwUnlIwRH94lQ6a0GdCX160CEYjZobEpTgkWyf3tQ4alPYdJAuxF9MfSIl10ZaxlqU4OUpaCeMTDEY0Z/J8YcAYPWkRq6QQ3VAH672MQBmRlltKcV0QkkeEci9RQYjEsJJ3ipbduINAwVUdxIUA+PbxFUsWzRxQfOgWYLo23NB4TnVTg5JKQEOXzK41gAwlXJtXY1wd0K0LbCu+0+fygwDT3nAawt+CDT9qCyzhUCi2Fg16WNw7tMExHYJdbo5SQ7EDCR2SjUjd7YyaexQP1vVEaOFA4pzPkdwVrCHnSiAh+YHCQ4ZBARhMpKYPpTQTQ+abqvCah34GKZP4NDgcO3iRMZY6kYO1yl4rtSFO0B9EoAnTvscMjLbCDJtkEIqPFEhwqUO0VuARZ5L3YVHnqU58eeDKhQeEiMUZlOOgYkEeP3UERJ8VCVdnOZMoiOsCseO4AV4FfSMpu0fcXsFyzcIFHtBmVLgBheBTaI7MVwKdIseEdNEVtI2uJI4WHbwUeJVZXgo0pJNNbvElfwlCMDJ7QnxIkffBQ7Ykvgh68iSoEVAivXb1ZxfkNvisCqitR94dbvXJ+hy1PliqcGc3OjvuPDNHeNuLL0j5eAIOjFQw/YqFBJ0a1ybFU9JcGBLDDHdR1azjQjq2Kyc3VFwpMCJas8UU4K4LANOAdlgyUS7gF/jloIaHGc9Bv1eyjNPVG81rCE72rwFemsk1W4KqRcG3Va4QJukws4aviQRNuaJ6KeEdQ84Q5oIvuwQtE0EGxbHFeIWCi2yq0wodDu8cUjlOHY1K4XJSB7ZUNKqnijCf58X+hdM7N8U7vtnMEb8pLII2/IFUUhm93BFSgl7IsG7AGp8CMyfnlkqyyk9rEIO+MVsLdWyT86dD0sz2lBUVB0LTY+yda55coje6TTSNRXwLQ/AqGMD1Z7XdbqewZFsyWks6VtiDiw8KZMhSbcMcPuoN+OXhAH9w6fE2Sykp/BJ0eJcC9TC9rMFaGQAk4Mn4lgSbW0nPB6iQzidR45dxeGuN8MLgEoRYrlXlCoTqetTJQHNx0bTo2NRIs1PcTxwgPrHddHLAVDSkEku2GoXUKtG60Dew5trjukH9o4acIei2LIEfa60AHfyaW1PQQYDwwJMUdBsC1hR5TRkXTjfPd4fOaplzrc5Gg2hJ+lEHdrE9L4GVhDz0RMVtwDJ8jbZVXEXVYiyMJlcVMKWKPeGgDWnY811XY8uI80J8wOGO667/uyod87FZ0XUc51IaUvYmfYD5jrK1Y9CJZolK8pXf+DCs74j/0QofbSgdAZtWED7aMOAelWCAvm8MZbJO4+B6Idnz0DfCOrwYoYFzEuYtxLxrhg6OylYNMAA07nrFR7Vqftsmfau9+YotKwwCJXPzptlGy3eUUZ+O6VRhNwdOJl99MHic9wRW1ftDUOpcE+lUsQZR5BJctREcuPRTcA4Ob21vhKdom2mmEI4c1zd+uj2fEiz44L2zc0J4mYV7O2Jq55pPmuDmixcBtTVOIXB/+LXl2IZkWkMwTUgyqjLPamgF7YZQcYURbqQSSgysU4uURSpJxFkYIqFsTJGuu4IB5XgD+V4NKJ1/LAd4FGWuflmV+Xv5I+WGXUsB8lO/zBjUaJcgX/hWAUnk/qRSOo5x2cKHf2SFJR+g+3iSndjzJwwQHFLIaq64HSwgQlIbh5fIGVsfrdga/yvnrCamChjdDgjAIbteYtEb4Fg5Ya0tuXQxsyh7rajYN7Wn7/RUm12JLDwUo5bWVaNPblyqN2x/0ffA8Jz4I7EjtSqZzIL23YP1qjDB+xX2M3sBOCtnHjphbffgNMk2W/Ykoz7XYVf8oEAztyE8g9ygSqiiXswHYmd+8FcvIBpQ/jOvY+pfM/5VaJmxEtc/IPKbeWmyKcVXJNvMYTqo+JG6c80dq3A4FSrLcwzZePzwFYLCfuRg00hVps94imf3imf2jmfxsb5ftO6Rs0o/nGCJmY6ksC8f9J0R6T/d+xdABcl+CgMjcXtRxQntMN0/oQi7hlm++0NiHa/jm8LnbffuXoOW3WUa1z/GsafXp2G+EGmALCfNW3Z5Dv1sL9A25mzysBnr8YmbBB54+Vhy8Eds5fnY3Qn0GUfxMxNeL/q4iRpntJNF2U09jNXEhFKbzB9s+Hza9WEt4gI3/hy8C7BN+/7/TWM+a3KmdOcY3yW0OAhJc6v/XsCa5Rimv4tGoHxp296+ef9NdbWK2JrNREL51oKu0j2NbSDi+/qKkZzbqhzWuWZqSRbv6eCu2WZsQUa0rPTMesjzLCy21XOqPNq4Ws43tgtPMD9A4xX3HBcLwp6TeAbdfVBbFglV+YxZ7he9BSk/gKPKgb7dSJ0QlZ4BPVUvhrL6Zjk5OjWESkLaRSo/TSiYWCI7w5RZIGAztB9xwzPx17g795ad40vXL8TRjTsavjbkufFnI3OaU2RoOgAXoq5yAn0roLV3yb33XLdN+D4VuAc3Qnq11f4MfQ0/d0C8ZEN933gWStm3O8aMZM4zvQmpnNEXNdd9LICv6mt/Sias3Kd2vw8ZeDnZBv0Ut4L7mc+T9QSwcInBJF8LkOAAApcwAAUEsDBBQACAgIACiMdFoAAAAAAAAAAAAAAAAPAAAAd29yZC9zdHlsZXMueG1s5Z1Nd9s2Fob38yt4tGoXiSxZlj9OnR7Hieu0juNGTrOGSEhCTRIcfkT2/PoBQVKidAmKF7z1LGaTWJTuQwAvXgCXn7/8+hz4zg8eJ0KGl4PR26OBw0NXeiJcXg6+Pd68ORs4ScpCj/ky5JeDF54Mfn33r1/WF0n64vPEUfFhcrG+HKzSNLoYDhN3xQOWvJURD9V3CxkHLFUf4+VwLWMviqXLk0ThA384PjqaDgMmwkGFGU0AKBBuLBO5SN+6MhjKxUK4XKNU+OhI/xX4FSBwuxQkYPFTFr1RvIilYi58kb7owgycwL34tAxlzOa+qq0qz+Cdqqsn3Q98wTI/TfKP8UNcfiw/6f9uZJgmzvqCJa4Ql4NHEajmuedr56sMmKri+mJ1FSbN33CWpFeJYI1fugncPMx36bNwqb7/wfzLAfff/PZ1F7XZNBee2i2L38yu8sBhWebhfk2i/U/5f0kWRbGS7CpL5e1LtOJhUu0zjTNeAqMSWEcMQcP5LOVhOit6jvqWL+6k+8S9Waq+uBwcDYqN3z49xELGSpXLwfl5uXHGA3ErPI+HtR+GK+Hx76pM3xLubbf/eaPVLje4MgvV38enIy2mn3gfn10eparLq29DFqhd3+cBfv7rTGx3rsP/XcFGZas3xa84yz3jjPYR52jEuBGR1Kpf7GSv7iP0jo5fa0eT19rRyWvtaPpaOzp9rR2dvdaOzv/pHYnQ48+FETtQD3HGRJxjIs6EiHNCxJkScU6JOGdEnK690sxJpQung2MaLpgjiLhgSiDighmAiAsGfCIuGN+JuGA4J+KC0ZuICwZrAm6x1HI+KZuFaW/aQso0lCl3Uv7cn8ZCxWJ6Ewkvn/R4TFJJAkwxspUTcW+ay/Rn0EO6zixd5/M0z8UcuXAWYpmpTKR3wXn4g/sqLXSY5+WZDR0w5mkWh3R9OuYLHqt8nFN2bDqoL0LuhFkwJ+ibEVuSsXjoETdfRSQZFDYdmmXpKneNIOjUAXNjSTDmM7Lx4U4k/dsqhzjvM9/nRKx7mi6mWf1zA43pnxpoTP/MQGP6JwY1zaiaqKQRtVRJI2qwkkbUbkX/pGq3kkbUbiWNqN1KWv92exSpz/eXIaPux+6ufZlQDHgzsQyZWgD0n27KY6bOA4vZMmbRyskPLoMq9t7Pe+m9OI8Uc9qGRLWu113kWtVahFn/Bt2hUZlrwyOy14ZHZLANr7/FPqtlcr5Au6XJZ2bZPG00bfesYMb8rFjQ9ncbS/v3sK0BbkSckNmgGUvQg+/z5ewt0VJvW8r+Bduy+ttqf1QiLV6JJCilL90nmmH49iXisUrLnnqTbqTvyzX36IizNJZFX6tbfjzubPmPQbRiiUgAovtU/0G6WZCr9plFvSv04DMR0uj28U3AhO/QrSBuHz/fOY8yytPMvGFogO9lmsqAjFkeCfzpO5//TFPAK5UEhy9Etb0iOjykYdeCYJIpSNIjIqllpggFyRyqeX/wl7lksUdDe4h5cdFGyomIMxZEPpW31Li4VuMPwWpI8/5isciPC1GZ6pEEVjtsmGTzv7nbf6i7lw7JkaEvWaqPP+qlbv9UaAfXf5mwg+u/RNBqqukh778Eld3B9a/sDo6qstc+SxLhktW24lFVt+JR17d/8lfypC/jRebTNWAFJGvBCkjWhNLPgjChrLHmEVZY86jrS9hlNI/gkJzm/RYLj0wMDaNSQsOoZNAwKg00jFSA/lfo1GD9L9Opwfpfq1PAiJYANRhVPyOd/onO8tRgVP1Mw6j6mYZR9TMNo+pnxx8cvlioRTDdFFNDUvW5GpJuoglTHkQyZvELEfKjz5eM4ABpQXuI5SK/rUCGxUXcFMvZbJ5SLrYLHJXI3/mcrGg5i7JcBEdEme9LSXRsbTvh6MjagcOT84Nhjyse9E+jH3zm8pX0PR4b6tSaL88i5gp46LT7yZI7sVylzmy1Odpfx0yPDkZWCftO2OEdNrX5dNx6mskTWVAVFF49Oz3uHgwukZ1ODgdvVxI7kScdI+E+p4cjt6vkncjTjpFwn2cdI8HFvtM2P3xg8VNjRzht6z+bHM/Q+U5bT8xXwY27betIm8imLnja1ot2rOJcuW5+tgCq080z5vhu5jHHY1xkpmDsZKZ09pUZ0Wawr/yHSBqPUR84/725emJ/d8eTziPnn5lMwWnqcfebuj6phVOYcKeRc9z9xNXOKGNux87DjRnRedwxIzoPQGZEp5HIGI4aksyUzmOTGdF5kDIj0KMVnBFwoxWMx41WMN5mtIIUm9GqxyrAjOi8HDAj0EaFCLRRe6wUzAiUUUG4lVEhBW1UiEAbFSLQRoULMJxRYTzOqDDexqiQYmNUSEEbFSLQRoUItFEhAm1UiEAb1XJtbwy3MiqkoI0KEWijQgTaqOD2RaRRYTzOqDDexqiQYmNUSEEbFSLQRoUItFEhAm1UiEAbFSJQRgXhVkaFFLRRIQJtVIhAGxXcD4w0KozHGRXG2xgVUmyMCiloo0IE2qgQgTYqRKCNChFoo0IEyqgg3MqokII2KkSgjQoRaKOCG+yRRoXxOKPCeBujQoqNUSEFbVSIQBsVItBGhQi0USECbVSIQBkVhFsZFVLQRoUItFEhoq1/lqcoTZfZj/BHPY1X7CPu8ykK9bV+K/fOMdTuqKpUZlb3exHeS/nkNN54eHzcHSLmvpD6EPULwBBcAfHlun6Hj9VjPLpWpbwXQp8zBYcwJ10jwTGVSVuXr0eCJG/S1tPrkWDVOWkbfeuRYBqctA262pfVRSlqOgLBbcNMLXhkCG8brWvhsInbxuhaIGzhtpG5FggbuG08rgWeOPngvB990rGdppvrSwGhrTvWCKdmQlu3hFoZj+13Fs1M6KqemdBVRjMBpacRgxfWjEIrbEbZSQ1thpXa3qhmAlZqSLCSGmDspYYoa6khyk5qODBipYYErNT2g7OZYCU1wNhLDVHWUkOUndRwKsNKDQlYqSEBK3XPCdmIsZcaoqylhig7qeHiDis1JGClhgSs1JBgJTXA2EsNUdZSQ5Sd1CBLRksNCVipIQErNSRYSQ0w9lJDlLXUENUmtT6KYp8t1cJxi7BaIG5CrgXiBudaoEW2VIu2zJZqBMtsCWplly3VRbPLlurq2WVLdRntsiWgp1221CisXbbUqLBdtmSWGpctNUltb1S7bKlJaly2ZJQaly21So3LllqlxmVLZqlx2VKT1LhsqUlq+8HZLlsySo3LllqlxmVLrVLjsiWz1LhsqUlqXLbUJDUuW2qSuueEbJcttUqNy5ZapcZlS2apcdlSk9S4bKlJaly21CQ1LlsySo3LllqlxmVLrVLjsiWz1LhsqUlqXLbUJDUuW2qSGpctGaXGZUutUuOypVapDdnScL3zAqacrV/ipX6cvkQ8fwZ37YYZ/dUnr/5qJK94LGl+JjAPzkvilK+CKn+kC1yeMNR/x4nK6srfHB253mRyXlarfL3UWnhynd9fHEtfb+/wvqnijVYbbLEpKW6SVFvn+XOjePn2JrZIebz50d9uFeXzRVo2SlkSw3u8rmJR1L58e9fms907u9xcq6oQTNWx2PzE43C/Qv+pNoyn1ZbrTVuMq47W+x1gWmjYGdyV6g1u9XyrqjOUT6bd3FpVPZe2pWsYHmarS7/tpNWvy96xeyYadqvt+8vwdXhgS14+Bny/rPWn0Bcdjandfwn36rJb/QMdvWNZm81Xnb/fL2i1vamQdS+G+ZMqy+35oyv13cegOUsHPHEe3dcCtn6D5hpP6vYaFd3xoJnuhGrZ4nliMxYmNVs1fLPtxfcylXqzc/37H87sunLYdvsH/oOFbMliAcxz1mCes24eaNZk0477omwfp3xIloPD4rbB88eIfc3ytxGy9C5vkkG5Mb9/EAxrc5muGpWoNci4T+X1rbj7Fdcbm+q82+VqLwls6iNtitoW97p8Scl+iauXlxwSqsEl1QR1pzQohpHE4JHRGOWR9h4tin+vk/3+PWno35M+bZY/2PYZtFixlay9XrcbFM+tZqF3U7xJp2k45bGjfuCUv0BXdK9C/UoKCli+SKj3uJKyeVL+v7GCz5meICOZ5Fc7luNl/Rdqzci3P5mMTvQhAl+X6XIQypCDmLg67K5Dzo6Ppk0hw6pERK1nkHfRTdP/+9aLVZvpZ/0oJ4JG1N86m6//VwbZKWSWNKi9W1Dnp/xHP79CeYt1Y/U89W36VD29ojV9crZzKFwUn5fJ6faCzcOLZHM50zxt3CtQvcTMlN6VD5XtXch07pd+mvvX3Pc/s+KTjBRrXSZuRVm9Z1bmOSpfK74dHZ01fD8vHk1tjNeOMgOGu4UZbgq5bcbqr+TdfwFQSwcINXQjzLMMAAA2ewAAUEsDBBQACAgIACiMdFoAAAAAAAAAAAAAAAAQAAAAd29yZC9oZWFkZXIxLnhtbO1XS2/cNhC+91cQ7LVraeP1JlCsDVI7TgwEiWG7uRYURa1YUyJDUvvor+9wKGkfaQI3SXso4oM1fMw3D818oz1/sWkUWQnrpG5zOj1JKREt16Vslzn97f5q8owS51lbMqVbkdOtcPTF4qfzdVaXloBy6zKd0862meO1aJibNJJb7XTlJ1w3ma4qyUX/oL2GzWntvcmSpFc60Ua0cFZp2zAPS7tMosql5l0jWp88SdN5YoViHlx1tTRuQFt9yf6qUcO99WOsrrUtjdVcOAc5aFS02zDZjjDT9BEBB5xRwzzGcmnZes/koSOX8XBANJJ/BSRo+c6KnVvuE5AxlhOIpX8F6AogTNMjp+5qZvbQlt+G9trqzgxozaPia5h96ExIu4GyKKSSfouh7pyazr7Nq6PEr78Ob68Ip2f/DODJCNDw7HrZassKBZ0InpAQHgFEuoCGNPjvxuLjzm+VIOtsxVRO3whWCkuTcCLbEratXNY+p6fzNO7aoJbsnj2M/eQMfHipvLAt8+JCtx46Ezcvag1Ok1vxsZNWQF1BcaFXfQmCaDLW8lpbUogavIDGBsKhpJTO3+c0jdKvo/R2lG5RcrIxStxohyul+YMoo8i2uvPX7YVQCjeYUnr9HkhNMYMmImusxBsRw55RdGdEJBvU24b/CR4Z7WTgmTej7pXVTU6h4JbABDEaJZftgkMGhIX8DBsojvoHaB+O0AyzbGmZqelw7X1VOeEX89OzAabfOUD9gNfFJmSfcHB+OpunZ5Tw7SDGKERVCe5fxXsxNx7/W/xf7OJdgxd3HztmoWZAvAfsnBba13eyBMaPl0rNbyyRJea0ZQ0U4ZWFx5RG9/B8cc4yjEnyvuLZVzAV8u0e1CXzjHRWfg++CrFAHzoTBf5udQflnsSVMzGETWWb8ATEo+pgIfF91p9C//RZfxpbKdmpGuv8a6EbEoScWngVGBJbvXUeb+6k4W44b/WVVAotqZasg9mD7STsY8YHd1EKDR91bkUFb2kTFZN+JxxVALB3GIPBGjlWGXdRDfp8vNBIYCCMdM9qEP2m2ISGD8+RGR7LSrbnm4MLN2wp3nVNIXp7n2enL2uuM64V8E5/mOLfPuQ6q1R5UbNwpZfutwbKuxCx25NxPyp9Z+uydd6GngsdA++UcbBtgEaFXUG9kpuXr1+RcH+8+K+48ZkkOBF4yovh8ne26hdpWP2nIYm23EWTYJEmR5Wb7NU0SIUut0B+6rqN88cOgh+EYhDilMtp7HZnXnYeWtcPLROR+gWyUHJAc/vryKsREF0cp2kyzlwcv1cw8wrGH7DL4Ctvcb7KAuEgW7tAe7+DZ9eXI2MT+GCqoZvTX1I1eQL0NXt2Op+dHa128lyl+6uNCD8LrMYZXFGiMxy6suU4hKtwug1fKcPIyljhtOq8eB5H6ESJymep8cPaa5OlJ+kZ7Kxl6etsejIFucaR3S8apydhPE0QPHM4sJ6vJh46YhKzlAEO3hsMT2BT/glvlakszurPHU+G4ZyNU36FlAnRlcJDNhvdOcGV5A/h7ZLwi6liymFnrLKYD4I1mdOfT2fzMzaj5A8duhaTAR+4UHjwA6vk4cukAnNRNQRQ6B/0+YM+/zf0uV/U0xQ/MImPCcG2RYBIUhEDWSs54LLkb39tHJmtS7v4C1BLBwhSjCwg3QQAAMcQAABQSwMEFAAICAgAKIx0WgAAAAAAAAAAAAAAABAAAAB3b3JkL2hlYWRlcjIueG1s7Vfdc9s2DH/fX6HTXmdLdmw3VSP3sqT5uOu1uSbr646iKIsLJbIk5Y/+9QNBSf7o0nlprw+7+kECSQAEYOAH6Oz1uhLBkmnDZZ2Go2EcBqymMuf1Ig3/eLganIaBsaTOiZA1S8MNM+Hr+S9nq6TMdQDCtUlkGja6TgwtWUXMoOJUSyMLO6CySmRRcMraV9hK6DQsrVVJFLVCQ6lYDWeF1BWxsNSLyItcStpUrLbROI5nkWaCWDDVlFyZTtvya/cvK9HxrY65dSV1rrSkzBiIQSX8vRXhda9mFB/hsNPTS6hjbs41We1cuW/IpT/sNCpOn6ESpGyj2dYs84WS3pch+NL+BWgKaBjFB0bdl0TtaFt8m7ZrLRvVaauO8q8i+rFRLuwK0iLjgtsNuro1ajT5NqsOAr96nr6dJBxN/5uCca+gosntopaaZAIqESwJnHsBaAznUJAKH3caX/d2I1iwSpZEpOENIznTYeROeJ3DtuaL0qbhySz2u9qJRdt3q0Z/cQY2nAvLdE0su5C1hcrEzYtSgtHBB/ap4ZpBXkFyoVVtCgKpElLTUuogYyVYAYUNgBMGOTf2IQ1jT/3eU2976gNShldKsDtpcCUkfWS5J8lGNva2vmBC4AYRQq7eA6gJovAKjxpLdsO82+MQzek1BmuU27hnhEdKGu5w5qaXvdKySkNIuAUggfdG8EU9pxABpiE+3QaSvfyeto8H2hTRZKGJKsOO7X1RGGbns5Npp6bd2dP6EdnZ2kU/oGD8aDQ7nYAHFFwYTV+enE5bP1hRMGrfeE4fHYtPjc9s6/EK7Lj/1BANWQPkA2hPw0za8p7ngPmeKZf0Tgc8dyEMalJBGl5peLmARt35/Iwk6BWnbc6TZ2AVIu6OqktiSdBo/j0Qy/kClWiUJ+i75T0kfORXRnkX1oWu3Bs0HuQHcaFv4/4ijrdxn5ziebQVVtrYayarwBFpqOHPQKfI8q2xyLmlOl53XssrLgTeJepg5S7e247cPsa8MxgpV/Re5gMr4H9ae8Go3XFHBSjYOfTuYJYcivS7KAa13jNUHFAIPd251ZF2na1d0bt3jw7HIpNuMWeP4Y4s2LumyjqmDJ/mc3c+Hns7nkau4zRSKQCZWpYYf+FXrwInXXZD9AmFMlAAekwvIbcCx2I94w+ypBD5RUmcUEs9bBTYlDGPVVG//xyrDq/9Fzu3VvHaWO1w5Ik43Z1fv8Fg9Yw/1LwngmaYQ2XLOuYfZI2dj5+dN987BKzOt95HWL7RQU1HO9UOVCbzDTQGcVv77qw7wnZE1hF+BkhDj4NGnTcWQM12YOI1tQtE6GivBeyufc/xCtHEftaI+okEh5MrmAgyQh8Rf2AGnp8tEwfF2MmMawl/gmW3l303C2CcLAHn4t9iMRiPJi8mpyezyfRgtaVnIt5drZn7aNISJ5QiDGSCIwmvKY4ohTvduBmua+gJyYwUjWWv/IAxEKywyfjk5fB0qmy3aaVK4mHsdlY8t2XycjhyixLHmmQ0HiKzkQPXwQd4R2Kwp79aDiwU2MAHKwFNyNfdP4BN/hn+XCISP9A8dTzoJpikH4WW2FPAyZxZCGolG8Oo4PTR/cmB+6wsiDBYUMvEhyXA1EzDX08msymZhMFf0oEAxgS+AiD/4Cs0p258K+A6L+ocyOTP/vKzv/zsL//7/rJb7qMYv04C6wOIgIYKPIp7HQjr0R7YR//4sXpwbZnr+d9QSwcI6U0ycQwFAAAGEwAAUEsDBBQACAgIACiMdFoAAAAAAAAAAAAAAAARAAAAd29yZC9zZXR0aW5ncy54bWy1U8FOIzEMvfMVo9zpTDmwqGKKuBRYbXelnXLh5k481FISR4mH2eHr151SgUDigrgleX5+9rNzefXPu+IJUyYOtZnPKlNgaNlSeKzN/WZ1emGKLBAsOA5YmxGzuVqeXA6LjCIalQvNEPJiqM1OJC7KMrc79JBnHDEo1nHyIHpNj+XAycbELeasVO/Ks6o6Lz1QMEtN+czsi2ERMbUYRMupKlPuAfRbtM2YBf2Kg+Tp0WIHvZMNbBvhqLwncLX5UV0cONAL345xhwFEmzvikno8BOxewQft7RjwItmyjyCvp+bQrkYF8GrE4ZW25EjGNVs0CvWJPtjgqU2cuZOZUkruOmpxMsIcFednbyXfC7FOJ5FF7dNhI6PDvQUNPeN1sD/7LKQZpy6+UMFnBahHqvxHp7kZI64QpE+6Bd8jZvk3y8pRXFNKnO6C1U34NjHqOkwqQCC41l2ixMPk8y2C1U/xRd3y7RqJUqfR/YKphCkM3enN3z0JIct1JqjN/rYlq6IvKY4fbfkfUEsHCCsPlR2HAQAArQMAAFBLAwQUAAgICAAojHRaAAAAAAAAAAAAAAAAEAAAAHdvcmQvaGVhZGVyMy54bWylk89ugzAMxu97CpR7C1TbNKHSXqr9uU3q9gBpCBAtiSMnwPr2CxRo100Tay+xkP39/Nkky/WnkkHN0QrQKYnnEQm4ZpAJXaTk/e1x9kAC66jOqATNU7LnlqxXN8smKTMMvFjbBFJSoU4sK7midqYEQ7CQuxkDlUCeC8b7QHoFpqR0ziRh2IvmYLj2uRxQUec/sQgPkg2wSnHtwkUU3YfIJXXeqi2FsQOt/qt/reRQ10zp2gBmBoFxa/0OlDz0VVToERNHEwZuOaPCTOmcIW1OWn43sjkkB6IR7AKkV7kK+dGW/QEZZ5n7Wfpf0FnxhDg6M7UtqTmhFdfRnhAqM9DUpPkUxY/KtGs3/lrshBRu3416NBXfXufqbPHNZbyTSxjf/Q+wGAGKJS+FBqQ76V+idxK04wWeSFb+QZrueMUubN1e8qBJaipT8sxpxpGEbQbbgvAYewH+lusrutM/99UXUEsHCNWj/0pgAQAALgQAAFBLAwQUAAgICAAojHRaAAAAAAAAAAAAAAAAEgAAAHdvcmQvZm9udFRhYmxlLnhtbLWRTU7DMBCF95zC8p467QKhqGmFQKxQF7QcYOJOmpH8E3lMQ26Pm6YbCFIFYWfPjN/35nm5/rBGHDEweVfI+SyTAp32e3KHQr7tnm/vpeAIbg/GOyxkhyzXq5tlm1feRRbpueO8LWQdY5MrxbpGCzzzDbrUq3ywENM1HFTrw74JXiNzUrdGLbLsTlkgJweZcI2MryrS+OT1u0UXzyIBDcS0AdfUsFwN7kSbO7DJ9I4ssthgK169BdcP6BoC42nmCKaQWSZV/w4sme5SDf1432go6vpSP0IgKA2eWuoM+wbddrb0ZpS1mJr1kEbGUaNrcUvMv0S9UImhD1tsMVDVU8HETepedL7mrcaczacO4Zpfnhz6c/KjqKmSB8djwZ/dXB/3X+w8gqEy0D/tPhx49QlQSwcIOtmpazABAACiBAAAUEsDBBQACAgIACiMdFoAAAAAAAAAAAAAAAAVAAAAd29yZC90aGVtZS90aGVtZTEueG1szVdNctMwFN5zCo32rWLHTp1Mky5aMiyYYYbCAWRZtkVl2SOJluzhDlyCBXtmuEF6JWQp8U+dhhRShiwU6enT954+6T0l5xefCg5uqVSsFHPonY4goIKUCRPZHL5/tzyJIFAaiwTzUtA5XFEFLxYvzvFM57SgwCwXaobnMNe6miGkiDFjdVpWVJi5tJQF1mYoM5RIfGdoC4780WiCCswE3KyXh6wv05QRelWSjwUV2pFIyrE2oaucVQoCgQsT4/rr+tv6x/o7uP+8/nn/BbyxC+FiG/RLTmsGVRsIl9fE7sSt7WCTG6/+UjKLL7kEt5jP4ch+IFqcowbA9RCX2s8GtwEkN/4A56XB9Cxp+HzHN8RRSgn1Gj4LwISYXQx9B2nkxVvODsh1h9xkFI6CPr7DPx7gp3Ech9MeftzigwE+Gk0C7PfwQYsPh/HHZmbSw4ctfjLU+mw6Cfp4C8o5Ezc7T7A5mQaSlvzVTnhk4NH2wFsU6twct17ox+5RgT+UcmkA9nDNdRVAryqaYmJwl7iIJcMQVEyTfIkLxlcmSAhIjqWi2lyR2jmeUdxZ5UxEPTChB84KJvZ55sy4Pp7n1hnqCmLlKboDxvm1XnH6WtnAVMlZsjRGO7CwRv4qN11oGZsZN+ouyiRu+2pDmylQlare0R5eUxGY0M4WdlK77yxTXcJxDTyUdHx2GKnnCsuBrF64jxV1VDDXFeC6lnsT37kAimBOk+Z4NeP0LSUacHv62rbStnHdOi89if9CbpXjhG709g6TJvq9Mh3W6fh4gndpgyMoPvozxdEwZ7joj8CdCTH0Q5O9uDIl0SS76RaVcapEBgHmmXneiXb7qqTSV1jlbms2lbZPi2j5/DCogz8e4TjyjkOIHgpA09To+YilHZo5R7Jz9vhgtCuyOFv+pwUwOLAABk8pVcG2VPXTafosWerv3UE3Syusc1A35s4xSbh7qus0e1duc9M9CHV+nrgaVCfpxmgS1Ys63mqqf19NW5mjA8/uiYKOn0nQcIee4RHkRMP8Qr2fH2jwH2BrWfwCUEsHCDR+yIoPAwAADA0AAFBLAwQUAAgICAAojHRaAAAAAAAAAAAAAAAAHgAAAGN1c3RvbVhtbC9fcmVscy9pdGVtMS54bWwucmVsc42PzQrCMBCE7z5F2LtN60FETHsRoTeRCl5Duk2DzQ/JVvTtDZ4sePC4szPfMIfmaSf2wJiMdwKqogSGTvneOC3g2p3WO2jq1eGCk6RsSaMJieWMSwJGorDnPKkRrUyFD+jyZ/DRSspn1DxIdZca+aYstzx+M6BeMFnbC4htXwHrXgH/YfthMAqPXs0WHf2o4GpO5O3NTufocyPrZNRIAgyh/UhVkZnA8z6+GFi/AVBLBwiyYrZ3rgAAABcBAABQSwMEFAAICAgAKIx0WgAAAAAAAAAAAAAAABMAAABjdXN0b21YbWwvaXRlbTEueG1srY9NCsIwGET3niJkb1NdiJTGUtCuRIQouHCTpl+aQH5Kkoq9vRGv4HLeDA+mbt7WoBeEqL2jeFOUGIETftBupPh+69Z73BxWdV8xPwcBEeW9i1VPsUppqgiJQoHlsfATuNxJHyxPOYaReCm1gKMXswWXyLYsd6TXvdF+DHxSC/7J/qNiYEAkGFhaDFD8bK9t8WDnXHzBhdsMM0Odlkmh06BTfozJ4QNQSwcIBtMBD6cAAAACAQAAUEsDBBQACAgIACiMdFoAAAAAAAAAAAAAAAAYAAAAY3VzdG9tWG1sL2l0ZW1Qcm9wczEueG1snZDBasMwEETv/Qqzd0WKnDYm2A5WgiHX0kKviry2BZZkJDmkhPx7FXpqjj3ODvtmmHJ/NVN2QR+0sxWsVwwytMp12g4VfH60pIB9/VJ2YdfJKEN0Hk8RTZbebLqFCsYY5x2lQY1oZFi5GW0ye+eNjEn6gbq+1wqPTi0GbaScsTeqlsQyX2aCLLF1Qp6OFdxYseWiZRsitjknm+bAich5QwRjbd4WTSEOr3eoH31+A9+xD3/lg7d4/d9iZ32etBu8nMdvoHVJn6Lo8xT1D1BLBwjKPSEazQAAAEQBAABQSwMEFAAICAgAKIx0WgAAAAAAAAAAAAAAABMAAABbQ29udGVudF9UeXBlc10ueG1sxZZNT8JAEIbv/IqmV0MXMDHGUDj4cVQOmHgz63barnY/srsg/HtnW1INwbYIwqVJO/O+z8xsM+14uhJFsARjuZJxOIwGYQCSqYTLLA6f5w/963A66Y3naw02wFxp4zB3Tt8QYlkOgtpIaZAYSZUR1OGtyYim7INmQEaDwRVhSjqQru+8RzgZ30FKF4UL7lf4uOKiPAxuqzyPikOqdcEZdRgmPkp26gwUtkG4lMlWdf1NZREqyxybc20vfidomW0BuPCd+ee7Fe8adkvKAGqecNyGJxDMqHGPVGACefWdkOjI/ewiJYrNjNIWj8VA1Dz4Bp5X9zUagXEcuhHRen+gSlPOAD0WAiUR+EEnkOzLZgvrlDgYX9l0hH8qk2xOtjbA9FOccon+CT2oa++GLTOwFvcCdlBHBOWytQ7r1gXY41dR+bbic6AJmOHx+ZVxR/7obHwLzqHgPw5g49xxBJdnG0GKyDl9K/6w8NoqqK1bi3D4uYTqevjLWNo0IatN9SKKzQbiDsTwVOvnG15j27/v7UblKj98drXpbHuN98ak/NOZfAFQSwcISB5o06MBAAAYCQAAUEsBAhQAFAAICAgAKIx0WuVy9kToAAAA0AIAAAsAAAAAAAAAAAAAAAAAAAAAAF9yZWxzLy5yZWxzUEsBAhQAFAAICAgAKIx0Wvy1/HH/AQAAuwMAABEAAAAAAAAAAAAAAAAAIQEAAGRvY1Byb3BzL2NvcmUueG1sUEsBAhQAFAAICAgAKIx0Wveey6tJAQAAQgIAABAAAAAAAAAAAAAAAAAAXwMAAGRvY1Byb3BzL2FwcC54bWxQSwECFAAUAAgICAAojHRa4dYAgJcAAADxAAAAEwAAAAAAAAAAAAAAAADmBAAAZG9jUHJvcHMvY3VzdG9tLnhtbFBLAQIUABQACAgIACiMdFoW3GKqCAEAAKUEAAAcAAAAAAAAAAAAAAAAAL4FAAB3b3JkL19yZWxzL2RvY3VtZW50LnhtbC5yZWxzUEsBAhQAFAAICAgAKIx0WpwSRfC5DgAAKXMAABEAAAAAAAAAAAAAAAAAEAcAAHdvcmQvZG9jdW1lbnQueG1sUEsBAhQAFAAICAgAKIx0WjV0I8yzDAAANnsAAA8AAAAAAAAAAAAAAAAACBYAAHdvcmQvc3R5bGVzLnhtbFBLAQIUABQACAgIACiMdFpSjCwg3QQAAMcQAAAQAAAAAAAAAAAAAAAAAPgiAAB3b3JkL2hlYWRlcjEueG1sUEsBAhQAFAAICAgAKIx0WulNMnEMBQAABhMAABAAAAAAAAAAAAAAAAAAEygAAHdvcmQvaGVhZGVyMi54bWxQSwECFAAUAAgICAAojHRaKw+VHYcBAACtAwAAEQAAAAAAAAAAAAAAAABdLQAAd29yZC9zZXR0aW5ncy54bWxQSwECFAAUAAgICAAojHRa1aP/SmABAAAuBAAAEAAAAAAAAAAAAAAAAAAjLwAAd29yZC9oZWFkZXIzLnhtbFBLAQIUABQACAgIACiMdFo62alrMAEAAKIEAAASAAAAAAAAAAAAAAAAAMEwAAB3b3JkL2ZvbnRUYWJsZS54bWxQSwECFAAUAAgICAAojHRaNH7Iig8DAAAMDQAAFQAAAAAAAAAAAAAAAAAxMgAAd29yZC90aGVtZS90aGVtZTEueG1sUEsBAhQAFAAICAgAKIx0WrJitneuAAAAFwEAAB4AAAAAAAAAAAAAAAAAgzUAAGN1c3RvbVhtbC9fcmVscy9pdGVtMS54bWwucmVsc1BLAQIUABQACAgIACiMdFoG0wEPpwAAAAIBAAATAAAAAAAAAAAAAAAAAH02AABjdXN0b21YbWwvaXRlbTEueG1sUEsBAhQAFAAICAgAKIx0Wso9IRrNAAAARAEAABgAAAAAAAAAAAAAAAAAZTcAAGN1c3RvbVhtbC9pdGVtUHJvcHMxLnhtbFBLAQIUABQACAgIACiMdFpIHmjTowEAABgJAAATAAAAAAAAAAAAAAAAAHg4AABbQ29udGVudF9UeXBlc10ueG1sUEsFBgAAAAARABEATQQAAFw6AAAAAA==",
    title: "ΕΚΘΕΣΗ ΕΞΕΤΑΣΗΣ ΚΑΤΗΓΟΡΟΥΜΕΝΟΥ",
  },
  katasxesi: {
    string:
      "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",
    title: "ΕΚΘΕΣΗ ΚΑΤΑΣΧΕΣΗΣ ΚΑΙ ΠΑΡΑΔΟΣΗΣ",
  },
  apodosi: {
    string:
      "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",
    title: "ΕΚΘΕΣΗ ΑΠΟΔΟΣΗΣ",
  },
  egxeirisis: {
    string:
      "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",
    title: "ΕΚΘΕΣΗ ΕΓΧΕΙΡΗΣΗΣ",
  },
  martyraXoris: {
    title: "ΕΚΘΕΣΗ ΕΞΕΤΑΣΗΣ ΜΑΡΤΥΡΑ (χωρίς όρκο)",
    string:
      "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",
  },
  anomoti: {
    title: "ΑΝΩΜΟΤΙ",
    string:
      "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",
  },
  ypiresiako: {
    title: "Υπηρεσιακό Σημείωμα",
    string:
      "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",
  },
};
