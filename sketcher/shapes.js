// ── Shape factories ──────────────────────────────────────────────
// Every factory takes `ppm` (pixels per meter, the current canvas scale)
// and returns a Fabric object/group sized in real-world meters, centered
// on its own origin so Fabric's default rotate handle spins it in place.
// Real-world dimensions are approximate but plausible for a Greek traffic
// report (car ~4.4x1.8m, lane ~3m wide, etc).
//
// Style is deliberately monochrome — plain fill, outline, no color — matching
// how accident scenes are actually hand-sketched on paper. The two colors
// below are `let`, not `const`: sketcher.js flips them between a light and
// a dark palette to match the app theme, and every factory reads them at
// call time (not at load time), so newly-added shapes always pick up
// whichever palette is currently active.
let SHAPE_FILL = "#ffffff";
let LINE_COLOR = "#1b1f24";

function setShapePalette(fill, line) {
  SHAPE_FILL = fill;
  LINE_COLOR = line;
}

function laneMarking(x1, y1, x2, y2, dashed) {
  return new fabric.Line([x1, y1, x2, y2], {
    stroke: LINE_COLOR,
    strokeWidth: 2,
    strokeDashArray: dashed ? [10, 8] : null,
    selectable: false,
    evented: false,
  });
}

const ROAD_LANE_WIDTH = 3; // meters
const ROAD_LENGTH_M = 20;
const DOUBLE_LINE_GAP_M = 0.15; // gap between the two lines of a double/passing-zone divider

// Shared by roadSegment() and oneWayRoad(): the fill slab plus the
// dividers between lanes (n lanes need n-1 dividers either way).
// Deliberately open-ended: only the left/right edges are stroked, not the
// top/bottom — so two segments butted end-to-end read as one continuous
// road instead of two boxes with a seam between them.
//
// `dividerStyle` controls how each interior divider is drawn:
//   "dashed"       — the default: ordinary lane line, passing allowed.
//   "double-solid" — two solid lines: no passing from either lane.
//   "passing-zone" — one solid + one dashed line, straddling the nominal
//                    divider position (same gap as "double-solid"). By
//                    convention the solid line sits on the lower-x side —
//                    that lane can't cross to pass, while the lane on the
//                    dashed line's side can.
function roadBase(ppm, lanes, lengthM = ROAD_LENGTH_M, dividerStyle = "dashed") {
  const w = lanes * ROAD_LANE_WIDTH * ppm;
  const h = lengthM * ppm;

  const fill = new fabric.Rect({
    width: w,
    height: h,
    fill: SHAPE_FILL,
    originX: "center",
    originY: "center",
    selectable: false,
    evented: false,
  });
  const leftEdge = laneMarking(-w / 2, -h / 2, -w / 2, h / 2, false);
  const rightEdge = laneMarking(w / 2, -h / 2, w / 2, h / 2, false);

  const parts = [fill, leftEdge, rightEdge];
  const gap = (DOUBLE_LINE_GAP_M * ppm) / 2;
  for (let i = 1; i < lanes; i++) {
    const x = -w / 2 + i * ROAD_LANE_WIDTH * ppm;
    if (dividerStyle === "double-solid") {
      parts.push(laneMarking(x - gap, -h / 2, x - gap, h / 2, false));
      parts.push(laneMarking(x + gap, -h / 2, x + gap, h / 2, false));
    } else if (dividerStyle === "passing-zone") {
      parts.push(laneMarking(x - gap, -h / 2, x - gap, h / 2, false));
      parts.push(laneMarking(x + gap, -h / 2, x + gap, h / 2, true));
    } else {
      parts.push(laneMarking(x, -h / 2, x, h / 2, true));
    }
  }

  return { parts, w, h };
}

// Marks `group.roadConnections` with the local (pre-rotation, centered-
// origin) points where other road pieces can magnetically snap to it: each
// entry is a position plus the outward unit normal — the direction a piece
// attaching there continues in. sketcher.js reads this during drag to find
// and align matching connection points on other objects.
function setRoadConnections(group, points) {
  group.roadConnections = points;
  return group;
}

// Marks an object as a ground marking (painted-on-the-road, not pavement
// itself) — sketcher.js reads this on add to keep every marking layered
// above every road piece, regardless of the order they were placed in.
function markAsGroundMarking(obj) {
  obj.isGroundMarking = true;
  return obj;
}

// Three snap points per end — centered, left-aligned, right-aligned —
// instead of just one. A narrower road's own centered point still meets a
// wider road's centered point for a symmetric funnel; but its centered
// point can just as well land on the wider road's LEFT or RIGHT point,
// which (since both sit at the same y with the same normal, just a
// different x) makes the narrower road's edge flush with that side of the
// wider one — e.g. a one-way lane spilling into a two-way road as its
// right-hand lane instead of merging dead-center. Whichever pair the drag
// ends up closest to is the one that wins; no special-casing needed.
function roadEndConnections(w, h) {
  const top = { y: -h / 2, nx: 0, ny: -1 };
  const bottom = { y: h / 2, nx: 0, ny: 1 };
  return [
    { x: 0, ...top },
    { x: -w / 2, ...top },
    { x: w / 2, ...top },
    { x: 0, ...bottom },
    { x: -w / 2, ...bottom },
    { x: w / 2, ...bottom },
  ];
}

// One point at the midpoint of each long edge, facing sideways — where a
// road can plug in perpendicular to form a T-junction (its own end-normal,
// once rotated 90°, opposes this one). Since these sit at y=0 and the end
// points sit at y=±h/2, they're always far enough apart that a drag can't
// confuse a side snap for an end snap.
// `side: true` marks these (vs. the plain end connections above) so
// sketcher.js can tell a T-junction match from an end-to-end one: an
// end-to-end join should land flush, but a perpendicular join is nudged a
// couple px into the through-road so its fill hides the through-road's
// edge line instead of leaving it visibly crossing the opening.
function roadSideConnections(w) {
  return [
    { x: -w / 2, y: 0, nx: -1, ny: 0, side: true },
    { x: w / 2, y: 0, nx: 1, ny: 0, side: true },
  ];
}

function roadSegment(ppm, lanes, lengthM, dividerStyle) {
  const { parts, w, h } = roadBase(ppm, lanes, lengthM, dividerStyle);
  const group = new fabric.Group(parts, {
    originX: "center",
    originY: "center",
    subTargetCheck: false,
  });
  return setRoadConnections(group, [...roadEndConnections(w, h), ...roadSideConnections(w)]);
}

function createRoad2(ppm, lengthM) {
  return roadSegment(ppm, 2, lengthM);
}

// Same 2-lane road, but with no passing from either lane: a solid double
// line instead of the ordinary dashed divider.
function createRoad2DoubleLine(ppm, lengthM) {
  return roadSegment(ppm, 2, lengthM, "double-solid");
}

// Same 2-lane road, but passing is only allowed from one side: a solid
// line (can't cross) paired with a dashed line (can) instead of a single
// dashed divider. See roadBase()'s dividerStyle doc for which lane is which.
function createRoad2PassingZone(ppm, lengthM) {
  return roadSegment(ppm, 2, lengthM, "passing-zone");
}

function createRoad3(ppm, lengthM) {
  return roadSegment(ppm, 3, lengthM);
}

// One-way road: same slab/dividers as roadSegment(), one lane wide — the
// only lane count road2/road3 don't already cover. The direction itself
// isn't drawn on the piece; drop a "Βέλος Κατεύθυνσης" ground marking on
// it to show which way traffic flows.
function createOneWay(ppm, lengthM) {
  const { parts, w, h } = roadBase(ppm, 1, lengthM);
  const group = new fabric.Group(parts, {
    originX: "center",
    originY: "center",
    subTargetCheck: false,
  });
  return setRoadConnections(group, [...roadEndConnections(w, h), ...roadSideConnections(w)]);
}

// Clips a family of parallel 45° lines (y - x = c, direction (1,1),
// stepping by `spacing` across the polygon's own diagonal extent) to a
// CONVEX polygon's boundary, by intersecting each candidate line against
// every edge and keeping the segment between the two boundary crossings.
// General on purpose — every hatched shape below (the median strip's
// rectangle, the two traffic islands' rectangle and triangle) shares this
// one implementation rather than each hand-deriving its own clip formula.
function hatchLinesForPolygon(points, spacing) {
  const edges = points.map((p, i) => [p, points[(i + 1) % points.length]]);
  const cValues = points.map((p) => p.y - p.x);
  const minC = Math.min(...cValues);
  const maxC = Math.max(...cValues);

  const segments = [];
  for (let c = minC; c <= maxC; c += spacing) {
    const tVals = [];
    edges.forEach(([p1, p2]) => {
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const denom = dy - dx; // 0 exactly when the edge is itself parallel to the hatch direction
      if (Math.abs(denom) < 1e-9) return;
      const s = (c - p1.y + p1.x) / denom;
      if (s < -1e-9 || s > 1 + 1e-9) return; // crossing falls outside this edge's own segment
      tVals.push(p1.x + s * dx);
    });
    if (tVals.length < 2) continue;
    const tMin = Math.min(...tVals);
    const tMax = Math.max(...tVals);
    if (tMax - tMin < 1e-6) continue; // grazes only a corner point — nothing to draw
    segments.push([tMin, tMin + c, tMax, tMax + c]);
  }
  return segments;
}

