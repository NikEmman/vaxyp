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

// ── Tire marks ───────────────────────────────────────────────────
// Rubber laid down by sliding tires, sized by the same length slider as
// straight road pieces. The vehicle travels up (-y) like everywhere else:
// a mark starts faint at the bottom (where the tires began to slide) and
// ends abruptly at the top (where they stopped).
//
// Each track is a translucent ink band with slightly ragged edges plus
// darker broken streaks from the tread grooves, all faded in with an ink
// gradient (sketcher.js's theme restyle recolors gradient stops too).
// Everything is in meters, so it scales with ppm. Randomness is seeded:
// the same mark always looks the same.
const SKID_TRACK_WIDTH_M = 1.6; // typical distance between a car's tires
const SKID_SAMPLE_M = 0.25; // spacing of the edge/centerline samples
const SKID_BODY_OPACITY = 0.5;

// mulberry32: tiny seeded PRNG, returns floats in [0, 1).
function seededRandom(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Ink gradient running up an object from its bottom edge: faint at the
// bottom, full strength `fadePx` above it and beyond. Pixel coords are
// relative to the object's own bounding box.
function fadeInGradient(obj, fadePx) {
  return new fabric.Gradient({
    type: "linear",
    gradientUnits: "pixels",
    coords: { x1: 0, y1: obj.height, x2: 0, y2: Math.max(0, obj.height - fadePx) },
    colorStops: [
      { offset: 0, color: LINE_COLOR, opacity: 0.1 },
      { offset: 1, color: LINE_COLOR, opacity: 1 },
    ],
  });
}

// `drift(t)`: sideways offset in meters at t (0 = start, 1 = stop), shared
// by all tracks of a mark so they bend together.
// `hatch`: diagonal scuffs across the band (sideways slide).
function tireTrack(ppm, { x, lengthM, widthM, drift, seed, streaks = 4, hatch = false }) {
  const rand = seededRandom(seed);
  const n = Math.max(2, Math.ceil(lengthM / SKID_SAMPLE_M));
  const samples = Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n;
    const cx = x + drift(t);
    return {
      y: lengthM / 2 - t * lengthM,
      cx,
      left: cx - widthM / 2 + (rand() - 0.5) * widthM * 0.15,
      right: cx + widthM / 2 + (rand() - 0.5) * widthM * 0.15,
    };
  });
  const P = (px, py) => `${px * ppm} ${py * ppm}`;
  // Fade in over the first quarter, at most 3 m.
  const fadePx = Math.min(lengthM * 0.25, 3) * ppm;
  const faded = (path, prop, opacity) => {
    path.set({ [prop]: fadeInGradient(path, fadePx), opacity });
    return path;
  };

  const bandPts = [...samples.map((s) => P(s.left, s.y)), ...[...samples].reverse().map((s) => P(s.right, s.y))];
  const parts = [
    faded(new fabric.Path(`M ${bandPts.join(" L ")} Z`, { stroke: "", selectable: false, evented: false }), "fill", SKID_BODY_OPACITY),
  ];

  // Tread-groove streaks across the band, broken up by random dashes.
  const streakPx = Math.max(1, 0.018 * ppm);
  for (let k = 0; k < streaks; k++) {
    const off = (((k + 0.5) / streaks - 0.5) * 0.75 + (rand() - 0.5) * 0.08) * widthM;
    const pts = samples.map((s) => P(s.cx + off, s.y));
    const dashes = Array.from({ length: 6 }, (_, i) => (i % 2 ? 0.15 + rand() * 0.5 : 0.6 + rand() * 2.2) * ppm);
    const streak = new fabric.Path(`M ${pts.join(" L ")}`, {
      fill: "",
      strokeWidth: streakPx,
      strokeDashArray: dashes,
      selectable: false,
      evented: false,
    });
    parts.push(faded(streak, "stroke", 0.55));
  }

  if (hatch) {
    const d = [];
    for (let i = 0; i < n; i++) {
      for (const f of [0.2, 0.7]) {
        const a = samples[i];
        const b = samples[i + 1];
        const y = a.y + (b.y - a.y) * f;
        const cx = a.cx + (b.cx - a.cx) * f;
        d.push(`M ${P(cx - widthM * 0.45, y + widthM * 0.3)} L ${P(cx + widthM * 0.45, y - widthM * 0.3)}`);
      }
    }
    const scuffs = new fabric.Path(d.join(" "), { fill: "", strokeWidth: streakPx, selectable: false, evented: false });
    parts.push(faded(scuffs, "stroke", 0.4));
  }
  return parts;
}

function tireMarksGroup(parts) {
  return markAsGroundMarking(
    new fabric.Group(parts, { originX: "center", originY: "center", subTargetCheck: false })
  );
}

// Braking skid marks: two tracks a car's width apart, near-straight.
function createSkidMarks(ppm, lengthM = ROAD_LENGTH_M) {
  // Drift scaled down on short marks, or a 0.5 m mark bends into a chevron.
  const drift = (t) => 0.06 * Math.min(1, lengthM / 5) * Math.sin(t * Math.PI * 1.3);
  const track = (side, seed) =>
    tireTrack(ppm, { x: (side * SKID_TRACK_WIDTH_M) / 2, lengthM, widthM: 0.2, drift, seed });
  return tireMarksGroup([...track(-1, 11), ...track(1, 29)]);
}

// Sideways slide: the car moves broadside (its length across the marks),
// so the front and rear tires leave two tracks a wheelbase (~2.7 m) apart.
// Tires dragged sideways smear a wider band, scuffed diagonally, and the
// path bows as the car rotates.
function createSkidMarksSideways(ppm, lengthM = ROAD_LENGTH_M) {
  const bow = Math.min(0.8, lengthM * 0.06) * Math.min(1, lengthM / 5);
  const drift = (t) => bow * Math.sin(t * Math.PI);
  const track = (side, seed) =>
    tireTrack(ppm, { x: side * 1.35, lengthM, widthM: 0.32, drift, seed, streaks: 0, hatch: true });
  return tireMarksGroup([...track(-1, 7), ...track(1, 43)]);
}

// Metal scrape marks (Χαραγές μετάλλου): where bodywork, a rim or a
// sliding motorcycle ground into the asphalt. A ~0.5 m wide bundle of fine
// sharp scratches, a few deeper gouges with a chipped divot where they dug
// in, some broken where the part bounced. Travel is up (-y) like the tire
// marks; most scratches start right at contact, fewer run all the way.
function createScrapeMarks(ppm, lengthM = ROAD_LENGTH_M) {
  const rand = seededRandom(23);
  const widthM = 0.5;
  const count = 14;
  const drift = (t) => 0.1 * Math.min(1, lengthM / 5) * Math.sin(t * Math.PI * 0.9);
  const P = (x, y) => `${x * ppm} ${y * ppm}`;
  const scratches = [];
  const divots = [];

  for (let k = 0; k < count; k++) {
    const deep = k % 5 === 2;
    const off = ((k + rand()) / count - 0.5) * widthM;
    const t0 = rand() < 0.6 ? rand() * 0.06 : rand() * 0.35;
    const t1 = 1 - (rand() < 0.5 ? rand() * 0.05 : rand() * 0.4);
    const slant = (rand() - 0.5) * 0.012; // meters sideways per meter
    const n = Math.max(2, Math.ceil(((t1 - t0) * lengthM) / 0.5));
    const pts = [];
    for (let i = 0; i <= n; i++) {
      const t = t0 + ((t1 - t0) * i) / n;
      pts.push(P(off + drift(t) + slant * t * lengthM + (rand() - 0.5) * 0.01, lengthM / 2 - t * lengthM));
    }
    const bouncing = !deep && k % 4 === 1;
    scratches.push(
      new fabric.Path(`M ${pts.join(" L ")}`, {
        fill: "",
        stroke: LINE_COLOR,
        strokeWidth: deep ? Math.max(1.5, 0.03 * ppm) : Math.max(0.75, 0.012 * ppm),
        strokeLineCap: "round",
        strokeLineJoin: "round",
        strokeDashArray: bouncing ? [(1 + rand() * 1.5) * ppm, (0.2 + rand() * 0.4) * ppm] : null,
        opacity: deep ? 0.9 : 0.6,
        selectable: false,
        evented: false,
      })
    );

    if (deep) {
      const cx = off + drift(t0);
      const cy = lengthM / 2 - t0 * lengthM;
      const r = 0.035 + rand() * 0.025;
      const corners = 8;
      divots.push(
        new fabric.Polygon(
          Array.from({ length: corners }, (_, c) => {
            const a = ((c + rand() * 0.5) / corners) * Math.PI * 2;
            const rr = r * (0.7 + rand() * 0.3);
            return { x: (cx + Math.cos(a) * rr) * ppm, y: (cy + Math.sin(a) * rr) * ppm };
          }),
          { fill: LINE_COLOR, stroke: LINE_COLOR, strokeWidth: 0.5, strokeLineJoin: "round", selectable: false, evented: false }
        )
      );
    }
  }

  return tireMarksGroup([...scratches, ...divots]);
}

// Pool of spilled liquid (blood, oil, coolant...): an irregular blob with a
// few splash droplets, translucent ink so the road/lines underneath still
// show. Fill and outline are separate objects so only the fill is faded.
// The edge is a few low-frequency waves summed around the circle, so it
// wobbles like a real puddle instead of forming regular lobes; `phases`
// just makes each size's outline different.
const LIQUID_OPACITY = 0.3;

function puddleRadii(phases, count = 28) {
  const [p2, p3, p5] = phases;
  return Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2;
    return 1 + 0.13 * Math.sin(2 * a + p2) + 0.09 * Math.sin(3 * a + p3) + 0.05 * Math.sin(5 * a + p5);
  });
}

function blobPath(cx, cy, rx, ry, radii) {
  const pts = radii.map((f, i) => {
    const a = (i / radii.length) * Math.PI * 2;
    return { x: cx + Math.cos(a) * rx * f, y: cy + Math.sin(a) * ry * f };
  });
  // Catmull-Rom through the points, as cubic Béziers.
  const n = pts.length;
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += ` C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${p2.x} ${p2.y}`;
  }
  return d + " Z";
}

