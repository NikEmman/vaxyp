const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

function cString(buf, start, length) {
  const bytes = buf.subarray(start, start + length);
  const end = bytes.indexOf(0);
  return bytes.toString("utf8", 0, end === -1 ? bytes.length : end);
}

// Pax records look like "<byte length> <key>=<value>\n".
function paxPath(data) {
  let i = 0;
  let found = null;
  while (i < data.length) {
    const space = data.indexOf(0x20, i);
    if (space === -1) break;
    const length = parseInt(data.toString("utf8", i, space), 10);
    if (!length) break;
    const record = data.toString("utf8", space + 1, i + length - 1);
    if (record.startsWith("path=")) found = record.slice(5);
    i += length;
  }
  return found;
}

// Extracts a GitHub source tarball (.tar.gz) into destDir, dropping the
// "<owner>-<repo>-<sha>/" folder GitHub wraps everything in.
function extractTarball(gzBuffer, destDir) {
  const buf = zlib.gunzipSync(gzBuffer);
  const root = path.resolve(destDir);
  let offset = 0;
  let nextName = null;

  while (offset + 512 <= buf.length) {
    const header = buf.subarray(offset, offset + 512);
    if (header.every((b) => b === 0)) break;

    const size = parseInt(cString(header, 124, 12).trim() || "0", 8);
    const type = String.fromCharCode(header[156] || 0x30);
    const prefix = cString(header, 345, 155);
    let name = cString(header, 0, 100);
    if (prefix) name = prefix + "/" + name;

    const data = buf.subarray(offset + 512, offset + 512 + size);
    offset += 512 + Math.ceil(size / 512) * 512;

    if (type === "x") {
      nextName = paxPath(data) ?? nextName;
      continue;
    }
    if (type === "L") {
      nextName = cString(data, 0, data.length);
      continue;
    }
    if (nextName) {
      name = nextName;
      nextName = null;
    }
    if (type !== "0" && type !== "5") continue;

    const relative = name.split("/").slice(1).join("/");
    if (!relative) continue;
    const target = path.resolve(root, relative);
    if (!target.startsWith(root + path.sep)) continue;

    if (type === "5") {
      fs.mkdirSync(target, { recursive: true });
    } else {
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, data);
    }
  }
}

// Top-level files/folders the build ships, taken from package.json "build.files".
function shippedEntries(dir) {
  const pkg = JSON.parse(fs.readFileSync(path.join(dir, "package.json"), "utf8"));
  const entries = new Set(["package.json"]);
  for (const pattern of pkg.build?.files ?? []) entries.add(pattern.split("/")[0]);
  return [...entries].filter((entry) => fs.existsSync(path.join(dir, entry)));
}

// Replaces each entry in targetDir with the one from sourceDir. The old
// entries are backed up first and restored if anything fails midway.
function replaceEntries(sourceDir, targetDir, entries, backupDir) {
  const probe = path.join(targetDir, ".update-probe");
  fs.writeFileSync(probe, "");
  fs.rmSync(probe);

  fs.rmSync(backupDir, { recursive: true, force: true });
  fs.mkdirSync(backupDir, { recursive: true });
  const existing = entries.filter((entry) => fs.existsSync(path.join(targetDir, entry)));
  for (const entry of existing) {
    fs.cpSync(path.join(targetDir, entry), path.join(backupDir, entry), { recursive: true });
  }

  try {
    for (const entry of entries) {
      fs.rmSync(path.join(targetDir, entry), { recursive: true, force: true });
      fs.cpSync(path.join(sourceDir, entry), path.join(targetDir, entry), { recursive: true });
    }
  } catch (err) {
    for (const entry of entries) {
      fs.rmSync(path.join(targetDir, entry), { recursive: true, force: true });
      if (existing.includes(entry)) {
        fs.cpSync(path.join(backupDir, entry), path.join(targetDir, entry), { recursive: true });
      }
    }
    throw err;
  }

  fs.rmSync(backupDir, { recursive: true, force: true });
}

module.exports = { extractTarball, shippedEntries, replaceEntries };
