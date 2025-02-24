const data = {
  anakritikoi: [
    "Αρχ/κα ΕΜΜΑΝΟΥΗΛΙΔΗ Νικόλαου",
    "Ανθ/μου ΚΟΛΤΣΙΔΑ Βαγγέλη",
    "Ανθ/μου ΚΟΥΛΕΛΗ Χρήστου",
    "Αρχ/κα ΓΚΑΓΚΑΤΣΑ Γεώργιου",
    "Υπ/κα ΠΑΡΑΣΚΕΥΑ Νερατζή",
    "Ανθ/μου ΓΙΑΝΝΑΚΙΔΗ Βασίλειου",
  ],
  ypiresia: "Τ.Δ.Ε.Ε. Κομοτηνής",
  doy: "Κομοτηνής",
  merosSyntaksisEkthesis: "Κομοτηνή",
  xronosPeratosis: 10,
  eisaggeleiaProtodikon: "Ροδόπης",
  dieuthynsiYpiresias: "Λ Δημοκρατίας αρ. 3",
};

// ΕΚΘΕΣΗ ΜΑΡΤΥΡΑ ΧΩΡΙΣ

function printMartyraXoris(initial, person, datas, date, timeFormatter) {
  return `<p> ${initial.replace(
    /(\r\n|\n|\r|\s{2,})/gm,
    " "
  )}της ίδιας Υπηρεσίας, προσληφθέντος ως Β’ Ανακριτικού Υπαλλήλου, κλήθηκε και εμφανίσθηκε ενώπιόν μας, ο κατωτέρω σημειούμενος μάρτυρας, ο οποίος αφού ρωτήθηκε για την ταυτότητά του κ.λ.π., απάντησε ότι ονομάζεται ${person}, Έλληνας και Χριστιανός. Στην συνέχεια εξετάζεται χωρίς όρκο, γιατί είναι θύμα του Νόμου 3500/06 ή γιατί είναι νεότερος των 18 ετών σύμφωνα με το άρθρο 221 του Π.Κ.Δ., ως ακολούθως:</p>
<p><u>ΕΡΩΤΗΣΗ :</u> Τι προσήλθατε να καταθέσετε στο ${datas.ypiresia};</p>
<p><u>ΑΠΟΚΡΙΣΗ :</u> ******* . Άλλο
τίποτα δεν έχω να προσθέσω και υπογράφω.</p>
<p>Η παρούσα έκθεση άρχισε να συντάσσεται την ${timeFormatter(
    date
  )}΄ ώρα και περατώθηκε την ${timeFormatter(
    date,
    datas.xronosPeratosis
  )}΄ ώρα της ιδίας.<p>

<p>Για πίστωση συντάχθηκε η παρούσα έκθεση, η οποία αφού αναγνώσθηκε και βεβαιώθηκε, υπογράφεται ως ακολούθως :</p>`;
}

// ΕΚΘΕΣΗ ΕΝΟΡΚΗ ΜΑΡΤΥΡΑ
function printMartyra(initial, person, datas, date, timeFormatter) {
  return `<p> ${initial.replace(
    /(\r\n|\n|\r|\s{2,})/gm,
    " "
  )}της ίδιας Υπηρεσίας, προσληφθέντος ως Β’ Ανακριτικού Υπαλλήλου, εμφανίσθηκε ο κατωτέρω σημειούμενος μάρτυρας, ο οποίος αφού ρωτήθηκε για την ταυτότητά του κ.λ.π. απάντησε ότι ονομάζεται ${person}. Έπειτα ο εξεταζόμενος, ορκίσθηκε σύμφωνα με το άρθρο 219 παρ. 1 του Κ.Π. Δικονομίας, και στην συνέχεια εξετάζεται ως ακολούθως:<br><u>ΕΡΩΤΗΣΗ:</u> Τι προσήλθατε να καταθέσετε στο ${
    datas.ypiresia
  };<br><u>ΑΠΟΚΡΙΣΗ:</u> **************************. Επιθυμώ την ποινική δίωξη του - ων άγνωστου - ων δράστη - ων. Τίποτα δεν έχω να προσθέσω και υπογράφω.<br> Στον εξεταζόμενο γνωστοποιήσαμε ότι μπορεί να λαμβάνει εγκαίρως γνώση των εγγράφων της δίκης, τα οποία του επιδίδονται και με ηλεκτρονικά μέσα, σύμφωνα με τις παρ. 1 και 4 του άρθρου 155 Κ.Π.Δ.</p>
<p>Η παρούσα έκθεση άρχισε να συντάσσεται την ${timeFormatter(
    date
  )} ώρα της σήμερον και περατώθηκε την ${timeFormatter(
    date,
    datas.xronosPeratosis
  )} ώρα της ιδίας.</p>
<p>Για πιστοποίηση συντάχθηκε η παρούσα έκθεση, η οποία αφού αναγνώστηκε και βεβαιώθηκε υπογράφεται ως ακολούθως:</p>
`;
}

