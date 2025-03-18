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

// ΕΚΘΕΣΗ ΜΑΡΤΥΡΑ ΧΩΡΙΣ

function printMartyraXoris(initial, person, datas, date, timeFormatter) {
  state.timePassed += datas.xronosPeratosis;
  return `<p> ${initial().replace(
    /(\r\n|\n|\r|\s{2,})/gm,
    " "
  )}της ίδιας Υπηρεσίας, προσληφθέντος ως Β’ Ανακριτικού Υπαλλήλου, κλήθηκε και εμφανίσθηκε ενώπιόν μας, ο κατωτέρω σημειούμενος μάρτυρας, ο οποίος αφού ρωτήθηκε για την ταυτότητά του κ.λ.π., απάντησε ότι ονομάζεται ${person}, Έλληνας και Χριστιανός. Στην συνέχεια εξετάζεται χωρίς όρκο, γιατί είναι θύμα του Νόμου 3500/06 ή γιατί είναι νεότερος των 18 ετών σύμφωνα με το άρθρο 221 του Π.Κ.Δ., ως ακολούθως:</p>
<p><u>ΕΡΩΤΗΣΗ :</u> Τι προσήλθατε να καταθέσετε στο ${datas.ypiresia};</p>
<p><u>ΑΠΟΚΡΙΣΗ :</u> ******* . Άλλο
τίποτα δεν έχω να προσθέσω και υπογράφω.</p>
<p>Η παρούσα έκθεση άρχισε να συντάσσεται την ${timeFormatter(
    date,
    state.timePassed
  )}΄ ώρα και περατώθηκε την ${timeFormatter(
    date,
    datas.xronosPeratosis + state.timePassed
  )}΄ ώρα της ιδίας.<p>

<p>Για πίστωση συντάχθηκε η παρούσα έκθεση, η οποία αφού αναγνώσθηκε και βεβαιώθηκε, υπογράφεται ως ακολούθως :</p>`;
}

