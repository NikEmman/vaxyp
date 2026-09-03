// ── Shape factories ──────────────────────────────────────────────
// Every factory takes `ppm` (pixels per meter) and returns a Fabric
// object/group sized in real-world meters, centered on its own origin so
// Fabric's rotate handle spins it in place. Dimensions are approximate but
// plausible (car ~4.4x1.8m, lane ~3m wide, etc).
//
// Style is deliberately monochrome, like a hand-sketched accident report.
// SHAPE_FILL/LINE_COLOR are `let`: sketcher.js reassigns them for the
// light/dark theme, and factories read them at call time so new shapes
// always pick up the current palette.
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

// Shared by roadSegment() and oneWayRoad(). Only the left/right edges are
// stroked, not top/bottom, so butted segments read as one continuous road.
//
// `dividerStyle`: "dashed" (default, passing allowed), "double-solid" (no
// passing), or "passing-zone" (solid + dashed straddling the divider —
// solid on the lower-x side, so that lane can't pass, the other can).
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

// `points`: local (pre-rotation, centered-origin) snap points, each a
// position plus the outward unit normal. sketcher.js reads this during
// drag to align matching connection points between objects.
function setRoadConnections(group, points) {
  group.roadConnections = points;
  return group;
}

// sketcher.js reads isGroundMarking to keep markings layered above every
// road piece regardless of placement order.
function markAsGroundMarking(obj) {
  obj.isGroundMarking = true;
  return obj;
}

// Three snap points per end (center, left, right) instead of one: lets a
// narrower road land flush against either side of a wider one (e.g. a
// one-way lane merging as the right-hand lane) instead of only dead-center.
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

// Midpoint of each long edge, for a perpendicular T-junction plug-in.
// `side: true` distinguishes these from end connections: sketcher.js nudges
// a side join a couple px into the through-road so its fill hides the
// through-road's edge line, instead of landing flush like an end-to-end join.
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

function createRoad2DoubleLine(ppm, lengthM) {
  return roadSegment(ppm, 2, lengthM, "double-solid");
}

function createRoad2PassingZone(ppm, lengthM) {
  return roadSegment(ppm, 2, lengthM, "passing-zone");
}

function createRoad3(ppm, lengthM) {
  return roadSegment(ppm, 3, lengthM);
}

// Real standard-gauge track (1.435m) drawn to scale, with sleepers at
// realistic spacing — no fill, so it reads as an overlay when dropped
// across a road for a level crossing.
const TRAIN_GAUGE_M = 1.435;
const TRAIN_SLEEPER_OVERHANG_M = 0.35;
const TRAIN_SLEEPER_SPACING_M = 0.6;

function createTrainTracks(ppm, lengthM = ROAD_LENGTH_M) {
  const h = lengthM * ppm;
  const railX = (TRAIN_GAUGE_M * ppm) / 2;
  const sleeperHalfW = railX + TRAIN_SLEEPER_OVERHANG_M * ppm;
  const sleeperSpacing = TRAIN_SLEEPER_SPACING_M * ppm;

  const parts = [laneMarking(-railX, -h / 2, -railX, h / 2, false), laneMarking(railX, -h / 2, railX, h / 2, false)];
  for (let y = -h / 2; y <= h / 2; y += sleeperSpacing) {
    parts.push(laneMarking(-sleeperHalfW, y, sleeperHalfW, y, false));
  }

  const group = new fabric.Group(parts, {
    originX: "center",
    originY: "center",
    subTargetCheck: false,
  });
  return markAsGroundMarking(group);
}

// A pair of tire skid marks: thick, slightly irregular streaks that fade in
// and out like rubber laid down under hard braking, instead of crisp
// straight lines. Sized by the same length slider as straight road pieces.
const SKID_TRACK_WIDTH_M = 1.6; // typical distance between a car's tires
const SKID_MARK_WIDTH_PX = 5;
const SKID_SEGMENTS = 12;