// ΕΚΘΕΣΗ ΣΥΛΛΗΨΗΣ
function printSyllipsi(
  initial,
  person,
  datas,
  date,
  timeFormatter,
  dateFormatter
) {
  return `<p> ${initial.replace(
    /(\r\n|\n|\r|\s{2,})/gm,
    " "
  )}της ίδιας Υπηρεσίας που προσλήφθηκε ως β΄ ανακριτικός υπάλληλος, οδηγήθηκε στο κατάστημα του ${
    datas.ypiresia
  } από τον (Αστυνομικός) του (Υπηρεσια που υπηρετεί) ο οποίος τον συνέλαβε την ${dateFormatter(
    date
  )} και ώρα ${timeFormatter(date, -10)} στην ενταύθα οδό ${
    datas.dieuthynsiYpiresias
  }, ${person}, για παράβαση του (άρθρου *****).<br> Αφού εξέτασα αυτόν και πείσθηκα ότι ουδεμία ως προς την ταυτότητά του υπάρχει αμφιβολία διέταξα την στον κ. Εισαγγελέα Πρωτοδικών ${
    datas.eisaggeleiaProtodikon
  } παραπομπή και παράδοση αυτού με την παρούσα έκθεση.</p>
<p>Η παρούσα έκθεση άρχισε να συντάσσεται την ${timeFormatter(
    date
  )}΄ ώρα και περατώθηκε την ${timeFormatter(
    date,
    datas.xronosPeratosis
  )}΄ ώρα.</p>
<p>Για πιστοποίηση συντάχθηκε η παρούσα έκθεση, η οποία αφού αναγνώσθηκε και βεβαιώθηκε υπογράφεται ως ακολούθως:</p>
`;
}