// `droplets`: [{ angleDeg, dist, r }], dist/r as fractions of the half-length.
function liquidPool(ppm, lengthM, aspect, phases, droplets) {
  const rx = (lengthM / 2) * ppm;
  const ry = rx * aspect;
  const blobs = [
    blobPath(0, 0, rx, ry, puddleRadii(phases)),
    ...droplets.map(({ angleDeg, dist, r }) => {
      const a = (angleDeg * Math.PI) / 180;
      const dr = r * rx;
      return blobPath(Math.cos(a) * rx * dist, Math.sin(a) * ry * dist, dr, dr * 0.85, [1, 0.9, 1.05, 0.95, 1, 0.9]);
    }),
  ];
  const parts = blobs.flatMap((d) => [
    new fabric.Path(d, { fill: LINE_COLOR, opacity: LIQUID_OPACITY, stroke: "", selectable: false, evented: false }),
    new fabric.Path(d, { fill: "", stroke: LINE_COLOR, strokeWidth: 1.5, selectable: false, evented: false }),
  ]);
  const group = new fabric.Group(parts, {
    originX: "center",
    originY: "center",
    subTargetCheck: false,
  });
  return markAsGroundMarking(group);
}

function createLiquidSmall(ppm) {
  return liquidPool(ppm, 0.6, 0.8, [0.4, 2.1, 1.0], [
    { angleDeg: 20, dist: 1.35, r: 0.12 },
  ]);
}

function createLiquidMedium(ppm) {
  return liquidPool(ppm, 1.4, 0.7, [1.7, 0.3, 4.0], [
    { angleDeg: -30, dist: 1.25, r: 0.08 },
    { angleDeg: 160, dist: 1.3, r: 0.06 },
  ]);
}

function createLiquidLarge(ppm) {
  return liquidPool(
    ppm,
    2.8,
    0.6,
    [2.8, 5.1, 2.2],
    [
      { angleDeg: 10, dist: 1.22, r: 0.05 },
      { angleDeg: 100, dist: 1.45, r: 0.04 },
      { angleDeg: 200, dist: 1.2, r: 0.06 },
      { angleDeg: 290, dist: 1.5, r: 0.035 },
    ]
  );
}

// ── Debris (Θραύσματα) ───────────────────────────────────────────
// A scatter of shards, denser toward the middle: outlined ones read as
// glass, solid ones as dark plastic. The large field adds recognizable car
// parts on top. Seeded, so a given field always looks the same. Ground
// markings, so they stay above roads.
const debrisPart = (extra = {}) => ({ selectable: false, evented: false, ...extra });

// `spreadX/Y`: rough half-extents of the field, meters.
function debrisShards(ppm, rand, count, spreadX, spreadY, minM, maxM) {
  const gauss = () => {
    // Box-Muller, clamped so nothing lands far outside the field.
    const g = Math.sqrt(-2 * Math.log(1 - rand())) * Math.cos(2 * Math.PI * rand());
    return Math.max(-2, Math.min(2, g)) / 2;
  };
  const shards = [];
  for (let i = 0; i < count; i++) {
    const cx = gauss() * spreadX;
    const cy = gauss() * spreadY;
    const size = minM + rand() * (maxM - minM);
    const corners = 3 + Math.floor(rand() * 3);
    const start = rand() * Math.PI * 2;
    const points = Array.from({ length: corners }, (_, k) => {
      const a = start + (k / corners) * Math.PI * 2 + (rand() - 0.5) * 0.9;
      const r = size * (0.45 + rand() * 0.55);
      return { x: (cx + Math.cos(a) * r) * ppm, y: (cy + Math.sin(a) * r) * ppm };
    });
    const glass = rand() < 0.5;
    shards.push(
      new fabric.Polygon(
        points,
        debrisPart(
          glass
            ? { fill: "", stroke: LINE_COLOR, strokeWidth: 1, strokeLineJoin: "round" }
            : { fill: LINE_COLOR, stroke: LINE_COLOR, strokeWidth: 0.5, strokeLineJoin: "round" }
        )
      )
    );
  }
  return shards;
}

// Wraps one debris item's parts (built around 0,0) and drops it at x, y.
function debrisItem(ppm, parts, x, y, angle) {
  return new fabric.Group(parts, {
    left: x * ppm,
    top: y * ppm,
    angle,
    originX: "center",
    originY: "center",
    subTargetCheck: false,
    ...debrisPart(),
  });
}

function debrisGroup(parts) {
  return markAsGroundMarking(
    new fabric.Group(parts, { originX: "center", originY: "center", subTargetCheck: false })
  );
}

// Small: ~1.2 x 0.8 m of glass and plastic bits (broken lights, trim).
function createDebrisSmall(ppm) {
  const rand = seededRandom(5);
  return debrisGroup(debrisShards(ppm, rand, 34, 0.6, 0.4, 0.03, 0.09));
}

// Large: ~3.5 x 2.4 m, shards plus half a bumper, a side mirror, a
// hubcap, a broken light unit, a license plate and a panel fragment.
function createDebrisLarge(ppm) {
  const rand = seededRandom(17);
  const body = () => ({ ...vehicleBody(), strokeWidth: 1.5 });
  const line = () => ({ ...vehicleLine() });

  const bumper = debrisItem(
    ppm,
    [
      vehiclePath(
        ppm,
        [
          ["M", -0.55, -0.06],
          ["Q", 0, -0.17, 0.5, -0.1],
          ["L", 0.45, -0.04],
          ["L", 0.53, 0.0],
          ["L", 0.46, 0.04],
          ["L", 0.5, 0.08],
          ["Q", 0, 0.03, -0.55, 0.09],
          ["Q", -0.64, 0.02, -0.55, -0.06],
          ["Z"],
        ],
        body()
      ),
      vehiclePath(ppm, [["M", -0.52, 0.0], ["Q", 0, -0.09, 0.44, -0.05]], line()),
    ],
    -0.6,
    -0.45,
    -18
  );

  const mirror = debrisItem(
    ppm,
    [
      vehicleRect(ppm, -0.16, 0, 0.07, 0.06, { ...vehicleSolid(), rx: 0, ry: 0 }),
      vehiclePath(ppm, [["M", -0.13, -0.08], ["L", 0.09, -0.08], ["Q", 0.17, 0, 0.09, 0.08], ["L", -0.13, 0.08], ["Z"]], body()),
      vehiclePath(ppm, [["M", -0.1, -0.05], ["L", 0.08, -0.05], ["Q", 0.13, 0, 0.08, 0.05], ["L", -0.1, 0.05], ["Z"]], vehicleGlass()),
    ],
    0.95,
    0.35,
    40
  );

  const hubcap = debrisItem(
    ppm,
    [
      new fabric.Circle({ radius: 0.19 * ppm, originX: "center", originY: "center", ...debrisPart(body()) }),
      ...[0, 72, 144, 216, 288].map((deg) => {
        const a = (deg * Math.PI) / 180;
        return vehiclePath(ppm, [["M", Math.cos(a) * 0.06, Math.sin(a) * 0.06], ["L", Math.cos(a) * 0.16, Math.sin(a) * 0.16]], line());
      }),
      new fabric.Circle({ radius: 0.06 * ppm, originX: "center", originY: "center", ...debrisPart(body()) }),
    ],
    1.2,
    -0.55,
    0
  );

  const lightUnit = debrisItem(
    ppm,
    [
      vehicleRect(ppm, 0, 0, 0.36, 0.16, { ...body(), rx: 0.05 * ppm, ry: 0.05 * ppm }),
      vehiclePath(ppm, [["M", -0.05, -0.08], ["L", -0.05, 0.08], ["M", 0.07, -0.08], ["L", 0.07, 0.08]], line()),
      vehiclePath(ppm, [["M", 0.12, -0.08], ["L", 0.15, -0.01], ["L", 0.11, 0.03], ["L", 0.14, 0.08]], line()), // crack
    ],
    -0.25,
    0.6,
    -65
  );

  const plate = debrisItem(
    ppm,
    [
      vehicleRect(ppm, 0, 0, 0.52, 0.11, { ...body(), rx: 0.015 * ppm, ry: 0.015 * ppm }),
      vehicleRect(ppm, 0, 0, 0.46, 0.07, { ...line(), rx: 0.01 * ppm, ry: 0.01 * ppm }),
      ...[-0.15, -0.06, 0.04, 0.13].map((x) => vehicleRect(ppm, x, 0, 0.06, 0.035, { ...vehicleSolid(), rx: 0, ry: 0 })),
    ],
    0.35,
    -0.2,
    12
  );

  const panel = debrisItem(
    ppm,
    [
      new fabric.Polygon(
        [
          { x: -0.2, y: -0.1 },
          { x: 0.12, y: -0.14 },
          { x: 0.22, y: -0.02 },
          { x: 0.15, y: 0.06 },
          { x: 0.2, y: 0.12 },
          { x: -0.05, y: 0.1 },
          { x: -0.18, y: 0.05 },
        ].map((p) => ({ x: p.x * ppm, y: p.y * ppm })),
        debrisPart({ ...body(), strokeLineJoin: "round" })
      ),
    ],
    -1.25,
    0.15,
    25
  );

  return debrisGroup([
    ...debrisShards(ppm, rand, 70, 1.75, 1.2, 0.03, 0.11),
    bumper,
    mirror,
    hubcap,
    lightUnit,
    plate,
    panel,
  ]);
}

// ── Vehicle path arrows (Πορεία οχημάτων) ────────────────────────
// Annotation arrows showing which way a vehicle moved, pointing up (-y)
// like the vehicles so a rotated car and its arrow line up. Thick line
// plus a solid head; ground markings, so they stay above roads.
const PATH_ARROW_HEAD_LEN_M = 0.8;
const PATH_ARROW_HEAD_HW_M = 0.33;

// `d`: SVG path in pixels, ending at the head's base. `tip` (meters) and
// `dir` (unit vector) place the head; `headScale` shrinks it on short arrows.
function movementArrow(ppm, d, tip, dir, dashed = false, headScale = 1) {
  const [dx, dy] = dir;
  const headLen = PATH_ARROW_HEAD_LEN_M * headScale * ppm;
  const headHw = PATH_ARROW_HEAD_HW_M * headScale * ppm;
  const t = { x: tip.x * ppm, y: tip.y * ppm };
  const base = { x: t.x - dx * headLen, y: t.y - dy * headLen };
  const head = new fabric.Polygon(
    [t, { x: base.x - dy * headHw, y: base.y + dx * headHw }, { x: base.x + dy * headHw, y: base.y - dx * headHw }],
    { fill: LINE_COLOR, stroke: LINE_COLOR, strokeWidth: 1, strokeLineJoin: "round", selectable: false, evented: false }
  );
  const line = new fabric.Path(d, {
    fill: "",
    stroke: LINE_COLOR,
    strokeWidth: 3,
    strokeLineCap: dashed ? "butt" : "round",
    strokeDashArray: dashed ? [12, 9] : null,
    selectable: false,
    evented: false,
  });
  return markAsGroundMarking(
    new fabric.Group([line, head], { originX: "center", originY: "center", subTargetCheck: false })
  );
}