function skidMark(xOffset, h, seed) {
  const parts = [];
  for (let i = 0; i < SKID_SEGMENTS; i++) {
    const t0 = i / SKID_SEGMENTS;
    const t1 = (i + 1) / SKID_SEGMENTS;
    const y0 = -h / 2 + h * t0;
    const y1 = -h / 2 + h * t1;
    const tMid = (t0 + t1) / 2;
    // fades in quickly as the tire locks up, stays dark, fades out slower
    // toward the stop
    const fade = Math.min(1, tMid / 0.15, (1 - tMid) / 0.3);
    const jitter = Math.sin(i * 2.3 + seed) * 1.5;
    parts.push(
      new fabric.Line([xOffset + jitter, y0, xOffset + jitter, y1], {
        stroke: LINE_COLOR,
        strokeWidth: SKID_MARK_WIDTH_PX,
        strokeLineCap: "round",
        opacity: Math.max(0.12, fade),
        selectable: false,
        evented: false,
      }),
    );
  }
  return parts;
}

function createSkidMarks(ppm, lengthM = ROAD_LENGTH_M) {
  const h = lengthM * ppm;
  const trackX = (SKID_TRACK_WIDTH_M * ppm) / 2;
  const parts = [...skidMark(-trackX, h, 0), ...skidMark(trackX, h, 10)];
  const group = new fabric.Group(parts, {
    originX: "center",
    originY: "center",
    subTargetCheck: false,
  });
  return markAsGroundMarking(group);
}

// One lane, no direction drawn on the piece itself — pair with a "Βέλος
// Κατεύθυνσης" ground marking to show which way traffic flows.
function createOneWay(ppm, lengthM) {
  const { parts, w, h } = roadBase(ppm, 1, lengthM);
  const group = new fabric.Group(parts, {
    originX: "center",
    originY: "center",
    subTargetCheck: false,
  });
  return setRoadConnections(group, [...roadEndConnections(w, h), ...roadSideConnections(w)]);
}

// Clips parallel 45° lines (y - x = c, stepping by `spacing`) to a CONVEX
// polygon's boundary, by intersecting each line against every edge and
// keeping the segment between the two crossings. Shared by every hatched
// shape below (median strip, traffic islands, obstacles).
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

// Same hatch family as hatchLinesForPolygon, solved against an ellipse's
// equation instead of walked edge-by-edge (no straight edges to walk).
// cMax is the tangent-line offset for a slope-1 line on an axis-aligned
// ellipse (c^2 = rx^2 + ry^2).
function hatchLinesForEllipse(rx, ry, spacing) {
  const cMax = Math.sqrt(rx * rx + ry * ry);
  const A = 1 / (rx * rx) + 1 / (ry * ry);

  const segments = [];
  for (let c = -cMax; c <= cMax; c += spacing) {
    const B = (2 * c) / (ry * ry);
    const C = (c * c) / (ry * ry) - 1;
    const disc = B * B - 4 * A * C;
    if (disc <= 0) continue; // tangent or entirely outside — no real chord
    const sqrtDisc = Math.sqrt(disc);
    const x1 = (-B - sqrtDisc) / (2 * A);
    const x2 = (-B + sqrtDisc) / (2 * A);
    segments.push([x1, x1 + c, x2, x2 + c]);
  }
  return segments;
}

function hatchGroupEllipse(rx, ry, spacing) {
  return hatchLinesForEllipse(rx, ry, spacing).map(
    (seg) =>
      new fabric.Line(seg, {
        stroke: LINE_COLOR,
        strokeWidth: 1,
        selectable: false,
        evented: false,
      })
  );
}

// Non-drivable divider: same open-ended shape as a road piece so it slots
// in-line between segments, but no roadSideConnections (nothing plugs into
// its side). Hatched, not plain-filled, to read as "not pavement".
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

// Traffic islands: standalone, placed and rotated freely (unlike the
// median strip). No roadConnections; every edge is closed, none left open.
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

// Generic obstacles (circle, oval, square, rectangle): stand-ins for a
// pole, bin, planter, boulder, etc. — anything not worth its own shape.
// Same hatched-solid look as the traffic islands above.
const OBSTACLE_HATCH_SPACING_M = 0.5;
const OBSTACLE_CIRCLE_R_M = 0.75;
const OBSTACLE_OVAL_RX_M = 1;
const OBSTACLE_OVAL_RY_M = 0.6;
const OBSTACLE_SQUARE_SIDE_M = 1.5;
const OBSTACLE_RECT_W_M = 2.5;
const OBSTACLE_RECT_H_M = 1.2;