function hatchGroup(points, spacing) {
  const lines = hatchLinesForPolygon(points, spacing).map(
    (seg) =>
      new fabric.Line(seg, {
        stroke: LINE_COLOR,
        strokeWidth: 1,
        selectable: false,
        evented: false,
      })
  );
  return lines;
}

// Median strip: a non-drivable divider, same shape/length convention as a
// road piece (adjustable length, open-ended top/bottom) so it slots
// in-line between two straight segments — but no roadSideConnections,
// since (unlike a real road) plugging something into its side isn't a
// thing. Hatched instead of plain-filled to read as "not pavement".
const MEDIAN_WIDTH_M = 1;
const MEDIAN_HATCH_SPACING_M = 1.2;

function createMedianStrip(ppm, lengthM) {
  const w = MEDIAN_WIDTH_M * ppm;
  const h = (lengthM || ROAD_LENGTH_M) * ppm;

  const fill = new fabric.Rect({
    width: w,
    height: h,
    fill: SHAPE_FILL,
    originX: "center",
    originY: "center",
    selectable: false,
    evented: false,
  });
  const leftEdge = laneMarking(-w / 2, -h / 2, -w / 2, h / 2, false);
  const rightEdge = laneMarking(w / 2, -h / 2, w / 2, h / 2, false);
  const rectPoints = [
    { x: -w / 2, y: -h / 2 },
    { x: w / 2, y: -h / 2 },
    { x: w / 2, y: h / 2 },
    { x: -w / 2, y: h / 2 },
  ];
  const hatch = hatchGroup(rectPoints, MEDIAN_HATCH_SPACING_M * ppm);

  const group = new fabric.Group([fill, ...hatch, leftEdge, rightEdge], {
    originX: "center",
    originY: "center",
    subTargetCheck: false,
  });
  return setRoadConnections(group, roadEndConnections(w, h));
}

// Traffic islands: unlike the median strip, these are standalone raised
// features — placed and rotated freely wherever they're needed (e.g. a
// pedestrian refuge, or the splitter island of a channelized turn), not
// inserted in-line into a road's length. No roadConnections at all, and
// (unlike the median's open-ended top/bottom) every edge is a real, closed
// boundary — there's no "connecting face" to leave open.
const TRAFFIC_ISLAND_HATCH_SPACING_M = 0.8; // denser than the median's — these are much smaller shapes
const TRAFFIC_ISLAND_RECT_W_M = 3;
const TRAFFIC_ISLAND_RECT_H_M = 2;
const TRAFFIC_ISLAND_TRI_W_M = 4;
const TRAFFIC_ISLAND_TRI_H_M = 4;

function createTrafficIslandRect(ppm) {
  const w = TRAFFIC_ISLAND_RECT_W_M * ppm;
  const h = TRAFFIC_ISLAND_RECT_H_M * ppm;

  const fill = new fabric.Rect({
    width: w,
    height: h,
    fill: SHAPE_FILL,
    stroke: LINE_COLOR,
    strokeWidth: 2,
    originX: "center",
    originY: "center",
    selectable: false,
    evented: false,
  });
  const points = [
    { x: -w / 2, y: -h / 2 },
    { x: w / 2, y: -h / 2 },
    { x: w / 2, y: h / 2 },
    { x: -w / 2, y: h / 2 },
  ];
  const hatch = hatchGroup(points, TRAFFIC_ISLAND_HATCH_SPACING_M * ppm);

  return new fabric.Group([fill, ...hatch], {
    originX: "center",
    originY: "center",
    subTargetCheck: false,
  });
}

function createTrafficIslandTriangle(ppm) {
  const w = TRAFFIC_ISLAND_TRI_W_M * ppm;
  const h = TRAFFIC_ISLAND_TRI_H_M * ppm;

  const fill = new fabric.Triangle({
    width: w,
    height: h,
    fill: SHAPE_FILL,
    stroke: LINE_COLOR,
    strokeWidth: 2,
    originX: "center",
    originY: "center",
    selectable: false,
    evented: false,
  });
  // fabric.Triangle's own vertices — apex at top-center, base spanning the
  // bottom — so the hatch lines line up exactly with what's rendered.
  const points = [
    { x: 0, y: -h / 2 },
    { x: w / 2, y: h / 2 },
    { x: -w / 2, y: h / 2 },
  ];
  const hatch = hatchGroup(points, TRAFFIC_ISLAND_HATCH_SPACING_M * ppm);

  return new fabric.Group([fill, ...hatch], {
    originX: "center",
    originY: "center",
    subTargetCheck: false,
  });
}

// Acceleration/merge lane: one lane wide, running parallel to a through-
// road for a stretch (RUN_M) then tapering to a point over TAPER_M — like
// a highway on-ramp lane disappearing into the mainline. The taper's outer
// edge is solid (real edge of pavement); the flush edge that runs the full
// length is dashed, like an internal lane marking, since that's the edge
// traffic actually crosses to merge. Its one `side`-tagged connection
// point sits on that flush edge — snapping it against a through-road's own
// side point (see roadSideConnections) automatically rotates it to lie
// flush on whichever side the drag lands, same mechanism as a T-junction.
//
// `mirrored` flips which side the flush edge is on. This can't be done by
// just rotating the plain version at snap time — rotation preserves
// handedness, so however you spin it, the flush edge stays on the same
// side relative to the direction of travel (the driver's right, matching
// right-hand traffic). A true mirror image is needed for the flush edge
// to fall on the driver's left instead, for left-hand-traffic countries.
function speedingLane(ppm, mirrored) {
  const s = mirrored ? -1 : 1;
  const w = ROAD_LANE_WIDTH * ppm;
  const runM = 10; // parallel run before the taper starts
  const taperM = 10; // shrinks to a point over this stretch
  const runH = runM * ppm;
  const taperH = taperM * ppm;
  const h = runH + taperH;
  const topY = -h / 2; // open end: full lane width, can take an incoming road
  const runEndY = topY + runH; // taper starts here
  const bottomY = h / 2; // merge point: tapers to zero width

  const fill = new fabric.Polygon(
    [
      { x: s * (-w / 2), y: topY },
      { x: s * (w / 2), y: topY },
      { x: s * (w / 2), y: runEndY },
      { x: s * (-w / 2), y: bottomY },
    ],
    { fill: SHAPE_FILL, selectable: false, evented: false }
  );

  const outerEdge = new fabric.Polyline(
    [
      { x: s * (w / 2), y: topY },
      { x: s * (w / 2), y: runEndY },
      { x: s * (-w / 2), y: bottomY },
    ],
    { fill: "", stroke: LINE_COLOR, strokeWidth: 2, selectable: false, evented: false }
  );
  const flushEdge = laneMarking(s * (-w / 2), topY, s * (-w / 2), bottomY, true);

  const group = new fabric.Group([fill, outerEdge, flushEdge], {
    originX: "center",
    originY: "center",
    subTargetCheck: false,
    angle: 180, // spawn flipped: taper/merge point at top, open end at bottom
  });
  return setRoadConnections(group, [
    ...roadEndConnections(w, h).filter((c) => c.y === topY),
    { x: s * (-w / 2), y: 0, nx: s * -1, ny: 0, side: true },
  ]);
}

function createSpeedingLane(ppm) {
  return speedingLane(ppm, false);
}

function createSpeedingLaneMirrored(ppm) {
  return speedingLane(ppm, true);
}

// Bounding-box center of a circular sector — radius rInner..rOuter,
// sweeping angle 0..bendDeg around a circle centered at the local origin.
// Needed to re-center turn()'s arc path for ANY bend angle: unlike a
// rectangle, an arc's true extent isn't just its two endpoints — a sweep
// that crosses a cardinal angle (90°, 180°, ...) bulges further out than
// either one (a 135° turn's outer arc reaches its lowest point exactly at
// the 90° mark partway through the sweep, well past where either the entry
// or exit cap sits).
function sectorBBoxCenter(bendDeg, rInner, rOuter) {
  const angles = [0, bendDeg];
  [90, 180, 270].forEach((a) => {
    if (a > 0 && a < bendDeg) angles.push(a);
  });
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  angles.forEach((a) => {
    const rad = (a * Math.PI) / 180;
    [rInner, rOuter].forEach((r) => {
      const x = r * Math.cos(rad);
      const y = r * Math.sin(rad);
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    });
  });
  return { x: (minX + maxX) / 2, y: (minY + maxY) / 2 };
}

