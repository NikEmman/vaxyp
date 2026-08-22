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
function roadBase(ppm, lanes, lengthM = ROAD_LENGTH_M) {
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

function roadSegment(ppm, lanes, lengthM) {
  const { parts, w, h } = roadBase(ppm, lanes, lengthM);
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

  return markAsGroundMarking(
    new fabric.Group(parts, { originX: "center", originY: "center", subTargetCheck: false })
  );
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
  road3: createRoad3,
  oneway: createOneWay,
  speedlane: createSpeedingLane,
  speedlanemirror: createSpeedingLaneMirrored,
  turn: createTurn,
  roundabout1: createRoundabout1,
  roundabout2: createRoundabout2,
  roundabout3: createRoundabout3,
  roundabout4: createRoundabout4,
  roundabout5: createRoundabout5,
  crosswalk: createCrosswalk,
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
