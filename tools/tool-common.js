/* Shared helpers for the PDF tools pages.
   Loaded before each tool's own inline script. */
(function () {
  // ── Escaping (file names end up in innerHTML) ─────────────────────
  const escapeHtml = (s) =>
    String(s).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );

  // ── Inline errors (replaces alert()) ──────────────────────────────
  function showError(msg) {
    const box = document.getElementById("error-box");
    if (!box) {
      alert(msg);
      return;
    }
    box.innerHTML = `<span>⚠</span><span>${escapeHtml(msg)}</span>
      <button class="close" title="Κλείσιμο" aria-label="Κλείσιμο">✕</button>`;
    box.querySelector(".close").addEventListener("click", hideError);
    box.classList.remove("hidden");
    box.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  function hideError() {
    const box = document.getElementById("error-box");
    if (box) box.classList.add("hidden");
  }

  /** Turns a thrown pdf.js/pdf-lib error into something a user can act on. */
  function describeError(err) {
    const name = (err && (err.name || "")) + "";
    const msg = (err && (err.message || err)) + "";
    if (/password|Encrypted|encrypt/i.test(name + msg))
      return "Το PDF προστατεύεται με κωδικό. Αφαιρέστε τον κωδικό και δοκιμάστε ξανά.";
    if (/Invalid PDF|InvalidPDF|Failed to parse|structure/i.test(name + msg))
      return "Το αρχείο δεν φαίνεται να είναι έγκυρο PDF ή είναι κατεστραμμένο.";
    return "Κάτι πήγε στραβά με το αρχείο: " + msg;
  }

  // ── Download ──────────────────────────────────────────────────────
  function download(data, mime, name) {
    const url = URL.createObjectURL(new Blob([data], { type: mime }));
    const a = Object.assign(document.createElement("a"), {
      href: url,
      download: name,
    });
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }

  /** Keeps generated file names inside the OS limit (255 bytes). */
  function safeName(name) {
    const enc = new TextEncoder();
    if (enc.encode(name).length <= 200) return name;
    const dot = name.lastIndexOf(".");
    const ext = dot > -1 ? name.slice(dot) : "";
    let base = dot > -1 ? name.slice(0, dot) : name;
    while (enc.encode(base + "…" + ext).length > 200) base = base.slice(0, -1);
    return base + "…" + ext;
  }

  // ── Hand-off: carry a file from one tool to the next ──────────────
  const DB_NAME = "vaxyp-tools";
  const STORE = "handoff";
  const MAX_AGE = 5 * 60 * 1000;

  function openDb() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => {
        if (!req.result.objectStoreNames.contains(STORE))
          req.result.createObjectStore(STORE);
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function putHandoff(name, bytes) {
    const db = await openDb();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).put({ name, bytes, ts: Date.now() }, "file");
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  }

  /** Reads and immediately clears the pending hand-off, if any. */
  async function takeHandoff() {
    let db;
    try {
      db = await openDb();
    } catch {
      return null;
    }
    const entry = await new Promise((resolve) => {
      const tx = db.transaction(STORE, "readwrite");
      const store = tx.objectStore(STORE);
      const get = store.get("file");
      get.onsuccess = () => {
        store.delete("file");
        resolve(get.result || null);
      };
      get.onerror = () => resolve(null);
    });
    db.close();
    if (!entry || Date.now() - entry.ts > MAX_AGE) return null;
    return entry;
  }

  const TOOLS = [
    { slug: "split", label: "Διαχωρισμός σελίδων" },
    { slug: "remove", label: "Διαγραφή σελίδων" },
    { slug: "arrange", label: "Αναδιάταξη σελίδων" },
    { slug: "rotate", label: "Περιστροφή σελίδων" },
    { slug: "merge", label: "Συγχώνευση PDF" },
    { slug: "compress", label: "Συμπίεση PDF" },
    { slug: "to-image", label: "PDF σε εικόνα" },
    { slug: "ocr", label: "OCR – Ανάγνωση κειμένου" },
  ];

  /**
   * Renders a "continue in another tool" menu into `host`.
   * `getFile()` must return { name, bytes } for the current result.
   */
  function renderContinueMenu(host, current, getFile) {
    host.innerHTML = "";
    const details = document.createElement("details");
    details.className = "continue-menu";
    const summary = document.createElement("summary");
    summary.textContent = "Συνέχεια σε άλλο εργαλείο ▾";
    details.appendChild(summary);

    const list = document.createElement("div");
    list.className = "continue-list";
    TOOLS.filter((t) => t.slug !== current).forEach((t) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn-secondary";
      btn.textContent = t.label;
      btn.addEventListener("click", async () => {
        btn.disabled = true;
        try {
          const file = await getFile();
          await putHandoff(file.name, file.bytes);
          location.href = "../" + t.slug + "/";
        } catch (err) {
          btn.disabled = false;
          showError(describeError(err));
        }
      });
      list.appendChild(btn);
    });
    details.appendChild(list);
    host.appendChild(details);
    host.classList.remove("hidden");
  }

  window.Tools = {
    escapeHtml,
    showError,
    hideError,
    describeError,
    download,
    safeName,
    putHandoff,
    takeHandoff,
    renderContinueMenu,
  };
})();