// A road that bends `bendDeg` degrees over `lanes` lanes — an annulus
// sector built from an SVG arc path swept around a circle centered at the
// local origin, then shifted onto its own true bounding-box center (see
// sectorBBoxCenter above) so it rotates in place like every other shape
// factory here. `doubleLine` swaps each dashed lane divider for a pair of
// solid lines with a small gap — a real "no passing" double-line marking.
function turn(ppm, bendDeg, lanes = 2, doubleLine = false) {
  const laneWidth = 3;
  const innerR = 4 * ppm;
  const outerR = innerR + lanes * laneWidth * ppm;
  const midR = (innerR + outerR) / 2; // where a connecting road's centerline meets it — not necessarily a lane divider once lanes != 2

  const rad = (bendDeg * Math.PI) / 180;
  const off = sectorBBoxCenter(bendDeg, innerR, outerR);
  const pt = (r, a) => ({ x: r * Math.cos(a) - off.x, y: r * Math.sin(a) - off.y });
  // A standalone arc stroke at radius r, sweeping entry (angle 0) to exit
  // (angle rad) — used as-is for the outer/inner walls and lane dividers.
  const arcPath = (r) => {
    const start = pt(r, 0);
    const end = pt(r, rad);
    return `M ${start.x} ${start.y} A ${r} ${r} 0 0 1 ${end.x} ${end.y}`;
  };

  const innerEntry = pt(innerR, 0);
  const outerEntry = pt(outerR, 0);
  const outerExit = pt(outerR, rad);
  const innerExit = pt(innerR, rad);
  const midEntry = pt(midR, 0);
  const midExit = pt(midR, rad);

  const d = [
    `M ${innerEntry.x} ${innerEntry.y}`,
    `L ${outerEntry.x} ${outerEntry.y}`,
    `A ${outerR} ${outerR} 0 0 1 ${outerExit.x} ${outerExit.y}`,
    `L ${innerExit.x} ${innerExit.y}`,
    `A ${innerR} ${innerR} 0 0 0 ${innerEntry.x} ${innerEntry.y}`,
    "Z",
  ].join(" ");

  // Fill only, no stroke: the outline is drawn separately below so the two
  // straight ends (entry and exit) — the faces that connect to a straight
  // road segment — stay open instead of capped.
  const fill = new fabric.Path(d, {
    fill: SHAPE_FILL,
    selectable: false,
    evented: false,
  });

  const outerArc = new fabric.Path(arcPath(outerR), {
    fill: "",
    stroke: LINE_COLOR,
    strokeWidth: 2,
    selectable: false,
    evented: false,
  });
  const innerArc = new fabric.Path(arcPath(innerR), {
    fill: "",
    stroke: LINE_COLOR,
    strokeWidth: 2,
    selectable: false,
    evented: false,
  });

  const parts = [fill, outerArc, innerArc];
  for (let i = 1; i < lanes; i++) {
    const dividerR = innerR + i * laneWidth * ppm;
    if (doubleLine) {
      const gap = (DOUBLE_LINE_GAP_M * ppm) / 2;
      [dividerR - gap, dividerR + gap].forEach((r) => {
        parts.push(
          new fabric.Path(arcPath(r), {
            fill: "",
            stroke: LINE_COLOR,
            strokeWidth: 2,
            selectable: false,
            evented: false,
          })
        );
      });
    } else {
      parts.push(
        new fabric.Path(arcPath(dividerR), {
          fill: "",
          stroke: LINE_COLOR,
          strokeWidth: 2,
          strokeDashArray: [10, 8],
          selectable: false,
          evented: false,
        })
      );
    }
  }

  const group = new fabric.Group(parts, {
    originX: "center",
    originY: "center",
    subTargetCheck: false,
  });
  // Entry normal points backward (away from the piece — where an incoming
  // road attaches, continuing in the direction it was already headed);
  // exit normal points forward, continuing on in the bent direction.
  return setRoadConnections(group, [
    { x: midEntry.x, y: midEntry.y, nx: 0, ny: -1 },
    { x: midExit.x, y: midExit.y, nx: -Math.sin(rad), ny: Math.cos(rad) },
  ]);
}

function createTurn(ppm) {
  return turn(ppm, 90);
}

function createTurn45(ppm) {
  return turn(ppm, 45);
}

function createTurn135(ppm) {
  return turn(ppm, 135);
}

function createTurn45_3(ppm) {
  return turn(ppm, 45, 3);
}

function createTurn90_3(ppm) {
  return turn(ppm, 90, 3);
}

function createTurn135_3(ppm) {
  return turn(ppm, 135, 3);
}

function createTurn45_1(ppm) {
  return turn(ppm, 45, 1);
}

function createTurn90_1(ppm) {
  return turn(ppm, 90, 1);
}

function createTurn135_1(ppm) {
  return turn(ppm, 135, 1);
}

function createTurn45_2Double(ppm) {
  return turn(ppm, 45, 2, true);
}

function createTurn90_2Double(ppm) {
  return turn(ppm, 90, 2, true);
}

function createTurn135_2Double(ppm) {
  return turn(ppm, 135, 2, true);
}

// Roundabout: a ring of `lanes` lanes around a solid central island, with
// eight connectors — every 45° — for roads to plug in radially. The island
// stays the same size across all five variants — only the ring around it
// gets wider as lanes are added.
const ROUNDABOUT_INNER_M = 5;

function roundabout(ppm, lanes) {
  const innerR = ROUNDABOUT_INNER_M * ppm;
  const outerR = innerR + lanes * ROAD_LANE_WIDTH * ppm;

  // Pavement disk, then the island painted on top to punch out the
  // center — same trick as filledSegment() elsewhere: two opaque shapes
  // overlapping exactly is pixel-identical to a true annulus, no seam.
  const pavement = new fabric.Circle({
    radius: outerR,
    fill: SHAPE_FILL,
    originX: "center",
    originY: "center",
    selectable: false,
    evented: false,
  });
  const island = new fabric.Circle({
    radius: innerR,
    fill: LINE_COLOR,
    originX: "center",
    originY: "center",
    selectable: false,
    evented: false,
  });
  const outerEdge = new fabric.Circle({
    radius: outerR,
    fill: "",
    stroke: LINE_COLOR,
    strokeWidth: 2,
    originX: "center",
    originY: "center",
    selectable: false,
    evented: false,
  });

  const parts = [pavement, island, outerEdge];
  for (let i = 1; i < lanes; i++) {
    parts.push(
      new fabric.Circle({
        radius: innerR + i * ROAD_LANE_WIDTH * ppm,
        fill: "",
        stroke: LINE_COLOR,
        strokeWidth: 2,
        strokeDashArray: [10, 8],
        originX: "center",
        originY: "center",
        selectable: false,
        evented: false,
      })
    );
  }

  const group = new fabric.Group(parts, { originX: "center", originY: "center", subTargetCheck: false });

  // Eight ports at the ring's outer rim — a connecting road's own
  // centerline meets it there, same one-point-one-match convention as
  // every other piece. Tagged `side`, like a T-junction: the outer edge is
  // one continuous stroked circle (not pre-notched the way a straight
  // road's ends are open), so it's the overlap+bring-to-front treatment
  // that actually hides the seam where a road plugs in, not the geometry.
  const connections = [];
  for (let k = 0; k < 8; k++) {
    const theta = (k * 45 * Math.PI) / 180;
    const nx = Math.sin(theta);
    const ny = -Math.cos(theta);
    connections.push({ x: outerR * nx, y: outerR * ny, nx, ny, side: true });
  }

  return setRoadConnections(group, connections);
}

function createRoundabout1(ppm) {
  return roundabout(ppm, 1);
}

function createRoundabout2(ppm) {
  return roundabout(ppm, 2);
}

function createRoundabout3(ppm) {
  return roundabout(ppm, 3);
}

function createRoundabout4(ppm) {
  return roundabout(ppm, 4);
}

function createRoundabout5(ppm) {
  return roundabout(ppm, 5);
}

// Crosswalk width scales with lane count (real stripe/gap size stays
// fixed at ~0.5m each — STRIPE_PERIOD_M — so a wider crossing gets more
// stripes rather than the same 6 stretched thinner or fatter). At 2 lanes
// this reproduces the original fixed 6m/6-stripe crosswalk exactly.
const CROSSWALK_LENGTH_M = 3; // along the direction of travel
const STRIPE_PERIOD_M = 1; // one stripe (0.5m) + one gap (0.5m)