// ΕΚΘΕΣΗ ΑΝΟΜΩΤΙ
function printAnomoti(initial, person, datas, date, timeFormatter) {
  return `<p>${initial.replace(
    /(\r\n|\n|\r|\s{2,})/gm,
    " "
  )}της ιδίας Υπηρεσίας προσληφθέντος ως Β΄ Ανακριτικού Υπαλλήλου, εμφανίστηκε ο κατωτέρω σημειούμενος εγκαλούμενος, ο οποίος, αφού ρωτήθηκε για την ταυτότητα του κ.λ.π., απάντησε ότι ονομάζεται ${person}.<br> Εξετάζεται χωρίς όρκο, σύμφωνα με τo άρθρο 244 παρ. 1 Κ.Π.Δ., γιατί ενεργείται προκαταρκτική εξέταση κατόπιν της υπ’ αριθ. ***** από **-**-**** Παραγγελία της Εισαγγελίας Πρωτοδικών ${
    datas.eisaggeleiaProtodikon
  }.<br> Ενταύθα γνωρίσαμε σε αυτόν την πράξη που αφορά η εξέταση, ήτοι: για παράβαση του *****.<br> Στη συνέχεια, εξηγήσαμε στον εξεταζόμενο, με σαφήνεια όλα τα δικαιώματα του, που προβλέπονται από τα άρθρα 89, 90, 91, 92, 95, 96, 99, 100, 101, 102, 103 και 104 Κ.Π.Δ, καθώς και το δικαίωμα να διορίσει τεχνικό σύμβουλο σε περίπτωση διεξαγωγής πραγματογνωμοσύνης, εφαρμοζόμενης αναλόγως της διάταξης του άρθρου 183 και ειδικότερα, το δικαίωμα παράστασης με συνήγορο, το δικαίωμα και τις προϋποθέσεις παροχής δωρεάν νομικών συμβουλών, το δικαίωμα ενημέρωσης σχετικά με την κατηγορία, το δικαίωμα διερμηνείας και μετάφρασης, το δικαίωμα σιωπής και μη αυτοενοχοποίησης, το δικαίωμα πρόσβασης στο υλικό της δικογραφίας, το δικαίωμα ενημέρωσης των προξενικών αρχών και ενός επιπλέον προσώπου της επιλογής του, το δικαίωμα σε επείγουσα ιατρική περίθαλψη, τον ανώτατο αριθμό ωρών ή ημερών κατά τις οποίες ο κατηγορούμενος δύναται να στερηθεί της ελευθερίας της προτού προσαχθεί ενώπιον δικαστικής αρχής, το δικαίωμα άρνησης εν όλω ή εν μέρει της παροχής εξηγήσεων, το δικαίωμα προθεσμίας μέχρι σαράντα οκτώ ωρών για την παροχή τους, η οποία μπορεί να παραταθεί από εκείνον που διενεργεί την προκαταρκτική εξέταση, το δικαίωμα πρότασης μαρτύρων προς εξέταση και πληροφορίες σχετικά με τις δυνατότητες προσβολής του νόμιμου χαρακτήρα της σύλληψης ή της κράτησης.</p>
<p><u>ΕΡΩΤΗΣΗ:</u> Επιθυμείτε να κάνετε χρήση των δικαιωμάτων που σας γνωστοποιήθηκαν?</p>
<p><u>ΑΠΟΚΡΊΣΗ:</u> Όχι δεν επιθυμώ και θέλω να εξεταστώ αμέσως.</p>
<p>Ύστερα από τα ανωτέρω προβήκαμε στην παροχή εξηγήσεων.</p>
<p><u>ΕΡΩΤΗΣΗ:</u> Έχετε κατηγορηθεί στο παρελθόν και για ποια αιτία?</p>
<p><u>ΑΠΟΚΡΙΣΗ:</u> Όχι , ποτέ.</p>
<p><u>ΕΡΩΤΗΣΗ:</u> Σας αποδίδονται ήδη οι πράξεις που σας γνωστοποιήθηκαν ανωτέρω. Ποιες είναι οι εξηγήσεις σας?</p>
<p><u>ΑΠΟΚΡΙΣΗ:</u> ************* . Τίποτε άλλο δεν έχω να προσθέσω και υπογράφω.</p>
<p>Η παρούσα έκθεση άρχισε να συντάσσεται την ${timeFormatter(
    date
  )}΄ ώρα της σήμερον και περατώθηκε την ${timeFormatter(
    date,
    datas.xronosPeratosis
  )}΄ ώρα της ιδίας.</p>
<p>Για πιστοποίηση συντάχθηκε η παρούσα έκθεση, η οποία αφού αναγνώσθηκε και βεβαιώθηκε υπογράφεται ακολούθως:</p>
`;
}