function createObstacleCircle(ppm) {
  const r = OBSTACLE_CIRCLE_R_M * ppm;
  const fill = new fabric.Circle({
    radius: r,
    fill: SHAPE_FILL,
    stroke: LINE_COLOR,
    strokeWidth: 2,
    originX: "center",
    originY: "center",
    selectable: false,
    evented: false,
  });
  const hatch = hatchGroupEllipse(r, r, OBSTACLE_HATCH_SPACING_M * ppm);

  return new fabric.Group([fill, ...hatch], {
    originX: "center",
    originY: "center",
    subTargetCheck: false,
  });
}

function createObstacleOval(ppm) {
  const rx = OBSTACLE_OVAL_RX_M * ppm;
  const ry = OBSTACLE_OVAL_RY_M * ppm;
  const fill = new fabric.Ellipse({
    rx,
    ry,
    fill: SHAPE_FILL,
    stroke: LINE_COLOR,
    strokeWidth: 2,
    originX: "center",
    originY: "center",
    selectable: false,
    evented: false,
  });
  const hatch = hatchGroupEllipse(rx, ry, OBSTACLE_HATCH_SPACING_M * ppm);

  return new fabric.Group([fill, ...hatch], {
    originX: "center",
    originY: "center",
    subTargetCheck: false,
  });
}