// Straight, sized by the segment-length slider like skid marks. On short
// arrows the head shrinks to at most 40% of the length, so it never
// swallows the shaft.
function straightPathArrow(ppm, lengthM, dashed) {
  const L = lengthM ?? 8;
  const m = (v) => v * ppm;
  const headScale = Math.min(1, (L * 0.4) / PATH_ARROW_HEAD_LEN_M);
  const headLen = PATH_ARROW_HEAD_LEN_M * headScale;
  return movementArrow(ppm, `M 0 ${m(L / 2)} L 0 ${m(-L / 2 + headLen)}`, { x: 0, y: -L / 2 }, [0, -1], dashed, headScale);
}

function createPathStraight(ppm, lengthM) {
  return straightPathArrow(ppm, lengthM, false);
}

function createPathStraightDashed(ppm, lengthM) {
  return straightPathArrow(ppm, lengthM, true);
}

// 90° turn: 2 m lead-in, 5 m radius. `side`: -1 left, 1 right.
function turnPathArrow(ppm, side) {
  const m = (v) => v * ppm;
  const R = 5;
  const lead = 2;
  const outY = -lead - R;
  const d = [
    `M 0 0`,
    `L 0 ${m(-lead)}`,
    `A ${m(R)} ${m(R)} 0 0 ${side > 0 ? 1 : 0} ${m(side * R)} ${m(outY)}`,
    `L ${m(side * (R + 0.4))} ${m(outY)}`,
  ].join(" ");
  return movementArrow(ppm, d, { x: side * (R + 0.4 + PATH_ARROW_HEAD_LEN_M), y: outY }, [side, 0]);
}

// Lane change: one lane (3 m) sideways over ~8 m.
function laneChangePathArrow(ppm, side) {
  const m = (v) => v * ppm;
  const x = side * ROAD_LANE_WIDTH;
  const d = `M 0 0 L 0 ${m(-1)} C 0 ${m(-5)} ${m(x)} ${m(-5)} ${m(x)} ${m(-9)} L ${m(x)} ${m(-9.4)}`;
  return movementArrow(ppm, d, { x, y: -9.4 - PATH_ARROW_HEAD_LEN_M }, [0, -1]);
}

// U-turn to the left (driving on the right).
function createPathUTurn(ppm) {
  const m = (v) => v * ppm;
  const r = 2.5;
  const d = `M 0 0 L 0 ${m(-4)} A ${m(r)} ${m(r)} 0 0 0 ${m(-2 * r)} ${m(-4)} L ${m(-2 * r)} ${m(-1.2)}`;
  return movementArrow(ppm, d, { x: -2 * r, y: -1.2 + PATH_ARROW_HEAD_LEN_M }, [0, 1]);
}