// ΕΚΘΕΣΗ ΕΞΕΤΑΣΗΣ ΚΑΤΗΓΟΡΟΥΜΕΝΟΥ
function printKatigoroumenou(initial, person, datas, date, timeFormatter) {
  return `<p>${initial.replace(
    /(\r\n|\n|\r|\s{2,})/gm,
    " "
  )}της ιδίας Υπηρεσίας, προσληφθέντος ως Β΄ Ανακριτικός Υπάλληλος, εξετάζεται ο κατωτέρω σημειούμενος κατηγορούμενος, ως ακολούθως:<br><u>ΕΡΩΤΗΣΗ:</u> Πως ονομάζεσαι κ.λ.π. ;<br><u>ΑΠΟΚΡΙΣΗ:</u> ${person}, ---άνευ--- τέκνων.<br>Ακολούθως γνωρίσαμε με σαφήνεια στον εξεταζόμενο ολόκληρο το περιεχόμενο της κατηγορίας και ότι κατηγορείται για παράβαση του **** , και συγκεκριμένα: ***** .<br>Στην συνέχεια, αφού ανακοινώσαμε στον εξεταζόμενο το περιεχόμενο των εγγράφων της ανάκρισης, εξηγήσαμε σ’ αυτόν σύμφωνα με το άρθρο 105 του Κ.Π.Δ., με σαφήνεια όλα τα δικαιώματά του που προβλέπονται από τα άρθρα 91, 95, 96, 97, 98, 100, 101, 103 και 104, 273 και 274 του Κωδ. Ποιν. Δικονομίας και ειδικότερα: το δικαίωμα παράστασης με συνήγορο, το δικαίωμα και τις προϋποθέσεις παροχής δωρεάν νομικών συμβουλών, το δικαίωμα ενημέρωσης σχετικά με την κατηγορία, το δικαίωμα διερμηνείας και μετάφρασης, το δικαίωμα σιωπής και μη αυτοενοχοποίησης, το δικαίωμα πρόσβασης στο υλικό της δικογραφίας, το δικαίωμα ενημέρωσης των προξενικών αρχών και επιπλέον προσώπων της επιλογής του, το δικαίωμα σε επείγουσα ιατρική περίθαλψη, τον ανώτατο αριθμό ωρών ή ημερών κατά τις οποίες ο κατηγορούμενος δύναται να στερηθεί της ελευθερίας του προτού προσαχθεί ενώπιον δικαστικής αρχής, το δικαίωμα άρνησης εν όλω ή εν μέρει της απολογίας, το δικαίωμα προθεσμίας τουλάχιστον σαράντα οκτώ ωρών για να απολογηθεί, η οποία μπορεί να παραταθεί από εκείνον που διενεργεί την προανάκριση, το δικαίωμα πρότασης μαρτύρων προς εξέταση και πληροφορίες σχετικά με τις δυνατότητες προσβολής του νόμιμου χαρακτήρα της σύλληψης ή της κράτησης.</p>
<p><u>ΕΡΩΤΗΣΗ:</u> Επιθυμείτε να κάνετε χρήση των δικαιωμάτων που σας γνωστοποιήθηκαν;</p>
<p><u>ΑΠΟΚΡΙΣΗ:</u> Έλαβα γνώση όλων των ανωτέρω δικαιωμάτων μου και επιθυμώ να απολογηθώ αμέσως άνευ συνηγόρου.</p>
<p>Ύστερα από τα ανωτέρω προβήκαμε στη λήψη της απολογίας του.</p>
<p>Για πίστωση συντάχθηκε η παρούσα έκθεση, η οποία αφού αναγνώσθηκε και βεβαιώθηκε, υπογράφεται ως ακολούθως:</p>
<table width="100%">
            <tr>
              <td width="33%" style="text-align: center">-Ο-</td>
              <td width="33%" style="text-align: center">-Ο-</td>
              <td width="33%" style="text-align: center">-Ο-</td>
            </tr>
            <tr>
              <td width="33%" style="text-align: center">
                Εξετασθείς Κατηγορούμενος
              </td>
              <td width="33%" style="text-align: center">Β'Ανακριτικός</td>
              <td width="33%" style="text-align: center">Ά Ανακριτικός</td>
            </tr>
          </table><br><br><br>
<p>Στην συνέχεια προβήκαμε στην εξέταση του κατηγορουμένου ως ακολούθως:</p>
<p><u>ΕΡΩΤΗΣΗ:</u> Κατηγορήθηκες άλλη φορά και για ποια αιτία;</p>
<p><u>ΑΠΟΚΡΙΣΗ:</u> Όχι, ποτέ.</p>
<p><u>ΕΡΩΤΗΣΗ:</u> Κατηγορείσαι ήδη για τις ως άνω πράξεις που σου γνωστοποιήθηκαν. Τι απολογείσαι;</p>
<p><u>ΑΠΟΚΡΙΣΗ:</u> ******** . Τίποτε άλλο δεν έχω να προσθέσω και υπογράφω.</p>
<p>Στον κατηγορούμενο γνωστοποιήσαμε ότι, σύμφωνα με το άρθρο 273 § 1 του Κ.Π.Δ., υποχρεούται να δηλώσει κάθε μεταβολή της κατοικίας ή της διαμονής του, μαζί με ακριβή διεύθυνση, εγγράφως στον Εισαγγελέα του δικαστηρίου στο οποίο εκκρεμεί κατά τον χρόνο δήλωσης η δικογραφία.</p>
<p>Η παρούσα έκθεση άρχισε να συντάσσεται την ${timeFormatter(
    date
  )}΄ ώρα και περατώθηκε την ${timeFormatter(
    date,
    datas.xronosPeratosis
  )}΄ ώρα. Για πίστωση συντάχθηκε η παρούσα έκθεση, η οποία αφού αναγνώσθηκε και βεβαιώθηκε, υπογράφεται ως ακολούθως:</p>
`;
}

