// Injects the donate fab button + dialog after <header>, wherever this script is included.
(() => {
  const siteRoot = document.currentScript.src.replace(
    /src\/donateWidget\.js.*$/,
    "",
  );

  document.querySelector("header").insertAdjacentHTML(
    "afterend",
    `<button
      type="button"
      class="donate-fab"
      id="donate-open"
      title="Υποστηρίξτε τον δημιουργό της σελίδας"
      aria-label="Υποστηρίξτε τον δημιουργό της σελίδας"
    >
      <svg viewBox="0 0 24 24">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
        <line x1="6" y1="1" x2="6" y2="4" />
        <line x1="10" y1="1" x2="10" y2="4" />
        <line x1="14" y1="1" x2="14" y2="4" />
      </svg>
    </button>`,
  );

  document.body.insertAdjacentHTML(
    "beforeend",
    `<dialog id="donate-dialog" class="donate-dialog">
  <div class="donate-dialog-content">
    <button type="button" class="closeModal" id="donate-close">
      &times;
    </button>
    <h3>Υποστηρίξτε τον δημιουργό</h3>
    
    <p class="donate-qr-label">
      Αν σου άρεσε η σελίδα και οι λειτουργίες της, μπορείς να με κεράσεις έναν καφέ πατώντας το κουμπί παρακάτω:
    </p>
    
    <form action="https://www.paypal.com/donate" method="post" target="_top">
      <input type="hidden" name="hosted_button_id" value="7788NPFMT6EKJ" />
      <input
        type="image"
        src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif"
        border="0"
        name="submit"
        title="PayPal - The safer, easier way to pay online!"
        alt="Donate with PayPal button"
      />
      <img
        alt=""
        border="0"
        src="https://www.paypal.com/en_GR/i/scr/pixel.gif"
        width="1"
        height="1"
      />
    </form>
    
    <p class="donate-or">— ή —</p>
    
    <p class="donate-qr-label">Σκάναρε το QR code για να με κεράσεις από το κινητό σου:</p>
    <img
      class="donate-qr"
      src="${siteRoot}images/QRcode.png"
      alt="QR code για υποστήριξη μέσω PayPal"
    />
    
    <p class="donate-thanks">Ευχαριστώ πολύ για την υποστήριξη! ☕</p>
  </div>
</dialog>`,
  );

  const donateDialog = document.getElementById("donate-dialog");
  document.getElementById("donate-open").addEventListener("click", () => {
    donateDialog.showModal();
  });
  document.getElementById("donate-close").addEventListener("click", () => {
    donateDialog.close();
  });
})();
