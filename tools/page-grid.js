/* Thumbnail grid shared by the page-level PDF tools.
   Pages appear immediately as placeholders; thumbnails render lazily as they
   scroll into view, so a long PDF is usable right away. */
class PageGrid {
  constructor(gridEl, opts = {}) {
    this.el = gridEl;
    this.onToggle = opts.onToggle || (() => {});
    this.selectable = opts.selectable !== false;
    this.buildFooter = opts.buildFooter || null;
    this.onRender = opts.onRender || null;
    this.scale = opts.scale || 0.28;
    this.cards = new Map(); // page number → card element
    this.selected = new Set();
    this.pageCount = 0;
    this.lastClicked = null;
    this._queue = Promise.resolve();
    this._observer = null;
  }

  /** Opens the PDF and lays out one card per page. Resolves with the count. */
  async load(bytes, selectedSet) {
    this.clear();
    if (selectedSet) {
      selectedSet.clear();
      this.selected = selectedSet;
    }
    this.doc = await pdfjsLib.getDocument({ data: bytes.slice(0) }).promise;
    this.pageCount = this.doc.numPages;

    const vp = (await this.doc.getPage(1)).getViewport({ scale: 1 });
    const ratio = `${vp.width} / ${vp.height}`;

    const frag = document.createDocumentFragment();
    for (let n = 1; n <= this.pageCount; n++) frag.appendChild(this._card(n, ratio));
    this.el.appendChild(frag);

    this._observe();
    return this.pageCount;
  }

  clear() {
    if (this._observer) this._observer.disconnect();
    this._observer = null;
    this.cards.clear();
    this.selected.clear();
    this.lastClicked = null;
    this.pageCount = 0;
    this.el.innerHTML = "";
  }

  // ── Card construction ───────────────────────────────────────────
  _card(n, ratio) {
    const card = document.createElement("div");
    card.className = "page-card";
    card.dataset.page = n;

    const box = document.createElement("div");
    box.className = "thumb-box";
    const ph = document.createElement("div");
    ph.className = "thumb-placeholder";
    ph.style.aspectRatio = ratio;
    box.appendChild(ph);
    card.appendChild(box);

    if (this.buildFooter) {
      card.appendChild(this.buildFooter(n));
    } else {
      const num = document.createElement("span");
      num.className = "page-num";
      num.textContent = `Σελίδα ${n}`;
      card.appendChild(num);
    }

    if (this.selectable) {
      const check = document.createElement("span");
      check.className = "page-check";
      check.textContent = "✓";
      card.appendChild(check);

      card.tabIndex = 0;
      card.setAttribute("role", "checkbox");
      card.setAttribute("aria-checked", "false");
      card.setAttribute("aria-label", `Σελίδα ${n}`);

      card.addEventListener("click", (e) => this._click(n, e.shiftKey));
      card.addEventListener("keydown", (e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          this._click(n, e.shiftKey);
        }
      });
    }

    this.cards.set(n, card);
    return card;
  }

  // ── Lazy thumbnail rendering ────────────────────────────────────
  _observe() {
    this._observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const n = parseInt(entry.target.dataset.page, 10);
          this._observer.unobserve(entry.target);
          this._enqueue(n);
        }
      },
      { rootMargin: "600px 0px" },
    );
    this.cards.forEach((card) => this._observer.observe(card));
  }

  _enqueue(n) {
    this._queue = this._queue.then(() => this._render(n)).catch(() => {});
  }

  async _render(n) {
    const card = this.cards.get(n);
    if (!card) return;
    const box = card.querySelector(".thumb-box");
    if (!box || box.dataset.rendered) return;
    box.dataset.rendered = "1";

    const page = await this.doc.getPage(n);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const viewport = page.getViewport({ scale: this.scale * dpr });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: canvas.getContext("2d"), viewport })
      .promise;

    box.innerHTML = "";
    box.appendChild(canvas);
    if (this.onRender) this.onRender(n, box);
  }

  // ── Selection ───────────────────────────────────────────────────
  _click(n, withShift) {
    if (withShift && this.lastClicked !== null && this.lastClicked !== n) {
      const [from, to] = [this.lastClicked, n].sort((a, b) => a - b);
      const turningOn = !this.selected.has(n);
      for (let i = from; i <= to; i++) {
        if (turningOn) this.selected.add(i);
        else this.selected.delete(i);
        this._paint(i);
      }
    } else {
      if (this.selected.has(n)) this.selected.delete(n);
      else this.selected.add(n);
      this._paint(n);
    }
    this.lastClicked = n;
    this.onToggle();
  }

  _paint(n) {
    const card = this.cards.get(n);
    if (!card) return;
    const on = this.selected.has(n);
    card.classList.toggle("selected", on);
    card.setAttribute("aria-checked", on ? "true" : "false");
  }

  setSelection(pages) {
    this.selected.clear();
    pages.forEach((n) => this.selected.add(n));
    this.cards.forEach((_, n) => this._paint(n));
  }

  selectAll() {
    this.setSelection(
      new Set(Array.from({ length: this.pageCount }, (_, i) => i + 1)),
    );
  }
}
