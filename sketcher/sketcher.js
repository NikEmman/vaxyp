// ── Accident-scene sketcher: canvas setup + tool wiring ──────────
(function () {
  const CANVAS_W = 2000; // px; at 40px/m that's a 50m-wide working area
  const CANVAS_H = 1400;

  let ppm = 40; // pixels per meter — the active scale
  let gridVisible = true;
  let measuring = false;
  let measurePoints = [];

  const canvas = new fabric.Canvas("sketch-canvas", {
    width: CANVAS_W,
    height: CANVAS_H,
    selection: false, // default tool mode is pan, not select — see applyToolMode()
  });

  // Default selection styling is a pale blue that barely shows up against
  // the gray grid background — swap in a darker, higher-contrast look.
  // Fabric v6 copies its defaults onto each instance at construction time
  // instead of reading them off the prototype, so setting
  // fabric.Object.prototype.* here has no effect on new objects — the
  // style has to be applied per-object as each one is added instead.
  const SELECTION_STYLE = {
    borderColor: "#e05a00",
    cornerColor: "#e05a00",
    cornerStrokeColor: "#1b1f24",
    transparentCorners: false,
    borderScaleFactor: 2,
    cornerSize: 10,
  };
  canvas.on("object:added", (e) => e.target.set(SELECTION_STYLE));
  canvas.selectionColor = "rgba(224,90,0,0.12)";
  canvas.selectionBorderColor = "#e05a00";
  canvas.selectionLineWidth = 2;

  // ── Theme (light/dark canvas palette) ─────────────────────────────
  // On screen the canvas follows the app's light/dark theme. Exports must
  // always come out black-on-white regardless — see captureInLightPalette
  // further down, used by both the PNG and PDF export handlers.
  const PALETTES = {
    light: { bg: "#ffffff", ink: "#1b1f24" },
    dark: { bg: "#161c27", ink: "#c8d3e0" },
  };
  // themeInit.js (loaded first, at the very top of <body>) already applied
  // the "dark" class to <body> before any of this ran, so read it straight
  // off instead of defaulting to light and waiting to be corrected —
  // otherwise the canvas itself would still flash light-then-dark even
  // once the page chrome no longer does.
  let isDarkTheme = document.body.classList.contains("dark");
  let currentPalette = isDarkTheme ? PALETTES.dark : PALETTES.light;
  setShapePalette(currentPalette.bg, currentPalette.ink);

  // Swap every object's colors from whichever palette they're currently in
  // to `palette` — matched by value so it works starting from either theme,
  // recursing into group children (roads/vehicles/measurements are groups).
  function restyleObjects(palette) {
    function walk(objects) {
      objects.forEach((o) => {
        if (o.fill === PALETTES.light.bg || o.fill === PALETTES.dark.bg)
          o.set("fill", palette.bg);
        else if (o.fill === PALETTES.light.ink || o.fill === PALETTES.dark.ink)
          o.set("fill", palette.ink);
        if (o.stroke === PALETTES.light.ink || o.stroke === PALETTES.dark.ink)
          o.set("stroke", palette.ink);
        if (o._objects) walk(o._objects);
      });
    }
    walk(canvas.getObjects());
  }

  function setTheme(dark) {
    isDarkTheme = dark;
    currentPalette = dark ? PALETTES.dark : PALETTES.light;
    setShapePalette(currentPalette.bg, currentPalette.ink); // new shapes from here on
    restyleObjects(currentPalette); // shapes already on the canvas
    applyGrid();
    canvas.requestRenderAll();
  }
  window.applySketcherTheme = setTheme;

  // Runs `captureFn` (expected to read canvas pixels, e.g. toDataURL) with
  // the canvas forced to the light palette and the grid hidden, then
  // restores both. All steps are synchronous, so there's no visible flash.
  function captureInLightPalette(captureFn) {
    const wasDark = isDarkTheme;
    const wasGridVisible = gridVisible;
    gridVisible = false;
    if (wasDark)
      setTheme(false); // setTheme() re-applies the grid itself
    else applyGrid();

    const result = captureFn();

    gridVisible = wasGridVisible;
    if (wasDark) setTheme(true);
    else applyGrid();
    return result;
  }

  // ── Grid background (drawn as a repeating pattern, not real objects,
  //    so it never shows up in the object list or gets selected/exported
  //    as clutter — export still includes it since it's the bg fill) ──
  function makeGridPattern(spacingPx) {
    const tile = document.createElement("canvas");
    tile.width = spacingPx;
    tile.height = spacingPx;
    const ctx = tile.getContext("2d");
    ctx.fillStyle = currentPalette.bg;
    ctx.fillRect(0, 0, spacingPx, spacingPx);
    ctx.strokeStyle = isDarkTheme
      ? "rgba(255,255,255,0.08)"
      : "rgba(0,0,0,0.08)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0.5, 0);
    ctx.lineTo(0.5, spacingPx);
    ctx.moveTo(0, 0.5);
    ctx.lineTo(spacingPx, 0.5);
    ctx.stroke();
    return new fabric.Pattern({ source: tile, repeat: "repeat" });
  }
  function applyGrid() {
    canvas.backgroundColor = gridVisible
      ? makeGridPattern(ppm)
      : currentPalette.bg;
    canvas.requestRenderAll();
  }
  applyGrid();

  // ── Adding shapes ────────────────────────────────────────────────
  function addShape(key, x, y) {
    const factory = SHAPE_FACTORIES[key];
    if (!factory) return;
    const obj = factory(ppm);
    obj.set({ left: x, top: y });
    canvas.add(obj);
    canvas.setActiveObject(obj);
    canvas.requestRenderAll();
  }

  const paletteItems = document.querySelectorAll(".palette-item");
  paletteItems.forEach((item) => {
    // Drag from the sidebar onto the canvas.
    item.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", item.dataset.shape);
    });
    // Click-to-add fallback, centered in the current viewport of the canvas.
    item.addEventListener("click", () => {
      const scroll = document.getElementById("canvas-scroll");
      const x = scroll.scrollLeft + scroll.clientWidth / 2;
      const y = scroll.scrollTop + scroll.clientHeight / 2;
      addShape(item.dataset.shape, x, y);
    });
  });

  // ── Palette category filter + search ───────────────────────────────
  // Every palette item lists its category(-ies) in data-categories
  // (space-separated — an item may belong to more than one). Picking a
  // category from the select just toggles which items are visible; the
  // drag/click listeners above stay attached to every item regardless.
  // Typing in the search box takes priority over the category select —
  // it matches across every item so you don't have to know which
  // category something lives in before you can find it.
  const categorySelect = document.getElementById("palette-category");
  const searchInput = document.getElementById("palette-search");
  const paletteEmpty = document.getElementById("palette-empty");

  // Strip Greek tonos/diaeresis marks and normalize final sigma, so
  // "στροφη" matches "Στροφή" and "οδος"/"οδός" are treated the same.
  function normalizeGreek(str) {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/ς/g, "σ");
  }

  // Greek words decline by suffix ("λωρίδων" vs a search for "λωρίδες"),
  // so a plain substring test misses reasonable queries. As a fallback,
  // treat a query term as matching a word if they share a long-enough
  // common prefix — cheap stand-in for stemming.
  function sharesStem(term, word) {
    const len = Math.min(term.length, word.length);
    let lcp = 0;
    while (lcp < len && term[lcp] === word[lcp]) lcp++;
    return lcp >= 3 && lcp / term.length >= 0.6;
  }

  // A category's own label ("Ευθείες") should also find its items, not
  // just each item's own label — build id → label from the select options.
  const categoryLabels = {};
  categorySelect.querySelectorAll("option").forEach((opt) => {
    if (opt.value !== "all") categoryLabels[opt.value] = opt.textContent.trim();
  });

  const paletteSearchText = new Map();
  const paletteSearchWords = new Map();
  paletteItems.forEach((item) => {
    const categories = item.dataset.categories
      ? item.dataset.categories.split(/\s+/)
      : [];
    const labels = categories.map((c) => categoryLabels[c] || "").join(" ");
    const text = normalizeGreek(`${item.textContent.trim()} ${labels}`.trim());
    paletteSearchText.set(item, text);
    paletteSearchWords.set(item, text.split(/\s+/));
  });

  function applyPaletteFilters() {
    const query = normalizeGreek(searchInput.value.trim());
    const searching = query.length > 0;
    categorySelect.disabled = searching;

    const terms = searching ? query.split(/\s+/) : [];
    const category = categorySelect.value;
    let visibleCount = 0;

    paletteItems.forEach((item) => {
      let visible;
      if (searching) {
        const text = paletteSearchText.get(item);
        const words = paletteSearchWords.get(item);
        visible = terms.every(
          (term) =>
            text.includes(term) || words.some((w) => sharesStem(term, w)),
        );
      } else {
        const categories = item.dataset.categories
          ? item.dataset.categories.split(/\s+/)
          : [];
        visible = category === "all" || categories.includes(category);
      }
      item.style.display = visible ? "" : "none";
      if (visible) visibleCount++;
    });
    paletteEmpty.style.display = visibleCount === 0 ? "" : "none";
    paletteEmpty.textContent = searching
      ? "Δεν βρέθηκαν στοιχεία."
      : "Δεν υπάρχουν ακόμα στοιχεία σε αυτή την κατηγορία.";
  }
  categorySelect.addEventListener("change", applyPaletteFilters);
  searchInput.addEventListener("input", applyPaletteFilters);
  applyPaletteFilters();

  const scrollWrap = document.getElementById("canvas-scroll");
  scrollWrap.addEventListener("dragover", (e) => e.preventDefault());
  scrollWrap.addEventListener("drop", (e) => {
    e.preventDefault();
    const shapeKey = e.dataTransfer.getData("text/plain");
    if (!shapeKey) return;
    const rect = canvas.upperCanvasEl.getBoundingClientRect();
    addShape(shapeKey, e.clientX - rect.left, e.clientY - rect.top);
  });

  // ── Magnetic road connections ──────────────────────────────────────
  // Road pieces (roadSegment/oneWayRoad/turn/intersection, in shapes.js)
  // each carry `roadConnections`: local points + outward unit normal for
  // every open edge. While dragging one, look for another piece's
  // connection point that's close by and roughly facing it, then snap
  // position AND rotation so the two meet exactly — open edge to open
  // edge, no gap or seam.
  const SNAP_DISTANCE = 18; // px
  const SNAP_ANGLE = 20; // ° of normal-facing tolerance to trigger a snap
  const T_JUNCTION_OVERLAP = 1; // px a perpendicular branch sinks into the through-road, to hide its edge line

  // Local connection points, transformed into canvas coordinates by the
  // object's current center/rotation (scale too, in case the "px/m" scale
  // control has resized it since it was added).
  function connectionsWorld(obj) {
    if (!obj.roadConnections) return [];
    const rad = fabric.util.degreesToRadians(obj.angle || 0);
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const center = obj.getCenterPoint();
    const scaleX = obj.scaleX || 1;
    const scaleY = obj.scaleY || 1;
    return obj.roadConnections.map((c) => {
      const lx = c.x * scaleX;
      const ly = c.y * scaleY;
      return {
        x: center.x + (lx * cos - ly * sin),
        y: center.y + (lx * sin + ly * cos),
        nx: c.nx * cos - c.ny * sin,
        ny: c.nx * sin + c.ny * cos,
        side: !!c.side,
      };
    });
  }

  let snapIndicator = null;
  function clearSnapIndicator() {
    if (snapIndicator) {
      canvas.remove(snapIndicator);
      snapIndicator = null;
    }
  }
  function showSnapIndicator(point) {
    clearSnapIndicator();
    snapIndicator = new fabric.Circle({
      left: point.x,
      top: point.y,
      radius: 7,
      originX: "center",
      originY: "center",
      fill: "rgba(224,90,0,0.3)",
      stroke: "#e05a00",
      strokeWidth: 2,
      selectable: false,
      evented: false,
    });
    canvas.add(snapIndicator);
    canvas.bringObjectToFront(snapIndicator);
  }

  function trySnapRoadConnection(target) {
    if (!target.roadConnections || target.roadConnections.length === 0) {
      clearSnapIndicator();
      return;
    }

    const mineConns = connectionsWorld(target);
    let best = null;
    canvas.getObjects().forEach((other) => {
      if (
        other === target ||
        !other.roadConnections ||
        other.roadConnections.length === 0
      )
        return;
      const otherConns = connectionsWorld(other);
      mineConns.forEach((mine, mineIndex) => {
        otherConns.forEach((theirs) => {
          const dist = Math.hypot(theirs.x - mine.x, theirs.y - mine.y);
          if (dist > SNAP_DISTANCE) return;
          // Outward normals should point at each other (~180° apart).
          const dot = mine.nx * theirs.nx + mine.ny * theirs.ny;
          const facingAngle =
            Math.acos(Math.max(-1, Math.min(1, dot))) * (180 / Math.PI);
          if (Math.abs(180 - facingAngle) > SNAP_ANGLE) return;
          if (!best || dist < best.dist)
            best = { dist, mineIndex, mine, theirs };
        });
      });
    });

    if (!best) {
      clearSnapIndicator();
      return;
    }

    // Rotate first, around the object's own center (which doesn't move) —
    // the connection point's position after rotating is what the
    // translation step below aligns. Doing both from the pre-rotation
    // position would leave the two pieces slightly offset.
    const currentNormalAngle = Math.atan2(best.mine.ny, best.mine.nx);
    const desiredNormalAngle = Math.atan2(-best.theirs.ny, -best.theirs.nx);
    let deltaRad = desiredNormalAngle - currentNormalAngle;
    deltaRad = Math.atan2(Math.sin(deltaRad), Math.cos(deltaRad)); // normalize to [-PI, PI]
    target.angle =
      ((target.angle || 0) + deltaRad * (180 / Math.PI) + 360) % 360;

    // A T-junction (either point tagged `side`) is nudged a couple px past
    // the target point, into the through-road along its inward direction,
    // so the branch's fill overlaps and hides the through-road's edge line
    // instead of leaving it visibly crossing the opening. An end-to-end
    // join (both plain end points) stays flush at zero offset.
    const isTJunction = best.mine.side || best.theirs.side;
    const overlap = isTJunction ? T_JUNCTION_OVERLAP : 0;
    const destX = best.theirs.x - best.theirs.nx * overlap;
    const destY = best.theirs.y - best.theirs.ny * overlap;

    const mineAfterRotation = connectionsWorld(target)[best.mineIndex];
    target.left += destX - mineAfterRotation.x;
    target.top += destY - mineAfterRotation.y;
    if (isTJunction) canvas.bringObjectToFront(target);
    target.setCoords();

    showSnapIndicator(best.theirs);
  }

  canvas.on("object:moving", (e) => trySnapRoadConnection(e.target));
  canvas.on("object:modified", clearSnapIndicator);
  canvas.on("mouse:up", clearSnapIndicator);

  // ── Tool mode: grab-to-pan (default) vs select ────────────────────
  // The canvas is much bigger than its viewport, so plain click-drag on
  // EMPTY canvas pans it (dragging the surrounding .canvas-scroll div).
  // Objects themselves are always individually clickable/draggable in
  // either mode — panning only kicks in when there's nothing under the
  // cursor. The select tool additionally enables rubber-band multi-select
  // by dragging over empty space, instead of that panning the canvas.
  const selectToolBtn = document.getElementById("btn-select-tool");
  let selectMode = false;
  let isPanning = false;
  let panStart = { x: 0, y: 0 };
  let panScrollStart = { left: 0, top: 0 };

  function applyToolMode() {
    canvas.selection = selectMode;
    canvas.defaultCursor = selectMode ? "default" : "grab"; // cursor over empty canvas
    canvas.hoverCursor = "default"; // plain arrow over an object, either mode
    if (!selectMode) canvas.discardActiveObject();
    canvas.requestRenderAll();
    selectToolBtn.classList.toggle("active", selectMode);
    selectToolBtn.setAttribute("aria-pressed", String(selectMode));
  }
  applyToolMode();

  selectToolBtn.addEventListener("click", () => {
    selectMode = !selectMode;
    applyToolMode();
  });

  canvas.on("mouse:down", (opt) => {
    if (selectMode || measuring || opt.target) return; // let object selection / rubber-band handle it
    isPanning = true;
    panStart = { x: opt.e.clientX, y: opt.e.clientY };
    panScrollStart = { left: scrollWrap.scrollLeft, top: scrollWrap.scrollTop };
    canvas.setCursor("grabbing");
  });
  canvas.on("mouse:move", (opt) => {
    if (!isPanning) return;
    scrollWrap.scrollLeft = panScrollStart.left - (opt.e.clientX - panStart.x);
    scrollWrap.scrollTop = panScrollStart.top - (opt.e.clientY - panStart.y);
    canvas.setCursor("grabbing"); // Fabric resets the cursor on its own each move otherwise
  });
  canvas.on("mouse:up", () => {
    if (!isPanning) return;
    isPanning = false;
    canvas.setCursor(selectMode ? "default" : "grab");
  });
  // Safety net: stop panning even if the button is released outside the
  // canvas (e.g. dragged over the sidebar), where Fabric's own mouse:up
  // on the canvas element would never fire.
  window.addEventListener("mouseup", () => {
    isPanning = false;
  });

  // ── Enable rotate/delete only while something is selected ─────────
  const rotateLeftBtn = document.getElementById("btn-rotate-left");
  const rotateRightBtn = document.getElementById("btn-rotate-right");
  const deleteBtn = document.getElementById("btn-delete");
  function updateSelectionButtons() {
    const hasSelection = !!canvas.getActiveObject();
    rotateLeftBtn.disabled = !hasSelection;
    rotateRightBtn.disabled = !hasSelection;
    deleteBtn.disabled = !hasSelection;
  }
  canvas.on("selection:created", updateSelectionButtons);
  canvas.on("selection:updated", updateSelectionButtons);
  canvas.on("selection:cleared", updateSelectionButtons);
  updateSelectionButtons();

  // ── Rotation ─────────────────────────────────────────────────────
  function rotateSelected(deltaDeg) {
    const obj = canvas.getActiveObject();
    if (!obj) return;
    obj.rotate(((obj.angle || 0) + deltaDeg + 360) % 360);
    obj.setCoords(); // recalc the selection border/handles — rotate() alone leaves them stale
    canvas.requestRenderAll();
  }
  rotateLeftBtn.addEventListener("click", () => rotateSelected(-45));
  rotateRightBtn.addEventListener("click", () => rotateSelected(45));

  // ── Delete ───────────────────────────────────────────────────────
  function deleteSelected() {
    canvas.getActiveObjects().forEach((o) => canvas.remove(o));
    canvas.discardActiveObject();
    canvas.requestRenderAll();
  }
  deleteBtn.addEventListener("click", deleteSelected);
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Delete" && e.key !== "Backspace") return;
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    const obj = canvas.getActiveObject();
    if (obj && obj.isEditing) return; // don't eat backspace while typing in a Textbox
    deleteSelected();
  });

  // ── Measurement tool ─────────────────────────────────────────────
  // First click drops a marker and a dashed preview line that tracks the
  // mouse, updating its distance label live; second click finalizes it
  // into a "|——————|" mark — a line with a perpendicular tick at each end
  // — grouped into one selectable/movable object.
  const measureBtn = document.getElementById("btn-measure");
  const TICK_HALF = 5; // px on each side of the line, i.e. a 10px tick

  // Perpendicular unit vector to the line from p1 to p2 (zero if p1===p2).
  function perpUnit(p1, p2) {
    const len = Math.hypot(p2.x - p1.x, p2.y - p1.y) || 1;
    const ux = (p2.x - p1.x) / len;
    const uy = (p2.y - p1.y) / len;
    return { nx: -uy, ny: ux };
  }
  function tickEndpoints(p, nx, ny) {
    return [
      p.x - nx * TICK_HALF,
      p.y - ny * TICK_HALF,
      p.x + nx * TICK_HALF,
      p.y + ny * TICK_HALF,
    ];
  }

  let previewLine = null;
  let previewTick1 = null;
  let previewTick2 = null;
  let previewLabel = null;

  function clearMeasurePreview() {
    [previewLine, previewTick1, previewTick2, previewLabel].forEach(
      (o) => o && canvas.remove(o),
    );
    previewLine = previewTick1 = previewTick2 = previewLabel = null;
  }

  function stopMeasuring() {
    measuring = false;
    measurePoints = [];
    clearMeasurePreview();
    measureBtn.classList.remove("active");
    canvas.selection = selectMode;
    canvas.defaultCursor = selectMode ? "default" : "grab";
    canvas.requestRenderAll();
  }

  measureBtn.addEventListener("click", () => {
    if (measuring) {
      stopMeasuring();
      return;
    }
    measuring = true;
    measurePoints = [];
    measureBtn.classList.add("active");
    canvas.selection = false;
    canvas.defaultCursor = "crosshair";
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && measuring) stopMeasuring();
  });

  canvas.on("mouse:down", (opt) => {
    if (!measuring) return;
    const p = canvas.getPointer(opt.e);

    if (measurePoints.length === 0) {
      measurePoints.push(p);
      // Give the start tick a vertical default so it reads as a "|" mark
      // right away, before the line has a direction to derive it from.
      previewLine = new fabric.Line([p.x, p.y, p.x, p.y], {
        stroke: LINE_COLOR,
        strokeWidth: 2,
        strokeDashArray: [6, 4],
        selectable: false,
        evented: false,
      });
      previewTick1 = new fabric.Line(tickEndpoints(p, 0, 1), {
        stroke: LINE_COLOR,
        strokeWidth: 2,
        selectable: false,
        evented: false,
      });
      previewTick2 = new fabric.Line(tickEndpoints(p, 0, 1), {
        stroke: LINE_COLOR,
        strokeWidth: 2,
        selectable: false,
        evented: false,
      });
      previewLabel = new fabric.Text("0.00 m", {
        left: p.x,
        top: p.y - 16,
        fontSize: 14,
        fill: LINE_COLOR,
        selectable: false,
        evented: false,
      });
      canvas.add(previewLine, previewTick1, previewTick2, previewLabel);
      canvas.requestRenderAll();
      return;
    }

    const p1 = measurePoints[0];
    const distM = (Math.hypot(p.x - p1.x, p.y - p1.y) / ppm).toFixed(2);
    const { nx, ny } = perpUnit(p1, p);
    clearMeasurePreview();

    const line = new fabric.Line([p1.x, p1.y, p.x, p.y], {
      stroke: LINE_COLOR,
      strokeWidth: 2,
      selectable: false,
      evented: false,
    });
    const tick1 = new fabric.Line(tickEndpoints(p1, nx, ny), {
      stroke: LINE_COLOR,
      strokeWidth: 2,
      selectable: false,
      evented: false,
    });
    const tick2 = new fabric.Line(tickEndpoints(p, nx, ny), {
      stroke: LINE_COLOR,
      strokeWidth: 2,
      selectable: false,
      evented: false,
    });
    const label = new fabric.Text(`${distM} m`, {
      left: (p1.x + p.x) / 2,
      top: (p1.y + p.y) / 2 - 16,
      fontSize: 14,
      fill: LINE_COLOR,
      selectable: false,
      evented: false,
    });
    canvas.add(
      new fabric.Group([line, tick1, tick2, label], { subTargetCheck: false }),
    );

    stopMeasuring();
  });

  canvas.on("mouse:move", (opt) => {
    if (!measuring || measurePoints.length === 0 || !previewLine) return;
    const p1 = measurePoints[0];
    const p = canvas.getPointer(opt.e);
    const distM = (Math.hypot(p.x - p1.x, p.y - p1.y) / ppm).toFixed(2);
    const { nx, ny } = perpUnit(p1, p);

    previewLine.set({ x2: p.x, y2: p.y });
    const [t1x1, t1y1, t1x2, t1y2] = tickEndpoints(p1, nx, ny);
    previewTick1.set({ x1: t1x1, y1: t1y1, x2: t1x2, y2: t1y2 });
    const [t2x1, t2y1, t2x2, t2y2] = tickEndpoints(p, nx, ny);
    previewTick2.set({ x1: t2x1, y1: t2y1, x2: t2x2, y2: t2y2 });
    previewLabel.set({
      left: (p1.x + p.x) / 2,
      top: (p1.y + p.y) / 2 - 16,
      text: `${distM} m`,
    });
    canvas.requestRenderAll();
  });

  // ── Grid toggle ──────────────────────────────────────────────────
  const gridBtn = document.getElementById("btn-grid");
  gridBtn.addEventListener("click", () => {
    gridVisible = !gridVisible;
    gridBtn.classList.toggle("active", gridVisible);
    gridBtn.setAttribute("aria-checked", String(gridVisible));
    gridBtn.title = gridVisible ? "Απόκρυψη κανάβου" : "Εμφάνιση κανάβου";
    applyGrid();
  });

  // ── Scale (px per meter) ─────────────────────────────────────────
  // Changing the scale re-scales everything already on the canvas too —
  // position and size are both multiplied by the same ratio, around the
  // canvas origin, so the real-world (meter) layout stays consistent and
  // only its pixel size changes, like zooming the whole scene.
  document.getElementById("scale-input").addEventListener("change", (e) => {
    const newPpm = parseFloat(e.target.value) || 40;
    if (newPpm !== ppm) {
      const ratio = newPpm / ppm;
      canvas.getObjects().forEach((obj) => {
        obj.set({
          left: obj.left * ratio,
          top: obj.top * ratio,
          scaleX: obj.scaleX * ratio,
          scaleY: obj.scaleY * ratio,
        });
        obj.setCoords();
      });
      ppm = newPpm;
    }
    applyGrid();
    canvas.requestRenderAll();
  });

  // ── Export / clear ───────────────────────────────────────────────
  document.getElementById("btn-export").addEventListener("click", () => {
    if (canvas.getObjects().length === 0) {
      window.displayNotification(
        "Δεν υπάρχει σκαρίφημα για εξαγωγή.",
        "warning",
      );
      return;
    }
    const dataUrl = captureInLightPalette(() =>
      canvas.toDataURL({ format: "png", multiplier: 2 }),
    );
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "skarifima.png";
    a.click();
  });

  // PDF export crops to the drawn content (plus a small margin) rather than
  // the whole mostly-empty working canvas, and fits it onto a landscape A4
  // page — closer to something you'd actually staple into a report.
  document
    .getElementById("btn-export-pdf")
    .addEventListener("click", async () => {
      const objects = canvas.getObjects();
      if (objects.length === 0) {
        window.displayNotification(
          "Δεν υπάρχει σκαρίφημα για εξαγωγή.",
          "warning",
        );
        return;
      }

      canvas.discardActiveObject();

      const bounds = objects.reduce(
        (acc, o) => {
          const r = o.getBoundingRect();
          return {
            left: Math.min(acc.left, r.left),
            top: Math.min(acc.top, r.top),
            right: Math.max(acc.right, r.left + r.width),
            bottom: Math.max(acc.bottom, r.top + r.height),
          };
        },
        { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity },
      );

      const pad = 30;
      const cropLeft = Math.max(0, bounds.left - pad);
      const cropTop = Math.max(0, bounds.top - pad);
      const cropWidth = Math.min(CANVAS_W, bounds.right + pad) - cropLeft;
      const cropHeight = Math.min(CANVAS_H, bounds.bottom + pad) - cropTop;

      const pngDataUrl = captureInLightPalette(() =>
        canvas.toDataURL({
          format: "png",
          multiplier: 2,
          left: cropLeft,
          top: cropTop,
          width: cropWidth,
          height: cropHeight,
        }),
      );
      const pngBytes = Uint8Array.from(atob(pngDataUrl.split(",")[1]), (c) =>
        c.charCodeAt(0),
      );

      const { PDFDocument } = PDFLib;
      const doc = await PDFDocument.create();
      const embedded = await doc.embedPng(pngBytes);

      const PAGE = { w: 841.89, h: 595.28 }; // A4 landscape, in points
      const margin = 30;
      const avail = { w: PAGE.w - 2 * margin, h: PAGE.h - 2 * margin };
      const scale = Math.min(
        avail.w / embedded.width,
        avail.h / embedded.height,
      );
      const dw = embedded.width * scale;
      const dh = embedded.height * scale;

      const page = doc.addPage([PAGE.w, PAGE.h]);
      page.drawImage(embedded, {
        x: (PAGE.w - dw) / 2,
        y: (PAGE.h - dh) / 2,
        width: dw,
        height: dh,
      });

      const bytes = await doc.save();
      const url = URL.createObjectURL(
        new Blob([bytes], { type: "application/pdf" }),
      );
      Object.assign(document.createElement("a"), {
        href: url,
        download: "skarifima.pdf",
      }).click();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    });

  document.getElementById("btn-clear").addEventListener("click", () => {
    if (!confirm("Καθαρισμός όλου του σκαριφήματος;")) return;
    canvas.clear();
    applyGrid();
  });
})();
