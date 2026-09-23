/* PDF → Word (.docx) for the "PDF σε Word" tool.
   Every page is reduced to positioned text (from pdf.js, or from Tesseract
   for scanned pages), lines and paragraphs are rebuilt from the geometry,
   and a minimal WordprocessingML package is written with JSZip.

   A text item, whatever its source:
   { str, x, y (baseline, from the top), w, size, font, bold, italic, word }
   All measurements are in PDF points. */
(function () {
  // ── Fonts ─────────────────────────────────────────────────────────
  const KNOWN_FONTS = {
    arial: "Arial",
    arialnarrow: "Arial Narrow",
    helvetica: "Arial",
    timesnewroman: "Times New Roman",
    times: "Times New Roman",
    couriernew: "Courier New",
    courier: "Courier New",
    calibri: "Calibri",
    cambria: "Cambria",
    tahoma: "Tahoma",
    verdana: "Verdana",
    georgia: "Georgia",
    garamond: "Garamond",
    segoeui: "Segoe UI",
    trebuchetms: "Trebuchet MS",
    bookantiqua: "Book Antiqua",
    palatinolinotype: "Palatino Linotype",
    centurygothic: "Century Gothic",
    consolas: "Consolas",
    // LibreOffice's metric-compatible stand-ins
    liberationsans: "Arial",
    liberationserif: "Times New Roman",
    liberationmono: "Courier New",
    serif: "Times New Roman",
    "sans-serif": "Arial",
    monospace: "Courier New",
  };

  /** "ABCDEF+TimesNewRomanPS-BoldMT" → "Times New Roman". */
  function wordFontName(raw) {
    if (!raw) return null;
    const base = String(raw)
      .replace(/^[A-Z]{6}\+/, "")
      .split(/[-,]/)[0]
      .replace(/(PSMT|PS|MT)$/, "")
      .trim();
    const known = KNOWN_FONTS[base.toLowerCase().replace(/\s+/g, "")];
    if (known) return known;
    // Generator-internal names ("g_d0_f1", "F3") are no use to Word
    if (!/^[A-Za-z][A-Za-z ]{2,}$/.test(base)) return null;
    return base.replace(/([a-z])([A-Z])/g, "$1 $2");
  }

  // ── Reading a text page (pdf.js) ──────────────────────────────────
  /**
   * The page rotation (0/90/180/270) that makes most of the text horizontal.
   * Usually the page's own /Rotate, but a page turned sideways in a viewer
   * would otherwise have all its text dropped as "rotated".
   */
  function textRotation(page, items) {
    const weight = new Map();
    for (const it of items) {
      if (!it.str || !it.str.trim()) continue;
      const [a, b] = it.transform;
      const deg = Math.round((Math.atan2(b, a) * 180) / Math.PI / 90) * 90;
      const rot = ((deg % 360) + 360) % 360;
      weight.set(rot, (weight.get(rot) || 0) + it.str.length);
    }
    let best = page.rotate;
    for (const [rot, w] of weight)
      if (w > (weight.get(best) || 0)) best = rot;
    return best;
  }

  /** `content` is the page's getTextContent(), if the caller already has it. */
  async function readPdfPage(page, content) {
    content = content || (await page.getTextContent());
    const vp = page.getViewport({
      scale: 1,
      rotation: textRotation(page, content.items),
    });
    // Font objects, with their real names and bold/italic flags, only reach
    // the main thread once the page's operator list has been built.
    await page.getOperatorList();

    const fonts = new Map();
    const fontOf = (fontName) => {
      if (fonts.has(fontName)) return fonts.get(fontName);
      let obj = null;
      try {
        if (page.commonObjs.has(fontName)) obj = page.commonObjs.get(fontName);
      } catch {
        /* not loaded — fall back to the style's generic family */
      }
      const raw = (obj && obj.name) || "";
      const info = {
        font:
          wordFontName(raw) ||
          wordFontName(content.styles[fontName]?.fontFamily),
        bold:
          !!(obj && (obj.bold || obj.black)) ||
          /bold|black|heavy|semibold|demi/i.test(raw),
        italic: !!(obj && obj.italic) || /italic|oblique/i.test(raw),
      };
      fonts.set(fontName, info);
      return info;
    };

    const items = [];
    for (const it of content.items) {
      if (!it.str || !it.str.trim()) continue;
      const t = pdfjsLib.Util.transform(vp.transform, it.transform);
      const size = Math.hypot(t[2], t[3]);
      // Rotated or vertical text (stamps, margin notes) would scramble lines
      if (size < 1 || Math.abs(t[1]) > size * 0.05) continue;
      items.push({
        str: it.str,
        x: t[4],
        y: t[5],
        w: it.width,
        size,
        ...fontOf(it.fontName),
      });
    }
    return { width: vp.width, height: vp.height, items };
  }

  // ── Reading a scanned page (Tesseract) ────────────────────────────
  function ocrLines(data) {
    if (Array.isArray(data.lines)) return data.lines;
    return (data.blocks || []).flatMap((b) =>
      (b.paragraphs || []).flatMap((p) => p.lines || []),
    );
  }

  /**
   * The Greek model often returns look-alikes: the micro sign for μ, and
   * polytonic breathings and accents where modern text has a plain tonos.
   */
  const monotonic = (s) =>
    s
      .replace(/\u00B5/g, "\u03BC")
      .normalize("NFD")
      .replace(/[\u0313\u0314\u0345]/g, "")
      .replace(/[\u0300\u0342]/g, "\u0301")
      .normalize("NFC");

  const median = (values) => {
    const v = values.slice().sort((a, b) => a - b);
    return v[Math.floor(v.length / 2)];
  };

  /** `scale` is the render scale the page was recognised at. */
  function readOcrResult(data, scale) {
    const items = [];
    for (const line of ocrLines(data)) {
      const words = (line.words || []).filter(
        (w) => w.text && w.text.trim() && w.confidence >= 25,
      );
      if (!words.length) continue;
      const bl = line.baseline;
      const base =
        bl && bl.has_baseline !== false ? (bl.y0 + bl.y1) / 2 : line.bbox.y1;
      // Tesseract's own size estimate holds up better than the line box,
      // whose baseline sometimes sits at the bottom of the descenders
      const reported = words.map((w) => w.font_size).filter((n) => n > 0);
      const size = Math.max(
        4,
        reported.length
          ? median(reported) / scale
          : (base - line.bbox.y0) / 0.72 / scale, // cap height ≈ 0.72 em
      );
      for (const w of words)
        items.push({
          str: monotonic(w.text.trim()),
          x: w.bbox.x0 / scale,
          y: base / scale,
          w: (w.bbox.x1 - w.bbox.x0) / scale,
          size,
          font: null,
          bold: false,
          italic: false,
          word: true,
        });
    }
    // Per-line estimates wobble; pull the body text onto a single size
    const body = median(items.map((i) => i.size));
    for (const it of items) {
      if (Math.abs(it.size - body) < body * 0.25) it.size = body;
      it.size = Math.round(it.size * 2) / 2;
    }
    return items;
  }

  // ── Lines ─────────────────────────────────────────────────────────
  const halfPts = (size) => Math.max(2, Math.round(size * 2));
  const sameFormat = (a, b) =>
    a.font === b.font &&
    a.sz === b.sz &&
    a.bold === b.bold &&
    a.italic === b.italic;

  function appendRun(runs, text, fmt) {
    const last = runs[runs.length - 1];
    if (last && sameFormat(last, fmt)) last.text += text;
    else runs.push({ ...fmt, text });
  }

  function buildLines(items) {
    const sorted = items.slice().sort((a, b) => a.y - b.y || a.x - b.x);
    const rows = [];
    for (const it of sorted) {
      const row = rows[rows.length - 1];
      if (row && it.y - row.y <= Math.max(row.size, it.size) * 0.4) {
        row.items.push(it);
        row.size = Math.max(row.size, it.size);
      } else rows.push({ y: it.y, size: it.size, items: [it] });
    }
    return rows.map(finishLine).filter((l) => l.text.trim());
  }

  function finishLine(row) {
    const items = row.items.sort((a, b) => a.x - b.x);
    const segments = [];
    const weight = new Map(); // half-point size → characters, for the dominant size
    let seg = null;
    let prev = null;
    let end = -Infinity;

    for (const it of items) {
      // Text painted twice with a small offset is a fake-bold trick
      if (prev && it.str === prev.str && Math.abs(it.x - prev.x) < it.size * 0.3)
        continue;
      const fmt = {
        font: it.font,
        sz: halfPts(it.size),
        bold: it.bold,
        italic: it.italic,
      };
      const gap = it.x - end;
      if (!seg || gap > it.size * (it.word ? 2.5 : 1.5)) {
        seg = { x: it.x, runs: [] };
        segments.push(seg);
      } else if (it.word || gap > it.size * 0.15) {
        const last = seg.runs[seg.runs.length - 1];
        if (!/\s$/.test(last.text) && !/^\s/.test(it.str)) last.text += " ";
      }
      appendRun(seg.runs, it.str, fmt);
      weight.set(fmt.sz, (weight.get(fmt.sz) || 0) + it.str.length);
      end = Math.max(end, it.x + it.w);
      prev = it;
    }

    for (const s of segments) {
      s.runs[0].text = s.runs[0].text.trimStart();
      const last = s.runs[s.runs.length - 1];
      last.text = last.text.trimEnd();
      s.runs = s.runs.filter((r) => r.text);
    }

    const sz = [...weight].sort((a, b) => b[1] - a[1])[0][0];
    const main = items.find((i) => halfPts(i.size) === sz) || items[0];
    const text = segments.map((s) => s.runs.map((r) => r.text).join("")).join(" ");
    const x0 = items[0].x;
    return {
      y: main.y,
      size: sz / 2,
      x0,
      x1: end,
      segments: segments.filter((s) => s.runs.length),
      text,
      charW: (end - x0) / Math.max(1, text.length),
    };
  }

  /**
   * Where the text body ends on the right: the edge most lines stop at
   * (justified or wrapped text), so one line running into the margin
   * doesn't move it. Falls back to the furthest line end.
   */
  function rightEdge(lines) {
    const ends = lines.map((l) => l.x1).sort((a, b) => a - b);
    const max = ends[ends.length - 1];
    // slide a 3 pt window over the sorted ends; keep the rightmost busiest one
    let best = 0;
    let at = ends.length - 1;
    for (let i = 0, j = 0; i < ends.length; i++) {
      while (ends[i] - ends[j] > 3) j++;
      if (i - j + 1 >= best) {
        best = i - j + 1;
        at = i;
      }
    }
    return best >= 3 && ends[at] > max * 0.6 ? ends[at] : max;
  }

  // ── Paragraphs ────────────────────────────────────────────────────
  /** Whether `line` continues the paragraph `para` (a wrapped line). */
  function continues(para, line, pageRight) {
    const prev = para.lines[para.lines.length - 1];
    const size = prev.size;
    if (prev.segments.length > 1 || line.segments.length > 1) return false;
    if (Math.abs(line.size - size) > size * 0.15) return false;

    const gap = line.y - prev.y;
    if (gap < size * 0.6 || gap > size * 2) return false;
    if (para.lines.length > 1) {
      const pitch = para.lines[1].y - para.lines[0].y;
      if (Math.abs(gap - pitch) > size * 0.25) return false;
      if (Math.abs(line.x0 - para.lines[1].x0) > size * 0.6) return false;
    } else {
      // allow a first-line indent, or a hanging one for numbered items
      const indent = prev.x0 - line.x0;
      if (indent > size * 8 || indent < -size * 4) return false;
    }

    // A line that stopped short of the edge ended its paragraph, unless the
    // next line's first word could not have fitted there.
    const firstWord = line.text.trimStart().split(/\s+/)[0] || "";
    return pageRight - prev.x1 <= (firstWord.length + 1) * line.charW;
  }

  function joinLineRuns(runs, line) {
    const next = line.segments[0].runs;
    const last = runs[runs.length - 1];
    if (/\p{L}-$/u.test(last.text) && /^\p{Ll}/u.test(next[0].text))
      last.text = last.text.slice(0, -1); // re-join a hyphenated word
    else if (last.text.endsWith("­")) last.text = last.text.slice(0, -1);
    else last.text += " ";
    for (const r of next) appendRun(runs, r.text, r);
  }

  /** Turns one page's lines into paragraph blocks, within the section geometry. */
  function layoutPage(lines, geo) {
    if (!lines.length) return [];
    const pageRight = rightEdge(lines);
    const bodyL = geo.mL;
    const bodyR = geo.width - geo.mR;
    const bodyCenter = (bodyL + bodyR) / 2;

    const paras = [];
    for (const line of lines) {
      const cur = paras[paras.length - 1];
      if (cur && continues(cur, line, pageRight)) cur.lines.push(line);
      else paras.push({ lines: [line] });
    }

    const blocks = [];
    let prevY = null;
    for (const para of paras) {
      const [first] = para.lines;
      const size = first.size;
      const multi = para.lines.length > 1;
      const pitch = multi
        ? (para.lines[para.lines.length - 1].y - first.y) / (para.lines.length - 1)
        : 0;
      const lineH = Math.max(size * 1.15, pitch);
      const block = {
        kind: "text",
        align: "left",
        indLeft: 0,
        indRight: 0,
        firstLine: 0,
        tabs: [],
        line: multi ? pitch : 0,
        before:
          prevY === null
            ? first.y - geo.mT - size * 0.9
            : first.y - prevY - lineH,
        content: [],
      };
      block.before = Math.min(Math.max(0, block.before), 400);

      if (first.segments.length > 1) {
        // Columns of text on one line (e.g. "Αθήνα ... Ημερομηνία") → tab stops
        block.indLeft = first.segments[0].x - bodyL;
        first.segments.forEach((s, i) => {
          if (i) {
            block.tabs.push(s.x - bodyL);
            block.content.push({ tab: true });
          }
          s.runs.forEach((r) => block.content.push({ ...r }));
        });
      } else {
        const runs = first.segments[0].runs.map((r) => ({ ...r }));
        para.lines.slice(1).forEach((l) => joinLineRuns(runs, l));
        block.content = runs;

        const center = (first.x0 + first.x1) / 2;
        const bodyX = multi ? para.lines[1].x0 : first.x0;
        if (
          !multi &&
          first.x0 - bodyL > size * 2 &&
          Math.abs(center - bodyCenter) < size * 1.5
        ) {
          block.align = "center";
        } else if (
          !multi &&
          first.x0 - bodyL > size * 6 &&
          Math.abs(first.x1 - bodyR) < size * 1.5
        ) {
          block.align = "right";
        } else {
          block.indLeft = bodyX - bodyL;
          block.firstLine = first.x0 - bodyX;
          if (multi) {
            // keep the wrap width of this page when it is narrower than the section's
            block.indRight = Math.max(0, bodyR - pageRight);
            const full = para.lines
              .slice(0, -1)
              .every((l) => pageRight - l.x1 < size * 0.6);
            if (full) block.align = "both";
          }
        }
      }
      blocks.push(block);
      prevY = para.lines[para.lines.length - 1].y;
    }
    return blocks;
  }

  // ── Sections (runs of same-sized pages) ───────────────────────────
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

  function sectionGeometry(pages) {
    const { width, height } = pages[0];
    const tops = [];
    const bottoms = [];
    let minX = Infinity;
    const all = [];
    for (const p of pages) {
      if (p.kind !== "text" || !p.lines.length) continue;
      const f = p.lines[0];
      const l = p.lines[p.lines.length - 1];
      tops.push(f.y - f.size);
      bottoms.push(height - (l.y + l.size * 0.3));
      for (const line of p.lines) {
        minX = Math.min(minX, line.x0);
        all.push(line);
      }
    }
    if (!tops.length)
      return { width, height, mL: 18, mR: 18, mT: 18, mB: 18 }; // images only
    return {
      width,
      height,
      mL: clamp(minX, 18, 108),
      mR: clamp(width - rightEdge(all), 18, 108),
      mT: clamp(Math.min(...tops), 18, 108),
      // Every page ends in a page break, so the bottom margin is only room for
      // Word's metrics running a little longer than the PDF's; half the
      // original keeps a full page from spilling a line or two onto the next.
      mB: clamp(Math.min(...bottoms) / 2, 18, 36),
    };
  }

  // ── WordprocessingML ──────────────────────────────────────────────
  const NS_W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";
  const NS_R =
    "http://schemas.openxmlformats.org/officeDocument/2006/relationships";
  const EMU = 12700; // per point
  const tw = (pt) => Math.round(pt * 20);

  const xmlText = (s) =>
    String(s)
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F￾￿]/g, "")
      // unpaired surrogates (broken ToUnicode maps) are invalid in XML
      .replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g, "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  function runXml(r, defaults) {
    if (r.tab) return "<w:r><w:tab/></w:r>";
    const rpr = [];
    if (r.font && r.font !== defaults.font) {
      const f = xmlText(r.font);
      rpr.push(
        `<w:rFonts w:ascii="${f}" w:hAnsi="${f}" w:cs="${f}" w:eastAsia="${f}"/>`,
      );
    }
    if (r.bold) rpr.push("<w:b/><w:bCs/>");
    if (r.italic) rpr.push("<w:i/><w:iCs/>");
    if (r.sz !== defaults.sz)
      rpr.push(`<w:sz w:val="${r.sz}"/><w:szCs w:val="${r.sz}"/>`);
    return (
      "<w:r>" +
      (rpr.length ? `<w:rPr>${rpr.join("")}</w:rPr>` : "") +
      `<w:t xml:space="preserve">${xmlText(r.text)}</w:t></w:r>`
    );
  }

  function sectPrXml(geo) {
    const w = Math.min(tw(geo.width), 31680);
    const h = Math.min(tw(geo.height), 31680);
    return (
      "<w:sectPr>" +
      `<w:pgSz w:w="${w}" w:h="${h}"${w > h ? ' w:orient="landscape"' : ""}/>` +
      `<w:pgMar w:top="${tw(geo.mT)}" w:right="${tw(geo.mR)}" w:bottom="${tw(geo.mB)}" w:left="${tw(geo.mL)}" w:header="283" w:footer="283" w:gutter="0"/>` +
      "</w:sectPr>"
    );
  }

  function imageRunXml(b) {
    const cx = Math.round(b.w * EMU);
    const cy = Math.round(b.h * EMU);
    return (
      '<w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0">' +
      `<wp:extent cx="${cx}" cy="${cy}"/>` +
      `<wp:docPr id="${b.id}" name="Σελίδα ${b.page}"/>` +
      '<a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">' +
      '<a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">' +
      '<pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">' +
      `<pic:nvPicPr><pic:cNvPr id="${b.id}" name="page${b.page}.jpg"/><pic:cNvPicPr/></pic:nvPicPr>` +
      `<pic:blipFill><a:blip r:embed="${b.rid}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill>` +
      `<pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm>` +
      '<a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr>' +
      "</pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r>"
    );
  }

  function paragraphXml(b, defaults, sectPr) {
    const ppr = [];
    if (b.pageBreakBefore) ppr.push("<w:pageBreakBefore/>");
    if (b.tabs && b.tabs.length)
      ppr.push(
        "<w:tabs>" +
          b.tabs.map((t) => `<w:tab w:val="left" w:pos="${tw(t)}"/>`).join("") +
          "</w:tabs>",
      );
    ppr.push(
      `<w:spacing w:before="${tw(b.before || 0)}" w:after="0"` +
        (b.line ? ` w:line="${tw(b.line)}" w:lineRule="atLeast"` : "") +
        "/>",
    );
    if (b.indLeft || b.indRight || b.firstLine) {
      const first =
        b.firstLine >= 0
          ? `w:firstLine="${tw(b.firstLine)}"`
          : `w:hanging="${tw(-b.firstLine)}"`;
      ppr.push(
        `<w:ind w:left="${tw(b.indLeft)}" w:right="${tw(b.indRight)}" ${first}/>`,
      );
    }
    if (b.align && b.align !== "left") ppr.push(`<w:jc w:val="${b.align}"/>`);
    if (sectPr) ppr.push(sectPr);

    const body =
      b.kind === "image"
        ? imageRunXml(b)
        : (b.content || []).map((r) => runXml(r, defaults)).join("");
    return `<w:p><w:pPr>${ppr.join("")}</w:pPr>${body}</w:p>`;
  }

  /** The font and size most of the text is set in, weighted by characters. */
  function dominantFormat(pages) {
    const fonts = new Map();
    const sizes = new Map();
    for (const p of pages)
      if (p.kind === "text")
        for (const l of p.lines)
          for (const s of l.segments)
            for (const r of s.runs) {
              if (r.font) fonts.set(r.font, (fonts.get(r.font) || 0) + r.text.length);
              sizes.set(r.sz, (sizes.get(r.sz) || 0) + r.text.length);
            }
    const top = (m, fallback) =>
      m.size ? [...m].sort((a, b) => b[1] - a[1])[0][0] : fallback;
    return { font: top(fonts, "Times New Roman"), sz: top(sizes, 24) };
  }

  function stylesXml(d) {
    const f = xmlText(d.font);
    return (
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      `<w:styles xmlns:w="${NS_W}"><w:docDefaults><w:rPrDefault><w:rPr>` +
      `<w:rFonts w:ascii="${f}" w:hAnsi="${f}" w:cs="${f}" w:eastAsia="${f}"/>` +
      `<w:sz w:val="${d.sz}"/><w:szCs w:val="${d.sz}"/>` +
      '<w:lang w:val="el-GR" w:eastAsia="el-GR" w:bidi="ar-SA"/>' +
      "</w:rPr></w:rPrDefault><w:pPrDefault><w:pPr>" +
      '<w:spacing w:after="0" w:line="240" w:lineRule="auto"/>' +
      "</w:pPr></w:pPrDefault></w:docDefaults>" +
      '<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style>' +
      "</w:styles>"
    );
  }

  const SETTINGS_XML =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    `<w:settings xmlns:w="${NS_W}"><w:compat>` +
    '<w:compatSetting w:name="compatibilityMode" w:uri="http://schemas.microsoft.com/office/word" w:val="15"/>' +
    "</w:compat></w:settings>";

  const CONTENT_TYPES_XML =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
    '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
    '<Default Extension="xml" ContentType="application/xml"/>' +
    '<Default Extension="jpg" ContentType="image/jpeg"/>' +
    '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>' +
    '<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>' +
    '<Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/>' +
    "</Types>";

  const ROOT_RELS_XML =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
    '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>' +
    "</Relationships>";

  /**
   * Builds the .docx from converted pages, in order:
   *   { kind: "text", width, height, items }
   *   { kind: "image", width, height, jpeg: Uint8Array }
   * Returns the file as a Uint8Array.
   */
  async function buildDocx(input) {
    const pages = input.map((p) =>
      p.kind === "text" ? { ...p, lines: buildLines(p.items) } : { ...p },
    );

    // consecutive pages of the same size and kind share a section (and its
    // margins); scanned pages as images get their own, near-borderless one
    const sections = [];
    for (const p of pages) {
      const s = sections[sections.length - 1];
      if (
        s &&
        s.pages[0].kind === p.kind &&
        Math.abs(s.pages[0].width - p.width) < 2 &&
        Math.abs(s.pages[0].height - p.height) < 2
      )
        s.pages.push(p);
      else sections.push({ pages: [p] });
    }

    const zip = new JSZip();
    const rels = [
      '<Relationship Id="rIdStyles" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>',
      '<Relationship Id="rIdSettings" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/>',
    ];
    const defaults = dominantFormat(pages);
    const body = [];
    let pageNo = 0;

    sections.forEach((section, si) => {
      const geo = sectionGeometry(section.pages);
      const blocks = [];
      section.pages.forEach((p, pi) => {
        pageNo++;
        let pageBlocks;
        if (p.kind === "image") {
          const n = pageNo;
          zip.file(`word/media/page${n}.jpg`, p.jpeg);
          rels.push(
            `<Relationship Id="rIdImg${n}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/page${n}.jpg"/>`,
          );
          // fit inside the margins, a little short so it never spills over
          const k = Math.min(
            (geo.width - geo.mL - geo.mR) / p.width,
            (geo.height - geo.mT - geo.mB - 4) / p.height,
          );
          pageBlocks = [
            {
              kind: "image",
              align: "center",
              rid: `rIdImg${n}`,
              id: n,
              page: n,
              w: p.width * k,
              h: p.height * k,
            },
          ];
        } else {
          pageBlocks = layoutPage(p.lines, geo);
          if (!pageBlocks.length) pageBlocks = [{ kind: "text", content: [] }];
        }
        // a section break already starts a new page
        if (pi > 0) pageBlocks[0].pageBreakBefore = true;
        blocks.push(...pageBlocks);
      });

      const last = si === sections.length - 1;
      blocks.forEach((b, bi) =>
        body.push(
          paragraphXml(
            b,
            defaults,
            !last && bi === blocks.length - 1 ? sectPrXml(geo) : "",
          ),
        ),
      );
      if (last) body.push(sectPrXml(geo));
    });

    zip.file("[Content_Types].xml", CONTENT_TYPES_XML);
    zip.file("_rels/.rels", ROOT_RELS_XML);
    zip.file(
      "word/_rels/document.xml.rels",
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
        rels.join("") +
        "</Relationships>",
    );
    zip.file(
      "word/document.xml",
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        `<w:document xmlns:w="${NS_W}" xmlns:r="${NS_R}" ` +
        'xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing">' +
        `<w:body>${body.join("")}</w:body></w:document>`,
    );
    zip.file("word/styles.xml", stylesXml(defaults));
    zip.file("word/settings.xml", SETTINGS_XML);

    return zip.generateAsync({ type: "uint8array", compression: "DEFLATE" });
  }

  window.PdfToWord = { readPdfPage, readOcrResult, buildDocx };
})();