// ΕΚΘΕΣΗ ΑΠΟΔΟΣΗΣ

function printApodosi(
  initial,
  person,
  datas,
  date,
  timeFormatter,
  dateFormatter
) {
  return `<p>${initial.replace(
    /(\r\n|\n|\r|\s{2,})/gm,
    " "
  )}της ιδίας Υπηρεσίας, προσληφθέντα ως Β’ Ανακριτικό Υπάλληλο, εκθέτουμε τα ακόλουθα:<br>Επειδή από την προανάκριση που ενεργούμε για παράβαση του ****** , πειστήκαμε ότι ***** που αναφέρονται στην από ${dateFormatter(
    date
  )} Έκθεση Παράδοσης Παραλαβής και Κατάσχεσης ανήκουν στην κατοχή και κυριότητα του ${person}, τον οποίο προσκαλέσαμε και του τα αποδώσαμε.<br>Σ’ αυτόν υπομνήσαμε να διαφυλάξει τα ανωτέρω και να παραδώσει αυτά, σε κάθε αίτηση της δικαστικής αρχής.</p>
<p>Η παρούσα έκθεση άρχισε να συντάσσεται την ${timeFormatter(
    date
  )}΄ ώρα της σήμερον και περατώθηκε την ${timeFormatter(
    date,
    datas.xronosPeratosis
  )}΄ ώρα της ιδίας.</p>
<p>Για πιστοποίηση συντάχθηκε η παρούσα έκθεση, η οποία αφού αναγνώσθηκε και βεβαιώθηκε, υπογράφεται ως ακολούθως:</p>
`;
}

// ΕΚΘΕΣΗ ΠΑΡΑΔΟΣΗΣ ΚΑΤΑΣΧΕΣΗΣ

function printKatasxesi(initial, person, datas, date, timeFormatter) {
  return `<p>${initial.replace(
    /(\r\n|\n|\r|\s{2,})/gm,
    " "
  )}της ιδίας Υπηρεσίας, που προσλήφθηκε ως Β΄ Ανακριτικός Υπάλληλος, ενεργώντας προανάκριση για παράβαση του ****** σε βάρος του ${person}, εμφανίστηκε ενώπιον μας ο Αρχ/κας **** του ${
    datas.ypiresia
  } και μας παρέδωσε ******.<br>Κατόπιν τούτου προβήκαμε στην κατάσχεση αυτών για να χρησιμοποιηθούν ως πειστήρια.</p>
<p>Γίνεται μνεία ότι η παρούσα έκθεση άρχισε να συντάσσεται την ${timeFormatter(
    date
  )}΄ ώρα της σήμερον και περατώθηκε την ${timeFormatter(
    date,
    datas.xronosPeratosis
  )}΄ ώρα της ιδίας.</p>
<p>Προς πίστωση συντάχθηκε η παρούσα η οποία αναγνώσθηκε, βεβαιώθηκε και υπογράφεται ως ακολούθως:</p>
`;
}