function crosswalk(ppm, lanes) {
  const widthM = lanes * ROAD_LANE_WIDTH;
  const w = widthM * ppm;
  const h = CROSSWALK_LENGTH_M * ppm;
  const stripeCount = Math.round(widthM / STRIPE_PERIOD_M);
  const stripeW = w / (stripeCount * 2 - 1);

  const parts = [];
  for (let i = 0; i < stripeCount; i++) {
    parts.push(
      new fabric.Rect({
        left: -w / 2 + i * stripeW * 2,
        top: -h / 2,
        width: stripeW,
        height: h,
        fill: LINE_COLOR,
        selectable: false,
        evented: false,
      })
    );
  }

  return markAsGroundMarking(
    new fabric.Group(parts, { originX: "center", originY: "center", subTargetCheck: false })
  );
}

function createCrosswalk1(ppm) {
  return crosswalk(ppm, 1);
}

function createCrosswalk2(ppm) {
  return crosswalk(ppm, 2);
}

function createCrosswalk3(ppm) {
  return crosswalk(ppm, 3);
}

// ── Ground markings ──────────────────────────────────────────────
// Painted-on-the-road markings — arrows and the like — live as their own
// pieces, separate from the road shapes themselves, so a road piece is
// just pavement/geometry and any marking on it is a deliberate, separately
// placed and positioned choice. None of these carry roadConnections:
// they're decorative, dropped wherever needed, not part of the road
// network's magnetic-snap graph.
// Bold, solid-filled pavement paint — like a real lane-arrow stencil, not
// a thin outline. All markings below share these proportions (meters), sized
// to sit centered in a lane with room either side rather than edge-to-edge —
// ARROW_MAX_WIDTH_M is the sideways footprint every variant is built to fit
// within, straight arrows included.
const ARROW_MAX_WIDTH_M = ROAD_LANE_WIDTH / 2;
const ARROW_RIBBON_W = 0.35; // width of the painted stripe itself
const ARROW_HEAD_W = 1.3; // width of the flared arrowhead
const ARROW_HEAD_LEN = 1.0;

// A rect stretched and rotated to span p1→p2 at the given width — a
// "thick line segment". Used to build bent arrows out of a few overlapping
// filled pieces instead of computing a single offset-polygon outline:
// since every piece is the same opaque fill color, overlapping joints are
// pixel-identical to a seamless union, so this is exact, not just a
// close-enough approximation.
function filledSegment(p1, p2, width) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const len = Math.hypot(dx, dy);
  const angleDeg = Math.atan2(-dx, dy) * (180 / Math.PI);
  return new fabric.Rect({
    width,
    height: len,
    left: (p1.x + p2.x) / 2,
    top: (p1.y + p2.y) / 2,
    originX: "center",
    originY: "center",
    angle: angleDeg,
    fill: LINE_COLOR,
    selectable: false,
    evented: false,
  });
}

// An arrowhead triangle whose apex lands exactly on `tip`, facing the
// direction implied by `angle` (0 = up, ±90 = sideways) — shared by every
// marking below that ends in an arrowhead.
function arrowHead(tip, angleDeg, headW, headLen) {
  const rad = (angleDeg * Math.PI) / 180;
  // Apex-to-center offset for an up-pointing triangle is (0, -headLen/2);
  // rotate that by angleDeg to get where the center sits relative to tip.
  const dx = -(-headLen / 2) * Math.sin(rad);
  const dy = (-headLen / 2) * Math.cos(rad);
  return new fabric.Triangle({
    width: headW,
    height: headLen,
    left: tip.x - dx,
    top: tip.y - dy,
    originX: "center",
    originY: "center",
    angle: angleDeg,
    fill: LINE_COLOR,
    selectable: false,
    evented: false,
  });
}

function createArrowMarking(ppm) {
  const ribbonW = ARROW_RIBBON_W * ppm;
  const headW = ARROW_HEAD_W * ppm;
  const headLen = ARROW_HEAD_LEN * ppm;
  const shaftLen = 3 * ppm;
  const totalLen = shaftLen + headLen;
  const bottomY = totalLen / 2;
  const tipY = -totalLen / 2;

  const shaft = filledSegment({ x: 0, y: bottomY }, { x: 0, y: tipY + headLen }, ribbonW);
  const head = arrowHead({ x: 0, y: tipY }, 0, headW, headLen);

  return markAsGroundMarking(
    new fabric.Group([shaft, head], { originX: "center", originY: "center", subTargetCheck: false })
  );
}

// A bent lane-designation arrow — shaft, 45° bend, short horizontal reach,
// flared arrowhead — for "this lane turns left/right" markings. `dir: -1`
// bends left, `dir: 1` bends right; built from filledSegment() pieces
// meeting at each joint, with the arrowhead rotated ±90° to face sideways.
function turnArrowMarking(ppm, dir) {
  const ribbonW = ARROW_RIBBON_W * ppm;
  const headW = ARROW_HEAD_W * ppm;
  const headLen = ARROW_HEAD_LEN * ppm;
  const shaftLen = 2.2 * ppm;
  // The bend+tail+head reach sideways (the head is rotated 90° to point
  // sideways, so its length adds to the sideways footprint here, unlike
  // in the straight arrow) — but so does the base shaft's own ribbon
  // thickness bleeding past center on the *opposite* side (ribbonW/2,
  // verified against the actual rendered bounding box, not just the
  // centerline). Split what's left of the width budget between the
  // diagonal and the tail.
  const sidewaysBudget = ARROW_MAX_WIDTH_M * ppm - headLen - ribbonW / 2;
  const diagStep = sidewaysBudget * 0.6;
  const tailLen = sidewaysBudget * 0.4;

  const p0 = { x: 0, y: 0 };
  const p1 = { x: 0, y: -shaftLen };
  const p2 = { x: dir * diagStep, y: -shaftLen - diagStep };
  const p3 = { x: dir * (diagStep + tailLen), y: -shaftLen - diagStep };
  const tip = { x: p3.x + dir * headLen, y: p3.y };

  const shaftSeg = filledSegment(p0, p1, ribbonW);
  const diagSeg = filledSegment(p1, p2, ribbonW);
  const tailSeg = filledSegment(p2, p3, ribbonW);
  const head = arrowHead(tip, dir * 90, headW, headLen);

  return markAsGroundMarking(
    new fabric.Group([shaftSeg, diagSeg, tailSeg, head], {
      originX: "center",
      originY: "center",
      subTargetCheck: false,
    })
  );
}

function createArrowMarkingLeft(ppm) {
  return turnArrowMarking(ppm, -1);
}

function createArrowMarkingRight(ppm) {
  return turnArrowMarking(ppm, 1);
}

// A "this lane goes straight OR turns" marking: one shared base shaft that
// forks into a straight branch and a bent branch, each with their own
// (smaller, since two branches — and the straight one's head, sitting
// dead center, eats into the width budget on its own — share the space)
// arrowhead. `dir: -1` forks left, `dir: 1` forks right.
function forkArrowMarking(ppm, dir) {
  const ribbonW = ARROW_RIBBON_W * ppm;
  const headScale = 0.6; // smaller than the single-direction arrows' heads, to leave room for a visible bend within the same width budget
  const headW = ARROW_HEAD_W * ppm * headScale;
  const headLen = ARROW_HEAD_LEN * ppm * headScale;
  const baseLen = 1.8 * ppm;
  const straightLen = 1.6 * ppm;
  // The straight branch's own head sits centered (half its width bleeds
  // past x=0 on the side opposite the bend) — that, plus the turn
  // branch's head reach, is what the diagonal+tail have to fit around.
  const sidewaysBudget = ARROW_MAX_WIDTH_M * ppm - headLen - headW / 2;
  const diagStep = sidewaysBudget * 0.6;
  const tailLen = sidewaysBudget * 0.4;

  const p0 = { x: 0, y: 0 };
  const fork = { x: 0, y: -baseLen };
  const base = filledSegment(p0, fork, ribbonW);

  const straightEnd = { x: 0, y: fork.y - straightLen };
  const straightSeg = filledSegment(fork, straightEnd, ribbonW);
  const straightTip = { x: 0, y: straightEnd.y - headLen };
  const straightHead = arrowHead(straightTip, 0, headW, headLen);

  const bend = { x: fork.x + dir * diagStep, y: fork.y - diagStep };
  const tailEnd = { x: bend.x + dir * tailLen, y: bend.y };
  const diagSeg = filledSegment(fork, bend, ribbonW);
  const tailSeg = filledSegment(bend, tailEnd, ribbonW);
  const turnTip = { x: tailEnd.x + dir * headLen, y: tailEnd.y };
  const turnHead = arrowHead(turnTip, dir * 90, headW, headLen);

  return markAsGroundMarking(
    new fabric.Group([base, straightSeg, straightHead, diagSeg, tailSeg, turnHead], {
      originX: "center",
      originY: "center",
      subTargetCheck: false,
    })
  );
}

