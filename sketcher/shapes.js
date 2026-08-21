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

function roadSegment(ppm, lanes) {
  const laneWidth = 3; // meters
  const lengthM = 20;
  const w = lanes * laneWidth * ppm;
  const h = lengthM * ppm;

  const base = new fabric.Rect({
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

  const parts = [base];
  for (let i = 1; i < lanes; i++) {
    const x = -w / 2 + i * laneWidth * ppm;
    parts.push(laneMarking(x, -h / 2, x, h / 2, true));
  }

  return new fabric.Group(parts, {
    originX: "center",
    originY: "center",
    subTargetCheck: false,
  });
}

function createRoad2(ppm) {
  return roadSegment(ppm, 2);
}

function createRoad3(ppm) {
  return roadSegment(ppm, 3);
}

function createIntersection(ppm) {
  const sizeM = 9; // square patch where two roads cross
  const s = sizeM * ppm;

  const base = new fabric.Rect({
    width: s,
    height: s,
    fill: SHAPE_FILL,
    stroke: LINE_COLOR,
    strokeWidth: 2,
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

  return new fabric.Group(parts, { originX: "center", originY: "center", subTargetCheck: false });
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

  const path = new fabric.Path(d, {
    fill: SHAPE_FILL,
    stroke: LINE_COLOR,
    strokeWidth: 2,
    selectable: false,
    evented: false,
  });

  const centerline = new fabric.Path(
    `M ${midR - c} ${-c} A ${midR} ${midR} 0 0 1 ${-c} ${midR - c}`,
    { fill: "", stroke: LINE_COLOR, strokeWidth: 2, strokeDashArray: [10, 8], selectable: false, evented: false }
  );

  return new fabric.Group([path, centerline], {
    originX: "center",
    originY: "center",
    subTargetCheck: false,
  });
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
  intersection: createIntersection,
  turn: createTurn,
  crosswalk: createCrosswalk,
  car: createCar,
  truck: createTruck,
  text: () => createText(),
};