// ΕΚΘΕΣΗ ΓΝΩΣΤΟΠΟΙΗΣΗΣ ΔΙΚΑΙΩΜΑΤΩΝ
function printGnostopoiisi(initial, person, datas, date, timeFormatter) {
  return `<p>${initial.replace(
    /(\r\n|\n|\r|\s{2,})/gm,
    " "
  )}της ίδιας Υπηρεσίας, προσληφθέντος ως Β΄ Ανακριτικός Υπάλληλος, εκθέτουμε τα ακόλουθα:<br>Δυνάμει του άρθρου 95 του Κ.Π.Δ, γνωστοποιήσαμε στον παρακάτω κατηγορούμενο ${person}, τα ακόλουθα δικαιώματα της: α) το δικαίωμα παράστασης με συνήγορο, β) το δικαίωμα και τις προϋποθέσεις παροχής δωρεάν νομικών συμβούλων, γ) το δικαίωμα ενημέρωσης σχετικά με την κατηγορία, δ) το δικαίωμα διερμηνείας και μετάφρασης και ε) το δικαίωμα σιωπής και μη αυτοενοχοποίησης.</p>
<p>Η παρούσα έκθεση άρχισε να συντάσσεται την ${timeFormatter(
    date
  )}΄ ώρα της σήμερον και περατώθηκε την ${timeFormatter(
    date,
    datas.xronosPeratosis
  )}΄ ώρα της ιδίας.</p>
<p>Για πιστοποίηση συντάχθηκε η παρούσα έκθεση, η οποία αφού αναγνώσθηκε και βεβαιώθηκε, υπογράφεται ως ακολούθως:</p>
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
let id = "";
let vehicle = "";
let stringYear = today.getFullYear();
let stringMonth = String(today.getMonth() + 1).padStart(2, "0");
let stringDay = String(today.getDate()).padStart(2, "0");
let formattedDate = `${stringYear}-${stringMonth}-${stringDay}`;
let specificDate = new Date(formattedDate);
let days = [
  "Κυριακή",
  "Δευτέρα",
  "Τρίτη",
  "Τετάρτη",
  "Πέμπτη",
  "Παρασκευή",
  "Σάββατο",
];
let dayName = days[specificDate.getDay()];
let formattedTime = formatTime(today, 0);
let year = today.getFullYear();
let month = months[today.getMonth()];
let day = today.getDate();

const anakritikosSelect = document.querySelector("#anakritikos");
const bAnakritikosSelect = document.querySelector("#anakritikos-b");

data.anakritikoi.forEach((anakritikos, index) => {
  // Populate a anakr select
  const anakr = document.createElement("option");
  anakr.value = anakritikos;
  anakr.textContent = anakritikos.split(" ")[1];
  if (index === 0) {
    anakr.setAttribute("selected", ""); // or anakr.selected = true
  }
  anakritikosSelect.appendChild(anakr);

  // Populate b anakr select
  const bAnakr = document.createElement("option");
  bAnakr.value = anakritikos;
  bAnakr.textContent = anakritikos.split(" ")[1];
  if (index === 1) {
    bAnakr.setAttribute("selected", ""); // or bAnakr.selected = true
  }
  bAnakritikosSelect.appendChild(bAnakr);
});
const initialText = document.getElementById("initial");

function constructInitialText() {
  return `Στην ${data.merosSyntaksisEkthesis} σήμερα την ${day}η του μήνα ${month} του έτους ${year} ημέρα ${dayName} και ώρα ${formattedTime} ενώπιον εμού, του ${anakritikosSelect.value} του ${data.ypiresia}, παρισταμένου και του ${bAnakritikosSelect.value} `;
}

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
  const text = initial.textContent.replace(/(\r\n|\n|\r|\s{2,})/gm, " ");
  copyToClipboard(text);
});

// person parser fields
const taytotita = document.getElementById("taytotita");
const clipboardId = document.querySelector(".clipboard-id");
const copyIdBtn = document.querySelector(".copy-id");
taytotita.addEventListener("input", () => {
  id = taytotita.value;
  clipboardId.value = formatIdInfo(id, data);
});

copyIdBtn.addEventListener("click", () => {
  copyToClipboard(clipboardId.value);
});

//vehicle parser fields

const oxima = document.getElementById("oxima");
const clipboardOxima = document.querySelector(".clipboard-oxima");
const copyOximaBtn = document.querySelector(".copy-oxima");

oxima.addEventListener("input", () => {
  vehicle = oxima.value;
  clipboardOxima.value = formatVehicleInfo(vehicle);
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
});

const vehicleClear = document.getElementById("vehicle-clear");
vehicleClear.addEventListener("click", () => {
  oxima.value = "";
  clipboardOxima.value = "";
});

// ektheseis
const initial = document.getElementById("initial");
// martyras button
const martyra = document.getElementById("martyra");
martyra.addEventListener("click", () => {
  downloadAsWord(
    printMartyra(
      initial.textContent,
      clipboardId.value,
      data,
      today,
      formatTime
    ),
    "martyra"
  );
});
// martyraXorisOrko button
const martyraXoris = document.getElementById("martyraXoris");
martyraXoris.addEventListener("click", () => {
  downloadAsWord(
    printMartyraXoris(
      initial.textContent,
      clipboardId.value,
      data,
      today,
      formatTime
    ),
    "martyraXoris"
  );
});
//syllipsi button
const syllipsi = document.getElementById("syllipsi");
syllipsi.addEventListener("click", () => {
  downloadAsWord(
    printSyllipsi(
      initial.textContent,
      clipboardId.value,
      data,
      today,
      formatTime,
      formatDate
    ),
    "syllipsi"
  );
});
// anomoti button
const anomoti = document.getElementById("anomoti");
anomoti.addEventListener("click", () => {
  downloadAsWord(
    printAnomoti(
      initial.textContent,
      clipboardId.value,
      data,
      today,
      formatTime
    ),
    "anomoti"
  );
});
// katigoroumenou button
const katigoroumenou = document.getElementById("katigoroumenou");
katigoroumenou.addEventListener("click", () => {
  downloadAsWord(
    printKatigoroumenou(
      initial.textContent,
      clipboardId.value,
      data,
      today,
      formatTime
    ),
    "katigoroumenou"
  );
  copyToClipboard(text);
});
const apodosi = document.getElementById("apodosi");
apodosi.addEventListener("click", () => {
  downloadAsWord(
    printGnostopoiisi(
      initial.textContent,
      clipboardId.value,
      data,
      today,
      formatTime,
      formatDate
    ),
    "apodosi"
  );
});
// katasxesi button
const katasxesi = document.getElementById("katasxesi");
katasxesi.addEventListener("click", () => {
  downloadAsWord(
    printKatasxesi(
      initial.textContent,
      clipboardId.value,
      data,
      today,
      formatTime,
      formatDate
    ),
    "katasxesi"
  );
});

// gnostopoiisi button
const gnostopoiisi = document.getElementById("gnostopoiisi");
gnostopoiisi.addEventListener("click", () => {
  downloadAsWord(
    printGnostopoiisi(
      initial.textContent,
      clipboardId.value,
      data,
      today,
      formatTime
    ),
    "gnostopoiisi"
  );
});
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
  let hour = date.getHours();
  let minutes = date.getMinutes() + extraTime;
  if (minutes >= 60) {
    hour += 1;
    minutes = minutes % 60;
  }
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

  return `${day}/${month}/${year}`;
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
function formatIdInfo(input, data) {
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

  // Extract all required fields
  const fields = {
    surname: getValue("Επώνυμο"),
    firstName: getValue("Όνομα"),
    fatherName: getValue("Όνομα Πατρός"),
    motherName: getValue("Όνομα Μητρός"),
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
  if (fields.region === "Περιοχή") {
    fields.region = "--- ";
  }

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
  }, επάγγελμα -------, κάτοχος του υπ'αριθ ${
    fields.idNumber
  } Δ.Α.Τ. εκδοθέντος ${fields.issueDate} από ${
    fields.issuingAuthority
  }, με Α.Φ.Μ ------- / Δ.Ο.Υ. ${data.doy}, χρήστη της υπ'αριθ. ${
    fields.phoneNumber
  } τηλεφωνικής σύνδεσης, με διεύθυνση ηλεκτρονικού ταχυδρομείου (στερείται)`;
  return formattedString;
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