function createArrowMarkingForkLeft(ppm) {
  return forkArrowMarking(ppm, -1);
}

function createArrowMarkingForkRight(ppm) {
  return forkArrowMarking(ppm, 1);
}

// "STOP" stencil. Drawn as plain (non-perspective) lettering, matching
// this app's top-down plan view — the stretched look of a real STOP
// marking is an artifact of viewing it obliquely from a driver's seat, not
// its true painted shape from directly above.
function createStopMarking(ppm) {
  return markAsGroundMarking(
    new fabric.Textbox("STOP", {
      fontSize: 1.5 * ppm,
      fontWeight: "bold",
      fontFamily: "Arial, sans-serif",
      fill: LINE_COLOR,
      textAlign: "center",
      editable: false,
    })
  );
}

// Give-way / yield "shark's teeth": a row of small solid triangles.
function createYieldMarking(ppm) {
  const count = 5;
  const triW = 0.6 * ppm;
  const triH = 0.5 * ppm;
  const gap = 0.3 * ppm;
  const totalW = count * triW + (count - 1) * gap;

  const parts = [];
  for (let i = 0; i < count; i++) {
    const cx = -totalW / 2 + triW / 2 + i * (triW + gap);
    parts.push(
      new fabric.Triangle({
        width: triW,
        height: triH,
        left: cx,
        top: 0,
        originX: "center",
        originY: "center",
        fill: LINE_COLOR,
        selectable: false,
        evented: false,
      })
    );
  }

  return markAsGroundMarking(
    new fabric.Group(parts, { originX: "center", originY: "center", subTargetCheck: false })
  );
}

function vehicle(ppm, lengthM, widthM) {
  const w = widthM * ppm;
  const h = lengthM * ppm;

  const body = new fabric.Rect({
    width: w,
    height: h,
    rx: w * 0.18,
    ry: w * 0.18,
    fill: SHAPE_FILL,
    stroke: LINE_COLOR,
    strokeWidth: 2,
    originX: "center",
    originY: "center",
    selectable: false,
    evented: false,
  });
  const windshield = new fabric.Rect({
    left: -w * 0.32,
    top: -h * 0.32,
    width: w * 0.64,
    height: h * 0.22,
    fill: "",
    stroke: LINE_COLOR,
    strokeWidth: 1,
    originX: "left",
    originY: "top",
    selectable: false,
    evented: false,
  });

  return new fabric.Group([body, windshield], {
    originX: "center",
    originY: "center",
    subTargetCheck: false,
  });
}

function createCar(ppm) {
  return vehicle(ppm, 4.4, 1.8);
}

function createTruck(ppm) {
  return vehicle(ppm, 7, 2.5);
}

function createText() {
  return new fabric.Textbox("Κείμενο", {
    fontSize: 18,
    fill: LINE_COLOR,
    editable: true,
  });
}

const SHAPE_FACTORIES = {
  road2: createRoad2,
  road2doubleline: createRoad2DoubleLine,
  road2passingzone: createRoad2PassingZone,
  road3: createRoad3,
  oneway: createOneWay,
  medianstrip: createMedianStrip,
  trafficislandrect: createTrafficIslandRect,
  trafficislandtriangle: createTrafficIslandTriangle,
  speedlane: createSpeedingLane,
  speedlanemirror: createSpeedingLaneMirrored,
  turn: createTurn,
  turn45: createTurn45,
  turn135: createTurn135,
  turn45_3: createTurn45_3,
  turn90_3: createTurn90_3,
  turn135_3: createTurn135_3,
  turn45_1: createTurn45_1,
  turn90_1: createTurn90_1,
  turn135_1: createTurn135_1,
  turn45_2double: createTurn45_2Double,
  turn90_2double: createTurn90_2Double,
  turn135_2double: createTurn135_2Double,
  roundabout1: createRoundabout1,
  roundabout2: createRoundabout2,
  roundabout3: createRoundabout3,
  roundabout4: createRoundabout4,
  roundabout5: createRoundabout5,
  crosswalk1: createCrosswalk1,
  crosswalk2: createCrosswalk2,
  crosswalk3: createCrosswalk3,
  arrowmarking: createArrowMarking,
  arrowmarkingleft: createArrowMarkingLeft,
  arrowmarkingright: createArrowMarkingRight,
  arrowmarkingforkleft: createArrowMarkingForkLeft,
  arrowmarkingforkright: createArrowMarkingForkRight,
  stopmarking: createStopMarking,
  yieldmarking: createYieldMarking,
  car: createCar,
  truck: createTruck,
  text: () => createText(),
};