function createObstacleSquare(ppm) {
  const s = OBSTACLE_SQUARE_SIDE_M * ppm;
  const fill = new fabric.Rect({
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
  const points = [
    { x: -s / 2, y: -s / 2 },
    { x: s / 2, y: -s / 2 },
    { x: s / 2, y: s / 2 },
    { x: -s / 2, y: s / 2 },
  ];
  const hatch = hatchGroup(points, OBSTACLE_HATCH_SPACING_M * ppm);

  return new fabric.Group([fill, ...hatch], {
    originX: "center",
    originY: "center",
    subTargetCheck: false,
  });
}

function createObstacleRect(ppm) {
  const w = OBSTACLE_RECT_W_M * ppm;
  const h = OBSTACLE_RECT_H_M * ppm;
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
  const hatch = hatchGroup(points, OBSTACLE_HATCH_SPACING_M * ppm);

  return new fabric.Group([fill, ...hatch], {
    originX: "center",
    originY: "center",
    subTargetCheck: false,
  });
}

// Acceleration/merge lane: parallel run (RUN_M) then tapers to a point
// (TAPER_M), like a highway on-ramp merging into the mainline. The taper's
// outer edge is solid (pavement edge); the flush edge is dashed (traffic
// crosses it to merge) and carries the one `side` connection point.
//
// `mirrored` flips which side the flush edge is on — needs a true mirror,
// not a rotation, since rotation preserves handedness and the flush edge
// would stay on the same side relative to the direction of travel.
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

// Bounding-box center of a circular sector (radius rInner..rOuter, sweep
// 0..bendDeg). A sweep crossing a cardinal angle (90°, 180°...) bulges
// further out than its two endpoints alone, so those angles must be
// checked too, not just entry/exit.
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

// A road that bends `bendDeg` degrees over `lanes` lanes: an annulus
// sector, recentered via sectorBBoxCenter so it rotates in place.
// `dividerStyle` mirrors roadBase()'s, with solid on the inner-radius side.
function turn(ppm, bendDeg, lanes = 2, dividerStyle = "dashed") {
  const laneWidth = 3;
  const innerR = 4 * ppm;
  const outerR = innerR + lanes * laneWidth * ppm;
  const midR = (innerR + outerR) / 2; // where a connecting road's centerline meets it — not necessarily a lane divider once lanes != 2

  const rad = (bendDeg * Math.PI) / 180;
  const off = sectorBBoxCenter(bendDeg, innerR, outerR);
  const pt = (r, a) => ({ x: r * Math.cos(a) - off.x, y: r * Math.sin(a) - off.y });
  // Arc stroke at radius r, sweeping entry (0) to exit (rad).
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

  // Fill only — outline is separate below, so entry/exit stay uncapped.
  const fill = new fabric.Path(d, {
    fill: SHAPE_FILL,
    selectable: false,
    evented: false,
  });

  const arcLine = (r, dashed) =>
    new fabric.Path(arcPath(r), {
      fill: "",
      stroke: LINE_COLOR,
      strokeWidth: 2,
      strokeDashArray: dashed ? [10, 8] : null,
      selectable: false,
      evented: false,
    });

  const outerArc = arcLine(outerR, false);
  const innerArc = arcLine(innerR, false);

  const parts = [fill, outerArc, innerArc];
  const gap = (DOUBLE_LINE_GAP_M * ppm) / 2;
  for (let i = 1; i < lanes; i++) {
    const dividerR = innerR + i * laneWidth * ppm;
    if (dividerStyle === "double-solid") {
      parts.push(arcLine(dividerR - gap, false));
      parts.push(arcLine(dividerR + gap, false));
    } else if (dividerStyle === "passing-zone") {
      parts.push(arcLine(dividerR - gap, false));
      parts.push(arcLine(dividerR + gap, true));
    } else {
      parts.push(arcLine(dividerR, true));
    }
  }

  const group = new fabric.Group(parts, {
    originX: "center",
    originY: "center",
    subTargetCheck: false,
  });
  // Entry normal points backward (incoming road's direction); exit normal
  // points forward, in the bent direction.
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
  return turn(ppm, 45, 2, "double-solid");
}

function createTurn90_2Double(ppm) {
  return turn(ppm, 90, 2, "double-solid");
}

function createTurn135_2Double(ppm) {
  return turn(ppm, 135, 2, "double-solid");
}

function createTurn45_2PassingZone(ppm) {
  return turn(ppm, 45, 2, "passing-zone");
}

function createTurn90_2PassingZone(ppm) {
  return turn(ppm, 90, 2, "passing-zone");
}

function createTurn135_2PassingZone(ppm) {
  return turn(ppm, 135, 2, "passing-zone");
}

// Ring of `lanes` lanes around a solid central island (fixed size across
// all variants), with eight connectors every 45° for roads to plug in.
const ROUNDABOUT_INNER_M = 5;

function roundabout(ppm, lanes) {
  const innerR = ROUNDABOUT_INNER_M * ppm;
  const outerR = innerR + lanes * ROAD_LANE_WIDTH * ppm;

  // Pavement disk with the island painted on top to punch out the center —
  // two opaque overlapping shapes render identically to a true annulus.
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

  // Eight ports at the ring's outer rim, tagged `side` like a T-junction:
  // the outer edge is one continuous circle (no notch), so overlap +
  // bring-to-front is what hides the seam, not the geometry.
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

// Crosswalk width scales with lane count; stripe/gap period (STRIPE_PERIOD_M)
// stays fixed, so a wider crossing gets more stripes, not fatter ones.
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
// Painted-on-road markings (arrows etc.), separate from road pieces. No
// roadConnections — decorative, not part of the snap graph.
// Bold, solid-filled paint (not a thin outline). ARROW_MAX_WIDTH_M is the
// sideways footprint every arrow variant fits within.
const ARROW_MAX_WIDTH_M = ROAD_LANE_WIDTH / 2;
const ARROW_RIBBON_W = 0.35; // width of the painted stripe itself
const ARROW_HEAD_W = 1.3; // width of the flared arrowhead
const ARROW_HEAD_LEN = 1.0;

// A rect stretched/rotated to span p1→p2 at the given width — a "thick
// line segment". Bent arrows are built from a few of these overlapping
// instead of one offset-polygon outline; same opaque fill makes the joints
// seamless.
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

// Arrowhead triangle with its apex at `tip`, facing `angleDeg` (0 = up,
// ±90 = sideways). Shared by every marking that ends in an arrowhead.
function arrowHead(tip, angleDeg, headW, headLen) {
  const rad = (angleDeg * Math.PI) / 180;
  // Apex-to-center offset for an up-pointing triangle is (0, -headLen/2),
  // rotated by angleDeg.
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

// "This lane turns left/right": shaft, 45° bend, short reach, flared
// arrowhead rotated ±90°. `dir: -1` bends left, `dir: 1` right.
function turnArrowMarking(ppm, dir) {
  const ribbonW = ARROW_RIBBON_W * ppm;
  const headW = ARROW_HEAD_W * ppm;
  const headLen = ARROW_HEAD_LEN * ppm;
  const shaftLen = 2.2 * ppm;
  // Sideways footprint budget: the rotated head's length, plus the shaft's
  // own ribbon thickness bleeding past center on the opposite side.
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

// "This lane goes straight OR turns": one base shaft forking into a
// straight branch and a bent branch, each with a smaller arrowhead than
// the single-direction arrows (two branches share the width budget).
// `dir: -1` forks left, `dir: 1` right.
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

// Traffic signal head (Φωτεινός σηματοδότης), vector-drawn — no catalog
// photo exists for this one. Housing only, no pole.
function createTrafficLight(ppm) {
  const headW = 0.45;
  const headH = 1.1;

  const headTop = (-headH / 2) * ppm;
  const headHpx = headH * ppm;
  const headWpx = headW * ppm;

  const housing = new fabric.Rect({
    left: 0,
    top: headTop,
    width: headWpx,
    height: headHpx,
    rx: headWpx * 0.18,
    ry: headWpx * 0.18,
    fill: SHAPE_FILL,
    stroke: LINE_COLOR,
    strokeWidth: 2,
    originX: "center",
    originY: "top",
    selectable: false,
    evented: false,
  });

  const cellH = headHpx / 3;
  const dividers = [1, 2].map((i) =>
    laneMarking(-headWpx / 2, headTop + cellH * i, headWpx / 2, headTop + cellH * i, false)
  );

  const lampR = Math.min(cellH, headWpx) * 0.32;
  const lamps = [0, 1, 2].map(
    (i) =>
      new fabric.Circle({
        left: 0,
        top: headTop + cellH * (i + 0.5),
        radius: lampR,
        fill: "",
        stroke: LINE_COLOR,
        strokeWidth: 1.5,
        originX: "center",
        originY: "center",
        selectable: false,
        evented: false,
      })
  );

  return new fabric.Group([housing, ...dividers, ...lamps], {
    originX: "center",
    originY: "center",
    subTargetCheck: false,
  });
}

function createText() {
  return new fabric.Textbox("Κείμενο", {
    fontSize: 18,
    fill: LINE_COLOR,
    editable: true,
  });
}

// A tree seen from above: trunk cross-section with buttress roots, top-down
// like the roads/vehicles (unlike the pictorial signs/traffic light).
// Root angles/lengths are irregular on purpose — an even ring reads as a
// compass rose, not a tree.
function createTree(ppm) {
  const trunkR = 0.35; // meters
  const trunkRpx = trunkR * ppm;

  const roots = [
    { angleDeg: -100, lengthM: 0.4, halfWidthM: 0.16 },
    { angleDeg: -5, lengthM: 0.5, halfWidthM: 0.13 },
    { angleDeg: 95, lengthM: 0.35, halfWidthM: 0.15 },
    { angleDeg: 190, lengthM: 0.45, halfWidthM: 0.14 },
  ].map(({ angleDeg, lengthM, halfWidthM }) => {
    const theta = (angleDeg * Math.PI) / 180;
    const dx = Math.cos(theta);
    const dy = Math.sin(theta);
    const px = -dy; // perpendicular to the root's direction
    const py = dx;
    const baseR = trunkRpx * 0.85; // starts inside the trunk circle, so the join is hidden under it
    const tipR = trunkRpx + lengthM * ppm;
    const baseHalfWidthPx = halfWidthM * ppm;
    return new fabric.Polygon(
      [
        { x: baseR * dx + baseHalfWidthPx * px, y: baseR * dy + baseHalfWidthPx * py },
        { x: tipR * dx, y: tipR * dy },
        { x: baseR * dx - baseHalfWidthPx * px, y: baseR * dy - baseHalfWidthPx * py },
      ],
      { fill: SHAPE_FILL, stroke: LINE_COLOR, strokeWidth: 2, selectable: false, evented: false }
    );
  });

  const trunk = new fabric.Circle({
    radius: trunkRpx,
    fill: SHAPE_FILL,
    stroke: LINE_COLOR,
    strokeWidth: 2,
    originX: "center",
    originY: "center",
    selectable: false,
    evented: false,
  });

  return new fabric.Group([...roots, trunk], {
    originX: "center",
    originY: "center",
    subTargetCheck: false,
  });
}

const SHAPE_FACTORIES = {
  road2: createRoad2,
  road2doubleline: createRoad2DoubleLine,
  road2passingzone: createRoad2PassingZone,
  road3: createRoad3,
  traintracks: createTrainTracks,
  oneway: createOneWay,
  medianstrip: createMedianStrip,
  trafficislandrect: createTrafficIslandRect,
  trafficislandtriangle: createTrafficIslandTriangle,
  obstacle1: createObstacleCircle,
  obstacle2: createObstacleOval,
  obstacle3: createObstacleSquare,
  obstacle4: createObstacleRect,
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
  turn45_2passingzone: createTurn45_2PassingZone,
  turn90_2passingzone: createTurn90_2PassingZone,
  turn135_2passingzone: createTurn135_2PassingZone,
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
  trafficlight: createTrafficLight,
  tree: createTree,
  skidmarks: createSkidMarks,
  text: () => createText(),
};

// ── Traffic signs (Πινακίδες) ────────────────────────────────────
// Cropped from a Greek traffic-sign catalog, one PNG per sign under
// sketcher/signs/, named by official code (e.g. "p-1.png" for Ρ-1). Raster,
// not vector — loaded via fabric.Image.fromURL, async in Fabric v6, so each
// factory returns a Promise (addShape() in sketcher.js wraps every factory
// call in Promise.resolve().then() to handle both cases uniformly).
// `sizeM`: on-canvas size of the sign's longer side, in meters; aspect
// ratio is preserved, never stretched to a square.
//
// Exception: Ρ-32/Ρ-37 (speed limit / end of limit) are vector-drawn
// instead — see SPEED_SIGN_DEFS further down.
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
  // Ρ-32/Ρ-37: see SPEED_SIGN_DEFS below.
  { key: "sign_p_33", code: "Ρ-33", codeLatin: "P-33", file: "p-33.png", desc: "Απαγόρευση χρήσης κόρνας", sizeM: 1, category: "P" },
  { key: "sign_p_34", code: "Ρ-34", codeLatin: "P-34", file: "p-34.png", desc: "Τελωνείο", sizeM: 1, category: "P" },
  { key: "sign_p_35", code: "Ρ-35", codeLatin: "P-35", file: "p-35.png", desc: "Σταθμός διοδίων", sizeM: 1, category: "P" },
  { key: "sign_p_36", code: "Ρ-36", codeLatin: "P-36", file: "p-36.png", desc: "Τέλος απαγόρευσης προσπέρασης", sizeM: 1, category: "P" },
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

// Injects one palette-item per sign into the "Πινακίδες" section (index.html
// declares <option value="signs">). Runs before sketcher.js's palette
// wiring, since script tags execute in document order.
// Label shows only the Greek code (Ρ-1 and Latin P-1 look identical, so
// printing both would look like a repeat); the Latin form is still
// searchable via a zero-size span.
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

// ── Speed signs (Ρ-32 / Ρ-37) ────────────────────────────────────
// Vector-drawn, not photo crops: Ρ-32 is a red-ringed white circle with
// the number, Ρ-37 the same with a diagonal cancel bar. Parametric so
// every limit Greece posts (10-130) is covered, not just the one photo.
const SPEED_SIGN_VALUES = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130];
const SPEED_SIGN_SIZE_M = 1; // matches sizeM used by the photo signs above
const SPEED_SIGN_RED = "#cc0000";
const SPEED_SIGN_INK = "#1b1f24";
const SPEED_SIGN_STRIPE = "#6b6f76";

// Fixed colors, not SHAPE_FILL/LINE_COLOR: like the photo signs, these
// don't follow the light/dark theme.
function speedSignNumber(value, r) {
  return new fabric.Text(String(value), {
    fontFamily: "Arial, sans-serif",
    fontWeight: "bold",
    fontSize: r * 0.85,
    fill: SPEED_SIGN_INK,
    originX: "center",
    originY: "center",
    selectable: false,
    evented: false,
  });
}

function createSpeedLimitSign(ppm, value) {
  const r = (SPEED_SIGN_SIZE_M * ppm) / 2;
  const ringWidth = r * 0.22;

  const white = new fabric.Circle({
    radius: r,
    fill: "#ffffff",
    originX: "center",
    originY: "center",
    selectable: false,
    evented: false,
  });
  const ring = new fabric.Circle({
    radius: r - ringWidth / 2,
    fill: "",
    stroke: SPEED_SIGN_RED,
    strokeWidth: ringWidth,
    originX: "center",
    originY: "center",
    selectable: false,
    evented: false,
  });

  return new fabric.Group([white, ring, speedSignNumber(value, r)], {
    originX: "center",
    originY: "center",
    subTargetCheck: false,
  });
}

function createEndSpeedLimitSign(ppm, value) {
  const r = (SPEED_SIGN_SIZE_M * ppm) / 2;
  const k = r / Math.SQRT2; // corner-to-corner diagonal endpoints

  const white = new fabric.Circle({
    radius: r,
    fill: "#ffffff",
    stroke: SPEED_SIGN_INK,
    strokeWidth: Math.max(1, r * 0.05),
    originX: "center",
    originY: "center",
    selectable: false,
    evented: false,
  });
  const stripe = new fabric.Line([-k, -k, k, k], {
    stroke: SPEED_SIGN_STRIPE,
    strokeWidth: Math.max(2, r * 0.12),
    selectable: false,
    evented: false,
  });

  return new fabric.Group([white, stripe, speedSignNumber(value, r)], {
    originX: "center",
    originY: "center",
    subTargetCheck: false,
  });
}

const SPEED_SIGN_DEFS = SPEED_SIGN_VALUES.flatMap((value) => [
  {
    key: `sign_p_32_${value}`,
    code: "Ρ-32",
    desc: `Ανώτατο όριο ταχύτητας ${value} χλμ/ώρα`,
    kind: "limit",
    value,
    factory: (ppm) => createSpeedLimitSign(ppm, value),
  },
  {
    key: `sign_p_37_${value}`,
    code: "Ρ-37",
    desc: `Τέλος ορίου ταχύτητας ${value} χλμ/ώρα`,
    kind: "end",
    value,
    factory: (ppm) => createEndSpeedLimitSign(ppm, value),
  },
]);

SPEED_SIGN_DEFS.forEach((def) => {
  SHAPE_FACTORIES[def.key] = def.factory;
});

// Hand-built inline SVG, not buildSignPaletteItems()'s PNG-specific <img>
// logic, so these read like the real sign in the palette.
function buildSpeedSignThumbnail(def) {
  const NS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");

  const circle = document.createElementNS(NS, "circle");
  circle.setAttribute("cx", "12");
  circle.setAttribute("cy", "12");
  circle.setAttribute("r", "10");
  circle.setAttribute("fill", "#ffffff");
  svg.appendChild(circle);

  if (def.kind === "limit") {
    circle.setAttribute("stroke", SPEED_SIGN_RED);
    circle.setAttribute("stroke-width", "2.5");
  } else {
    circle.setAttribute("stroke", SPEED_SIGN_INK);
    circle.setAttribute("stroke-width", "1");
    const stripe = document.createElementNS(NS, "line");
    stripe.setAttribute("x1", "5");
    stripe.setAttribute("y1", "19");
    stripe.setAttribute("x2", "19");
    stripe.setAttribute("y2", "5");
    stripe.setAttribute("stroke", SPEED_SIGN_STRIPE);
    stripe.setAttribute("stroke-width", "2.5");
    svg.appendChild(stripe);
  }

  const text = document.createElementNS(NS, "text");
  text.setAttribute("x", "12");
  text.setAttribute("y", "12.5");
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("dominant-baseline", "middle");
  text.setAttribute("font-size", def.value >= 100 ? "6" : "8");
  text.setAttribute("font-weight", "bold");
  text.setAttribute("fill", SPEED_SIGN_INK);
  text.textContent = String(def.value);
  svg.appendChild(text);

  return svg;
}

// Inserted before Ρ-33/Ρ-38 (where the single photo entry used to sit),
// not appended at the end, so the 10-130 run stays together.
function buildSpeedSignPaletteItems() {
  const container = document.getElementById("palette-items");
  const emptyNotice = document.getElementById("palette-empty");
  if (!container) return;

  function insertBeforeShape(shapeKey, node) {
    const anchor = container.querySelector(`[data-shape="${shapeKey}"]`) || emptyNotice;
    container.insertBefore(node, anchor);
  }

  SPEED_SIGN_DEFS.forEach((def) => {
    const item = document.createElement("div");
    item.className = "palette-item";
    item.draggable = true;
    item.dataset.shape = def.key;
    item.dataset.categories = "signs";
    item.title = `${def.code} — ${def.desc}`;
    item.appendChild(buildSpeedSignThumbnail(def));
    item.appendChild(document.createTextNode(`${def.code} — ${def.desc}`));
    insertBeforeShape(def.kind === "limit" ? "sign_p_33" : "sign_p_38", item);
  });
}
buildSpeedSignPaletteItems();