// ΕΚΘΕΣΗ ΕΝΟΡΚΗ ΜΑΡΤΥΡΑ
function printMartyra(initial, person, datas, date, timeFormatter) {
  return `<p> ${initial().replace(
    /(\r\n|\n|\r|\s{2,})/gm,
    " "
  )}της ίδιας Υπηρεσίας, προσληφθέντος ως Β’ Ανακριτικού Υπαλλήλου, εμφανίσθηκε ο κατωτέρω σημειούμενος μάρτυρας, ο οποίος αφού ρωτήθηκε για την ταυτότητά του κ.λ.π. απάντησε ότι ονομάζεται ${person}. Έπειτα ο εξεταζόμενος, ορκίσθηκε σύμφωνα με το άρθρο 219 παρ. 1 του Κ.Π. Δικονομίας, και στην συνέχεια εξετάζεται ως ακολούθως:<br><u>ΕΡΩΤΗΣΗ:</u> Τι προσήλθατε να καταθέσετε στο ${
    datas.ypiresia
  };<br><u>ΑΠΟΚΡΙΣΗ:</u> **************************. Επιθυμώ την ποινική δίωξη του - ων άγνωστου - ων δράστη - ων. Τίποτα δεν έχω να προσθέσω και υπογράφω.<br> Στον εξεταζόμενο γνωστοποιήσαμε ότι μπορεί να λαμβάνει εγκαίρως γνώση των εγγράφων της δίκης, τα οποία του επιδίδονται και με ηλεκτρονικά μέσα, σύμφωνα με τις παρ. 1 και 4 του άρθρου 155 Κ.Π.Δ.</p>
<p>Η παρούσα έκθεση άρχισε να συντάσσεται την ${timeFormatter(
    date,
    timePassed
  )} ώρα της σήμερον και περατώθηκε την ${timeFormatter(
    date,
    datas.xronosPeratosis + timePassed
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
  state.timePassed += datas.xronosPeratosis;

  return `<p> ${initial().replace(
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
    date,
    timePassed
  )}΄ ώρα και περατώθηκε την ${timeFormatter(
    date,
    datas.xronosPeratosis + timePassed
  )}΄ ώρα.</p>
<p>Για πιστοποίηση συντάχθηκε η παρούσα έκθεση, η οποία αφού αναγνώσθηκε και βεβαιώθηκε υπογράφεται ως ακολούθως:</p>
`;
}

// ΕΚΘΕΣΗ ΑΝΟΜΩΤΙ
function printAnomoti(initial, person, datas, date, timeFormatter) {
  state.timePassed += datas.xronosPeratosis;
  return `<p>${initial().replace(
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
    date,
    timePassed
  )}΄ ώρα της σήμερον και περατώθηκε την ${timeFormatter(
    date,
    datas.xronosPeratosis + timePassed
  )}΄ ώρα της ιδίας.</p>
<p>Για πιστοποίηση συντάχθηκε η παρούσα έκθεση, η οποία αφού αναγνώσθηκε και βεβαιώθηκε υπογράφεται ακολούθως:</p>
`;
}

// ΕΚΘΕΣΗ ΕΞΕΤΑΣΗΣ ΚΑΤΗΓΟΡΟΥΜΕΝΟΥ
function printKatigoroumenou(initial, person, datas, date, timeFormatter) {
  state.timePassed += datas.xronosPeratosis;

  return `<p>${initial().replace(
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
    date,
    timePassed
  )}΄ ώρα και περατώθηκε την ${timeFormatter(
    date,
    datas.xronosPeratosis + timePassed
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
  state.timePassed += datas.xronosPeratosis;

  return `<p>${initial().replace(
    /(\r\n|\n|\r|\s{2,})/gm,
    " "
  )}της ιδίας Υπηρεσίας, προσληφθέντα ως Β’ Ανακριτικό Υπάλληλο, εκθέτουμε τα ακόλουθα:<br>Επειδή από την προανάκριση που ενεργούμε για παράβαση του ****** , πειστήκαμε ότι ***** που αναφέρονται στην από ${dateFormatter(
    date
  )} Έκθεση Παράδοσης Παραλαβής και Κατάσχεσης ανήκουν στην κατοχή και κυριότητα του ${person}, τον οποίο προσκαλέσαμε και του τα αποδώσαμε.<br>Σ’ αυτόν υπομνήσαμε να διαφυλάξει τα ανωτέρω και να παραδώσει αυτά, σε κάθε αίτηση της δικαστικής αρχής.</p>
<p>Η παρούσα έκθεση άρχισε να συντάσσεται την ${timeFormatter(
    date,
    timePassed
  )}΄ ώρα της σήμερον και περατώθηκε την ${timeFormatter(
    date,
    datas.xronosPeratosis + timePassed
  )}΄ ώρα της ιδίας.</p>
<p>Για πιστοποίηση συντάχθηκε η παρούσα έκθεση, η οποία αφού αναγνώσθηκε και βεβαιώθηκε, υπογράφεται ως ακολούθως:</p>
`;
}

// ΕΚΘΕΣΗ ΠΑΡΑΔΟΣΗΣ ΚΑΤΑΣΧΕΣΗΣ

function printKatasxesi(initial, person, datas, date, timeFormatter) {
  state.timePassed += datas.xronosPeratosis;

  return `<p>${initial().replace(
    /(\r\n|\n|\r|\s{2,})/gm,
    " "
  )}της ιδίας Υπηρεσίας, που προσλήφθηκε ως Β΄ Ανακριτικός Υπάλληλος, ενεργώντας προανάκριση για παράβαση του ****** σε βάρος του ${person}, εμφανίστηκε ενώπιον μας ο Αρχ/κας **** του ${
    datas.ypiresia
  } και μας παρέδωσε ******.<br>Κατόπιν τούτου προβήκαμε στην κατάσχεση αυτών για να χρησιμοποιηθούν ως πειστήρια.</p>
<p>Γίνεται μνεία ότι η παρούσα έκθεση άρχισε να συντάσσεται την ${timeFormatter(
    date,
    timePassed
  )}΄ ώρα της σήμερον και περατώθηκε την ${timeFormatter(
    date,
    datas.xronosPeratosis + timePassed
  )}΄ ώρα της ιδίας.</p>
<p>Προς πίστωση συντάχθηκε η παρούσα η οποία αναγνώσθηκε, βεβαιώθηκε και υπογράφεται ως ακολούθως:</p>
`;
}

// ΕΚΘΕΣΗ ΓΝΩΣΤΟΠΟΙΗΣΗΣ ΔΙΚΑΙΩΜΑΤΩΝ
function printGnostopoiisi(initial, person, datas, date, timeFormatter) {
  state.timePassed += datas.xronosPeratosis;

  return `<p>${initial().replace(
    /(\r\n|\n|\r|\s{2,})/gm,
    " "
  )}της ίδιας Υπηρεσίας, προσληφθέντος ως Β΄ Ανακριτικός Υπάλληλος, εκθέτουμε τα ακόλουθα:<br>Δυνάμει του άρθρου 95 του Κ.Π.Δ, γνωστοποιήσαμε στον παρακάτω κατηγορούμενο ${person}, τα ακόλουθα δικαιώματα της: α) το δικαίωμα παράστασης με συνήγορο, β) το δικαίωμα και τις προϋποθέσεις παροχής δωρεάν νομικών συμβούλων, γ) το δικαίωμα ενημέρωσης σχετικά με την κατηγορία, δ) το δικαίωμα διερμηνείας και μετάφρασης και ε) το δικαίωμα σιωπής και μη αυτοενοχοποίησης.</p>
<p>Η παρούσα έκθεση άρχισε να συντάσσεται την ${timeFormatter(
    date,
    timePassed
  )}΄ ώρα της σήμερον και περατώθηκε την ${timeFormatter(
    date,
    datas.xronosPeratosis + timePassed
  )}΄ ώρα της ιδίας.</p>
<p>Για πιστοποίηση συντάχθηκε η παρούσα έκθεση, η οποία αφού αναγνώσθηκε και βεβαιώθηκε, υπογράφεται ως ακολούθως:</p>
`;
}
function printEgxeirisis(initial, person) {
  return `<div
  style="
    font-family: 'Times New Roman', serif;
    font-size: 12pt;
    color: #000;
    direction: ltr;
    background: transparent;
    line-height: 1.5;
    width: 21cm;
    height: 29.7cm;
  "
>
  <p style="text-align: center; margin: 0; font-size: 16pt">
    <u><b>ΕΚΘΕΣΗ ΕΓΧΕΙΡΙΣΗΣ</b></u>
  </p>

  <p>
    ${initial().replace(/(\r\n|\n|\r|\s{2,})/gm, " ")} της ίδιας
    Υπηρεσίας, προσληφθέντος ως Β΄ Ανακριτικού Υπαλλήλου, εμφανίστηκε ο ${person}, ο οποίος μας εγχείρισε:
  </p>

  <p>
    ************** και βεβαίωσε και προφορικά το περιεχόμενό τους ως αληθές.
  </p>

  <p>
    Για πιστοποίηση συντάχθηκε η παρούσα έκθεση, η οποία αφού αναγνώστηκε και
    βεβαιώθηκε, υπογράφεται ως ακολούθως:
  </p>
</div>
`;
}
function printYpiresiako(
  axyp,
  person,
  datas,
  fullDate,
  time,
  protokolo,
  apolesthen
) {
  return `<div class="container" style="width: 210mm; height: 297mm; display: flex; flex-direction: column;">
		<div style="display: flex; flex-direction: column; align-items: center; align-self:flex-start">
		  <p style="margin:0;">
			<b>ΕΛΛΗΝΙΚΗ ΔΗΜΟΚΡΑΤΙΑ</b></fon>
		  </p>
		  <p style="margin:0;">
			<b>ΥΠΟΥΡΓΕΙΟ ΠΡΟΣΤΑΣΙΑΣ ΤΟΥ ΠΟΛΙΤΗ</b>
		  </p>
		  <p style="margin:0;">
			<b>ΑΡΧΗΓΕΙΟ ΕΛΛΗΝΙΚΗΣ ΑΣΤΥΝΟΜΙΑΣ</b>
		  </p>
		  <p style="margin:0;">
			<b>ΓΕΝΙΚΗ ΠΕΡΙΦΕΡΕΙΑΚΗ ΑΣΤΥΝΟΜΙΚΗ </b>
		  </p>
		  <p style="margin:0;">
			<b>ΔΙΕΥΘΥΝΣΗ ΑΝΑΤΟΛΙΚΗΣ ΜΑΚΕΔΟΝΙΑΣ-ΘΡΑΚΗΣ</b>
		  </p>
		  <p style="margin:0;">
			<b>ΔΙΕΥΘΥΝΣΗ ΑΣΤΥΝΟΜΙΑΣ ΡΟΔΟΠΗΣ</b>
		  </p>
		  <p style="margin:0;">
			<b>ΤΜΗΜΑ ΔΙΩΞΗΣ ΚΑΙ ΕΞΙΧΝΙΑΣΗΣ</b>
		  </p>
		  <p style="margin:0;">
			<b>ΕΓΚΛΗΜΑΤΩΝ ΚΟΜΟΤΗΝΗΣ</b>
		  </p>
		  <p style="margin:0;">
			Δ/νση: ${datas.dieuthynsiYpiresias} ${datas.merosSyntaksisEkthesis}
		  </p>
		  <p style="margin:0;">
			Αρμόδιος: ${axyp}.
		  </p>
		  <p style="margin:0;">
			Τηλέφωνο<span lang="en-US">: ${datas.tilefono}</span>
		  </p>
		  <p style="margin:0;">
			<span lang="en-US">e-mail: ${datas.email}</span>
		  </p>
		  <p style="margin:0;">
			<u><b>ΑΡ. ΠΡΩΤ:3005/4/${protokolo}-α</b></u>
		  </p>
		</div>
		<p align="center" style="line-height: 150%; margin-bottom: 0cm"><br /></p>
		<p align="center" style="line-height: 150%; margin-bottom: 0cm">
		  <font size="3" style="font-size: 13pt"
			><u><b>ΥΠΗΡΕΣΙΑΚΟ ΣΗΜΕΙΩΜΑ</b></u></font
		  >
		</p>
		<p align="center" style="line-height: 150%; margin-bottom: 0cm"><br /></p>
		<p align="justify" style="line-height: 115%; margin-bottom: 0cm">
		  Αναφέρεται ότι την ${fullDate} και ώρα ${time} προσήλθε στην Υπηρεσία μας ο ${person} και με υπεύθυνη δήλωση του Ν1599/1986 δήλωσε ότι απώλεσε σε άγνωστο τόπο και χρόνο ${apolesthen}</p>
      <p> -Το παρόν χορηγείται για κάθε νόμιμη χρήση. </p>
		<div align="right">
		  <table width="345" cellpadding="7" cellspacing="0">
			<col width="331" />
			<tr>
			  <td
				width="331"
				height="255"
				valign="top"
				style="border: none; padding: 0cm"
			  >
				<p align="center" style="margin-bottom: 0cm">
				  <br />
				</p>
				<p align="center" style="margin-bottom: 0cm">
				  <font size="3" style="font-size: 13pt"
					>${datas.merosSyntaksisEkthesis}, ${fullDate}</font
				  >
				</p>
				<p align="center" style="margin-bottom: 0cm"><br /></p>
				<p align="center" style="margin-bottom: 0cm">
				  <font size="3" style="font-size: 13pt"><b>Ο</b></font>
				</p>
				<p align="center" style="margin-bottom: 0cm">
				  <font size="3" style="font-size: 13pt"
					><b>Αξιωματικός Υπηρεσίας</b></font
				  >
				</p>
				<p style="margin-bottom: 0cm"><br /></p>
				<p align="center" style="margin-bottom: 0cm"><br /></p>
				<p align="center" style="margin-bottom: 0cm">
				  <font size="3" style="font-size: 13pt"
					><b>${axyp.split(" ")[1]}Σ ${axyp.split(" ")[2]}ς</b></font
				  >
				</p>
				<p align="center" style="margin-bottom: 0cm">
				  <font size="3" style="font-size: 13pt"><b>${axyp.split(" ")[0]}</b></font>
				</p>
				<p><br /></p>
			  </td>
			</tr>
		  </table>
		</div>
		<p style="line-height: 100%; margin-bottom: 0cm"></p>
	</div>`;
}
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
  syllipsis: {
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
      "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",
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
};

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
let formattedId = "";
let formattedIdYpoptos = "";
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
let apolesthenItem = "";
let protokoloNumber = 0;

let state = {
  formattedId: "",
  formattedIdYpoptos: "",
  vehicle: "",
  formattedDate: `${stringYear}-${stringMonth}-${stringDay}`,
  dayName: days[specificDate.getDay()],
  year: today.getFullYear(),
  month: months[today.getMonth()],
  day: today.getDate(),
  ypefthiniData: {},
  ypoptosData: {},
  timePassed: 0,
  apolesthenItem: "",
  protokoloNumber: 0,
};

//combine data and state so the new Ektheseis replacement works better
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
  return `Στην ${
    data.merosSyntaksisEkthesis
  } σήμερα την ${day}η του μήνα ${month} του έτους ${year} ημέρα ${dayName} και ώρα ${formatTime(
    today,
    timePassed
  )} ενώπιον εμού, του ${anakritikosSelect.value} του ${
    data.ypiresia
  }, παρισταμένου και του ${bAnakritikosSelect.value} `;
}

//dilosi apoleias

const apolesthen = document.getElementById("apolesthen");
apolesthen.addEventListener("input", () => {
  apolesthenItem = apolesthen.value;
});

const protokolo = document.getElementById("protokolo");
protokolo.addEventListener("input", () => {
  protokoloNumber = protokolo.value;
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
  state.formattedId = clipboardId.value;
});
clipboardId.addEventListener("input", () => {
  state.formattedId = clipboardId.value;
});
copyIdBtn.addEventListener("click", () => {
  copyToClipboard(state.formattedId);
});

// Suspect parser fields
const taytotitaYpoptos = document.getElementById("taytotita-ypoptos");
const clipboardIdYpoptos = document.querySelector(".clipboard-id-ypoptos");
const copyIdYpoptosBtn = document.querySelector(".copy-id-ypoptos");

taytotitaYpoptos.addEventListener("input", () => {
  clipboardIdYpoptos.value = formatIdInfo(taytotitaYpoptos.value, data, true);
  state.formattedIdYpoptos = clipboardIdYpoptos.value;
});

clipboardIdYpoptos.addEventListener("input", () => {
  state.formattedIdYpoptos = clipboardIdYpoptos.value;
});

copyIdYpoptosBtn.addEventListener("click", () => {
  copyToClipboard(state.formattedIdYpoptos);
});

const clearYpoptosBtn = document.getElementById("person-ypoptos-clear");
clearYpoptosBtn.addEventListener("click", () => {
  taytotitaYpoptos.value = "";
  clipboardIdYpoptos.value = "";
  state.formattedIdYpoptos = "";
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
  state.formattedId = "";
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
  downloadAsWord(
    printMartyra(
      constructInitialText,
      state.formattedId,
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
      constructInitialText,
      state.formattedId,
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
      constructInitialText,
      state.formattedIdYpoptos,
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
      constructInitialText,
      state.formattedIdYpoptos,
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
      constructInitialText,
      state.formattedIdYpoptos,
      data,
      today,
      formatTime
    ),
    "katigoroumenou"
  );
});

//apodosi button
const apodosi = document.getElementById("apodosi");
apodosi.addEventListener("click", () => {
  downloadAsWord(
    printApodosi(
      constructInitialText,
      state.formattedId,
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
      constructInitialText,
      state.formattedId,
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
      constructInitialText,
      state.formattedIdYpoptos,
      data,
      today,
      formatTime
    ),
    "gnostopoiisi"
  );
});

// egxeirisis button  printEgxeirisis(initial, person)
const egxeirisis = document.getElementById("egxeirisis");
egxeirisis.addEventListener("click", () => {
  downloadAsWord(
    printEgxeirisis(constructInitialText, state.formattedId),
    "egxeirisis"
  );
});

// ypiresiako button
const ypiresiako = document.getElementById("ypiresiako");
ypiresiako.addEventListener("click", () => {
  downloadAsWord(
    printYpiresiako(
      anakritikosSelect.value,
      state.formattedId,
      data,
      day,
      month,
      year,
      formatTime(today, 0),
      protokoloNumber,
      apolesthenItem
    ),
    "ypiresiako"
  );
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
      state.formattedId,
      state.formattedIdYpoptos,
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
      state.formattedId,
      state.formattedIdYpoptos,
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
      state.formattedId,
      state.formattedIdYpoptos,
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
    if (fields.region === "Περιοχή") {
      fields.region = "--- ";
    }
    // extract the data for ypefthini dilosi usage
    suspect ? (ypoptosData = fields) : (ypefthiniData = fields);

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
async function generateWord(base64String, replacements) {
  try {
    // Use the original file ArrayBuffer instead of converting back from base64
    //this is fucked up, check test file for originalFileArrayBuffer
    const modifiedDocx = await processDocument(
      base64String.string,
      replacements
    );

    // Create a blob and download it
    const blob = new Blob([modifiedDocx], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${base64String.title}`.docx;
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

    // Debug: List all files in the zip
    Object.keys(zip.files).forEach((filename) => {
      console.log("File in ZIP:", filename);
    });

    // Find the main document content
    const documentXml = zip.file("word/document.xml");

    if (!documentXml) {
      throw new Error("Could not find document.xml in the Word file");
    }

    console.log("Found document.xml");

    // Get the content
    const content = await documentXml.async("string");
    console.log("Document content loaded");

    // Replace placeholders with values
    let modifiedContent = content;
    for (const [placeholder, value] of Object.entries(replacements)) {
      const regex = new RegExp(`\\{${placeholder}\\}`, "g");
      modifiedContent = modifiedContent.replace(regex, value);
      console.log(`Replaced {${placeholder}} with ${value}`);
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