// ── Traffic signs (Πινακίδες) ────────────────────────────────────
// Cropped from a Greek traffic-sign supplier's catalog sheet, one PNG per
// sign under sketcher/signs/, named after its official code (e.g. "p-1.png"
// for Ρ-1). Unlike every shape above, these are raster images rather than
// vector-drawn — loaded on demand via fabric.Image.fromURL (async in Fabric
// v6, hence each factory below returns a Promise; sketcher.js's addShape()
// wraps every factory call in Promise.resolve().then(...) to support both
// this and the synchronous factories above without special-casing either).
// `sizeM` is the on-canvas size of a sign's longer side, in meters — every
// sign spawns as a 1x1 grid square by default, matching how large the other
// shape factories' real-world dimensions render at the current px/m scale.
// The crop's own pixel aspect ratio is preserved exactly (scaled by its
// longer side), never stretched to a uniform square, so a sign's proportions
// still match the source photo.
const SIGN_DEFS = [
  { key: "sign_p_1", code: "Ρ-1", codeLatin: "P-1", file: "p-1.png", desc: "Παραχώρηση προτεραιότητας", sizeM: 1, category: "P" },
  { key: "sign_p_2", code: "Ρ-2", codeLatin: "P-2", file: "p-2.png", desc: "STOP - Υποχρεωτική στάση", sizeM: 1, category: "P" },
  { key: "sign_p_3", code: "Ρ-3", codeLatin: "P-3", file: "p-3.png", desc: "Δρόμος προτεραιότητας", sizeM: 1, category: "P" },
  { key: "sign_p_4", code: "Ρ-4", codeLatin: "P-4", file: "p-4.png", desc: "Τέλος δρόμου προτεραιότητας", sizeM: 1, category: "P" },
  { key: "sign_p_5", code: "Ρ-5", codeLatin: "P-5", file: "p-5.png", desc: "Απαγόρευση προσπέρασης", sizeM: 1, category: "P" },
  { key: "sign_p_6", code: "Ρ-6", codeLatin: "P-6", file: "p-6.png", desc: "Απαγόρευση προσπέρασης από φορτηγά", sizeM: 1, category: "P" },
  { key: "sign_p_7", code: "Ρ-7", codeLatin: "P-7", file: "p-7.png", desc: "Απαγόρευση εισόδου", sizeM: 1, category: "P" },
  { key: "sign_p_8", code: "Ρ-8", codeLatin: "P-8", file: "p-8.png", desc: "Απαγόρευση κυκλοφορίας όλων των οχημάτων και προς τις δύο κατευθύνσεις", sizeM: 1, category: "P" },
  { key: "sign_p_9", code: "Ρ-9", codeLatin: "P-9", file: "p-9.png", desc: "Απαγόρευση κυκλοφορίας αυτοκινήτων", sizeM: 1, category: "P" },
  { key: "sign_p_10", code: "Ρ-10", codeLatin: "P-10", file: "p-10.png", desc: "Απαγόρευση κυκλοφορίας μοτοσικλετών", sizeM: 1, category: "P" },
  { key: "sign_p_11", code: "Ρ-11", codeLatin: "P-11", file: "p-11.png", desc: "Απαγόρευση κυκλοφορίας ποδηλάτων", sizeM: 1, category: "P" },
  { key: "sign_p_12", code: "Ρ-12", codeLatin: "P-12", file: "p-12.png", desc: "Απαγόρευση κυκλοφορίας μοτοποδηλάτων", sizeM: 1, category: "P" },
  { key: "sign_p_13", code: "Ρ-13", codeLatin: "P-13", file: "p-13.png", desc: "Απαγόρευση κυκλοφορίας φορτηγών", sizeM: 1, category: "P" },
  { key: "sign_p_14", code: "Ρ-14", codeLatin: "P-14", file: "p-14.png", desc: "Απαγόρευση κυκλοφορίας οχημάτων με ρυμουλκούμενο", sizeM: 1, category: "P" },
  { key: "sign_p_15", code: "Ρ-15", codeLatin: "P-15", file: "p-15.png", desc: "Απαγόρευση κυκλοφορίας πεζών", sizeM: 1, category: "P" },
  { key: "sign_p_16", code: "Ρ-16", codeLatin: "P-16", file: "p-16.png", desc: "Απαγόρευση κυκλοφορίας ζωήλατων οχημάτων", sizeM: 1, category: "P" },
  { key: "sign_p_17", code: "Ρ-17", codeLatin: "P-17", file: "p-17.png", desc: "Απαγόρευση κυκλοφορίας χειράμαξων", sizeM: 1, category: "P" },
  { key: "sign_p_18", code: "Ρ-18", codeLatin: "P-18", file: "p-18.png", desc: "Απαγόρευση κυκλοφορίας γεωργικών ελκυστήρων", sizeM: 1, category: "P" },
  { key: "sign_p_19", code: "Ρ-19", codeLatin: "P-19", file: "p-19.png", desc: "Απαγόρευση κυκλοφορίας οχημάτων με ρυμουλκούμενο τρέιλερ", sizeM: 1, category: "P" },
  { key: "sign_p_20", code: "Ρ-20", codeLatin: "P-20", file: "p-20.png", desc: "Απαγόρευση κυκλοφορίας μοτοποδηλάτων με πλαϊνό/καλάθι", sizeM: 1, category: "P" },
  { key: "sign_p_21", code: "Ρ-21", codeLatin: "P-21", file: "p-21.png", desc: "Απαγόρευση εισόδου σε οχήματα πλάτους άνω των 2μ", sizeM: 1, category: "P" },
  { key: "sign_p_22", code: "Ρ-22", codeLatin: "P-22", file: "p-22.png", desc: "Απαγόρευση εισόδου σε οχήματα ύψους άνω των 4,4μ", sizeM: 1, category: "P" },
  { key: "sign_p_23", code: "Ρ-23", codeLatin: "P-23", file: "p-23.png", desc: "Απαγόρευση εισόδου σε οχήματα βάρους άνω των 5 τόνων", sizeM: 1, category: "P" },
  { key: "sign_p_24", code: "Ρ-24", codeLatin: "P-24", file: "p-24.png", desc: "Απαγόρευση εισόδου σε οχήματα με φορτίο άξονα άνω του ορίου", sizeM: 1, category: "P" },
  { key: "sign_p_25", code: "Ρ-25", codeLatin: "P-25", file: "p-25.png", desc: "Απαγόρευση κυκλοφορίας φορτηγών με ρυμούλκα", sizeM: 1, category: "P" },
  { key: "sign_p_26", code: "Ρ-26", codeLatin: "P-26", file: "p-26.png", desc: "Ελάχιστη απόσταση μεταξύ οχημάτων 50μ", sizeM: 1, category: "P" },
  { key: "sign_p_27", code: "Ρ-27", codeLatin: "P-27", file: "p-27.png", desc: "Απαγόρευση αριστερής στροφής", sizeM: 1, category: "P" },
  { key: "sign_p_28", code: "Ρ-28", codeLatin: "P-28", file: "p-28.png", desc: "Απαγόρευση δεξιάς στροφής", sizeM: 1, category: "P" },
  { key: "sign_p_29", code: "Ρ-29", codeLatin: "P-29", file: "p-29.png", desc: "Απαγόρευση αναστροφής (U-turn)", sizeM: 1, category: "P" },
  { key: "sign_p_30", code: "Ρ-30", codeLatin: "P-30", file: "p-30.png", desc: "Υποχρεωτική ελάχιστη απόσταση μεταξύ οχημάτων", sizeM: 1, category: "P" },
  { key: "sign_p_31", code: "Ρ-31", codeLatin: "P-31", file: "p-31.png", desc: "Υποχρεωτική απόσταση μεταξύ φορτηγών", sizeM: 1, category: "P" },
  { key: "sign_p_32", code: "Ρ-32", codeLatin: "P-32", file: "p-32.png", desc: "Ανώτατο όριο ταχύτητας 50 χλμ/ώρα", sizeM: 1, category: "P" },
  { key: "sign_p_33", code: "Ρ-33", codeLatin: "P-33", file: "p-33.png", desc: "Απαγόρευση χρήσης κόρνας", sizeM: 1, category: "P" },
  { key: "sign_p_34", code: "Ρ-34", codeLatin: "P-34", file: "p-34.png", desc: "Τελωνείο", sizeM: 1, category: "P" },
  { key: "sign_p_35", code: "Ρ-35", codeLatin: "P-35", file: "p-35.png", desc: "Σταθμός διοδίων", sizeM: 1, category: "P" },
  { key: "sign_p_36", code: "Ρ-36", codeLatin: "P-36", file: "p-36.png", desc: "Τέλος απαγόρευσης προσπέρασης", sizeM: 1, category: "P" },
  { key: "sign_p_37", code: "Ρ-37", codeLatin: "P-37", file: "p-37.png", desc: "Τέλος ορίου ταχύτητας 50 χλμ/ώρα", sizeM: 1, category: "P" },
  { key: "sign_p_38", code: "Ρ-38", codeLatin: "P-38", file: "p-38.png", desc: "Τέλος απαγόρευσης προσπέρασης φορτηγών", sizeM: 1, category: "P" },
  { key: "sign_p_39", code: "Ρ-39", codeLatin: "P-39", file: "p-39.png", desc: "Απαγόρευση στάσης και στάθμευσης", sizeM: 1, category: "P" },
  { key: "sign_p_40", code: "Ρ-40", codeLatin: "P-40", file: "p-40.png", desc: "Απαγόρευση στάθμευσης", sizeM: 1, category: "P" },
  { key: "sign_p_41", code: "Ρ-41", codeLatin: "P-41", file: "p-41.png", desc: "Απαγόρευση στάθμευσης σε μονές ημερομηνίες", sizeM: 1, category: "P" },
  { key: "sign_p_42", code: "Ρ-42", codeLatin: "P-42", file: "p-42.png", desc: "Απαγόρευση στάθμευσης σε ζυγές ημερομηνίες", sizeM: 1, category: "P" },
  { key: "sign_p_43", code: "Ρ-43", codeLatin: "P-43", file: "p-43.png", desc: "Απαγόρευση στάθμευσης σε καθορισμένη ζώνη (ΠΕΡΙΟΧΗ)", sizeM: 1, category: "P" },
  { key: "sign_p_44", code: "Ρ-44", codeLatin: "P-44", file: "p-44.png", desc: "Τέλος ζώνης απαγόρευσης στάθμευσης (ΠΕΡΙΟΧΗ)", sizeM: 1, category: "P" },
  { key: "sign_p_45", code: "Ρ-45", codeLatin: "P-45", file: "p-45.png", desc: "Απαγόρευση κυκλοφορίας οχημάτων με εύφλεκτο/επικίνδυνο φορτίο", sizeM: 1, category: "P" },
  { key: "sign_p_46", code: "Ρ-46", codeLatin: "P-46", file: "p-46.png", desc: "Απαγόρευση κυκλοφορίας οχημάτων με ρυπογόνο φορτίο για τα ύδατα", sizeM: 1, category: "P" },
  { key: "sign_p_47", code: "Ρ-47", codeLatin: "P-47", file: "p-47.png", desc: "Υποχρεωτική κατεύθυνση αριστερά", sizeM: 1, category: "P" },
  { key: "sign_p_48", code: "Ρ-48", codeLatin: "P-48", file: "p-48.png", desc: "Υποχρεωτική κατεύθυνση δεξιά", sizeM: 1, category: "P" },
  { key: "sign_p_49", code: "Ρ-49", codeLatin: "P-49", file: "p-49.png", desc: "Υποχρεωτική πορεία ευθεία", sizeM: 1, category: "P" },
  { key: "sign_p_50", code: "Ρ-50", codeLatin: "P-50", file: "p-50.png", desc: "Υποχρεωτική πορεία ευθεία ή δεξιά", sizeM: 1, category: "P" },
  { key: "sign_p_50a", code: "Ρ-50α", codeLatin: "P-50a", file: "p-50a.png", desc: "Υποχρεωτική στροφή αριστερά", sizeM: 1, category: "P" },
  { key: "sign_p_50d", code: "Ρ-50δ", codeLatin: "P-50d", file: "p-50d.png", desc: "Υποχρεωτική στροφή δεξιά", sizeM: 1, category: "P" },
  { key: "sign_p_51a", code: "Ρ-51α", codeLatin: "P-51a", file: "p-51a.png", desc: "Υποχρεωτική πορεία ευθεία ή αριστερά", sizeM: 1, category: "P" },
  { key: "sign_p_51d", code: "Ρ-51δ", codeLatin: "P-51d", file: "p-51d.png", desc: "Υποχρεωτική πορεία ευθεία ή δεξιά", sizeM: 1, category: "P" },
  { key: "sign_p_52", code: "Ρ-52", codeLatin: "P-52", file: "p-52.png", desc: "Υποχρεωτική διακλάδωση ευθεία-αριστερά", sizeM: 1, category: "P" },
  { key: "sign_p_52a", code: "Ρ-52α", codeLatin: "P-52a", file: "p-52a.png", desc: "Υποχρεωτική διακλάδωση ευθεία-δεξιά", sizeM: 1, category: "P" },
  { key: "sign_p_52d", code: "Ρ-52δ", codeLatin: "P-52d", file: "p-52d.png", desc: "Υποχρεωτική πορεία διαγώνια αριστερά", sizeM: 1, category: "P" },
  { key: "sign_p_53", code: "Ρ-53", codeLatin: "P-53", file: "p-53.png", desc: "Υποχρεωτικός κυκλικός κόμβος", sizeM: 1, category: "P" },
  { key: "sign_p_54", code: "Ρ-54", codeLatin: "P-54", file: "p-54.png", desc: "Υποχρεωτικός διάδρομος ποδηλάτων", sizeM: 1, category: "P" },
  { key: "sign_p_55", code: "Ρ-55", codeLatin: "P-55", file: "p-55.png", desc: "Υποχρεωτικός διάδρομος πεζών", sizeM: 1, category: "P" },
  { key: "sign_p_56", code: "Ρ-56", codeLatin: "P-56", file: "p-56.png", desc: "Υποχρεωτικός διάδρομος ιππέων", sizeM: 1, category: "P" },
  { key: "sign_p_57", code: "Ρ-57", codeLatin: "P-57", file: "p-57.png", desc: "Ελάχιστο όριο ταχύτητας 30 χλμ/ώρα", sizeM: 1, category: "P" },
  { key: "sign_p_58", code: "Ρ-58", codeLatin: "P-58", file: "p-58.png", desc: "Τέλος ελάχιστου ορίου ταχύτητας 30 χλμ/ώρα", sizeM: 1, category: "P" },
  { key: "sign_p_59", code: "Ρ-59", codeLatin: "P-59", file: "p-59.png", desc: "Υποχρεωτική χρήση αλυσίδων χιονιού", sizeM: 1, category: "P" },
  { key: "sign_p_60", code: "Ρ-60", codeLatin: "P-60", file: "p-60.png", desc: "Ανώτατο όριο ταχύτητας 50 χλμ/ώρα", sizeM: 1, category: "P" },
  { key: "sign_p_61", code: "Ρ-61", codeLatin: "P-61", file: "p-61.png", desc: "Συνιστώμενο όριο ταχύτητας 50 χλμ/ώρα", sizeM: 1, category: "P" },
  { key: "sign_p_62", code: "Ρ-62", codeLatin: "P-62", file: "p-62.png", desc: "Τέλος απαγόρευσης κυκλοφορίας φορτηγών", sizeM: 1, category: "P" },
  { key: "sign_p_63", code: "Ρ-63", codeLatin: "P-63", file: "p-63.png", desc: "Απαγόρευση εισόδου σε οχήματα βάρους άνω των 3 τόνων", sizeM: 1, category: "P" },
  { key: "sign_p_64", code: "Ρ-64", codeLatin: "P-64", file: "p-64.png", desc: "Απαγόρευση κυκλοφορίας οχημάτων με επικίνδυνο φορτίο", sizeM: 1, category: "P" },
  { key: "sign_p_65", code: "Ρ-65", codeLatin: "P-65", file: "p-65.png", desc: "Υποχρεωτικός διαχωρισμένος διάδρομος ποδηλάτων και πεζών", sizeM: 1, category: "P" },
  { key: "sign_p_66", code: "Ρ-66", codeLatin: "P-66", file: "p-66.png", desc: "Υποχρεωτικός κοινός διάδρομος ποδηλάτων και πεζών", sizeM: 1, category: "P" },
  { key: "sign_p_67", code: "Ρ-67", codeLatin: "P-67", file: "p-67.png", desc: "Λωρίδα λεωφορείων", sizeM: 1, category: "P" },
  { key: "sign_p_68", code: "Ρ-68", codeLatin: "P-68", file: "p-68.png", desc: "Απαγόρευση στάθμευσης λεωφορείων", sizeM: 1, category: "P" },
  { key: "sign_p_69", code: "Ρ-69", codeLatin: "P-69", file: "p-69.png", desc: "Θέση στάθμευσης με ειδική κάρτα", sizeM: 1, category: "P" },
  { key: "sign_p_70", code: "Ρ-70", codeLatin: "P-70", file: "p-70.png", desc: "Θέση στάθμευσης ταξί", sizeM: 1, category: "P" },
  { key: "sign_p_71", code: "Ρ-71", codeLatin: "P-71", file: "p-71.png", desc: "Θέση στάθμευσης ΑμεΑ", sizeM: 1, category: "P" },
  { key: "sign_p_72", code: "Ρ-72", codeLatin: "P-72", file: "p-72.png", desc: "Θέση στάθμευσης με πινακίδα κυκλοφορίας", sizeM: 1, category: "P" },
  { key: "sign_k_1a", code: "Κ-1α", codeLatin: "K-1a", file: "k-1a.png", desc: "Επικίνδυνη στροφή αριστερά", sizeM: 1, category: "K" },
  { key: "sign_k_1d", code: "Κ-1δ", codeLatin: "K-1d", file: "k-1d.png", desc: "Επικίνδυνη στροφή δεξιά", sizeM: 1, category: "K" },
  { key: "sign_k_2a", code: "Κ-2α", codeLatin: "K-2a", file: "k-2a.png", desc: "Διαδοχικές επικίνδυνες στροφές, πρώτη αριστερά", sizeM: 1, category: "K" },
  { key: "sign_k_2d", code: "Κ-2δ", codeLatin: "K-2d", file: "k-2d.png", desc: "Διαδοχικές επικίνδυνες στροφές, πρώτη δεξιά", sizeM: 1, category: "K" },
  { key: "sign_k_3", code: "Κ-3", codeLatin: "K-3", file: "k-3.png", desc: "Επικίνδυνη ανηφόρα", sizeM: 1, category: "K" },
  { key: "sign_k_4", code: "Κ-4", codeLatin: "K-4", file: "k-4.png", desc: "Επικίνδυνη κατηφόρα", sizeM: 1, category: "K" },
  { key: "sign_k_5", code: "Κ-5", codeLatin: "K-5", file: "k-5.png", desc: "Στένωση οδοστρώματος και από τις δύο πλευρές", sizeM: 1, category: "K" },
  { key: "sign_k_6a", code: "Κ-6α", codeLatin: "K-6a", file: "k-6a.png", desc: "Στένωση οδοστρώματος δεξιά", sizeM: 1, category: "K" },
  { key: "sign_k_6d", code: "Κ-6δ", codeLatin: "K-6d", file: "k-6d.png", desc: "Στένωση οδοστρώματος αριστερά", sizeM: 1, category: "K" },
  { key: "sign_k_7", code: "Κ-7", codeLatin: "K-7", file: "k-7.png", desc: "Κινητή γέφυρα", sizeM: 1, category: "K" },
  { key: "sign_k_8", code: "Κ-8", codeLatin: "K-8", file: "k-8.png", desc: "Επικίνδυνο άκρο οδοστρώματος / γκρεμός", sizeM: 1, category: "K" },
  { key: "sign_k_9", code: "Κ-9", codeLatin: "K-9", file: "k-9.png", desc: "Ανώμαλο οδόστρωμα (καμπούρα)", sizeM: 1, category: "K" },
  { key: "sign_k_10", code: "Κ-10", codeLatin: "K-10", file: "k-10.png", desc: "Ανώμαλο οδόστρωμα (σαμαράκι)", sizeM: 1, category: "K" },
  { key: "sign_k_11", code: "Κ-11", codeLatin: "K-11", file: "k-11.png", desc: "Ανώμαλο οδόστρωμα", sizeM: 1, category: "K" },
  { key: "sign_k_12", code: "Κ-12", codeLatin: "K-12", file: "k-12.png", desc: "Ολισθηρό οδόστρωμα", sizeM: 1, category: "K" },
  { key: "sign_k_13", code: "Κ-13", codeLatin: "K-13", file: "k-13.png", desc: "Εκσφενδονισμός χαλικιών", sizeM: 1, category: "K" },
  { key: "sign_k_14", code: "Κ-14", codeLatin: "K-14", file: "k-14.png", desc: "Κατολισθήσεις / πτώση βράχων", sizeM: 1, category: "K" },
  { key: "sign_k_15", code: "Κ-15", codeLatin: "K-15", file: "k-15.png", desc: "Διάβαση πεζών", sizeM: 1, category: "K" },
  { key: "sign_k_16", code: "Κ-16", codeLatin: "K-16", file: "k-16.png", desc: "Παιδιά (σχολείο)", sizeM: 1, category: "K" },
  { key: "sign_k_17", code: "Κ-17", codeLatin: "K-17", file: "k-17.png", desc: "Διερχόμενοι ποδηλάτες", sizeM: 1, category: "K" },
  { key: "sign_k_18", code: "Κ-18", codeLatin: "K-18", file: "k-18.png", desc: "Διερχόμενα κατοικίδια ζώα", sizeM: 1, category: "K" },
  { key: "sign_k_19", code: "Κ-19", codeLatin: "K-19", file: "k-19.png", desc: "Διερχόμενα άγρια ζώα", sizeM: 1, category: "K" },
  { key: "sign_k_20", code: "Κ-20", codeLatin: "K-20", file: "k-20.png", desc: "Εργασίες στην οδό", sizeM: 1, category: "K" },
  { key: "sign_k_21", code: "Κ-21", codeLatin: "K-21", file: "k-21.png", desc: "Φωτεινή σηματοδότηση", sizeM: 1, category: "K" },
  { key: "sign_k_22", code: "Κ-22", codeLatin: "K-22", file: "k-22.png", desc: "Αεροδρόμιο (χαμηλή πτήση αεροσκαφών)", sizeM: 1, category: "K" },
  { key: "sign_k_23", code: "Κ-23", codeLatin: "K-23", file: "k-23.png", desc: "Πλευρικός άνεμος", sizeM: 1, category: "K" },
  { key: "sign_k_24", code: "Κ-24", codeLatin: "K-24", file: "k-24.png", desc: "Αμφίδρομη κυκλοφορία", sizeM: 1, category: "K" },
  { key: "sign_k_25", code: "Κ-25", codeLatin: "K-25", file: "k-25.png", desc: "Κίνδυνος (γενική προειδοποίηση)", sizeM: 1, category: "K" },
  { key: "sign_k_26", code: "Κ-26", codeLatin: "K-26", file: "k-26.png", desc: "Διασταύρωση με ισότιμο δρόμο (Χ)", sizeM: 1, category: "K" },
  { key: "sign_k_27", code: "Κ-27", codeLatin: "K-27", file: "k-27.png", desc: "Διασταύρωση με ισότιμο δρόμο (+)", sizeM: 1, category: "K" },
  { key: "sign_k_28a", code: "Κ-28α", codeLatin: "K-28a", file: "k-28a.png", desc: "Διασταύρωση με δευτερεύοντα δρόμο δεξιά", sizeM: 1, category: "K" },
  { key: "sign_k_28d", code: "Κ-28δ", codeLatin: "K-28d", file: "k-28d.png", desc: "Διασταύρωση με δευτερεύοντα δρόμο αριστερά", sizeM: 1, category: "K" },
  { key: "sign_k_29a", code: "Κ-29α", codeLatin: "K-29a", file: "k-29a.png", desc: "Δρόμος διακλάδωσης δεξιά", sizeM: 1, category: "K" },
  { key: "sign_k_29d", code: "Κ-29δ", codeLatin: "K-29d", file: "k-29d.png", desc: "Δρόμος διακλάδωσης αριστερά", sizeM: 1, category: "K" },
  { key: "sign_k_30", code: "Κ-30", codeLatin: "K-30", file: "k-30.png", desc: "Κυκλικός κόμβος", sizeM: 1, category: "K" },
  { key: "sign_k_31", code: "Κ-31", codeLatin: "K-31", file: "k-31.png", desc: "Ισόπεδη διάβαση σιδηροδρόμου με κιγκλιδώματα", sizeM: 1, category: "K" },
  { key: "sign_k_32", code: "Κ-32", codeLatin: "K-32", file: "k-32.png", desc: "Ισόπεδη διάβαση σιδηροδρόμου χωρίς κιγκλιδώματα", sizeM: 1, category: "K" },
  { key: "sign_k_33_34_35", code: "Κ-33/34/35", codeLatin: "K-33-34-35", file: "k-33-34-35.png", desc: "Απόσταση από ισόπεδη διάβαση σιδηροδρόμου", sizeM: 1, category: "K" },
  { key: "sign_k_36", code: "Κ-36", codeLatin: "K-36", file: "k-36.png", desc: "Ισόπεδη διάβαση σιδηροδρόμου με μία γραμμή", sizeM: 1, category: "K" },
  { key: "sign_k_37", code: "Κ-37", codeLatin: "K-37", file: "k-37.png", desc: "Ισόπεδη διάβαση σιδηροδρόμου με περισσότερες γραμμές", sizeM: 1, category: "K" },
  { key: "sign_pi_27", code: "Π-27", codeLatin: "Pi-27", file: "pi-27.png", desc: "Αρχή αυτοκινητοδρόμου", sizeM: 1, category: "Pi" },
  { key: "sign_pi_27a", code: "Π-27α", codeLatin: "Pi-27a", file: "pi-27a.png", desc: "Τέλος αυτοκινητοδρόμου", sizeM: 1, category: "Pi" },
  { key: "sign_pi_28", code: "Π-28", codeLatin: "Pi-28", file: "pi-28.png", desc: "Πορθμείο (φέρι-μποτ)", sizeM: 1, category: "Pi" },
  { key: "sign_pi_29", code: "Π-29", codeLatin: "Pi-29", file: "pi-29.png", desc: "Πινακίδα αρίθμησης χιλιομέτρων", sizeM: 1, category: "Pi" },
  { key: "sign_pi_30", code: "Π-30", codeLatin: "Pi-30", file: "pi-30.png", desc: "Υποχρεωτική χρήση αλυσίδων χιονιού", sizeM: 1, category: "Pi" },
  { key: "sign_pi_31", code: "Π-31", codeLatin: "Pi-31", file: "pi-31.png", desc: "Χώρος στάθμευσης", sizeM: 1, category: "Pi" },
  { key: "sign_pi_31a", code: "Π-31α", codeLatin: "Pi-31a", file: "pi-31a.png", desc: "Χώρος στάθμευσης σε καθορισμένη ζώνη", sizeM: 1, category: "Pi" },
  { key: "sign_pi_31b", code: "Π-31β", codeLatin: "Pi-31b", file: "pi-31b.png", desc: "Απαγόρευση στάθμευσης σε καθορισμένη ζώνη", sizeM: 1, category: "Pi" },
  { key: "sign_pi_31g", code: "Π-31γ", codeLatin: "Pi-31g", file: "pi-31g.png", desc: "Κατεύθυνση προς χώρο στάθμευσης", sizeM: 1, category: "Pi" },
];

