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
  timePassed += datas.xronosPeratosis;
  return `<p> ${initial().replace(
    /(\r\n|\n|\r|\s{2,})/gm,
    " "
  )}της ίδιας Υπηρεσίας, προσληφθέντος ως Β’ Ανακριτικού Υπαλλήλου, κλήθηκε και εμφανίσθηκε ενώπιόν μας, ο κατωτέρω σημειούμενος μάρτυρας, ο οποίος αφού ρωτήθηκε για την ταυτότητά του κ.λ.π., απάντησε ότι ονομάζεται ${person}, Έλληνας και Χριστιανός. Στην συνέχεια εξετάζεται χωρίς όρκο, γιατί είναι θύμα του Νόμου 3500/06 ή γιατί είναι νεότερος των 18 ετών σύμφωνα με το άρθρο 221 του Π.Κ.Δ., ως ακολούθως:</p>
<p><u>ΕΡΩΤΗΣΗ :</u> Τι προσήλθατε να καταθέσετε στο ${datas.ypiresia};</p>
<p><u>ΑΠΟΚΡΙΣΗ :</u> ******* . Άλλο
τίποτα δεν έχω να προσθέσω και υπογράφω.</p>
<p>Η παρούσα έκθεση άρχισε να συντάσσεται την ${timeFormatter(
    date,
    timePassed
  )}΄ ώρα και περατώθηκε την ${timeFormatter(
    date,
    datas.xronosPeratosis + timePassed
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
  timePassed += datas.xronosPeratosis;

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
  timePassed += datas.xronosPeratosis;
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
  timePassed += datas.xronosPeratosis;

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
  timePassed += datas.xronosPeratosis;

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
  timePassed += datas.xronosPeratosis;

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
  timePassed += datas.xronosPeratosis;

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
  day,
  month,
  year,
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
		  Αναφέρεται ότι την ${day} ${month} ${year} και ώρα ${time} προσήλθε στην Υπηρεσία μας ο ${person} και με υπεύθυνη δήλωση του Ν1599/1986 δήλωσε ότι απώλεσε σε άγνωστο τόπο και χρόνο ${apolesthen}</p>
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
					>${datas.merosSyntaksisEkthesis}, ${day} ${month} ${year}</font
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
  timePassed += datas.xronosPeratosis;
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
  timePassed += datas.xronosPeratosis;
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
let formattedId = "";
let formattedIdYpoptos = "";
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
let year = today.getFullYear();
let month = months[today.getMonth()];
let day = today.getDate();
let ypefthiniData = {};
let ypoptosData = {};
let timePassed = 0;

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
let apolesthenItem = "";
let protokoloNumber = 0;
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
  formattedId = clipboardId.value;
});
clipboardId.addEventListener("input", () => {
  formattedId = clipboardId.value;
});
copyIdBtn.addEventListener("click", () => {
  copyToClipboard(formattedId);
});

// Suspect parser fields
const taytotitaYpoptos = document.getElementById("taytotita-ypoptos");
const clipboardIdYpoptos = document.querySelector(".clipboard-id-ypoptos");
const copyIdYpoptosBtn = document.querySelector(".copy-id-ypoptos");

taytotitaYpoptos.addEventListener("input", () => {
  clipboardIdYpoptos.value = formatIdInfo(taytotitaYpoptos.value, data, true);
  formattedIdYpoptos = clipboardIdYpoptos.value;
});

clipboardIdYpoptos.addEventListener("input", () => {
  formattedIdYpoptos = clipboardIdYpoptos.value;
});

copyIdYpoptosBtn.addEventListener("click", () => {
  copyToClipboard(formattedIdYpoptos);
});

const clearYpoptosBtn = document.getElementById("person-ypoptos-clear");
clearYpoptosBtn.addEventListener("click", () => {
  taytotitaYpoptos.value = "";
  clipboardIdYpoptos.value = "";
  formattedIdYpoptos = "";
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
  formattedId = "";
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
    printMartyra(constructInitialText, formattedId, data, today, formatTime),
    "martyra"
  );
});
// martyraXorisOrko button
const martyraXoris = document.getElementById("martyraXoris");
martyraXoris.addEventListener("click", () => {
  downloadAsWord(
    printMartyraXoris(
      constructInitialText,
      formattedId,
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
      formattedIdYpoptos,
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
      formattedIdYpoptos,
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
      formattedIdYpoptos,
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
      formattedId,
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
      formattedId,
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
      formattedIdYpoptos,
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
    printEgxeirisis(constructInitialText, formattedId),
    "egxeirisis"
  );
});

// ypiresiako button
const ypiresiako = document.getElementById("ypiresiako");
ypiresiako.addEventListener("click", () => {
  downloadAsWord(
    printYpiresiako(
      anakritikosSelect.value,
      formattedId,
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
      formattedId,
      formattedIdYpoptos,
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
      formattedId,
      formattedIdYpoptos,
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
      formattedId,
      formattedIdYpoptos,
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
