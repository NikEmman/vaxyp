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

// Shared by roadSegment() and oneWayRoad(): the fill slab plus the
// dashed dividers between lanes (n lanes need n-1 dividers either way).
// Deliberately open-ended: only the left/right edges are stroked, not the
// top/bottom — so two segments butted end-to-end read as one continuous
// road instead of two boxes with a seam between them.
function roadBase(ppm, lanes) {
  const w = lanes * ROAD_LANE_WIDTH * ppm;
  const h = ROAD_LENGTH_M * ppm;

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
  for (let i = 1; i < lanes; i++) {
    const x = -w / 2 + i * ROAD_LANE_WIDTH * ppm;
    parts.push(laneMarking(x, -h / 2, x, h / 2, true));
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

function roadSegment(ppm, lanes) {
  const { parts, w, h } = roadBase(ppm, lanes);
  const group = new fabric.Group(parts, {
    originX: "center",
    originY: "center",
    subTargetCheck: false,
  });
  return setRoadConnections(group, [...roadEndConnections(w, h), ...roadSideConnections(w)]);
}

function createRoad2(ppm) {
  return roadSegment(ppm, 2);
}

function createRoad3(ppm) {
  return roadSegment(ppm, 3);
}

// A shaft + solid arrowhead centered at x, pointing toward the top of the
// shape (fabric.Triangle's apex faces up by default, so no rotation needed).
function directionArrow(x, h, ppm) {
  const headLen = 1.4 * ppm;
  const headWidth = 1.1 * ppm;
  const totalLen = h * 0.5;
  const topY = -totalLen / 2;

  const shaft = new fabric.Line([x, totalLen / 2, x, topY + headLen], {
    stroke: LINE_COLOR,
    strokeWidth: 2,
    selectable: false,
    evented: false,
  });
  const head = new fabric.Triangle({
    width: headWidth,
    height: headLen,
    left: x,
    top: topY,
    originX: "center",
    originY: "top",
    fill: LINE_COLOR,
    selectable: false,
    evented: false,
  });
  return [shaft, head];
}

// One-way road: same slab/dividers as roadSegment(), plus one direction
// arrow centered in each lane (all lanes flow the same way).
function oneWayRoad(ppm, lanes) {
  const { parts, w, h } = roadBase(ppm, lanes);
  for (let i = 0; i < lanes; i++) {
    const cx = -w / 2 + (i + 0.5) * ROAD_LANE_WIDTH * ppm;
    parts.push(...directionArrow(cx, h, ppm));
  }
  const group = new fabric.Group(parts, {
    originX: "center",
    originY: "center",
    subTargetCheck: false,
  });
  return setRoadConnections(group, [...roadEndConnections(w, h), ...roadSideConnections(w)]);
}

function createOneWay1(ppm) {
  return oneWayRoad(ppm, 1);
}

function createOneWay2(ppm) {
  return oneWayRoad(ppm, 2);
}

function createIntersection(ppm) {
  const sizeM = 9; // square patch where two roads cross
  const s = sizeM * ppm;

  // No border at all: an intersection connects to a road segment on all
  // four sides, so any stroked edge would just be a seam against whatever
  // butts up against it.
  const base = new fabric.Rect({
    width: s,
    height: s,
    fill: SHAPE_FILL,
    originX: "center",
    originY: "center",
    selectable: false,
    evented: false,
  });

  const parts = [
    base,
    laneMarking(0, -s / 2, 0, s / 2, true),
    laneMarking(-s / 2, 0, s / 2, 0, true),
  ];

  const group = new fabric.Group(parts, { originX: "center", originY: "center", subTargetCheck: false });
  return setRoadConnections(group, [
    { x: 0, y: -s / 2, nx: 0, ny: -1 },
    { x: 0, y: s / 2, nx: 0, ny: 1 },
    { x: -s / 2, y: 0, nx: -1, ny: 0 },
    { x: s / 2, y: 0, nx: 1, ny: 0 },
  ]);
}

function createTurn(ppm) {
  // Quarter-annulus: a road that bends 90°, built from an SVG arc path.
  const laneWidth = 3;
  const lanes = 2;
  const innerR = 4 * ppm;
  const outerR = innerR + lanes * laneWidth * ppm;
  const midR = (innerR + outerR) / 2;
  // Draw the arc in a corner (0,0)-(outerR,outerR), then shift every point by
  // -outerR/2 so the path's own bounding box — and the group Fabric derives
  // from it — is centered on the origin, same as the other shape factories.
  const c = outerR / 2;

  const d = [
    `M ${innerR - c} ${-c}`,
    `L ${outerR - c} ${-c}`,
    `A ${outerR} ${outerR} 0 0 1 ${-c} ${outerR - c}`,
    `L ${-c} ${innerR - c}`,
    `A ${innerR} ${innerR} 0 0 0 ${innerR - c} ${-c}`,
    "Z",
  ].join(" ");

  // Fill only, no stroke: the outline is drawn separately below so the two
  // straight ends (top and left) — the faces that connect to a straight
  // road segment — stay open instead of capped.
  const fill = new fabric.Path(d, {
    fill: SHAPE_FILL,
    selectable: false,
    evented: false,
  });

  const outerArc = new fabric.Path(
    `M ${outerR - c} ${-c} A ${outerR} ${outerR} 0 0 1 ${-c} ${outerR - c}`,
    { fill: "", stroke: LINE_COLOR, strokeWidth: 2, selectable: false, evented: false }
  );
  const innerArc = new fabric.Path(
    `M ${innerR - c} ${-c} A ${innerR} ${innerR} 0 0 1 ${-c} ${innerR - c}`,
    { fill: "", stroke: LINE_COLOR, strokeWidth: 2, selectable: false, evented: false }
  );

  const centerline = new fabric.Path(
    `M ${midR - c} ${-c} A ${midR} ${midR} 0 0 1 ${-c} ${midR - c}`,
    { fill: "", stroke: LINE_COLOR, strokeWidth: 2, strokeDashArray: [10, 8], selectable: false, evented: false }
  );

  const group = new fabric.Group([fill, outerArc, innerArc, centerline], {
    originX: "center",
    originY: "center",
    subTargetCheck: false,
  });
  // The two straight caps: "north" (continues up, toward a road that feeds
  // into the turn) and "west" (continues left, where the turn exits).
  return setRoadConnections(group, [
    { x: midR - c, y: -c, nx: 0, ny: -1 },
    { x: -c, y: midR - c, nx: -1, ny: 0 },
  ]);
}

function createCrosswalk(ppm) {
  const widthM = 6; // across the road
  const lengthM = 3; // along the direction of travel
  const w = widthM * ppm;
  const h = lengthM * ppm;
  const stripeCount = 6;
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

  return new fabric.Group(parts, { originX: "center", originY: "center", subTargetCheck: false });
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
  road3: createRoad3,
  oneway1: createOneWay1,
  oneway2: createOneWay2,
  intersection: createIntersection,
  turn: createTurn,
  crosswalk: createCrosswalk,
  car: createCar,
  truck: createTruck,
  text: () => createText(),
};