function trafficSign(ppm, def) {
  return fabric.Image.fromURL(`signs/${def.file}`).then((img) => {
    const longSide = Math.max(img.width, img.height);
    const scale = (def.sizeM * ppm) / longSide;
    img.set({ originX: "center", originY: "center", scaleX: scale, scaleY: scale });
    return new fabric.Group([img], {
      originX: "center",
      originY: "center",
      subTargetCheck: false,
    });
  });
}

SIGN_DEFS.forEach((def) => {
  SHAPE_FACTORIES[def.key] = (ppm) => trafficSign(ppm, def);
});

// Injects one palette-item per sign into the existing "Πινακίδες" palette
// section (index.html already declares its <option value="signs">). Runs
// synchronously as shapes.js loads — before sketcher.js's own script runs,
// since script tags execute in document order — so sketcher.js's palette
// wiring (drag/click handlers, search indexing, category filtering) picks
// up these items exactly like the static ones already in the HTML.
// The label only shows the Greek code (Ρ-1) — printing its Latin
// transliteration (P-1) alongside it would look like a bare repeat, since
// Greek Ρ and Latin P are visually identical. The Latin form is still
// searchable: it's a text node too, just tucked into a zero-size span, so
// typing "P-1" still finds "Ρ-1" without showing "Ρ-1 (P-1)" to the eye.
function buildSignPaletteItems() {
  const container = document.getElementById("palette-items");
  const emptyNotice = document.getElementById("palette-empty");
  if (!container) return;
  SIGN_DEFS.forEach((def) => {
    const item = document.createElement("div");
    item.className = "palette-item";
    item.draggable = true;
    item.dataset.shape = def.key;
    item.dataset.categories = "signs";
    item.title = `${def.code} — ${def.desc}`;
    const img = document.createElement("img");
    img.src = `signs/${def.file}`;
    img.alt = "";
    item.appendChild(img);
    item.appendChild(document.createTextNode(`${def.code} — ${def.desc} `));
    const latinAlias = document.createElement("span");
    latinAlias.style.cssText = "position:absolute;width:0;height:0;overflow:hidden;";
    latinAlias.textContent = def.codeLatin;
    item.appendChild(latinAlias);
    container.insertBefore(item, emptyNotice);
  });
}
buildSignPaletteItems();