// Spin: a vehicle rotating in place after an impact — nearly a full
// clockwise circle.
function createPathSpin(ppm) {
  const r = 1.8;
  const a0 = (100 * Math.PI) / 180;
  const a1 = (390 * Math.PI) / 180;
  const pt = (a) => ({ x: Math.cos(a) * r, y: Math.sin(a) * r });
  const s = pt(a0);
  const e = pt(a1);
  const tangent = [-Math.sin(a1), Math.cos(a1)]; // clockwise on screen
  const d = `M ${s.x * ppm} ${s.y * ppm} A ${r * ppm} ${r * ppm} 0 1 1 ${e.x * ppm} ${e.y * ppm}`;
  const tip = { x: e.x + tangent[0] * PATH_ARROW_HEAD_LEN_M, y: e.y + tangent[1] * PATH_ARROW_HEAD_LEN_M };
  return movementArrow(ppm, d, tip, tangent);
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

// ── Vehicles ─────────────────────────────────────────────────────
// Top-down, front pointing up (-y). Parts are laid out in meters (x across,
// y along the vehicle, 0,0 at its center) and scaled by ppm.
// Glass is ink-filled at low opacity (fill stays LINE_COLOR so the theme
// restyle still matches it); tires and mirrors are solid ink, drawn before
// the body so the body hides their inner half and only the rim pokes out.
const GLASS_OPACITY = 0.2;

// `segs`: [["M", x, y], ["L", x, y], ["Q", cx, cy, x, y], ["Z"]] in meters.
function vehiclePath(ppm, segs, style) {
  const d = segs.map(([cmd, ...nums]) => [cmd, ...nums.map((n) => n * ppm)].join(" ")).join(" ");
  return new fabric.Path(d, { selectable: false, evented: false, ...style });
}

function vehicleRect(ppm, cx, cy, wM, hM, style) {
  return new fabric.Rect({
    left: cx * ppm,
    top: cy * ppm,
    width: wM * ppm,
    height: hM * ppm,
    rx: Math.min(wM, hM) * ppm * 0.3,
    ry: Math.min(wM, hM) * ppm * 0.3,
    originX: "center",
    originY: "center",
    selectable: false,
    evented: false,
    ...style,
  });
}

const vehicleSolid = () => ({ fill: LINE_COLOR, stroke: LINE_COLOR, strokeWidth: 1 });
const vehicleBody = () => ({ fill: SHAPE_FILL, stroke: LINE_COLOR, strokeWidth: 2 });
const vehicleGlass = () => ({ fill: LINE_COLOR, opacity: GLASS_OPACITY, stroke: "" });
const vehicleLine = () => ({ fill: "", stroke: LINE_COLOR, strokeWidth: 1 });

// Mirror-images a list of path segments across the vehicle's centerline.
const mirrorX = (segs) => segs.map(([cmd, ...nums]) => [cmd, ...nums.map((n, i) => (i % 2 === 0 ? -n : n))]);

function vehicleGroup(parts) {
  return new fabric.Group(parts, {
    originX: "center",
    originY: "center",
    subTargetCheck: false,
  });
}

// Two tires at ±x on the same axle. `poke`: how far each tire sticks out
// past `hw` (the body's half width), which is all that ends up visible.
function wheelPair(ppm, hw, y, wM, lM, poke = 0.06) {
  return [-1, 1].map((side) => vehicleRect(ppm, side * (hw + poke - wM / 2), y, wM, lM, vehicleSolid()));
}

// Small solid mirrors on the A-pillars (cars, vans).
function doorMirrors(ppm, hw, y) {
  const r = [["M", hw - 0.05, y - 0.12], ["L", hw + 0.18, y - 0.06], ["L", hw + 0.18, y + 0.08], ["L", hw - 0.05, y + 0.1], ["Z"]];
  return [r, mirrorX(r)].map((segs) => vehiclePath(ppm, segs, vehicleSolid()));
}

// Big mirrors on arms (trucks, buses).
function armMirrors(ppm, hw, y) {
  return [-1, 1].flatMap((side) => [
    vehiclePath(ppm, [["M", side * hw, y + 0.05], ["L", side * (hw + 0.22), y]], { ...vehicleLine(), strokeWidth: 2 }),
    vehicleRect(ppm, side * (hw + 0.3), y, 0.14, 0.42, vehicleSolid()),
  ]);
}

// Chassis rails showing in the gap between a cab and whatever is behind it.
function chassisRails(ppm, fromY, toY) {
  return [-1, 1].map((side) =>
    vehicleRect(ppm, side * 0.45, (fromY + toY) / 2, 0.14, toY - fromY, { ...vehicleSolid(), rx: 0, ry: 0 })
  );
}

// Flat-fronted cab-over cab (trucks, tractor units, fire engines): body
// with rounded front corners and a windshield across the front.
function cabOverCab(ppm, hw, front, back) {
  const cab = vehiclePath(
    ppm,
    [
      ["M", -hw + 0.2, front],
      ["L", hw - 0.2, front],
      ["Q", hw, front, hw, front + 0.2],
      ["L", hw, back],
      ["L", -hw, back],
      ["L", -hw, front + 0.2],
      ["Q", -hw, front, -hw + 0.2, front],
      ["Z"],
    ],
    vehicleBody()
  );
  const windshield = vehiclePath(
    ppm,
    [
      ["M", -hw + 0.12, front + 0.14],
      ["L", hw - 0.12, front + 0.14],
      ["L", hw - 0.2, front + 0.5],
      ["L", -hw + 0.2, front + 0.5],
      ["Z"],
    ],
    vehicleGlass()
  );
  return [cab, windshield];
}

// Cargo box / trailer body: roof ribs across it and the rear doors' seam.
function cargoBox(ppm, hw, front, back, ribSpacing) {
  const box = vehicleRect(ppm, 0, (front + back) / 2, hw * 2, back - front, {
    ...vehicleBody(),
    rx: 0.06 * ppm,
    ry: 0.06 * ppm,
  });
  const ribs = [];
  for (let y = front + ribSpacing; y < back - 0.4; y += ribSpacing) {
    ribs.push(vehiclePath(ppm, [["M", -hw + 0.12, y], ["L", hw - 0.12, y]], vehicleLine()));
  }
  const doorSeam = vehiclePath(ppm, [["M", 0, back - 0.02], ["L", 0, back - 0.3]], vehicleLine());
  return [box, ...ribs, doorSeam];
}

// Emergency light bar across the roof: solid lamps at both ends.
function lightBar(ppm, y, wM) {
  const lampW = wM * 0.32;
  return [
    vehicleRect(ppm, 0, y, wM, 0.26, { ...vehicleBody(), strokeWidth: 1.5, rx: 0.06 * ppm, ry: 0.06 * ppm }),
    ...[-1, 1].map((side) =>
      vehicleRect(ppm, side * (wM / 2 - lampW / 2 - 0.04), y, lampW, 0.18, { ...vehicleSolid(), rx: 0.04 * ppm, ry: 0.04 * ppm })
    ),
  ];
}

// Passenger car, ~4.4 x 1.8 m: rounded nose, glass cabin, wheels, mirrors,
// headlights at the front and taillights at the back so its heading reads
// at a glance. `hoodCreases: false` leaves the hood clear (police lettering).
function carParts(ppm, { hoodCreases = true } = {}) {
  const hw = 0.9; // half width
  const hl = 2.2; // half length

  const wheels = [-1.35, 1.35].flatMap((y) => wheelPair(ppm, hw, y, 0.24, 0.66, 0.08));
  const mirrors = doorMirrors(ppm, hw, -0.5);

  const body = vehiclePath(
    ppm,
    [
      ["M", -0.62, -hl + 0.04],
      ["Q", 0, -hl - 0.04, 0.62, -hl + 0.04],
      ["Q", hw, -hl + 0.08, hw, -hl + 0.5],
      ["L", hw, hl - 0.4],
      ["Q", hw, hl - 0.04, 0.62, hl - 0.02],
      ["Q", 0, hl + 0.02, -0.62, hl - 0.02],
      ["Q", -hw, hl - 0.04, -hw, hl - 0.4],
      ["L", -hw, -hl + 0.5],
      ["Q", -hw, -hl + 0.08, -0.62, -hl + 0.04],
      ["Z"],
    ],
    vehicleBody()
  );

  const windshield = vehiclePath(
    ppm,
    [
      ["M", -0.74, -0.92],
      ["Q", 0, -1.08, 0.74, -0.92],
      ["L", 0.62, -0.3],
      ["Q", 0, -0.36, -0.62, -0.3],
      ["Z"],
    ],
    vehicleGlass()
  );
  const rearWindow = vehiclePath(
    ppm,
    [
      ["M", -0.62, 1.05],
      ["Q", 0, 1.0, 0.62, 1.05],
      ["L", 0.7, 1.5],
      ["Q", 0, 1.58, -0.7, 1.5],
      ["Z"],
    ],
    vehicleGlass()
  );
  const sideWindowR = [["M", 0.67, -0.28], ["L", 0.8, -0.34], ["L", 0.8, 1.1], ["L", 0.67, 1.03], ["Z"]];
  const sideWindows = [sideWindowR, mirrorX(sideWindowR)].map((segs) => vehiclePath(ppm, segs, vehicleGlass()));
  const roof = vehicleRect(ppm, 0, 0.375, 1.24, 1.35, { ...vehicleLine(), rx: 0.08 * ppm, ry: 0.08 * ppm });

  // Hood creases, running from the windshield toward the nose.
  const hoodR = [["M", 0.45, -1.0], ["Q", 0.5, -1.6, 0.4, -2.02]];
  const hood = hoodCreases ? [hoodR, mirrorX(hoodR)].map((segs) => vehiclePath(ppm, segs, vehicleLine())) : [];

  const headlightR = [["M", 0.5, -hl + 0.1], ["L", 0.78, -hl + 0.2], ["L", 0.84, -hl + 0.38], ["L", 0.5, -hl + 0.22], ["Z"]];
  const headlights = [headlightR, mirrorX(headlightR)].map((segs) => vehiclePath(ppm, segs, vehicleLine()));
  const taillights = [-1, 1].map((side) => vehicleRect(ppm, side * 0.7, hl - 0.12, 0.26, 0.1, vehicleSolid()));

  return [
    ...wheels,
    ...mirrors,
    body,
    windshield,
    rearWindow,
    ...sideWindows,
    roof,
    ...hood,
    ...headlights,
    ...taillights,
  ];
}

function createCar(ppm) {
  return vehicleGroup(carParts(ppm));
}

// Police patrol car (Περιπολικό): the car with a light bar across the roof
// and ΕΛ.ΑΣ. lettering on the hood.
function createPoliceCar(ppm) {
  const lettering = new fabric.Text("ΕΛ.ΑΣ.", {
    left: 0,
    top: -1.55 * ppm,
    fontSize: 0.34 * ppm,
    fontWeight: "bold",
    fontFamily: "Arial, sans-serif",
    fill: LINE_COLOR,
    originX: "center",
    originY: "center",
    selectable: false,
    evented: false,
  });
  return vehicleGroup([...carParts(ppm, { hoodCreases: false }), ...lightBar(ppm, 0.05, 1.3), lettering]);
}

// Van, ~5.3 x 2 m (Sprinter/Transit class): short sloped hood, long flat
// roof with pressed ribs, rear doors. `ribs: false` leaves the roof clear
// for the ambulance's markings.
function vanParts(ppm, lengthM, { ribs = true } = {}) {
  const hw = 1.0;
  const hl = lengthM / 2;
  const front = -hl;
  const windshieldFront = front + 0.72;
  const roofFront = front + 1.22;

  const wheels = [front + 0.95, hl - 1.25].flatMap((y) => wheelPair(ppm, hw, y, 0.26, 0.72, 0.08));
  const mirrors = doorMirrors(ppm, hw, roofFront - 0.12);

  const body = vehiclePath(
    ppm,
    [
      ["M", -0.7, front + 0.05],
      ["Q", 0, front - 0.03, 0.7, front + 0.05],
      ["Q", hw, front + 0.1, hw, front + 0.55],
      ["L", hw, hl - 0.12],
      ["Q", hw, hl, hw - 0.12, hl],
      ["L", -hw + 0.12, hl],
      ["Q", -hw, hl, -hw, hl - 0.12],
      ["L", -hw, front + 0.55],
      ["Q", -hw, front + 0.1, -0.7, front + 0.05],
      ["Z"],
    ],
    vehicleBody()
  );
  const windshield = vehiclePath(
    ppm,
    [
      ["M", -0.84, windshieldFront],
      ["Q", 0, windshieldFront - 0.12, 0.84, windshieldFront],
      ["L", 0.86, roofFront],
      ["L", -0.86, roofFront],
      ["Z"],
    ],
    vehicleGlass()
  );
  const sideWindowR = [["M", 0.88, roofFront + 0.05], ["L", 0.95, roofFront + 0.05], ["L", 0.95, roofFront + 0.75], ["L", 0.88, roofFront + 0.75], ["Z"]];
  const sideWindows = [sideWindowR, mirrorX(sideWindowR)].map((segs) => vehiclePath(ppm, segs, vehicleGlass()));
  const roofBack = hl - 0.1;
  const roof = vehicleRect(ppm, 0, (roofFront + roofBack) / 2, 1.72, roofBack - roofFront, {
    ...vehicleLine(),
    rx: 0.1 * ppm,
    ry: 0.1 * ppm,
  });
  const roofRibs = ribs
    ? [-0.4, 0, 0.4].map((x) => vehiclePath(ppm, [["M", x, roofFront + 0.4], ["L", x, roofBack - 0.4]], vehicleLine()))
    : [];
  const doorSeam = vehiclePath(ppm, [["M", 0, hl], ["L", 0, roofBack]], vehicleLine());

  const headlightR = [["M", 0.55, front + 0.08], ["L", 0.86, front + 0.2], ["L", 0.9, front + 0.38], ["L", 0.55, front + 0.22], ["Z"]];
  const headlights = [headlightR, mirrorX(headlightR)].map((segs) => vehiclePath(ppm, segs, vehicleLine()));
  const taillights = [-1, 1].map((side) => vehicleRect(ppm, side * (hw - 0.1), hl - 0.3, 0.1, 0.4, vehicleSolid()));

  return {
    parts: [...wheels, ...mirrors, body, windshield, ...sideWindows, roof, ...roofRibs, doorSeam, ...headlights, ...taillights],
    roofFront,
    roofBack,
  };
}

function createVan(ppm) {
  return vehicleGroup(vanParts(ppm, 5.3).parts);
}

// Ambulance (Ασθενοφόρο), ~6 x 2 m: a long van with a light bar over the
// windshield and a large cross on the roof.
function createAmbulance(ppm) {
  const { parts, roofFront, roofBack } = vanParts(ppm, 6, { ribs: false });
  const cy = (roofFront + 0.4 + roofBack) / 2;
  const arm = 0.55; // cross half-span
  const t = 0.19; // cross half-thickness
  const cross = vehiclePath(
    ppm,
    [
      ["M", -t, cy - arm],
      ["L", t, cy - arm],
      ["L", t, cy - t],
      ["L", arm, cy - t],
      ["L", arm, cy + t],
      ["L", t, cy + t],
      ["L", t, cy + arm],
      ["L", -t, cy + arm],
      ["L", -t, cy + t],
      ["L", -arm, cy + t],
      ["L", -arm, cy - t],
      ["L", -t, cy - t],
      ["Z"],
    ],
    vehicleSolid()
  );
  return vehicleGroup([...parts, ...lightBar(ppm, roofFront + 0.22, 1.5), cross]);
}

// Box truck, ~7 x 2.5 m: cab-over cab up front, separate cargo box behind
// it (with the chassis showing in the gap), and big arm-mounted mirrors.
function createTruck(ppm) {
  const hl = 3.5;
  const cabHw = 1.15;
  const cabBack = -1.75;
  const boxFront = -1.55;

  const cabRoof = vehicleRect(ppm, 0, (-hl + 0.5 + cabBack) / 2 + 0.05, 1.7, 1.0, { ...vehicleLine(), rx: 0.1 * ppm, ry: 0.1 * ppm });

  return vehicleGroup([
    ...chassisRails(ppm, cabBack, boxFront),
    ...wheelPair(ppm, cabHw, -2.55, 0.32, 1.0, 0.14),
    ...wheelPair(ppm, 1.25, 2.2, 0.4, 1.0, 0.08),
    ...armMirrors(ppm, cabHw, -3.05),
    ...cabOverCab(ppm, cabHw, -hl, cabBack),
    cabRoof,
    ...cargoBox(ppm, 1.25, boxFront, hl, 0.85),
  ]);
}

// Semi-truck (Νταλίκα), ~16.5 x 2.55 m: tractor unit with a roof fairing,
// and a 13.6 m trailer riding over its drive axles. Drawn as one rigid
// piece, straight.
function createSemiTruck(ppm) {
  const hl = 8.25;
  const cabHw = 1.25;
  const cabBack = -6.05;
  const trailerHw = 1.275;
  const trailerFront = -5.55;

  // Roof fairing: narrow at the front, flaring out to the cab's full width.
  const fairing = vehiclePath(
    ppm,
    [
      ["M", -0.8, -hl + 0.65],
      ["L", 0.8, -hl + 0.65],
      ["L", 1.05, cabBack - 0.1],
      ["L", -1.05, cabBack - 0.1],
      ["Z"],
    ],
    vehicleLine()
  );

  return vehicleGroup([
    ...chassisRails(ppm, cabBack, trailerFront),
    ...wheelPair(ppm, cabHw, -7.2, 0.32, 1.0, 0.1),
    ...[-4.6, -3.35].flatMap((y) => wheelPair(ppm, trailerHw, y, 0.4, 1.0, 0.06)),
    ...[4.6, 5.9, 7.2].flatMap((y) => wheelPair(ppm, trailerHw, y, 0.4, 1.0, 0.06)),
    ...armMirrors(ppm, cabHw, -7.75),
    ...cabOverCab(ppm, cabHw, -hl, cabBack),
    fairing,
    ...cargoBox(ppm, trailerHw, trailerFront, hl, 1.2),
  ]);
}

// City bus (Λεωφορείο), ~12 x 2.55 m: wraparound windshield, a row of
// side windows, roof A/C unit and hatches, engine grille at the back.
function createBus(ppm) {
  const hw = 1.275;
  const hl = 6;

  const mirrors = [-1, 1].flatMap((side) => [
    vehiclePath(ppm, [["M", side * hw, -hl + 0.6], ["Q", side * (hw + 0.35), -hl + 0.5, side * (hw + 0.35), -hl + 0.15]], {
      ...vehicleLine(),
      strokeWidth: 2,
    }),
    vehicleRect(ppm, side * (hw + 0.35), -hl + 0.05, 0.14, 0.4, vehicleSolid()),
  ]);

  const body = vehicleRect(ppm, 0, 0, hw * 2, hl * 2, { ...vehicleBody(), rx: 0.35 * ppm, ry: 0.35 * ppm });
  const windshield = vehiclePath(
    ppm,
    [
      ["M", -hw + 0.12, -hl + 0.2],
      ["Q", 0, -hl + 0.02, hw - 0.12, -hl + 0.2],
      ["L", hw - 0.1, -hl + 0.55],
      ["L", -hw + 0.1, -hl + 0.55],
      ["Z"],
    ],
    vehicleGlass()
  );
  const sideWindows = [];
  for (let y = -hl + 0.75; y < hl - 1.4; y += 1.45) {
    const segs = [["M", hw - 0.14, y], ["L", hw - 0.04, y], ["L", hw - 0.04, y + 1.3], ["L", hw - 0.14, y + 1.3], ["Z"]];
    sideWindows.push(vehiclePath(ppm, segs, vehicleGlass()), vehiclePath(ppm, mirrorX(segs), vehicleGlass()));
  }
  const acUnit = vehicleRect(ppm, 0, -0.8, 1.5, 2.4, { ...vehicleLine(), rx: 0.12 * ppm, ry: 0.12 * ppm });
  const hatches = [-3.6, 2.4].map((y) => vehicleRect(ppm, 0, y, 0.7, 0.7, { ...vehicleLine(), rx: 0.05 * ppm, ry: 0.05 * ppm }));
  const grille = [0.35, 0.5, 0.65].map((d) =>
    vehiclePath(ppm, [["M", -0.6, hl - d], ["L", 0.6, hl - d]], vehicleLine())
  );

  return vehicleGroup([
    ...wheelPair(ppm, hw, -3.3, 0.32, 1.0, 0.06),
    ...wheelPair(ppm, hw, 2.8, 0.4, 1.0, 0.06),
    ...mirrors,
    body,
    windshield,
    ...sideWindows,
    acUnit,
    ...hatches,
    ...grille,
  ]);
}

// Fire engine (Πυροσβεστικό), ~8.5 x 2.5 m: crew cab with a light bar,
// equipment body with side lockers, and a ladder running from the
// turntable at the back up over the cab.
function createFireTruck(ppm) {
  const hl = 4.25;
  const cabHw = 1.2;
  const cabBack = -1.6;
  const bodyHw = 1.25;
  const bodyFront = -1.45;

  const equipmentBody = vehicleRect(ppm, 0, (bodyFront + hl) / 2, bodyHw * 2, hl - bodyFront, {
    ...vehicleBody(),
    rx: 0.06 * ppm,
    ry: 0.06 * ppm,
  });
  // Tops of the roller-shutter lockers down both sides.
  const lockers = [-1, 1].map((side) =>
    vehiclePath(ppm, [["M", side * (bodyHw - 0.25), bodyFront + 0.15], ["L", side * (bodyHw - 0.25), hl - 0.15]], vehicleLine())
  );

  const turntableY = hl - 1.0;
  const turntable = new fabric.Circle({
    left: 0,
    top: turntableY * ppm,
    radius: 0.7 * ppm,
    originX: "center",
    originY: "center",
    selectable: false,
    evented: false,
    ...vehicleBody(),
  });

  const ladderFront = -hl + 0.8;
  const ladderHw = 0.4;
  const ladderBed = vehicleRect(ppm, 0, (ladderFront + turntableY) / 2, ladderHw * 2, turntableY - ladderFront, {
    ...vehicleBody(),
    rx: 0,
    ry: 0,
  });
  const rungs = [];
  for (let y = ladderFront + 0.3; y < turntableY; y += 0.3) {
    rungs.push(vehiclePath(ppm, [["M", -ladderHw, y], ["L", ladderHw, y]], vehicleLine()));
  }

  return vehicleGroup([
    ...chassisRails(ppm, cabBack, bodyFront),
    ...wheelPair(ppm, cabHw, -2.95, 0.34, 1.05, 0.12),
    ...wheelPair(ppm, bodyHw, 2.4, 0.4, 1.05, 0.08),
    ...armMirrors(ppm, cabHw, -3.65),
    ...cabOverCab(ppm, cabHw, -hl, cabBack),
    ...lightBar(ppm, -hl + 0.68, 2.0),
    equipmentBody,
    ...lockers,
    turntable,
    ladderBed,
    ...rungs,
  ]);
}

// Motorcycle (Μοτοσικλέτα), ~2.1 x 0.8 m across the handlebars.
function createMotorcycle(ppm) {
  const frontTire = vehicleRect(ppm, 0, -0.72, 0.12, 0.62, vehicleSolid());
  const rearTire = vehicleRect(ppm, 0, 0.72, 0.18, 0.64, vehicleSolid());
  // Tank flowing into the seat and tail.
  const body = vehiclePath(
    ppm,
    [
      ["M", 0, -0.55],
      ["Q", 0.2, -0.5, 0.18, -0.15],
      ["Q", 0.15, 0.05, 0.14, 0.15],
      ["L", 0.14, 0.75],
      ["Q", 0.12, 0.9, 0, 0.92],
      ["Q", -0.12, 0.9, -0.14, 0.75],
      ["L", -0.14, 0.15],
      ["Q", -0.15, 0.05, -0.18, -0.15],
      ["Q", -0.2, -0.5, 0, -0.55],
      ["Z"],
    ],
    vehicleBody()
  );
  const seatLine = vehiclePath(ppm, [["M", -0.14, 0.1], ["Q", 0, 0.05, 0.14, 0.1]], vehicleLine());
  const handlebar = vehiclePath(ppm, [["M", -0.32, -0.46], ["Q", 0, -0.62, 0.32, -0.46]], { ...vehicleLine(), strokeWidth: 3 });
  const grips = [-1, 1].map((side) => vehicleRect(ppm, side * 0.36, -0.44, 0.1, 0.06, vehicleSolid()));
  const mirrors = [-1, 1].map(
    (side) =>
      new fabric.Circle({
        left: side * 0.24 * ppm,
        top: -0.6 * ppm,
        radius: 0.045 * ppm,
        originX: "center",
        originY: "center",
        selectable: false,
        evented: false,
        ...vehicleSolid(),
      })
  );
  const headlight = vehiclePath(ppm, [["M", -0.08, -0.58], ["Q", 0, -0.66, 0.08, -0.58]], { ...vehicleLine(), strokeWidth: 2 });

  return vehicleGroup([frontTire, rearTire, body, seatLine, handlebar, ...grips, ...mirrors, headlight]);
}

// Bicycle (Ποδήλατο), ~1.75 x 0.6 m across the handlebars.
function createBicycle(ppm) {
  const wheels = [-0.52, 0.52].map((y) => vehicleRect(ppm, 0, y, 0.05, 0.66, vehicleSolid()));
  const frame = vehiclePath(ppm, [["M", 0, -0.48], ["L", 0, 0.45]], { ...vehicleLine(), strokeWidth: 2.5 });
  const handlebar = vehiclePath(ppm, [["M", -0.28, -0.36], ["Q", 0, -0.5, 0.28, -0.36]], { ...vehicleLine(), strokeWidth: 2 });
  const grips = [-1, 1].map((side) => vehicleRect(ppm, side * 0.28, -0.36, 0.07, 0.1, vehicleSolid()));
  const crank = vehiclePath(ppm, [["M", -0.18, 0.02], ["L", 0.18, 0.02]], { ...vehicleLine(), strokeWidth: 2 });
  const pedals = [-1, 1].map((side) => vehicleRect(ppm, side * 0.2, 0.02, 0.06, 0.12, vehicleSolid()));
  const saddle = vehiclePath(
    ppm,
    [
      ["M", 0, 0.14],
      ["Q", 0.05, 0.14, 0.04, 0.24],
      ["Q", 0.1, 0.36, 0, 0.38],
      ["Q", -0.1, 0.36, -0.04, 0.24],
      ["Q", -0.05, 0.14, 0, 0.14],
      ["Z"],
    ],
    vehicleBody()
  );

  return vehicleGroup([...wheels, frame, crank, ...pedals, handlebar, ...grips, saddle]);
}

// Electric scooter (Ηλεκτρικό πατίνι), ~1.15 m long, 0.5 m across the
// handlebar: narrow deck, small wheels, handlebar right over the front wheel.
function createScooter(ppm) {
  const wheels = [
    vehicleRect(ppm, 0, -0.45, 0.05, 0.22, vehicleSolid()),
    vehicleRect(ppm, 0, 0.46, 0.06, 0.22, vehicleSolid()),
  ];
  const deck = vehicleRect(ppm, 0, 0.04, 0.17, 0.74, { ...vehicleBody(), rx: 0.06 * ppm, ry: 0.06 * ppm });
  const gripTape = vehicleRect(ppm, 0, 0.06, 0.1, 0.56, { ...vehicleLine(), rx: 0.03 * ppm, ry: 0.03 * ppm });
  const neck = vehicleRect(ppm, 0, -0.38, 0.07, 0.12, { ...vehicleBody(), strokeWidth: 1.5, rx: 0, ry: 0 });
  const rearFender = vehiclePath(ppm, [["M", -0.05, 0.4], ["Q", 0, 0.62, 0.05, 0.4]], { ...vehicleLine(), strokeWidth: 1.5 });
  const handlebar = vehiclePath(ppm, [["M", -0.24, -0.4], ["L", 0.24, -0.4]], { ...vehicleLine(), strokeWidth: 3 });
  const grips = [-1, 1].map((side) => vehicleRect(ppm, side * 0.23, -0.4, 0.09, 0.05, vehicleSolid()));
  const display = vehicleRect(ppm, 0, -0.4, 0.08, 0.06, { ...vehicleBody(), strokeWidth: 1.5, rx: 0.01 * ppm, ry: 0.01 * ppm });

  return vehicleGroup([...wheels, rearFender, deck, gripTape, neck, handlebar, ...grips, display]);
}

// ── Fallen two-wheelers ──────────────────────────────────────────
// Seen from above, a bike lying on its side shows its side profile. Parts
// are laid out in profile coordinates (u forward, v up from the ground, in
// meters) and turned so the front points up (-y) like the other vehicles,
// with the top of the bike to the left.
const sideSegs = (segs) =>
  segs.map(([cmd, ...nums]) => {
    const out = [cmd];
    for (let i = 0; i < nums.length; i += 2) out.push(-nums[i + 1], -nums[i]);
    return out;
  });

function sideLine(ppm, u1, v1, u2, v2, strokeWidth) {
  return vehiclePath(ppm, sideSegs([["M", u1, v1], ["L", u2, v2]]), { ...vehicleLine(), strokeWidth, strokeLineCap: "round" });
}

function sideCircle(ppm, u, v, r, style) {
  return new fabric.Circle({
    left: -v * ppm,
    top: -u * ppm,
    radius: r * ppm,
    originX: "center",
    originY: "center",
    selectable: false,
    evented: false,
    ...style,
  });
}

// Fallen bicycle (Πεσμένο ποδήλατο), ~1.75 m long.
function createFallenBicycle(ppm) {
  const wheelR = 0.34;
  const rearHub = [-0.525, wheelR];
  const frontHub = [0.525, wheelR];
  const bb = [-0.05, 0.3]; // bottom bracket
  const seatTop = [-0.2, 0.85];
  const headTop = [0.38, 0.85];
  const headBottom = [0.42, 0.7];
  const bar = [0.33, 1.0];

  const wheels = [rearHub, frontHub].flatMap(([u, v]) => [
    sideCircle(ppm, u, v, wheelR, { fill: "", stroke: LINE_COLOR, strokeWidth: 2.5 }),
    sideCircle(ppm, u, v, wheelR - 0.04, { fill: "", stroke: LINE_COLOR, strokeWidth: 0.75 }),
    sideCircle(ppm, u, v, 0.03, vehicleSolid()),
  ]);
  const tube = (a, b) => sideLine(ppm, a[0], a[1], b[0], b[1], 2.5);
  const frame = [
    tube(rearHub, bb),
    tube(rearHub, seatTop),
    tube(bb, seatTop),
    tube(seatTop, headTop),
    tube(bb, headBottom),
    tube(headTop, headBottom),
    tube(headBottom, frontHub),
    tube(headTop, bar),
  ];
  const handlebar = sideLine(ppm, bar[0] - 0.1, bar[1] + 0.02, bar[0] + 0.02, bar[1], 3);
  const chainring = sideCircle(ppm, bb[0], bb[1], 0.1, { ...vehicleBody(), strokeWidth: 1.5 });
  const crank = sideLine(ppm, bb[0] + 0.12, bb[1] - 0.14, bb[0] - 0.12, bb[1] + 0.14, 2.5);
  const saddle = vehiclePath(
    ppm,
    sideSegs([
      ["M", seatTop[0] - 0.14, seatTop[1] + 0.07],
      ["Q", seatTop[0], seatTop[1] + 0.1, seatTop[0] + 0.12, seatTop[1] + 0.05],
      ["L", seatTop[0] - 0.12, seatTop[1] + 0.03],
      ["Z"],
    ]),
    vehicleSolid()
  );

  return vehicleGroup([...wheels, ...frame, chainring, crank, handlebar, saddle]);
}

// Fallen motorcycle (Πεσμένη μοτοσικλέτα), ~2.1 m long.
function createFallenMotorcycle(ppm) {
  const wheelR = 0.32;
  const rearHub = [-0.7, wheelR];
  const frontHub = [0.7, wheelR];

  const wheels = [rearHub, frontHub].flatMap(([u, v]) => [
    sideCircle(ppm, u, v, wheelR, vehicleSolid()),
    sideCircle(ppm, u, v, wheelR - 0.1, vehicleBody()),
    sideCircle(ppm, u, v, 0.05, vehicleSolid()),
  ]);
  const swingarm = sideLine(ppm, rearHub[0], rearHub[1], -0.2, 0.38, 4);
  const fork = sideLine(ppm, frontHub[0], frontHub[1], 0.46, 0.92, 4);
  const exhaust = sideLine(ppm, 0.15, 0.2, -0.78, 0.42, 5);
  const engine = vehiclePath(
    ppm,
    sideSegs([
      ["M", 0.32, 0.58],
      ["L", 0.32, 0.3],
      ["Q", 0.3, 0.2, 0.18, 0.2],
      ["L", -0.18, 0.22],
      ["Q", -0.28, 0.24, -0.28, 0.34],
      ["L", -0.26, 0.6],
      ["Z"],
    ]),
    vehicleBody()
  );
  // Tank, seat and tail as one outline.
  const body = vehiclePath(
    ppm,
    sideSegs([
      ["M", 0.46, 0.66],
      ["L", 0.42, 0.86],
      ["Q", 0.15, 0.95, -0.08, 0.84],
      ["L", -0.6, 0.84],
      ["L", -0.9, 0.92],
      ["L", -0.88, 0.8],
      ["L", -0.55, 0.62],
      ["L", 0.3, 0.6],
      ["Z"],
    ]),
    vehicleBody()
  );
  const seatLine = vehiclePath(ppm, sideSegs([["M", -0.08, 0.84], ["L", -0.12, 0.76]]), vehicleLine());
  const frontFender = vehiclePath(
    ppm,
    sideSegs([["M", frontHub[0] - 0.3, frontHub[1] + 0.2], ["Q", frontHub[0], frontHub[1] + 0.48, frontHub[0] + 0.32, frontHub[1] + 0.14]]),
    { ...vehicleLine(), strokeWidth: 3 }
  );
  const headlight = sideCircle(ppm, 0.56, 0.84, 0.07, { ...vehicleBody(), strokeWidth: 1.5 });
  const handlebar = sideLine(ppm, 0.44, 0.96, 0.3, 1.04, 3);

  // Swingarm, fork and exhaust go under the wheels so the tires cover
  // where they'd cross the rims.
  return vehicleGroup([swingarm, fork, exhaust, ...wheels, engine, frontFender, body, seatLine, headlight, handlebar]);
}

// Fallen electric scooter (Πεσμένο ηλεκτρικό πατίνι): side profile, deck
// low to the ground and the tall stem lying out to the side.
function createFallenScooter(ppm) {
  const wheelR = 0.1;
  const wheels = [-0.45, 0.45].flatMap((u) => [
    sideCircle(ppm, u, wheelR, wheelR, vehicleSolid()),
    sideCircle(ppm, u, wheelR, 0.04, vehicleBody()),
  ]);
  const deck = vehiclePath(
    ppm,
    sideSegs([
      ["M", -0.36, 0.09],
      ["L", 0.3, 0.09],
      ["L", 0.3, 0.15],
      ["L", -0.36, 0.15],
      ["Z"],
    ]),
    { ...vehicleBody(), strokeWidth: 1.5 }
  );
  const neck = sideLine(ppm, 0.28, 0.12, 0.42, 0.24, 3);
  const fork = sideLine(ppm, 0.45, wheelR, 0.42, 0.26, 3);
  const stem = sideLine(ppm, 0.42, 0.24, 0.33, 1.1, 4);
  const handlebar = sideLine(ppm, 0.26, 1.12, 0.38, 1.1, 3);
  const rearFender = vehiclePath(
    ppm,
    sideSegs([["M", -0.58, 0.1], ["Q", -0.58, 0.175, -0.515, 0.213], ["Q", -0.45, 0.25, -0.385, 0.213]]),
    { ...vehicleLine(), strokeWidth: 2 }
  );

  return vehicleGroup([fork, ...wheels, rearFender, deck, neck, stem, handlebar]);
}

// Farm tractor (Τρακτέρ), ~3.8 x 2.05 m: narrow hood, small front
// wheels, big treaded rear wheels wider than the cab.
function createTractor(ppm) {
  const treadedTire = (x, y, wM, lM, step) => {
    const parts = [vehicleRect(ppm, x, y, wM, lM, { ...vehicleBody(), rx: 0.08 * ppm, ry: 0.08 * ppm })];
    for (let ty = y - lM / 2 + step; ty < y + lM / 2 - step / 2; ty += step) {
      parts.push(vehiclePath(ppm, [["M", x - wM / 2, ty], ["L", x + wM / 2, ty]], vehicleLine()));
    }
    return parts;
  };

  const frontAxle = vehiclePath(ppm, [["M", -0.62, -1.3], ["L", 0.62, -1.3]], { ...vehicleLine(), strokeWidth: 3 });
  const frontTires = [-1, 1].flatMap((side) => treadedTire(side * 0.65, -1.3, 0.28, 0.85, 0.17));
  const rearTires = [-1, 1].flatMap((side) => treadedTire(side * 0.8, 0.75, 0.46, 1.5, 0.19));

  const hood = vehicleRect(ppm, 0, -1.0, 0.7, 1.9, { ...vehicleBody(), rx: 0.12 * ppm, ry: 0.12 * ppm });
  const grille = [-1.75, -1.65, -1.55].map((y) => vehiclePath(ppm, [["M", -0.2, y], ["L", 0.2, y]], vehicleLine()));
  const cab = vehicleRect(ppm, 0, 0.75, 1.2, 1.4, { ...vehicleBody(), rx: 0.1 * ppm, ry: 0.1 * ppm });
  const cabRoof = vehicleRect(ppm, 0, 0.75, 0.96, 1.16, { ...vehicleLine(), rx: 0.08 * ppm, ry: 0.08 * ppm });
  const exhaust = new fabric.Circle({
    left: 0.22 * ppm,
    top: -0.25 * ppm,
    radius: 0.06 * ppm,
    originX: "center",
    originY: "center",
    selectable: false,
    evented: false,
    ...vehicleSolid(),
  });
  const hitch = vehicleRect(ppm, 0, 1.6, 0.3, 0.16, { ...vehicleSolid(), rx: 0, ry: 0 });

  return vehicleGroup([frontAxle, ...frontTires, ...rearTires, hitch, hood, ...grille, cab, cabRoof, exhaust]);
}

// Pedestrian (Πεζός), seen from above: shoulders, head, and feet stepping
// out in front so the walking direction shows.
function createPedestrian(ppm) {
  const foot = (x, y) =>
    new fabric.Ellipse({
      left: x * ppm,
      top: y * ppm,
      rx: 0.05 * ppm,
      ry: 0.09 * ppm,
      originX: "center",
      originY: "center",
      selectable: false,
      evented: false,
      ...vehicleSolid(),
    });
  const shoulders = new fabric.Ellipse({
    left: 0,
    top: 0,
    rx: 0.25 * ppm,
    ry: 0.13 * ppm,
    originX: "center",
    originY: "center",
    selectable: false,
    evented: false,
    ...vehicleBody(),
  });
  const head = new fabric.Circle({
    left: 0,
    top: -0.01 * ppm,
    radius: 0.1 * ppm,
    originX: "center",
    originY: "center",
    selectable: false,
    evented: false,
    ...vehicleBody(),
  });

  return vehicleGroup([foot(-0.08, -0.15), foot(0.08, -0.07), shoulders, head]);
}

// ── Fallen people ────────────────────────────────────────────────
// Articulated "dolls" lying on the ground, seen from above: a person thrown
// from a car or off a bike. One adult skeleton (~1.75 m) posed by joint
// angles; every part is an outlined capsule, like a jointed mannequin.
// Angles are absolute, in degrees: 0 points along the body toward the feet,
// 90 to the figure's right (+x), -90 to its left, ±180 up past the head.
// Each limb is [upper, lower] (upper arm + forearm, thigh + shin).
const HUMAN_BODY = {
  shoulderHw: 0.19,
  hipHw: 0.1,
  torsoLen: 0.52,
  upperArm: 0.3,
  foreArm: 0.26,
  thigh: 0.45,
  shin: 0.43,
};

const HUMAN_POSES = {
  // Ανάσκελα: flat on the back, arms by the sides.
  humansupine: { lArm: [-20, -10], rArm: [20, 10], lLeg: [-4, -2], rLeg: [4, 2] },
  // Απλωμένος: sprawled, limbs flung out — thrown from a vehicle.
  humansprawled: { lArm: [-105, -150], rArm: [55, 20], lLeg: [-25, -8], rLeg: [14, 40] },
  // Χέρια πάνω από το κεφάλι.
  humanarmsup: { lArm: [-160, -172], rArm: [150, 164], lLeg: [-6, -4], rLeg: [10, 18] },
  // Στο πλάι: both knees drawn up to one side, arms reaching the same way.
  humanside: { lArm: [30, 120], rArm: [70, 140], lLeg: [45, -10], rLeg: [65, 5] },
  // Κουλουριασμένος: curled up, knees toward the chest.
  humancurled: { lArm: [60, 150], rArm: [95, 155], lLeg: [100, 10], rLeg: [118, 25] },
  // Λυγισμένο πόδι: one leg twisted under, one arm bent up.
  humantwisted: { lArm: [-45, -20], rArm: [80, 170], lLeg: [-5, -3], rLeg: [50, -35] },
};

function humanJoints(pose) {
  const b = HUMAN_BODY;
  const limb = (root, [a1, a2], l1, l2) => {
    const mid = humanStep(root, a1, l1);
    return { root, mid, end: humanStep(mid, a2, l2), endAngle: a2 };
  };
  return {
    lArm: limb({ x: -b.shoulderHw, y: 0 }, pose.lArm, b.upperArm, b.foreArm),
    rArm: limb({ x: b.shoulderHw, y: 0 }, pose.rArm, b.upperArm, b.foreArm),
    lLeg: limb({ x: -b.hipHw, y: b.torsoLen }, pose.lLeg, b.thigh, b.shin),
    rLeg: limb({ x: b.hipHw, y: b.torsoLen }, pose.rLeg, b.thigh, b.shin),
  };
}

// Point `len` meters from p in the direction `deg` (see HUMAN_POSES).
function humanStep(p, deg, len) {
  const a = (deg * Math.PI) / 180;
  return { x: p.x + Math.sin(a) * len, y: p.y + Math.cos(a) * len };
}

const humanPart = () => ({ ...vehicleBody(), strokeWidth: 1.5 });

// A rounded bar from p1 to p2 (meters), `w` meters thick.
function capsule(ppm, p1, p2, w) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return new fabric.Rect({
    left: ((p1.x + p2.x) / 2) * ppm,
    top: ((p1.y + p2.y) / 2) * ppm,
    width: (Math.hypot(dx, dy) + w) * ppm,
    height: w * ppm,
    rx: (w / 2) * ppm,
    ry: (w / 2) * ppm,
    angle: (Math.atan2(dy, dx) * 180) / Math.PI,
    originX: "center",
    originY: "center",
    selectable: false,
    evented: false,
    ...humanPart(),
  });
}

