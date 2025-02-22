function printMartyra(initial, person, data, date) {
  const formattedString = `ΕΚΘΕΣΗ ΕΝΟΡΚΗΣ ΕΞΕΤΑΣΗΣ ΜΑΡΤΥΡΑ (Κ.Π.Δ.)
  ${initial} της ίδιας Υπηρεσίας, προσληφθέντος ως Β’ Ανακριτικού Υπαλλήλου, εμφανίσθηκε ο κατωτέρω σημειούμενος μάρτυρας, ο οποίος αφού ρωτήθηκε για την ταυτότητά του κ.λ.π. απάντησε ότι ονομάζεται ${person}. Έπειτα ο εξεταζόμενος, ορκίσθηκε σύμφωνα με το άρθρα 219 παρ. 1 του Κ.Π. Δικονομίας, και στην συνέχεια εξετάζεται ως ακολούθως:
  ΕΡΩΤΗΣΗ: Τι προσήλθατε να καταθέσετε στο ${data.ypiresia}; 
  ΑΠΟΚΡΙΣΗ: **************************. Επιθυμώ την ποινική δίωξη του – ων άγνωστου – ων δράστη – ων. Τίποτα δεν έχω να προσθέσω και υπογράφω. 
  Στον εξεταζόμενο γνωστοποιήσαμε ότι μπορεί να λαμβάνει εγκαίρως γνώση των εγγράφων της δίκης, τα οποία του επιδίδονται και με ηλεκτρονικά μέσα, σύμφωνα με τις παρ. 1 και 4 του άρθρου 155 Κ.Π.Δ.
  Η παρούσα έκθεση άρχισε να συντάσσεται την ${formatTime(
    date,
    0
  )} ώρα της σήμερον και περατώθηκε την ${formatTime(
    date,
    data.xronosPeratosis
  )} ώρα της ιδίας.
  Για πιστοποίηση συντάχθηκε η παρούσα έκθεση, η οποία αφού αναγνωστικέ και βεβαιώθηκε υπογράφεται ως ακολούθως:`;
  return formattedString;
}
//time formatter
function formatTime(date, extraTime) {
  let formattedHour = String(date.getHours()).padStart(2, "0");
  let formattedMinutes = String(date.getMinutes() + extraTime).padStart(2, "0");
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

export { printMartyra, formatTime, capitalize, formatDate };
