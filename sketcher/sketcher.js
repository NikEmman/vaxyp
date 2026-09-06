// ── Accident-scene sketcher: canvas setup + tool wiring ──────────
(function () {
  // A few screens big, so a whole intersection fits without running out
  // of space; panning covers the rest. See scrollWrap centering below.
  const CANVAS_W = 6000; // px; at 40px/m that's a 150m-wide working area
  const CANVAS_H = 4200;

  let ppm = 40; // pixels per meter — the active scale
  let gridVisible = true;
  let measuring = false;
  let measurePoints = [];
  let erasing = false;
  const undoStack = [];
  const UNDO_LIMIT = 50;

  const canvas = new fabric.Canvas("sketch-canvas", {
    width: CANVAS_W,
    height: CANVAS_H,
    selection: false, // default tool mode is pan, not select — see applyToolMode()
  });

  // Default selection styling is a pale blue, low-contrast against the
  // grid. Fabric v6 copies defaults onto each instance at construction
  // time, so fabric.Object.prototype.* has no effect — apply per-object.
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
  // themeInit.js already applied the "dark" class before this ran; read it
  // directly instead of defaulting to light, or the canvas would flash.
  let isDarkTheme = document.body.classList.contains("dark");
  let currentPalette = isDarkTheme ? PALETTES.dark : PALETTES.light;
  setShapePalette(currentPalette.bg, currentPalette.ink);

  // Matched by value, so it works from either starting theme; recurses
  // into group children (roads/vehicles/measurements are groups).
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

  // Runs `captureFn` with the canvas forced to light palette, grid hidden,
  // and connector markers removed, then restores all three synchronously
  // (no visible flash).
  function captureInLightPalette(captureFn) {
    const wasDark = isDarkTheme;
    const wasGridVisible = gridVisible;
    gridVisible = false;
    if (wasDark)
      setTheme(false); // setTheme() re-applies the grid itself
    else applyGrid();
    clearConnectorMarkers();

    const result = captureFn();

    gridVisible = wasGridVisible;
    if (wasDark) setTheme(true);
    else applyGrid();
    refreshConnectorMarkers();
    return result;
  }

  // ── Grid background: a repeating pattern (canvas.backgroundColor), not
  //    real objects — never shows up in the object list or selection ──
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
  // Fabric stacking is just render-list order: ground markings always go
  // to front, road pieces (roadConnections set) always to back, on every
  // add — so order-of-placement doesn't matter.
  // Straight road pieces take an optional length in meters as their second
  // factory argument (default 20m); other factories ignore it. Only
  // affects pieces added from here on.
  const segmentLengthInput = document.getElementById("segment-length-input");
  const segmentLengthValue = document.getElementById("segment-length-value");
  // Browsers restore a range input's position on reload without firing
  // "input" (and without moving it back to its HTML default), so force
  // both the slider and its readout back to the authored default here.
  segmentLengthInput.value = segmentLengthInput.defaultValue;
  segmentLengthValue.textContent = segmentLengthInput.value;
  segmentLengthInput.addEventListener("input", () => {
    segmentLengthValue.textContent = segmentLengthInput.value;
  });

  // Traffic-sign factories return a Promise (async image load); others
  // are synchronous. Promise.resolve() handles both uniformly.
  function addShape(key, x, y) {
    const factory = SHAPE_FACTORIES[key];
    if (!factory) return;
    const lengthM = parseFloat(segmentLengthInput.value) || undefined;
    Promise.resolve(factory(ppm, lengthM)).then((obj) => {
      obj.set({ left: x, top: y });
      canvas.add(obj);
      if (obj.isGroundMarking) canvas.bringObjectToFront(obj);
      else if (obj.roadConnections) canvas.sendObjectToBack(obj);
      canvas.setActiveObject(obj);
      pushUndo(() => {
        canvas.remove(obj);
        refreshConnectorMarkers();
        canvas.requestRenderAll();
      });
      refreshConnectorMarkers();
      canvas.requestRenderAll();
    });
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
  // Each item lists its category(-ies) in data-categories (space-separated).
  // Category and search apply together (AND): picking "Στροφές" then
  // typing "2" narrows straight to the 2-lane turns.
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
    const terms = searching ? query.split(/\s+/) : [];
    const category = categorySelect.value;
    let visibleCount = 0;

    paletteItems.forEach((item) => {
      const categories = item.dataset.categories
        ? item.dataset.categories.split(/\s+/)
        : [];
      const matchesCategory = category === "all" || categories.includes(category);

      let matchesSearch = true;
      if (searching) {
        const text = paletteSearchText.get(item);
        const words = paletteSearchWords.get(item);
        matchesSearch = terms.every((term) => {
          // A bare number ("3") must match as a whole word, not a
          // substring — else "3" also matches inside "135°".
          if (/^\d+$/.test(term)) return new RegExp(`\\b${term}\\b`).test(text);
          return text.includes(term) || words.some((w) => sharesStem(term, w));
        });
      }

      const visible = matchesCategory && matchesSearch;
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
  // Open centered on the working area, not the top-left corner.
  scrollWrap.scrollLeft = Math.max(0, (CANVAS_W - scrollWrap.clientWidth) / 2);
  scrollWrap.scrollTop = Math.max(0, (CANVAS_H - scrollWrap.clientHeight) / 2);
  scrollWrap.addEventListener("dragover", (e) => e.preventDefault());
  scrollWrap.addEventListener("drop", (e) => {
    e.preventDefault();
    const shapeKey = e.dataTransfer.getData("text/plain");
    if (!shapeKey) return;
    const rect = canvas.upperCanvasEl.getBoundingClientRect();
    addShape(shapeKey, e.clientX - rect.left, e.clientY - rect.top);
  });

  // ── Magnetic road connections ──────────────────────────────────────
  // Road pieces carry `roadConnections` (shapes.js): local points + outward
  // normal per open edge. While dragging, find a nearby, roughly-facing
  // connection point on another piece and snap position + rotation to meet
  // exactly, no gap or seam.
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
    // Drag the piece's own connector markers along with it in real time —
    // cheap (just the handful of connectors on this one object), unlike a
    // full refreshConnectorMarkers() rebuild which also has to recheck
    // every OTHER piece's occupancy and isn't worth doing every tick.
    mineConns.forEach((c, i) => {
      const m = target.roadConnections[i] && target.roadConnections[i].marker;
      if (m) m.set({ left: c.x, top: c.y });
    });

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

    // Rotate first (around the object's own center); translation below
    // aligns the connection point's post-rotation position.
    const currentNormalAngle = Math.atan2(best.mine.ny, best.mine.nx);
    const desiredNormalAngle = Math.atan2(-best.theirs.ny, -best.theirs.nx);
    let deltaRad = desiredNormalAngle - currentNormalAngle;
    deltaRad = Math.atan2(Math.sin(deltaRad), Math.cos(deltaRad)); // normalize to [-PI, PI]
    target.angle =
      ((target.angle || 0) + deltaRad * (180 / Math.PI) + 360) % 360;

    // T-junction (either point `side`): nudge into the through-road so the
    // branch's fill hides its edge line. End-to-end join stays flush.
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

  // Snapshot a single object's transform right as a drag/scale/rotate
  // gesture starts, so object:modified (fired when it ends) can push an
  // undo step. Skipped for ActiveSelection (multi-object drag): it's a
  // temporary Fabric object that may not outlive the selection, too
  // fragile to hold a reference to for later undo.
  let transformStart = null;
  canvas.on("mouse:down", (opt) => {
    const t = opt.target;
    transformStart =
      t && t.type !== "activeSelection"
        ? { obj: t, left: t.left, top: t.top, angle: t.angle, scaleX: t.scaleX, scaleY: t.scaleY }
        : null;
  });

  canvas.on("object:moving", (e) => trySnapRoadConnection(e.target));
  canvas.on("object:rotating", (e) => trySnapRoadConnection(e.target));
  canvas.on("object:modified", (opt) => {
    clearSnapIndicator();
    refreshConnectorMarkers();
    if (transformStart && transformStart.obj === opt.target) {
      const prev = transformStart;
      pushUndo(() => {
        prev.obj.set({
          left: prev.left,
          top: prev.top,
          angle: prev.angle,
          scaleX: prev.scaleX,
          scaleY: prev.scaleY,
        });
        prev.obj.setCoords();
        refreshConnectorMarkers();
        canvas.requestRenderAll();
      });
    }
    transformStart = null;
  });
  canvas.on("mouse:up", clearSnapIndicator);

  // ── Connector availability markers ──────────────────────────────────
  // A small teal ring at every unoccupied road-piece connector. A separate,
  // non-interactive layer (not baked into each piece's group), rebuilt from
  // scratch whenever the canvas settles rather than tracked incrementally —
  // simple, and cheap at this diagram's scale.
  const CONNECTOR_OCCUPIED_DIST = 5; // px — a real snap lands exactly here or T_JUNCTION_OVERLAP px away
  const CONNECTOR_OCCUPIED_ANGLE = 10; // ° of normal-facing tolerance to count as "joined"
  let connectorMarkers = [];

  function clearConnectorMarkers() {
    connectorMarkers.forEach((m) => canvas.remove(m));
    connectorMarkers = [];
  }

  function refreshConnectorMarkers() {
    clearConnectorMarkers();
    const withWorld = canvas
      .getObjects()
      .filter((o) => o.roadConnections && o.roadConnections.length)
      .map((obj) => ({ obj, conns: connectionsWorld(obj) }));

    withWorld.forEach(({ obj, conns }) => {
      conns.forEach((c, i) => {
        const occupied = withWorld.some(({ obj: other, conns: otherConns }) => {
          if (other === obj) return false;
          return otherConns.some((oc) => {
            const dist = Math.hypot(oc.x - c.x, oc.y - c.y);
            if (dist > CONNECTOR_OCCUPIED_DIST) return false;
            const dot = c.nx * oc.nx + c.ny * oc.ny;
            const angle = Math.acos(Math.max(-1, Math.min(1, dot))) * (180 / Math.PI);
            return Math.abs(180 - angle) <= CONNECTOR_OCCUPIED_ANGLE;
          });
        });
        if (occupied) return;

        const marker = new fabric.Circle({
          left: c.x,
          top: c.y,
          radius: 5,
          originX: "center",
          originY: "center",
          fill: "rgba(14,165,165,0.25)",
          stroke: "#0ea5a5",
          strokeWidth: 1.5,
          selectable: false,
          evented: false,
          visible: gridVisible, // grid toggle also hides these; snapping itself doesn't depend on the marker being drawn
        });
        marker.isConnectorIndicator = true;
        canvas.add(marker);
        canvas.bringObjectToFront(marker);
        connectorMarkers.push(marker);
        obj.roadConnections[i].marker = marker; // lets a live drag reposition it directly, see trySnapRoadConnection
      });
    });
    canvas.requestRenderAll();
  }

  // ── Tool mode: grab-to-pan (default) vs select ────────────────────
  // Click-drag on empty canvas pans it (scrolls .canvas-scroll); objects
  // stay individually clickable/draggable in either mode. Select mode
  // trades panning for rubber-band multi-select on empty space.
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
    if (selectMode || measuring || erasing || opt.target) return; // let object selection / rubber-band / erasing handle it
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
    const prevAngle = obj.angle || 0;
    obj.rotate((prevAngle + deltaDeg + 360) % 360);
    obj.setCoords(); // recalc the selection border/handles — rotate() alone leaves them stale
    refreshConnectorMarkers(); // toolbar rotate bypasses object:modified, so refresh markers directly
    canvas.requestRenderAll();
    pushUndo(() => {
      obj.rotate(prevAngle);
      obj.setCoords();
      refreshConnectorMarkers();
      canvas.requestRenderAll();
    });
  }
  rotateLeftBtn.addEventListener("click", () => rotateSelected(-45));
  rotateRightBtn.addEventListener("click", () => rotateSelected(45));

  // ── Delete ───────────────────────────────────────────────────────
  function deleteSelected() {
    const objs = canvas.getActiveObjects();
    if (objs.length === 0) return;
    canvas.discardActiveObject();
    objs.forEach((o) => canvas.remove(o));
    refreshConnectorMarkers(); // a neighbor's connector may now be free again
    canvas.requestRenderAll();
    pushUndo(() => {
      objs.forEach((o) => {
        canvas.add(o);
        if (o.isGroundMarking) canvas.bringObjectToFront(o);
        else if (o.roadConnections) canvas.sendObjectToBack(o);
      });
      refreshConnectorMarkers();
      canvas.requestRenderAll();
    });
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
    stopErasing();
    measuring = true;
    measurePoints = [];
    measureBtn.classList.add("active");
    canvas.selection = false;
    canvas.defaultCursor = "crosshair";
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (measuring) return stopMeasuring();
    if (erasing) return stopErasing();
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    if (canvas.getActiveObject()) {
      canvas.discardActiveObject();
      canvas.requestRenderAll();
    }
  });

  canvas.on("mouse:down", (opt) => {
    if (!measuring || measurePoints.length > 0) return;
    const p = canvas.getPointer(opt.e);

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
    canvas.defaultCursor = "none"; // hide the cursor while dragging the measurement out
    canvas.requestRenderAll();
  });

  canvas.on("mouse:up", (opt) => {
    if (!measuring || measurePoints.length === 0) return;
    const p1 = measurePoints[0];
    const p = canvas.getPointer(opt.e);
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

    // stopMeasuring() resets the cursor straight to default/grab, so it
    // never flashes back to a crosshair before the tool deactivates.
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

  // ── Undo ─────────────────────────────────────────────────────────
  // One flat stack of reverse-actions, pushed by whatever just mutated the
  // canvas (add/delete/rotate/drag/erase) — each entry knows how to put
  // things back exactly as they were, so this file doesn't need a single
  // shared notion of "canvas state" to snapshot.
  const undoBtn = document.getElementById("btn-undo");
  function updateUndoButton() {
    undoBtn.disabled = undoStack.length === 0;
  }
  function pushUndo(fn) {
    undoStack.push(fn);
    if (undoStack.length > UNDO_LIMIT) undoStack.shift();
    updateUndoButton();
  }
  undoBtn.addEventListener("click", () => {
    const fn = undoStack.pop();
    if (!fn) return;
    fn();
    updateUndoButton();
  });
  updateUndoButton();
  document.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() !== "z" || (!e.ctrlKey && !e.metaKey) || e.shiftKey) return;
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    e.preventDefault(); // stop the browser's own undo (e.g. in a contenteditable) from also firing
    undoBtn.click();
  });

  // ── Eraser ───────────────────────────────────────────────────────
  // Reuses Fabric's own free-drawing brush to track the drag into a Path,
  // then discards that path and reapplies its shape as an inverted,
  // absolutely-positioned clipPath on every piece it overlaps — punching a
  // permanent hole rather than deleting the object. Multiple erases on the
  // same piece accumulate into a new clipPath group each time (rather than
  // mutating the existing one in place), so undo is just restoring
  // whichever clipPath (or none) was there right before this stroke.
  const eraseBtn = document.getElementById("btn-erase");
  const ERASER_WIDTH_PX = 24;

  // A ring cursor the same size as the brush, so it's obvious how wide a
  // stroke will land before clicking. Fabric only honors freeDrawingCursor
  // (not defaultCursor/hoverCursor) while isDrawingMode is on.
  const ERASER_CURSOR = (() => {
    const r = ERASER_WIDTH_PX / 2;
    const size = ERASER_WIDTH_PX + 4; // pad so the stroke outline isn't clipped
    const c = size / 2;
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">` +
      `<circle cx="${c}" cy="${c}" r="${r}" fill="rgba(255,255,255,0.35)" stroke="#333" stroke-width="2"/>` +
      `</svg>`;
    return `url('data:image/svg+xml;utf8,${encodeURIComponent(svg)}') ${c} ${c}, crosshair`;
  })();

  function applyEraseStroke(erasePath) {
    // The live drag-preview brush is translucent for UX (see the eraseBtn
    // click handler), but the clip mask itself needs a fully opaque stroke
    // — a translucent one only partially masks, rendering "erased" areas
    // faded instead of actually removed.
    const strokeData = { ...erasePath.toObject(), stroke: "rgba(0,0,0,1)", opacity: 1 };
    const strokeBounds = erasePath.getBoundingRect();
    const changes = [];

    canvas.getObjects().forEach((obj) => {
      if (obj.isConnectorIndicator) return;
      const b = obj.getBoundingRect();
      const overlaps =
        strokeBounds.left < b.left + b.width &&
        strokeBounds.left + strokeBounds.width > b.left &&
        strokeBounds.top < b.top + b.height &&
        strokeBounds.top + strokeBounds.height > b.top;
      if (!overlaps) return;

      // Rebuilt from raw stroke data every time, never by reusing a prior
      // clip's actual Path objects: adding an object to a new Group
      // reparents it, which would silently hollow out that prior group —
      // corrupting it for anyone (e.g. undo) still holding a reference.
      const prevClipPath = obj.clipPath;
      const prevStrokes = prevClipPath && prevClipPath.isEraserClip ? prevClipPath.eraserStrokes : [];
      const strokes = [...prevStrokes, strokeData];
      const cuts = strokes.map((d) => new fabric.Path(d.path, { ...d, fill: null }));
      const newClipPath = new fabric.Group(cuts, {
        inverted: true,
        absolutePositioned: true,
      });
      newClipPath.isEraserClip = true;
      newClipPath.eraserStrokes = strokes;

      changes.push({ obj, prevClipPath });
      obj.clipPath = newClipPath;
      obj.dirty = true;
    });

    if (changes.length > 0) {
      pushUndo(() => {
        changes.forEach(({ obj, prevClipPath }) => {
          obj.clipPath = prevClipPath;
          obj.dirty = true;
        });
        canvas.requestRenderAll();
      });
    }
    canvas.requestRenderAll();
  }

  function stopErasing() {
    erasing = false;
    canvas.isDrawingMode = false;
    // If this cancels a stroke mid-drag (e.g. Escape while the mouse is
    // still held down), Fabric's own mouseup handler for drawing mode never
    // runs — it only fires when isDrawingMode is still true — so its
    // internal "currently drawing" flag would otherwise stay stuck on,
    // making the very next mousemove after re-entering eraser mode resume
    // drawing without a new mousedown. Reset it by hand along with the
    // live brush preview (drawn to contextTop, not a real object), which
    // likewise never gets to clean itself up the way a completed stroke's
    // own path:created flow does.
    canvas._isCurrentlyDrawing = false;
    canvas.clearContext(canvas.contextTop);
    eraseBtn.classList.remove("active");
    canvas.selection = selectMode;
    canvas.defaultCursor = selectMode ? "default" : "grab";
  }

  eraseBtn.addEventListener("click", () => {
    if (erasing) {
      stopErasing();
      return;
    }
    stopMeasuring();
    erasing = true;
    eraseBtn.classList.add("active");
    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    canvas.freeDrawingBrush.width = ERASER_WIDTH_PX;
    canvas.freeDrawingBrush.color = "rgba(255,255,255,0.5)"; // live drag preview only — the real erase is an invisible clip, see path:created
    canvas.isDrawingMode = true;
    canvas.selection = false;
    canvas.freeDrawingCursor = ERASER_CURSOR;
  });

  canvas.on("path:created", (e) => {
    if (!erasing) return;
    canvas.remove(e.path);
    applyEraseStroke(e.path);
  });

  // ── Grid toggle ──────────────────────────────────────────────────
  const gridBtn = document.getElementById("btn-grid");
  gridBtn.addEventListener("click", () => {
    gridVisible = !gridVisible;
    gridBtn.classList.toggle("active", gridVisible);
    gridBtn.setAttribute("aria-checked", String(gridVisible));
    gridBtn.title = gridVisible ? "Απόκρυψη κανάβου (H)" : "Εμφάνιση κανάβου (H)";
    applyGrid();
    // Hide/show the connector markers along with the grid — purely visual, snapping doesn't depend on them being drawn.
    connectorMarkers.forEach((m) => m.set("visible", gridVisible));
    canvas.requestRenderAll();
  });

  // ── Tool keybindings ─────────────────────────────────────────────
  // Letter shortcuts toggle the same tool buttons a click would, so all
  // the mutual-exclusion/cleanup logic in their click handlers (stopping
  // whichever other tool was active, etc.) is reused rather than duplicated.
  const TOOL_KEY_BUTTONS = {
    v: selectToolBtn, // pointer/select — "V" as in most design tools
    m: measureBtn,
    e: eraseBtn,
    h: gridBtn, // "H" toggles the grid
  };
  document.addEventListener("keydown", (e) => {
    if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    const obj = canvas.getActiveObject();
    if (obj && obj.isEditing) return; // don't hijack letters typed into a Textbox
    const btn = TOOL_KEY_BUTTONS[e.key.toLowerCase()];
    if (btn) btn.click();
  });

  // ── Scale (px per meter) ─────────────────────────────────────────
  // Changing the scale re-scales everything already on the canvas too —
  // position and size are both multiplied by the same ratio, around the
  // center of the current viewport (not the canvas origin), so whatever
  // is on screen stays roughly centered instead of zooming away toward
  // one corner of the much-bigger 6000x4200 canvas.
  const scaleInput = document.getElementById("scale-input");
  scaleInput.addEventListener("change", (e) => {
    const newPpm = parseFloat(e.target.value) || 40;
    if (newPpm !== ppm) {
      const ratio = newPpm / ppm;
      const cx = scrollWrap.scrollLeft + scrollWrap.clientWidth / 2;
      const cy = scrollWrap.scrollTop + scrollWrap.clientHeight / 2;
      canvas.getObjects().forEach((obj) => {
        obj.set({
          left: cx + (obj.left - cx) * ratio,
          top: cy + (obj.top - cy) * ratio,
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

  const ZOOM_STEP = 5;
  function stepZoom(delta) {
    const min = parseFloat(scaleInput.min) || 5;
    const next = Math.max(min, (parseFloat(scaleInput.value) || 40) + delta);
    scaleInput.value = next;
    scaleInput.dispatchEvent(new Event("change"));
  }
  document
    .getElementById("btn-zoom-in")
    .addEventListener("click", () => stepZoom(ZOOM_STEP));
  document
    .getElementById("btn-zoom-out")
    .addEventListener("click", () => stepZoom(-ZOOM_STEP));
  document.addEventListener("keydown", (e) => {
    if (!e.ctrlKey && !e.metaKey) return;
    if (e.key === "=" || e.key === "+") {
      e.preventDefault(); // stop the browser's own page-zoom
      stepZoom(ZOOM_STEP);
    } else if (e.key === "-") {
      e.preventDefault();
      stepZoom(-ZOOM_STEP);
    } else if (e.key === "0") {
      e.preventDefault();
      scaleInput.value = 40; // the default scale — see its initial value in the markup
      scaleInput.dispatchEvent(new Event("change"));
    }
  });

  // ── Export / clear ───────────────────────────────────────────────
  // Shared by both export buttons: bounding box of everything drawn,
  // padded and clamped to the canvas — crops out the mostly-blank working
  // area. Excludes connector markers (transient editing aid, would pad
  // the crop by a few px).
  function getExportCropBounds(pad) {
    const objects = canvas.getObjects().filter((o) => !o.isConnectorIndicator);
    if (objects.length === 0) return null;

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

    const left = Math.max(0, bounds.left - pad);
    const top = Math.max(0, bounds.top - pad);
    const width = Math.min(CANVAS_W, bounds.right + pad) - left;
    const height = Math.min(CANVAS_H, bounds.bottom + pad) - top;
    return { left, top, width, height };
  }

  document.getElementById("btn-export").addEventListener("click", () => {
    const crop = getExportCropBounds(30);
    if (!crop) {
      window.displayNotification(
        "Δεν υπάρχει σκαρίφημα για εξαγωγή.",
        "warning",
      );
      return;
    }
    const dataUrl = captureInLightPalette(() =>
      canvas.toDataURL({ format: "png", multiplier: 2, ...crop }),
    );
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "skarifima.png";
    a.click();
  });

  // PDF export fits the same content-cropped PNG onto a landscape page —
  // closer to something you'd actually staple into a report. Since the PNG
  // is captured at multiplier:2, a fit-scale of 0.5 is the content's native
  // resolution (1 canvas unit = 1 PDF point); below that, A4 would shrink
  // it past its natural crispness, so we promote to A3 instead.
  const PAGE_A4 = { w: 841.89, h: 595.28 }; // landscape, in points
  const PAGE_A3 = { w: 1190.55, h: 841.89 }; // landscape, in points
  const NATIVE_SCALE = 0.5;

  function fitScale(page, margin, width, height) {
    const avail = { w: page.w - 2 * margin, h: page.h - 2 * margin };
    return Math.min(avail.w / width, avail.h / height);
  }

  document
    .getElementById("btn-export-pdf")
    .addEventListener("click", async () => {
      const crop = getExportCropBounds(30);
      if (!crop) {
        window.displayNotification(
          "Δεν υπάρχει σκαρίφημα για εξαγωγή.",
          "warning",
        );
        return;
      }

      const pngDataUrl = captureInLightPalette(() =>
        canvas.toDataURL({ format: "png", multiplier: 2, ...crop }),
      );
      const pngBytes = Uint8Array.from(atob(pngDataUrl.split(",")[1]), (c) =>
        c.charCodeAt(0),
      );

      const { PDFDocument } = PDFLib;
      const doc = await PDFDocument.create();
      const embedded = await doc.embedPng(pngBytes);

      const margin = 30;
      let PAGE = PAGE_A4;
      let scale = fitScale(PAGE, margin, embedded.width, embedded.height);
      if (scale < NATIVE_SCALE) {
        PAGE = PAGE_A3;
        scale = fitScale(PAGE, margin, embedded.width, embedded.height);
      }
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
    const objs = canvas.getObjects().slice();
    canvas.clear();
    connectorMarkers = []; // canvas.clear() already removed them from the canvas
    applyGrid();
    pushUndo(() => {
      objs.forEach((o) => {
        canvas.add(o);
        if (o.isGroundMarking) canvas.bringObjectToFront(o);
        else if (o.roadConnections) canvas.sendObjectToBack(o);
      });
      refreshConnectorMarkers();
      applyGrid();
      canvas.requestRenderAll();
    });
  });

  // ── Save / load sketches (localStorage) ─────────────────────────────
  const SAVED_SKETCHES_KEY = "sketcher-saved-sketches";

  function loadSavedSketches() {
    try {
      return JSON.parse(localStorage.getItem(SAVED_SKETCHES_KEY)) || {};
    } catch {
      return {};
    }
  }
  function persistSavedSketches(sketches) {
    localStorage.setItem(SAVED_SKETCHES_KEY, JSON.stringify(sketches));
  }

  // Connector-indicator markers, and the live `.marker` reference each one
  // leaves on its road piece's roadConnections entry (see
  // refreshConnectorMarkers), are transient UI state, not sketch content —
  // strip both before serializing. Left in, `.marker` points at a fabric
  // object that references the canvas back, and JSON.stringify throws on
  // the circular structure.
  function serializeSketch() {
    clearConnectorMarkers();
    const json = canvas.toJSON(["isGroundMarking", "roadConnections"]);
    refreshConnectorMarkers();
    json.objects.forEach((o) => {
      if (o.roadConnections) {
        o.roadConnections = o.roadConnections.map(({ marker, ...rest }) => rest);
      }
    });
    return json;
  }

  const saveSketchPanel = document.getElementById("save-sketch-panel");
  const saveSketchNameInput = document.getElementById("save-sketch-name");
  const loadSketchPanel = document.getElementById("load-sketch-panel");
  const sketchListEl = document.getElementById("sketch-list");

  document.getElementById("btn-save-sketch").addEventListener("click", () => {
    loadSketchPanel.hidden = true;
    saveSketchPanel.hidden = !saveSketchPanel.hidden;
    if (!saveSketchPanel.hidden) {
      saveSketchNameInput.value = "";
      saveSketchNameInput.focus();
    }
  });

  function storeSketch() {
    const name = saveSketchNameInput.value.trim();
    if (!name) {
      window.displayNotification("Δώστε ένα όνομα στο σκαρίφημα.", "warning");
      return;
    }
    if (canvas.getObjects().filter((o) => !o.isConnectorIndicator).length === 0) {
      window.displayNotification(
        "Δεν υπάρχει σκαρίφημα για αποθήκευση.",
        "warning",
      );
      return;
    }
    const sketches = loadSavedSketches();
    if (
      sketches[name] &&
      !confirm(`Υπάρχει ήδη σκαρίφημα με το όνομα "${name}". Αντικατάσταση;`)
    )
      return;
    sketches[name] = serializeSketch();
    persistSavedSketches(sketches);
    saveSketchPanel.hidden = true;
    window.displayNotification("Το σκαρίφημα αποθηκεύτηκε.");
  }
  document
    .getElementById("btn-store-sketch")
    .addEventListener("click", storeSketch);
  saveSketchNameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") storeSketch();
  });

  // Ctrl+S opens the save panel exactly like clicking "save sketch" does —
  // reset to a blank name and focused, ready for Enter — rather than
  // reusing whatever name is still sitting in the field from the last
  // save, which would silently overwrite it with no chance to reconsider.
  document.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() !== "s" || (!e.ctrlKey && !e.metaKey)) return;
    e.preventDefault(); // stop the browser's own save-page dialog
    loadSketchPanel.hidden = true;
    saveSketchPanel.hidden = false;
    saveSketchNameInput.value = "";
    saveSketchNameInput.focus();
  });

  // Adds the saved sketch's pieces alongside whatever's already on the
  // canvas (nothing is cleared) — this is how a recurring local layout
  // (a known junction, a common set-up) gets reused across sketches.
  function loadSketch(name) {
    const sketches = loadSavedSketches();
    const data = sketches[name];
    if (!data) return;

    fabric.util.enlivenObjects(data.objects || []).then((objects) => {
      if (objects.length === 0) return;

      // Saved coordinates are wherever the piece sat on the (much bigger)
      // canvas when it was stored — recenter the group on the current
      // viewport instead, or it usually lands off-screen or on top of
      // whatever's already there.
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
      const dx =
        scrollWrap.scrollLeft +
        scrollWrap.clientWidth / 2 -
        (bounds.left + bounds.right) / 2;
      const dy =
        scrollWrap.scrollTop +
        scrollWrap.clientHeight / 2 -
        (bounds.top + bounds.bottom) / 2;

      canvas.discardActiveObject();
      objects.forEach((obj) => {
        obj.set({ left: obj.left + dx, top: obj.top + dy });
        // An eraser clipPath is absolutePositioned (canvas-space, not
        // relative to the object), so it has to be shifted right along with
        // the piece or the hole gets left behind at the old location.
        if (obj.clipPath) {
          obj.clipPath.set({
            left: obj.clipPath.left + dx,
            top: obj.clipPath.top + dy,
          });
          obj.clipPath.setCoords();
        }
        obj.setCoords();
        canvas.add(obj);
        if (obj.isGroundMarking) canvas.bringObjectToFront(obj);
        else if (obj.roadConnections) canvas.sendObjectToBack(obj);
      });
      pushUndo(() => {
        objects.forEach((obj) => canvas.remove(obj));
        refreshConnectorMarkers();
        canvas.requestRenderAll();
      });

      // Select the whole loaded group so it can be dragged into place as
      // one piece right away, same as a single freshly-added shape.
      if (objects.length === 1) canvas.setActiveObject(objects[0]);
      else
        canvas.setActiveObject(
          new fabric.ActiveSelection(objects, { canvas }),
        );

      refreshConnectorMarkers();
      canvas.requestRenderAll();
      loadSketchPanel.hidden = true;
      window.displayNotification("Το σκαρίφημα προστέθηκε στον καμβά.");
    });
  }

  function deleteSketch(name) {
    if (!confirm(`Διαγραφή του σκαριφήματος "${name}";`)) return;
    const sketches = loadSavedSketches();
    delete sketches[name];
    persistSavedSketches(sketches);
    renderSketchList();
    window.displayNotification("Το σκαρίφημα διαγράφηκε.");
  }

  // Native <select> can't hold a delete button per row, so the saved-sketch
  // list is a plain button per entry (load) paired with its own delete
  // button, rather than a <select>+one shared delete button.
  function renderSketchList() {
    const sketches = loadSavedSketches();
    const names = Object.keys(sketches).sort((a, b) => a.localeCompare(b, "el"));
    sketchListEl.innerHTML = "";
    if (names.length === 0) {
      const empty = document.createElement("div");
      empty.className = "sketch-list-empty";
      empty.textContent = "Δεν υπάρχουν αποθηκευμένα σκαριφήματα.";
      sketchListEl.appendChild(empty);
      return;
    }
    names.forEach((name) => {
      const item = document.createElement("div");
      item.className = "sketch-list-item";

      const nameBtn = document.createElement("button");
      nameBtn.type = "button";
      nameBtn.className = "sketch-list-name";
      nameBtn.textContent = name;
      nameBtn.title = name;
      nameBtn.addEventListener("click", () => loadSketch(name));
      item.appendChild(nameBtn);

      const delBtn = document.createElement("button");
      delBtn.type = "button";
      delBtn.className = "sketch-list-delete";
      delBtn.title = `Διαγραφή του σκαριφήματος "${name}"`;
      delBtn.setAttribute("aria-label", delBtn.title);
      delBtn.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>';
      delBtn.addEventListener("click", () => deleteSketch(name));
      item.appendChild(delBtn);

      sketchListEl.appendChild(item);
    });
  }

  document.getElementById("btn-load-sketch").addEventListener("click", () => {
    saveSketchPanel.hidden = true;
    loadSketchPanel.hidden = !loadSketchPanel.hidden;
    if (!loadSketchPanel.hidden) renderSketchList();
  });
})();