function createHuman(ppm, pose) {
  const j = humanJoints(pose);

  const legs = [j.lLeg, j.rLeg].flatMap((leg) => [
    capsule(ppm, leg.mid, leg.end, 0.12),
    capsule(ppm, leg.end, humanStep(leg.end, leg.endAngle, 0.1), 0.09), // foot
    capsule(ppm, leg.root, leg.mid, 0.16),
  ]);
  const arms = [j.lArm, j.rArm].flatMap((arm) => {
    const hand = humanStep(arm.end, arm.endAngle, 0.04);
    return [
      capsule(ppm, arm.mid, arm.end, 0.085),
      capsule(ppm, arm.root, arm.mid, 0.1),
      new fabric.Circle({
        left: hand.x * ppm,
        top: hand.y * ppm,
        radius: 0.05 * ppm,
        originX: "center",
        originY: "center",
        selectable: false,
        evented: false,
        ...humanPart(),
      }),
    ];
  });
  const neck = capsule(ppm, { x: 0, y: 0 }, { x: 0, y: -0.1 }, 0.1);
  const torso = vehiclePath(
    ppm,
    [
      ["M", -0.2, -0.03],
      ["Q", 0, -0.08, 0.2, -0.03],
      ["Q", 0.25, 0, 0.23, 0.1],
      ["L", 0.17, 0.45],
      ["Q", 0.18, 0.6, 0, 0.6],
      ["Q", -0.18, 0.6, -0.17, 0.45],
      ["L", -0.23, 0.1],
      ["Q", -0.25, 0, -0.2, -0.03],
      ["Z"],
    ],
    humanPart()
  );
  const head = new fabric.Ellipse({
    left: 0,
    top: -0.2 * ppm,
    rx: 0.1 * ppm,
    ry: 0.12 * ppm,
    originX: "center",
    originY: "center",
    selectable: false,
    evented: false,
    ...humanPart(),
  });

  return vehicleGroup([...legs, ...arms, neck, torso, head]);
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

// ── Roadside objects (Εμπόδια) ───────────────────────────────────
// Things a vehicle can hit, top-down at real size like the vehicles.
// Solid structure is hatched like the generic obstacles and islands.
const objPart = (extra = {}) => ({ selectable: false, evented: false, ...extra });
const objBody = () => objPart({ fill: SHAPE_FILL, stroke: LINE_COLOR, strokeWidth: 2 });
const objLine = (strokeWidth = 1) => objPart({ fill: "", stroke: LINE_COLOR, strokeWidth });

function objCircle(ppm, x, y, rM, style) {
  return new fabric.Circle({ left: x * ppm, top: y * ppm, radius: rM * ppm, originX: "center", originY: "center", ...style });
}

function objGroup(parts) {
  return new fabric.Group(parts, { originX: "center", originY: "center", subTargetCheck: false });
}

// Hatched round cross-section (pole, trunk, bollard) at 0,0.
function hatchedDisc(ppm, rM, spacingM) {
  return [objCircle(ppm, 0, 0, rM, objBody()), ...hatchGroupEllipse(rM * ppm, rM * ppm, spacingM * ppm)];
}

// Scalloped "cloud" outline: `bumps` arcs around a circle of radius rM,
// radii jittered by `wobble` (seeded) so it doesn't look stamped; `depth`
// is how far each arc bulges (control-point radius, as a fraction of rM).
function scallopPath(rM, bumps, seed, wobble = 0.08, depth = 1.22) {
  const rand = seededRandom(seed);
  const pts = Array.from({ length: bumps }, (_, i) => {
    const a = ((i + (rand() - 0.5) * 0.3) / bumps) * Math.PI * 2;
    const r = rM * (0.86 + (rand() - 0.5) * wobble);
    return { a, r };
  });
  const xy = ({ a, r }) => [Math.cos(a) * r, Math.sin(a) * r];
  let d = `M ${xy(pts[0]).join(" ")}`;
  for (let i = 0; i < bumps; i++) {
    const p = pts[i];
    const q = pts[(i + 1) % bumps];
    let mid = (p.a + q.a) / 2;
    if (q.a < p.a) mid += Math.PI; // wraparound segment
    const cr = rM * depth;
    d += ` Q ${Math.cos(mid) * cr} ${Math.sin(mid) * cr} ${xy(q).join(" ")}`;
  }
  return d + " Z";
}

// Path in meters → pixels (numbers only; no arc commands).
function scaledPath(ppm, d, style) {
  return new fabric.Path(d.replace(/-?\d+(\.\d+)?(e-?\d+)?/g, (n) => String(parseFloat(n) * ppm)), style);
}

// Tree trunk cross-section with growth rings — the part a car hits.
function trunkParts(ppm, rM) {
  return [
    objCircle(ppm, 0, 0, rM, objBody()),
    objCircle(ppm, 0.02, -0.01, rM * 0.62, objLine()),
    objCircle(ppm, 0.03, -0.02, rM * 0.28, objLine()),
  ];
}

// Tree (Δέντρο): canopy outline (~5 m across, unfilled so the road
// underneath stays visible) with a few faint foliage strokes, trunk at the
// center.
function createTree(ppm) {
  const foliage = [
    "M -1.5 -0.6 Q -1.2 -1.1 -0.7 -1.2",
    "M 0.5 -1.4 Q 1.1 -1.3 1.4 -0.8",
    "M 1.5 0.4 Q 1.4 1.0 0.9 1.3",
    "M -0.4 1.5 Q -1.0 1.4 -1.3 1.0",
    "M -0.9 0.2 Q -0.9 0.6 -0.6 0.8",
    "M 0.6 -0.5 Q 0.9 -0.3 0.9 0.1",
  ].map((d) => scaledPath(ppm, d, objPart({ fill: "", stroke: LINE_COLOR, strokeWidth: 1, opacity: 0.5 })));
  return objGroup([scaledPath(ppm, scallopPath(2.5, 17, 3, 0.1, 1.1), objLine(1.5)), ...foliage, ...trunkParts(ppm, 0.3)]);
}

// Trunk only (Κορμός δέντρου), for pinpointing an impact without the canopy.
function createTreeTrunk(ppm) {
  return objGroup(trunkParts(ppm, 0.35));
}

// Bush / shrub (Θάμνος), ~1.6 m, filled — it hides what's behind it.
function createBush(ppm) {
  const twig = (d) => scaledPath(ppm, d, objPart({ fill: "", stroke: LINE_COLOR, strokeWidth: 1, opacity: 0.6 }));
  return objGroup([
    scaledPath(ppm, scallopPath(0.8, 8, 12, 0.12), objBody()),
    twig("M -0.35 -0.1 Q -0.2 -0.3 0 -0.25"),
    twig("M 0.1 0.25 Q 0.3 0.2 0.35 0"),
    twig("M -0.25 0.3 Q -0.3 0.15 -0.15 0.1"),
  ]);
}

// Utility pole (Στύλος ΔΕΗ): hatched pole with its crossarm and three
// insulators.
function createUtilityPole(ppm) {
  return objGroup([
    vehicleRect(ppm, 0, 0, 1.8, 0.1, { ...objBody(), strokeWidth: 1.5, rx: 0, ry: 0 }),
    ...[-0.75, 0.75].map((x) => objCircle(ppm, x, 0, 0.06, objPart({ fill: LINE_COLOR, stroke: LINE_COLOR, strokeWidth: 1 }))),
    ...hatchedDisc(ppm, 0.15, 0.07),
  ]);
}

// Street light (Φωτιστικός στύλος): pole with an arm reaching out over
// the road (up, -y) and the lamp head at its end.
function createStreetLight(ppm) {
  return objGroup([
    scaledPath(ppm, "M 0 0 L 0 -1.55", objLine(3)),
    vehicleRect(ppm, 0, -1.75, 0.22, 0.5, { ...objBody(), strokeWidth: 1.5, rx: 0.08 * ppm, ry: 0.08 * ppm }),
    vehicleRect(ppm, 0, -1.77, 0.12, 0.34, { ...vehicleGlass(), rx: 0.05 * ppm, ry: 0.05 * ppm }),
    ...hatchedDisc(ppm, 0.13, 0.07),
  ]);
}

// Bollard (Κολωνάκι): short post, ~0.2 m.
function createBollard(ppm) {
  return objGroup([objCircle(ppm, 0, 0, 0.1, objBody()), objCircle(ppm, 0, 0, 0.04, objPart({ fill: LINE_COLOR, stroke: LINE_COLOR, strokeWidth: 0.5 }))]);
}

// Fire hydrant (Πυροσβεστικός κρουνός): barrel with two side outlets.
function createHydrant(ppm) {
  return objGroup([
    vehicleRect(ppm, 0, 0, 0.44, 0.1, { ...objBody(), strokeWidth: 1.5, rx: 0.02 * ppm, ry: 0.02 * ppm }),
    vehicleRect(ppm, 0, -0.14, 0.12, 0.1, { ...objBody(), strokeWidth: 1.5, rx: 0.02 * ppm, ry: 0.02 * ppm }),
    objCircle(ppm, 0, 0, 0.15, objBody()),
    objCircle(ppm, 0, 0, 0.05, objPart({ fill: LINE_COLOR, stroke: LINE_COLOR, strokeWidth: 0.5 })),
  ]);
}

// Traffic cone (Κώνος): square base, cone rings, tip.
function createCone(ppm) {
  return objGroup([
    vehicleRect(ppm, 0, 0, 0.36, 0.36, { ...objBody(), strokeWidth: 1.5, rx: 0.05 * ppm, ry: 0.05 * ppm }),
    objCircle(ppm, 0, 0, 0.14, objPart({ fill: SHAPE_FILL, stroke: LINE_COLOR, strokeWidth: 1.5 })),
    objCircle(ppm, 0, 0, 0.09, objPart({ fill: "", stroke: LINE_COLOR, strokeWidth: 3 })),
    objCircle(ppm, 0, 0, 0.03, objPart({ fill: LINE_COLOR, stroke: LINE_COLOR, strokeWidth: 0.5 })),
  ]);
}

// Wheelie bin (Κάδος απορριμμάτων), 1100 L: ~1.37 x 1.07 m. Lid with its
// hinge at the back (+y), handle bar at the front.
function createBin(ppm) {
  return objGroup([
    vehicleRect(ppm, 0, -0.58, 0.8, 0.08, { ...vehicleSolid(), rx: 0.03 * ppm, ry: 0.03 * ppm }),
    vehicleRect(ppm, 0, 0, 1.37, 1.07, { ...objBody(), rx: 0.08 * ppm, ry: 0.08 * ppm }),
    vehicleRect(ppm, 0, -0.03, 1.2, 0.86, { ...objLine(), rx: 0.06 * ppm, ry: 0.06 * ppm }),
    scaledPath(ppm, "M -0.6 0.44 L 0.6 0.44", objLine(1.5)),
    ...[-0.35, 0.35].map((x) => vehicleRect(ppm, x, 0.44, 0.14, 0.06, { ...vehicleSolid(), rx: 0, ry: 0 })),
  ]);
}

// ── Linear objects, sized by the segment-length slider ──
// Run along y, like road pieces.

// Wall (Τοίχος): 0.3 m thick, hatched.
function createWall(ppm, lengthM = 10) {
  const w = 0.3 * ppm;
  const h = lengthM * ppm;
  const pts = [
    { x: -w / 2, y: -h / 2 },
    { x: w / 2, y: -h / 2 },
    { x: w / 2, y: h / 2 },
    { x: -w / 2, y: h / 2 },
  ];
  return objGroup([
    new fabric.Rect({ width: w, height: h, originX: "center", originY: "center", ...objBody() }),
    ...hatchGroup(pts, 0.2 * ppm),
  ]);
}

// Fence (Φράχτης): a line with posts every 2.5 m and the map symbol's
// crosses between them.
function createFence(ppm, lengthM = 10) {
  const L = lengthM;
  const spacing = 2.5;
  const n = Math.max(1, Math.round(L / spacing));
  const step = L / n;
  const parts = [scaledPath(ppm, `M 0 ${L / 2} L 0 ${-L / 2}`, objLine(1.5))];
  for (let i = 0; i <= n; i++) {
    parts.push(vehicleRect(ppm, 0, L / 2 - i * step, 0.1, 0.1, { ...vehicleSolid(), rx: 0, ry: 0 }));
    if (i < n) {
      const y = L / 2 - (i + 0.5) * step;
      const c = Math.min(0.12, step / 6);
      parts.push(scaledPath(ppm, `M ${-c} ${y - c} L ${c} ${y + c} M ${c} ${y - c} L ${-c} ${y + c}`, objLine(1.5)));
    }
  }
  return objGroup(parts);
}

// Guardrail (Μπαριέρα / στηθαίο): W-beam rail with posts behind it every
// 2 m (on the +x side, away from traffic) and flared ends.
function createGuardrail(ppm, lengthM = 12) {
  const L = lengthM;
  const n = Math.max(1, Math.round(L / 2));
  const step = L / n;
  const flare = Math.min(0.5, L / 6);
  const parts = [];
  for (let i = 0; i <= n; i++) {
    const y = L / 2 - i * step;
    parts.push(vehicleRect(ppm, 0.2, y, 0.15, 0.15, { ...objBody(), strokeWidth: 1.5, rx: 0, ry: 0 }));
    parts.push(scaledPath(ppm, `M 0.06 ${y} L 0.13 ${y}`, objLine(2)));
  }
  const beam = `M 0.12 ${L / 2} Q 0 ${L / 2} 0 ${L / 2 - flare} L 0 ${-L / 2 + flare} Q 0 ${-L / 2} 0.12 ${-L / 2}`;
  parts.push(scaledPath(ppm, beam, objLine(2.5)));
  parts.push(
    scaledPath(
      ppm,
      `M 0.06 ${L / 2 - flare * 0.4} L 0.06 ${-L / 2 + flare * 0.4}`,
      objPart({ fill: "", stroke: LINE_COLOR, strokeWidth: 1, opacity: 0.6 })
    )
  );
  return objGroup(parts);
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
  van: createVan,
  bus: createBus,
  semitruck: createSemiTruck,
  motorcycle: createMotorcycle,
  bicycle: createBicycle,
  fallenmotorcycle: createFallenMotorcycle,
  fallenbicycle: createFallenBicycle,
  scooter: createScooter,
  fallenscooter: createFallenScooter,
  tractor: createTractor,
  policecar: createPoliceCar,
  ambulance: createAmbulance,
  firetruck: createFireTruck,
  pedestrian: createPedestrian,
  ...Object.fromEntries(Object.entries(HUMAN_POSES).map(([key, pose]) => [key, (ppm) => createHuman(ppm, pose)])),
  trafficlight: createTrafficLight,
  tree: createTree,
  treetrunk: createTreeTrunk,
  bush: createBush,
  utilitypole: createUtilityPole,
  streetlight: createStreetLight,
  bollard: createBollard,
  hydrant: createHydrant,
  cone: createCone,
  bin: createBin,
  wall: createWall,
  fence: createFence,
  guardrail: createGuardrail,
  skidmarks: createSkidMarks,
  skidmarkssideways: createSkidMarksSideways,
  scrapemarks: createScrapeMarks,
  liquidsmall: createLiquidSmall,
  liquidmedium: createLiquidMedium,
  liquidlarge: createLiquidLarge,
  debrissmall: createDebrisSmall,
  debrislarge: createDebrisLarge,
  pathstraight: createPathStraight,
  pathstraightdashed: createPathStraightDashed,
  pathturnleft: (ppm) => turnPathArrow(ppm, -1),
  pathturnright: (ppm) => turnPathArrow(ppm, 1),
  pathlaneleft: (ppm) => laneChangePathArrow(ppm, -1),
  pathlaneright: (ppm) => laneChangePathArrow(ppm, 1),
  pathuturn: createPathUTurn,
  pathspin: createPathSpin,
  text: () => createText(),
};

// Mirrored twins ("<key>mirror") of the lopsided shapes: the fallen
// two-wheelers lie with their top to one side and the human poses lean one
// way. Same drawing, flipped left-right. (The supine figure is symmetric, so
// it has none.)
const MIRRORED_SHAPES = [
  "fallenmotorcycle",
  "fallenbicycle",
  "fallenscooter",
  "humansprawled",
  "humanarmsup",
  "humanside",
  "humancurled",
  "humantwisted",
];
MIRRORED_SHAPES.forEach((key) => {
  const factory = SHAPE_FACTORIES[key];
  SHAPE_FACTORIES[`${key}mirror`] = (ppm, lengthM) => factory(ppm, lengthM).set({ flipX: true });
});

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
